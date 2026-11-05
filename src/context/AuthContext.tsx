import {createContext,useContext,useState,type ReactNode} from 'react';
import type {User} from '@supabase/supabase-js';
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
 const loading=false;
 const user=name?({id:'gcs-local-demo',email:'',user_metadata:{full_name:name}} as User):null;
 const signIn=async(input:string,_password:string)=>{
  const clean=input.trim().replace(/\s+/g,' ').slice(0,80);
  if(clean.length<2)throw new Error('Please enter your name (at least 2 characters).');
  try{localStorage.setItem(KEY,clean);}catch{throw new Error('Please enable browser storage to use the demo.');}
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
  try{localStorage.setItem(KEY,clean);}catch{throw new Error('Unable to save your demo profile.');}
  setName(clean);
 };
 const signUp=async(input:Register)=>{await signIn(input.fullName,'');return true;};
 const sendPasswordReset=async()=>{throw new Error('Password recovery is not needed in demo mode.');};
 const profile=name?{full_name:name,phone:'',whatsapp_opt_in:false}:null;
 return <AuthContext.Provider value={{signedIn:Boolean(name),loading,user,profile,signIn,signOut,signUp,sendPasswordReset,updateProfile}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const ctx=useContext(AuthContext);if(!ctx)throw new Error('useAuth must be used inside AuthProvider');return ctx;}
