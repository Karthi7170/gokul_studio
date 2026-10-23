/** Branded vector marks (Google multicolor G, Apple silhouette, Facebook blue). */
export type SocialProvider='google'|'apple'|'facebook';

export function SocialProviderIcon({provider}:{provider:SocialProvider}){
 if(provider==='google')return <svg viewBox="0 0 48 48" role="img" aria-label="Google" className="gcs-social-vector" focusable="false">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.28 5.48-4.84 7.18l7.73 6C44.34 38.03 46.98 31.84 46.98 24.55z"/>
  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.46-.76-3.03-.76-4.59s.28-3.13.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
 </svg>;
 if(provider==='apple')return <svg viewBox="0 0 24 24" role="img" aria-label="Apple" className="gcs-social-vector" focusable="false">
  <path fill="#111111" d="M17.05 20.28c-.98.95-2.05.8-3.1.35-1.11-.47-2.13-.47-3.29 0-1.45.63-2.22.45-3.08-.35C2.7 15.25 3.48 7.59 8.77 7.3c1.29.06 2.19.72 2.95.78 1.14-.23 2.22-.88 3.43-.8 1.45.12 2.54.68 3.26 1.69-3 .1-3.84 3.66-1.84 5.19.6.9 1.34 1.2 2.26 1.57-.48 1.37-1.2 2.6-2.26 3.73-1.06 1.13-2.13 2.2-3.55 2.15zM12.03 7.25c-.15-2.3 1.75-4.15 3.9-4.3.3 2.62-2.38 4.57-3.9 4.3z"/>
 </svg>;
 return <svg viewBox="0 0 24 24" role="img" aria-label="Facebook" className="gcs-social-vector" focusable="false">
  <circle cx="12" cy="12" r="11.5" fill="#0866FF"/>
  <path fill="#FFFFFF" d="M14.07 23.2v-8.4h2.8l.42-3.27h-3.22V9.44c0-.95.27-1.6 1.63-1.6h1.74V4.93c-.3-.04-1.33-.13-2.53-.13-2.53 0-4.26 1.54-4.26 4.38v2.35H7.78v3.27h2.87v8.4z"/>
 </svg>;
}
