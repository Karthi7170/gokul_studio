import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, Camera, Check, CheckCircle2, ChevronRight, Clipboard, Clock3, Copy, CreditCard, Download, FileText, Landmark, Lock, Mail, MapPin, MessageCircle, Phone, UserRound, Wallet } from 'lucide-react';
import { BackButton, DetailLine, Header, Logo, OutlineButton, PrimaryButton, ScreenTitle, StatusBadge, Stepper } from '../components/UI';
import { useBooking } from '../context/BookingContext';
import { SERVICES, IMAGE_URL, formatDate, inr, getQuote, to12h } from '../data/services';
import { downloadQuotation } from '../utils/quotationPdf';
import { bookingMessage, openWhatsApp, shareDetails } from '../utils/sharing';
const methodNames=['UPI','Credit / Debit Card','Net Banking','Wallets'] as const;
const methodIcons=[CreditCard,CreditCard,Landmark,Wallet];
export function Quotation(){
 const nav=useNavigate();const {booking}=useBooking();const selected=SERVICES.find(s=>s.id===booking.serviceId)!;const quote=getQuote(booking.serviceId);
 return <div className="inner-screen page-flow"><Header title="Quotation Details" back="/schedule"/><div className="page-padding quote-page">
 <div className="quote-brand"><Logo compact/><div className="quote-number"><strong>Quotation No.</strong><b>{booking.quotationNo}</b><small>{formatDate(booking.date)}</small></div></div>
 <section className="quote-section"><div className="quote-title"><span><UserRound size={17}/> Customer Details</span><button onClick={()=>nav('/profile')}>View</button></div><p><UserRound size={14}/>{booking.fullName}</p><p><Phone size={14}/>{booking.phone}</p><p><Mail size={14}/>{booking.email}</p></section>
 <section className="quote-section"><div className="quote-title"><span><CalendarDays size={17}/> Event Details</span><button onClick={()=>nav('/booking-details')}>✎ Edit</button></div><p><CalendarDays size={14}/>{formatDate(booking.date)}</p><p><Clock3 size={14}/>{to12h(booking.time)} IST</p><p><MapPin size={14}/>{booking.venue}</p><p><Camera size={14}/>{booking.eventType}</p></section>
 <section className="quote-section"><div className="quote-title"><span><Camera size={17}/> Selected Service Details</span><button onClick={()=>nav('/book')}>✎ Edit</button></div>
 <div className="quote-selected"><img src={IMAGE_URL(selected.image)} alt=""/><div><strong>{selected.name}</strong><p>{selected.detail}</p></div></div>
 <ul className="quote-inclusions">{selected.included.map(feature=><li key={feature}><Check size={12}/>{feature}</li>)}</ul><div className="quotation-table"><div className="quote-table-head"><span>Service</span><span>Qty</span><span>Rate</span><span>Amount</span></div>{quote.lines.map(line=><div className="quote-table-row" key={line.label}><span>{line.label}</span><span>{line.qty}</span><span>{inr(line.rate)}</span><span>{inr(line.qty*line.rate)}</span></div>)}
 <div className="quote-totals"><div><span>Subtotal</span><b>{inr(quote.subtotal)}</b></div><div><span>Discount (if any)</span><b>-{inr(quote.discount)}</b></div></div>
 <div className="quote-grand-total"><strong>Total Amount</strong><strong>{inr(quote.total)}</strong></div></div>
 </section>
 <p className="quote-disclaimer">Illustrative package estimate only; final price and inclusions require studio confirmation.</p>
 <PrimaryButton green icon={false} onClick={()=>openWhatsApp(booking)} className="quote-whatsapp"><MessageCircle size={21}/> Send Quotation on WhatsApp <ArrowRight size={18}/></PrimaryButton>
 <OutlineButton onClick={()=>downloadQuotation(booking)} className="quote-download"><FileText size={18}/> Download / Share PDF <ArrowRight size={17}/></OutlineButton>
 <PrimaryButton onClick={()=>nav('/payment')} className="bottom-cta">Continue to Payment</PrimaryButton>
 </div></div>;
}
export function Payment(){
 const nav=useNavigate();const {booking,update,confirm}=useBooking();const [loading,setLoading]=useState(false);const selected=SERVICES.find(s=>s.id===booking.serviceId)!;const quote=getQuote(booking.serviceId);
 const pay=()=>{setLoading(true);window.setTimeout(()=>{confirm();setLoading(false);nav('/confirmed',{replace:true});},900)};
 return <div className="inner-screen page-flow payment-screen"><Header title="Payment Details" back="/quotation"/><div className="page-padding">
 <div className="payment-logo"><Logo compact/></div><div className="payment-summary"><h3><CreditCard size={19}/> Booking Summary</h3>
 <div className="payment-service"><img src={IMAGE_URL(selected.image)} alt=""/><div><strong>{selected.name}</strong><p>Selected package · Illustrative estimate</p></div></div>
 <div className="payment-line"><CalendarDays size={16}/><span>Event Date</span><strong>{formatDate(booking.date)}</strong></div>
 <div className="payment-line"><MapPin size={16}/><span>Venue</span><strong>{booking.venue}</strong></div>
 <div className="payment-total"><span>₹ &nbsp; Total Amount</span><strong>{inr(quote.total)}</strong></div></div>
 <div className="payment-methods-heading"><h3>Select Payment Method</h3><small><CheckCircle2 size={13}/> 100% Secure Payment</small></div>
 <div className="payment-options">{methodNames.map((m,i)=>{const Icon=methodIcons[i];return <button key={m} className={`payment-option ${booking.paymentMethod===m?'chosen':''}`} onClick={()=>update({paymentMethod:m})}><span className={`radio-circle ${booking.paymentMethod===m?'checked':''}`}/><Icon size={20}/><div><strong>{m}</strong><small>{['Google Pay, PhonePe, Paytm','Visa, MasterCard, RuPay, American Express','All major banks supported','Paytm Wallet, Amazon Pay, Mobikwik'][i]}</small></div>{i!==0&&<ChevronRight size={16}/>}</button>})}</div>
 <PrimaryButton className="bottom-cta" loading={loading} onClick={pay}>{loading?'Processing demo payment...':`Pay Now ${inr(quote.total)}`}</PrimaryButton>
 <div className="whatsapp-note"><MessageCircle size={17}/> Payment confirmation will be sent on WhatsApp</div>
 <p className="demo-watermark">Simulation only: no money is collected, no payment gateway is connected.</p>
 </div></div>;
}
export function Confirmed(){
 const nav=useNavigate();const {booking}=useBooking();const [copied,setCopied]=useState(false);const selected=SERVICES.find(s=>s.id===booking.serviceId)!;const quote=getQuote(booking.serviceId);
 const doCopy=async()=>{try{await navigator.clipboard.writeText(booking.bookingId);setCopied(true);}catch{setCopied(false);}};
 return <div className="inner-screen page-flow confirmation-screen"><div className="confirmation-top"><BackButton to="/home"/><Logo compact/><span/></div><div className="page-padding">
 <div className="confetti">◆ <span>•</span> ✦ <i>◆</i> ✧ <span>•</span> ✦</div>
 <div className="success-circle"><Check size={46} strokeWidth={3.8}/></div>
 <div className="confirm-heading"><h2>Booking Confirmed!</h2><p>Thank you for choosing<br/>Gokul Creative Studio.<br/>Your booking has been successfully<br/>confirmed.</p></div>
 <div className="booking-id-box"><span>Your Unique Booking ID</span><div><strong>{booking.bookingId||'GCS-20261007-001'}</strong><button aria-label="Copy booking ID" onClick={doCopy}>{copied?<Check size={19}/>:<Copy size={20}/>}</button></div>{copied&&<small>Copied!</small>}</div>
 <div className="confirmation-details"><DetailLine icon={UserRound} label="Customer Name" value={booking.fullName}/><DetailLine icon={Camera} label="Event Type" value={booking.eventType}/><DetailLine icon={CalendarDays} label="Event Date" value={formatDate(booking.date)}/><DetailLine icon={Clock3} label="Event Time" value={to12h(booking.time)}/><DetailLine icon={MapPin} label="Location" value={booking.venue}/><DetailLine icon={BadgeCheck} label="Selected Package" value={selected.name}/><DetailLine icon={CreditCard} label="Total Amount" value={inr(quote.total)}/><div className="detail-line"><CheckCircle2 size={16} color="#16A34A"/><span>Payment Status</span><StatusBadge status={booking.paymentStatus}/></div></div>
 <PrimaryButton green icon={false} className="confirm-whatsapp" onClick={()=>{openWhatsApp(booking);nav('/whatsapp');}}><MessageCircle size={19}/> Send on WhatsApp <ArrowRight size={18}/></PrimaryButton>
 <OutlineButton className="confirm-view" onClick={()=>nav('/home')}><FileText size={18}/> View Booking <ArrowRight size={17}/></OutlineButton>
 <button className="confirm-preview" onClick={()=>nav('/whatsapp')}>Preview WhatsApp confirmation <ChevronRight size={15}/></button>
 </div></div>;
}
export function WhatsApp(){
 const nav=useNavigate();const {booking}=useBooking();const selected=SERVICES.find(s=>s.id===booking.serviceId)!;const quote=getQuote(booking.serviceId);
 return <div className="inner-screen page-flow whatsapp-page"><Header title="WhatsApp Confirmation" back="/confirmed"/><div className="whatsapp-logo"><Logo compact/></div>
 <div className="chat-view"><div className="chat-topbar"><ArrowLeft size={19}/><span className="chat-avatar"><Camera size={19}/></span><div><strong>Gokul Creative Studio</strong><small>Online</small></div><div className="chat-actions"><Camera size={17}/><Phone size={17}/><span>⋮</span></div></div>
 <div className="chat-content"><div className="chat-date">Today</div><div className="chat-outgoing">Hi, I have completed the payment for my booking.<small>9:40 AM ✓✓</small></div>
 <div className="chat-inbound"><p>Hi <strong>{booking.fullName}</strong>,<br/>Thank you for your payment! 🎉<br/>Your booking has been <b>confirmed</b> with Gokul Creative Studio.</p>
 <div className="chat-detail"><span>🧧 Booking ID</span><strong>{booking.bookingId||'GCS-20261007-001'}</strong></div>
 <div className="chat-detail"><span>▣ Quotation No.</span><strong>{booking.quotationNo}</strong></div>
 <div className="chat-detail"><span>▧ Event</span><strong>{selected.name}</strong></div>
 <div className="chat-detail"><span>▣ Event Date</span><strong>{formatDate(booking.date)}</strong></div>
 <div className="chat-detail"><span>◷ Event Time</span><strong>{to12h(booking.time)}</strong></div>
 <div className="chat-detail"><span>⚲ Location</span><strong>{booking.venue}</strong></div>
 <div className="chat-detail"><span>₹ Total Amount</span><strong>{inr(quote.total)}</strong></div>
 <div className="chat-detail"><span>✅ Payment Status</span><strong className="green">{booking.paymentStatus}</strong></div>
 <p>Thank you for choosing Gokul Creative Studio. We're excited to be part of your special day! ❤️</p><small>9:41 AM ✓✓</small></div></div>
 <div className="chat-input"><span>☻ &nbsp; Type a message</span><span>📎　▣</span><span className="voice-bubble">●</span></div></div>
 <div className="chat-bottom"><OutlineButton onClick={()=>nav('/confirmed')}><ArrowLeft size={17}/> Back to App</OutlineButton><PrimaryButton onClick={()=>shareDetails(booking)} icon={false}><span className="share-icon">↗</span> Share Details</PrimaryButton></div>
 <button className="chat-open-link" onClick={()=>openWhatsApp(booking)}>Open this message in real WhatsApp <ArrowRight size={14}/></button>
 </div>;
}
