import { type Booking } from '../context/BookingContext';
import { SERVICES, formatDate, inr, TOTAL, to12h } from '../data/services';
export function bookingMessage(b: Booking): string {
  const service = SERVICES.find(s=>s.id===b.serviceId)?.name || 'Photography';
  return `🎬 Gokul Creative Studio — Booking ${b.bookingId ? 'Confirmation' : 'Quotation'}\n\n`+
    `Booking ID: ${b.bookingId || 'Pending confirmation'}\n`+
    `Quotation No.: ${b.quotationNo}\n`+
    `Customer: ${b.fullName}\n`+
    `Event: ${b.eventType}\n`+
    `Selected Service: ${service}\n`+
    `Date: ${formatDate(b.date)}\nTime: ${to12h(b.time)} IST\n`+
    `Location: ${b.venue}\nTotal: ${inr(TOTAL)}\n`+
    `Payment Status: ${b.paymentStatus}\n\nThank you for choosing Gokul Creative Studio! ❤️`;
}
export const whatsappLink = (b: Booking) => `https://wa.me/?text=${encodeURIComponent(bookingMessage(b))}`;
export function openWhatsApp(b: Booking) {
  window.open(whatsappLink(b), '_blank', 'noopener,noreferrer');
}
export async function shareDetails(b: Booking) {
  const msg = bookingMessage(b);
  if (navigator.share) {
    try { await navigator.share({ title: 'Gokul Creative Studio Booking', text: msg }); return; }
    catch { /* User cancelled or unsupported; open WhatsApp instead */ }
  }
  openWhatsApp(b);
}
