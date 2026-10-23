import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type {ReactNode} from 'react';
import {SignIn, SignUp, ForgotPassword, ResetPassword} from './screens/AuthScreens';
import {Home, BookService} from './screens/HomeScreens';
import {PackageDetails} from './screens/PackageDetails';
import {Profile} from './screens/Profile';
import {MyBookings} from './screens/MyBookings';
import {StudioBottomNav} from './components/StudioBottomNav';
import {StudioBrandLogo} from './components/StudioBrandLogo';
import {BookingDetails} from './screens/BookingScreens';
import {Quotation, Payment, Confirmed, WhatsApp} from './screens/CheckoutScreens';
import {useAuth} from './context/AuthContext';
function Private({children}:{children:ReactNode}){const {signedIn,loading}=useAuth();return loading?<div className="session-loading">Checking your secure session…</div>:signedIn?<>{children}</>:<Navigate to="/sign-in" replace/>;}
function GuestOnly({children}:{children:ReactNode}){const {signedIn,loading}=useAuth();return loading?<div className="session-loading">Loading your studio account…</div>:signedIn?<Navigate to="/home" replace/>:<>{children}</>;}
const screens=['/sign-in','/sign-up','/home','/book','/bookings','/packages/wedding','/booking-details','/quotation','/payment','/confirmed','/whatsapp'];
export default function App(){
 const location=useLocation();const {signedIn,loading}=useAuth();
 const showTabs=signedIn&&(['/home','/book','/bookings','/profile','/booking-details'].includes(location.pathname)||location.pathname.startsWith('/packages/'));
 if(loading)return <div className="desktop-stage"><div className="phone-shell"><div className="auth-loading"><StudioBrandLogo className="gcs-loading-official-logo"/><p>Preparing your studio experience...</p><div className="loading-pulse"/></div></div></div>;
 return <div className="desktop-stage"><div className="phone-shell"><div className="top-notch" aria-hidden="true"/><div className="ios-status"><span>9:41</span><span className="status-right">▂▄▆　◕　▰</span></div>
 <main key={location.pathname} className={'phone-content'+(showTabs?' with-studio-tabs':'')} aria-label="Gokul Creative Studio booking application">
 {loading?<div className="session-loading">Preparing your studio…</div>:<Routes location={location}>
 <Route path="/" element={<Navigate to={signedIn?'/home':'/sign-up'} replace/>}/>
 <Route path="/sign-in" element={<GuestOnly><SignIn/></GuestOnly>}/>
 <Route path="/sign-up" element={<GuestOnly><SignUp/></GuestOnly>}/>
 <Route path="/forgot-password" element={<GuestOnly><ForgotPassword/></GuestOnly>}/>
 <Route path="/reset-password" element={<ResetPassword/>}/>
 <Route path="/home" element={<Private><Home/></Private>}/>
 <Route path="/book" element={<Private><BookService/></Private>}/>
 <Route path="/bookings" element={<Private><MyBookings/></Private>}/>
 <Route path="/packages/:id" element={<Private><PackageDetails/></Private>}/>
 <Route path="/profile" element={<Private><Profile/></Private>}/>
 <Route path="/booking-details" element={<Private><BookingDetails/></Private>}/>
 <Route path="/schedule" element={<Navigate to="/quotation" replace/>}/>
 <Route path="/quotation" element={<Private><Quotation/></Private>}/>
 <Route path="/payment" element={<Private><Payment/></Private>}/>
 <Route path="/confirmed" element={<Private><Confirmed/></Private>}/>
 <Route path="/whatsapp" element={<Private><WhatsApp/></Private>}/>
 <Route path="*" element={<Navigate to={signedIn?'/home':'/sign-in'} replace/>}/>
 </Routes>}</main>{showTabs&&<StudioBottomNav/>}<div className="home-indicator" aria-hidden="true"/></div>
 <div className="desktop-meta"><h1>GOKUL <span>Creative Studio</span></h1><p>iPhone booking experience · 6 packages</p><nav>{screens.map((p,i)=><a key={p} href={`#${p}`}>{i+1}</a>)}</nav></div>
 </div>;
}
