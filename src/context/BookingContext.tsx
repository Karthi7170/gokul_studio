import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {type ServiceId} from '../data/services';
import {useAuth} from './AuthContext';
export type Booking={
 fullName:string;email:string;phone:string;serviceId:ServiceId;eventType:string;
 date:string;time:string;venue:string;notes:string;
 paymentMethod:'UPI'|'Credit / Debit Card'|'Net Banking'|'Wallets';
 paymentStatus:'Pending'|'Confirmed'|'Demo Only';bookingId:string;quotationNo:string;
 requestId:string;
};
export const initialBooking:Booking={
 fullName:'',email:'',phone:'',serviceId:'wedding',eventType:'',date:'',time:'',venue:'',notes:'',
 paymentMethod:'UPI',paymentStatus:'Pending',bookingId:'',quotationNo:'',requestId:''
};
type BookingStore={booking:Booking;update:(p:Partial<Booking>)=>void;confirm:()=>string;reset:()=>void};
const Context=createContext<BookingStore|null>(null);
function read(id:string):Booking{
 try{const raw=localStorage.getItem('gcs-draft:'+id);if(!raw)return {...initialBooking};
 const saved=JSON.parse(raw) as Partial<Booking> & {locationUrl?:string};
 delete saved.locationUrl;
 const allowed:ServiceId[]=['wedding','photography','baby','prewedding','videography','events'];
 return {...initialBooking,...saved,serviceId:saved.serviceId&&allowed.includes(saved.serviceId)?saved.serviceId:'wedding',
  fullName:'',email:'',phone:''};}catch{return {...initialBooking};}
}
export function BookingProvider({children}:{children:ReactNode}){
 const {user,profile}=useAuth();
 const id=user?.id||null;
 const [entry,setEntry]=useState<{owner:string|null;booking:Booking}>({owner:null,booking:{...initialBooking}});
 useEffect(()=>{try{localStorage.removeItem('gcs-demo-booking-v1');localStorage.removeItem('gcs-demo-auth-v1');}catch{}},[]);
 useEffect(()=>{setEntry({owner:id,booking:id?read(id):{...initialBooking}})},[id]);
 useEffect(()=>{if(id&&entry.owner===id){try{localStorage.setItem('gcs-draft:'+id,JSON.stringify({...entry.booking,fullName:'',email:'',phone:''}));}catch{}}},[id,entry]);
 const booking={...(entry.owner===id?entry.booking:initialBooking),
  fullName:profile?.full_name||String(user?.user_metadata?.full_name||''),
  phone:profile?.phone||String(user?.user_metadata?.phone||''),
  email:user?.email||''};
 const update=(p:Partial<Booking>)=>setEntry(prev=>{
   const changed=['serviceId','date','time','venue','eventType','notes'].some(k=>k in p);
   return {owner:id,booking:{...(prev.owner===id?prev.booking:initialBooking),...(changed?{bookingId:'',requestId:'',paymentStatus:'Pending' as const}:{}),...p}};
 });
 const confirm=()=>{const code=booking.bookingId||('GCS-'+new Date().getFullYear()+'-'+String(Date.now()).slice(-6));update({bookingId:code,paymentStatus:'Pending'});return code;};
 const reset=()=>update({...initialBooking});
 return <Context.Provider value={{booking,update,confirm,reset}}>{children}</Context.Provider>;
}
export function useBooking(){const value=useContext(Context);if(!value)throw Error('useBooking must be inside BookingProvider');return value;}
