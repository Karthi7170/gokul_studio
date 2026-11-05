import type {Booking} from '../context/BookingContext';
import {getBookingEstimate} from '../data/services';
export type DemoBookingRow={
 id:string;customer_name:string;package_id:string;event_type:string;event_date:string|null;event_time:string|null;
 venue:string;estimated_amount:number;payment_status:string;payment_method:string|null;
 add_ons:string[];created_at:string;notes:string;
};
const STORAGE_KEY='gcs-demo-bookings-v2';
export function readDemoBookings():DemoBookingRow[]{
 try{const parsed:unknown=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return Array.isArray(parsed)?parsed.filter((r):r is DemoBookingRow=>Boolean(r&&typeof r==='object'&&typeof r.id==='string')):[];}
 catch{return [];}
}
function save(rows:DemoBookingRow[]){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(rows.slice(0,100)));}catch{throw new Error('Cannot save demo booking. Enable browser storage or free up device space.');}}
export async function submitQuoteRequest(booking:Booking,_userId:string):Promise<string>{
 const now=new Date();
 const today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 if(!booking.eventType.trim()||!booking.venue.trim()||!/^\d{4}-\d{2}-\d{2}$/.test(booking.date)||booking.date<today||!/^([01]\d|2[0-3]):[0-5]\d$/.test(booking.time))throw new Error('Choose a future event date, time and venue before continuing.');
 const id=typeof crypto!=='undefined'&&typeof crypto.randomUUID==='function'?crypto.randomUUID():`demo-${Date.now()}-${Math.random().toString(36).slice(2,12)}`;
 const row:DemoBookingRow={id,customer_name:booking.fullName.trim(),package_id:booking.serviceId,event_type:booking.eventType,event_date:booking.date,event_time:booking.time,venue:booking.venue.trim(),notes:booking.notes,add_ons:booking.addOns,estimated_amount:getBookingEstimate(booking.serviceId,booking.addOns).total,payment_status:'not_paid',payment_method:null,created_at:new Date().toISOString()};
 save([row,...readDemoBookings()]);
 return id;
}
export async function completeDemoPayment(booking:Booking,userId:string,method:Booking['paymentMethod']):Promise<string>{
 // Old Supabase request IDs can survive in a draft after switching to local demo mode.
 // Create a local record when the draft points to a nonexistent local booking.
 let rows=readDemoBookings();
 let row=booking.requestId?rows.find(r=>r.id===booking.requestId):undefined;
 if(!row){
  const newId=await submitQuoteRequest(booking,userId);
  rows=readDemoBookings();
  row=rows.find(r=>r.id===newId);
 }
 if(!row)throw new Error('Unable to save this demo booking. Please check browser storage.');
 row.payment_status='demo_only';row.payment_method=method;
 save(rows);
 return row.id;
}
