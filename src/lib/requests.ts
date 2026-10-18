import type {Booking} from '../context/BookingContext';
import {getQuote} from '../data/services';
import {requiredSupabase} from './supabase';
export async function submitQuoteRequest(booking:Booking, userId:string):Promise<string>{
 if(!booking.eventType||!booking.date||!booking.time||!booking.venue.trim())throw new Error('Please complete the event details and preferred date.');
 const api=requiredSupabase();
 // Status is intentionally not_paid: this app has no connected payment processor.
 const {data,error}=await api.from('gcs_booking_requests').insert({
  user_id:userId,package_id:booking.serviceId,event_type:booking.eventType,
  event_date:booking.date,event_time:booking.time,venue:booking.venue.trim(),
  notes:booking.notes,estimated_amount:getQuote(booking.serviceId).total,payment_status:'not_paid'
 }).select('id').single();
 if(error)throw error;
 return String(data.id);
}
