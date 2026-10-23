# Gokul Creative Studio — Real Social Sign-In Setup

**Frontend:** `https://gokul-studio-five.vercel.app/`  
**Supabase project:** `excgcantdobbdwxrdhkp`  
**Supabase OAuth callback URI (for all three providers):**
`https://excgcantdobbdwxrdhkp.supabase.co/auth/v1/callback`

The React app uses `supabase.auth.signInWithOAuth()`, PKCE, and the real Google, Apple, and Facebook provider buttons. **The provider credentials must also be configured in Supabase**, or these buttons will show a configuration error. Do not put client secrets in Vite variables, GitHub or frontend code.

## First: Supabase URL settings

Open the Supabase project dashboard → **Authentication → URL Configuration**:

- Site URL: `https://gokul-studio-five.vercel.app/`
- Redirect URLs: add `https://gokul-studio-five.vercel.app/` exactly.
- For other approved deployment domains, add only the exact domain(s) actually used.

The app sends users back to the site root after the provider signs them in. Supabase's JavaScript client automatically exchanges the one-time PKCE code for a session and the app navigates to Home. No `#/...` redirect is registered with the identity providers.

## 1. Google

1. Open [Google Cloud Console](https://console.cloud.google.com/) → Google Auth Platform → Clients. Create an **OAuth client ID** for a **Web application**.
2. Set the authorized redirect URI to `https://excgcantdobbdwxrdhkp.supabase.co/auth/v1/callback`.
3. Configure the consent screen, app branding and appropriate audience. For all customers, publish the app as appropriate instead of restricting it to test users.
4. Copy the Google client ID and client secret to Supabase → **Authentication → Sign In / Providers → Google**. Enable Google there.
5. Ensure `openid`, email and profile scopes are permitted; test with a new Google account.

## 2. Sign in with Apple (web)

1. A qualifying **Apple Developer Program** account is required for configuring web Sign in with Apple.
2. Register a **Services ID** and enable **Sign in with Apple**; configure its domain and the callback URI above.
3. Create the Sign in with Apple private signing key and obtain the Team ID and Key ID. Configure Apple in Supabase → **Authentication → Sign In / Providers → Apple**.
4. Store the signing key and client secret only in Apple/Supabase secure configuration. Never commit them.
5. Rotate the required Apple OAuth client secret at least every six months so logins do not stop.
6. Apple web OAuth does not reliably provide a full name; a new customer can complete it later in **My Account**.

## 3. Facebook

1. Open [Meta for Developers](https://developers.facebook.com/apps/) and create a Facebook Login app.
2. Under **Facebook Login → Settings**, set the valid OAuth redirect URI to `https://excgcantdobbdwxrdhkp.supabase.co/auth/v1/callback`.
3. Request and configure **email** permission and verify it returns an actual confirmed email address.
4. Copy App ID and App Secret to Supabase → **Authentication → Sign In / Providers → Facebook**. Enable it there.
5. To permit customers outside your developer/tester accounts, put your Facebook app into **Live** mode after meeting Meta's applicable review requirements.

## Test checklist

- From an incognito/private browser, open `https://gokul-studio-five.vercel.app/#/sign-in`.
- Try each provider. The browser must open **that provider's real consent page**.
- Accept the login, return to the site, and verify an authenticated session opens **Home**.
- Check **Account** for the new user's verified email. Collect missing phone/name there before a booking.
- Verify sign out and sign in again. Repeat on iPhone Safari and your intended in-app browser.
- Confirm existing email/password sign-ins and new-user registration still work.
- If a provider returns **not enabled**, check credentials and toggle under Supabase Providers; a rendered button is not evidence a provider is live.
- For error `redirect_uri_mismatch`, double-check the exact Supabase callback URI in the provider console.

## Security

All three buttons initiate Supabase-hosted OAuth. The React app never handles provider passwords or secrets. The frontend only uses the Supabase publishable key. Supabase sessions continue to enforce the existing per-user database/storage policies.

Docs: [Google](https://supabase.com/docs/guides/auth/social-login/auth-google), [Apple](https://supabase.com/docs/guides/auth/social-login/auth-apple), [Facebook](https://supabase.com/docs/guides/auth/social-login/auth-facebook), [Supabase redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).
