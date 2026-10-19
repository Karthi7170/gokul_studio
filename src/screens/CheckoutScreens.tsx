import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowRight,CalendarDays,Camera,Check,ChevronRight,Clock3,Copy,CreditCard,Download,FileText,Landmark,Mail,MapPin,MessageCircle,Phone,ShieldCheck,Smartphone,UserRound,Wallet} from 'lucide-react';
import {BackButton,DetailLine,Header,Logo,OutlineButton,PrimaryButton} from '../components/UI';
import {SignedInAvatarButton} from '../components/SignedInAvatarButton';
import {useBooking,type Booking} from '../context/BookingContext';
import {useAuth} from '../context/AuthContext';
import {SERVICES,IMAGE_URL,THUMBNAIL_URL,inr,getQuote,getBookingEstimate,ADD_ONS,formatDate,to12h} from '../data/services';
import {downloadPackageQuotation} from '../utils/quotationPdf';
import {bookingMessage,openWhatsApp,shareDetails} from '../utils/sharing';
import {completeDemoPayment} from '../lib/requests';
import {sendCustomerNotification} from '../utils/customerNotifications';

function StudioThumbnail({booking}:{booking:Booking}){
 const selected=SERVICES.find(s=>s.id===booking.serviceId)||SERVICES[0];
 return <img src={THUMBNAIL_URL(selected)} alt={selected.name} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=IMAGE_URL(selected.image)}}/>;
}
function generateRef(id:string){return 'GCS-RQ-'+id.slice(0,8).toUpperCase();}
function refUpdate(id:string){return {requestId:id,bookingId:generateRef(id),quotationNo:'GCS-QT-'+id.slice(0,8).toUpperCase()};}

export function Quotation(){
 const nav=useNavigate();
 const {booking}=useBooking();
 const selected=SERVICES.find(s=>s.id===booking.serviceId)||SERVICES[0];
 const quote=getQuote(selected.id);
 return <div className="inner-screen page-flow ferrari-quotation-screen">
  <Header title="Get a Quotation" back={'/packages/'+selected.id}/>
  <div className="page-padding ferrari-quote-page">
   <div className="ferrari-quote-eyebrow"><FileText size={15}/> PACKAGE ESTIMATE</div>
   <h2>Know your package.<br/><span>Plan your moment.</span></h2>
   <p className="ferrari-quote-lead">Explore all the package details and download your quotation PDF. No event details or payment needed.</p>
   <section className="ferrari-quote-feature">
    <StudioThumbnail booking={booking}/>
    <div><small>GOKUL CREATIVE STUDIO</small><strong>{selected.name}</strong><p>{selected.detail}</p></div>
   </section>
   <section className="ferrari-quote-pricing" aria-label="Package price">
    <div><small>Starting estimate</small><strong>{inr(quote.total)}</strong></div><ShieldCheck size={27}/>
   </section>
   <section className="ferrari-quote-inclusions">
    <div className="ferrari-quote-section-heading"><h3>Everything included</h3><span>{selected.included.length} features</span></div>
    <ul>{selected.included.map(feature=><li key={feature}><span><Check size={16}/></span><p>{feature}</p></li>)}</ul>
   </section>
   <div className="ferrari-quote-notice"><ShieldCheck size={19}/><p>Quotation is an illustrative package estimate. Final pricing, scope and availability are confirmed by the studio before any booking.</p></div>
   <button type="button" className="ferrari-download-button" onClick={()=>downloadPackageQuotation(selected.id)}><Download size={19}/> Download Quotation PDF <ArrowRight size={18}/></button>
   <button type="button" className="ferrari-quote-back" onClick={()=>nav('/packages/'+selected.id)}>Back to package <ChevronRight size={16}/></button>
  </div>
 </div>;
}

const PAYMENT_METHODS=[
 {name:'UPI',icon:Smartphone,detail:'Test UPI flow (no PIN required)'},
 {name:'Credit / Debit Card',icon:CreditCard,detail:'Test card flow (no card details collected)'},
 {name:'Net Banking',icon:Landmark,detail:'Test bank flow (no bank login)'},
 {name:'Wallets',icon:Wallet,detail:'Test wallet flow (no wallet connected)'}
] as const;

