# Gokul Creative Studio — Polished Native iPhone Home

Complete implementation source for the SF Pro / iOS design-token refinement. The deployed project is React + TypeScript + Vite. Source of truth remains in the real paths shown below; these are full copies to make review and copying easy.

## Before → After

- Serif / Google-font mix → native Apple system SF Pro stack; large headings use display type.
- Heavy weights and wide tracking → normal letter-spacing; regular, semibold, and bold presentation.
- Compressed greeting and shortcut → 8pt-based spacing and an automatic small-screen stacked booking pill.
- Tiny categories → 64pt icons and snap/swipe category row (six cannot all fit at 64pt on narrow phones).
- Tight banner and cards → 24pt hero padding, 28pt radius, 44pt-plus controls, accessible hero text contrast.
- Clipped tab content → fixed floating iPhone tabs with safe-area inset and 120pt of bottom scroll padding.
- Existing catalog, quotation, booking demo, authentication, payment, and bookings flow are unchanged.

## Code

### `src/styles/ios-home.css`

```css
/**
 * GOKUL iPhone UI tokens — reusable throughout the React app.
 * Apple's system fonts are used locally by iOS; no font files are bundled.
 */
:root {
  --ios-font-text: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif;
  --ios-font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif;
  --ios-accent: #E8431F;
  --ios-accent-ink: #C93616; /* 5.2:1 contrast on white */
  --ios-cta: #C93616; /* readable white CTA labels */
  --ios-peach: #FFC49B;
  --ios-background: #FFFCF9;
  --ios-surface: #FFFFFF;
  --ios-ink: #1C1B1F;
  --ios-secondary: #59575B;
  --ios-hero-dark: #1B1412;
  --ios-border: #F1E7E2;
  --ios-soft: #FFF3EC;
  --ios-type-large-title: 34px;
  --ios-leading-large-title: 41px;
  --ios-type-title1: 28px;
  --ios-leading-title1: 34px;
  --ios-type-title2: 22px;
  --ios-leading-title2: 28px;
  --ios-type-headline: 17px;
  --ios-leading-headline: 22px;
  --ios-type-body: 17px;
  --ios-leading-body: 22px;
  --ios-type-subhead: 15px;
  --ios-leading-subhead: 20px;
  --ios-type-footnote: 13px;
  --ios-leading-footnote: 18px;
  --ios-type-caption: 12px;
  --ios-leading-caption: 16px;
  --ios-font-regular: 400;
  --ios-font-semibold: 600;
  --ios-font-bold: 700;
  --ios-space-1: 4px;
  --ios-space-2: 8px;
  --ios-space-3: 12px;
  --ios-space-4: 16px;
  --ios-space-6: 24px;
  --ios-space-8: 32px;
  --ios-screen-gutter: 20px;
  --ios-radius-sm: 12px;
  --ios-radius-card: 20px;
  --ios-radius-hero: 28px;
  --ios-shadow: 0 4px 16px rgba(0,0,0,.06);
  --ios-motion: 250ms ease-out;
  --ios-safe-bottom: env(safe-area-inset-bottom, 0px);
}

/* Ensure every screen inherits the iPhone's native SF Pro without external assets. */
html, body, #root, .phone-shell,
button, input, textarea, select, .phone-content {
  font-family: var(--ios-font-text) !important;
  font-synthesis: none;
}
h1,h2,h3,h4,h5,h6 {
  font-family: var(--ios-font-display) !important;
  letter-spacing: normal !important;
}
button, input, textarea, select { -webkit-tap-highlight-color: transparent; }
button { touch-action: manipulation; }
button:focus-visible, a:focus-visible { outline: 3px solid var(--ios-accent-ink); outline-offset: 2px; }

/* Navigation is an overlay, not a hard stop in the document scroll area. */
.phone-content.with-studio-tabs {
  bottom: 0 !important;
  padding-bottom: calc(120px + var(--ios-safe-bottom)) !important;
  scroll-padding-bottom: calc(120px + var(--ios-safe-bottom));
  -webkit-overflow-scrolling: touch;
}
.studio-ios-tabs {
  left: var(--ios-space-4) !important;
  right: var(--ios-space-4) !important;
  bottom: calc(var(--ios-space-4) + var(--ios-safe-bottom)) !important;
  height: auto !important;
  min-height: 88px !important;
  border-radius: 999px !important;
  background: rgba(255,255,255,.97) !important;
  box-shadow: var(--ios-shadow) !important;
  border: 1px solid var(--ios-border) !important;
  padding: var(--ios-space-3) !important;
  -webkit-backdrop-filter: blur(18px);
  backdrop-filter: blur(18px);
}
.studio-ios-tabs > button {
  min-width: 44px !important;
  min-height: 56px !important;
  height: auto !important;
  gap: var(--ios-space-2) !important;
  font-family: var(--ios-font-text) !important;
  font-size: var(--ios-type-caption) !important;
  line-height: var(--ios-leading-caption) !important;
  font-weight: var(--ios-font-regular) !important;
  transition: transform var(--ios-motion), color var(--ios-motion);
}
.studio-ios-tabs > button.active { font-weight: var(--ios-font-semibold) !important; color: var(--ios-accent-ink) !important; }
.studio-ios-tabs > button > svg { width: 24px; height: 24px; stroke-width: 1.75px; }
.studio-ios-tabs > button.active > svg { stroke-width: 2px; }
.studio-ios-tabs > button i { bottom: -7px !important; background: var(--ios-accent-ink) !important; }
.studio-ios-tabs > button:not(:disabled):active { transform: scale(.97); }

/* Home: same content hierarchy, iOS-readable type and generous whitespace. */
.gcs-home-2026 {
  background: var(--ios-background) !important;
  color: var(--ios-ink) !important;
  padding-bottom: var(--ios-space-6) !important;
  font-family: var(--ios-font-text) !important;
}
.gcs-home-2026 *, .gcs-home-2026 *::before, .gcs-home-2026 *::after { box-sizing: border-box; }
.gcs-home-2026 button:not(:disabled) {
  transition: transform var(--ios-motion), background-color var(--ios-motion), color var(--ios-motion), box-shadow var(--ios-motion);
}
.gcs-home-2026 button:not(:disabled):active { transform: scale(.97); }
.gcs-home-2026 .gcs-2026-top {
  margin: 0 !important;
  padding: var(--ios-space-4) var(--ios-screen-gutter) 0 !important;
  min-height: 64px !important;
  background: var(--ios-background) !important;
  gap: var(--ios-space-3) !important;
}
.gcs-home-2026 .gcs-header-brand { gap: var(--ios-space-2) !important; }
.gcs-home-2026 .gcs-header-camera {
  width: 44px !important; height: 44px !important; border-radius: var(--ios-radius-sm) !important;
  background: var(--ios-accent) !important;
  box-shadow: var(--ios-shadow) !important;
}
.gcs-home-2026 .gcs-header-camera svg { width: 24px; height: 24px; stroke-width: 1.75px !important; }
.gcs-home-2026 .gcs-header-brand strong {
  font-family: var(--ios-font-text) !important;
  font-weight: var(--ios-font-bold) !important;
  font-size: var(--ios-type-headline) !important;
  line-height: var(--ios-leading-headline) !important;
  letter-spacing: normal !important;
  color: var(--ios-ink) !important;
}
.gcs-home-2026 .gcs-header-brand small {
  font-size: 10px !important;
  line-height: 14px !important;
  font-weight: var(--ios-font-semibold) !important;
  letter-spacing: .5px !important;
  color: var(--ios-ink) !important;
  margin-top: 0 !important;
}
.gcs-2026-actions { gap: var(--ios-space-2) !important; }
.gcs-home-2026 .gcs-round-action, .gcs-home-2026 .gcs-user-avatar {
  flex: 0 0 44px !important;
  height: 44px !important;
  width: 44px !important;
  box-shadow: none !important;
  border-radius: 999px !important;
}
.gcs-home-2026 .gcs-round-action { background: #F5F3F2 !important; color: var(--ios-ink) !important; }
.gcs-home-2026 .gcs-round-action.active { background: var(--ios-soft) !important; color: var(--ios-accent-ink) !important; }
.gcs-home-2026 .gcs-round-action svg { width: 24px; height: 24px; stroke-width: 1.75px; }
.gcs-home-2026 .gcs-user-avatar {
  background: #F7E0D4 !important; border: 1px solid #F0C5AE !important; color: #70341F !important;
}
.gcs-home-2026 .gcs-user-avatar > span { font-family: var(--ios-font-display) !important; font-size: 17px !important; font-weight: var(--ios-font-semibold) !important; }
.gcs-home-2026 .gcs-home-search-panel, .gcs-home-2026 .gcs-activity-panel {
  margin: var(--ios-space-3) var(--ios-screen-gutter) 0 !important;
  padding: var(--ios-space-3) !important;
  border-radius: var(--ios-radius-sm) !important;
  box-shadow: var(--ios-shadow) !important;
  gap: var(--ios-space-2) !important;
}
.gcs-home-2026 .gcs-home-search-panel input { min-height: 44px; font-size: var(--ios-type-subhead) !important; line-height: var(--ios-leading-subhead) !important; }
.gcs-home-2026 .gcs-home-search-panel button,
.gcs-home-2026 .gcs-activity-panel button { min-height: 44px; font-size: var(--ios-type-footnote) !important; font-weight: var(--ios-font-semibold) !important; }
.gcs-home-2026 .gcs-activity-panel strong { font-size: var(--ios-type-headline) !important; font-weight: var(--ios-font-semibold) !important; }
.gcs-home-2026 .gcs-activity-panel p { color: var(--ios-secondary) !important; font-size: var(--ios-type-footnote) !important; line-height: var(--ios-leading-footnote) !important; }
.gcs-home-2026 .gcs-2026-welcome {
  display: flex !important; justify-content: space-between !important; align-items: center !important;
  margin: var(--ios-space-6) 0 0 !important;
  padding: 0 var(--ios-screen-gutter) !important;
  gap: var(--ios-space-4) !important;
  min-height: 0 !important;
}
.gcs-home-2026 .gcs-2026-greeting { min-width: 0; flex: 1 1 auto; }
.gcs-home-2026 .gcs-2026-salutation {
  font-family: var(--ios-font-text) !important;
  display: block; font-size: var(--ios-type-caption) !important; line-height: var(--ios-leading-caption) !important;
  font-weight: var(--ios-font-semibold) !important; letter-spacing: .5px !important;
  color: var(--ios-secondary) !important;
}
.gcs-home-2026 .gcs-2026-greeting h1 {
  margin: var(--ios-space-2) 0 !important;
  font-family: var(--ios-font-display) !important;
  font-size: var(--ios-type-large-title) !important; line-height: var(--ios-leading-large-title) !important;
  font-weight: var(--ios-font-bold) !important; letter-spacing: normal !important;
  color: var(--ios-ink) !important; overflow-wrap: anywhere;
}
.gcs-home-2026 .gcs-2026-greeting h1 svg { width: 24px; height: 24px; color: var(--ios-accent); stroke-width: 1.75px; }
.gcs-home-2026 .gcs-2026-greeting p {
  font-size: var(--ios-type-subhead) !important; line-height: var(--ios-leading-subhead) !important;
  font-weight: var(--ios-font-regular) !important; color: var(--ios-secondary) !important;
}
.gcs-home-2026 .gcs-2026-book-shortcut {
  min-height: 72px !important; min-width: 156px !important;
  padding: var(--ios-space-3) !important; gap: var(--ios-space-2) !important;
  background: var(--ios-surface) !important; color: var(--ios-accent-ink) !important;
  border: 1px solid var(--ios-border) !important; border-radius: 999px !important;
  box-shadow: var(--ios-shadow) !important; flex: none;
}
.gcs-home-2026 .gcs-2026-book-shortcut > span:first-child {
  min-width: 44px; min-height: 44px; background: var(--ios-soft) !important; color: var(--ios-accent-ink) !important;
}
.gcs-home-2026 .gcs-2026-book-shortcut > span:first-child svg { width: 24px; height: 24px; stroke-width: 1.75px; }
.gcs-home-2026 .gcs-2026-book-shortcut small {
  font-size: var(--ios-type-caption) !important; line-height: var(--ios-leading-caption) !important;
  font-weight: var(--ios-font-regular) !important; color: var(--ios-secondary) !important;
}
.gcs-home-2026 .gcs-2026-book-shortcut strong {
  font-size: var(--ios-type-footnote) !important; line-height: var(--ios-leading-footnote) !important;
  font-weight: var(--ios-font-semibold) !important; color: var(--ios-accent-ink) !important;
}
.gcs-home-2026 .gcs-2026-book-shortcut > svg { width: 20px !important; height: 20px !important; stroke-width: 1.75px; }
.gcs-home-2026 .gcs-2026-hero {
  height: 356px !important;
  margin: var(--ios-space-6) var(--ios-screen-gutter) !important;
  border-radius: var(--ios-radius-hero) !important;
  box-shadow: var(--ios-shadow) !important;
  background: var(--ios-hero-dark) !important;
}
.gcs-home-2026 .gcs-2026-hero-image {
  width: 100%; height: 100%; object-fit: cover; object-position: center center;
  animation: ios-hero-settle 250ms cubic-bezier(.22,1.25,.36,1) both;
}
@keyframes ios-hero-settle { from { opacity: .78; transform: scale(1.018); } to { opacity: 1; transform: scale(1); } }
.gcs-home-2026 .gcs-2026-hero-vignette {
  background: linear-gradient(90deg,rgba(12,9,8,.91) 0%,rgba(12,9,8,.74) 55%,rgba(12,9,8,.25) 100%),
              linear-gradient(0deg,rgba(12,9,8,.64),transparent 56%) !important;
}
.gcs-home-2026 .gcs-2026-hero-copy {
  left: var(--ios-space-6) !important; top: var(--ios-space-6) !important; bottom: auto !important;
  right: var(--ios-space-6) !important; color: white;
}
.gcs-home-2026 .gcs-2026-hero-eyebrow {
  font-size: var(--ios-type-caption) !important; line-height: var(--ios-leading-caption) !important;
  font-weight: var(--ios-font-semibold) !important; letter-spacing: .5px !important; color: #FFFFFF !important;
}
.gcs-home-2026 .gcs-2026-hero-copy h2 {
  margin: var(--ios-space-3) 0 !important;
  font-family: var(--ios-font-display) !important;
  font-size: var(--ios-type-large-title) !important; line-height: var(--ios-leading-large-title) !important;
  letter-spacing: normal !important; font-weight: var(--ios-font-bold) !important; color: #FFFFFF !important;
  text-shadow: none !important;
}
.gcs-home-2026 .gcs-2026-hero-copy h2 em {
  font-family: var(--ios-font-display) !important; font-style: italic !important;
  font-weight: var(--ios-font-semibold) !important; color: var(--ios-peach) !important;
}
.gcs-home-2026 .gcs-2026-hero-copy p {
  font-size: var(--ios-type-subhead) !important; line-height: var(--ios-leading-subhead) !important;
  color: #FFFFFF !important; font-weight: var(--ios-font-regular) !important; margin: 0 !important;
}
.gcs-home-2026 .gcs-2026-hero-copy > button {
  margin-top: 20px !important; min-height: 48px !important;
  padding: var(--ios-space-2) var(--ios-space-2) var(--ios-space-2) var(--ios-space-4) !important;
  gap: var(--ios-space-3) !important; border-radius: 999px !important;
  background: var(--ios-cta) !important; color: #FFF !important;
  font-size: var(--ios-type-subhead) !important; line-height: var(--ios-leading-subhead) !important;
  font-weight: var(--ios-font-semibold) !important; box-shadow: none !important;
}
.gcs-home-2026 .gcs-2026-hero-copy > button > span {
  display: grid; place-items: center; width: 36px; height: 36px;
  background: rgba(0,0,0,.12) !important; border-radius: 50%;
}
.gcs-home-2026 .gcs-2026-hero-copy > button svg { width: 24px; height: 24px; stroke-width: 1.75px; }
.gcs-home-2026 .gcs-2026-hero-pagination {
  right: 76px !important; bottom: var(--ios-space-2) !important;
  display: flex; gap: 0 !important; z-index: 4;
}
.gcs-home-2026 .gcs-2026-hero-pagination > button {
  height: 44px !important; width: 44px !important;
  display: grid; place-items: center; background: transparent !important;
  box-shadow: none !important; border-radius: 50%;
}
.gcs-home-2026 .gcs-2026-hero-pagination > button::after {
  content: ''; display: block; width: 8px; height: 8px; background: #FFFFFFA8;
  border-radius: 50%; transition: transform var(--ios-motion), background-color var(--ios-motion);
}
.gcs-home-2026 .gcs-2026-hero-pagination > button.active::after {
  background: var(--ios-accent) !important; transform: scale(1.25);
}
.gcs-home-2026 .gcs-2026-hero-count {
  right: var(--ios-space-6) !important; bottom: var(--ios-space-6) !important;
  font-size: var(--ios-type-caption) !important; line-height: var(--ios-leading-caption) !important;
  font-weight: var(--ios-font-semibold) !important; letter-spacing: normal !important; color: #FFFFFF !important;
}
.gcs-home-2026 .gcs-2026-categories {
  display: flex !important; flex-wrap: nowrap !important; justify-content: flex-start;
  overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch;
  scroll-snap-type: x proximity; scrollbar-width: none;
  gap: var(--ios-space-4) !important;
  margin: 0 !important;
  padding: 0 var(--ios-screen-gutter) var(--ios-space-2) !important;
  overscroll-behavior-inline: contain;
}
.gcs-home-2026 .gcs-2026-categories::-webkit-scrollbar { display: none; }
.gcs-home-2026 .gcs-2026-categories > button {
  flex: 0 0 78px; width: 78px !important; min-width: 78px !important;
  display: flex; flex-direction: column; align-items: center;
  min-height: 120px; gap: var(--ios-space-2) !important;
  scroll-snap-align: start; color: var(--ios-ink) !important;
  font-weight: var(--ios-font-regular) !important;
}
.gcs-home-2026 .gcs-2026-category-icon {
  width: 64px !important; height: 64px !important; min-width: 64px !important;
  border-radius: 50% !important; background: #F7F3F1 !important;
  border: 1px solid var(--ios-border) !important; color: var(--ios-ink) !important;
}
.gcs-home-2026 .gcs-2026-category-icon svg { width: 24px; height: 24px; stroke-width: 1.75px; }
.gcs-home-2026 .gcs-2026-categories > button.active .gcs-2026-category-icon { background: var(--ios-soft) !important; color: var(--ios-accent-ink) !important; }
.gcs-home-2026 .gcs-2026-category-label {
  max-width: 78px !important; min-height: 36px !important; max-height: 36px;
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
  overflow: hidden; text-overflow: ellipsis; text-align: center;
  font-size: var(--ios-type-caption) !important; line-height: var(--ios-leading-caption) !important;
  font-weight: var(--ios-font-regular) !important; color: var(--ios-ink) !important;
}
.gcs-home-2026 .gcs-2026-categories > button.active .gcs-2026-category-label { color: var(--ios-accent-ink) !important; font-weight: var(--ios-font-semibold) !important; }
.gcs-home-2026 .gcs-2026-category-indicator { bottom: -1px !important; background: transparent !important; }
.gcs-home-2026 .gcs-2026-categories > button.active .gcs-2026-category-indicator { background: var(--ios-accent-ink) !important; }
.gcs-home-2026 .gcs-2026-popular { padding: 0 var(--ios-screen-gutter) !important; margin-top: var(--ios-space-8) !important; }
.gcs-home-2026 .gcs-2026-section-head {
  padding: 0 !important; margin-bottom: var(--ios-space-4) !important;
  align-items: flex-end !important; gap: var(--ios-space-3) !important;
}
.gcs-home-2026 .gcs-2026-section-head > div > span {
  font-size: var(--ios-type-caption) !important; line-height: var(--ios-leading-caption) !important;
  letter-spacing: .5px !important; font-weight: var(--ios-font-semibold) !important;
  color: var(--ios-accent-ink) !important;
}
.gcs-home-2026 .gcs-2026-section-head h2 {
  font-family: var(--ios-font-display) !important;
  font-size: var(--ios-type-title1) !important; line-height: var(--ios-leading-title1) !important;
  font-weight: var(--ios-font-bold) !important; letter-spacing: normal !important;
  color: var(--ios-ink) !important; margin-top: var(--ios-space-2) !important;
}
.gcs-home-2026 .gcs-2026-section-head > button {
  min-height: 44px; display: flex; align-items: center;
  font-size: var(--ios-type-footnote) !important; line-height: var(--ios-leading-footnote) !important;
  font-weight: var(--ios-font-semibold) !important; color: var(--ios-accent-ink) !important;
  gap: var(--ios-space-2) !important;
}
.gcs-home-2026 .gcs-2026-section-head > button svg { width: 24px; height: 24px; stroke-width: 1.75px; }
.gcs-home-2026 .gcs-2026-popular-track { grid-template-columns: repeat(3,minmax(0,1fr)); gap: var(--ios-space-3) !important; }
.gcs-home-2026 .gcs-2026-package {
  border-radius: var(--ios-radius-card) !important; border: 1px solid var(--ios-border) !important;
  box-shadow: var(--ios-shadow) !important; background: var(--ios-surface) !important;
  overflow: hidden;
}
.gcs-home-2026 .gcs-2026-package > img { height: 108px !important; width: 100%; object-fit: cover; }
.gcs-home-2026 .gcs-2026-package-info {
  min-height: 190px !important; gap: var(--ios-space-2) !important;
  padding: var(--ios-space-3) !important;
}
.gcs-home-2026 .gcs-2026-package-info > strong {
  font-family: var(--ios-font-text) !important; font-size: var(--ios-type-subhead) !important;
  line-height: var(--ios-leading-subhead) !important; font-weight: var(--ios-font-semibold) !important;
  letter-spacing: normal !important; min-height: 40px !important;
  color: var(--ios-ink) !important;
}
.gcs-home-2026 .gcs-2026-package-info > small {
  font-size: var(--ios-type-caption) !important; line-height: var(--ios-leading-caption) !important;
  font-weight: var(--ios-font-regular) !important; color: var(--ios-secondary) !important;
}
.gcs-home-2026 .gcs-2026-package-info > b {
  font-size: var(--ios-type-footnote) !important; line-height: var(--ios-leading-footnote) !important;
  font-weight: var(--ios-font-semibold) !important; color: var(--ios-ink) !important; padding-right: 0 !important;
}
.gcs-home-2026 .gcs-2026-package-arrow {
  right: var(--ios-space-2) !important; bottom: var(--ios-space-2) !important;
  height: 32px !important; width: 32px !important; color: var(--ios-accent-ink) !important;
  background: var(--ios-soft) !important; border-radius: 50%;
  pointer-events: none;
}
.gcs-home-2026 .gcs-2026-package-arrow svg { height: 20px; width: 20px; stroke-width: 1.75px; }
.gcs-home-2026 .gcs-2026-story {
  margin: var(--ios-space-6) var(--ios-screen-gutter) 0 !important;
  height: 176px !important; border-radius: var(--ios-radius-card) !important;
  box-shadow: var(--ios-shadow) !important;
}
.gcs-home-2026 .gcs-2026-story-copy { top: var(--ios-space-4) !important; left: var(--ios-space-4) !important; }
.gcs-home-2026 .gcs-2026-story-copy > span { font-size: var(--ios-type-caption) !important; line-height: var(--ios-leading-caption) !important; letter-spacing: .5px !important; font-weight: var(--ios-font-semibold) !important; color: #FFF !important; }
.gcs-home-2026 .gcs-2026-story-copy h2 {
  font-family: var(--ios-font-display) !important; font-size: var(--ios-type-title2) !important;
  line-height: var(--ios-leading-title2) !important; font-weight: var(--ios-font-semibold) !important; letter-spacing: normal !important;
}
.gcs-home-2026 .gcs-2026-story-copy h2 em { font-family: var(--ios-font-display) !important; font-weight: var(--ios-font-semibold) !important; color: var(--ios-peach) !important; }
.gcs-home-2026 .gcs-2026-story-copy p { font-size: var(--ios-type-footnote) !important; line-height: var(--ios-leading-footnote) !important; color: #FFF !important; }
.gcs-home-2026 .gcs-2026-story > button { min-width: 80px; min-height: 44px; border-radius: 999px !important; font-size: var(--ios-type-footnote) !important; font-weight: var(--ios-font-semibold) !important; background: var(--ios-cta) !important; box-shadow: none !important; }
.gcs-home-2026 .gcs-2026-disclaimer { color: var(--ios-secondary) !important; font-size: var(--ios-type-caption) !important; line-height: var(--ios-leading-caption) !important; padding: var(--ios-space-4) var(--ios-screen-gutter) !important; }

/* Respect reduced motion while retaining slider buttons for accessibility. */
@media (prefers-reduced-motion: reduce) {
  .gcs-home-2026 *, .studio-ios-tabs > button {
    animation: none !important; transition: none !important; scroll-behavior: auto !important;
  }
}
@media (max-width: 430px) {
  .gcs-home-2026 .gcs-2026-welcome { flex-direction: column !important; align-items: stretch !important; }
  .gcs-home-2026 .gcs-2026-book-shortcut { align-self: flex-start !important; margin-top: 0 !important; }
}
@media (max-width: 374px) {
  .gcs-home-2026 .gcs-2026-top { padding-left: var(--ios-screen-gutter) !important; padding-right: var(--ios-screen-gutter) !important; }
  .gcs-home-2026 .gcs-2026-actions { gap: var(--ios-space-1) !important; }
  .gcs-home-2026 .gcs-header-brand { gap: var(--ios-space-1) !important; }
  .gcs-home-2026 .gcs-header-brand strong { font-size: 15px !important; }
  .gcs-home-2026 .gcs-header-brand small { font-size: 9px !important; }
  .gcs-home-2026 .gcs-2026-hero { height: 372px !important; }
  .gcs-home-2026 .gcs-2026-hero-copy h2 { font-size: 31px !important; line-height: 38px !important; }
  .gcs-home-2026 .gcs-2026-hero-pagination { right: 69px !important; }
  .gcs-home-2026 .gcs-2026-hero-pagination > button { width: 38px !important; height: 44px !important; }
  .gcs-home-2026 .gcs-2026-package-info { padding: var(--ios-space-2) !important; }
  .gcs-home-2026 .gcs-2026-package-info > strong { font-size: 13px !important; line-height: 18px !important; }
}
```

