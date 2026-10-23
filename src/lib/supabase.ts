import { createClient } from '@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL;
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase=url&&key?createClient(url,key,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true,flowType:'pkce'}}):null;
export const authConfigured=Boolean(supabase);
export function requiredSupabase(){if(!supabase)throw new Error('Authentication is unavailable. Configure the Supabase connection on Vercel.');return supabase;}
