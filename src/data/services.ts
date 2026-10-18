export const SERVICES = [
  { id: 'photography', name: 'Photography', detail: 'Wedding, Pre-wedding, Events, Portraits', from: 10000, image: 'photography.jpg' },
  { id: 'videography', name: 'Videography', detail: 'Cinematic Video, Event Coverage', from: 15000, image: 'videography.jpg' },
  { id: 'combo', name: 'Photo + Video Combo', detail: 'Best Value Package for Your Big Day', from: 20000, image: 'combo.jpg' },
  { id: 'editing', name: 'Editing Services', detail: 'Photo & Video Editing, Color Grading', from: 2000, image: 'editing.jpg' },
  { id: 'album', name: 'Album Design', detail: 'Premium Album Design & Printing', from: 3000, image: 'album.jpg' },
] as const;
export type ServiceId = typeof SERVICES[number]['id'];
export const IMAGE_URL = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;
export const SAMPLE_QUOTE_LINES = [
  { label: 'Wedding Photography', qty: 1, rate: 10000 },
  { label: 'Cinematic Videography', qty: 1, rate: 15000 },
  { label: 'Album Design', qty: 1, rate: 3000 },
];
export const SUBTOTAL = 28000;
export const DISCOUNT = 2000;
export const TOTAL = SUBTOTAL - DISCOUNT;
export const inr = (value: number) => `₹${value.toLocaleString('en-IN')}`;
export const formatDate = (iso: string) => {
  if (!iso) return 'Choose a date';
  const [y,m,d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', { day:'2-digit', month:'short', year:'numeric' }).format(new Date(y,m-1,d));
};
export const to12h = (slot: string) => {
  const [h,m] = slot.split(':').map(Number);
  return `${String(h%12||12).padStart(2,'0')}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`;
};
