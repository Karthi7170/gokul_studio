import {useMemo,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowRight,Camera,CheckCircle2,ChevronRight,Heart,Images,Menu,MessageCircle,Search,ShieldCheck,Sparkles,UserRound,Video,Clock3,ImagePlus,Gift,Film,LayoutGrid} from 'lucide-react';
import {Logo} from '../components/UI';
import {useAuth} from '../context/AuthContext';
import {SERVICES,THUMBNAIL_URL,IMAGE_URL,inr,type ServiceId} from '../data/services';
const benefits=[
 {icon:Heart,title:'Moments, beautifully told',desc:'Personalized coverage with attention to the emotions behind the event.'},
 {icon:Images,title:'Every detail, one studio',desc:'Explore photo, cinematic film and celebration packages in one place.'},
 {icon:ShieldCheck,title:'Clear, upfront inclusions',desc:'See what comes with each package before requesting a quote.'}
];
const filters=[{id:'all',label:'All packages'},{id:'wedding',label:'Weddings'},{id:'family',label:'Family'},{id:'creative',label:'Photo & Film'}] as const;
type Filter=typeof filters[number]['id'];
const groups:Record<ServiceId,Filter>={wedding:'wedding',photography:'creative',baby:'family',prewedding:'wedding',videography:'creative',events:'family'};
function StudioImage({src,fallback,alt}:{src:string;fallback:string;alt:string}){return <img src={src} alt={alt} loading="lazy" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=IMAGE_URL(fallback)}}/>}
function StudioNav({active}:{active:'home'|'packages'}){const nav=useNavigate();return <nav className="gcs-mobile-nav" aria-label="Main navigation"><button className={active==='home'?'active':''} onClick={()=>nav('/home')}><Heart size={17}/>Home</button><button className={active==='packages'?'active':''} onClick={()=>nav('/book')}><LayoutGrid size={17}/>Packages</button><button onClick={()=>nav('/profile')}><UserRound size={17}/>Account</button></nav>}
export function Home(){
 const nav=useNavigate();const {profile,user}=useAuth();const firstName=(profile?.full_name||String(user?.user_metadata?.full_name||'')).split(' ')[0];
 return <div className="home-screen page-flow gcs-home">
 <header className="gcs-home-header"><div className="gcs-header-brand"><span className="gcs-header-camera"><Camera size={20}/></span><div><strong>GOKUL</strong><small>CREATIVE STUDIO</small></div></div><button className="gcs-profile-action" onClick={()=>nav('/profile')} aria-label="Open my account"><UserRound size={20}/></button></header>
 <div className="gcs-greeting"><span>WELCOME{firstName?', '+firstName.toUpperCase():''} <Sparkles size={14}/></span><p>Your next beautiful chapter starts here.</p></div>
 <section className="gcs-hero-premium"><StudioImage src={THUMBNAIL_URL(SERVICES[0])} fallback={SERVICES[0].image} alt="Wedding photography inspiration"/><div className="gcs-hero-overlay"/><div className="gcs-hero-content"><span className="gcs-hero-kicker">CREATED FOR LIFE'S BIG MOMENTS</span><h1>Every moment<br/>deserves a <em>story.</em></h1><p>From joyful beginnings to once-in-a-lifetime celebrations.</p><button onClick={()=>nav('/book')}>Explore packages <ArrowRight size={17}/></button></div><span className="gcs-hero-index">01 / 06</span></section>
 <div className="gcs-home-section-heading"><div><span className="gcs-eyebrow">CURATED EXPERIENCES</span><h2>Our packages</h2></div><button onClick={()=>nav('/book')}>View all <ArrowRight size={15}/></button></div>
 <div className="gcs-featured-scroll">{SERVICES.slice(0,4).map((s,i)=><button className="gcs-featured-card" onClick={()=>nav('/packages/'+s.id)} key={s.id}><StudioImage src={THUMBNAIL_URL(s)} fallback={s.image} alt={s.name}/><span className="gcs-featured-shade"/><span className="gcs-featured-number">{String(i+1).padStart(2,'0')}</span><div><strong>{s.name}</strong><span>From {inr(s.from)} <ChevronRight size={14}/></span></div></button>)}</div>
 <button className="gcs-view-packages" onClick={()=>nav('/book')}>Explore all 6 packages <ArrowRight size={16}/></button>
 <div className="gcs-home-section-heading gcs-why-heading"><div><span className="gcs-eyebrow">THE GOKUL DIFFERENCE</span><h2>Why choose us?</h2></div></div>
 <div className="gcs-benefit-list">{benefits.map(({icon:Icon,title,desc},i)=><div className="gcs-benefit" key={title}><span className="gcs-benefit-icon"><Icon size={19}/></span><div><small>0{i+1}</small><strong>{title}</strong><p>{desc}</p></div><CheckCircle2 className="gcs-benefit-check" size={15}/></div>)}</div>
 <div className="gcs-bottom-note"><MessageCircle size={16}/> Package prices are starting estimates. Final details confirmed by the studio.</div>
 <StudioNav active="home"/>
 </div>;
}
export function BookService(){
 const nav=useNavigate();const [filter,setFilter]=useState<Filter>('all'),[search,setSearch]=useState('');
 const packages=useMemo(()=>SERVICES.filter(s=>(filter==='all'||groups[s.id]===filter)&&(`${s.name} ${s.detail}`.toLowerCase().includes(search.toLowerCase().trim()))),[filter,search]);
 return <div className="inner-screen page-flow gcs-catalog">
 <header className="gcs-catalog-top"><button aria-label="Back to home" onClick={()=>nav('/home')}><ChevronRight size={21} className="gcs-rotated"/></button><div><small>DISCOVER WHAT WE DO</small><strong>Find your perfect package</strong></div><button onClick={()=>nav('/profile')} aria-label="My profile"><UserRound size={19}/></button></header>
 <div className="gcs-catalog-intro"><span className="gcs-eyebrow">CAPTURE • CREATE • CHERISH</span><h1>Moments are<br/><em>worth keeping.</em></h1><p>Explore our curated photo and film packages, designed around your story.</p></div>
 <div className="gcs-search"><Search size={18}/><input aria-label="Search packages" type="search" placeholder="Search wedding, baby, video..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
 <div className="gcs-filter-bar" aria-label="Filter packages">{filters.map(x=><button key={x.id} className={filter===x.id?'active':''} onClick={()=>setFilter(x.id)}>{x.label}</button>)}</div>
 <div className="gcs-catalog-result">{packages.length} package{packages.length===1?'':'s'} available <span>Choose to explore <ArrowRight size={12}/></span></div>
 <div className="gcs-catalog-list">{packages.map(s=><button className="gcs-collection-card" onClick={()=>nav('/packages/'+s.id)} key={s.id}><div className="gcs-collection-image"><StudioImage src={THUMBNAIL_URL(s)} fallback={s.image} alt={s.name}/><span className="gcs-collection-tag">{s.tag}</span></div><div className="gcs-collection-info"><div><strong>{s.name}</strong><p>{s.detail}</p></div><span><b>From {inr(s.from)}</b><span>View inclusions <ArrowRight size={15}/></span></span></div></button>)}</div>
 {packages.length===0&&<div className="gcs-empty"><Search size={25}/><h3>No matches</h3><p>Try another search or package category.</p><button onClick={()=>{setSearch('');setFilter('all')}}>Show all packages</button></div>}
 <div className="gcs-bottom-note"><ShieldCheck size={16}/> Quotation amounts and inclusions are examples, confirmed on enquiry.</div>
 <StudioNav active="packages"/>
 </div>;
}
