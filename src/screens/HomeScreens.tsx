import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Album, ArrowRight, Bell, CalendarDays, Camera, CheckCircle2, Clock, Film, Image, MapPin, MonitorPlay, UserRound, Video, Zap, Award, MessageCircle, ChevronRight } from 'lucide-react';
import { BackButton, Header, Logo, PrimaryButton, SectionHeading, StatusBadge } from '../components/UI';
import { SERVICES, IMAGE_URL, inr, formatDate, to12h } from '../data/services';
import { useBooking } from '../context/BookingContext';
const serviceIcons=[Camera,Video,MonitorPlay,Image];
export function Home(){
 const nav=useNavigate();const {booking}=useBooking();const [slide,setSlide]=useState(0);
 const titles=[['Book Your','Creative Moments'],['Make Every','Moment Matter'],['Your Story,','Our Passion']];
 return <div className="home-screen page-flow">
 <div className="home-top"><Logo compact/><div className="home-actions"><button className="icon-button" aria-label="Notifications" onClick={()=>nav('/schedule')}><Bell size={22}/><span className="notification-dot"/></button><button className="icon-button" aria-label="Profile" onClick={()=>nav('/sign-in')}><UserRound size={22} fill="#333" color="#333"/></button></div></div>
 <div className="hero-banner"><div className="hero-copy"><h1>{titles[slide][0]}<br/><span>{titles[slide][1]}</span></h1><p>Photography&nbsp; | &nbsp;Videography<br/>Editing&nbsp; | &nbsp;Album Design</p><div className="hero-dots">{titles.map((_,i)=><button key={i} className={i===slide?'active':''} onClick={()=>setSlide(i)} aria-label={`Banner ${i+1}`}/>)}</div></div><img src={IMAGE_URL('camera.jpg')} alt="Professional camera"/></div>
 <PrimaryButton onClick={()=>nav('/book')} className="hero-cta"><CalendarDays size={21}/> Book a Service</PrimaryButton>
 <SectionHeading title="Our Services" action="View All" onClick={()=>nav('/book')}/>
 <div className="service-icons">{serviceIcons.map((Icon,i)=><button key={i} onClick={()=>nav('/book')} className="service-icon-card"><span><Icon size={25} strokeWidth={2.4}/></span><small>{['Photography','Videography','Editing','Album Design'][i]}</small></button>)}</div>
 <SectionHeading title="Why Choose Gokul Creative Studio?"/>
 <div className="why-row"><div className="why-tile"><MessageCircle size={30} color="#25D366"/><small>Quotation<br/>on WhatsApp</small></div><div className="why-tile"><Award size={32} color="#E8191C" fill="#FDEEEE"/><small>Unique<br/>Booking ID</small></div><div className="why-tile"><Zap size={31} color="#E8191C" fill="#E8191C"/><small>Easy<br/>Booking</small></div></div>
 <SectionHeading title="Upcoming Booking" action="View All" onClick={()=>nav('/schedule')}/>
 <button className="upcoming-home" onClick={()=>nav(booking.bookingId?'/confirmed':'/schedule')}><img src={IMAGE_URL('combo.jpg')} alt="Wedding photography"/><div><strong>{booking.eventType} Photography</strong><p><CalendarDays size={13}/> {formatDate(booking.date)} &nbsp;|&nbsp; {to12h(booking.time)}</p><p><MapPin size={13}/> {booking.venue}</p></div><StatusBadge status={booking.bookingId?'Confirmed':'Upcoming'}/><ChevronRight size={17}/></button>
 <p className="demo-watermark">GCS booking demo · No actual booking or payment</p>
 </div>;
}
export function BookService(){
 const nav=useNavigate();const {booking,update}=useBooking();
 return <div className="inner-screen page-flow"><Header logo showBell back="/home"/><div className="page-padding">
 <div className="screen-intro compact"><h2>Book a Service</h2><p>Choose your service and create your special moments</p></div>
 <div className="service-list">{SERVICES.map(s=><div className={`service-card ${booking.serviceId===s.id?'selected':''}`} key={s.id}>
 <img src={IMAGE_URL(s.image)} alt={s.name}/><div className="service-copy"><strong>{s.name}</strong><p>{s.detail}</p><span>From <b>{inr(s.from)}</b></span></div><button className="small-red" onClick={()=>update({serviceId:s.id})}>{booking.serviceId===s.id?'Selected':'Select'} <ArrowRight size={14}/></button>
 </div>)}</div>
 <div className="benefit-cards"><div className="benefit green-tint"><MessageCircle size={32} color="#25D366"/><div><strong>Get Quotation<br/>on WhatsApp</strong><p>Quick response<br/>from our team</p></div><ChevronRight size={18}/></div>
 <div className="benefit red-tint"><Award size={32} color="#E8191C"/><div><strong>Unique<br/>Booking ID</strong><p>Get a unique ID<br/>for your booking</p></div><ChevronRight size={18}/></div></div>
 <PrimaryButton onClick={()=>nav('/booking-details')} className="bottom-cta">Continue Booking</PrimaryButton>
 </div></div>;
}
