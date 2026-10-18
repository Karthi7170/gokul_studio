import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowRight,BadgeCheck,CalendarDays,Camera,Check,CheckCircle2,ChevronRight,Clock3,Copy,CreditCard,Download,FileText,Mail,MapPin,MessageCircle,Phone,ShieldCheck,UserRound,Wallet} from 'lucide-react';
import {BackButton,DetailLine,Header,Logo,OutlineButton,PrimaryButton} from '../components/UI';
import {useBooking} from '../context/BookingContext';
import {useAuth} from '../context/AuthContext';
import {SERVICES,IMAGE_URL,THUMBNAIL_URL,formatDate,inr,getQuote,to12h} from '../data/services';
import {downloadQuotation} from '../utils/quotationPdf';
import {bookingMessage,openWhatsApp,shareDetails} from '../utils/sharing';
import {submitQuoteRequest} from '../lib/requests';
import {saveEnquiry,sendCustomerNotification} from '../utils/customerNotifications';
function WhatsAppAction({onClick,children}:{onClick:()=>void;children:React.ReactNode}){return <button className="whatsapp-manual" onClick={onClick}><MessageCircle size={18}/>{children}<ArrowRight size={16}/></button>}
export function Quotation(){
 const nav=useNavigate();const {booking,update}=useBooking();const {profile,user}=useAuth();
 const selected=SERVICES.find(s=>s.id===booking.serviceId)||SERVICES[0];const quote=getQuote(booking.serviceId);
 const [message,setMessage]=useState(''),[sending,setSending]=useState(false);
 const sendToPhone=async()=>{if(!user){setMessage('Please sign in first.');return;}setSending(true);setMessage('');
  try{const id=await saveEnquiry(booking,user.id);update({requestId:id,bookingId:'GCS-RQ-'+id.slice(0,8).toUpperCase(),quotationNo:'GCS-QT-'+id.slice(0,8).toUpperCase()});setMessage(await sendCustomerNotification(id,'quotation'));}
  catch(e){setMessage(e instanceof Error?e.message:'Could not send the quotation. Download it instead.');}finally{setSending(false);}
 };
 const share=()=>{try{openWhatsApp(booking);setMessage('WhatsApp opened with a prefilled message. Tap Send there to share it to your registered number.');}catch(e){setMessage(e instanceof Error?e.message:'Could not open WhatsApp.');}};
 return <div className="inner-screen page-flow"><Header title="Your Quotation" back="/schedule"/><div className="page-padding quote-page">
 <div className="quote-brand"><Logo compact/><div className="quote-number"><strong>Customer estimate</strong><b>GCS / {selected.id.toUpperCase()}</b><small>{formatDate(booking.date)}</small></div></div>
 <div className="checkout-heading"><span>STEP 03 / 04</span><h2>Almost your perfect moment.</h2><p>Check your event details and what the package includes.</p></div>
 <section className="quote-section"><div className="quote-title"><span><UserRound size={17}/> Your Account</span><button onClick={()=>nav('/profile')}>Edit phone</button></div><p><UserRound size={14}/>{booking.fullName||'Complete your profile'}</p><p><Phone size={14}/>{booking.phone||'Add your mobile number'}</p><p><Mail size={14}/>{booking.email}</p></section>
 <section className="quote-section"><div className="quote-title"><span><CalendarDays size={17}/> Your Event</span><button onClick={()=>nav('/booking-details')}>Edit</button></div><p><Camera size={14}/>{booking.eventType}</p><p><CalendarDays size={14}/>{formatDate(booking.date)}</p><p><Clock3 size={14}/>{to12h(booking.time)} IST</p><p><MapPin size={14}/>{booking.venue}</p></section>
 <section className="quote-section"><div className="quote-title"><span><Camera size={17}/> Package Inclusions</span><button onClick={()=>nav('/book')}>Change</button></div><div className="quote-selected"><img src={THUMBNAIL_URL(selected)} alt={selected.name} onError={e=>{e.currentTarget.src=IMAGE_URL(selected.image)}}/><div><strong>{selected.name}</strong><p>{selected.detail}</p></div></div>
 <ul className="quote-inclusions">{selected.included.map(feature=><li key={feature}><Check size={12}/>{feature}</li>)}</ul>
 <div className="quotation-table"><div className="quote-table-row"><span>{selected.name}</span><span>1</span><span>{inr(quote.total)}</span><span>{inr(quote.total)}</span></div><div className="quote-grand-total"><strong>Estimated Total</strong><strong>{inr(quote.total)}</strong></div></div></section>
 <p className="quote-disclaimer">Indicative pricing. The final quotation and delivery terms require studio approval.</p>
 <PrimaryButton loading={sending} disabled={!profile?.whatsapp_opt_in||sending} onClick={()=>void sendToPhone()} className="notify-customer"><Phone size={17}/> Send quotation to my number</PrimaryButton>
 <WhatsAppAction onClick={share}>Open WhatsApp to share manually</WhatsAppAction>
 {message&&<p className="share-guidance" role="status">{message}</p>}
 <OutlineButton onClick={()=>downloadQuotation(booking)} className="quote-download"><FileText size={17}/> Download Quotation PDF <Download size={16}/></OutlineButton>
 <PrimaryButton onClick={()=>nav('/payment')} className="bottom-cta"><ShieldCheck size={17}/> Review Payment Information</PrimaryButton>
 <div className="checkout-consent-note">{profile?.whatsapp_opt_in?'WhatsApp preferences saved. Automatic studio messages require messaging integration.':'For studio-initiated WhatsApp updates, enable consent in My Account.'}</div>
 </div></div>;
}
export function Payment(){
 const nav=useNavigate();const {booking,update}=useBooking();const {user}=useAuth();
 const [loading,setLoading]=useState(false),[error,setError]=useState(''),[sending,setSending]=useState(false),[delivery,setDelivery]=useState('');
 const selected=SERVICES.find(s=>s.id===booking.serviceId)||SERVICES[0];const quote=getQuote(booking.serviceId);
 const sendPayment=async()=>{if(!user){setDelivery('Please sign in first.');return;}setSending(true);setDelivery('');try{const id=await saveEnquiry(booking,user.id);update({requestId:id,bookingId:'GCS-RQ-'+id.slice(0,8).toUpperCase()});setDelivery(await sendCustomerNotification(id,'payment'));}catch(e){setDelivery(e instanceof Error?e.message:'Could not send payment details.');}finally{setSending(false);}};
 const submit=async()=>{if(!user){setError('Please sign in first.');return;}if(booking.requestId){nav('/confirmed');return;}
  setLoading(true);setError('');
  try{const id=await submitQuoteRequest(booking,user.id);
   update({requestId:id,bookingId:'GCS-RQ-'+id.slice(0,8).toUpperCase(),quotationNo:'GCS-QT-'+id.slice(0,8).toUpperCase(),paymentStatus:'Pending'});
   nav('/confirmed',{replace:true});
  }catch(e){setError(e instanceof Error?e.message:'Could not submit the request.');}finally{setLoading(false);}
 };
 return <div className="inner-screen page-flow payment-screen"><Header title="Payment & Request" back="/quotation"/><div className="page-padding">
 <div className="checkout-heading"><span>STEP 04 / 04</span><h2>Review before requesting</h2><p>No payment will be charged now.</p></div>
 <div className="payment-summary"><h3><CreditCard size={19}/> Quotation Summary</h3><div className="payment-service"><img src={THUMBNAIL_URL(selected)} alt={selected.name} onError={e=>{e.currentTarget.src=IMAGE_URL(selected.image)}}/><div><strong>{selected.name}</strong><p>Indicative package rate</p></div></div>
 <div className="payment-line"><CalendarDays size={16}/><span>Event date</span><strong>{formatDate(booking.date)}</strong></div>
 <div className="payment-line"><MapPin size={16}/><span>Venue</span><strong>{booking.venue}</strong></div>
 <div className="payment-line"><Phone size={16}/><span>Registered phone</span><strong>{booking.phone||'Not provided'}</strong></div>
 <div className="payment-total"><span>Estimated amount</span><strong>{inr(quote.total)}</strong></div></div>
 <div className="payment-pending-box"><ShieldCheck size={21}/><div><strong>Payment is not available online yet</strong><p>Submit your request below. The studio will confirm availability, the final amount, and verified payment instructions directly.</p></div></div>
 {error&&<p className="error-text" role="alert">{error}</p>}
 <PrimaryButton loading={sending} disabled={sending} onClick={()=>void sendPayment()} className="notify-customer"><Phone size={17}/> Send payment information to my number</PrimaryButton>
 {delivery&&<p role="status" className="share-guidance">{delivery}</p>}
 <PrimaryButton loading={loading} disabled={!booking.phone||!booking.email||loading} onClick={()=>void submit()} className="bottom-cta">Submit Quotation Request</PrimaryButton>
 <p className="demo-watermark">No payment is collected. Status remains NOT PAID.</p>
 </div></div>;
}
export function Confirmed(){
 const nav=useNavigate();const {booking}=useBooking();const [message,setMessage]=useState('');
 const chosen=SERVICES.find(s=>s.id===booking.serviceId)||SERVICES[0];const quote=getQuote(booking.serviceId);
 const share=()=>{try{openWhatsApp(booking);setMessage('WhatsApp opened; press Send to share the quotation with the registered number.');}catch(e){setMessage(e instanceof Error?e.message:'WhatsApp unavailable.');}};
 return <div className="inner-screen page-flow confirmation-screen"><div className="confirmation-top"><BackButton to="/home"/><Logo compact/><span/></div><div className="page-padding">
 <div className="success-circle"><Check size={45}/></div><div className="confirm-heading"><h2>Request received!</h2><p>Your quotation request was saved securely.<br/>Gokul Creative Studio will review your event details.</p></div>
 <div className="booking-id-box"><span>Quotation Request ID</span><div><strong>{booking.bookingId||'Pending'}</strong><button aria-label="Copy request ID" onClick={()=>navigator.clipboard.writeText(booking.bookingId)}><Copy size={17}/></button></div></div>
 <div className="confirmation-details"><DetailLine icon={UserRound} label="Customer" value={booking.fullName}/><DetailLine icon={Phone} label="Registered Number" value={booking.phone}/><DetailLine icon={Camera} label="Package" value={chosen.name}/><DetailLine icon={CalendarDays} label="Event date" value={formatDate(booking.date)}/><DetailLine icon={MapPin} label="Venue" value={booking.venue}/><DetailLine icon={CreditCard} label="Illustrative Estimate" value={inr(quote.total)}/><DetailLine icon={ShieldCheck} label="Payment" value="Not paid — awaiting studio instructions"/></div>
 <WhatsAppAction onClick={share}>Share request to my WhatsApp</WhatsAppAction>{message&&<p role="status" className="share-guidance">{message}</p>}
 <OutlineButton onClick={()=>nav('/home')} className="confirm-view">Back to Home <ArrowRight size={17}/></OutlineButton>
 <button onClick={()=>nav('/whatsapp')} className="confirm-preview">Preview message <ChevronRight size={16}/></button>
 </div></div>;
}
export function WhatsApp(){
 const nav=useNavigate();const {booking}=useBooking();const [error,setError]=useState('');
 const share=()=>{try{openWhatsApp(booking);}catch(e){setError(e instanceof Error?e.message:'Unable to open WhatsApp');}};
 return <div className="inner-screen page-flow whatsapp-page"><Header title="Message Preview" back="/confirmed"/><div className="page-padding">
 <div className="preview-notice"><MessageCircle size={21}/><div><strong>Ready to share</strong><p>Message addressed to your registered WhatsApp number: {booking.phone}</p></div></div>
 <pre className="whatsapp-preview">{bookingMessage(booking)}</pre>
 <p className="demo-watermark">This is a preview. The message is only delivered if you press Send in WhatsApp. Automatic sending is not enabled.</p>
 {error&&<p role="alert" className="error-text">{error}</p>}
 <PrimaryButton green onClick={share}>Open WhatsApp</PrimaryButton>
 <OutlineButton onClick={()=>void shareDetails(booking)} className="confirm-view">Share with another app <ArrowRight size={16}/></OutlineButton>
 </div></div>;
}