### `src/screens/HomeScreens.tsx`

```tsx
import {useEffect,useMemo,useRef,useState,type TouchEvent} from 'react';
import {useNavigate,useSearchParams} from 'react-router-dom';
import {ArrowRight,Baby,Bell,Building2,CalendarDays,Camera,CheckCircle2,ChevronRight,Clapperboard,Grid2X2,Heart,HeartHandshake,Images,MessageCircle,Search,ShieldCheck,Sparkles,UserRound,Video} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import {SERVICES,THUMBNAIL_URL,IMAGE_URL,inr,type ServiceId} from '../data/services';
const benefits=[
 {icon:Heart,title:'Moments, beautifully told',desc:'Personalized coverage with attention to the emotions behind the event.'},
 {icon:Images,title:'Every detail, one studio',desc:'Explore photo, cinematic film and celebration packages in one place.'},
 {icon:ShieldCheck,title:'Clear, upfront inclusions',desc:'See what comes with each package before requesting a quote.'}
];
const filters=[{id:'all',label:'All packages'},{id:'wedding',label:'Weddings'},{id:'family',label:'Family'},{id:'creative',label:'Photo & Film'}] as const;
type Filter=typeof filters[number]['id'];
const groups:Record<ServiceId,Filter>={wedding:'wedding',photography:'creative',baby:'family',prewedding:'wedding',videography:'creative',events:'family'};
function StudioImage({src,fallback,alt,className}:{src:string;fallback:string;alt:string;className?:string}){
 return <img src={src} alt={alt} className={className} loading="lazy" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=IMAGE_URL(fallback)}}/>;
}
const categoryItems=[
 {id:'wedding',label:'Wedding',icon:Camera},
 {id:'prewedding',label:'Pre-Wedding',icon:HeartHandshake},
 {id:'videography',label:'Cinematic Videos',icon:Clapperboard},
 {id:'baby',label:'Baby & Family',icon:Baby},
 {id:'events',label:'Events',icon:Building2},
 {id:'all',label:'All Services',icon:Grid2X2}
] as const;
const featured=[
 {id:'wedding',title:'Wedding Collection',description:'Complete photo & film coverage for your day.'},
 {id:'prewedding',title:'Pre-Wedding Stories',description:'Cinematic couple photos, made for you.'},
 {id:'baby',title:'Baby & Family',description:'Beautiful memories for every milestone.'}
] as const;
export function Home(){
 const nav=useNavigate();
 const {profile,user}=useAuth();
 const [searchOpen,setSearchOpen]=useState(false);
 const [activityOpen,setActivityOpen]=useState(false);
 const [query,setQuery]=useState('');
 const [heroIndex,setHeroIndex]=useState(0);
 const touchStartX=useRef<number|null>(null);
 const heroItems=[SERVICES[0],SERVICES[3],SERVICES[2],SERVICES[5]];
 const displayName=(profile?.full_name||String(user?.user_metadata?.full_name||'')).trim().split(/\s+/)[0];
 const hour=new Date().getHours();
 const salutation=hour<12?'GOOD MORNING':hour<17?'GOOD AFTERNOON':'GOOD EVENING';
 useEffect(()=>{
  if(typeof window==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const timer=window.setInterval(()=>setHeroIndex(i=>(i+1)%heroItems.length),6500);
  return ()=>window.clearInterval(timer);
 },[]);
 const openCategory=(id:string)=>nav(id==='all'?'/book':'/book?service='+encodeURIComponent(id));
 const submitSearch=()=>nav(query.trim()?'/book?search='+encodeURIComponent(query.trim()):'/book');
 const onEnd=(e:TouchEvent<HTMLElement>)=>{
  if(touchStartX.current===null)return;
  const dx=e.changedTouches[0]?.clientX-touchStartX.current;
  touchStartX.current=null;
  if(Math.abs(dx)>45)setHeroIndex(i=>(i+(dx<0?1:heroItems.length-1))%heroItems.length);
 };
 return <div className="home-screen page-flow gcs-home gcs-home-2026">
  <header className="gcs-2026-top">
   <div className="gcs-header-brand"><span className="gcs-header-camera"><Camera size={21}/></span><div><strong>GOKUL</strong><small>CREATIVE STUDIO</small></div></div>
   <div className="gcs-2026-actions">
    <button type="button" className={searchOpen?'gcs-round-action active':'gcs-round-action'} aria-label="Search packages" aria-expanded={searchOpen} onClick={()=>{setSearchOpen(v=>!v);setActivityOpen(false);}}><Search size={21}/></button>
    <button type="button" className={activityOpen?'gcs-round-action active':'gcs-round-action'} aria-label="Booking activity" aria-expanded={activityOpen} onClick={()=>{setActivityOpen(v=>!v);setSearchOpen(false);}}><Bell size={21}/></button>
    <button type="button" className="gcs-user-avatar" aria-label="My account" onClick={()=>nav('/profile')}>{displayName?<span>{displayName.charAt(0).toUpperCase()}</span>:<UserRound size={20}/>}</button>
   </div>
  </header>
  {searchOpen&&<form className="gcs-home-search-panel" role="search" onSubmit={e=>{e.preventDefault();submitSearch();}}>
   <Search size={17}/><input autoFocus type="search" aria-label="Search photo and film packages" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search wedding, baby, films..." maxLength={75}/><button type="submit">Search <ArrowRight size={15}/></button>
  </form>}
  {activityOpen&&<div className="gcs-activity-panel" role="status">
   <strong>Booking activity</strong><p>Review your latest saved requests and their current status in My Bookings.</p>
   <button type="button" onClick={()=>nav('/bookings')}>Open My Bookings <ArrowRight size={15}/></button>
  </div>}
  <section className="gcs-2026-welcome">
   <div className="gcs-2026-greeting">
    <span className="gcs-2026-salutation">{salutation},</span>
    <h1>{displayName||'Welcome'} <Sparkles size={20}/></h1>
    <p>Let's capture your next beautiful chapter.</p>
   </div>
   <button type="button" className="gcs-2026-book-shortcut" onClick={()=>nav('/book')}>
    <span><CalendarDays size={19}/></span><span><small>Have an event?</small><strong>Book a shoot</strong></span><ArrowRight size={17}/>
   </button>
  </section>
  <section className="gcs-2026-hero" aria-label="Featured creative packages" onTouchStart={e=>{touchStartX.current=e.touches[0]?.clientX??null;}} onTouchEnd={onEnd} onTouchCancel={()=>{touchStartX.current=null;}}>
   <StudioImage key={heroItems[heroIndex].id} src={THUMBNAIL_URL(heroItems[heroIndex])} fallback={heroItems[heroIndex].image} alt={heroItems[heroIndex].name+' inspiration'} className="gcs-2026-hero-image"/>
   <div className="gcs-2026-hero-vignette"/>
   <div className="gcs-2026-hero-copy">
    <span className="gcs-2026-hero-eyebrow">MORE THAN PHOTOS</span>
    <h2>Stories for<br/>a <em>lifetime</em></h2>
    <p>Candid moments. Timeless films.<br/>For your biggest milestones.</p>
    <button type="button" onClick={()=>nav('/book')}>Explore packages <span><ArrowRight size={19}/></span></button>
   </div>
   <div className="gcs-2026-hero-pagination" aria-label="Choose featured slide">
    {heroItems.map((item,i)=><button key={item.id} aria-label={'Show '+item.name} aria-pressed={heroIndex===i} className={heroIndex===i?'active':''} onClick={()=>setHeroIndex(i)}/>)}
   </div>
   <span className="gcs-2026-hero-count">{String(heroIndex+1).padStart(2,'0')} / 04</span>
  </section>
  <nav className="gcs-2026-categories" aria-label="Browse services">
   {categoryItems.map(({id,label,icon:Icon},i)=><button type="button" className={i===0?'active':''} key={id} onClick={()=>openCategory(id)}>
    <span className="gcs-2026-category-icon"><Icon size={23} strokeWidth={1.8}/></span><span className="gcs-2026-category-label">{label}</span><span className="gcs-2026-category-indicator"/>
   </button>)}
  </nav>
  <section className="gcs-2026-popular">
   <div className="gcs-2026-section-head">
    <div><span>CURATED FOR YOU</span><h2>Popular packages</h2></div>
    <button type="button" onClick={()=>nav('/book')}>View all <ArrowRight size={18}/></button>
   </div>
   <div className="gcs-2026-popular-track">
    {featured.map(({id,title,description})=>{
     const svc=SERVICES.find(s=>s.id===id)!;
     return <button type="button" className="gcs-2026-package" key={id} onClick={()=>nav('/packages/'+id)}>
      <StudioImage src={THUMBNAIL_URL(svc)} fallback={svc.image} alt={title}/>
      <span className="gcs-2026-package-info"><strong>{title}</strong><small>{description}</small><b>From {inr(svc.from)}</b><span className="gcs-2026-package-arrow"><ArrowRight size={18}/></span></span>
     </button>;
    })}
   </div>
  </section>
  <section className="gcs-2026-story" aria-label="About our creative process">
   <StudioImage src={THUMBNAIL_URL(SERVICES[0])} fallback={SERVICES[0].image} alt="Wedding photography inspiration"/>
   <div className="gcs-2026-story-shade"/>
   <div className="gcs-2026-story-copy"><span>MADE FOR REAL MOMENTS</span><h2>Your story,<br/><em>beautifully remembered.</em></h2><p>Plan your special day with a package that fits.</p></div>
   <button type="button" onClick={()=>nav('/book')}>Explore <ArrowRight size={17}/></button>
  </section>
  <div className="gcs-2026-disclaimer"><ShieldCheck size={14}/><span>Package prices are illustrative starting estimates, subject to studio confirmation.</span></div>
 </div>;
}
export function BookService(){
 const nav=useNavigate();const [params,setParams]=useSearchParams();const [filter,setFilter]=useState<Filter>('all'),[search,setSearch]=useState(params.get('search')||'');
 const serviceId=params.get('service');const focusedService=SERVICES.some(s=>s.id===serviceId)?serviceId:null;
 const packages=useMemo(()=>SERVICES.filter(s=>(!focusedService||s.id===focusedService)&&(filter==='all'||groups[s.id]===filter)&&(`${s.name} ${s.detail}`.toLowerCase().includes(search.toLowerCase().trim()))),[filter,search,focusedService]);
 return <div className="inner-screen page-flow gcs-catalog">
 <header className="gcs-catalog-top"><button aria-label="Back to home" onClick={()=>nav('/home')}><ChevronRight size={21} className="gcs-rotated"/></button><div><small>DISCOVER WHAT WE DO</small><strong>Find your perfect package</strong></div><button onClick={()=>nav('/profile')} aria-label="My profile"><UserRound size={19}/></button></header>
 <div className="gcs-catalog-intro"><span className="gcs-eyebrow">CAPTURE • CREATE • CHERISH</span><h1>Moments are<br/><em>worth keeping.</em></h1><p>Explore our curated photo and film packages, designed around your story.</p></div>
 {focusedService&&<div className="gcs-category-selection">Browsing {SERVICES.find(s=>s.id===focusedService)?.name}<button type="button" onClick={()=>setParams({})}>Clear category ×</button></div>}
 <div className="gcs-search"><Search size={18}/><input aria-label="Search packages" type="search" placeholder="Search wedding, baby, video..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
 <div className="gcs-filter-bar" aria-label="Filter packages">{filters.map(x=><button key={x.id} className={filter===x.id?'active':''} onClick={()=>setFilter(x.id)}>{x.label}</button>)}</div>
 <div className="gcs-catalog-result">{packages.length} package{packages.length===1?'':'s'} available <span>Choose to explore <ArrowRight size={12}/></span></div>
 <div className="gcs-catalog-list">{packages.map(s=><button className="gcs-collection-card" onClick={()=>nav('/packages/'+s.id)} key={s.id}><div className="gcs-collection-image"><StudioImage src={THUMBNAIL_URL(s)} fallback={s.image} alt={s.name}/><span className="gcs-collection-tag">{s.tag}</span></div><div className="gcs-collection-info"><div><strong>{s.name}</strong><p>{s.detail}</p></div><span><b>From {inr(s.from)}</b><span>View inclusions <ArrowRight size={15}/></span></span></div></button>)}</div>
 {packages.length===0&&<div className="gcs-empty"><Search size={25}/><h3>No matches</h3><p>Try another search or package category.</p><button onClick={()=>{setSearch('');setFilter('all')}}>Show all packages</button></div>}
 <div className="gcs-bottom-note"><ShieldCheck size={16}/> Quotation amounts and inclusions are examples, confirmed on enquiry.</div>
 
 </div>;
}
```

