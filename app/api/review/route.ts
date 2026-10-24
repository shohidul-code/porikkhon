import {rpc,readJson,apiError,identity,failure} from '../../../lib/server';
import {QUESTIONS} from '../../../lib/questions';
import {grade} from '../../../lib/core.mjs';
import {reviewDocument} from '../../../lib/review-document';
export const runtime='nodejs';
function documentResponse(buffer:Buffer){return new Response(new Uint8Array(buffer),{headers:{'Content-Type':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','Content-Disposition':'attachment; filename="Porikkhon_Answer_Review.docx"','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}
export async function GET(request:Request){try{const id=new URL(request.url).searchParams.get('id');if(!id)throw failure('Choose a submitted test.');const {user}=await identity();const report=await rpc('report',{id});return documentResponse(await reviewDocument(report,user.email??'Learner'));}catch(e){return apiError(e);}}
export async function POST(request:Request){try{const data=await readJson(request);if(!Array.isArray(data.questionIds)||data.questionIds.length<1||data.questionIds.length>12||new Set(data.questionIds).size!==data.questionIds.length)throw failure('Invalid practice review.');const questions=data.questionIds.map((id:string)=>QUESTIONS.find(q=>q.id===id));if(questions.some((q:any)=>!q))throw failure('Question unavailable.');const report=grade(questions,data.answers??{},0);return documentResponse(await reviewDocument({...report,title:'Daily practice review',guest:true,penalty:0}));}catch(e){return apiError(e);}}
