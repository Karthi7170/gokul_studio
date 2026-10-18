import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft,ArrowRight,Camera,CheckCircle2,LockKeyhole,Mail,Phone,ShieldCheck,Sparkles,UserRound} from 'lucide-react';
import {Logo,PrimaryButton,TextInput} from '../components/UI';
import {useAuth} from '../context/AuthContext';
import {requiredSupabase,authConfigured} from '../lib/supabase';
function AuthLayout({children}:{children:React.ReactNode}){
 return <div className="auth-screen premium-auth page-flow"><div className="premium-auth-top"><span className="auth-camera-mark"><Camera size={19}/></span><span>GOKUL <b>CREATIVE STUDIO</b></span><span className="auth-spark"><Sparkles size={17}/></span></div><div className="premium-auth-banner"><span>THE MOMENTS YOU LIVE.<br/><b>THE STORIES WE KEEP.</b></span></div><div className="premium-auth-card">{children}</div><p className="premium-auth-bottom">Capture the feeling. Keep the story.</p></div>;
}
export function SignIn(){
 const nav=useNavigate(),{signIn}=useAuth();
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const login=async()=>{if(!email.trim()||!password)return;
  setBusy(true);setError('');
  try{await signIn(email,password);nav('/home',{replace:true});}
  catch(e){setError(e instanceof Error?e.message:'Could not sign in. Please try again.');}
  finally{setBusy(false);}
 };
 return <AuthLayout><div className="auth-heading premium-auth-heading"><span className="auth-eyebrow">WELCOME BACK</span><h2>Sign in to your <em>studio</em></h2><p>Your memories, bookings and quotations in one place.</p></div>
 <div className="auth-inputs"><TextInput label="Email address" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/><TextInput label="Password" icon={LockKeyhole} autoComplete="current-password" placeholder="Your password" password value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&void login()}/></div>
 <button className="forgot-link" onClick={()=>nav('/forgot-password')}>Forgot password?</button>
 {!authConfigured&&<p className="error-text" role="alert">Authentication is not configured for this environment.</p>}
 {error&&<p className="error-text" role="alert">{error}</p>}
 <PrimaryButton loading={busy} disabled={!authConfigured||!email||!password} onClick={()=>void login()}>Secure Sign In</PrimaryButton>
 <p className="auth-footer">New to Gokul Studio? <button onClick={()=>nav('/sign-up')}>Create an account</button></p>
 <div className="auth-trust"><ShieldCheck size={17}/> Secure account powered by Supabase Auth</div></AuthLayout>;
}
function normalizePhone(phone:string){const raw=phone.replace(/[\s()\-]/g,'');if(/^\d{10}$/.test(raw))return '+91'+raw;if(/^91\d{10}$/.test(raw))return '+'+raw;return raw;}
export function SignUp(){
 const nav=useNavigate(),{signUp}=useAuth();
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[phone,setPhone]=useState(''),[pw,setPw]=useState(''),[confirm,setConfirm]=useState(''),[consent,setConsent]=useState(false);
 const [error,setError]=useState(''),[success,setSuccess]=useState(''),[busy,setBusy]=useState(false);
 const valid=name.trim().length>=2&&/^\S+@\S+\.\S+$/.test(email)&&/^\+[1-9]\d{7,14}$/.test(normalizePhone(phone))&&pw.length>=8&&pw===confirm;
 const signup=async()=>{
  if(!valid)return;setBusy(true);setError('');
  try{const session=await signUp({fullName:name,email,phone:normalizePhone(phone),password:pw,whatsappOptIn:consent});
   if(session)nav('/home',{replace:true});
   else setSuccess('Check your email for a confirmation link. After verifying, sign in with your email and password.');
  }catch(e){setError(e instanceof Error?e.message:'Could not create your account.');}finally{setBusy(false);}
 };
 return <AuthLayout><div className="auth-heading premium-auth-heading"><span className="auth-eyebrow">JOIN THE STUDIO</span><h2>Every story starts <em>here</em></h2><p>Create your personal account to get quotations and manage your event enquiries.</p></div>
 {!success?<><div className="signup-inputs">
 <TextInput label="Full name" icon={UserRound} autoComplete="name" placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)}/>
 <TextInput label="Email address" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
 <TextInput label="Mobile / WhatsApp number" icon={Phone} type="tel" autoComplete="tel" placeholder="+91 98765 43210" value={phone} onChange={e=>setPhone(e.target.value)} helper="Use your own number, with country code. Indian 10-digit numbers are supported."/>
 <TextInput label="Password" icon={LockKeyhole} autoComplete="new-password" placeholder="At least 8 characters" password value={pw} onChange={e=>setPw(e.target.value)}/>
 <TextInput label="Confirm password" icon={LockKeyhole} autoComplete="new-password" placeholder="Confirm password" password value={confirm} onChange={e=>setConfirm(e.target.value)}/>
 </div>
 <label className="notification-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>I'd like to receive booking quotation and payment information at this number via WhatsApp when messaging is enabled.</span></label>
 {error&&<p role="alert" className="error-text">{error}</p>}
 <PrimaryButton loading={busy} disabled={!authConfigured||!valid} onClick={()=>void signup()}>Create Secure Account</PrimaryButton></>:
 <div className="auth-success"><CheckCircle2 size={42}/><h3>Email confirmation required</h3><p>{success}</p><PrimaryButton onClick={()=>nav('/sign-in')}>Go to Sign In</PrimaryButton></div>}
 <p className="auth-footer">Already registered? <button onClick={()=>nav('/sign-in')}>Sign In</button></p>
 <div className="auth-trust"><ShieldCheck size={17}/> No prefilled accounts · Email verification supported</div></AuthLayout>;
}
export function ForgotPassword(){
 const nav=useNavigate(),{sendPasswordReset}=useAuth();const [email,setEmail]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 const submit=async()=>{setBusy(true);setMessage('');try{await sendPasswordReset(email);setMessage('If an account exists, a real password-reset email has been sent. Check your inbox.');}catch(e){setMessage(e instanceof Error?e.message:'Unable to send reset email.');}finally{setBusy(false);}};
 return <AuthLayout><button className="auth-back-link" onClick={()=>nav('/sign-in')}><ArrowLeft size={17}/> Back to sign in</button>
 <div className="auth-heading premium-auth-heading"><span className="auth-eyebrow">ACCOUNT RECOVERY</span><h2>Reset your <em>password</em></h2><p>Enter your registered email and we'll send a secure recovery link.</p></div>
 <TextInput label="Email address" icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
 <PrimaryButton loading={busy} disabled={!/^\S+@\S+\.\S+$/.test(email)} onClick={()=>void submit()}>Send Reset Link</PrimaryButton>
 {message&&<p role="status" className="auth-notice">{message}</p>}
 </AuthLayout>;
}
export function ResetPassword(){
 const nav=useNavigate();const [pw,setPw]=useState(''),[confirm,setConfirm]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 const submit=async()=>{setBusy(true);try{const {error}=await requiredSupabase().auth.updateUser({password:pw});if(error)throw error;setMessage('Password updated successfully.');setTimeout(()=>nav('/home',{replace:true}),850);}catch(e){setMessage(e instanceof Error?e.message:'Could not reset password');}finally{setBusy(false);}};
 return <AuthLayout><div className="auth-heading premium-auth-heading"><span className="auth-eyebrow">RECOVER YOUR ACCOUNT</span><h2>Choose a new <em>password</em></h2></div>
 <TextInput label="New password" icon={LockKeyhole} password placeholder="8+ characters" value={pw} onChange={e=>setPw(e.target.value)}/>
 <TextInput label="Confirm new password" icon={LockKeyhole} password placeholder="Repeat password" value={confirm} onChange={e=>setConfirm(e.target.value)}/>
 <PrimaryButton loading={busy} disabled={pw.length<8||pw!==confirm} onClick={()=>void submit()}>Save New Password</PrimaryButton>
 {message&&<p role="status" className="auth-notice">{message}</p>}
 </AuthLayout>;
}
