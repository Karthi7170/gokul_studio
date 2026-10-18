import {useNavigate} from 'react-router-dom';
import {ArrowRight,CalendarDays,Camera,Check,ChevronRight,Clock3,Film,ImagePlus,MapPin,Phone,Radio,ShieldCheck,Video} from 'lucide-react';
import {Header} from '../components/UI';
import {useBooking} from '../context/BookingContext';
import {SERVICES,ADD_ONS,IMAGE_URL,THUMBNAIL_URL,inr,getBookingEstimate} from '../data/services';

const eventTypes=['Wedding','Pre-wedding','Birthday','Engagement','Corporate Event','Baby Shower','Baby Shoot','Maternity Shoot','Family Celebration','Portrait Session','Other'];
const addonIcons={drone:Camera,stream:Radio,album:ImagePlus,makeup:Film} as const;
function todayDate(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
export function BookingDetails(){
 const nav=useNavigate();const {booking,update}=useBooking();
 const selected=SERVICES.find(s=>s.id===booking.serviceId)||SERVICES[0];
 const summary=getBookingEstimate(selected.id,booking.addOns||[]);
 const today=todayDate();
 const valid=Boolean(booking.eventType.trim()&&booking.venue.trim()&&booking.date>=today&&/^([01]\d|2[0-3]):[0-5]\d$/.test(booking.time));
 const toggle=(id:string,checked:boolean)=>update({addOns:checked?[...(booking.addOns||[]),id]:(booking.addOns||[]).filter(x=>x!==id)});
 return <div className="inner-screen page-flow iphone-booking-screen">
  <Header title="Book Your Session" back={'/packages/'+selected.id}/>
  <div className="iphone-book-form">
   <section className="iphone-book-panel">
    <div className="iphone-book-heading"><h2><span>1.</span> Select Package</h2><button onClick={()=>nav('/book')}>View packages <ArrowRight size={16}/></button></div>
    <button type="button" className="iphone-book-package" onClick={()=>nav('/book')}>
     <img src={THUMBNAIL_URL(selected)} alt="" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=IMAGE_URL(selected.image)}}/>
     <span><strong>{selected.name}</strong><small>{selected.detail}</small><b>{inr(selected.from)}</b></span><ChevronRight size={18}/>
    </button>
   </section>
   <section className="iphone-book-panel">
    <div className="iphone-book-heading"><h2><span>2.</span> Event Details</h2></div>
    <div className="iphone-book-grid">
     <label className="iphone-book-field"><span>Event Type *</span><div><Camera size={17}/><select value={booking.eventType} aria-label="Event Type" required onChange={e=>update({eventType:e.target.value})}><option value="">Select type</option>{eventTypes.map(t=><option key={t}>{t}</option>)}</select></div></label>
     <label className="iphone-book-field"><span>Event Date *</span><div><CalendarDays size={17}/><input type="date" min={today} required value={booking.date} aria-label="Event Date" onChange={e=>update({date:e.target.value})}/></div></label>
     <label className="iphone-book-field"><span>Event Time *</span><div><Clock3 size={17}/><input type="time" required value={booking.time} aria-label="Event Time" onChange={e=>update({time:e.target.value})}/></div></label>
     <label className="iphone-book-field"><span>Venue / Location *</span><div><MapPin size={17}/><input type="text" maxLength={250} placeholder="Venue or address" aria-label="Venue / Location" value={booking.venue} onChange={e=>update({venue:e.target.value})}/></div></label>
    </div>
    {Boolean(booking.date&&booking.date<today)&&<p className="iphone-book-help" role="alert">Please select today or a future event date.</p>}
    <label className="iphone-notes"><span>Special requirements (optional)</span><textarea maxLength={300} rows={2} placeholder="Tell us anything we should know about your session" value={booking.notes} onChange={e=>update({notes:e.target.value})}/></label>
   </section>
   <section className="iphone-book-panel"><div className="iphone-book-heading"><h2><span>3.</span> Contact Information</h2></div>
    <button className="iphone-contact-field" onClick={()=>nav('/profile')}><Phone size={18}/><span><small>Registered contact number</small><strong>{booking.phone||'Add your phone number'}</strong></span><ChevronRight size={16}/></button>
    <p className="iphone-book-help">This is taken from your secure account. Tap to update it.</p>
   </section>
   <section className="iphone-book-panel"><div className="iphone-book-heading"><h2><span>4.</span> Add-ons <small>(Optional)</small></h2></div>
    <p className="iphone-addons-lead">Enhance your special day with optional services.</p>
    <div className="iphone-addons-grid">{ADD_ONS.map(addon=>{const checked=(booking.addOns||[]).includes(addon.id);const Icon=addonIcons[addon.id];return <label className={checked?'iphone-addon active':'iphone-addon'} key={addon.id}>
     <Icon size={20}/><span><strong>{addon.name}</strong><small>+ {inr(addon.price)}</small></span>
     <input type="checkbox" aria-label={addon.name} checked={checked} onChange={e=>toggle(addon.id,e.target.checked)}/><i aria-hidden="true"/>
    </label>})}</div>
    <p className="iphone-book-help">Add-on availability and final prices require studio approval.</p>
   </section>
   <section className="iphone-book-panel iphone-summary">
    <div className="iphone-book-heading"><h2><span>5.</span> Booking Summary</h2></div>
    <div className="iphone-summary-row"><span>{selected.name} (base package)</span><strong>{inr(summary.base)}</strong></div>
    {summary.addOns.map(a=><div className="iphone-summary-row" key={a.id}><span>{a.name}</span><strong>{inr(a.price)}</strong></div>)}
    <div className="iphone-summary-rule"/>
    <div className="iphone-summary-row"><span>Estimated subtotal</span><strong>{inr(summary.subtotal)}</strong></div>
    <p className="iphone-summary-tax">Applicable taxes, if any, will be confirmed in the studio's final invoice.</p>
    <div className="iphone-summary-total"><strong>Total estimate</strong><strong>{inr(summary.total)}</strong></div>
   </section>
   <button className="iphone-book-submit" disabled={!valid} onClick={()=>nav('/payment')}>Continue to Demo Payment <ArrowRight size={20}/></button>
   <p className="iphone-book-disclaimer"><ShieldCheck size={14}/> This is a demo booking request. No actual payment will be collected.</p>
  </div>
 </div>;
}
