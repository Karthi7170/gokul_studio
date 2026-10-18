import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SignIn, SignUp, ForgotPassword } from './screens/AuthScreens';
import { Home, BookService } from './screens/HomeScreens';
import { BookingDetails, Schedule } from './screens/BookingScreens';
import { Quotation, Payment, Confirmed, WhatsApp } from './screens/CheckoutScreens';
const screens=['/sign-in','/sign-up','/forgot-password','/home','/book','/booking-details','/schedule','/quotation','/payment','/confirmed','/whatsapp'];
export default function App(){
 const location=useLocation();
 return <div className="desktop-stage"><div className="phone-shell"><div className="top-notch" aria-hidden="true"/><div className="ios-status"><span>9:41</span><span className="status-right">▂▄▆　◕　▰</span></div>
 <main key={location.pathname} className="phone-content" aria-label="Gokul Creative Studio booking application">
 <Routes location={location}>
 <Route path="/" element={<Navigate to="/sign-in" replace/>}/>
 <Route path="/sign-in" element={<SignIn/>}/><Route path="/sign-up" element={<SignUp/>}/><Route path="/forgot-password" element={<ForgotPassword/>}/>
 <Route path="/home" element={<Home/>}/><Route path="/book" element={<BookService/>}/><Route path="/booking-details" element={<BookingDetails/>}/>
 <Route path="/schedule" element={<Schedule/>}/><Route path="/quotation" element={<Quotation/>}/><Route path="/payment" element={<Payment/>}/><Route path="/confirmed" element={<Confirmed/>}/><Route path="/whatsapp" element={<WhatsApp/>}/><Route path="*" element={<Navigate to="/sign-in" replace/>}/>
 </Routes></main><div className="home-indicator" aria-hidden="true"/></div>
 <div className="desktop-meta"><h1>GOKUL <span>Creative Studio</span></h1><p>11-screen iPhone booking demo</p><nav>{screens.map((p,i)=><a key={p} href={`#${p}`}>{i+1}</a>)}</nav></div>
 </div>;
}
