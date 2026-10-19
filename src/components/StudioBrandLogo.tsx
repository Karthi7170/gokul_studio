/** Official Gokul Creative Studio brand mark and wordmark, traced from supplied logo. */
export function StudioBrandLogo({compact=false,className=''}:{compact?:boolean;className?:string}){
 return <img
  className={['studio-brand-logo',compact?'studio-brand-logo-small':'',className].filter(Boolean).join(' ')}
  src={import.meta.env.BASE_URL+'gokul-logo.svg'}
  alt="Gokul Creative Studio"
  decoding="async"
  draggable={false}
 />;
}
export function StudioBrandMark({className=''}:{className?:string}){
 return <img
  className={['studio-brand-mark',className].filter(Boolean).join(' ')}
  src={import.meta.env.BASE_URL+'gokul-mark.svg'}
  alt="Gokul Creative Studio"
  decoding="async"
  draggable={false}
 />;
}
