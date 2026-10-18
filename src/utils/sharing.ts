import type {Booking} from '../context/BookingContext';
import {SERVICES,inr,getQuote,formatDate,to12h} from '../data/services';
export function bookingMessage(b:Booking):string{
 const chosen=SERVICES.find(s=>s.id===b.serviceId)||SERVICES[0];
 return [
 'Gokul Creative Studio — Customer Quotation Request',
 b.bookingId?'Request reference: '+b.bookingId:'Quotation preview',
 'Customer: '+b.fullName,
 'Registered mobile: '+b.phone,
 'Package: '+chosen.name,
 'Event: '+(b.eventType||'Not selected'),
 'Event date: '+formatDate(b.date),
 'Event time: '+to12h(b.time)+' IST',
 'Venue: '+b.venue,
 'Estimated package amount: '+inr(getQuote(b.serviceId).total),
 b.paymentStatus==='Demo Only'?'Payment: DEMO ONLY - no funds collected':'Payment status: NOT PAID',
 'This demo is not a confirmed, paid studio reservation. Final price and availability require studio approval.'
 ].join('\n');
}
// Explicit user-initiated WhatsApp share to the phone number on their own account.
// This OPENS a prefilled chat. It does not deliver a message automatically.
export const whatsappLink=(b:Booking)=>{
 const phone=b.phone.replace(/\D/g,'');
 return `https://wa.me/${phone}?text=${encodeURIComponent(bookingMessage(b))}`;
};
export function openWhatsApp(b:Booking){
 if(!/^\+?[1-9]\d{7,14}$/.test(b.phone.replace(/[\s()-]/g,'')))throw new Error('Add a valid registered WhatsApp number in your profile.');
 window.open(whatsappLink(b),'_blank','noopener,noreferrer');
}
export async function shareDetails(b:Booking){
 if(navigator.share){try{await navigator.share({title:'Gokul Studio Quotation',text:bookingMessage(b)});return;}catch{}}
 openWhatsApp(b);
}
