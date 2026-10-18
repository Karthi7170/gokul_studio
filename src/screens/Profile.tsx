import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {LogOut,Mail,Phone,UserRound,ShieldCheck,ChevronRight,CheckCircle2,MessageCircle,Save} from 'lucide-react';
import {Header,PrimaryButton} from '../components/UI';
import {useAuth} from '../context/AuthContext';
export function Profile(){
 const nav=useNavigate();const {user,profile,signOut,updateProfile}=useAuth();
 const [phone,setPhone]=useState<string|null>(null),[optIn,setOptIn]=useState<boolean|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[saved,setSaved]=useState(false);
 const shownPhone=phone??profile?.phone??'';
 const consent=optIn??profile?.whatsapp_opt_in??false;
 const save=async()=>{if(!profile)return;setBusy(true);setError('');setSaved(false);
  try{if(!/^\+[1-9]\d{7,14}$/.test(shownPhone))throw new Error('Enter your number with country code, such as +919876543210.');
   await updateProfile({...profile,phone:shownPhone,whatsapp_opt_in:consent});setPhone(null);setOptIn(null);setSaved(true);
  }catch(e){setError(e instanceof Error?e.message:'Could not save your profile.');}finally{setBusy(false);}
 };
 const out=async()=>{try{await signOut();nav('/sign-in',{replace:true});}catch(e){setError(e instanceof Error?e.message:'Could not sign out.');}};
 return <div className="inner-screen page-flow"><Header title="My Account" back="/home"/><div className="page-padding">
 <div className="profile-heading"><span><UserRound size={32}/></span><h2>{profile?.full_name||'Your Account'}</h2><p>Gokul Creative Studio customer</p></div>
 <div className="profile-fact"><Mail size={19}/><span>Email</span><strong>{user?.email||'—'}</strong></div>
 <div className="profile-edit-row"><label htmlFor="contact-phone">Registered mobile / WhatsApp number</label><div className="profile-edit-input"><Phone size={17}/><input id="contact-phone" type="tel" value={shownPhone} onChange={e=>setPhone(e.target.value)} placeholder="+91XXXXXXXXXX"/></div></div>
 <label className="profile-whatsapp-consent"><input type="checkbox" checked={consent} onChange={e=>setOptIn(e.target.checked)}/><span>I consent to receive quotation and payment information on this number when the studio enables WhatsApp notifications.</span></label>
 {error&&<p role="alert" className="error-text">{error}</p>}{saved&&<p role="status" className="auth-notice"><CheckCircle2 size={15}/> Contact preferences saved.</p>}
 <PrimaryButton loading={busy} onClick={()=>void save()} disabled={!profile||busy}><Save size={17}/> Save Contact Details</PrimaryButton>
 <div className="profile-session"><ShieldCheck size={20}/><div><strong>Secure account</strong><p>Signed in with Supabase Auth. Your customer record is protected and private.</p></div></div>
 <div className="profile-session profile-info"><MessageCircle size={20}/><div><strong>WhatsApp updates</strong><p>Once the studio connects an approved sender, quotation and payment notifications can be delivered to your opted-in number. Until then, use the share buttons.</p></div></div>
 <button className="profile-packages" onClick={()=>nav('/book')}>Explore our packages <ChevronRight size={18}/></button>
 <button className="profile-signout" onClick={()=>void out()}><LogOut size={17}/> Sign out securely</button>
 </div></div>;
}