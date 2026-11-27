# 08 — DESIGN SYSTEM, MOTION & RESPONSIVE UI SPECIFICATION

**Date:** 2026-11-27  
**Creative Basis:** `BRAND_STRATEGY.md` (Doc 05) + `CREATIVE_DIRECTION.md` (Doc 06) (Direction A: *Architectural Craft & Live Systems* for Public; Direction C: *Calm Operational UI* for Portals)

---

## 1. Purpose & Scope

Defines the canonical design tokens, typography scale, spacing/grid geometry, component library (including custom visual components `GrowthSignal`, `ProblemSelector`, `CapabilityMarquee`, and `NextTwo`), responsive device strategy, motion storyboard, and WCAG 2.2 AA accessibility rules shared across the public marketing site and the five authenticated portals.

**Dependencies:** `BRAND_STRATEGY.md` (Doc 05), `CREATIVE_DIRECTION.md` (Doc 06), `WEBSITE_SITEMAP.md` (Doc 07).

---

## 2. Color Tokens (Official Brand-Anchored WCAG 2.2 AA Palette)

| Token | Hex / Value | Usage | Contrast Target & Usage Guardrail |
|---|---|---|---|
| `--ink` | `#070D19` | Dark hero canvas, primary text on paper, footer background | `> 14:1` on `--paper` |
| `--ink-elevated` | `#0F192D` | Elevated dark cards, code/blueprint headers | `> 11:1` with `--paper` text |
| `--paper` | `#F5F2EB` | Primary light public canvas (warm architectural stone) | Base light surface |
| `--paper-elevated` | `#FAF8F3` | Public elevated cards, sticky header glass, blueprint panels | Subtle separation |
| `--portal-bg` | `#F7F7F5` | Authenticated portal canvas (`/admin`, `/sales`, `/recruitment`, `/client`, `/intern`) | Calm neutral |
| `--portal-surface` | `#FFFFFF` | Portal data tables, forms, drawers | `1px --line` separation |
| `--text-muted` | `#526075` | Secondary descriptions, timestamps, captions on **light surfaces ONLY** | `>= 4.8:1` on `--paper` / `#FFFFFF` (AA pass; **NEVER** on `--ink`) |
| `--text-muted-dark` | `#94A3B8` | Secondary descriptions, timestamps, `G R O W W` wordmark on **dark `--ink` surfaces ONLY** | `7.58:1` on `--ink`, `6.84:1` on `--ink-elevated` (`>= 4.5:1` AA pass) |
| `--line` | `#D8D2C7` | Decorative `1px` hairline section dividers and editorial row rules ONLY | Structural hairline (non-control) |
| `--line-control` | `#6E7785` | Interactive form input borders, checkboxes, outline button borders, active borders | `>= 4.0:1` on `--paper`, `#FAF8F3`, `#FFFFFF` (**WCAG 1.4.11 pass**) |
| `--brand-cobalt` | `#0284C7` | Faceted logo left highlights & decorative accents on `--ink` (`#070D19`) / large UI icons (`>= 3:1`) ONLY | **NEVER** used for small text or white-text button fills on light `--paper` (`3.66:1` < `4.5:1`) |
| `--brand-link` | `#0369A1` | Accessible text links, active light indicators, logo dark-stop on `--paper` / `--portal-surface` | `>= 5.3:1` on `--paper` & `#FFFFFF` (WCAG AA pass) |
| `--brand-royal` | `#1D4ED8` | Primary solid CTA background on light surfaces, deep links | `5.99:1` on `--paper`, `6.70:1` with `#FFFFFF` text |
| `--brand-sky` | `#38BDF8` | On-dark eyebrow accents, active blueprint markers, `--focus-dark` ring | `>= 8.1:1` on `--ink` & `--ink-elevated` |
| `--focus-light` | `#1D4ED8` | `2px solid`, `3px offset` keyboard focus ring on **ALL light surfaces** (`--paper`, `--paper-elevated`, `--portal-bg`, `--portal-surface`, **including solid `--brand-royal` buttons sitting on light canvases**) | `5.99:1` on `--paper`, `6.70:1` on `#FFFFFF` (WCAG 1.4.11 pass) |
| `--focus-dark` | `#38BDF8` | `2px solid`, `3px offset` keyboard focus ring **ONLY** on controls whose surrounding outer background is `--ink` (`9.07:1`) or `--ink-elevated` (`8.19:1`) | `>= 8.1:1` against surrounding `--ink` / `--ink-elevated` |
| `--status-success` | `#027A48` | Published, verified, approved, won states | `>= 4.6:1` on `--paper` & `#FFFFFF` |
| `--status-warn` | `#92400E` | Draft, pending confirmation, review states (darkened for AA) | `>= 6.2:1` on `--paper` & `#FFFFFF` |
| `--status-danger` | `#B42318` | Error messages, destructive confirmation, closed/rejected | `>= 5.6:1` on `--paper` & `#FFFFFF` |

