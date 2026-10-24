import {NextResponse} from 'next/server';
import type {EmailOtpType} from '@supabase/supabase-js';
import {serverSupabase} from '../../../lib/supabase/server';
import {authOrigin,emailCallbackStatus} from '../../../lib/auth-links.mjs';
export async function GET(request:Request){const url=new URL(request.url);const token_hash=url.searchParams.get('token_hash'),type=url.searchParams.get('type') as EmailOtpType|null;const target=new URL('/',authOrigin(url.origin,process.env.PUBLIC_APP_URL,process.env.NODE_ENV==='development'));if(token_hash&&type&&['signup','email','recovery','email_change'].includes(type)){const client=await serverSupabase();const {data,error}=await client.auth.verifyOtp({token_hash,type});target.searchParams.set('auth',emailCallbackStatus(error,!!data.session,type==='recovery'));return NextResponse.redirect(target);}target.searchParams.set('auth','expired');return NextResponse.redirect(target);}
