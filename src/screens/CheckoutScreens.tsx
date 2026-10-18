import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowRight,Camera,Check,CheckCircle2,ChevronRight,Copy,CreditCard,Download,FileText,Landmark,Mail,MapPin,MessageCircle,Phone,ShieldCheck,Smartphone,UserRound,Wallet,ExternalLink} from 'lucide-react';
import {BackButton,DetailLine,Header,Logo,OutlineButton,PrimaryButton} from '../components/UI';
import {useBooking,type Booking} from '../context/BookingContext';
import {useAuth} from '../context/AuthContext';
import {SERVICES,IMAGE_URL,THUMBNAIL_URL,inr,getQuote} from '../data/services';
import {downloadQuotation} from '../utils/quotationPdf';
import {bookingMessage,openWhatsApp,shareDetails} from '../utils/sharing';
import {completeDemoPayment} from '../lib/requests';
import {saveEnquiry,sendCustomerNotification} from '../utils/customerNotifications';

function StudioThumbnail({booking}:{booking:Booking}){
 const selected=SERVICES.find(s=>s.id===booking.serviceId)||SERVICES[0];
 return <img src={THUMBNAIL_URL(selected)} alt={selected.name} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=IMAGE_URL(selected.image)}}/>;
}
function MapsInfo({url}:{url:string}){
 if(!url)return null;
 return <a className="review-map-link" href={url} target="_blank" rel="noopener noreferrer"><MapPin size={15}/> Open the pinned venue on Google Maps <ExternalLink size={13}/></a>;
}
function generateRef(id:string){return 'GCS-RQ-'+id.slice(0,8).toUpperCase();}
function refUpdate(id:string){return {requestId:id,bookingId:generateRef(id),quotationNo:'GCS-QT-'+id.slice(0,8).toUpperCase()};}