*Forbidden:* Legacy purple-violet gradients (`#7C3AED` / `#4F46E5`), uncontrasted `#0284C7` small text/CTAs on light stone paper, `#D8D2C7` borders on interactive form controls, and neon drop-shadows.

---

## 3. Typography System

- **Display (`--font-display`):** `Outfit` (`700`, `800`), `letter-spacing: -0.04em`, `line-height: 0.94`, `text-wrap: balance`.
- **Body (`--font-body`):** `IBM Plex Sans` (`400`, `500`, `600`, `700`), `line-height: 1.62`, `text-wrap: pretty`.
- **Mono (`--font-mono`):** `IBM Plex Mono` (`400`, `500`), `letter-spacing: 0.14em` uppercase for eyebrows, index numbers (`01`–`06`), and live blueprint status badges.

| Scale Role | Clamp / Size | Line Height | Tracking |
|---|---|---|---|
| `display-hero` | `clamp(2.65rem, 8.5vw, 6.25rem)` | `0.94` | `-0.045em` |
| `display-section` | `clamp(2rem, 4.2vw, 3.5rem)` | `0.98` | `-0.04em` |
| `display-sub` | `clamp(1.4rem, 2.6vw, 2.1rem)` | `1.12` | `-0.03em` |
| `body-lede` | `clamp(1.02rem, 1.4vw, 1.18rem)` | `1.6` | `-0.005em` |
| `body-base` | `1rem` (`16px`) | `1.62` | `0` |
| `eyebrow` | `0.75rem` (`12px` min) | `1.3` | `0.14em` |

---

## 4. Layout Grid, Spacing & Surfaces

- **Container Max Width:** `76rem` (`1216px`); Narrow prose container: `44rem` (`704px`).
- **Scroll Margin for Sticky Header:** `scroll-padding-top: 88px` (ensures anchored/tabbed controls are never hidden behind the `72px` sticky header — **WCAG 2.2 SC 2.4.11 Focus Not Obscured**).
- **Gutter & Safe Areas:** `padding-inline: max(1rem, env(safe-area-inset-left), env(safe-area-inset-right))` on mobile; `1.5rem`–`2rem` on tablet/desktop.
- **Section Rhythm:** `padding-block: clamp(3.5rem, 9vw, 8rem)`.
- **Border Radius Discipline:** Restrained architectural radii (`--radius-sm: 6px` inputs/badges, `--radius-md: 12px` panels/drawers, `--radius-lg: 18px` feature frames, `--radius-pill: 999px` buttons only). Zero oversized `32px` bubble cards everywhere.
- **Shadows:** Flat hairline borders on paper (`1px solid var(--line)`); subtle elevation shadow reserved exclusively for sticky/active blueprints, dropdowns, and modals. Interactive controls (`input`, `select`, `textarea`, secondary outline buttons) use `1px solid var(--line-control)` (`>= 3.3:1`).

---

## 5. Component Inventory & Custom Visual Modules (Public vs Portal Rules)

