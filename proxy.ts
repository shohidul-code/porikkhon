import {createServerClient} from '@supabase/ssr';
import {NextRequest,NextResponse} from 'next/server';
export async function proxy(request:NextRequest){
 const nonce=Buffer.from(crypto.randomUUID()).toString('base64'),dev=process.env.NODE_ENV==='development';
 const supabaseOrigin=new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).origin;
 const csp=`default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev?" 'unsafe-eval'":''}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' ${supabaseOrigin} ${supabaseOrigin.replace('https:','wss:')}${dev?' ws:':''}; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://chatgpt.com;${dev?'':' upgrade-insecure-requests;'}`;
 const requestHeaders=new Headers(request.headers);requestHeaders.set('x-nonce',nonce);requestHeaders.set('Content-Security-Policy',csp);
 let response=NextResponse.next({request:{headers:requestHeaders}});
 const client=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{cookies:{getAll:()=>request.cookies.getAll(),setAll:items=>{for(const {name,value} of items)request.cookies.set(name,value);response=NextResponse.next({request:{headers:requestHeaders}});for(const {name,value,options} of items)response.cookies.set(name,value,{...options,sameSite:'lax',secure:!dev});}}});
 await client.auth.getClaims();
 response.headers.set('Content-Security-Policy',csp);response.headers.set('Cache-Control','private, no-store');response.headers.set('Referrer-Policy','strict-origin-when-cross-origin');response.headers.set('X-Content-Type-Options','nosniff');response.headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');if(!dev)response.headers.set('Strict-Transport-Security','max-age=31536000');return response;
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.svg|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']};
