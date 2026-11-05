import {createContext,useContext,useState,type ReactNode} from 'react';
import type {User} from '@supabase/supabase-js';

export type CustomerProfile={full_name:string;phone:string;whatsapp_opt_in:boolean};
export type DemoProvider='google'|'apple';
type Register={fullName:string;email:string;phone:string;password:string;whatsappOptIn:boolean};
type AuthState={
 signedIn:boolean;loading:boolean;user:User|null;profile:CustomerProfile|null;
 signUp:(input:Register)=>Promise<boolean>;signIn:(name:string,phone:string)=>Promise<void>;
 signInDemo:(provider:DemoProvider)=>Promise<void>;
 signOut:()=>Promise<void>;sendPasswordReset:(email:string)=>Promise<void>;
 updateProfile:(profile:CustomerProfile)=>Promise<void>;
};
const LEGACY_KEY='gcs-demo-display-name-v1';
const PROFILE_KEY='gcs-demo-profile-v2';
type SavedDemo={full_name:string;phone:string;provider?:DemoProvider|'manual'};
function readProfile():SavedDemo{
 try{
  const raw=localStorage.getItem(PROFILE_KEY);
  if(raw){const value=JSON.parse(raw) as Partial<SavedDemo>;
   if(typeof value.full_name==='string'&&value.full_name.trim().length>=2)
    return {full_name:value.full_name.trim().slice(0,80),phone:typeof value.phone==='string'?value.phone:'',provider:value.provider||'manual'};
  }
  const legacy=(localStorage.getItem(LEGACY_KEY)||'').trim().slice(0,80);
  return {full_name:legacy,phone:'',provider:'manual'};
 }catch{return {full_name:'',phone:'',provider:'manual'};}
}
export function normalizeDemoPhone(input:string):string{
 const raw=input.trim().replace(/[\s()\-]/g,'');
 if(/^\d{10}$/.test(raw))return '+91'+raw;
 if(/^91\d{10}$/.test(raw))return '+'+raw;
 if(/^\+[1-9]\d{7,14}$/.test(raw))return raw;
 return '';
}
const AuthContext=createContext<AuthState|null>(null);
export function AuthProvider({children}:{children:ReactNode}){
 const [details,setDetails]=useState<SavedDemo>(readProfile);
 const name=details.full_name;
 const loading=false;
 const user=name?({id:'gcs-local-demo',email:'',user_metadata:{full_name:name,phone:details.phone},app_metadata:{provider:'demo',providers:['demo']},aud:'authenticated',created_at:new Date(0).toISOString()} satisfies User):null;
 const persist=(next:SavedDemo)=>{
  try{
   localStorage.setItem(PROFILE_KEY,JSON.stringify(next));
   localStorage.setItem(LEGACY_KEY,next.full_name);
  }catch{throw new Error('Please enable browser storage to use the demo.');}
  setDetails(next);
 };
 const signIn=async(input:string,phoneInput:string)=>{
  const clean=input.trim().replace(/\s+/g,' ').slice(0,80);
  if(clean.length<2)throw new Error('Please enter your name (at least 2 characters).');
  const phone=normalizeDemoPhone(phoneInput);
  if(!phone)throw new Error('Enter a valid mobile number (10 digits for India or international +country code).');
  persist({full_name:clean,phone,provider:'manual'});
 };
 const signInDemo=async(provider:DemoProvider)=>{
  // Simulated social sign-in: never redirects to or impersonates Google / Apple.
  persist({full_name:provider==='google'?'Google Demo User':'Apple Demo User',phone:'',provider});
 };
 const signOut=async()=>{
  try{localStorage.removeItem(PROFILE_KEY);localStorage.removeItem(LEGACY_KEY);}catch{/* ignore */}
  setDetails({full_name:'',phone:'',provider:'manual'});
 };
 const updateProfile=async(next:CustomerProfile)=>{
  const clean=next.full_name.trim().replace(/\s+/g,' ').slice(0,80);
  if(clean.length<2)throw new Error('Enter a name of at least 2 characters.');
  const phone=next.phone.trim()?normalizeDemoPhone(next.phone):'';
  if(next.phone.trim()&&!phone)throw new Error('Enter a valid mobile number or leave it blank for social demo mode.');
  persist({full_name:clean,phone,provider:details.provider||'manual'});
 };
 const signUp=async(input:Register)=>{await signIn(input.fullName,input.phone);return true;};
 const sendPasswordReset=async()=>{throw new Error('Password recovery is not needed in demo mode.');};
 const profile=name?{full_name:name,phone:details.phone,whatsapp_opt_in:false}:null;
 return <AuthContext.Provider value={{signedIn:Boolean(name),loading,user,profile,signIn,signInDemo,signOut,signUp,sendPasswordReset,updateProfile}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const ctx=useContext(AuthContext);if(!ctx)throw new Error('useAuth must be used inside AuthProvider');return ctx;}
