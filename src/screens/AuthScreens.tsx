import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react';
import { AuthOr, BackButton, Logo, OutlineButton, PrimaryButton, SocialButton, TextInput } from '../components/UI';
import { useBooking } from '../context/BookingContext';
function AuthLayout({children,topBack=false}:{children:React.ReactNode;topBack?:boolean}){
 return <div className="auth-screen page-flow"><div className="wave-top"/><div className="wave-bottom"/>
 {topBack&&<div className="auth-back"><BackButton to="/sign-in"/></div>}
 <div className="auth-content">{children}</div></div>;
}
export function SignIn(){
 const nav=useNavigate();const {booking,update}=useBooking();
 const [email,setEmail]=useState(booking.email||'');const [password,setPassword]=useState('');const [error,setError]=useState('');
 const login=()=>{if(!/\S+@\S+\.\S+/.test(email)||!password){setError('Enter a valid email and password to continue.');return;}update({email});nav('/home');};
 return <AuthLayout><div className="signin-logo"><Logo/></div><div className="auth-heading"><strong>Welcome to</strong><h1>Gokul Creative Studio</h1><p>Capture &nbsp;•&nbsp; Create &nbsp;•&nbsp; Cherish</p></div>
 <div className="auth-inputs"><TextInput icon={Mail} type="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)}/><TextInput icon={LockKeyhole} placeholder="Enter your password" password value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}/></div>
 <button className="forgot-link" onClick={()=>nav('/forgot-password')}>Forgot Password?</button>
 {error&&<p role="alert" className="error-text">{error}</p>}
 <PrimaryButton onClick={login} disabled={!email||!password}>Sign In</PrimaryButton><AuthOr/>
 <SocialButton provider="Google" onClick={()=>nav('/home')}/><SocialButton provider="Apple" onClick={()=>nav('/home')}/>
 <p className="auth-footer">Don't have an account? <button onClick={()=>nav('/sign-up')}>Create an Account</button></p>
 <p className="demo-note">Demo only — enter any email and password; social buttons skip authentication.</p></AuthLayout>;
}
export function SignUp(){
 const nav=useNavigate();const {booking,update}=useBooking();
 const [name,setName]=useState('');const [email,setEmail]=useState('');const [phone,setPhone]=useState('');const [pw,setPw]=useState('');const [confirm,setConfirm]=useState('');const [error,setError]=useState('');
 const valid=name.trim().length>=2&&/\S+@\S+\.\S+/.test(email)&&phone.replace(/\D/g,'').length>=10&&pw.length>=8&&confirm===pw;
 const signup=()=>{if(!valid){setError('Please complete every field. Passwords must match (8+ characters).');return;}update({fullName:name,email,phone});nav('/home');};
 return <AuthLayout><div className="signup-logo"><Logo compact/></div><div className="auth-heading"><h2>Create Your <em>Account</em></h2><p>Join Gokul Creative Studio and capture<br/>your creative moments with ease.</p></div>
 <div className="signup-inputs"><TextInput icon={UserRound} placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} helper="Enter your full name"/>
 <TextInput icon={Mail} type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} helper="Enter your email address"/>
 <TextInput icon={Phone} type="tel" placeholder="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} helper="Enter your mobile number"/>
 <TextInput icon={LockKeyhole} placeholder="Password" password value={pw} onChange={e=>setPw(e.target.value)} helper="Create a strong password (min. 8 characters)"/>
 <TextInput icon={LockKeyhole} placeholder="Confirm Password" password value={confirm} onChange={e=>setConfirm(e.target.value)} helper="Re-enter your password"/></div>
 {error&&<p role="alert" className="error-text">{error}</p>}
 <PrimaryButton disabled={!valid} onClick={signup}>Sign Up</PrimaryButton><AuthOr/>
 <SocialButton provider="Google" onClick={()=>nav('/home')}/><SocialButton provider="Apple" onClick={()=>nav('/home')}/>
 <p className="auth-footer">Already have an account? <button onClick={()=>nav('/sign-in')}>Sign In</button></p></AuthLayout>;
}
export function ForgotPassword(){
 const nav=useNavigate();const [value,setValue]=useState('');const [message,setMessage]=useState('');
 const ok=/\S+@\S+\.\S+/.test(value)||value.replace(/\D/g,'').length>=10;
 return <AuthLayout topBack><div className="forgot-logo"><Logo/></div><div className="auth-heading"><h2>Forgot <em>Password?</em></h2><p>No worries! Enter your registered<br/>email address or mobile number and<br/>we'll send you a reset link.</p></div>
 <TextInput icon={Mail} placeholder="Enter your email or mobile number" value={value} onChange={e=>setValue(e.target.value)}/>
 <PrimaryButton disabled={!ok} onClick={()=>setMessage('Demo: your reset link is ready. No message was sent.')}><span className="button-prefix">➤</span> Send Reset Link</PrimaryButton>
 <AuthOr/><OutlineButton disabled={!ok} onClick={()=>setMessage('Demo OTP: 123456 (no SMS was sent).')}><span className="red">▣</span> Verify with OTP <ArrowRight size={17}/></OutlineButton>
 {message&&<div className="inline-success" role="status">{message}</div>}
 <button className="back-to-login" onClick={()=>nav('/sign-in')}><ArrowLeft size={17}/> Back to <span>Sign In</span></button></AuthLayout>;
}
