import {useNavigate} from 'react-router-dom';
import {LogOut,Mail,Phone,UserRound,ShieldCheck,ChevronRight} from 'lucide-react';
import {Header,Logo,PrimaryButton} from '../components/UI';
import {useAuth} from '../context/AuthContext';
import {useBooking} from '../context/BookingContext';
export function Profile(){
 const nav=useNavigate();const {signOut}=useAuth();const {booking}=useBooking();
 return <div className="inner-screen page-flow"><Header title="Your Profile" back="/home"/><div className="page-padding">
 <div className="profile-heading"><span><UserRound size={32}/></span><h2>{booking.fullName||'Studio Customer'}</h2><p>Your Gokul Creative Studio account</p></div>
 <div className="profile-fact"><Mail size={19}/><span>Email</span><strong>{booking.email||'Not provided'}</strong></div>
 <div className="profile-fact"><Phone size={19}/><span>Mobile</span><strong>{booking.phone||'Not provided'}</strong></div>
 <div className="profile-session"><ShieldCheck size={20}/><div><strong>You are signed in</strong><p>Your demo session is saved on this device, so you can open the app without registering again.</p></div></div>
 <button className="profile-packages" onClick={()=>nav('/book')}>Explore all packages <ChevronRight size={18}/></button>
 <PrimaryButton onClick={()=>{signOut();nav('/sign-in',{replace:true});}} className="profile-logout"><LogOut size={18}/> Sign Out</PrimaryButton>
 <p className="demo-watermark">Demo only: local session storage, not real account authentication.</p>
 </div></div>;
}
