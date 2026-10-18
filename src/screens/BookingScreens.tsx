import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, MessageSquareText, Camera, Bell } from 'lucide-react';
import { Header, PrimaryButton, ScreenTitle, SectionHeading, StatusBadge, Stepper } from '../components/UI';
import { useBooking } from '../context/BookingContext';
import { SERVICES, IMAGE_URL, THUMBNAIL_URL, formatDate, to12h, inr } from '../data/services';
export function BookingDetails(){
 const nav=useNavigate();const {booking,update}=useBooking();const [dateMode,setDateMode]=useState(false);
 const selected=SERVICES.find(s=>s.id===booking.serviceId)!;
 const valid=!!booking.eventType&&!!booking.date&&!!booking.time&&!!booking.venue.trim();
 return <div className="inner-screen page-flow"><Header title="Booking Details" back={`/packages/${booking.serviceId}`}/><div className="page-padding">
 <Stepper step={2}/>
 <div className="field-group"><label className="field-label" htmlFor="event-type">Event Type <em>*</em></label><div className="select-container"><Camera size={16} className="red"/><select id="event-type" value={booking.eventType} onChange={e=>update({eventType:e.target.value})}><option value="">Choose an event type</option>{['Wedding','Pre-wedding','Birthday','Engagement','Corporate Event','Baby Shower','Baby Shoot','Maternity Shoot','Family Celebration','Portrait Session','Other'].map(t=><option key={t}>{t}</option>)}</select><ChevronRight size={17}/></div></div>
 <div className="field-group"><label className="field-label" htmlFor="event-date">Event Date <em>*</em></label><div className="input-icon-row"><CalendarDays size={16} className="red"/>{dateMode?<input aria-label="Event date" id="event-date" type="date" min={new Date().toLocaleDateString('en-CA')} value={booking.date} onChange={e=>update({date:e.target.value})}/>:<button onClick={()=>setDateMode(true)}>{formatDate(booking.date)}</button>}<ChevronRight size={17}/></div></div>
 <div className="field-group"><label className="field-label" htmlFor="event-time">Event Time <em>*</em></label><div className="input-icon-row"><Clock3 size={16} className="red"/><input id="event-time" type="time" value={booking.time} onChange={e=>update({time:e.target.value})}/><ChevronRight size={17}/></div></div>
 <div className="field-group"><label className="field-label" htmlFor="venue">Location / Venue <em>*</em></label><div className="input-icon-row"><MapPin size={16} className="red"/><input id="venue" placeholder="Enter event location" value={booking.venue} onChange={e=>update({venue:e.target.value})}/><ChevronRight size={17}/></div></div>
 <div className="field-group"><label className="field-label" htmlFor="additional-notes">Additional Notes</label><div className="notes-box"><MessageSquareText size={16}/><textarea id="additional-notes" placeholder="Any special requirements? (Optional)" value={booking.notes} maxLength={300} onChange={e=>update({notes:e.target.value})}/><small>{booking.notes.length}/300</small></div></div>
 <div className="selected-service"><div className="selected-heading"><strong>Selected Service</strong><button onClick={()=>nav('/book')}>Change</button></div><div className="selected-body"><img src={THUMBNAIL_URL(selected)} alt=""/><div><strong>{selected.name}</strong><p>{selected.detail}</p><span>From <b>{inr(selected.from)}</b></span></div></div></div>
 <PrimaryButton disabled={!valid} onClick={()=>nav('/schedule')} className="bottom-cta">Continue</PrimaryButton>
 </div></div>;
}
const slots=Array.from({length:12},(_,i)=>`${String(i+9).padStart(2,'0')}:00`);
function getWeek(startDate:Date) {const d=new Date(startDate);d.setDate(d.getDate()-d.getDay());return Array.from({length:7},(_,i)=>{const c=new Date(d);c.setDate(d.getDate()+i);return c;});}
function isoDate(d:Date) {return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function Schedule(){
 const nav=useNavigate();const {booking,update}=useBooking();
 const [anchor,setAnchor]=useState(()=>{const a=new Date(`${booking.date}T12:00:00`);return Number.isNaN(a.valueOf())?new Date():a;});
 const week=useMemo(()=>getWeek(anchor),[anchor]);const dayLabels=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 const monthTitle=new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric'}).format(week[3]);
 const changeWeek=(n:number)=>{const next=new Date(anchor);next.setDate(next.getDate()+7*n);setAnchor(next);};
 return <div className="inner-screen page-flow"><Header logo showBell back="/booking-details"/><div className="page-padding">
 <ScreenTitle sub="Choose your preferred date and time for the service">Schedule &amp; Calendar</ScreenTitle>
 <div className="calendar-box"><div className="calendar-top"><button aria-label="Previous week" onClick={()=>changeWeek(-1)}><ChevronLeft size={19}/></button><strong>{monthTitle}</strong><button aria-label="Next week" onClick={()=>changeWeek(1)}><ChevronRight size={19}/></button></div>
 <div className="week-strip">{week.map((d,i)=>{const iso=isoDate(d);return <button key={iso} onClick={()=>update({date:iso})} className={`${iso===booking.date?'active':''} ${i===0?'sunday':''}`}><small>{dayLabels[d.getDay()]}</small><strong>{String(d.getDate()).padStart(2,'0')}</strong></button>;})}</div></div>
 <div className="timeslot-heading"><div><span className="pale-icon"><Clock3 size={18}/></span><strong>Preferred Time Slots</strong></div><small>IST (GMT +5:30)</small></div>
 <div className="timeslot-grid">{slots.map(slot=><button key={slot} className={booking.time===slot?'active':''} onClick={()=>update({time:slot})}>{to12h(slot)}</button>)}</div>
 <div className="schedule-availability-note"><Clock3 size={17}/><p>Choose a preferred time. Final availability will be confirmed by the studio after your quotation request.</p></div>
 <PrimaryButton disabled={!booking.date||!booking.time} onClick={()=>nav('/quotation')} className="bottom-cta"><CalendarDays size={19}/> Select Slot</PrimaryButton>
 </div></div>;
}
