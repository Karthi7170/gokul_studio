# Gokul Creative Studio — iPhone Booking Demo

An 11-screen mobile-first photography and videography booking frontend, based on the supplied GCS iOS User Manual Book.

## Pages

1. Welcome / Sign In
2. Create Account
3. Forgot Password
4. Home Dashboard
5. Book a Service
6. Booking Details
7. Schedule & Calendar
8. Quotation Details
9. Payment Details
10. Booking Confirmed
11. WhatsApp Confirmation

## Run locally

Requires **Node.js 20.19+ or 22+**.

```sh
npm install
npm run dev
```

Open the shown Vite URL in a browser. To test the app, log in with any email and non-empty password, or use the social sign-in demo buttons. A sample customer and event are pre-populated. This frontend **does not communicate with authentication, payment, SMS, or booking servers**.

## Build

```sh
npm run build
npm run preview
```

Vite is configured with `base: '/gokul_studio/'`. `HashRouter` is used because GitHub Pages has no SPA rewrite routing.

## GitHub Pages deploy

1. Commit the project to the `main` branch of `Karthi7170/gokul_studio`.
2. Go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Open **Actions → Deploy GitHub Pages** to monitor the workflow or start it manually.
4. When deployed, the expected address is **https://karthi7170.github.io/gokul_studio/** (check Actions/Pages before sharing it as live).

The workflow runs `npm install --no-audit --no-fund` and builds the `dist` Pages artifact. When installing locally, commit the generated `package-lock.json` to adopt reproducible installs later.

## Reference design

- Full supplied reference: `docs/GCS_iOS_User_Manual_Book.pdf`
- Rendered images of **all 12 pages**, including cover: `reference/screen-01.png` through `reference/screen-12.png`
- Source PDF render: `pdftoppm -png -r 120 docs/GCS_iOS_User_Manual_Book.pdf reference/screen`
- Photos in `public/images` are crops from the user-supplied reference for closer visual parity.

## Data model and mock behavior

`BookingContext` holds the customer, service, event type, date, time, venue, notes, payment choice, booking ID and status, and persists to `localStorage` (key `gcs-demo-booking-v1`). No remote database is used.

The PDF mock shows a ₹10,000 amount on its confirmation page. This demo intentionally fixes the **illustrative package quotation** to ₹28,000 minus ₹2,000 discount = **₹26,000** on quotation, payment, confirmation, and WhatsApp. The selected service remains visible as a separate field even when the sample quote includes the same three fixed bundle line items.

The quote PDF is created **locally** with jsPDF. WhatsApp links use `https://wa.me/?text=...` with prefilled details; no studio phone number is hardcoded. Payment is simulated with a 900ms UI delay and no real transaction. Social sign-in and password recovery are demonstration-only.

### Project structure

```
src/
  components/UI.tsx
  context/BookingContext.tsx
  data/services.ts
  screens/AuthScreens.tsx
  screens/HomeScreens.tsx
  screens/BookingScreens.tsx
  screens/CheckoutScreens.tsx
  utils/quotationPdf.ts
  utils/sharing.ts
  App.tsx
  main.tsx
  style.css
```

## Home Screen on iPhone

After publishing, open the GitHub Pages URL in Safari → Share → **Add to Home Screen**. iOS metadata, safe-area padding, manifest and icons are configured. Native push notifications, background sync, and payment processing are not part of this demo.