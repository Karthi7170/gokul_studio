import {useRef,useState,type ChangeEvent} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft,Camera,Check,ChevronRight,Eye,EyeOff,LockKeyhole,LogOut,Mail,Pencil,Phone,Save,UserRound,CalendarDays} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import {StudioBrandMark} from '../components/StudioBrandLogo';
import {requiredSupabase} from '../lib/supabase';
import {ProfileAvatarPhoto,useProfileAvatar} from '../components/ProfileAvatarPhoto';

function normalizedPhone(value:string){
 const clean=value.replace(/[\s()\-]/g,'');
 if(/^\d{10}$/.test(clean))return '+91'+clean;
 if(/^91\d{10}$/.test(clean))return '+'+clean;
 return clean;
}
function ProfileOption({icon:Icon,title,subtitle,onClick,danger=false}:{icon:typeof UserRound;title:string;subtitle:string;onClick:()=>void;danger?:boolean}){
 return <button type="button" onClick={onClick} className={'gcs-account-option'+(danger?' danger':'')}>
  <span className="gcs-account-option-icon"><Icon size={21} strokeWidth={1.85}/></span>
  <span className="gcs-account-option-text"><strong>{title}</strong><small>{subtitle}</small></span>
  <ChevronRight size={20} strokeWidth={1.9}/>
 </button>;
}
export function Profile(){
 const nav=useNavigate();
 const {user,profile,signOut,updateProfile}=useAuth();
 const [editing,setEditing]=useState(false);
 const [name,setName]=useState<string|null>(null),[email,setEmail]=useState<string|null>(null),[phone,setPhone]=useState<string|null>(null);
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const {avatarUrl,uploading,uploadAvatar,markAvatarBroken}=useProfileAvatar();
 const [passwordOpen,setPasswordOpen]=useState(false),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[showPassword,setShowPassword]=useState(false),[passwordBusy,setPasswordBusy]=useState(false);
 const photoRef=useRef<HTMLInputElement>(null),nameRef=useRef<HTMLInputElement>(null),emailRef=useRef<HTMLInputElement>(null),phoneRef=useRef<HTMLInputElement>(null);
 const fullName=name??profile?.full_name??String(user?.user_metadata?.full_name||'');
 const currentEmail=email??user?.email??'';
 const currentPhone=phone??profile?.phone??'';
 const initials=(fullName.trim().split(/\s+/).slice(0,2).map(p=>p.charAt(0)).join('')||'G').toUpperCase();
 const activateEdit=(field?:'name'|'email'|'phone')=>{
  setEditing(true);setError('');setNotice('');
  if(field)window.setTimeout(()=>({name:nameRef,email:emailRef,phone:phoneRef}[field].current?.focus()),10);
 };
 const cancelEdit=()=>{setEditing(false);setName(null);setEmail(null);setPhone(null);setError('');};
 const saveProfile=async()=>{
  if(!user||!profile||busy)return;
  const nextName=fullName.trim(),nextEmail=currentEmail.trim().toLowerCase(),nextPhone=normalizedPhone(currentPhone);
  if(nextName.length<2){setError('Enter your full name (at least 2 characters).');return;}
  if(!/^\S+@\S+\.\S+$/.test(nextEmail)){setError('Enter a valid email address.');return;}
  if(!/^\+[1-9]\d{7,14}$/.test(nextPhone)){setError('Enter a valid mobile number with country code, such as +919876543210.');return;}
  setBusy(true);setError('');setNotice('');
  try{
   if(nextName!==profile.full_name||nextPhone!==profile.phone){
    await updateProfile({...profile,full_name:nextName,phone:nextPhone});
    const {error:metadataError}=await requiredSupabase().auth.updateUser({data:{full_name:nextName,phone:nextPhone}});
    if(metadataError)throw metadataError;
   }
   if(nextEmail!==user.email?.toLowerCase()){
    const {error:emailError}=await requiredSupabase().auth.updateUser({email:nextEmail});
    if(emailError)throw emailError;
    setNotice('Account details saved. Check your new email address to confirm the email change.');
   }else setNotice('Profile updated successfully.');
   setEditing(false);setName(null);setEmail(null);setPhone(null);
  }catch(e){setError(e instanceof Error?e.message:'Unable to save your profile.');}
  finally{setBusy(false);}
 };
 const onPhoto=async(event:ChangeEvent<HTMLInputElement>)=>{
  const file=event.target.files?.[0];
  event.target.value='';
  if(!file)return;
  setError('');setNotice('');
  try{
   await uploadAvatar(file);
   setNotice('Profile photo updated. It will also appear on your Home screen.');
  }catch(e){setError(e instanceof Error?e.message:'Unable to upload your photo.');}
 };
 const changePassword=async()=>{
  if(password.length<8){setError('Your new password must have at least 8 characters.');return;}
  if(password!==confirm){setError('Passwords do not match.');return;}
  if(passwordBusy)return;
  setPasswordBusy(true);setError('');setNotice('');
  try{
   const {error:passwordError}=await requiredSupabase().auth.updateUser({password});
   if(passwordError)throw passwordError;
   setPassword('');setConfirm('');setPasswordOpen(false);setNotice('Your password has been updated.');
  }catch(e){setError(e instanceof Error?e.message:'Unable to update your password.');}
  finally{setPasswordBusy(false);}
 };
 const logout=async()=>{
  setError('');
  try{await signOut();nav('/sign-in',{replace:true});}
  catch(e){setError(e instanceof Error?e.message:'Could not sign out.');}
 };
 return <div className="inner-screen page-flow gcs-account-page">
  <header className="gcs-account-topbar">
   <button type="button" aria-label="Back to home" className="gcs-account-back" onClick={()=>nav('/home')}><ArrowLeft size={22}/></button>
   <h1>My Account</h1>
   <StudioBrandMark className="gcs-account-topmark"/>
  </header>
  <section className="gcs-account-cover" aria-label="Gokul Creative Studio">
   <div className="gcs-account-cover-content"><strong>GOKUL<br/><em>CREATIVE STUDIO</em></strong><i/><p>THE MOMENTS YOU LIVE.<br/>THE STORIES WE KEEP.</p></div>
  </section>
  <div className="gcs-account-content">
   <section className="gcs-account-identity">
    <div className="gcs-account-avatar">
     <ProfileAvatarPhoto avatarUrl={avatarUrl} initials={initials} onError={markAvatarBroken}/>
     <input ref={photoRef} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload profile photo" className="gcs-account-photo-input" onChange={e=>void onPhoto(e)}/>
     <button type="button" disabled={uploading} aria-label="Change profile photo" className="gcs-account-camera" onClick={()=>photoRef.current?.click()}><Camera size={19}/></button>
    </div>
    <h2>{profile?.full_name||'Your Account'}</h2>
    <p>Gokul Creative Studio Customer</p>
   </section>
   <section className="gcs-account-fields" aria-label="Account details">
    <div className="gcs-account-field">
     <span className="gcs-account-field-icon"><UserRound size={22}/></span>
     <div className="gcs-account-field-data"><label htmlFor="gcs-account-name">Full Name</label>{editing?<input id="gcs-account-name" ref={nameRef} autoComplete="name" value={fullName} maxLength={80} onChange={e=>setName(e.target.value)}/>:<strong>{profile?.full_name||'Add your name'}</strong>}</div>
     <button type="button" aria-label="Edit full name" onClick={()=>activateEdit('name')}><Pencil size={17}/></button>
    </div>
    <div className="gcs-account-field">
     <span className="gcs-account-field-icon"><Mail size={22}/></span>
     <div className="gcs-account-field-data"><label htmlFor="gcs-account-email">Email Address</label>{editing?<input id="gcs-account-email" ref={emailRef} type="email" autoComplete="email" value={currentEmail} onChange={e=>setEmail(e.target.value)}/>:<strong>{user?.email||'Add your email'}</strong>}</div>
     <button type="button" aria-label="Change email address" onClick={()=>activateEdit('email')}><Pencil size={17}/></button>
    </div>
    <div className="gcs-account-field">
     <span className="gcs-account-field-icon"><Phone size={22}/></span>
     <div className="gcs-account-field-data"><label htmlFor="gcs-account-phone">Mobile Number</label>{editing?<input id="gcs-account-phone" ref={phoneRef} type="tel" autoComplete="tel" inputMode="tel" value={currentPhone} placeholder="+91 98765 43210" onChange={e=>setPhone(e.target.value)}/>:<strong>{profile?.phone||'Add mobile number'}</strong>}</div>
     <button type="button" aria-label="Edit mobile number" onClick={()=>activateEdit('phone')}><Pencil size={17}/></button>
    </div>
   </section>
   <div className="gcs-account-edit-controls">
    {editing?<><button type="button" className="gcs-account-main-cta" disabled={busy} onClick={()=>void saveProfile()}><Save size={19}/>{busy?'Saving changes…':'Save Profile'}</button><button type="button" className="gcs-account-cancel" onClick={cancelEdit} disabled={busy}>Cancel</button></>:
    <button type="button" className="gcs-account-main-cta" onClick={()=>activateEdit()}><Pencil size={19}/>Edit Profile</button>}
   </div>
   {error&&<p className="gcs-account-error" role="alert">{error}</p>}
   {notice&&<p className="gcs-account-notice" role="status"><Check size={17}/>{notice}</p>}
   <nav className="gcs-account-options" aria-label="Account actions">
    <ProfileOption icon={CalendarDays} title="My Bookings" subtitle="View and manage your bookings" onClick={()=>nav('/bookings')}/>
    <ProfileOption icon={LockKeyhole} title="Change Password" subtitle="Update your account password" onClick={()=>{setPasswordOpen(x=>!x);setError('');setNotice('');}}/>
   </nav>
   {passwordOpen&&<section className="gcs-account-password">
    <h3>Change Password</h3>
    <p>Create a new password for your account.</p>
    <label>New Password<div className="gcs-account-password-input"><input type={showPassword?'text':'password'} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters"/><button type="button" aria-label={showPassword?'Hide password':'Show password'} onClick={()=>setShowPassword(p=>!p)}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
    <label>Confirm Password<input type={showPassword?'text':'password'} autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat your new password"/></label>
    <button type="button" className="gcs-account-password-save" disabled={passwordBusy||password.length<8||password!==confirm} onClick={()=>void changePassword()}>{passwordBusy?'Updating…':'Update Password'}</button>
   </section>}
   <div className="gcs-account-options gcs-account-logout"><ProfileOption icon={LogOut} title="Log Out" subtitle="Sign out from your account" onClick={()=>void logout()} danger/></div>
  </div>
 </div>;
}
