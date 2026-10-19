import {useCallback,useEffect,useMemo,useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {requiredSupabase} from '../lib/supabase';

/** All profile images are stored in a private, owner-scoped Supabase bucket.
 * Signed links are short-lived and never written into public user metadata.
 */
const AVATAR_BUCKET='profile-avatars';
const AVATAR_EVENT='gcs-profile-avatar-updated';
const SIGNED_URL_LIFETIME_SECONDS=30*60;

function ownAvatarPath(path:string,userId:string){
 return path.startsWith(userId+'/')&&!path.includes('..');
}
export function useProfileAvatar(){
 const {user}=useAuth();
 const userId=user?.id;
 const savedPath=typeof user?.user_metadata?.avatar_path==='string'?user.user_metadata.avatar_path:'';
 const [version,setVersion]=useState(0);
 const [url,setUrl]=useState<string|null>(null);
 const [uploading,setUploading]=useState(false);
 const [previewBroken,setPreviewBroken]=useState(false);

 useEffect(()=>{
  const updated=(event:Event)=>{
   const detail=(event as CustomEvent<{userId:string}>).detail;
   if(userId&&detail?.userId===userId)setVersion(v=>v+1);
  };
  window.addEventListener(AVATAR_EVENT,updated);
  return ()=>window.removeEventListener(AVATAR_EVENT,updated);
 },[userId]);
 useEffect(()=>{
  let current=true;
  setUrl(null);
  setPreviewBroken(false);
  if(!userId||!savedPath||!ownAvatarPath(savedPath,userId))return;
  void requiredSupabase().storage.from(AVATAR_BUCKET).createSignedUrl(savedPath,SIGNED_URL_LIFETIME_SECONDS)
    .then(({data,error})=>{
     if(current&& !error && data?.signedUrl)setUrl(data.signedUrl);
    }).catch(()=>{if(current)setUrl(null);});
  return ()=>{current=false;};
 },[userId,savedPath,version]);

 const uploadAvatar=useCallback(async(file:File)=>{
  if(!userId)throw new Error('Sign in to upload a profile photo.');
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))
   throw new Error('Choose a JPG, PNG or WebP photo.');
  if(file.size>5*1024*1024)throw new Error('Choose an image smaller than 5 MB.');
  if(uploading)return;
  const ext:{[key:string]:string}={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
  const path=userId+'/avatar-'+Date.now()+'.'+ext[file.type];
  setUploading(true);
  try{
   const storage=requiredSupabase().storage.from(AVATAR_BUCKET);
   const {error:uploadError}=await storage.upload(path,file,{contentType:file.type,cacheControl:'3600'});
   if(uploadError)throw uploadError;
   const {error:saveError}=await requiredSupabase().auth.updateUser({data:{avatar_path:path}});
   if(saveError)throw saveError;
   const {data,error:linkError}=await storage.createSignedUrl(path,SIGNED_URL_LIFETIME_SECONDS);
   if(linkError||!data?.signedUrl)throw linkError??new Error('Unable to display your new photo.');
   setUrl(data.signedUrl);
   setPreviewBroken(false);
   window.dispatchEvent(new CustomEvent(AVATAR_EVENT,{detail:{userId}}));
  }finally{setUploading(false);}
 },[userId,uploading]);

 return {avatarUrl:previewBroken?null:url,uploading,uploadAvatar,markAvatarBroken:()=>setPreviewBroken(true)};
}

/** Both Account and Home use this exact image-rendering component. */
export function ProfileAvatarPhoto({avatarUrl,initials='G',onError}:{avatarUrl:string|null;initials?:string;onError?:()=>void}){
 return <span className="gcs-avatar-photo-frame">
  {avatarUrl?
   <img className="gcs-avatar-photo-image" src={avatarUrl} alt="Your profile photo" decoding="async" onError={onError}/>:
   <span className="gcs-avatar-photo-placeholder" aria-label="Profile initials">{initials}</span>}
 </span>;
}
