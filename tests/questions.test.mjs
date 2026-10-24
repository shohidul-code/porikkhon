import test from 'node:test';import assert from 'node:assert/strict';
import {MODULES} from '../lib/catalog.ts';import {generationPrompt,validateGeneratedQuestions,resolveCorrectOptions} from '../lib/question-rules.mjs';
for(const module of MODULES)test('generation rules for '+module.id,()=>{const cfg={count:3,topic:module.topics[0],difficulty:'Standard',language:'en'};const prompt=generationPrompt(module,cfg);assert.ok(prompt.includes(module.rules));assert.ok(prompt.includes(module.course));assert.ok(prompt.includes(module.title));const questions=Array.from({length:3},(_,i)=>({stem:module.id==='bcs-bangla'?'নিচের কোন শব্দটি বিশেষ্য প্রশ্ন '+i:'A valid original question number '+i,options:module.id==='bcs-bangla'?['প্রথম','দ্বিতীয়','তৃতীয়','চতুর্থ']:['Choice A','Choice B','Choice C','Choice D'],answer:1,explanation:module.id==='bcs-bangla'?'সঠিক ব্যাখ্যা থেকে দ্বিতীয় উত্তরটি পাওয়া যায়।':'The reasoning leads to the second choice.',topic:module.topics[0],difficulty:'Standard'}));assert.equal(validateGeneratedQuestions(questions,module,cfg).length,3);assert.throws(()=>validateGeneratedQuestions([{...questions[0],topic:'unrelated topic'},...questions.slice(1)],module,cfg));assert.throws(()=>validateGeneratedQuestions([{...questions[0],options:['Same','Same','Other','Fourth']},...questions.slice(1)],module,cfg));assert.throws(()=>validateGeneratedQuestions([questions[0],questions[0],questions[2]],module,cfg));});


test('correct option text determines the answer even when a model supplied a conflicting index',()=>{
 const [question]=resolveCorrectOptions([{stem:'Sum of the first 20 terms with a=3 and d=4?',options:['820','840','860','880'],correctOption:'820',answer:1}]);
 assert.equal(question.answer,0);assert.equal(question.options[question.answer],'820');assert.ok(!('correctOption' in question));
});
test('a missing or ambiguous selected option cannot become a saved answer',()=>{
 for(const correctOption of [undefined,'A','820 ','900'])assert.throws(()=>resolveCorrectOptions([{options:['820','840','860','880'],correctOption}]));
 assert.throws(()=>resolveCorrectOptions([{options:['820','820','860','880'],correctOption:'820'}]));
});
test('Bengali and rearranged options retain their exact correct answer',()=>{
 const [question]=resolveCorrectOptions([{options:['ক্রিয়া','বিশেষ্য','বিশেষণ','সর্বনাম'],correctOption:'সর্বনাম'}]);
 assert.equal(question.answer,3);
});
