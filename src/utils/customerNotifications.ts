import {requiredSupabase} from '../lib/supabase';
import type {Booking} from '../context/BookingContext';
import {getQuote} from '../data/services';
export async function saveEnquiry(booking:Booking,userId:string):Promise<string>{
 if(booking.requestId)return booking.requestId;
 if(!booking.date||!booking.eventType||!booking.venue||!booking.time)throw new Error('Fill in event details before getting your quotation.');
 const sb=requiredSupabase(),total=getQuote(booking.serviceId).total;
 const {data,error}=await sb.from('gcs_booking_requests').insert({
  user_id:userId,package_id:booking.serviceId,event_type:booking.eventType,event_date:booking.date,
  event_time:booking.time,venue:booking.venue,notes:booking.notes,estimated_amount:total,payment_status:'not_paid'
 }).select('id').single();
 if(error)throw error;
 return data.id as string;
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
