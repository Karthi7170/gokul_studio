import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import type {User} from '@supabase/supabase-js';
import {requiredSupabase,supabase} from '../lib/supabase';
export type CustomerProfile={full_name:string;phone:string;whatsapp_opt_in:boolean};
type Register={fullName:string;email:string;phone:string;password:string;whatsappOptIn:boolean};
type AuthState={
 signedIn:boolean;loading:boolean;user:User|null;profile:CustomerProfile|null;
 signUp:(input:Register)=>Promise<boolean>;signIn:(name:string,password:string)=>Promise<void>;
 signOut:()=>Promise<void>;sendPasswordReset:(email:string)=>Promise<void>;
 updateProfile:(profile:CustomerProfile)=>Promise<void>;
};
const KEY='gcs-demo-display-name-v1';
function savedName(){try{return (localStorage.getItem(KEY)||'').trim().slice(0,80);}catch{return '';}}
const AuthContext=createContext<AuthState|null>(null);
export function AuthProvider({children}:{children:ReactNode}){
 const [name,setName]=useState(savedName);
 const [user,setUser]=useState<User|null>(null);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{
  let live=true;
  if(!supabase){setLoading(false);return;}
  // Reuse the anonymous Supabase session on refresh; do not create a new owner ID.
  void supabase.auth.getSession().then(({data})=>{if(live)setUser(data.session?.user??null);}).catch(()=>{}).finally(()=>{if(live)setLoading(false);});
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{if(live)setUser(session?.user??null);});
  return ()=>{live=false;subscription.unsubscribe();};
 },[]);
 const signIn=async(input:string,_password:string)=>{
  const clean=input.trim().replace(/\s+/g,' ').slice(0,80);
  if(clean.length<2)throw new Error('Please enter your name (at least 2 characters).');
  const client=requiredSupabase();
  let {data:{session},error:sessionError}=await client.auth.getSession();
  if(sessionError)throw sessionError;
  if(!session?.user){
   const {data,error}=await client.auth.signInAnonymously();
   if(error)throw new Error('Demo booking connection is unavailable. Enable Anonymous Sign-Ins in Supabase Auth settings. '+error.message);
   session=data.session;
  }
  if(!session?.user)throw new Error('Unable to start a demo session. Please try again.');
  setUser(session.user);
  try{localStorage.setItem(KEY,clean);}catch{/* session still works */}
  setName(clean);
 };
 const signOut=async()=>{
  // Exit the name-only demo UI without destroying its anonymous booking ownership.
  try{localStorage.removeItem(KEY);}catch{/* ignore */}
  setName('');
 };
 const updateProfile=async(next:CustomerProfile)=>{
  const clean=next.full_name.trim().replace(/\s+/g,' ').slice(0,80);
  if(clean.length<2)throw new Error('Enter a name of at least 2 characters.');
  try{localStorage.setItem(KEY,clean);}catch{/* ignore */}
  setName(clean);
 };
 const signUp=async(input:Register)=>{await signIn(input.fullName,'');return true;};
 const sendPasswordReset=async()=>{throw new Error('Password recovery is not needed in demo mode.');};
 const profile=name?{full_name:name,phone:'',whatsapp_opt_in:false}:null;
 return <AuthContext.Provider value={{signedIn:Boolean(name),loading,user,profile,signIn,signOut,signUp,sendPasswordReset,updateProfile}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const ctx=useContext(AuthContext);if(!ctx)throw new Error('useAuth must be used inside AuthProvider');return ctx;}
