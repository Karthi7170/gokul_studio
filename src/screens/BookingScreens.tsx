import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Camera,ChevronRight,CheckCircle2,ExternalLink,MapPin,MapPinned,MessageSquareText,Navigation,Link2} from 'lucide-react';
import {Header,PrimaryButton,Stepper} from '../components/UI';
import {useBooking} from '../context/BookingContext';
import {SERVICES,IMAGE_URL,THUMBNAIL_URL,inr} from '../data/services';

function safeMapsLink(raw:string):string|null {
 try{
  const url=new URL(raw.trim());
  const host=url.hostname.toLowerCase();
  if(url.protocol!=='https:')return null;
  if(host==='maps.app.goo.gl'||host==='maps.google.com')return url.href;
  if(['www.google.com','google.com','www.google.co.in','google.co.in'].includes(host)&&url.pathname.startsWith('/maps'))return url.href;
  return null;
 }catch{return null;}
}
const eventTypes=['Wedding','Pre-wedding','Birthday','Engagement','Corporate Event','Baby Shower','Baby Shoot','Maternity Shoot','Family Celebration','Portrait Session','Other'];

export function BookingDetails(){
 const nav=useNavigate();const {booking,update}=useBooking();
 const [mapsLink,setMapsLink]=useState(booking.locationUrl||'');
 const [locationError,setLocationError]=useState('');
 const [locating,setLocating]=useState(false);
 const selected=SERVICES.find(s=>s.id===booking.serviceId)||SERVICES[0];
 const valid=Boolean(booking.eventType.trim()&&booking.venue.trim());
 const openMaps=()=>{
  const query=booking.venue.trim()||'event venue near me';
  window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query),'_blank','noopener,noreferrer');
 };
 const applyMapsLink=()=>{
  const link=safeMapsLink(mapsLink);
  if(!link){setLocationError('Paste a Google Maps sharing link (https://maps.app.goo.gl/... or Google Maps URL).');return;}
  update({locationUrl:link,venue:booking.venue||'Google Maps pinned venue'});
  setLocationError('Google Maps pin saved with this booking.');
 };
 const locate=()=>{
  if(!navigator.geolocation){setLocationError('Location services are not available on this device. Enter the venue or paste a Google Maps link.');return;}
  setLocating(true);setLocationError('');
  navigator.geolocation.getCurrentPosition(
   position=>{
    const lat=position.coords.latitude.toFixed(6),lng=position.coords.longitude.toFixed(6);
    const link='https://www.google.com/maps/search/?api=1&query='+lat+','+lng;
    setMapsLink(link);update({venue:'GPS pin: '+lat+', '+lng,locationUrl:link});
    setLocating(false);setLocationError('Current location pinned. You can still edit the venue name.');
   },
   ()=>{setLocating(false);setLocationError('Could not access your location. Allow location access, enter it manually, or paste a Maps pin.');},
   {enableHighAccuracy:true,timeout:12000,maximumAge:0}
  );
 };
 return <div className="inner-screen page-flow location-booking-screen">
  <Header title="Booking Details" back={'/packages/'+booking.serviceId}/>
  <div className="page-padding">
   <Stepper step={2}/>
   <div className="booking-form-intro"><h2>Tell us about your event</h2><p>Choose your occasion and where we will create the memories.</p></div>
   <div className="field-group"><label className="field-label" htmlFor="event-type">Event Type <em>*</em></label>
    <div className="select-container"><Camera size={17} className="red"/><select id="event-type" value={booking.eventType} onChange={e=>update({eventType:e.target.value})}>
     <option value="">Choose an event type</option>{eventTypes.map(t=><option key={t}>{t}</option>)}</select><ChevronRight size={17}/></div>
   </div>
   <div className="field-group"><label className="field-label" htmlFor="venue">Location / Venue <em>*</em></label>
    <div className="location-manual-entry"><MapPin size={18} className="red"/><textarea id="venue" value={booking.venue} rows={2} maxLength={250} placeholder="Type a venue, address or landmark" onChange={e=>{update({venue:e.target.value,locationUrl:''});setMapsLink('');setLocationError('');}}/></div>
    <div className="map-choice-heading"><span>Or add a location pin</span></div>
    <div className="map-location-actions">
     <button type="button" onClick={openMaps}><ExternalLink size={16}/> Find on Google Maps</button>
     <button type="button" onClick={locate} disabled={locating}><Navigation size={16}/>{locating?'Locating…':'Use my GPS pin'}</button>
    </div>
    <div className="maps-paste-help">To select another place: open Google Maps, long-press to drop a pin, tap <strong>Share → Copy link</strong>, then paste it below.</div>
    <div className="maps-link-row"><Link2 size={16}/><input aria-label="Paste Google Maps pin link" type="url" placeholder="Paste Google Maps share link" value={mapsLink} onChange={e=>{setMapsLink(e.target.value);setLocationError('');}}/><button onClick={applyMapsLink} disabled={!mapsLink.trim()}>Use Pin</button></div>
    {booking.locationUrl&&<a className="maps-saved-link" href={booking.locationUrl} target="_blank" rel="noopener noreferrer"><CheckCircle2 size={15}/> Map pin attached · View in Google Maps <ExternalLink size={13}/></a>}
    {locationError&&<p className="location-help-status" role="status">{locationError}</p>}
   </div>
   <div className="field-group"><label className="field-label" htmlFor="additional-notes">Additional Notes</label>
    <div className="notes-box"><MessageSquareText size={17}/><textarea id="additional-notes" placeholder="Any special requirements? (Optional)" value={booking.notes} maxLength={300} onChange={e=>update({notes:e.target.value})}/><small>{booking.notes.length}/300</small></div>
   </div>
   <div className="selected-service"><div className="selected-heading"><strong>Selected Package</strong><button onClick={()=>nav('/book')}>Change</button></div>
    <div className="selected-body"><img src={THUMBNAIL_URL(selected)} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=IMAGE_URL(selected.image)}} alt={selected.name}/><div><strong>{selected.name}</strong><p>{selected.detail}</p><span>From <b>{inr(selected.from)}</b></span></div></div>
   </div>
   <PrimaryButton disabled={!valid} onClick={()=>nav('/quotation')} className="bottom-cta booking-continue">Continue to Quotation</PrimaryButton>
  </div>
 </div>;
}
