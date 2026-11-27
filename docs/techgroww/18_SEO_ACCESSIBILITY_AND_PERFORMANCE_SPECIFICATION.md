# 18 — SEO, ACCESSIBILITY (WCAG 2.2 AA) & PERFORMANCE SPECIFICATION

**Date:** 2026-11-27  
**Note:** All metrics below are **proposed acceptance thresholds**, not measured claims on unbuilt code.

---

## 1. Purpose & Scope

Defines technical & content SEO architecture, WCAG 2.2 AA accessibility engineering standards, and Core Web Vitals performance budgets across the public website and portal shells.

**Dependencies:** `07 WEBSITE_SITEMAP.md`, `08_DESIGN_SYSTEM_AND_UI_SPECIFICATION.md`, `09_PUBLIC_WEBSITE_CONTENT_AND_PAGE_SPECIFICATIONS.md`.

---

## 2. Technical & Content SEO Strategy

### 2.1 Indexable vs Non-Indexable Perimeter
- **Index (`index, follow`):** `/`, `/about`, `/services`, `/services/[slug]`, `/work`, `/work/[slug]`, `/insights`, `/insights/[slug]`, `/careers`, `/careers/internships`, `/careers/[slug]`, `/contact`, `/privacy`, `/terms`, `/cookies`.
- **Blocked (`Disallow` in `robots.txt` + `X-Robots-Tag: noindex, nofollow`):** `/admin/*`, `/sales/*`, `/recruitment/*`, `/client/*`, `/intern/*`, `/login`, `/forgot-password`, `/reset-password`, `/invite`, `/auth/*`, `/api/*`, preview URLs (`*.vercel.app`).

### 2.2 Structured Data (JSON-LD) Rules
- **`Organization` & `LocalBusiness` (Root / Contact):**
  - `name`: `Tech Groww` · `url`: `https://techgroww.co.in` · `foundingDate`: `2026`
  - `address`: **Greater Noida, Uttar Pradesh 203209, IN** ONLY (strictly remove fabricated Bengaluru/Mumbai/Noida-Sec-62 places!).
  - `sameAs`: Verified links ONLY (`https://www.linkedin.com/company/tech-growww`, `https://www.instagram.com/info_techgroww.co.in/`).
  - `telephone`: `+91 98143 90048` · `email`: `contact@techgroww.co.in`.
- **`Service` Schema:** Applied per `/services/[slug]` page matching verified service descriptions.
- **`Article` & `BreadcrumbList`:** Applied on `/insights/[slug]` and inner routes.
- **`JobPosting` Schema:** Applied on open `/careers/[slug]` listings synced from `job_postings` (`validThrough`, `employmentType`, `jobLocation`: Greater Noida).

### 2.3 Anti-Spam SEO Guardrails
- Zero stuffed `<meta name="keywords">` (remove legacy Bengaluru/Mumbai keyword stuffing).
- Zero doorway location/industry pages without distinct substantive content.
- Dynamic `sitemap.xml` built automatically from published DB records + static pages; `301` redirect matrix preserves all legacy `techgroww.co.in` indexed URLs (`07 WEBSITE_SITEMAP.md`).
- Branded custom `404` page with clean recovery links (`/services`, `/work`, `/contact`).

---

## 3. Accessibility Specification (WCAG 2.2 AA Target)

| Requirement | Implementation Standard |
|---|---|
| **Keyboard & Focus** | Skip-to-content link (`#main`), logical Tab order, visible `2px` focus ring (`outline-offset: 3px`) across light and dark backgrounds, `Escape` closes mobile drawer/modals, focus trapping inside open dialogs. |
| **Color & Contrast** | Normal text `>= 4.5:1`, large display text `>= 3:1` (verified `#526075` muted on `#F5F2EB` paper, `#FFFFFF` on `#1D4ED8` royal CTA, `#38BDF8` on `#070D19` ink). |
| **Motion & Vestibular Safety** | Mandatory `@media (prefers-reduced-motion: reduce)` skips preloader curtain, disables parallax/scroll-scrub, disables marquee auto-scroll; marquee includes explicit **Pause/Play** control (WCAG 2.2.2). |
| **Touch & Pointer Targets** | Minimum `44×44px` hit target on mobile nav buttons, accordions, form controls, and `NextTwo` cards (WCAG 2.5.8). |
| **Semantic HTML & ARIA** | Single `<h1>` per page, sequential headings (`h1 -> h2 -> h3`), `<nav aria-label="...">`, `<main id="main">`, explicit `<label for>` + `aria-describedby` error links + `aria-live="polite"` status announcements. |
| **Media Alt Text** | CMS enforces non-empty `alt_text` on every decorative=false image (`media_assets.alt_text`). |

---

## 4. Performance & Core Web Vitals Acceptance Targets

| Metric | Target Threshold (Proposed) | Engineering Strategy |
|---|---|---|
| **LCP (Largest Contentful Paint)** | `<= 2.5s` (mobile 4G & desktop) | Zero render-blocking JS/preloader on hero text; Next.js `next/font` self-hosted `Outfit` / `IBM Plex Sans`; AVIF/WebP via `next/image` with explicit dimensions. |
| **INP (Interaction to Next Paint)** | `<= 200ms` | React Server Components by default; minimal client JS hydration (`ServicesShowcase`, `Accordion`, forms only); passive scroll listeners only. |
| **CLS (Cumulative Layout Shift)** | `<= 0.1` | Fixed header height (`72px`), reserved aspect-ratio containers on diagrams/images, font-display `swap` with fallback metrics. |
| **Lighthouse Targets (Pre-Launch QA)** | Mobile & Desktop Performance `>= 90`, Accessibility `>= 95`, Best Practices `>= 95`, SEO `>= 95` | Verified on Vercel Staging via actual Lighthouse CLI / PageSpeed runs prior to launch (never claimed as marketing copy before measured). |
| **Bundle & Third-Party Discipline** | Initial public route JS `<= 130 KB` gzipped | No Three.js/WebGL/GSAP bloat; GA4 loaded dynamically *only* after cookie consent; `content-visibility: auto` on below-the-fold sections. |

---

## 5. Acceptance Criteria & Cross-References

- Automated `axe-core` / Playwright accessibility audit passes zero Critical/Serious violations; Lighthouse CI meets proposed thresholds on Staging before DNS cutover.
- **Cross-References:** `07 WEBSITE_SITEMAP.md`, `08_DESIGN_SYSTEM_AND_UI_SPECIFICATION.md`, `19_QA_TESTING_AND_ACCEPTANCE_CRITERIA.md`.

