import type {Booking} from '../context/BookingContext';
import {getBookingEstimate} from '../data/services';
import {requiredSupabase} from './supabase';

export async function submitQuoteRequest(booking:Booking,userId:string):Promise<string>{
 const now=new Date();
 const today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 if(!booking.eventType.trim()||!booking.venue.trim()||!/^\d{4}-\d{2}-\d{2}$/.test(booking.date)||booking.date<today||!/^([01]\d|2[0-3]):[0-5]\d$/.test(booking.time))throw new Error('Choose a future event date, time and venue before continuing.');
 const api=requiredSupabase();
 const {data,error}=await api.from('gcs_booking_requests').insert({
  user_id:userId,package_id:booking.serviceId,event_type:booking.eventType,
  event_date:booking.date,event_time:booking.time,venue:booking.venue.trim(),
  notes:booking.notes,add_ons:booking.addOns,estimated_amount:getBookingEstimate(booking.serviceId,booking.addOns).total,
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
