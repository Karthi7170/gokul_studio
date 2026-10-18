/**
 * Illustrative packages for the frontend demo. These are NOT published prices
 * or confirmed deliverables; the studio must approve them before launch.
 */
export const SERVICES = [
 { id:'wedding', name:'Wedding Packages', detail:'Complete wedding photo + film coverage', image:'combo.jpg', thumbnail:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1050&q=80', from:26000, event:'Wedding', tag:'Most popular',
   included:['Traditional ceremony photography','Candid moments and family portraits','Full-event cinematic videography','3–5 minute wedding highlight film','Professionally edited digital photographs','Online gallery for easy sharing','Premium album design consultation'] },
 { id:'photography', name:'Photography', detail:'Portraits, celebrations and professional events', image:'photography.jpg', thumbnail:'https://images.unsplash.com/photo-1758613654240-e531842faea6?auto=format&fit=crop&w=1050&q=80', from:10000, event:'Portrait Session', tag:'Timeless frames',
   included:['Professional photographer for your session','Candid and posed photographs','Lighting and composition support','Color-corrected, retouched highlights','High-resolution digital photo delivery','Private gallery for viewing and sharing'] },
 { id:'baby', name:'Baby Shooting', detail:'Newborn, baby milestones and birthdays', image:'photography.jpg', thumbnail:'https://images.unsplash.com/photo-1701839641334-e3a1579569fb?auto=format&fit=crop&w=1050&q=80', from:9000, event:'Baby Shoot', tag:'Little moments',
   included:['Baby-friendly photo session planning','Milestone and family portraits','Natural-light and styled setups','Gentle, baby-paced shooting breaks','Edited high-resolution photographs','Private online sharing gallery'] },
 { id:'prewedding', name:'Pre-Wedding Shoot', detail:'Save-the-date photos and couple films', image:'combo.jpg', thumbnail:'https://images.unsplash.com/photo-1543835380-c5c7bf5f4d82?auto=format&fit=crop&w=1050&q=80', from:18000, event:'Pre-wedding', tag:'Couple favourites',
   included:['Creative shoot concept consultation','Couple portrait photography','One agreed shoot location','Outfit and pose guidance','Professionally edited digital photos','Short cinematic couple teaser'] },
 { id:'videography', name:'Cinematic Videography', detail:'Memorable films for your special occasions', image:'videography.jpg', thumbnail:'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1050&q=80', from:15000, event:'Corporate Event', tag:'Made for motion',
   included:['Professional event videographer','Cinematic event coverage','Multi-shot storytelling and composition','Edited highlight video','Licensed or client-provided music guidance','HD digital video delivery'] },
 { id:'events', name:'Events & Celebrations', detail:'Birthdays, engagements and family functions', image:'combo.jpg', thumbnail:'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1050&q=80', from:12000, event:'Birthday', tag:'Every celebration',
   included:['Pre-event coverage discussion','Candid event photography','Key moments and group photographs','Basic stage and décor coverage','Edited digital highlights','Shareable online photo gallery'] },
] as const;
export type ServiceId = typeof SERVICES[number]['id'];
export type ServicePackage = typeof SERVICES[number];
export const THUMBNAIL_URL=(item:{thumbnail:string})=>item.thumbnail;
export const IMAGE_URL=(name:string)=>`${import.meta.env.BASE_URL}images/${name}`;
// Set the studio's verified public enquiry phone number here (E.164) to enable calling.
export const STUDIO_PHONE = '';
export function getQuote(id: ServiceId) {
 const item=SERVICES.find(s=>s.id===id) || SERVICES[0];
 const lines=[{label:item.name,qty:1,rate:item.from}];
 return {lines,subtotal:item.from,discount:0,total:item.from};
}
export const inr=(value:number)=>`₹${value.toLocaleString('en-IN')}`;
export const formatDate=(iso:string)=>{
 if(!iso)return 'Choose a date';
 const [y,m,d]=iso.split('-').map(Number);
 return new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(y,m-1,d));
};
export const to12h=(slot:string)=>{
 const [h,m]=slot.split(':').map(Number);
 return `${String(h%12||12).padStart(2,'0')}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`;
};


/** Optional demo add-ons. Pricing and availability need studio confirmation. */
export const ADD_ONS=[
 {id:'drone',name:'Drone Coverage',price:15000,description:'Aerial video highlights'},
 {id:'stream',name:'Live Streaming',price:10000,description:'Remote event viewing'},
 {id:'album',name:'Extra Album',price:8000,description:'One additional designed album'},
 {id:'makeup',name:'Makeup Shoot',price:12000,description:'Dedicated preparation portraits'}
] as const;
export type AddOnId=typeof ADD_ONS[number]['id'];
export function getBookingEstimate(id:ServiceId,selected:readonly string[]=[]){
 const base=getQuote(id).total;
 const chosen=ADD_ONS.filter(a=>selected.includes(a.id));
 return {base,addOns:chosen,extras:chosen.reduce((sum,a)=>sum+a.price,0),subtotal:base+chosen.reduce((sum,a)=>sum+a.price,0),total:base+chosen.reduce((sum,a)=>sum+a.price,0)};
}
