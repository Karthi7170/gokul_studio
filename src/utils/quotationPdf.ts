import { jsPDF } from 'jspdf';
import { type Booking } from '../context/BookingContext';
import { SERVICES, SAMPLE_QUOTE_LINES, inr, formatDate, to12h, SUBTOTAL, DISCOUNT, TOTAL } from '../data/services';
export function downloadQuotation(booking: Booking) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const red = '#E8191C';
  pdf.setFillColor(232, 25, 28); pdf.rect(0, 0, 210, 32, 'F');
  pdf.setTextColor('#FFFFFF'); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(20); pdf.text('GOKUL CREATIVE STUDIO', 14, 18);
  pdf.setFont('helvetica','normal'); pdf.setFontSize(9); pdf.text('Capture  |  Create  |  Cherish', 14, 25);
  pdf.setTextColor('#111111'); pdf.setFont('helvetica','bold'); pdf.setFontSize(17); pdf.text('SERVICE QUOTATION', 14, 49);
  pdf.setFontSize(10); pdf.setTextColor(red); pdf.text(booking.quotationNo, 14, 57);
  pdf.setFont('helvetica','normal'); pdf.setTextColor('#444444');
  pdf.text(`Customer: ${booking.fullName}`, 14, 71); pdf.text(`Email: ${booking.email}`, 14, 78);
  pdf.text(`Phone: ${booking.phone}`, 14, 85);
  pdf.text(`Event: ${booking.eventType}`, 110, 71);
  pdf.text(`Date: ${formatDate(booking.date)}`, 110, 78);
  pdf.text(`Time: ${to12h(booking.time)} IST`, 110, 85);
  pdf.text(`Venue: ${booking.venue}`, 14, 94);
  const s = SERVICES.find(x=>x.id===booking.serviceId);
  pdf.text(`Requested service: ${s?.name || 'Photography'}`, 14, 102);
  pdf.setFillColor('#FDEEEE'); pdf.rect(14, 111, 182, 10, 'F');
  pdf.setFont('helvetica','bold'); pdf.text('Service', 18, 118); pdf.text('Qty', 117, 118); pdf.text('Rate (INR)', 133, 118); pdf.text('Amount (INR)', 163, 118);
  pdf.setFont('helvetica','normal');
  SAMPLE_QUOTE_LINES.forEach((line,i) => {
    const y=131+i*12; pdf.text(line.label,18,y); pdf.text(String(line.qty),117,y);
    pdf.text(line.rate.toLocaleString('en-IN'),136,y); pdf.text((line.rate*line.qty).toLocaleString('en-IN'),168,y);
    pdf.setDrawColor('#EBEBEB'); pdf.line(14,y+5,196,y+5);
  });
  pdf.setFont('helvetica','bold'); pdf.text(`Subtotal: INR ${SUBTOTAL.toLocaleString('en-IN')}`, 130, 180);
  pdf.text(`Discount: INR ${DISCOUNT.toLocaleString('en-IN')}`, 130, 189);
  pdf.setTextColor(red); pdf.setFontSize(16); pdf.text(`TOTAL: INR ${TOTAL.toLocaleString('en-IN')}`, 112, 204);
  pdf.setTextColor('#666666'); pdf.setFont('helvetica','normal'); pdf.setFontSize(9);
  pdf.text(`Total amount: ${inr(TOTAL).replace('₹','INR ')}`,14,220);
  pdf.text('Demo quotation. No actual payment or confirmed reservation is processed.',14,228);
  pdf.setDrawColor(red); pdf.line(14,265,196,265);
  pdf.text('Gokul Creative Studio | Capture. Create. Cherish.',14,274);
  pdf.save(`GCS-Quotation-${booking.quotationNo}.pdf`);
}
