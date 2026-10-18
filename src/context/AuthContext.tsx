import {createContext,useCallback,useContext,useEffect,useState,type ReactNode} from 'react';
import type {User} from '@supabase/supabase-js';
import {requiredSupabase,supabase} from '../lib/supabase';
export type CustomerProfile={full_name:string;phone:string;whatsapp_opt_in:boolean};
type Register={fullName:string;email:string;phone:string;password:string;whatsappOptIn:boolean};
type AuthState={
 signedIn:boolean;loading:boolean;user:User|null;profile:CustomerProfile|null;
 signUp:(input:Register)=>Promise<boolean>;signIn:(email:string,password:string)=>Promise<void>;
 signOut:()=>Promise<void>;sendPasswordReset:(email:string)=>Promise<void>;
 updateProfile:(profile:CustomerProfile)=>Promise<void>;
};
const AuthContext=createContext<AuthState|null>(null);
function profileFromUser(user:User):CustomerProfile{
 return {full_name:String(user.user_metadata?.full_name||''),phone:String(user.user_metadata?.phone||''),whatsapp_opt_in: Boolean(user.user_metadata?.whatsapp_opt_in)};
}
export function AuthProvider({children}:{children:ReactNode}){
 const [loading,setLoading]=useState(true),[user,setUser]=useState<User|null>(null),[profile,setProfile]=useState<CustomerProfile|null>(null);
 const loadProfile=useCallback(async(u:User)=>{
  const base=profileFromUser(u);
  if(!supabase)return;
  const {data,error}=await supabase.from('gcs_customer_profiles').select('full_name,phone,whatsapp_opt_in').eq('user_id',u.id).maybeSingle();
  if(data){setProfile(data as CustomerProfile);return;}
  // New email-confirmed accounts have profile info in their private auth user metadata.
  if(!error&&base.full_name&&base.phone){
   const {error:saveError}=await supabase.from('gcs_customer_profiles').upsert({user_id:u.id,...base});
   if(!saveError)setProfile(base);else setProfile(base);
  }else setProfile(base);
 },[]);
 useEffect(()=>{
  if(!supabase){setLoading(false);return;}
  let live=true;
  supabase.auth.getSession().then(({data:{session}})=>{
   if(!live)return;
   setUser(session?.user||null);
   if(session?.user)void loadProfile(session.user);else setProfile(null);
   setLoading(false);
  }).catch(()=>{if(live)setLoading(false);});
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
   if(!live)return;
   const u=session?.user||null;setUser(u);
   if(!u)setProfile(null);
   else window.setTimeout(()=>{if(live)void loadProfile(u);},0);
  });
  return ()=>{live=false;subscription.unsubscribe();};
 },[loadProfile]);
 const signUp=async(input:Register)=>{
  const client=requiredSupabase();
  const {data,error}=await client.auth.signUp({
   email:input.email.trim().toLowerCase(),password:input.password,
   options:{emailRedirectTo:window.location.origin+window.location.pathname+'#/home',
    data:{full_name:input.fullName.trim(),phone:input.phone,whatsapp_opt_in:input.whatsappOptIn}}
  });
  if(error)throw error;
  if(data.session?.user){setUser(data.session.user);await loadProfile(data.session.user);}
  return Boolean(data.session);
 };
 const signIn=async(email:string,password:string)=>{
  const {data,error}=await requiredSupabase().auth.signInWithPassword({email:email.trim().toLowerCase(),password});
  if(error)throw error;
  setUser(data.user);void loadProfile(data.user);
 };
 const signOut=async()=>{const {error}=await requiredSupabase().auth.signOut();if(error)throw error;setUser(null);setProfile(null);};
 const sendPasswordReset=async(email:string)=>{
  const {error}=await requiredSupabase().auth.resetPasswordForEmail(email.trim().toLowerCase(),{redirectTo:window.location.origin+window.location.pathname+'#/reset-password'});
  if(error)throw error;
 };
 const updateProfile=async(next:CustomerProfile)=>{
  const client=requiredSupabase();if(!user)throw new Error('Please sign in to continue.');
  const {error}=await client.from('gcs_customer_profiles').upsert({user_id:user.id,...next,updated_at:new Date().toISOString()});
  if(error)throw error;
  setProfile(next);
 };
 return <AuthContext.Provider value={{signedIn:!!user,loading,user,profile,signUp,signIn,signOut,sendPasswordReset,updateProfile}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const ctx=useContext(AuthContext);if(!ctx)throw new Error('useAuth must be used inside AuthProvider');return ctx;}
