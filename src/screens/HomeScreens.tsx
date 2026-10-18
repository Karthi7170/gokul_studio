import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, Camera, CheckCircle2, ChevronRight, Clapperboard, Heart, Images, MessageCircle, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { Header, Logo, PrimaryButton, SectionHeading } from '../components/UI';
import { SERVICES, IMAGE_URL, inr } from '../data/services';
const benefits=[
 {icon:Sparkles,title:'Thoughtful Storytelling',detail:'Beautifully capture the moments that matter.'},
 {icon:Images,title:'Photo + Video Options',detail:'Coverage options for events of every size.'},
 {icon:ShieldCheck,title:'Clear Inclusions',detail:'See what is included before requesting a quote.'},
];
export function Home(){
 const nav=useNavigate();const [slide,setSlide]=useState(0);
 const titles=[['Book Your','Creative Moments'],['Make Every','Moment Matter'],['Your Story,','Our Passion']];
 return <div className="home-screen page-flow">
 <div className="home-top"><Logo compact/><div className="home-actions"><button className="icon-button" aria-label="Your profile" onClick={()=>nav('/profile')}><UserRound size={22} color="#333"/></button></div></div>
 <div className="hero-banner"><div className="hero-copy"><h1>{titles[slide][0]}<br/><span>{titles[slide][1]}</span></h1><p>Photography &nbsp;|&nbsp; Videography<br/>Weddings &nbsp;|&nbsp; Baby Shoots</p><div className="hero-dots">{titles.map((_,i)=><button key={i} className={i===slide?'active':''} onClick={()=>setSlide(i)} aria-label={`Banner ${i+1}`}/>)}</div></div><img src={IMAGE_URL('camera.jpg')} alt="Professional studio camera"/></div>
 <PrimaryButton onClick={()=>nav('/book')} className="hero-cta"><CalendarDays size={20}/> Explore Packages</PrimaryButton>
 <SectionHeading title="Our Services" action="All 6 Packages" onClick={()=>nav('/book')}/>
 <div className="home-package-grid">{SERVICES.slice(0,3).map(s=><button className="home-package-card" key={s.id} onClick={()=>nav('/book')}><img src={IMAGE_URL(s.image)} alt=""/><strong>{s.name}</strong><span>Explore <ArrowRight size={12}/></span></button>)}</div>
 <button className="browse-packages" onClick={()=>nav('/book')}>Browse all 6 packages <ChevronRight size={16}/></button>
 <SectionHeading title="Why Choose Gokul Creative Studio?"/>
 <div className="why-benefits">{benefits.map(({icon:Icon,title,detail})=><div className="why-benefit" key={title}><span className="why-benefit-icon"><Icon size={19}/></span><div><strong>{title}</strong><p>{detail}</p></div><CheckCircle2 size={15} className="why-check"/></div>)}</div>
 <p className="demo-watermark">Demo packages and estimates · Confirm final details with the studio</p>
 </div>;
}
export function BookService(){
 const nav=useNavigate();
 return <div className="inner-screen page-flow"><Header logo back="/home"/><div className="page-padding">
 <div className="screen-intro compact"><h2>Explore Our Packages</h2><p>Select a package to see every inclusion and request a quotation.</p></div>
 <div className="packages-count"><Camera size={16}/> 6 curated creative packages <span>View details <ChevronRight size={13}/></span></div>
 <div className="package-catalog">{SERVICES.map(s=><button className="package-catalog-card" key={s.id} onClick={()=>nav(`/packages/${s.id}`)}><img src={IMAGE_URL(s.image)} alt=""/><div className="package-catalog-info"><span className="package-kicker">{s.tag}</span><strong>{s.name}</strong><p>{s.detail}</p><span className="package-price">Sample from <b>{inr(s.from)}</b></span></div><span className="package-arrow"><ChevronRight size={19}/></span></button>)}</div>
 <div className="packages-note"><MessageCircle size={17}/> Package prices and inclusions are illustrative. Final quotations depend on your event, date, duration and location.</div>
 </div></div>;
}
