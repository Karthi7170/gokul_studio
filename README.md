# Gokul Creative Studio — Customer Booking & Quotation

A mobile-first React + Vite application for **Gokul Creative Studio**. Customers can register, select one of six event photo/video packages, view inclusions, request a quotation, and review unpaid payment estimates. Deployed to Vercel.

## Production

- Customer app: https://gokul-studio-five.vercel.app
- Source: https://github.com/Karthi7170/gokul_studio
- Framework: React 18, TypeScript, Vite, Tailwind CSS
- Authentication/database: Supabase (GCS project)
- Payments: **NOT enabled**. No funds are collected. Amounts are illustrative, and quotations require studio approval.

## Features

- Editorial mobile home page, curated image thumbnails, package filters and search.
- Six packages: Wedding, Photography, Baby Shoot, Pre-Wedding, Cinematic Videography, and Events.
- Full package details and inclusions, followed by event type, event date (native calendar picker), event time (native clock picker), and a single manually entered venue.
- Simplified location field with no Google Maps, GPS, or map-link controls. Date and time are required and must be chosen before requesting a quotation.
- **Real Supabase email/password sign-in and sign-up**, optional email confirmation, password reset, persistent sessions and sign-out.
- Accounts are not prepopulated. Sample customer names, passwords and payment confirmations have been removed.
- Registered name and phone from each customer's profile; phone opt-in preferences and optional SMS OTP verification.
- Customer requests stored in `public.gcs_booking_requests`, protected by owner-only Row Level Security.
- PDF quotations and manual WhatsApp share addressed to the registered customer number.
- Server endpoint `/api/notify` to deliver WhatsApp Business templates **only when** required approved Meta credentials, templates, and verified customer phone are configured.
- Four tap-to-complete **dummy** payment choices (UPI, card, net banking, wallet) record `demo_only` on the user's quotation request; no card, banking or UPI information is collected. This is a demo booking, **not** a paid studio reservation.
- A separate quotation-only option leaves the status `not_paid`.

## Installation

Install Node.js 20.19+ or newer.

```sh
npm install
npm run dev
npm run build
```

### Browser environment variables

```sh
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_BROWSER_PUBLISHABLE_KEY
```

Configure them in **Vercel → Gokul Studio → Settings → Environment Variables** for production, preview and development. They are safe for browser use only because Supabase RLS protects private data. **Never expose a Supabase service-role or secret API key in a VITE_ variable.**

### Supabase Auth URL configuration

Go to **Supabase → GCS → Authentication → URL Configuration**. Set the Site URL to `https://gokul-studio-five.vercel.app` and add these allowed redirect URLs:

- `https://gokul-studio-five.vercel.app/**`
- `http://localhost:5173/**` (for local testing)

Enable email/password login and account email confirmation under Auth Providers as appropriate. Add an SMTP provider for reliable production emails. SMS phone verification requires configuring a supported SMS provider in Supabase Auth.

### Database and security

Migrations create `gcs_customer_profiles` and `gcs_booking_requests`, both protected by Row Level Security tied to `auth.uid()`. Every newly registered user starts with their own empty data. Existing demo data in legacy localStorage keys is cleared.

## Date / time, location, and demo payment notes

Choose a future event date using the device's native calendar input, then select the event time using the device's clock picker. Enter the event venue or address directly; there are no map links, GPS or Maps pin entry controls. Date and time are saved to the quotation request and shown in the quotation review, PDF, payment summary, demo confirmation and WhatsApp draft.

The customer UI uses a consistent red-and-white theme with clear contrast and compact quotation actions.

Choosing any of the four dummy methods saves the quotation request to Supabase and marks it `demo_only`. This deliberately does **not** represent genuine payment, a receipt, or a confirmed studio booking. For actual payments, integrate a verified gateway with server-side reconciliation and separate real payment statuses.

## Customer WhatsApp delivery

Two different flows are provided:

1. **Manual share:** Opens WhatsApp with the registered phone number and a prefilled quote. The user must tap Send; this is not an automatic message.
2. **Business notifications:** `/api/notify` authenticates the user, checks ownership, opt-in, phone verification and request ID, then uses the official Meta WhatsApp Business API to request a template message. This endpoint does **not** send anything until the studio sets `META_WHATSAPP_TOKEN`, `META_PHONE_NUMBER_ID`, `GCS_QUOTATION_TEMPLATE`, and `GCS_PAYMENT_TEMPLATE` in **Vercel server-side environment variables**, and Meta approves the templates. The phone number also requires SMS verification; the studio must configure its SMS provider.

Do not put Meta tokens in GitHub, React code, or `VITE_` variables. Meta only accepts approved templates for business-initiated chats. WhatsApp API acceptance does not guarantee delivery. Before enabling a production sender, add provider rate limits, monitoring, retries, and message logs.

## Pricing, media and references

Package prices and inclusions are **sample values** until approved by the studio. New thumbnails use independent photographs from Unsplash; existing local reference crops remain as fallbacks.

- Original design manual: `docs/GCS_iOS_User_Manual_Book.pdf`
- Original page renders: `reference/screen-01.png` to `reference/screen-12.png`

## Deployment

Push to `main`; the connected Vercel Git integration deploys automatically. The app uses a root Vite base URL on Vercel, and preserves `/gokul_studio/` for GitHub Pages.

For iPhone access, open the Vercel URL in Safari → Share → **Add to Home Screen**.

This is a quotation enquiry frontend with real account security; it is **not** a live payment checkout or a booking confirmation system.
