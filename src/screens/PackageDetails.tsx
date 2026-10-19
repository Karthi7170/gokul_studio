import {useState} from 'react';
import {useNavigate,useParams} from 'react-router-dom';
import {ArrowRight,BookOpen,CalendarDays,Camera,Check,CheckCircle2,ChevronRight,Clapperboard,FileText,Heart,Images,ShieldCheck,Sparkles} from 'lucide-react';
import {Header,PrimaryButton} from '../components/UI';
import {SERVICES,IMAGE_URL,THUMBNAIL_URL,inr} from '../data/services';
import {useBooking} from '../context/BookingContext';
import {StudioBrandLogo} from '../components/StudioBrandLogo';
import {SignedInAvatarButton} from '../components/SignedInAvatarButton';

export function PackageDetails(){
 const nav=useNavigate();const {id}=useParams();const {update}=useBooking();
 const [viewAll,setViewAll]=useState(false),[favorite,setFavorite]=useState(false),[photoIndex,setPhotoIndex]=useState(0);
 const pkg=SERVICES.find(s=>s.id===id);
 if(!pkg)return <div className="inner-screen page-flow"><Header title="Package not found" back="/book"/><div className="page-padding"><p>This package is unavailable.</p><PrimaryButton onClick={()=>nav('/book')}>View all packages</PrimaryButton></div></div>;
 const choose=(destination:'/quotation'|'/booking-details')=>{update({serviceId:pkg.id,eventType:pkg.event,addOns:[]});nav(destination);};
 const gallery=[pkg,SERVICES[(SERVICES.indexOf(pkg)+1)%SERVICES.length],SERVICES[(SERVICES.indexOf(pkg)+3)%SERVICES.length]];
 const inclusions=viewAll?pkg.included:pkg.included.slice(0,5);
 return <div className="inner-screen page-flow package-details-ferrari iphone-package-detail">
  <div className="iphone-detail-header"><button type="button" aria-label="Back to packages" onClick={()=>nav('/book')}><ChevronRight size={22}/></button>
   <StudioBrandLogo className="gcs-package-brand"/>
   <div className="iphone-detail-actions"><button type="button" className={favorite?'iphone-favorite active':'iphone-favorite'} onClick={()=>setFavorite(x=>!x)} aria-label={favorite?'Remove from favorites':'Mark as favorite'}><Heart size={21} fill={favorite?'currentColor':'none'}/></button><SignedInAvatarButton className="gcs-package-avatar"/></div>
  </div>
  <div className="iphone-detail-photo">
   <img src={THUMBNAIL_URL(gallery[photoIndex])} alt={gallery[photoIndex].name+' photography inspiration'} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=IMAGE_URL(gallery[photoIndex].image)}}/>
   <div className="iphone-detail-photo-dots">{gallery.map((g,i)=><button key={g.id} onClick={()=>setPhotoIndex(i)} className={photoIndex===i?'active':''} aria-label={'Preview image '+(i+1)}/>)}</div>
   <span>{String(photoIndex+1).padStart(2,'0')} / 03</span>
  </div>
  <div className="iphone-detail-content">
   <div className="iphone-detail-title"><div><span className="reference-kicker">GOKUL SIGNATURE COLLECTION</span><h1>{pkg.name}</h1><p>{pkg.detail}. A thoughtful package for your most meaningful memories.</p></div></div>
   <div className="iphone-detail-price"><div><small>Starting package estimate</small><strong>{inr(pkg.from)}</strong></div><span><ShieldCheck size={20}/> Clear inclusions</span></div>
   <div className="iphone-detail-highlights"><div><Camera size={22}/><strong>Creative coverage</strong><span>Photos & moments</span></div><div><Images size={22}/><strong>Edited delivery</strong><span>Digital highlights</span></div><div><Clapperboard size={22}/><strong>Personalized</strong><span>Plan your session</span></div></div>
   <section className="iphone-detail-section">
    <div className="iphone-section-header"><h2>What's included</h2><button type="button" onClick={()=>setViewAll(x=>!x)}>{viewAll?'Show less':'View all'} <ArrowRight size={16}/></button></div>
    <div className="iphone-inclusions-grid">{inclusions.map(feature=><div key={feature}><span><Check size={16}/></span><p>{feature}</p></div>)}</div>
   </section>
   <section className="iphone-gallery-section"><div className="iphone-section-header"><h2>Style inspirations</h2><span>Reference imagery</span></div><div className="iphone-gallery-strip">{gallery.map((g,i)=><button key={i} type="button" onClick={()=>setPhotoIndex(i)} aria-label={'View inspiration '+(i+1)}><img src={THUMBNAIL_URL(g)} alt={g.name} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=IMAGE_URL(g.image)}}/></button>)}</div><p>These photos illustrate creative styles and are not a claim of completed studio projects.</p></section>
   <div className="iphone-detail-note"><Sparkles size={17}/><p>Session scope, final pricing and delivery are confirmed with the studio before your event.</p></div>
   <div className="package-cta-group ferrari-package-cta iphone-double-cta"><button className="quote-button" onClick={()=>choose('/quotation')}><FileText size={19}/>Get a Quotation</button><button className="book-button" onClick={()=>choose('/booking-details')}><CalendarDays size={19}/>Book Now <ArrowRight size={17}/></button></div>
  </div>
 </div>;
}
