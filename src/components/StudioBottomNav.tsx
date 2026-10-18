import {CalendarDays,Grid2X2,House,UserRound} from 'lucide-react';
import {useLocation,useNavigate} from 'react-router-dom';
const items=[
 {label:'Home',href:'/home',icon:House},
 {label:'Packages',href:'/book',icon:Grid2X2},
 {label:'Bookings',href:'/bookings',icon:CalendarDays},
 {label:'Account',href:'/profile',icon:UserRound},
] as const;
export function StudioBottomNav(){
 const nav=useNavigate();const loc=useLocation();
 return <nav className="studio-ios-tabs" aria-label="Studio main navigation">{items.map(({label,href,icon:Icon})=>{
  const active=loc.pathname===href || (label==='Packages'&&loc.pathname.startsWith('/packages/')) || (label==='Bookings'&&loc.pathname.startsWith('/booking-details'));
  return <button key={href} type="button" className={active?'active':''} aria-label={label} aria-current={active?'page':undefined} onClick={()=>nav(href)}><Icon size={24} strokeWidth={active?2:1.75}/><span>{label}</span>{active&&<i aria-hidden="true"/>}</button>;
 })}</nav>;
}
