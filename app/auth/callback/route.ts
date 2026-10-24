import {NextResponse} from 'next/server';
import {serverSupabase} from '../../../lib/supabase/server';
import {authOrigin,emailCallbackStatus} from '../../../lib/auth-links.mjs';
export async function GET(request:Request){
 const url=new URL(request.url),code=url.searchParams.get('code');
 const origin=authOrigin(url.origin,process.env.PUBLIC_APP_URL,process.env.NODE_ENV==='development');
 let status='expired';
 if(code){const client=await serverSupabase();const {data,error}=await client.auth.exchangeCodeForSession(code);status=emailCallbackStatus(error,!!data.session,url.searchParams.get('next')==='reset');}
 return NextResponse.redirect(new URL('/?auth='+status,origin));
}
