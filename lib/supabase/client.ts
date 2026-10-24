'use client';
import {createBrowserClient} from '@supabase/ssr';
export function browserSupabase(){return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{cookieOptions:{sameSite:'lax',secure:typeof window!=='undefined'?window.location.protocol==='https:':process.env.NODE_ENV==='production'}});}
