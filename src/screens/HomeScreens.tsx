import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowRight,CalendarDays,Camera,CheckCircle2,ChevronRight,Clapperboard,Heart,Images,MessageCircle,Search,ShieldCheck,Sparkles,Star,UserRound} from 'lucide-react';
import {Header,Logo,PrimaryButton} from '../components/UI';
import {SERVICES,THUMBNAIL_URL,inr} from '../data/services';
import {useAuth} from '../context/AuthContext';
const pillars=[
 {icon:Heart,title:'Moments with meaning',detail:'Real emotions, beautifully preserved.'},
 {icon:Camera,title:'Photo & film together',detail:'Creative coverage for every occasion.'},
 {icon:ShieldCheck,title:'No surprises',detail:'See inclusions before requesting a quote.'}
];
export function StudioNav({active}:{active:'home'|'packages'|'profile'}){
 const nav=useNavigate();
 return <nav className="studio-bottom-nav" aria-label="Main navigation">
 <button className={active==='home'?'active':''} onClick={()=>nav('/home')}><span><Heart size={18}/></span>Home</button>
 <button className={active==='packages'?'active':''} onClick={()=>nav('/book')}><span><Images size={19}/></span>Packages</button>
 <button className={active==='profile'?'active':''} onClick={()=>nav('/profile')}><span><UserRound size={19}/></span>Account</button>
 </nav>;
}
export function Home(){
 const nav=useNavigate();const {profile,user}=useAuth();
 const first=(profile?.full_name||String(user?.user_metadata?.full_name||'')).trim().split(/\s+/)[0]||'there';
 return <div className="home-screen premium-home page-flow">
 <div className="premium-topbar"><div className="premium-welcome"><span>WELCOME TO GOKUL STUDIO</span><h2>Hello, {first} <span className="hello-spark">✳</span></h2></div><button className="premium-profile" aria-label="Open your account" onClick={()=>nav('/profile')}><UserRound size={22}/></button></div>
 <div className="editorial-hero">
 <img src={THUMBNAIL_URL(SERVICES[0])} alt="Wedding photography inspiration" onError={e=>{e.currentTarget.src='/images/combo.jpg'}}/>
 <div className="editorial-hero-shade"/>
 <div className="editorial-hero-content"><div className="editorial-kicker"><span/> THE ART OF EVERY MOMENT</div>
 <h1>Stories worth<br/><em>remembering.</em></h1>
 <p>From your first hello to life's biggest celebrations — let's capture it beautifully.</p>
 <button className="editorial-hero-button" onClick={()=>nav('/book')}>Explore our packages <ArrowRight size={17}/></button>
 </div><span className="editorial-hero-index">01 / 06</span></div>
 <div className="premium-promise"><div><Sparkles size={18}/><strong>Personalized</strong><small>For your moment</small></div><span/><div><Clapperboard size={18}/><strong>Photo + Film</strong><small>Complete coverage</small></div><span/><div><CheckCircle2 size={18}/><strong>Easy Booking</strong><small>Clear inclusions</small></div></div>
 <div className="premium-section-head"><div><span className="section-kicker">EXPLORE WHAT WE DO</span><h3>Made for every <em>chapter.</em></h3></div><button onClick={()=>nav('/book')}>View all <ArrowRight size={15}/></button></div>
 <div className="editorial-package-carousel">{SERVICES.slice(0,4).map((s,i)=><button key={s.id} onClick={()=>nav('/packages/'+s.id)} className="editorial-package"><div className="editorial-package-photo"><img src={THUMBNAIL_URL(s)} loading="lazy" alt={s.name} onError={e=>{e.currentTarget.src='/images/'+s.image}}/><span>{i===0?'BEST LOVED':s.tag.toUpperCase()}</span></div><div className="editorial-package-copy"><strong>{s.name}</strong><p>Explore details <ArrowRight size={14}/></p></div></button>)}</div>
 <button className="premium-all-collection" onClick={()=>nav('/book')}><span><Images size={18}/></span><strong>Explore all 6 creative packages</strong><ChevronRight size={18}/></button>
 <div className="premium-section-head moments-head"><div><span className="section-kicker">WHY GOKUL CREATIVE STUDIO</span><h3>More than just <em>pictures.</em></h3></div></div>
 <div className="premium-value-list">{pillars.map(({icon:Icon,title,detail},i)=><div className="premium-value-card" key={title}><div className="premium-value-symbol"><Icon size={20}/></div><div><strong>{title}</strong><p>{detail}</p></div><span>{'0'+(i+1)}</span></div>)}</div>
 <div className="premium-process"><span>YOUR JOURNEY, MADE SIMPLE</span><h3>Three steps to your story.</h3><div>{['Choose a package','Share event details','Receive your quotation'].map((x,i)=><div key={x}><span>{'0'+(i+1)}</span><p>{x}</p></div>)}</div><button onClick={()=>nav('/book')}>Start planning <ArrowRight size={15}/></button></div>
 <p className="premium-disclaimer">Package photos are inspiration only. Estimates and inclusions are subject to studio confirmation.</p>
 <StudioNav active="home"/>
 </div>;
}
export function BookService(){
 const nav=useNavigate();const [query,setQuery]=useState('');
 const filtered=SERVICES.filter(x=>(x.name+' '+x.detail+' '+x.event).toLowerCase().includes(query.trim().toLowerCase()));
 return <div className="inner-screen premium-catalog page-flow"><Header title="Explore Packages" back="/home"/><div className="page-padding">
 <div className="premium-catalog-heading"><span className="section-kicker">CREATIVE COLLECTIONS</span><h2>Find your perfect <em>package.</em></h2><p>Pick a moment. Discover your coverage. Plan your story.</p></div>
 <label className="premium-search"><Search size={19}/><input aria-label="Search packages" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search wedding, baby, events..."/></label>
 <div className="catalog-filter-count">{filtered.length} packages to explore <span>Tap to see all inclusions</span></div>
 <div className="premium-catalog-grid">{filtered.map(s=><button className="premium-catalog-tile" key={s.id} onClick={()=>nav('/packages/'+s.id)}><img src={THUMBNAIL_URL(s)} loading="lazy" alt={s.name} onError={e=>{e.currentTarget.src='/images/'+s.image}}/><div className="premium-catalog-overlay"><span>{s.tag.toUpperCase()}</span><strong>{s.name}</strong><p>From {inr(s.from)} <ArrowRight size={17}/></p></div></button>)}</div>
 {filtered.length===0&&<div className="premium-empty">No packages match your search. Try “wedding” or “baby”.</div>}
 <div className="premium-catalog-note"><MessageCircle size={17}/> Prices are indicative only. Each package receives a personalized quotation.</div>
 </div><StudioNav active="packages"/></div>;
}
