import {useNavigate,useParams} from 'react-router-dom';
import {ArrowRight,BadgeCheck,CalendarDays,Check,CheckCircle2,FileText,Sparkles} from 'lucide-react';
import {Header,PrimaryButton} from '../components/UI';
import {SERVICES,THUMBNAIL_URL,inr} from '../data/services';
import {useBooking} from '../context/BookingContext';

export function PackageDetails(){
 const nav=useNavigate();
 const {id}=useParams();
 const {update}=useBooking();
 const pkg=SERVICES.find(s=>s.id===id);
 if(!pkg)return <div className="inner-screen page-flow"><Header title="Package not found" back="/book"/><div className="page-padding"><p>This package is unavailable.</p><PrimaryButton onClick={()=>nav('/book')}>View all packages</PrimaryButton></div></div>;
 const choose=(destination:'/quotation'|'/booking-details')=>{
  update({serviceId:pkg.id,eventType:pkg.event});
  nav(destination);
 };
 return <div className="inner-screen page-flow package-details-ferrari">
  <Header title="Package Details" back="/book"/>
  <div className="package-detail">
   <div className="package-detail-hero"><img src={THUMBNAIL_URL(pkg)} alt={pkg.name}/><span>{pkg.tag}</span></div>
   <div className="page-padding package-detail-body">
    <div className="package-detail-heading"><div><small>GOKUL CREATIVE STUDIO</small><h2>{pkg.name}</h2><p>{pkg.detail}</p></div></div>
    <div className="package-estimate"><div><span>Illustrative starting estimate</span><strong>{inr(pkg.from)}</strong></div><BadgeCheck size={28}/></div>
    <div className="package-includes-title"><div><Sparkles size={19}/><h3>What's included</h3></div><small>{pkg.included.length} features</small></div>
    <ul className="package-includes">{pkg.included.map(feature=><li key={feature}><span><Check size={15}/></span>{feature}</li>)}</ul>
    <div className="package-personal-note"><CheckCircle2 size={18}/><div><strong>Tailored to your event</strong><p>Duration, crew size, locations, delivery and extras will be agreed in your final studio quotation.</p></div></div>
    <div className="package-cta-group ferrari-package-cta">
     <button type="button" className="quote-button" onClick={()=>choose('/quotation')}><FileText size={19}/>Get a Quotation <ArrowRight size={17}/></button>
     <button type="button" className="book-button" onClick={()=>choose('/booking-details')}><CalendarDays size={19}/>Book Now <ArrowRight size={17}/></button>
    </div>
    <p className="package-bottom-note">Quotations are estimates. Booking and payments shown are in demo mode until the studio enables live payments and approval.</p>
   </div>
  </div>
 </div>;
}
