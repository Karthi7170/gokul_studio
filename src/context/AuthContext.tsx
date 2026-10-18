import {createContext,useContext,useState,type ReactNode} from 'react';
const KEY='gcs-demo-auth-v1';
type AuthState={signedIn:boolean;signIn:()=>void;signOut:()=>void};
const AuthContext=createContext<AuthState|null>(null);
function restoredSession(){try{return localStorage.getItem(KEY)==='signed-in';}catch{return false;}}
export function AuthProvider({children}:{children:ReactNode}){
 const [signedIn,setSignedIn]=useState(restoredSession);
 const signIn=()=>{try{localStorage.setItem(KEY,'signed-in');}catch{}setSignedIn(true);};
 const signOut=()=>{try{localStorage.removeItem(KEY);}catch{}setSignedIn(false);};
 return <AuthContext.Provider value={{signedIn,signIn,signOut}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const ctx=useContext(AuthContext);if(!ctx)throw new Error('useAuth must be inside AuthProvider');return ctx;}
// Frontend demo only: local persistence is not a secure authentication system.
