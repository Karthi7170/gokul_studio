import { jsPDF } from 'jspdf';
import { type Booking } from '../context/BookingContext';
import { SERVICES, getQuote, inr, formatDate, to12h } from '../data/services';
export function downloadQuotation(booking: Booking) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const quote = getQuote(booking.serviceId);
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
  pdf.text(`Event date: ${formatDate(booking.date)}`, 110, 78);
  pdf.text(`Event time: ${to12h(booking.time)} IST`, 110, 85);
  const venueLines=pdf.splitTextToSize(`Venue: ${booking.venue}`, 176).slice(0,2);
  pdf.text(venueLines,14,94);
  const s = SERVICES.find(x=>x.id===booking.serviceId);
  pdf.text(`Requested service: ${s?.name || 'Photography'}`, 14, 105);
  pdf.setFillColor('#FDEEEE'); pdf.rect(14, 111, 182, 10, 'F');
  pdf.setFont('helvetica','bold'); pdf.text('Service', 18, 118); pdf.text('Qty', 117, 118); pdf.text('Rate (INR)', 133, 118); pdf.text('Amount (INR)', 163, 118);
  pdf.setFont('helvetica','normal');
  quote.lines.forEach((line,i) => {
    const y=131+i*12; pdf.text(line.label,18,y); pdf.text(String(line.qty),117,y);
    pdf.text(line.rate.toLocaleString('en-IN'),136,y); pdf.text((line.rate*line.qty).toLocaleString('en-IN'),168,y);
    pdf.setDrawColor('#EBEBEB'); pdf.line(14,y+5,196,y+5);
  });
  pdf.setFont('helvetica','bold'); pdf.text('Package inclusions (illustrative):', 18, 142);
  pdf.setFontSize(8); pdf.setFont('helvetica','normal');
  s?.included.forEach((feature,i)=>pdf.text(`- ${feature}`,18,149+i*4.4));
  pdf.setFontSize(10); pdf.setFont('helvetica','bold'); pdf.text(`Subtotal: INR ${quote.subtotal.toLocaleString('en-IN')}`, 130, 180);
  pdf.text(`Discount: INR ${quote.discount.toLocaleString('en-IN')}`, 130, 189);
  pdf.setTextColor(red); pdf.setFontSize(16); pdf.text(`TOTAL: INR ${quote.total.toLocaleString('en-IN')}`, 112, 204);
  pdf.setTextColor('#666666'); pdf.setFont('helvetica','normal'); pdf.setFontSize(9);
  pdf.text(`Total amount: ${inr(quote.total).replace('₹','INR ')}`,14,220);
  pdf.text('Illustrative quote; no real payment or confirmed studio booking.',14,228);
  pdf.setDrawColor(red); pdf.line(14,265,196,265);
  pdf.text('Gokul Creative Studio | Capture. Create. Cherish.',14,274);
  pdf.save(`GCS-Quotation-${booking.quotationNo}.pdf`);
}


/**
 * Generates a standalone package estimate without requesting personal details,
 * a booking date or a payment. Amounts remain indicative until studio approval.
 */
export function downloadPackageQuotation(serviceId: import('../data/services').ServiceId){
 const item=SERVICES.find(s=>s.id===serviceId)||SERVICES[0];
 const estimate=getQuote(item.id);
 const pdf=new jsPDF({unit:'mm',format:'a4',compress:true});
 const red:[number,number,number]=[255,40,0];
 const black:[number,number,number]=[29,29,32];
 pdf.setProperties({title:'GCS - '+item.name+' quotation',subject:'Illustrative package estimate',author:'Gokul Creative Studio'});
 pdf.setFillColor(...red);pdf.rect(0,0,210,43,'F');
 pdf.setTextColor(255,255,255);pdf.setFont('helvetica','bold');pdf.setFontSize(22);
 pdf.text('GOKUL CREATIVE STUDIO',14,20);
 pdf.setFont('helvetica','normal');pdf.setFontSize(9);pdf.text('CAPTURE  /  CREATE  /  CHERISH',14,29);
 pdf.setTextColor(...black);pdf.setFont('helvetica','bold');pdf.setFontSize(17);pdf.text('PACKAGE QUOTATION',14,57);
 pdf.setDrawColor(255,40,0);pdf.setLineWidth(.65);pdf.line(14,62,196,62);
 pdf.setFontSize(14);pdf.text(item.name,14,75);
 pdf.setFont('helvetica','normal');pdf.setFontSize(10);pdf.setTextColor(94,94,101);
 const subLines=pdf.splitTextToSize(item.detail,178);
 pdf.text(subLines,14,83);
 pdf.setFillColor(255,244,241);pdf.setDrawColor(255,220,214);
 pdf.roundedRect(14,94,182,33,4,4,'FD');
 pdf.setTextColor(102,64,63);pdf.setFontSize(10);pdf.text('Illustrative starting package estimate',21,106);
 pdf.setFont('helvetica','bold');pdf.setTextColor(...red);pdf.setFontSize(20);
 pdf.text('INR '+estimate.total.toLocaleString('en-IN'),21,119);
 pdf.setTextColor(...black);pdf.setFont('helvetica','bold');pdf.setFontSize(12);
 pdf.text('PACKAGE INCLUSIONS',14,143);
 pdf.setFontSize(9);pdf.setFont('helvetica','normal');
 let y=154;
 for(const feature of item.included){
  const lines=pdf.splitTextToSize('- '+feature,170);
  pdf.text(lines,17,y);y+=7.5+Math.max(0,lines.length-1)*4.5;
 }
 y=Math.max(y+12,223);
 pdf.setFillColor(250,250,251);pdf.setDrawColor(227,227,229);
 pdf.roundedRect(14,y,182,32,3,3,'FD');
 pdf.setTextColor(...black);pdf.setFont('helvetica','bold');pdf.setFontSize(10);pdf.text('Important information',20,y+9);
 pdf.setFont('helvetica','normal');pdf.setFontSize(9);pdf.setTextColor(83,83,88);
 pdf.text('Final pricing, date, crew, duration and deliverables require studio approval.',20,y+18);
 pdf.text('This document is not a paid invoice or a confirmed booking.',20,y+25);
 pdf.setDrawColor(...red);pdf.setLineWidth(.45);pdf.line(14,278,196,278);
 pdf.setTextColor(109,109,112);pdf.setFontSize(8);
 pdf.text('GOKUL CREATIVE STUDIO   |   Customer package estimate',14,285);
 pdf.save('GCS-'+item.id+'-Package-Quotation.pdf');
}