| Component | Public Behavior | Portal Behavior (`/admin`, `/sales`, `/recruitment`, `/client`, `/intern`) |
|---|---|---|
| **Navigation** | Sticky top bar (`72px`), 6 primary links + CTA (`Start a project`); mobile full-height drawer (`44×44px+` touch targets, `Escape` closes, inert background scroll-lock). | Persistent left sidebar (`240px`) on `lg+`, horizontal scrollable module tabs on `<1024px`, Portal Switcher for multi-role staff, Notification bell, Sign out. |
| **Buttons & Target Size** | Primary (`--brand-royal` `#1D4ED8` / `#FFFFFF`), On-Dark (`#FFFFFF` on `--ink`), Secondary (`--line-control` border), Ghost-on-dark. All controls `>= 44×44px` on `<1024px` touch viewports and `>= 24×24px` on desktop (**WCAG 2.2 SC 2.5.8**). | Compact (`sm`/`md`) solid/outline/destructive buttons with loading spinners, minimum `24×24px` desktop (`44×44px` mobile), disabled state protection against double-submit. |
| **Custom Modules (`GrowthSignal`, `ProblemSelector`, `CapabilityMarquee`, `NextTwo`)** | **`GrowthSignal`:** Crisp pure-vector architectural SVG of nested upward delta-chevron geometry derived directly from `techgroww_logo.svg` (`aria-hidden="true"`, hairline `--brand-sky`/`--brand-cobalt` strokes; **zero** constellation dots or stock meshes).<br>**`ProblemSelector`:** 4–6 interactive `<button>`/`<a>` problem pills routing to `/contact?service=...`.<br>**`CapabilityMarquee`:** Single `<ul>` announced to screen readers, visual duplicate track marked `aria-hidden="true"`, explicit **`aria-pressed` Pause/Play button**, auto-pauses on `:hover` and `:focus-within`.<br>**`NextTwo`:** Editorial 2-column dark/stone closing cross-links (`44px+` full-card target). | Flat bordered data panels, KPI metric tiles (real DB counts only), sortable filterable tables, Kanban stage boards with **non-drag keyboard/button stage-change dropdown menus** (**WCAG 2.2 SC 2.5.7 Dragging Movements**). |
| **Forms & Authentication** | Accessible `<label>`, `aria-invalid`, inline Zod errors, honest delivery feedback, Turnstile widget (supporting Cloudflare accessible audio/session fallback — **WCAG 2.2 SC 3.3.8**) + honeypot. | React Hook Form / Server Actions, password managers & paste enabled on login (**WCAG 2.2 SC 3.3.8**), dirty-state warning, inline field validation, confirm modal for destructive/status changes. |
| **Accordions / Tabs** | CSS grid-row `0fr -> 1fr` transition (`300ms`), keyboard `Enter`/`Space` accessible. | Tabbed candidate/lead/project detail views (`Overview`, `Timeline`, `Files`, `Notes`). |
| **Modals / Drawers / Toasts** | Minimal (cookie preferences drawer only). | Slide-over detail drawers, accessible focus-trapped confirm dialogs, `aria-live="polite"` toast notifications. |
| **Empty & Error States** | Honest fallback messaging (`No approved client case studies published yet — explore Reference Blueprints`, custom `404`). | Actionable empty states (`No leads match filter — Reset filters`) + route-level `error.tsx` & `loading.tsx` skeletons. |

---

## 6. Motion & Interaction Storyboard

**Selected Library Stack:** **CSS `@supports` Scroll/View Transitions + `motion/react` (selective UI springs) + passive `IntersectionObserver`** — **NO Three.js/WebGL**, **NO heavy GSAP bundle**, **NO scroll-jacking**.

