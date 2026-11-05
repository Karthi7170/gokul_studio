import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft,Check,LogOut,Pencil,Save,UserRound,CalendarDays} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import {StudioBrandMark} from '../components/StudioBrandLogo';
export function Profile(){
 const nav=useNavigate();
 const {profile,signOut,updateProfile}=useAuth();
 const [editing,setEditing]=useState(false);
 const [name,setName]=useState<string|null>(null);
 const [error,setError]=useState(''),[notice,setNotice]=useState('');
 const displayName=name??profile?.full_name??'';
 const save=async()=>{
  if(displayName.trim().length<2){setError('Please enter at least 2 characters.');return;}
  try{await updateProfile({full_name:displayName.trim(),phone:'',whatsapp_opt_in:false});setName(null);setEditing(false);setError('');setNotice('Demo profile updated.');}
  catch(e){setError(e instanceof Error?e.message:'Unable to update profile.');}
 };
 const logout=async()=>{await signOut();nav('/sign-in',{replace:true});};
 return <div className="inner-screen page-flow gcs-account-page">
  <header className="gcs-account-topbar"><button type="button" aria-label="Back to home" className="gcs-account-back" onClick={()=>nav('/home')}><ArrowLeft size={22}/></button><h1>My Account</h1><StudioBrandMark className="gcs-account-topmark"/></header>
  <section className="gcs-account-cover" aria-label="Gokul Creative Studio"><div className="gcs-account-cover-content"><strong>GOKUL<br/><em>CREATIVE STUDIO</em></strong><i/><p>THE MOMENTS YOU LIVE.<br/>THE STORIES WE KEEP.</p></div></section>
  <div className="gcs-account-content">
   <section className="gcs-account-identity"><div className="gcs-account-avatar"><span className="gcs-account-option-icon"><UserRound size={34}/></span></div><h2>{profile?.full_name||'Demo Guest'}</h2><p>Gokul Creative Studio · Demo Profile</p></section>
   <section className="gcs-account-fields" aria-label="Demo profile"><div className="gcs-account-field"><span className="gcs-account-field-icon"><UserRound size={22}/></span><div className="gcs-account-field-data"><label htmlFor="gcs-account-name">Full Name</label>{editing?<input id="gcs-account-name" autoComplete="name" maxLength={80} value={displayName} onChange={e=>setName(e.target.value)}/>:<strong>{profile?.full_name||'Your name'}</strong>}</div><button type="button" aria-label="Edit name" onClick={()=>setEditing(true)}><Pencil size={17}/></button></div></section>
   <div className="gcs-account-edit-controls">{editing?<><button type="button" className="gcs-account-main-cta" onClick={()=>void save()}><Save size={19}/>Save Name</button><button type="button" className="gcs-account-cancel" onClick={()=>{setEditing(false);setName(null);setError('');}}>Cancel</button></>:<button type="button" className="gcs-account-main-cta" onClick={()=>setEditing(true)}><Pencil size={19}/>Edit Name</button>}</div>
   {error&&<p role="alert" className="gcs-account-error">{error}</p>}{notice&&<p role="status" className="gcs-account-notice"><Check size={17}/>{notice}</p>}
   <nav className="gcs-account-options"><button type="button" className="gcs-account-option" onClick={()=>nav('/bookings')}><CalendarDays size={21}/> My Bookings</button><button type="button" className="gcs-account-option danger" onClick={()=>void logout()}><LogOut size={21}/> Exit Demo</button></nav>
  </div>
 </div>;
}
