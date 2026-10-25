import {createBrowserClient} from '@supabase/ssr';

const PROD_URL = 'https://porikkhon-two.vercel.app';
const SUPABASE_URL = 'https://jwuwwgkvjzbzqrezpyko.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3PHAW0VsYnJ1f8T4h1uiHw_aUMQh6gM';

const email = process.env.TEST_EMAIL;
const password = process.env.TEST_PASSWORD;

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
    throw Object.assign(new Error(data.error || JSON.stringify(data)), {status: res.status, code: data.code});
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
    throw Object.assign(new Error(data.error || JSON.stringify(data)), {status: res.status, code: data.code});
  }
  return data;
}

async function run() {
  console.log('1. Signing in...');
  const {error} = await supabase.auth.signInWithPassword({email, password});
  if (error) throw error;
  console.log('✓ Signed in.');

  console.log('2. Starting a starter test attempt...');
  const start1 = await apiPost({action: 'start', examId: 'admission-math'});
  console.log(`✓ Started attempt: ${start1.id}`);

  console.log('3. Trying to start another test while active...');
  const start2 = await apiPost({action: 'start', examId: 'admission-english'});
  console.log(`✓ Result: resumed=${start2.resumed}, id=${start2.id}`);
  if (start2.id !== start1.id || !start2.resumed) {
    throw new Error('Expected first attempt to be resumed on second start!');
  }

  console.log('4. Trying to call generate while active attempt exists...');
  const genWhileActive = await apiPost({
    action: 'generate',
    moduleId: 'admission-math',
    count: 3,
    difficulty: 'Standard',
    language: 'en'
  });
  console.log(`✓ Result from generate: resumed=${genWhileActive.resumed}, id=${genWhileActive.id}`);
  if (genWhileActive.id !== start1.id || !genWhileActive.resumed) {
    throw new Error('Expected active attempt to be resumed instead of generating new one!');
  }

  console.log('5. Submitting the active attempt to clean up...');
  const submitRes = await apiPost({action: 'submit', id: start1.id});
  console.log(`✓ Submitted attempt ${start1.id}. Score: ${submitRes.score}/${submitRes.total}`);

  console.log('6. Checking bootstrap state...');
  const boot = await apiGet('bootstrap');
  console.log(`✓ Active attempt is now: ${boot.activeAttempt ? boot.activeAttempt.id : 'null'}`);
  console.log(`✓ Daily generation quota usage: ${boot.generationUsage}/${boot.generationLimit}`);

  console.log('\n======================================================');
  console.log('ACTIVE ATTEMPT RESUME VERIFICATION PASSED SUCCESSFULLY!');
  console.log('======================================================');
}

run().catch(err => {
  console.error('❌ Resume verification failed:', err);
  process.exit(1);
});