export function Payment(){
 const nav=useNavigate();const {booking,update}=useBooking();const {user}=useAuth();
 const [processing,setProcessing]=useState<Booking['paymentMethod']|null>(null);
 const [error,setError]=useState('');
 const selected=SERVICES.find(s=>s.id===booking.serviceId)||SERVICES[0],quote=getBookingEstimate(booking.serviceId,booking.addOns);
 const dateNow=new Date();
 const today=[dateNow.getFullYear(),String(dateNow.getMonth()+1).padStart(2,'0'),String(dateNow.getDate()).padStart(2,'0')].join('-');
 const detailsReady=Boolean(booking.eventType.trim()&&booking.venue.trim()&&/^\d{4}-\d{2}-\d{2}$/.test(booking.date)&&booking.date>=today&&/^([01]\d|2[0-3]):[0-5]\d$/.test(booking.time));
 const selectPayment=async(method:Booking['paymentMethod'])=>{
  if(processing)return;
  if(!user){setError('Please sign in first.');return;}
  setProcessing(method);setError('');
  try{
   const id=await completeDemoPayment(booking,user.id,method);
   update({...refUpdate(id),paymentMethod:method,paymentStatus:'Demo Only'});
   nav('/confirmed',{replace:true});
  }catch(e){setError(e instanceof Error?e.message:'Could not complete the demo. Please try again.');}
  finally{setProcessing(null);}
 };
 if(!detailsReady)return <div className="inner-screen page-flow payment-screen"><Header title="Complete Your Booking" back="/booking-details"/><div className="page-padding ferrari-incomplete"><CalendarDays size={34}/><h2>Event details needed</h2><p>Please select a valid future date, time and venue before reviewing payment options.</p><PrimaryButton onClick={()=>nav('/booking-details')}>Add Event Details</PrimaryButton></div></div>;
 return <div className="inner-screen page-flow payment-screen demo-payment-screen">
  <Header title="Payment Options" back="/booking-details"/><div className="page-padding">
   <div className="checkout-heading"><span>STEP 03 / 03 · DEMO MODE</span><h2>Choose a payment method</h2><p>Tap an option to automatically create a <strong>demo booking</strong>. No payment is taken.</p></div>
   <div className="payment-summary"><h3><CreditCard size={19}/> Booking Summary</h3>
    <div className="payment-service"><StudioThumbnail booking={booking}/><div><strong>{selected.name}</strong><p>{booking.eventType}</p></div></div>
    <div className="payment-line"><CalendarDays size={16}/><span>Event date</span><strong>{formatDate(booking.date)}</strong></div>
    <div className="payment-line"><Clock3 size={16}/><span>Event time</span><strong>{to12h(booking.time)}</strong></div>
    <div className="payment-line"><MapPin size={16}/><span>Venue</span><strong>{booking.venue}</strong></div>
    <div className="demo-payment-addons">{quote.addOns.map(a=><div key={a.id}><span>{a.name}</span><strong>+{inr(a.price)}</strong></div>)}</div><div className="payment-total"><span>Illustrative Total</span><strong>{inr(quote.total)}</strong></div>
   </div>
   <div className="payment-demo-notice"><ShieldCheck size={20}/><div><strong>Test payments only</strong><p>These options simulate booking confirmation. No UPI transfer, bank/card information, or actual payment is processed.</p></div></div>
   <div className="payment-methods"><div className="payment-method-heading"><h3>Choose a demo method</h3><span>Tap to confirm <ArrowRight size={14}/></span></div>
    {PAYMENT_METHODS.map(({name,icon:Icon,detail})=><button type="button" key={name} className="demo-payment-method" disabled={Boolean(processing)} onClick={()=>void selectPayment(name)}>
     <span className="demo-payment-icon"><Icon size={19}/></span><span className="demo-payment-copy"><strong>{name}</strong><small>{detail}</small></span>
     {processing===name?<span className="demo-loading"/>:<ChevronRight size={18}/>}
    </button>)}
   </div>
   {error&&<p role="alert" className="error-text">{error}</p>}
   
   <p className="demo-watermark">A demo booking is NOT a real paid or confirmed studio reservation.</p>
  </div>
 </div>;
}

