import {NextResponse} from 'next/server';
import type {EmailOtpType} from '@supabase/supabase-js';
import {serverSupabase} from '../../../lib/supabase/server';
export async function GET(request:Request){const url=new URL(request.url);const token_hash=url.searchParams.get('token_hash'),type=url.searchParams.get('type') as EmailOtpType|null;const target=new URL('/',url.origin);if(token_hash&&type&&['signup','email','recovery','email_change'].includes(type)){const client=await serverSupabase();const {error}=await client.auth.verifyOtp({token_hash,type});if(!error){if(type==='recovery')target.searchParams.set('auth','reset');else target.searchParams.set('auth','confirmed');return NextResponse.redirect(target);}}target.searchParams.set('auth','expired');return NextResponse.redirect(target);}
