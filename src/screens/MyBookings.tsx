import {useEffect,useMemo,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowRight,CalendarDays,ChevronRight,Clock3,MapPin,RefreshCw,ShieldCheck,UserRound,Wallet} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import {StudioBrandLogo} from '../components/StudioBrandLogo';
import {SignedInAvatarButton} from '../components/SignedInAvatarButton';
import {readDemoBookings,type DemoBookingRow} from '../lib/requests';
import {SERVICES,IMAGE_URL,THUMBNAIL_URL,formatDate,to12h,inr,type ServiceId} from '../data/services';

type BookingRow=DemoBookingRow;
function matched(row:BookingRow){return SERVICES.find(s=>s.id===row.package_id)||SERVICES[0];}
function stateText(row:BookingRow){
 return row.payment_status==='demo_only'?'Demo booking':row.payment_status==='not_paid'?'Quotation request':'Request under review';
}
function BookingCard({item,featured=false}:{item:BookingRow;featured?:boolean}){
 const [expanded,setExpanded]=useState(false);
 const pkg=matched(item);
 return <article className={featured?'my-booking-card featured':'my-booking-card'}>
  <button className="my-booking-card-top" onClick={()=>setExpanded(x=>!x)} aria-expanded={expanded} aria-label={'View '+pkg.name+' booking details'}>
   <img src={THUMBNAIL_URL(pkg)} alt="" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=IMAGE_URL(pkg.image)}}/>
   <span className="my-booking-main"><strong>{pkg.name}</strong><small>{item.event_date?formatDate(item.event_date):'Event date not provided'}</small><span><MapPin size={12}/>{item.venue}</span></span>
   <span className="my-booking-tail"><b className={item.payment_status==='demo_only'?'demo':'pending'}>{stateText(item)}</b><ChevronRight size={17} className={expanded?'rotated':''}/></span>
  </button>
  {expanded&&<div className="my-booking-expanded">
    <div><span>Customer</span><strong>{item.customer_name||'Demo Guest'}</strong></div><div><span>Reference</span><strong>GCS-RQ-{item.id.slice(0,8).toUpperCase()}</strong></div>
    <div><span>Event</span><strong>{item.event_type}</strong></div>
    {item.event_time&&<div><span>Time</span><strong>{to12h(item.event_time)}</strong></div>}
    <div><span>Estimated amount</span><strong>{inr(item.estimated_amount)}</strong></div>
    {item.payment_method&&<div><span>Demo method</span><strong>{item.payment_method}</strong></div>}
    {Boolean(item.add_ons?.length)&&<div><span>Selected extras</span><strong>{item.add_ons?.length} add-ons</strong></div>}
    <p><ShieldCheck size={15}/> This is not a studio-confirmed or paid reservation. The studio must confirm availability.</p>
  </div>}
 </article>;
}
export function MyBookings(){
 const nav=useNavigate();const {profile}=useAuth();
 const [items,setItems]=useState<BookingRow[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[refresh,setRefresh]=useState(0);
 useEffect(()=>{
  setLoading(true);setError('');
  try{setItems(readDemoBookings().filter(item=>item.customer_name.toLocaleLowerCase()===String(profile?.full_name||'').toLocaleLowerCase()));}
  catch{setError('Unable to read demo bookings stored on this device.');}
  finally{setLoading(false);}
 },[profile?.full_name,refresh]);
 const now=new Date().toISOString().slice(0,10);
 const next=useMemo(()=>items.filter(item=>item.event_date&&item.event_date>=now).sort((a,b)=>(a.event_date||'').localeCompare(b.event_date||''))[0]||null,[items,now]);
 const sorted=items.filter(item=>item.id!==next?.id);
 return <div className="page-flow my-bookings-page">
  <header className="my-bookings-top"><StudioBrandLogo className="gcs-bookings-brand"/><SignedInAvatarButton className="gcs-bookings-avatar"/></header>
  <section className="my-bookings-heading"><span className="reference-kicker">YOUR CREATIVE JOURNEY</span><h1>My Bookings</h1><p>Track all the moments you've planned with us.</p></section>
  <div className="my-bookings-controls"><span>{items.length} saved request{items.length===1?'':'s'}</span><button onClick={()=>setRefresh(n=>n+1)} aria-label="Refresh bookings" disabled={loading}><RefreshCw size={15}/> Refresh</button></div>
  {loading&&<div className="my-bookings-state" role="status"><div className="mini-loading-spinner"/>Loading your bookings…</div>}
  {!loading&&error&&<div className="my-bookings-error" role="alert">{error}<button onClick={()=>setRefresh(n=>n+1)}>Try again</button></div>}
  {!loading&&!error&&items.length===0&&<div className="my-bookings-empty"><div><CalendarDays size={32}/></div><h2>Your story starts here.</h2><p>No booking requests yet. Choose a package to plan your first event.</p><button onClick={()=>nav('/book')}>Explore Packages <ArrowRight size={17}/></button></div>}
  {!loading&&!error&&next&&<section className="my-bookings-next">
    <span className="reference-kicker">NEXT SCHEDULED REQUEST</span>
    <h2>{matched(next).name}</h2>
    <div className="my-bookings-next-meta"><span><CalendarDays size={16}/>{formatDate(next.event_date||'')}</span>{next.event_time&&<span><Clock3 size={16}/>{to12h(next.event_time)}</span>}</div>
    <p><MapPin size={16}/>{next.venue}</p>
    <div className="my-bookings-next-status"><ShieldCheck size={16}/>{stateText(next)} — awaiting studio confirmation</div>
  </section>}
  {!loading&&!error&&items.length>0&&<section className="my-bookings-all"><div className="my-bookings-list-heading"><h2>All Requests</h2><span>{items.length} total</span></div>
    {items.map(item=><BookingCard key={item.id} item={item}/>)}
  </section>}
  <div className="my-bookings-help"><ShieldCheck size={18}/><p>Bookings are stored only in this browser under your demo name. No real payment or reservation is made.</p></div>
 </div>;
}