export function Quotation(){
 const nav=useNavigate();const {booking,update}=useBooking();const {profile,user}=useAuth();
 const selected=SERVICES.find(s=>s.id===booking.serviceId)||SERVICES[0],quote=getQuote(booking.serviceId);
 const [message,setMessage]=useState(''),[sending,setSending]=useState(false);
 const sendToPhone=async()=>{
  if(!user){setMessage('Please sign in first.');return;}
  setSending(true);setMessage('');
  try{
   const id=await saveEnquiry(booking,user.id);update(refUpdate(id));
   setMessage(await sendCustomerNotification(id,'quotation'));
  }catch(e){setMessage(e instanceof Error?e.message:'WhatsApp sending is not ready. Download your quotation or share it manually.');}
  finally{setSending(false);}
 };
 const share=()=>{try{openWhatsApp(booking);setMessage('WhatsApp opened. Tap Send there to share to your registered number.');}catch(e){setMessage(e instanceof Error?e.message:'Could not open WhatsApp.');}};
 return <div className="inner-screen page-flow"><Header title="Your Quotation" back="/booking-details"/><div className="page-padding quote-page">
  <div className="quote-brand"><Logo compact/><div className="quote-number"><strong>Package estimate</strong><b>GCS / {selected.id.toUpperCase()}</b><small>Personalized for you</small></div></div>
  <div className="checkout-heading"><span>STEP 03 / 04</span><h2>Almost your perfect moment.</h2><p>Review the package and location before continuing.</p></div>
  <section className="quote-section"><div className="quote-title"><span><UserRound size={17}/> Your Account</span><button onClick={()=>nav('/profile')}>Edit number</button></div>
   <p><UserRound size={14}/>{booking.fullName||'Complete your profile'}</p><p><Phone size={14}/>{booking.phone||'Add your mobile number'}</p><p><Mail size={14}/>{booking.email}</p>
  </section>
  <section className="quote-section"><div className="quote-title"><span><MapPin size={17}/> Your Event</span><button onClick={()=>nav('/booking-details')}>Edit</button></div>
   <p><Camera size={14}/>{booking.eventType||'Event not selected'}</p><p><MapPin size={14}/>{booking.venue||'Venue not entered'}</p>
   <MapsInfo url={booking.locationUrl}/>
  </section>
  <section className="quote-section"><div className="quote-title"><span><Camera size={17}/> Package Inclusions</span><button onClick={()=>nav('/book')}>Change</button></div>
   <div className="quote-selected"><StudioThumbnail booking={booking}/><div><strong>{selected.name}</strong><p>{selected.detail}</p></div></div>
   <ul className="quote-inclusions">{selected.included.map(feature=><li key={feature}><Check size={12}/>{feature}</li>)}</ul>
   <div className="quotation-table"><div className="quote-table-row"><span>{selected.name}</span><span>1</span><span>{inr(quote.total)}</span><span>{inr(quote.total)}</span></div><div className="quote-grand-total"><strong>Estimated Total</strong><strong>{inr(quote.total)}</strong></div></div>
  </section>
  <p className="quote-disclaimer">Illustrative pricing. Final scope and price require studio approval.</p>
  <div className="compact-quote-actions">
   <button className="compact-quote-action compact-quote-notify" onClick={()=>void sendToPhone()} disabled={!profile?.whatsapp_opt_in||sending}><Phone size={16}/><span>{sending?'Preparing…':'Send to my number'}</span></button>
   <button className="compact-quote-action compact-quote-whatsapp" onClick={share}><MessageCircle size={16}/><span>Share WhatsApp</span></button>
   <button className="compact-quote-action compact-quote-pdf" onClick={()=>downloadQuotation(booking)}><FileText size={16}/><span>Download PDF</span><Download size={15}/></button>
   <button className="compact-quote-action compact-quote-review" onClick={()=>nav('/payment')}><CreditCard size={16}/><span>Review Payment Options</span><ArrowRight size={16}/></button>
  </div>
  {message&&<p className="share-guidance" role="status">{message}</p>}
  <p className="checkout-consent-note">{profile?.whatsapp_opt_in?'Automatic WhatsApp delivery requires verified phone and active studio integration.':'To receive studio WhatsApp updates, enable consent in My Account.'}</p>
 </div></div>;
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
 const [error,setError]=useState(''),[requesting,setRequesting]=useState(false);
 const selected=SERVICES.find(s=>s.id===booking.serviceId)||SERVICES[0],quote=getQuote(booking.serviceId);
 const selectPayment=async(method:Booking['paymentMethod'])=>{
  if(processing||requesting)return;
  if(!user){setError('Please sign in first.');return;}
  setProcessing(method);setError('');
  try{
   const id=await completeDemoPayment(booking,user.id,method);
   update({...refUpdate(id),paymentMethod:method,paymentStatus:'Demo Only'});
   nav('/confirmed',{replace:true});
  }catch(e){setError(e instanceof Error?e.message:'Could not complete the demo. Please try again.');}
  finally{setProcessing(null);}
 };
 const requestQuote=async()=>{
  if(!user){setError('Please sign in first.');return;}
  setRequesting(true);setError('');
  try{
   const id=await saveEnquiry(booking,user.id);
   update({...refUpdate(id),paymentStatus:'Pending'});
   nav('/confirmed',{replace:true});
  }catch(e){setError(e instanceof Error?e.message:'Could not save quotation request.');}
  finally{setRequesting(false);}
 };
 return <div className="inner-screen page-flow payment-screen demo-payment-screen">
  <Header title="Payment Options" back="/quotation"/><div className="page-padding">
   <div className="checkout-heading"><span>STEP 04 / 04 · DEMO MODE</span><h2>Choose a payment method</h2><p>Tap an option to automatically create a <strong>demo booking</strong>. No payment is taken.</p></div>
   <div className="payment-summary"><h3><CreditCard size={19}/> Booking Summary</h3>
    <div className="payment-service"><StudioThumbnail booking={booking}/><div><strong>{selected.name}</strong><p>{booking.eventType}</p></div></div>
    <div className="payment-line"><MapPin size={16}/><span>Venue</span><strong>{booking.venue}</strong></div>
    <MapsInfo url={booking.locationUrl}/>
    <div className="payment-total"><span>Illustrative Amount</span><strong>{inr(quote.total)}</strong></div>
   </div>
   <div className="payment-demo-notice"><ShieldCheck size={20}/><div><strong>Test payments only</strong><p>These options simulate booking confirmation. No UPI transfer, bank/card information, or actual payment is processed.</p></div></div>
   <div className="payment-methods"><div className="payment-method-heading"><h3>Choose a demo method</h3><span>Tap to confirm <ArrowRight size={14}/></span></div>
    {PAYMENT_METHODS.map(({name,icon:Icon,detail})=><button type="button" key={name} className="demo-payment-method" disabled={Boolean(processing)||requesting} onClick={()=>void selectPayment(name)}>
     <span className="demo-payment-icon"><Icon size={19}/></span><span className="demo-payment-copy"><strong>{name}</strong><small>{detail}</small></span>
     {processing===name?<span className="demo-loading"/>:<ChevronRight size={18}/>}
    </button>)}
   </div>
   {error&&<p role="alert" className="error-text">{error}</p>}
   <button className="request-without-payment" disabled={requesting||Boolean(processing)} onClick={()=>void requestQuote()}>{requesting?'Saving request…':'Request quotation without demo payment'} <ArrowRight size={15}/></button>
   <p className="demo-watermark">A demo booking is NOT a real paid or confirmed studio reservation.</p>
  </div>
 </div>;
}

