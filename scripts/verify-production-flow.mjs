import {createBrowserClient} from '@supabase/ssr';
import fs from 'node:fs/promises';

const PROD_URL = 'https://porikkhon-two.vercel.app';
const SUPABASE_URL = 'https://jwuwwgkvjzbzqrezpyko.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3PHAW0VsYnJ1f8T4h1uiHw_aUMQh6gM';

const email = process.env.TEST_EMAIL;
const password = process.env.TEST_PASSWORD;

if (!email || !password) {
  console.error('TEST_EMAIL and TEST_PASSWORD environment variables required');
  process.exit(1);
}

const cookieStore = new Map();

const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_KEY, {
  cookies: {
    getAll() {
      return Array.from(cookieStore.entries()).map(([name, value]) => ({name, value}));
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({name, value}) => {
        cookieStore.set(name, value);
      });
    }
  }
});

function getCookieHeader() {
  return Array.from(cookieStore.entries())
    .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
    .join('; ');
}

async function apiPost(body) {
  const cookie = getCookieHeader();
  const res = await fetch(`${PROD_URL}/api/porikkhon`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': PROD_URL,
      'Cookie': cookie
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${data.error || JSON.stringify(data)}`);
  }
  return data;
}

async function apiGet(action, params = {}) {
  const cookie = getCookieHeader();
  const qs = new URLSearchParams({action, ...params}).toString();
  const res = await fetch(`${PROD_URL}/api/porikkhon?${qs}`, {
    headers: {
      'Cookie': cookie
    }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${data.error || JSON.stringify(data)}`);
  }
  return data;
}

