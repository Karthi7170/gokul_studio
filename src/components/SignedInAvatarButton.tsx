import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {ProfileAvatarPhoto,useProfileAvatar} from './ProfileAvatarPhoto';

export function SignedInAvatarButton({className=''}:{className?:string}){
 const navigate=useNavigate();
 const {user,profile}=useAuth();
 const {avatarUrl,markAvatarBroken}=useProfileAvatar();
 const name=(profile?.full_name||String(user?.user_metadata?.full_name||'')).trim();
 const initials=(name.split(/\s+/).slice(0,2).map(p=>p.charAt(0)).join('')||'G').toUpperCase();
 if(!user)return null;
 return <button type="button" className={['gcs-global-avatar-button',className].filter(Boolean).join(' ')}
   aria-label="Open My Account" onClick={()=>navigate('/profile')}>
  <ProfileAvatarPhoto avatarUrl={avatarUrl} initials={initials} onError={markAvatarBroken}/>
 </button>;
}
