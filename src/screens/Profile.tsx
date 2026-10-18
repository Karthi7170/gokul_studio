import {useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {CheckCircle2,ChevronRight,LogOut,Mail,Phone,ShieldCheck,UserRound,Save} from 'lucide-react';
import {Header,PrimaryButton} from '../components/UI';
import {useAuth} from '../context/AuthContext';
export function Profile(){
 const nav=useNavigate();const {user,profile,signOut,updateProfile}=useAuth();
 const [name,setName]=useState(''),[phone,setPhone]=useState(''),[consent,setConsent]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{setName(profile?.full_name||'');setPhone(profile?.phone||'');setConsent(!!profile?.whatsapp_opt_in);},[profile]);
 const save=async()=>{setBusy(true);setError('');setMessage('');
 try{const number=phone.trim().replace(/[\s()\-]/g,'');if(name.trim().length<2||!/^\+[1-9]\d{7,14}$/.test(number))throw Error('Enter a valid name and phone number with country code.');
 await updateProfile({full_name:name.trim(),phone:number,whatsapp_opt_in:consent});setMessage('Your account details were saved securely.');
 }catch(e){setError(e instanceof Error?e.message:'Could not save your profile.');}finally{setBusy(false);}};
 return <div className="inner-screen page-flow profile-page"><Header title="Your Account" back="/home"/><div className="page-padding">
 <div className="profile-heading"><span><UserRound size={29}/></span><h2>{profile?.full_name||'Your profile'}</h2><p>Your personal creative space</p><div className="profile-verified"><ShieldCheck size={13}/> Email account {user?.email_confirmed_at?'verified':'registered'}</div></div>
 <div className="profile-form"><label>Full name<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="Full name"/></label>
 <label>Email address<input type="email" readOnly value={user?.email||''} className="profile-readonly"/><small>Email belongs to your signed-in account</small></label>
 <label>Mobile / WhatsApp number<input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel" placeholder="+919876543210"/></label>
 <label className="notification-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Send me quotation and payment information via WhatsApp when studio messaging is available.</span></label>
 </div>
 {error&&<p role="alert" className="error-text">{error}</p>}{message&&<p className="auth-notice" role="status"><CheckCircle2 size={16}/>{message}</p>}
 <PrimaryButton loading={busy} onClick={()=>void save()}><Save size={17}/> Save Details</PrimaryButton>
 <div className="profile-session"><ShieldCheck size={21}/><div><strong>Protected customer information</strong><p>Your details and requests are restricted to your authenticated account. Phone messages are optional and need an active business messaging provider.</p></div></div>
 <button className="profile-packages" onClick={()=>nav('/book')}>Explore creative packages <ChevronRight size={18}/></button>
 <button className="profile-signout" onClick={async()=>{try{await signOut();nav('/sign-in',{replace:true});}catch(e){setError(e instanceof Error?e.message:'Could not sign out.');}}}><LogOut size={17}/> Sign Out</button>
 </div></div>;
}
