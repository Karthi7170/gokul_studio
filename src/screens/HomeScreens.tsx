import {useEffect,useMemo,useRef,useState,type TouchEvent} from 'react';
import {useNavigate,useSearchParams} from 'react-router-dom';
import {ArrowRight,Baby,Building2,CalendarDays,Camera,CheckCircle2,ChevronRight,Clapperboard,Grid2X2,Heart,HeartHandshake,Images,MessageCircle,Search,ShieldCheck,Sparkles,UserRound,Video} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import {StudioBrandLogo} from '../components/StudioBrandLogo';
import {ProfileAvatarPhoto,useProfileAvatar} from '../components/ProfileAvatarPhoto';
import {SERVICES,THUMBNAIL_URL,IMAGE_URL,inr,type ServiceId} from '../data/services';
const benefits=[
 {icon:Heart,title:'Moments, beautifully told',desc:'Personalized coverage with attention to the emotions behind the event.'},
 {icon:Images,title:'Every detail, one studio',desc:'Explore photo, cinematic film and celebration packages in one place.'},
 {icon:ShieldCheck,title:'Clear, upfront inclusions',desc:'See what comes with each package before requesting a quote.'}
];
const filters=[{id:'all',label:'All packages'},{id:'wedding',label:'Weddings'},{id:'family',label:'Family'},{id:'creative',label:'Photo & Film'}] as const;
type Filter=typeof filters[number]['id'];
const groups:Record<ServiceId,Filter>={wedding:'wedding',photography:'creative',baby:'family',prewedding:'wedding',videography:'creative',events:'family'};
function StudioImage({src,fallback,alt,className}:{src:string;fallback:string;alt:string;className?:string}){
 return <img src={src} alt={alt} className={className} loading="lazy" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=IMAGE_URL(fallback)}}/>;
}
const categoryItems=[
 {id:'wedding',label:'Wedding',icon:Camera},
 {id:'prewedding',label:'Pre-Wedding',icon:HeartHandshake},
 {id:'videography',label:'Cinematic Videos',icon:Clapperboard},
 {id:'baby',label:'Baby & Family',icon:Baby},
 {id:'events',label:'Events',icon:Building2},
 {id:'all',label:'All Services',icon:Grid2X2}
] as const;
const featured=[
 {id:'wedding',title:'Wedding Collection',description:'Complete photo & film coverage for your day.'},
 {id:'prewedding',title:'Pre-Wedding Stories',description:'Cinematic couple photos, made for you.'},
 {id:'baby',title:'Baby & Family',description:'Beautiful memories for every milestone.'}
] as const;
export function Home(){
 const nav=useNavigate();
 const {profile,user}=useAuth();
 const {avatarUrl,markAvatarBroken}=useProfileAvatar();
 const [searchOpen,setSearchOpen]=useState(false);
 const [query,setQuery]=useState('');
 const [heroIndex,setHeroIndex]=useState(0);
 const touchStartX=useRef<number|null>(null);
 const heroItems=[SERVICES[0],SERVICES[3],SERVICES[2],SERVICES[5]];
 const displayName=(profile?.full_name||String(user?.user_metadata?.full_name||'')).trim().split(/\s+/)[0];
 const hour=new Date().getHours();
 const salutation=hour<12?'GOOD MORNING':hour<17?'GOOD AFTERNOON':'GOOD EVENING';
 useEffect(()=>{
  if(typeof window==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const timer=window.setInterval(()=>setHeroIndex(i=>(i+1)%heroItems.length),6500);
  return ()=>window.clearInterval(timer);
 },[]);
 const openCategory=(id:string)=>nav(id==='all'?'/book':'/book?service='+encodeURIComponent(id));
 const submitSearch=()=>nav(query.trim()?'/book?search='+encodeURIComponent(query.trim()):'/book');
 const onEnd=(e:TouchEvent<HTMLElement>)=>{
  if(touchStartX.current===null)return;
  const dx=e.changedTouches[0]?.clientX-touchStartX.current;
  touchStartX.current=null;
  if(Math.abs(dx)>45)setHeroIndex(i=>(i+(dx<0?1:heroItems.length-1))%heroItems.length);
 };
 return <div className="home-screen page-flow gcs-home gcs-home-2026">
  <header className="gcs-2026-top">
   <StudioBrandLogo className="gcs-primary-brand"/>
   <div className="gcs-2026-actions">
    <button type="button" className={searchOpen?'gcs-round-action active':'gcs-round-action'} aria-label="Search packages" aria-expanded={searchOpen} onClick={()=>setSearchOpen(v=>!v)}><Search size={21}/></button>
    
    <button type="button" className="gcs-user-avatar" aria-label="My account" onClick={()=>nav('/profile')}><ProfileAvatarPhoto avatarUrl={avatarUrl} initials={displayName?displayName.charAt(0).toUpperCase():'G'} onError={markAvatarBroken}/></button>
   </div>
  </header>
  {searchOpen&&<form className="gcs-home-search-panel" role="search" onSubmit={e=>{e.preventDefault();submitSearch();}}>
   <Search size={17}/><input autoFocus type="search" aria-label="Search photo and film packages" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search wedding, baby, films..." maxLength={75}/><button type="submit">Search <ArrowRight size={15}/></button>
  </form>}
  <section className="gcs-2026-welcome">
   <div className="gcs-2026-greeting">
    <span className="gcs-2026-salutation">{salutation},</span>
    <h1>{displayName||'Welcome'} <Sparkles size={20}/></h1>
    <p>Let's capture your next beautiful chapter.</p>
   </div>
   <button type="button" className="gcs-2026-book-shortcut" onClick={()=>nav('/book')}>
    <span><CalendarDays size={19}/></span><span><small>Have an event?</small><strong>Book a shoot</strong></span><ArrowRight size={17}/>
   </button>
  </section>
  <section className="gcs-2026-hero" aria-label="Featured creative packages" onTouchStart={e=>{touchStartX.current=e.touches[0]?.clientX??null;}} onTouchEnd={onEnd} onTouchCancel={()=>{touchStartX.current=null;}}>
   <StudioImage key={heroItems[heroIndex].id} src={THUMBNAIL_URL(heroItems[heroIndex])} fallback={heroItems[heroIndex].image} alt={heroItems[heroIndex].name+' inspiration'} className="gcs-2026-hero-image"/>
   <div className="gcs-2026-hero-vignette"/>
   <div className="gcs-2026-hero-copy">
    <span className="gcs-2026-hero-eyebrow">MORE THAN PHOTOS</span>
    <h2>Stories for<br/>a <em>lifetime</em></h2>
    <p>Candid moments. Timeless films.<br/>For your biggest milestones.</p>
    <button type="button" onClick={()=>nav('/book')}>Explore packages <span><ArrowRight size={19}/></span></button>
   </div>
   <div className="gcs-2026-hero-pagination" aria-label="Choose featured slide">
    {heroItems.map((item,i)=><button key={item.id} aria-label={'Show '+item.name} aria-pressed={heroIndex===i} className={heroIndex===i?'active':''} onClick={()=>setHeroIndex(i)}/>)}
   </div>
   <span className="gcs-2026-hero-count">{String(heroIndex+1).padStart(2,'0')} / 04</span>
  </section>
  <nav className="gcs-2026-categories" aria-label="Browse services">
   {categoryItems.map(({id,label,icon:Icon},i)=><button type="button" className={i===0?'active':''} key={id} onClick={()=>openCategory(id)}>
    <span className="gcs-2026-category-icon"><Icon size={23} strokeWidth={1.8}/></span><span className="gcs-2026-category-label">{label}</span><span className="gcs-2026-category-indicator"/>
   </button>)}
  </nav>
  <section className="gcs-2026-popular">
   <div className="gcs-2026-section-head">
    <div><span>CURATED FOR YOU</span><h2>Popular packages</h2></div>
    <button type="button" onClick={()=>nav('/book')}>View all <ArrowRight size={18}/></button>
   </div>
   <div className="gcs-2026-popular-track">
    {featured.map(({id,title,description})=>{
     const svc=SERVICES.find(s=>s.id===id)!;
     return <button type="button" className="gcs-2026-package" key={id} onClick={()=>nav('/packages/'+id)}>
      <StudioImage src={THUMBNAIL_URL(svc)} fallback={svc.image} alt={title}/>
      <span className="gcs-2026-package-info"><strong>{title}</strong><small>{description}</small><b>From {inr(svc.from)}</b><span className="gcs-2026-package-arrow"><ArrowRight size={18}/></span></span>
     </button>;
    })}
   </div>
  </section>
  <section className="gcs-2026-story" aria-label="About our creative process">
   <StudioImage src={THUMBNAIL_URL(SERVICES[0])} fallback={SERVICES[0].image} alt="Wedding photography inspiration"/>
   <div className="gcs-2026-story-shade"/>
   <div className="gcs-2026-story-copy"><span>MADE FOR REAL MOMENTS</span><h2>Your story,<br/><em>beautifully remembered.</em></h2><p>Plan your special day with a package that fits.</p></div>
   <button type="button" onClick={()=>nav('/book')}>Explore <ArrowRight size={17}/></button>
  </section>
  <div className="gcs-2026-disclaimer"><ShieldCheck size={14}/><span>Package prices are illustrative starting estimates, subject to studio confirmation.</span></div>
 </div>;
}
export function BookService(){
 const nav=useNavigate();const [params,setParams]=useSearchParams();const [filter,setFilter]=useState<Filter>('all'),[search,setSearch]=useState(params.get('search')||'');
 const serviceId=params.get('service');const focusedService=SERVICES.some(s=>s.id===serviceId)?serviceId:null;
 const packages=useMemo(()=>SERVICES.filter(s=>(!focusedService||s.id===focusedService)&&(filter==='all'||groups[s.id]===filter)&&(`${s.name} ${s.detail}`.toLowerCase().includes(search.toLowerCase().trim()))),[filter,search,focusedService]);
 return <div className="inner-screen page-flow gcs-catalog">
 <header className="gcs-catalog-top"><button aria-label="Back to home" onClick={()=>nav('/home')}><ChevronRight size={21} className="gcs-rotated"/></button><div><small>DISCOVER WHAT WE DO</small><strong>Find your perfect package</strong></div><button onClick={()=>nav('/profile')} aria-label="My profile"><UserRound size={19}/></button></header>
 <div className="gcs-catalog-intro"><span className="gcs-eyebrow">CAPTURE • CREATE • CHERISH</span><h1>Moments are<br/><em>worth keeping.</em></h1><p>Explore our curated photo and film packages, designed around your story.</p></div>
 {focusedService&&<div className="gcs-category-selection">Browsing {SERVICES.find(s=>s.id===focusedService)?.name}<button type="button" onClick={()=>setParams({})}>Clear category ×</button></div>}
 <div className="gcs-search"><Search size={18}/><input aria-label="Search packages" type="search" placeholder="Search wedding, baby, video..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
 <div className="gcs-filter-bar" aria-label="Filter packages">{filters.map(x=><button key={x.id} className={filter===x.id?'active':''} onClick={()=>setFilter(x.id)}>{x.label}</button>)}</div>
 <div className="gcs-catalog-result">{packages.length} package{packages.length===1?'':'s'} available <span>Choose to explore <ArrowRight size={12}/></span></div>
 <div className="gcs-catalog-list">{packages.map(s=><button className="gcs-collection-card" onClick={()=>nav('/packages/'+s.id)} key={s.id}><div className="gcs-collection-image"><StudioImage src={THUMBNAIL_URL(s)} fallback={s.image} alt={s.name}/><span className="gcs-collection-tag">{s.tag}</span></div><div className="gcs-collection-info"><div><strong>{s.name}</strong><p>{s.detail}</p></div><span><b>From {inr(s.from)}</b><span>View inclusions <ArrowRight size={15}/></span></span></div></button>)}</div>
 {packages.length===0&&<div className="gcs-empty"><Search size={25}/><h3>No matches</h3><p>Try another search or package category.</p><button onClick={()=>{setSearch('');setFilter('all')}}>Show all packages</button></div>}
 <div className="gcs-bottom-note"><ShieldCheck size={16}/> Quotation amounts and inclusions are examples, confirmed on enquiry.</div>
 
 </div>;
}