async function run() {
  console.log('1. Signing in to Supabase Auth...');
  const {data: authData, error: authError} = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    throw new Error(`Sign in failed: ${authError.message}`);
  }

  console.log(`✓ Signed in successfully as: ${authData.user.email} (ID: ${authData.user.id})`);

  // Check MFA status
  const {data: aalData, error: aalError} = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aalError) throw aalError;
  console.log(`✓ Authenticator Assurance Level: current=${aalData.currentLevel}, next=${aalData.nextLevel}`);

  if (aalData.nextLevel === 'aal2' && aalData.currentLevel !== 'aal2') {
    throw new Error('AAL2 MFA required. User has Google Authenticator enrolled.');
  }

  console.log('\n2. Fetching bootstrap state for signed-in user from production...');
  let boot = await apiGet('bootstrap');
  console.log(`✓ Bootstrap profile: ${boot.profile?.name}, usage: ${boot.generationUsage}/${boot.generationLimit}`);
  console.log(`✓ Active attempt: ${boot.activeAttempt ? JSON.stringify(boot.activeAttempt) : 'None'}`);

  let activeAttemptId = boot.activeAttempt?.id;

  // Test active attempt resume behavior if one is already open, or submit it to start a fresh one
  if (activeAttemptId) {
    console.log('\n2b. Active attempt exists. Testing resume behavior...');
    const resumeRes = await apiPost({
      action: 'generate',
      moduleId: 'admission-math',
      count: 3,
      difficulty: 'Standard',
      language: 'en'
    });
    console.log(`✓ Resume check response: resumed=${resumeRes.resumed}, id=${resumeRes.id}`);
    if (resumeRes.id !== activeAttemptId || !resumeRes.resumed) {
      throw new Error('Active attempt was not resumed as expected!');
    }

    // Submit this active attempt so we can proceed with a fresh generation test
    console.log(`Submitting existing active attempt ${activeAttemptId} to clear slot...`);
    const existingAttempt = await apiGet('attempt', {id: activeAttemptId});
    if (existingAttempt.questions?.length) {
      await apiPost({
        action: 'answer',
        id: activeAttemptId,
        questionId: existingAttempt.questions[0].id,
        answer: 0
      });
    }
    await apiPost({action: 'submit', id: activeAttemptId});
    console.log('✓ Cleared previous active attempt.');
    boot = await apiGet('bootstrap');
  }

  console.log('\n3. Generating fresh questions for Admission Mathematics...');
  console.log('Requesting fresh quiz generation (moduleId: admission-math, count: 3, topic: Algebra)...');
  const genResult = await apiPost({
    action: 'generate',
    moduleId: 'admission-math',
    count: 3,
    topic: 'Algebra',
    difficulty: 'Standard',
    language: 'en'
  });

  console.log(`✓ Quiz generated successfully! Attempt ID: ${genResult.id}, Source: ${genResult.source}`);
  const attemptId = genResult.id;

  console.log('\n4. Confirming attempt persistence and hidden answer keys...');
  const attempt = await apiGet('attempt', {id: attemptId});
  console.log(`✓ Attempt title: "${attempt.title}", question count: ${attempt.questions?.length}`);
  console.log(`✓ Attempt deadline: ${new Date(attempt.deadline).toISOString()}`);
  
  // Verify answer security: answer keys and explanations must NOT be sent to learner during test!
  for (const [idx, q] of attempt.questions.entries()) {
    if ('answer' in q || 'explanation' in q) {
      throw new Error(`SECURITY DEFECT: Question ${idx + 1} leaked answer or explanation!`);
    }
  }
  console.log('✓ Security verified: Answer keys and explanations are completely hidden from active test questions.');

  console.log('\n5. Saving answers for questions...');
  for (let i = 0; i < attempt.questions.length; i++) {
    const q = attempt.questions[i];
    // Select option 0 for first question, option 1 for second, skip third
    const chosenAnswer = i === 2 ? null : i;
    if (chosenAnswer !== null) {
      console.log(`Answering Question ${i + 1} (${q.id}) with option index ${chosenAnswer}...`);
      await apiPost({
        action: 'answer',
        id: attemptId,
        questionId: q.id,
        answer: chosenAnswer
      });
    } else {
      console.log(`Leaving Question ${i + 1} (${q.id}) skipped.`);
    }
  }
  console.log('✓ Answers saved successfully.');

  console.log('\n6. Submitting test for server-side grading...');
  const submitResult = await apiPost({
    action: 'submit',
    id: attemptId,
    score: 999 // Send bogus client score to verify server recalculates from scratch
  });

  console.log(`✓ Submission complete! Score: ${submitResult.score}/${submitResult.total}`);
  console.log(`✓ Correct: ${submitResult.correct}, Wrong: ${submitResult.wrong}, Skipped: ${submitResult.skipped}, Accuracy: ${submitResult.accuracy}%`);
  console.log(`✓ Explanations unlocked: ${submitResult.review?.length} review items with explanations.`);
  if (submitResult.score === 999) {
    throw new Error('SECURITY DEFECT: Server trusted client score!');
  }

  console.log('\n7. Verifying activity graph, history and generation quota update in bootstrap...');
  const updatedBoot = await apiGet('bootstrap');
  const foundInHistory = updatedBoot.history.find(h => h.id === attemptId);
  if (!foundInHistory) {
    throw new Error('Attempt not found in user history!');
  }
  console.log(`✓ Found attempt in history: title="${foundInHistory.title}", score=${foundInHistory.score}/${foundInHistory.total}`);
  console.log(`✓ Updated generation quota: usage=${updatedBoot.generationUsage}/${updatedBoot.generationLimit}`);
  console.log(`✓ Activity days recorded: ${updatedBoot.activity.length} entries`);

  console.log('\n8. Downloading Word review document from production...');
  const cookie = getCookieHeader();
  const docxRes = await fetch(`${PROD_URL}/api/review?id=${encodeURIComponent(attemptId)}`, {
    headers: {Cookie: cookie}
  });

  if (!docxRes.ok) {
    const errText = await docxRes.text();
    throw new Error(`Word download failed (${docxRes.status}): ${errText}`);
  }

  const contentType = docxRes.headers.get('content-type');
  const contentDisp = docxRes.headers.get('content-disposition');
  console.log(`✓ Response headers: Content-Type="${contentType}", Content-Disposition="${contentDisp}"`);

  const docxBuffer = Buffer.from(await docxRes.arrayBuffer());
  const filePath = '.qa/production-test-review.docx';
  await fs.mkdir('.qa', {recursive: true});
  await fs.writeFile(filePath, docxBuffer);
  console.log(`✓ Word document saved to ${filePath} (${docxBuffer.length} bytes).`);

  // Verify file is a valid zip containing word/document.xml
  const zipHeader = docxBuffer.subarray(0, 4);
  if (zipHeader[0] !== 0x50 || zipHeader[1] !== 0x4b) {
    throw new Error('Downloaded file does not have PK ZIP header!');
  }
  console.log('✓ Verified DOCX ZIP magic header (PK).');

  console.log('\n======================================================');
  console.log('ALL SIGNED-IN PRODUCTION TEST STEPS PASSED SUCCESSFULLY!');
  console.log('======================================================');
}

run().catch(err => {
  console.error('\n❌ Production test failed:', err);
  process.exit(1);
});
