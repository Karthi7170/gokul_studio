import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft,ArrowRight,CheckCircle2,LockKeyhole,Mail,Phone,ShieldCheck,UserRound} from 'lucide-react';
import {PrimaryButton,TextInput} from '../components/UI';
import {useAuth} from '../context/AuthContext';
import {StudioBrandLogo} from '../components/StudioBrandLogo';
import {requiredSupabase,authConfigured} from '../lib/supabase';

type AuthPage='signin'|'signup';
function AuthLayout({children,mode='signin'}:{children:React.ReactNode;mode?:AuthPage}){
 const nav=useNavigate();
 return <div className={`auth-screen premium-auth gcs-auth-new gcs-auth-${mode} gcs-petal-auth page-flow`}>
  <div className="gcs-petal-top-art" aria-hidden="true"/>
  <header className="gcs-petal-brand-area">
    {mode==='signup'&&<button type="button" className="gcs-petal-back" aria-label="Back to sign in" onClick={()=>nav('/sign-in')}><ArrowLeft size={20}/></button>}
    <StudioBrandLogo className="gcs-petal-official-logo"/>
    <span className="gcs-petal-camera-outline" aria-hidden="true"/>
  </header>
  <div className="gcs-petal-welcome">
    <span>Welcome to</span>
    <h1>Gokul Creative Studio</h1>
    <p>Capture <b>·</b> Create <b>·</b> Cherish</p>
  </div>
  <main className="gcs-auth-panel gcs-petal-auth-panel">{children}</main>
  <div className="gcs-petal-bottom-art" aria-hidden="true"/>
 </div>;
}
type OAuthProvider='google'|'apple'|'facebook';
function SocialRow({onProvider}:{onProvider:(provider:OAuthProvider)=>void}){
 return <div className="gcs-petal-social-group">
  <div className="gcs-auth-divider"><span/>OR<span/></div>
  <div className="gcs-auth-socials">
   <button type="button" aria-label="Continue with Google" onClick={()=>onProvider('google')}><span className="gcs-google-letter" aria-hidden="true">G</span><strong>Sign in with Google</strong></button>
   <button type="button" aria-label="Continue with Apple" onClick={()=>onProvider('apple')}><span className="gcs-apple-logo" aria-hidden="true"></span><strong>Sign in with Apple</strong></button>
   <button type="button" className="gcs-petal-facebook" aria-label="Continue with Facebook" onClick={()=>onProvider('facebook')}><span className="gcs-facebook-logo" aria-hidden="true">f</span><strong>Continue with Facebook</strong></button>
  </div>
 </div>;
}
async function startOAuth(provider:OAuthProvider){
 const {error}=await requiredSupabase().auth.signInWithOAuth({
  provider,
  options:{redirectTo:window.location.origin+window.location.pathname}
 });
 if(error)throw error;
}
function normalizePhone(phone:string){
 const raw=phone.replace(/[\s()\-]/g,'');
 if(/^\d{10}$/.test(raw))return '+91'+raw;
 if(/^91\d{10}$/.test(raw))return '+'+raw;
 return raw;
}
export function SignIn(){
 const nav=useNavigate(),{signIn}=useAuth();
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const login=async()=>{if(!email.trim()||!password||busy)return;
  setBusy(true);setError('');
  try{await signIn(email,password);nav('/home',{replace:true});}
  catch(e){const message=e instanceof Error?e.message:'Could not sign in. Please try again.';setError(/email not confirmed/i.test(message)?'Please verify your email using the confirmation link before signing in.':message);}
  finally{setBusy(false);}
 };
 const oauth=async(provider:OAuthProvider)=>{
  setError('');
  try{await startOAuth(provider);}catch(e){setError(e instanceof Error?e.message:'This sign-in provider is not available. Try your email and password.');}
 };
 return <AuthLayout>
  <div className="gcs-auth-heading"><h2>Sign in</h2><p>Your bookings, quotations and memories in one place.</p></div>
  <form className="gcs-auth-form" onSubmit={e=>{e.preventDefault();void login();}}>
   <TextInput label="Email address" icon={Mail} type="email" autoComplete="email" inputMode="email" required placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
   <TextInput label="Password" icon={LockKeyhole} autoComplete="current-password" required placeholder="Your password" password value={password} onChange={e=>setPassword(e.target.value)}/>
   <div className="gcs-auth-inline"><span className="gcs-auth-remember"><CheckCircle2 size={17}/> Remember me</span><button type="button" onClick={()=>nav('/forgot-password')}>Forgot password?</button></div>
   {!authConfigured&&<p role="alert" className="error-text">Authentication is not configured for this environment.</p>}
   {error&&<p role="alert" className="error-text">{error}</p>}
   <button type="submit" className="gcs-auth-submit" disabled={!authConfigured||!email.trim()||!password||busy}>
    {busy?'Signing in…':<>Sign In <ArrowRight size={19}/></>}
   </button>
  </form>
  <SocialRow onProvider={p=>void oauth(p)}/>
  <p className="gcs-auth-switch">New to Gokul Studio? <button type="button" onClick={()=>nav('/sign-up')}>Create an account</button></p>
  <div className="gcs-auth-security"><ShieldCheck size={16}/> Secure account powered by Supabase Auth</div>
 </AuthLayout>;
}
export function SignUp(){
 const nav=useNavigate(),{signUp}=useAuth();
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[phone,setPhone]=useState(''),[pw,setPw]=useState(''),[confirm,setConfirm]=useState('');
 const [terms,setTerms]=useState(false),[consent,setConsent]=useState(false);
 const [error,setError]=useState(''),[success,setSuccess]=useState(''),[busy,setBusy]=useState(false);
 const validName=name.trim().length>=2;
 const validEmail=/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email.trim());
 const validPhone=/^\+[1-9]\d{7,14}$/.test(normalizePhone(phone));
 const validPassword=pw.length>=8;
 const readyToRegister=validName&&validEmail&&validPhone&&validPassword&&pw===confirm&&terms;
 const signup=async()=>{
  if(busy)return;
  setError('');
  if(!validName){setError('Enter your full name (at least 2 characters).');return;}
  if(!validEmail){setError('Enter a complete email address, such as name@example.com. Include the domain extension (.com, .in, etc.).');return;}
  if(!validPhone){setError('Enter a valid phone number. For an Indian number, enter 10 digits or +91 followed by 10 digits.');return;}
  if(!validPassword){setError('Your password must contain at least 8 characters.');return;}
  if(pw!==confirm){setError('Your passwords do not match.');return;}
  if(!terms){setError('Please agree to the booking account terms to continue.');return;}
  if(!authConfigured){setError('Registration is temporarily unavailable. Please try again later.');return;}
  setBusy(true);
  try{
   const session=await signUp({fullName:name,email,phone:normalizePhone(phone),password:pw,whatsappOptIn:consent});
   if(session)nav('/home',{replace:true});
   else setSuccess('Please check your email for a confirmation link. Once verified, you can sign in to your account.');
  }catch(e){setError(e instanceof Error?e.message:'Could not create your account.');}finally{setBusy(false);}
 };
 const oauth=async(provider:OAuthProvider)=>{
  setError('');
  try{await startOAuth(provider);}catch(e){setError(e instanceof Error?e.message:'This sign-up provider is not available. Try your email and password.');}
 };
 return <AuthLayout mode="signup">
  <div className="gcs-auth-heading"><h2>Create your account</h2><p>Join us and make your moments memorable.</p></div>
  {!success?
   <>
    <form className="gcs-auth-form gcs-auth-registration" noValidate onSubmit={e=>{e.preventDefault();void signup();}}>
     <TextInput label="Full name" icon={UserRound} autoComplete="name" required placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)}/>
     <TextInput label="Email address" icon={Mail} type="email" autoComplete="email" inputMode="email" required placeholder="you@example.com" value={email} hasError={email.trim().length>0&&!validEmail} aria-invalid={email.trim().length>0&&!validEmail} onChange={e=>{setEmail(e.target.value);setError('');}}/>
     {email.trim().length>0&&!validEmail&&<p className="gcs-signup-field-error" role="status">Enter a complete email address, for example name@example.com (with .com or .in).</p>}
     <TextInput label="Phone number" icon={Phone} type="tel" autoComplete="tel" inputMode="tel" required placeholder="+91 98765 43210" value={phone} onChange={e=>setPhone(e.target.value)}/>
     {phone.trim()&&!validPhone&&<p className="gcs-signup-hint" role="status">Use a valid mobile number, for example +91 98765 43210 or a 10-digit Indian number.</p>}
     <TextInput label="Password" icon={LockKeyhole} autoComplete="new-password" required placeholder="Create a password (8+ characters)" password value={pw} onChange={e=>setPw(e.target.value)}/>
     <TextInput label="Confirm password" icon={LockKeyhole} autoComplete="new-password" required placeholder="Confirm your password" password value={confirm} onChange={e=>setConfirm(e.target.value)}/>
     {confirm.length>0&&pw!==confirm&&<p className="gcs-signup-hint" role="status">The passwords must match.</p>}
     <label className="gcs-auth-consent"><input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)}/><span>I agree to create an account and allow my details to be used for booking requests.</span></label>
     <label className="gcs-auth-consent gcs-auth-whatsapp"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Send optional booking updates to my WhatsApp number when available.</span></label>
     {error&&<p role="alert" className="error-text">{error}</p>}
     {!readyToRegister&&<p className="gcs-signup-requirements" role="status">Please complete all fields with a valid email address and phone number, matching passwords of at least 8 characters, and accept the account terms.</p>}
     <p className="gcs-signup-hint">New customers can register with their own email address and mobile number. Email verification may be required before sign-in.</p>
     {!authConfigured&&<p className="error-text" role="alert">Registration is temporarily unavailable because the authentication service is not configured.</p>}
     <button type="submit" className="gcs-auth-submit" disabled={busy||!authConfigured}>
      {busy?'Creating account…':<>Create account <ArrowRight size={19}/></>}
     </button>
    </form>
    <SocialRow onProvider={p=>void oauth(p)}/>
   </>:
   <div className="gcs-auth-success" role="status"><CheckCircle2 size={40}/><h2>Email confirmation required</h2><p>{success}</p><button type="button" onClick={()=>nav('/sign-in')}>Go to Sign In <ArrowRight size={17}/></button></div>}
  <p className="gcs-auth-switch">Already have an account? <button type="button" onClick={()=>nav('/sign-in')}>Sign in</button></p>
 </AuthLayout>;
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
