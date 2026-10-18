import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {LogOut,Mail,Phone,UserRound,ShieldCheck,ChevronRight,CheckCircle2,MessageCircle,Save} from 'lucide-react';
import {Header,PrimaryButton} from '../components/UI';
import {useAuth} from '../context/AuthContext';
import {requiredSupabase} from '../lib/supabase';
export function Profile(){
 const nav=useNavigate();const {user,profile,signOut,updateProfile}=useAuth();
 const [phone,setPhone]=useState<string|null>(null),[optIn,setOptIn]=useState<boolean|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[saved,setSaved]=useState(false),[otp,setOtp]=useState(''),[codeSent,setCodeSent]=useState(false),[verifyMessage,setVerifyMessage]=useState(''),[verifying,setVerifying]=useState(false);
 const shownPhone=phone??profile?.phone??'';
 const consent=optIn??profile?.whatsapp_opt_in??false;
 const save=async()=>{if(!profile)return;setBusy(true);setError('');setSaved(false);
  try{if(!/^\+[1-9]\d{7,14}$/.test(shownPhone))throw new Error('Enter your number with country code, such as +919876543210.');
   await updateProfile({...profile,phone:shownPhone,whatsapp_opt_in:consent});setPhone(null);setOptIn(null);setSaved(true);
  }catch(e){setError(e instanceof Error?e.message:'Could not save your profile.');}finally{setBusy(false);}
 };
 const phoneVerified=Boolean(user?.phone_confirmed_at&&user?.phone===shownPhone);
 const sendVerification=async()=>{setVerifying(true);setVerifyMessage('');
  try{if(!/^\+[1-9]\d{7,14}$/.test(shownPhone))throw Error('Enter a valid phone with country code.');
   const {error}=await requiredSupabase().auth.updateUser({phone:shownPhone});
   if(error)throw error;setCodeSent(true);setVerifyMessage('A verification code was requested. Check your SMS inbox.');
  }catch(e){setVerifyMessage(e instanceof Error?e.message:'SMS verification is not available. The studio needs to configure an SMS provider.');}finally{setVerifying(false);}
 };
 const verifyNumber=async()=>{setVerifying(true);setVerifyMessage('');
  try{const {error}=await requiredSupabase().auth.verifyOtp({phone:shownPhone,token:otp,type:'phone_change'});
   if(error)throw error;setCodeSent(false);setOtp('');setVerifyMessage('Phone number verified. Save your contact details to finish.');
  }catch(e){setVerifyMessage(e instanceof Error?e.message:'Could not verify your phone.');}finally{setVerifying(false);}
 };
 const out=async()=>{try{await signOut();nav('/sign-in',{replace:true});}catch(e){setError(e instanceof Error?e.message:'Could not sign out.');}};
 return <div className="inner-screen page-flow"><Header title="My Account" back="/home"/><div className="page-padding">
 <div className="profile-heading"><span><UserRound size={32}/></span><h2>{profile?.full_name||'Your Account'}</h2><p>Gokul Creative Studio customer</p></div>
 <div className="profile-fact"><Mail size={19}/><span>Email</span><strong>{user?.email||'—'}</strong></div>
 <div className="profile-edit-row"><label htmlFor="contact-phone">Registered mobile / WhatsApp number</label><div className="profile-edit-input"><Phone size={17}/><input id="contact-phone" type="tel" value={shownPhone} onChange={e=>setPhone(e.target.value)} placeholder="+91XXXXXXXXXX"/></div></div>
 <label className="profile-whatsapp-consent"><input type="checkbox" checked={consent} onChange={e=>setOptIn(e.target.checked)}/><span>I consent to receive quotation and payment information on this number when the studio enables WhatsApp notifications.</span></label>
 {error&&<p role="alert" className="error-text">{error}</p>}{saved&&<p role="status" className="auth-notice"><CheckCircle2 size={15}/> Contact preferences saved.</p>}
 <PrimaryButton loading={busy} onClick={()=>void save()} disabled={!profile||busy}><Save size={17}/> Save Contact Details</PrimaryButton>
 <div className="phone-verification"><div className="phone-verification-head"><ShieldCheck size={18}/><div><strong>{phoneVerified?'Phone verified':'Verify your phone number'}</strong><p>{phoneVerified?'Eligible for messages after studio integration is configured.':'Phone verification is required before private quotations can be sent to this number.'}</p></div></div>
 {!phoneVerified&&<><button type="button" disabled={verifying} className="phone-verify-btn" onClick={()=>void sendVerification()}>{verifying?'Please wait...':'Send SMS verification code'}</button>
 {codeSent&&<div className="phone-otp-row"><input inputMode="numeric" aria-label="SMS verification code" placeholder="6-digit code" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,''))}/><button onClick={()=>void verifyNumber()} disabled={otp.length!==6||verifying}>Verify</button></div>}</>}
 {verifyMessage&&<p role="status">{verifyMessage}</p>}</div>
 <div className="profile-session"><ShieldCheck size={20}/><div><strong>Secure account</strong><p>Signed in with Supabase Auth. Your customer record is protected and private.</p></div></div>
 <div className="profile-session profile-info"><MessageCircle size={20}/><div><strong>WhatsApp updates</strong><p>Once the studio connects an approved sender, quotation and payment notifications can be delivered to your opted-in number. Until then, use the share buttons.</p></div></div>
 <button className="profile-packages" onClick={()=>nav('/book')}>Explore our packages <ChevronRight size={18}/></button>
 <button className="profile-signout" onClick={()=>void out()}><LogOut size={17}/> Sign out securely</button>
 </div></div>;
}