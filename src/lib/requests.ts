import type {Booking} from '../context/BookingContext';
import {getQuote} from '../data/services';
import {requiredSupabase} from './supabase';

export async function submitQuoteRequest(booking:Booking,userId:string):Promise<string>{
 if(!booking.eventType.trim()||!booking.venue.trim())throw new Error('Enter an event type and venue before continuing.');
 const api=requiredSupabase();
 const {data,error}=await api.from('gcs_booking_requests').insert({
  user_id:userId,package_id:booking.serviceId,event_type:booking.eventType,
  event_date:null,event_time:null,venue:booking.venue.trim(),
  location_url:booking.locationUrl||null,
  notes:booking.notes,estimated_amount:getQuote(booking.serviceId).total,
  payment_status:'not_paid'
 }).select('id').single();
 if(error)throw error;
 return String(data.id);
}

/**
 * Demo only: updates a booking request to a visibly non-financial state.
 * Neither this function nor its database status is evidence of real payment.
 */
export async function completeDemoPayment(booking:Booking,userId:string,method:Booking['paymentMethod']):Promise<string>{
 const api=requiredSupabase();
 const requestId=booking.requestId||await submitQuoteRequest(booking,userId);
 const {data,error}=await api.from('gcs_booking_requests')
  .update({payment_status:'demo_only',payment_method:method})
  .eq('id',requestId).eq('user_id',userId).select('id').single();
 if(error)throw error;
 if(!data)throw new Error('Could not record the demo booking.');
 return String(data.id);
}
