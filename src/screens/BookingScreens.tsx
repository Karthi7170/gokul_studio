import {useNavigate} from 'react-router-dom';
import {CalendarDays,Camera,ChevronRight,Clock3,MapPin,MessageSquareText} from 'lucide-react';
import {Header,PrimaryButton,Stepper} from '../components/UI';
import {useBooking} from '../context/BookingContext';
import {SERVICES,IMAGE_URL,THUMBNAIL_URL,inr} from '../data/services';

const eventTypes=['Wedding','Pre-wedding','Birthday','Engagement','Corporate Event','Baby Shower','Baby Shoot','Maternity Shoot','Family Celebration','Portrait Session','Other'];
function localToday(){
 const now=new Date();
 return [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
}

export function BookingDetails(){
 const nav=useNavigate();
 const {booking,update}=useBooking();
 const selected=SERVICES.find(s=>s.id===booking.serviceId)||SERVICES[0];
 const today=localToday();
 const oldDate=Boolean(booking.date&&booking.date<today);
 const valid=Boolean(booking.eventType.trim()&&booking.venue.trim()&&booking.date>=today&&/^([01]\d|2[0-3]):[0-5]\d$/.test(booking.time));

 return <div className="inner-screen page-flow booking-details-red">
  <Header title="Book Your Event" back={'/packages/'+booking.serviceId}/>
  <div className="page-padding">
   <Stepper step={2}/>
   <div className="booking-form-intro"><h2>Let’s make it memorable.</h2><p>Choose the event, date, time and location to begin your booking.</p></div>
   <div className="field-group">
    <label className="field-label" htmlFor="event-type">Event Type <em>*</em></label>
    <div className="select-container"><Camera size={18} className="red"/><select id="event-type" value={booking.eventType} onChange={e=>update({eventType:e.target.value})}>
     <option value="">Choose an event type</option>{eventTypes.map(t=><option key={t}>{t}</option>)}</select><ChevronRight size={17}/>
    </div>
   </div>
   <div className="field-group">
    <label className="field-label" htmlFor="event-date">Event Date <em>*</em></label>
    <div className="event-picker-field"><CalendarDays size={19} className="red"/>
     <input id="event-date" type="date" required min={today} value={booking.date} onChange={e=>update({date:e.target.value})} aria-label="Choose event date from calendar"/>
    </div>
    {oldDate&&<p className="picker-validation" role="alert">Please select a future date using the calendar.</p>}
   </div>
   <div className="field-group">
    <label className="field-label" htmlFor="event-time">Event Time <em>*</em></label>
    <div className="event-picker-field"><Clock3 size={19} className="red"/>
     <input id="event-time" type="time" required step="60" value={booking.time} onChange={e=>update({time:e.target.value})} aria-label="Choose event time from clock"/>
    </div>
   </div>
   <div className="field-group">
    <label className="field-label" htmlFor="venue">Location / Venue <em>*</em></label>
    <div className="event-picker-field event-location-field"><MapPin size={19} className="red"/>
     <input id="venue" type="text" maxLength={250} autoComplete="street-address" placeholder="Enter event venue or address" value={booking.venue} onChange={e=>update({venue:e.target.value})}/>
    </div>
   </div>
   <div className="field-group">
    <label className="field-label" htmlFor="additional-notes">Additional Notes</label>
    <div className="notes-box"><MessageSquareText size={17}/><textarea id="additional-notes" placeholder="Any special requirements? (Optional)" value={booking.notes} maxLength={300} onChange={e=>update({notes:e.target.value})}/><small>{booking.notes.length}/300</small></div>
   </div>
   <div className="selected-service">
    <div className="selected-heading"><strong>Selected Package</strong><button onClick={()=>nav('/book')}>Change</button></div>
    <div className="selected-body"><img src={THUMBNAIL_URL(selected)} alt={selected.name} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=IMAGE_URL(selected.image)}}/><div><strong>{selected.name}</strong><p>{selected.detail}</p><span>From <b>{inr(selected.from)}</b></span></div></div>
   </div>
   <PrimaryButton disabled={!valid} onClick={()=>nav('/payment')} className="bottom-cta booking-continue">Continue to Payment</PrimaryButton>
  </div>
 </div>;
}
