import 'server-only';
import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
export async function serverSupabase(){const jar=await cookies();return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{cookies:{getAll(){return jar.getAll();},setAll(items){try{for(const {name,value,options} of items)jar.set(name,value,{...options,sameSite:'lax',secure:process.env.NODE_ENV==='production'});}catch{/* Server components rely on Proxy to refresh cookies. */}}}});}
