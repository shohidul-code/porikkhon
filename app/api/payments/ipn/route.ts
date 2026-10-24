import {verifyNotification} from '../../../../lib/billing';
export async function POST(request:Request){try{const ok=await verifyNotification(request);return Response.json({received:ok},{status:ok?200:503});}catch{return Response.json({received:false},{status:400});}}
