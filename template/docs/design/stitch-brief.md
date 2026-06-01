# CINE Google Stitch Design Brief

This document serves as the master prompt and architectural template for Google Stitch or other AI Design tools to generate, modify, or extend CINE / CINEDOT pages, modules, and visual patterns.

---

## 1. Project Context
*   **Brand Name:** CINE
*   **Project Name:** CINEDOT
*   **Product Type:** Premium Online Movie Ticket Booking Platform.
*   **Language:** Vietnamese (Tiếng Việt) with pristine typography.

---

## 2. Visual Direction & Style
Design a premium light-mode cinematic web experience. The styling is heavily inspired by the slick elegance of **Apple TV+ layouts**, the visual depth of **Netflix browsing interfaces**, and the high-conversion booking workflows of modern theaters like **Galaxy Cinema**.

### Core Style Attributes:
*   **Minimalist & Airy:** Abundant clean whitespace, razor-sharp visual hierarchy, and an absolute focus on vibrant movie posters.
*   **Soft Glassmorphism:** Elegant frosted glass headers and overlay panels with subtle blurs (`backdrop-filter: blur(20px)`) to establish modern depth.
*   **Curated Border Radius:** Smooth, modern rounded corners (`border-radius: 8px` to `12px` for cards/buttons, `9999px` for capsule layouts).
*   **Sophisticated Shadows:** Multi-layered, soft ambient shadows to separate interface layers naturally without introducing visual noise.

---

## 3. Brand Theme & Design Tokens

Use these strict HSL and Hex colors to maintain brand consistency:

```css
:root {
  /* Surface & Backgrounds */
  --color-background: #FEFEFE;
  --color-background-soft: #F6F6F6;
  --color-surface: #FFFFFF;
  --color-surface-glass: rgba(255, 255, 255, 0.80);
  --color-border: rgba(19, 20, 19, 0.08);

  /* Primary Typography */
  --color-text-primary: #131413;
  --color-text-secondary: #4B4B50;
  --color-text-muted: #7A7A80;

  /* Royal Purple Brand Accents */
  --color-accent: #CFC9EB;         /* Pastel Purple for hover states */
  --color-accent-strong: #B8AFFF;  /* Medium Purple for focus frames */
  --color-accent-deep: #7C6FE8;    /* Core Brand Indigo/Purple */

  /* High-Conversion CTAs */
  --color-cta: #FF7A1A;            /* Vivid Orange for core action trigger */
  --color-cta-hover: #F06400;      /* Darker Orange for hover response */

  /* Status Colors */
  --color-success: #22C55E;        /* Showtime has plenty of seats */
  --color-warning: #F59E0B;        /* Showtime is almost full */
  --color-error: #EF4444;          /* Showtime is sold out */
}
```

---

## 4. Typography Rules
*   **Core Font Family:** `Inter`, Sans-Serif. Excellent kerning and robust support for Vietnamese diacritics.
*   **Title/Heading Stylings:** Bold, uppercase, heavy weight (`font-weight: 700` or `800`).
*   **Visual Accent:** Use a small vertical brand-colored stripe (width `3px`, height `13px` of `var(--color-accent-deep)`) to anchor section titles, replicating a premium editorial look.

---

## 5. Main Components to Generate
1.  **Capsule Floating Navbar:** Floating capsule wrapper with frosted glass backing, featuring logo, main categories, theme selector button group, and a high-accent Booking CTA.
2.  **Compact Mega Dropdown:** Drops down under "Phim", displays "PHIM ĐANG CHIẾU" and "PHIM SẮP CHIẾU" vertically, featuring 4 ultra-compact movie cards (width `135px`, aspect-ratio `2:3`, height `195px`). The desktop dropdown panel **must not have internal scrollbars**.
3.  **Cascading Booking Panel:** A horizontal panel consisting of 4 distinct steps: Movie -> Theater -> Date -> Showtime. Unselected steps must show in an elegant disabled state (`opacity: 0.45` with cursor `not-allowed`). The final CTA button turns bright orange only when all selections are active.
4.  **CineDropdown (Smart Select):** An opaque white adaptive select menu that automatically calculates viewport spacing on toggle, opening upward or downward to prevent screen clipping.
5.  **Premium Movie Card:** A card with a `2:3` poster image. Features overlay badges for rating and age classification in the bottom-right corner. On hover, it displays a dark layer with two primary actions: "Mua vé" (Orange) and "Trailer" (White border outline).

---

## 6. Crucial UX Constraints (Stitch Directives)
*   **Movie Posters Priority:** Posters are the lifeblood of movie browsing. Never stretch or distort poster images. Always use `object-fit: cover` and maintain `aspect-ratio: 2/3`.
*   **No Redirection for Trailers:** Selecting a trailer must open a dedicated modal player on the same page. The video **must immediately stop playing and cut audio** when the modal is closed.
*   **Perfect Viewport Adaptability:** Dropdowns must automatically align to the viewport. Under no circumstances should desktop dropdowns expand offscreen or force horizontal scrollbars.

---

## 7. Do / Don't Guide for AI Layout Tools

### **DO:**
*   Strictly adhere to the CSS Color Variables outlined above.
*   Ensure high contrast for Vietnamese text.
*   Hide genres and technical subtitles inside the navigation dropdown to maximize vertical compactness.
*   Keep the capsule navbar horizontally centered inside `.nav-inner`.

### **DON'T:**
*   **Never** use native HTML `<select>` browser dropdowns for the ticket booking journey.
*   **Never** add unrelated actions (such as a separate "Chi tiết" details button) to the movie card hover overlay.
*   **Never** make booking options overlap or cover their trigger buttons entirely.
*   **Never** allow a vertical scrollbar to render inside the main mega dropdown menu on common desktop sizes.
