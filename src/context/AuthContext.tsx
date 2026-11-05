import {createContext,useContext,useState,type ReactNode} from 'react';
import type {User} from '@supabase/supabase-js';

// Demo-only identity: stored on this device, never used to authorize server data.
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
function demoUser(name:string):User{return {id:'demo-local-user',aud:'demo',role:'demo',email:'',app_metadata:{},user_metadata:{full_name:name},created_at:new Date(0).toISOString()} as User;}
const AuthContext=createContext<AuthState|null>(null);
export function AuthProvider({children}:{children:ReactNode}){
 const [name,setName]=useState(savedName);
 const profile=name?{full_name:name,phone:'',whatsapp_opt_in:false}:null;
 const user=name?demoUser(name):null;
 const signIn=async(input:string,_password:string)=>{
  const clean=input.trim().replace(/\s+/g,' ').slice(0,80);
  if(clean.length<2)throw new Error('Please enter your name (at least 2 characters).');
  try{localStorage.setItem(KEY,clean);}catch{/* session still works */}
  setName(clean);
 };
 const signOut=async()=>{try{localStorage.removeItem(KEY);}catch{/* ignore */}setName('');};
 const updateProfile=async(next:CustomerProfile)=>{await signIn(next.full_name,'');};
 const signUp=async(input:Register)=>{await signIn(input.fullName,'');return true;};
 const sendPasswordReset=async()=>{throw new Error('Password recovery is not needed in demo mode.');};
 return <AuthContext.Provider value={{signedIn:Boolean(name),loading:false,user,profile,signIn,signOut,signUp,sendPasswordReset,updateProfile}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const ctx=useContext(AuthContext);if(!ctx)throw new Error('useAuth must be used inside AuthProvider');return ctx;}
