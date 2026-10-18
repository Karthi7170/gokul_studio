import {useState} from 'react';
import {useNavigate,useParams} from 'react-router-dom';
import {ArrowRight, BadgeCheck, Check, CheckCircle2, ChevronRight, FileText, MessageCircle, Phone, Sparkles, X} from 'lucide-react';
import {Header, PrimaryButton} from '../components/UI';
import {SERVICES,IMAGE_URL,THUMBNAIL_URL,inr,STUDIO_PHONE} from '../data/services';
import {useBooking} from '../context/BookingContext';
export function PackageDetails(){
 const nav=useNavigate();const {id}=useParams();const {update}=useBooking();
 const [showContact,setShowContact]=useState(false);
 const pkg=SERVICES.find(s=>s.id===id);
 if(!pkg)return <div className="inner-screen page-flow"><Header title="Package not found" back="/book"/><div className="page-padding"><p>This package is unavailable.</p><PrimaryButton onClick={()=>nav('/book')}>View all packages</PrimaryButton></div></div>;
 const enquire=()=>{if(STUDIO_PHONE){window.location.href=`tel:${STUDIO_PHONE}`;}else{setShowContact(true);}};
 const whatsappLink=`https://wa.me/?text=${encodeURIComponent(`Hello Gokul Creative Studio! I would like to enquire about the ${pkg.name} package. Please share your contact details, availability and final quotation.`)}`;
 return <div className="inner-screen page-flow"><Header title="Package Details" back="/book"/><div className="package-detail">
 <div className="package-detail-hero"><img src={THUMBNAIL_URL(pkg)} alt={pkg.name}/><span>{pkg.tag}</span></div>
 <div className="page-padding package-detail-body">
 <div className="package-detail-heading"><div><small>GOKUL CREATIVE STUDIO</small><h2>{pkg.name}</h2><p>{pkg.detail}</p></div></div>
 <div className="package-estimate"><div><span>Illustrative starting estimate</span><strong>{inr(pkg.from)}</strong></div><BadgeCheck size={28}/></div>
 <div className="package-includes-title"><div><Sparkles size={19}/><h3>What's included</h3></div><small>{pkg.included.length} features</small></div>
 <ul className="package-includes">{pkg.included.map((feature,i)=><li key={i}><span><Check size={15}/></span>{feature}</li>)}</ul>
 <div className="package-personal-note"><CheckCircle2 size={18}/><div><strong>Made for your event</strong><p>Duration, crew size, locations, delivery and extras are confirmed in your final studio quotation.</p></div></div>
 <div className="package-cta-group"><PrimaryButton onClick={()=>{update({serviceId:pkg.id,eventType:pkg.event});nav('/booking-details');}} className="package-get-quote"><FileText size={17}/> Get Quotation</PrimaryButton><button className="package-call" onClick={enquire}><Phone size={17}/> Call for Enquiry <ChevronRight size={17}/></button></div>
 <p className="package-bottom-note">Demo details, not a guaranteed quote or booking.</p>
 </div></div>
 {showContact&&<div className="contact-modal-overlay" role="presentation" onClick={()=>setShowContact(false)}><div role="dialog" aria-modal="true" aria-labelledby="contact-title" className="contact-modal" onClick={e=>e.stopPropagation()}><button aria-label="Close" className="contact-modal-close" onClick={()=>setShowContact(false)}><X size={21}/></button><span className="contact-modal-icon"><Phone size={25}/></span><h3 id="contact-title">Call Enquiry</h3><p>Gokul Creative Studio's telephone number has not been connected to this demo yet. You can send your package enquiry through WhatsApp instead.</p><a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="contact-modal-whatsapp"><MessageCircle size={18}/> Send WhatsApp Enquiry <ArrowRight size={17}/></a><button className="contact-modal-dismiss" onClick={()=>setShowContact(false)}>Maybe later</button></div></div>}
 </div>;
}