export function Confirmed(){
 const nav=useNavigate();const {booking}=useBooking();const {profile,user}=useAuth();
 const [message,setMessage]=useState(''),[sending,setSending]=useState(false);
 const chosen=SERVICES.find(s=>s.id===booking.serviceId)||SERVICES[0];
 const quote=getQuote(booking.serviceId);
 const isDemo=booking.paymentStatus==='Demo Only';
 const share=()=>{try{openWhatsApp(booking);setMessage('WhatsApp opened; press Send there to share your details.');}catch(e){setMessage(e instanceof Error?e.message:'WhatsApp unavailable.');}};
 const sendToPhone=async()=>{if(!booking.requestId)return;setSending(true);try{setMessage(await sendCustomerNotification(booking.requestId,isDemo?'payment':'quotation'));}catch(e){setMessage(e instanceof Error?e.message:'Notification unavailable. Use manual share.');}finally{setSending(false);}};
 return <div className="inner-screen page-flow confirmation-screen">
  <div className="confirmation-top"><BackButton to="/home"/><Logo compact/><span/></div>
  <div className="page-padding">
   <div className="success-circle"><Check size={44}/></div>
   <div className="confirm-heading"><h2>{isDemo?'Demo Booking Created!':'Quotation Request Saved!'}</h2><p>{isDemo?'Your test booking was recorded successfully. No actual payment was made or reservation confirmed.':'Your quotation request has been saved. The studio will confirm actual availability and final pricing.'}</p></div>
   <div className="booking-id-box"><span>{isDemo?'Demo Reference':'Quotation Request ID'}</span><div><strong>{booking.bookingId||'Pending'}</strong><button aria-label="Copy request ID" onClick={()=>void navigator.clipboard?.writeText(booking.bookingId)}><Copy size={18}/></button></div></div>
   <div className="confirmation-details">
    <DetailLine icon={UserRound} label="Customer" value={booking.fullName}/>
    <DetailLine icon={Camera} label="Package" value={chosen.name}/>
    <DetailLine icon={MapPin} label="Venue" value={booking.venue}/>
    <DetailLine icon={CreditCard} label="Example Amount" value={inr(quote.total)}/>
    {isDemo&&<DetailLine icon={Wallet} label="Test Method" value={booking.paymentMethod}/>}
    <DetailLine icon={ShieldCheck} label="Payment" value={isDemo?'Demo only — ₹0 collected':'Not paid'}/>
   </div>
   <MapsInfo url={booking.locationUrl}/>
   <div className="demo-confirm-warning">{isDemo?'This is a simulation, not proof of payment or a studio-confirmed booking.':'Request saved. The studio must still approve your booking.'}</div>
   {profile?.whatsapp_opt_in&&user&&<button className="compact-quote-action compact-quote-notify confirm-notify" disabled={sending} onClick={()=>void sendToPhone()}><Phone size={16}/>{sending?'Sending…':'Send details to my number'}</button>}
   <button className="compact-quote-action compact-quote-whatsapp confirm-share" onClick={share}><MessageCircle size={16}/> Share to my WhatsApp</button>
   {message&&<p className="share-guidance" role="status">{message}</p>}
   <OutlineButton onClick={()=>nav('/home')} className="confirm-view">Back to Home <ArrowRight size={17}/></OutlineButton>
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
