import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type ServiceId } from '../data/services';

export type Booking = {
  fullName: string;
  email: string;
  phone: string;
  serviceId: ServiceId;
  eventType: string;
  date: string;
  time: string;
  venue: string;
  notes: string;
  paymentMethod: 'UPI' | 'Credit / Debit Card' | 'Net Banking' | 'Wallets';
  paymentStatus: 'Pending' | 'Confirmed';
  bookingId: string;
  quotationNo: string;
};
export const initialBooking: Booking = {
  fullName: 'Rahul Sharma', email: 'rahulsharma@gmail.com', phone: '+91 98765 43210',
  serviceId: 'photography', eventType: 'Wedding', date: '2026-10-07', time: '10:00',
  venue: 'Rajkot, Gujarat', notes: '', paymentMethod: 'UPI', paymentStatus: 'Pending',
  bookingId: '', quotationNo: 'GCS-QT-20261007-001',
};
type BookingStore = { booking: Booking; update: (p: Partial<Booking>) => void; confirm: () => string; reset: () => void };
const Context = createContext<BookingStore | null>(null);
function load(): Booking {
  try { const value = localStorage.getItem('gcs-demo-booking-v1'); if (!value) return initialBooking;
    const saved = JSON.parse(value) as Partial<Booking>;
    const legacy: Record<string, ServiceId> = {combo:'wedding',editing:'videography',album:'wedding'};
    const valid: ServiceId[] = ['wedding','photography','baby','prewedding','videography','events'];
    const serviceId = saved.serviceId && valid.includes(saved.serviceId) ? saved.serviceId : (legacy[String(saved.serviceId)] || initialBooking.serviceId);
    return {...initialBooking,...saved,serviceId}; }
  catch { return initialBooking; }
}
export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<Booking>(load);
  useEffect(() => { localStorage.setItem('gcs-demo-booking-v1', JSON.stringify(booking)); }, [booking]);
  const update = (p: Partial<Booking>) => setBooking(prev => {
    const edited = ['serviceId','date','time','venue','eventType','notes'].some(k => k in p);
    return { ...prev, ...(edited ? { bookingId: '', paymentStatus: 'Pending' as const } : {}), ...p };
  });
  const confirm = () => {
    const d = booking.date.replaceAll('-', '');
    const n = String(Math.floor(100 + Math.random()*900));
    const id = booking.bookingId || `GCS-${d}-${n}`;
    setBooking(prev => ({ ...prev, bookingId: id, paymentStatus: 'Confirmed', quotationNo: `GCS-QT-${d}-001` }));
    return id;
  };
  const reset = () => setBooking(initialBooking);
  return <Context.Provider value={{ booking, update, confirm, reset }}>{children}</Context.Provider>;
}
export function useBooking() {
  const state = useContext(Context);
  if (!state) throw new Error('useBooking must be inside BookingProvider');
  return state;
}
