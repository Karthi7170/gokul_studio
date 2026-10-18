import {requiredSupabase} from '../lib/supabase';
import type {Booking} from '../context/BookingContext';
import {submitQuoteRequest} from '../lib/requests';
export async function saveEnquiry(booking:Booking,userId:string):Promise<string>{
 if(booking.requestId)return booking.requestId;
 return submitQuoteRequest(booking,userId);
}
export async function sendCustomerNotification(requestId:string,kind:'quotation'|'payment'){
 const sb=requiredSupabase();
 const {data:{session}}=await sb.auth.getSession();
 if(!session)throw new Error('Please sign in again.');
 const res=await fetch('/api/notify',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+session.access_token},body:JSON.stringify({requestId,kind})});
 const data=await res.json().catch(()=>({}));
 if(!res.ok)throw new Error(data.error||'Unable to send WhatsApp notification.');
 return String(data.message||'WhatsApp notification accepted');
}