| Sequence | Trigger | Property Animated | Duration / Easing | Mobile (`< 1024px`) & Reduced Motion Behavior |
|---|---|---|---|---|
| **1. Non-Blocking Brand Reveal** | First session visit (`sessionStorage`) | Top `2px` hairline accent draw (`scaleX(0 -> 1)`) + subtle card fade without covering or delaying SSR Hero `<h1>` (`opacity: 1` at initial paint — guarantees zero LCP block). | `650ms` (`cubic-bezier(0.16,1,0.3,1)`) — strict `<= 750ms` cap | Skipped automatically on repeat navigation and skipped completely under `prefers-reduced-motion: reduce`. |
| **2. Hero Sub-Elements Reveal** | Page mount | `transform: translateY(12px -> 0)` on metadata strip & diagram (Hero `<h1>` text itself renders immediately visible for `LCP <= 2.5s`) | `550ms` (`cubic-bezier(0.16,1,0.3,1)`) | Immediate static visibility under `prefers-reduced-motion: reduce`. |
| **3. Scroll Progress Bar** | Root scroll | Top `2px` bar `scaleX(0 -> 1)` | Continuous CSS `animation-timeline: scroll()` with passive `rAF` fallback. | Hidden or static under `prefers-reduced-motion: reduce`. |
| **4. Service Blueprint Switch** | `>= 1024px`: Hover / Focus on index row `01–06` | Active highlight + sticky Blueprint card swap (`opacity`/`translateY`) | `220ms` ease-out | On `< 1024px` (Mobile & Tablet), renders **expandable tap accordion + direct tap-through CTA** to `/services/[slug]`. |
| **5. 5-Stage Delivery Rail** | `IntersectionObserver` (`rootMargin: -35%`) | Step marker scale & progress bar across `01 Understand -> 02 Architect -> 03 Build -> 04 Verify -> 05 Support` | `320ms` ease-out | Vertical stacked timeline with clear step badges; zero scroll locking. |
| **6. Capability Marquee Ribbon** | Continuous horizontal loop | `translateX(0 -> -50%)` | `28s linear infinite` + mandatory visible **`aria-pressed` Pause/Play button** (WCAG 2.2.2) + `:focus-within` / `:hover` pause. | Paused by default under `prefers-reduced-motion: reduce`. |

---

## 7. Responsive Breakpoints & Device Matrix

| Class | Breakpoint | Layout & Interaction Adaptation |
|---|---|---|
| **Small Mobile** | `320px–479px` | Single-column stack (1-col `hero-facts`), `44×44px` min tap targets, balanced fluid display type, bottom safe-area inset padding, `GrowthSignal` hidden to protect above-the-fold copy. |
| **Mobile** | `480px–767px` | Balanced `hero-facts` grid (3-item strip uses 3-column compact grid or spans 3rd item full-width — zero orphan), compact decorative `GrowthSignal` strip below hero CTAs (`hidden` `< 480px`), full-screen mobile nav drawer, stacked `NextTwo` footer cards. |
| **Tablet / iPad** | `768px–1023px` | 2-column pillar & update grids, **tap-to-expand Services Blueprint accordion + direct service links** (hover never required), side-by-side `NextTwo` cards, responsive portal drawers/scrollable tabs. |
| **Laptop / Desktop** | `1024px–1439px` | Split Hero (`1.4fr` copy / `0.6fr` `GrowthSignal`), sticky desktop Services Blueprint (`>= 1024px`), sidebar-based `240px` Portal Shell. |
| **Large Desktop** | `1440px+` | Capped `76rem` (`1216px`) content container (`44rem` prose) so reading lines never exceed `62ch–65ch`. |

---

## 8. Decisions, Assumptions, Outstanding Confirmations & Acceptance Criteria

- **Decisions:**
  - Keep decorative animations (`transform`/`opacity` only) scoped strictly to the public site without ever occluding Hero LCP; keep all 5 internal portals crisp, dense, and zero-theatre.
  - Strictly enforce `--brand-link` (`#0369A1`), `--brand-royal` (`#1D4ED8`), `--status-warn` (`#92400E`), and `--line-control` (`#6E7785`) so 100% of text, buttons, focus rings, and form controls pass WCAG 2.2 AA (`4.5:1` / `3:1`).
- **Assumptions:** Browser target covers evergreen Chrome, Safari/iOS Safari, Edge, and Firefox + mid-range Android devices (`>= 60fps` scroll).
- **Outstanding Confirmations:** `[COMPANY CONFIRMATION REQUIRED: Final stakeholder review of responsive Figma/Staging preview prior to production launch]` (`21_PRELAUNCH_VERIFICATION_CHECKLIST.md` `C-11`).
- **Acceptance Criteria:** `prefers-reduced-motion` disables non-essential motion cleanly; zero layout shift (`CLS <= 0.1`); WCAG 2.2 AA contrast, SC `2.4.11`, `2.5.7`, `2.5.8`, and `3.3.8` verified across light `--paper`, dark `--ink`, and portal `--portal-surface` tokens.
- **Cross-References:** `CREATIVE_DIRECTION.md` (Doc 06), `09_PUBLIC_WEBSITE_CONTENT_AND_PAGE_SPECIFICATIONS.md`, `18_SEO_ACCESSIBILITY_AND_PERFORMANCE_SPECIFICATION.md`.
