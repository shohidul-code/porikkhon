import {verifyNotification} from '../../../../lib/billing';
export async function POST(request:Request){let ok=false;try{ok=await verifyNotification(request);}catch{}return Response.redirect(new URL('/?view=plans&payment='+(ok?'paid':'pending'),request.url),303);}
export async function GET(request:Request){return Response.redirect(new URL('/?view=plans&payment=pending',request.url),303);}
