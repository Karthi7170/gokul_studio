import { type ReactNode, type InputHTMLAttributes, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Check, ChevronRight, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound, CalendarDays, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StudioBrandLogo } from './StudioBrandLogo';
import {SignedInAvatarButton} from './SignedInAvatarButton';

type IconComp = LucideIcon;
export function Logo({compact=false}:{compact?:boolean}) {
 return <StudioBrandLogo compact={compact} className="ui-studio-brand"/>;
}
export function PrimaryButton({children, onClick, disabled=false, green=false, icon=true, loading=false, className=''}:{children:ReactNode;onClick?:()=>void;disabled?:boolean;green?:boolean;icon?:boolean;loading?:boolean;className?:string}) {
  return <button className={`primary-button ${green?'green-button':''} ${className}`} disabled={disabled||loading} onClick={onClick}>
    {loading?<span className="spinner" />:children}{!loading&&icon&&<ArrowRight size={18} strokeWidth={2.3}/>}</button>;
}
export function OutlineButton({children,onClick,disabled=false,className=''}:{children:ReactNode;onClick?:()=>void;disabled?:boolean;className?:string}){
  return <button className={`outline-button ${className}`} onClick={onClick} disabled={disabled}>{children}</button>;
}
export function BackButton({ to }: { to?:string }) {
  const nav=useNavigate(); return <button aria-label="Back" className="back-icon" onClick={()=>to?nav(to):nav(-1)}><ArrowLeft size={21}/></button>;
}
export function Header({title,back,logo=false}: {title?:string;back?:string;logo?:boolean}){
 return <header className="screen-header">
   <div className="header-side"><BackButton to={back}/></div>
   {logo?<Logo compact/>:<h1 className="header-title">{title}</h1>}
   <div className="header-side right"><SignedInAvatarButton/></div>
 </header>;
}
export function InfoField({ label, icon:Icon, value, onClick, required=false }: {label:string;icon:IconComp;value:string;onClick?:()=>void;required?:boolean}) {
 return <div className="field-group"><label className="field-label">{label}{required&&<em> *</em>}</label>
  <button type="button" className="info-field" onClick={onClick}><Icon size={16} className="red"/><span>{value}</span><ChevronRight size={16} className="muted"/></button>
 </div>;
}
export function TextInput({label,icon:Icon,helper,password=false,hasError=false, ...props}: InputHTMLAttributes<HTMLInputElement> & {label?:string;icon:IconComp;helper?:string;password?:boolean;hasError?:boolean}){
 const [show,setShow]=useState(false);
 return <label className={`input-wrapper ${hasError?'input-error':''}`}>
  {label&&<span className="input-label">{label}</span>}
  <span className="input-box"><Icon size={18} strokeWidth={1.8}/>
  <input {...props} type={password?(show?'text':'password'):props.type||'text'} />
  {password&&<button type="button" aria-label={show?'Hide password':'Show password'} onClick={()=>setShow(!show)} className="eye-button">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button>}
  </span>{helper&&<small className="input-helper">{helper}</small>}
 </label>;
}
export function SocialButton({provider,onClick}:{provider:'Google'|'Apple';onClick:()=>void}){
 return <button className="social-button" onClick={onClick}><span className={provider==='Google'?'google-letter':'apple-symbol'}>{provider==='Google'?'G':'●'}</span> Sign {provider==='Google'?'in':'in'} with {provider}</button>;
}
export function AuthOr(){return <div className="or-divider"><span/>OR<span/></div>;}
export function ScreenTitle({children,sub}: {children:ReactNode;sub?:string}) {return <div className="screen-intro"><h2>{children}</h2>{sub&&<p>{sub}</p>}</div>;}
export function Stepper({step}:{step:1|2|3}){
 return <div className="stepper">{['Package','Event','Payment'].map((item,i)=><div className={`step ${i+1<=step?'active':''}`} key={item}><span>{i+1<=step?(i+1===step?i+1:<Check size={12}/>):i+1}</span><small>{item}</small></div>)}</div>;
}
export function DetailLine({icon:Icon,label,value}:{icon:IconComp;label:string;value:string}){
 return <div className="detail-line"><Icon size={16} className="red"/><span>{label}</span><strong>{value}</strong></div>;
}
export function StatusBadge({status}:{status:'Confirmed'|'Pending'|'Upcoming'}) {
 return <span className={`status-badge ${status.toLowerCase()}`}>{status==='Confirmed'&&<Check size={13}/>} {status}</span>;
}
export function SectionHeading({title,onClick,action='View All'}:{title:string;onClick?:()=>void;action?:string}){
 return <div className="section-heading"><h3>{title}</h3>{onClick&&<button onClick={onClick}>{action} <ArrowRight size={15}/></button>}</div>;
}
export {ArrowRight, ArrowLeft, Camera, Check, ChevronRight, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound, CalendarDays};