export function Confirmed(){
 const nav=useNavigate();const {booking}=useBooking();const {profile,user}=useAuth();
 const [message,setMessage]=useState(''),[sending,setSending]=useState(false);
 const chosen=SERVICES.find(s=>s.id===booking.serviceId)||SERVICES[0];
 const quote=getBookingEstimate(booking.serviceId,booking.addOns);
 const isDemo=booking.paymentStatus==='Demo Only';
 const share=()=>{try{openWhatsApp(booking);setMessage('WhatsApp opened; press Send there to share your details.');}catch(e){setMessage(e instanceof Error?e.message:'WhatsApp unavailable.');}};
 const sendToPhone=async()=>{if(!booking.requestId)return;setSending(true);try{setMessage(await sendCustomerNotification(booking.requestId,isDemo?'payment':'quotation'));}catch(e){setMessage(e instanceof Error?e.message:'Notification unavailable. Use manual share.');}finally{setSending(false);}};
 return <div className="inner-screen page-flow confirmation-screen">
  <div className="confirmation-top"><BackButton to="/home"/><Logo compact/><SignedInAvatarButton className="gcs-confirmation-avatar"/></div>
  <div className="page-padding">
   <div className="confirmation-success-visual" role="img" aria-label={isDemo?"Demo booking saved":"Quotation request saved"}><div className="success-circle"><Check size={40} strokeWidth={3}/></div></div>
   <div className="confirm-heading"><h2>{isDemo?'Demo Booking Created!':'Quotation Request Saved!'}</h2><p>{isDemo?'Your test booking was recorded successfully. No actual payment was made or reservation confirmed.':'Your quotation request has been saved. The studio will confirm actual availability and final pricing.'}</p></div>
   <div className="booking-id-box"><span>{isDemo?'Demo Reference':'Quotation Request ID'}</span><div><strong>{booking.bookingId||'Pending'}</strong><button aria-label="Copy request ID" onClick={()=>void navigator.clipboard?.writeText(booking.bookingId)}><Copy size={18}/></button></div></div>
   <div className="confirmation-details">
    <DetailLine icon={UserRound} label="Customer" value={booking.fullName}/>
    <DetailLine icon={Camera} label="Package" value={chosen.name}/>
    <DetailLine icon={CalendarDays} label="Event Date" value={formatDate(booking.date)}/>
    <DetailLine icon={Clock3} label="Event Time" value={to12h(booking.time)}/>
    <DetailLine icon={MapPin} label="Venue" value={booking.venue}/>
    <DetailLine icon={CreditCard} label="Example Amount" value={inr(quote.total)}/>
    {isDemo&&<DetailLine icon={Wallet} label="Test Method" value={booking.paymentMethod}/>}
    <DetailLine icon={ShieldCheck} label="Payment" value={isDemo?'Demo only — ₹0 collected':'Not paid'}/>
   </div>
   <div className="demo-confirm-warning">{isDemo?'This is a simulation, not proof of payment or a studio-confirmed booking.':'Request saved. The studio must still approve your booking.'}</div>
   {profile?.whatsapp_opt_in&&user&&<button className="compact-quote-action compact-quote-notify confirm-notify" disabled={sending} onClick={()=>void sendToPhone()}><Phone size={16}/>{sending?'Sending…':'Send details to my number'}</button>}
   <button className="compact-quote-action compact-quote-whatsapp confirm-share" onClick={share}><MessageCircle size={16}/> Share to my WhatsApp</button>
   {message&&<p className="share-guidance" role="status">{message}</p>}
   <OutlineButton onClick={()=>nav('/bookings')} className="confirm-view">View My Bookings <ArrowRight size={17}/></OutlineButton><button className="confirm-preview" onClick={()=>nav('/home')}>Return Home <ChevronRight size={15}/></button>
   <button className="confirm-preview" onClick={()=>nav('/whatsapp')}>Preview message <ChevronRight size={15}/></button>
  </div>
 </div>;
}

export function WhatsApp(){
 const nav=useNavigate();const {booking}=useBooking();const [error,setError]=useState('');
 const share=()=>{try{openWhatsApp(booking);}catch(e){setError(e instanceof Error?e.message:'Unable to open WhatsApp.');}};
 return <div className="inner-screen page-flow whatsapp-page">
  <Header title="Message Preview" back="/confirmed"/><div className="page-padding">
   <div className="preview-notice"><MessageCircle size={21}/><div><strong>Ready to share</strong><p>Share the message to your registered number {booking.phone||'(number missing)'}</p></div></div>
   <pre className="whatsapp-preview">{bookingMessage(booking)}</pre>
   <p className="demo-watermark">WhatsApp opens a draft. You must tap Send; automatic delivery needs studio integration.</p>
   {error&&<p role="alert" className="error-text">{error}</p>}
   <PrimaryButton green onClick={share}>Open WhatsApp</PrimaryButton>
   <OutlineButton onClick={()=>void shareDetails(booking)} className="confirm-view">Share with another app <ArrowRight size={16}/></OutlineButton>
  </div>
 </div>;
}