### `src/components/StudioBottomNav.tsx`

```tsx
import {CalendarDays,Grid2X2,House,UserRound} from 'lucide-react';
import {useLocation,useNavigate} from 'react-router-dom';
const items=[
 {label:'Home',href:'/home',icon:House},
 {label:'Packages',href:'/book',icon:Grid2X2},
 {label:'Bookings',href:'/bookings',icon:CalendarDays},
 {label:'Account',href:'/profile',icon:UserRound},
] as const;
export function StudioBottomNav(){
 const nav=useNavigate();const loc=useLocation();
 return <nav className="studio-ios-tabs" aria-label="Studio main navigation">{items.map(({label,href,icon:Icon})=>{
  const active=loc.pathname===href || (label==='Packages'&&loc.pathname.startsWith('/packages/')) || (label==='Bookings'&&loc.pathname.startsWith('/booking-details'));
  return <button key={href} type="button" className={active?'active':''} aria-label={label} aria-current={active?'page':undefined} onClick={()=>nav(href)}><Icon size={24} strokeWidth={active?2:1.75}/><span>{label}</span>{active&&<i aria-hidden="true"/>}</button>;
 })}</nav>;
}
```

### `src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import App from './App';
import './style.css';
import './styles/ios-home.css';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider><BookingProvider><HashRouter><App /></HashRouter></BookingProvider></AuthProvider>
  </React.StrictMode>
);
```

