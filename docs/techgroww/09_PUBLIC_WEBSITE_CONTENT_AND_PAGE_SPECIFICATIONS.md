# 09 — PUBLIC WEBSITE CONTENT STRATEGY & PAGE-BY-PAGE SPECIFICATIONS

**Date:** 2026-11-27  
**Factual Baseline:** Strictly governed by `COMPANY_INFORMATION_VERIFICATION.md` (Doc 03) (`V-PUB` / `S-POST` only; zero unverified metrics, zero developer personal contacts, zero invented history).

---

## 1. Purpose & Scope

Defines the global navigation/footer rules, page-by-page UI/UX composition, user intent, content hierarchy, authentic copy proposals (distinct from verified facts), CTA strategy, responsive behavior, legal/DPDP disclosures, SEO metadata matrix, landmark hierarchy, and content sources for every public route.

**Dependencies:** `COMPANY_INFORMATION_VERIFICATION.md` (Doc 03), `WEBSITE_SITEMAP.md` (Doc 07), `08_DESIGN_SYSTEM_AND_UI_SPECIFICATION.md`.

---

## 2. Messaging Framework (Verified Facts vs Proposed Copy)

### 2.1 Locked Factual Anchor (`V-PUB` vs `S-POST` Clearly Separated)
- **`V-PUB` (Official Public Profile Baseline):**
  - Brand: **Tech Groww** (`TECH GROWW`) · Tagline: **Technology That Drives Growth.**
  - Founded: **2026** · HQ: **Greater Noida, Uttar Pradesh 203209, India**
  - Official Socials: LinkedIn (`https://www.linkedin.com/company/tech-growww`), Instagram (`https://www.instagram.com/info_techgroww.co.in/`)
  - 5 Core LinkedIn About Capabilities: Custom Web & Mobile Engineering, Salesforce Ecosystem Solutions (Admin, Support, OmniStudio), UI/UX & Product Design, Enterprise Software Development, IT Consulting & Strategic Transformation.
- **`S-POST` (Supported by Official Social Posts — Confirm Permanence Pre-Cutover):**
  - Corporate Emails: `contact@techgroww.co.in`, `sales@techgroww.co.in`, `hr@techgroww.co.in` (`21` `C-03`)
  - 6th Capability: Digital Marketing & SEO Visibility (`21` `C-06`)
  - Recruiting Posts: `Sales Executive` & `2-Month Sales Intern` (`21` `C-12`)
- **Gated Legacy-Site Items (`[COMPANY CONFIRMATION REQUIRED]`):**
  - Phone / WhatsApp (`+91 98143 90048` on legacy `techgroww.co.in`; absent on public LinkedIn guest view): `[COMPANY CONFIRMATION REQUIRED: Confirm canonical public company/WhatsApp phone number]` (`21` `C-02`).

### 2.2 Proposed Original Copy Tone (Separately Labeled for Client Approval)
- **Primary Positioning Headline (Proposed):** *"Technology that drives growth."* / *"Engineering software around the actual business problem."*
- **Honest Early-Stage Framing (Proposed):** *"Founded in 2026 in Greater Noida. No inflated history, no account-manager layers — direct engineering accountability from scope to support."*

---

## 3. Page-by-Page & Global Chrome Specifications

### 3.0 Global Header & Footer Specification
- **Header (`<header>`):** Pure-vector Tech Groww mark + wordmark -> 6 concise nav links (`Services`, `Work`, `About`, `Insights`, `Careers`, `Contact`) -> Primary CTA button (`Start a project`). Optional phone utility badge suppressed unless `[COMPANY CONFIRMATION REQUIRED: C-02]` passes. Zero `/admin` or portal links in primary public nav (`Sign In` sits unobtrusively or at `/login`).
- **Footer (`<footer>`):** Brand mark + tagline -> Navigation columns (`Company`, `Services`, `Careers & Insights`, `Legal`) -> Official Greater Noida, UP `203209` location note (`[COMPANY CONFIRMATION REQUIRED: Confirm whether city/PIN-only or street address]` `C-04`) + verified social links (`LinkedIn`, `Instagram`) -> Newsletter opt-in (`POST /api/v1/public/newsletter/subscribe`) -> Copyright string (`© 2026 [COMPANY CONFIRMATION REQUIRED: Official Legal Entity Name — C-01]`). **Strictly NO `/admin` or `/admin/login.php` link in public footer.**

### 3.1 Homepage (`/`)
- **Purpose & Intent:** Answer in 5 seconds: (1) What Tech Groww builds, (2) Who it helps, (3) Why an early-stage principal-led team is an advantage, (4) Clear next step.
- **Target Audience:** Founders, SMB owners, CTOs, prospective hires.
- **Section-by-Section Structure:**
  1. **Hero (Dark Ink `#070D19`):** Official pure-vector mark in header -> Eyebrow (`Greater Noida · Founded 2026`) -> Display `<h1>` (`Technology that drives growth.`) -> 2-line positioning lede -> Dual CTA (`Start a project` primary + `Explore services` ghost) -> 3-column metadata strip (`Founded: 2026 | HQ: Greater Noida | Focus: Web, Salesforce & Software`) -> Hairline `GrowthSignal` SVG diagram (`hidden` on `320–479px`, compact on tablet).
  2. **Capability Ribbon (`CapabilityMarquee`):** Pausable horizontal marquee (`aria-pressed` pause control) of the 6 core service disciplines (`SEO & Digital Visibility` toggled cleanly via CMS).
  3. **What Defines Us (4 Operating Pillars):** Numbered `01–04` editorial cards (*Business-first framing*, *Practical delivery*, *Side-by-side collaboration*, *Clear accountability*).
  4. **Interactive Services Blueprint (`01–06`):** Split sticky layout on `>= 1024px` desktop (expandable accordion on `< 1024px`) — selecting any numbered discipline updates the live Blueprint panel (Business Problem -> Solution -> Capabilities -> CTA to `/services/[slug]`).
  5. **Problem-First Selector (`ProblemSelector`):** Interactive problem chips (e.g., *"Need a custom web or mobile app"*, *"Salesforce / OmniStudio setup & support"*, *"Legacy workflow bottlenecks"*, *"UI/UX overhaul"*) routing to `/contact?service=...`.
  6. **How We Work (5-Stage Delivery Rail):** Scroll-tracked steps (`01 Understand -> 02 Architect -> 03 Build -> 04 Verify -> 05 Support`).
  7. **Work / Reference Blueprints Teaser:** Honest note explaining commercial client work is published *only* with written approval (`is_client_approved = true`), linking to `/work` Reference Blueprints.
  8. **Company Updates & Insights:** Top 3 published CMS entries from `/insights` (real LinkedIn hiring/launch updates or CMS articles).
  9. **Straight-Answers FAQ:** 5 honest questions about timelines, Salesforce/OmniStudio, engagement models, security, and partnering with a 2026 firm.
  10. **Final Conversion Close (Dark Ink):** `Tell us what needs to move forward.` -> Direct CTA + confirmed WhatsApp/Email channel + `NextTwo` navigation (`About` / `Work`).

### 3.2 About Page (`/about`)
- **Purpose:** Tell Tech Groww's honest story without fabricated milestones.
- **Sections:** Hero -> Company Story (founded 2026, Greater Noida) -> Mission, Vision & Philosophy (`New but committed`) -> Four Operating Principles -> **Leadership & Team** (CMS-driven; `[COMPANY CONFIRMATION REQUIRED: Confirm exact designations, bios, and approved photos for Sonia Tiwari, Shainki Gautam, Archana Bhati before public toggle — C-07]`) -> Careers CTA.

### 3.3 Services Directory (`/services`) & 6 Detail Pages (`/services/[slug]`)
- **Directory (`/services`):** Hero -> Interactive `ServicesShowcase` (`01–06`) -> Engagement Models comparison (Milestone Fixed-Price vs Dedicated Retainer, zero fake prices) -> Technology Stack matrix grouped by domain (`Frontend`, `Backend`, `Salesforce & CRM`, `UI/UX`, `Database & Cloud`, `SEO`) -> CTA.
- **Detail Pages (`/services/[slug]`):** Dedicated routes for all 6 launch services (`web-mobile-engineering`, `salesforce-solutions`, `ui-ux-design`, `enterprise-software`, `it-consulting`, `digital-marketing-seo` with `SEO` gated by `C-06` CMS toggle):
  - Structure: Hero + Breadcrumbs -> Business Problem -> Proposed Architecture/Approach -> Core Deliverables Checklist -> Tech & Platform Focus -> 5-Step Delivery Alignment (`01 Understand`–`05 Support`) -> Related Reference Blueprints (when available) -> Service-Specific FAQs -> Pre-filled Quote Sidebar CTA (`/contact?service=...`).
  - *Note:* AI Solutions & Business Automation remain `draft` in `/admin/services` until `[COMPANY CONFIRMATION REQUIRED: Confirm active AI & RPA delivery readiness — C-06]`.

### 3.4 Work & Reference Blueprints (`/work` & `/work/[slug]`)
- **Purpose:** Showcase technical architecture capability transparently without disguising demos as commercial client wins.
- **Rules & Structure:**
  - Filter tabs (`All`, `Reference Blueprints`, `Internal Products`; **`Client Work` tab stays hidden until `COUNT(published client_project WHERE is_client_approved = true) > 0`**).
  - Every non-client card renders a prominent mono badge **`REFERENCE BLUEPRINT`** or **`INTERNAL PROTOTYPE`**.
  - **Strict Legacy Demo Prohibition:** The 6 unverified demonstration cards and invented metrics from legacy `portfolio.php` (`5 hours -> 45s`, `7s -> 650ms`, `1,500+ concurrent`, `99.4% precision`) are **strictly prohibited from migration**.
- **Detail Page (`/work/[slug]`):** Project type badge -> Overview -> Problem Statement -> Technical Architecture & Stack -> Outcomes rule (Reference Blueprints display qualitative **`Architectural Goal`** copy ONLY — zero quantitative claims unless tied to an approved `client_project` with proof) -> Related Services CTA.

### 3.5 Insights / Knowledge Hub (`/insights` & `/insights/[slug]`)
- **Purpose:** SEO authority, company updates, and engineering guides.
- **Structure:** Category filter (`Engineering`, `Salesforce`, `Design`, `Company Updates`), keyword search, featured article (`is_featured`), 3-column article grid -> Detail page with `reading_time_mins`, author block, auto-generated table of contents, sanitized Markdown body, related articles, and newsletter capture.

### 3.6 Careers & Internships (`/careers`, `/careers/internships`, `/careers/[slug]`)
- **Purpose:** Attract sales, engineering, and internship talent directly into the Recruitment Portal ATS.
- **Structure:** Hero -> Open Roles fetched live from **`job_postings`** (`status = 'open'`; `[COMPANY CONFIRMATION REQUIRED: Confirm whether LinkedIn-advertised Sales Executive & 2-Month Sales Intern roles remain open at launch — C-12]`) -> Dedicated `/careers/internships` landing detailing learning tracks, offer letter + completion certificate benefits (`internship_programs`) -> Role Detail `/careers/[slug]` with full JD, skills, location (`Greater Noida`), and embedded **Application Form** (Name, Email, Phone, LinkedIn/Portfolio URL, Cover Note, PDF/DOCX Resume Upload <= 5 MB, Privacy & optional Talent-Pool consent checkbox). Includes link to tokenized status page `/careers/status`.

### 3.7 Contact (`/contact`)
- **Purpose:** Convert qualified prospects into structured Sales Leads without form friction.
- **Structure:** Direct Channels sidebar (`[COMPANY CONFIRMATION REQUIRED: Confirm official emails contact@/sales@, phone/WhatsApp +91 98143 90048, Greater Noida address granularity, and business hours — C-02, C-03, C-04, C-05]`, NDA readiness note) + Project Inquiry Form (Full Name, Work Email, Phone/WhatsApp, Company, Service Needed, Budget Bracket, Project Scope, Preferred Channel, Turnstile check, Privacy consent).
- **Proposed Response SLA Copy:** Copy referencing *"our team will respond within 1 business day"* (`[COMPANY CONFIRMATION REQUIRED: Confirm target inquiry response SLA — C-13]`) is rendered **ONLY** when server DB persistence + Resend notification succeed; otherwise displays verified fallback channels.

### 3.8 Legal & Governance Pages (`/privacy`, `/terms`, `/cookies`)
- All three routes display a prominent non-launch banner until counsel sign-off: `[COMPANY CONFIRMATION REQUIRED: Official legal entity name & counsel sign-off required prior to launch — C-01, C-10]`.
- **`/privacy` (India DPDP Act 2023 Compliant Disclosures):**
  - Data Fiduciary Identity (`[COMPANY CONFIRMATION REQUIRED: Registered Entity Name & Greater Noida Address — C-01, C-04]`).
  - Purposes & Lawful Consent Grounds (Inquiry response, Recruitment evaluation, Newsletter broadcasts, Portal service delivery).
  - **Exact Retention Schedule:** Rejected candidate PII & resumes purged at **`180 days`** unless candidate opts into `talent_pool_consent`; inactive website enquiries reviewed/archived at **`24 months`**; PII-free security `audit_logs` retained **`365 days`**.
  - **Third-Party Data Processors:** Named disclosure of Vercel (hosting), Supabase (database/auth/storage), Resend (email delivery), Google Workspace (corporate mail/optional Sheets), Cloudflare Turnstile (bot mitigation), and Google Analytics 4 (**strictly consent-gated**).
  - **Data Principal Rights & Grievance Officer:** Access, correction, consent withdrawal, and erasure request instructions + `[COMPANY CONFIRMATION REQUIRED: Grievance Officer Name, Designation & Official Email — C-10]`.
- **`/terms`:** Scope of website informational use, intellectual property ownership, limitation of liability, acceptable portal use, and **`[COMPANY CONFIRMATION REQUIRED: Governing Law & Dispute Jurisdiction e.g. Gautam Buddha Nagar, Uttar Pradesh, India — C-10]`**.
- **`/cookies` & Cookie Consent Banner:** Equal-prominence **`Essential only`** vs **`Allow analytics`** controls; lists strictly necessary cookies (Supabase session, CSRF/Turnstile) vs optional analytics (`GA4`, zero marketing pixels at launch; strictly unloaded until opt-in).

---

## 4. Public Route SEO, Landmark & Content Source Matrix

| Route | Title Template (`<= 60 chars`) | Meta Description Intent | Landmark Hierarchy | Content Source |
|---|---|---|---|---|
| `/` | `Tech Groww \| Web, Salesforce & Custom Software Engineering` | Technology that drives growth — Greater Noida web, mobile, Salesforce & UI/UX partner. | `<header>`, `<nav>`, `<main id="main">` (`<h1>` only once), `<footer>` | Hybrid (`pages` + `services` + `blog_posts` + `system_settings`) |
| `/about` | `About Tech Groww \| Engineering Team & Operating Principles` | Founded 2026 in Greater Noida — honest principal-led delivery without layers. | `<header>`, `<main id="main">`, `<footer>` | `pages` + `team_members` (`is_public = true`) |
| `/services` | `Services \| Web, Mobile, Salesforce & UI/UX — Tech Groww` | Explore full capabilities, engagement models, and technology stack. | `<header>`, `<main id="main">`, `<footer>` | `services` (`status = 'published'`) |
| `/services/[slug]` | `{Service Title} \| Tech Groww Services` | Service problem framing, architecture deliverables, FAQs & quote path. | `<header>`, Breadcrumb `<nav>`, `<main id="main">`, `<footer>` | `services` row by `slug` |
| `/work` | `Work & Reference Blueprints \| Tech Groww` | Approved client work & clearly labeled technical architecture blueprints. | `<header>`, `<main id="main">`, `<footer>` | `portfolio_items` (`status = 'published'`) |
| `/work/[slug]` | `{Project Title} \| Tech Groww Blueprint` | Problem statement, architecture stack, and qualitative goal / verified outcome. | `<header>`, Breadcrumb `<nav>`, `<main id="main">`, `<footer>` | `portfolio_items` row by `slug` |
| `/insights` | `Insights & Updates \| Tech Groww Engineering Journal` | Technical guides, Salesforce architecture notes, and company updates. | `<header>`, `<main id="main">`, `<footer>` | `blog_posts` + `blog_categories` |
| `/insights/[slug]` | `{Article Title} \| Tech Groww Insights` | Article detail with author attribution, reading time & TOC. | `<header>`, `<article>` inside `<main id="main">`, `<footer>` | `blog_posts` row by `slug` |
| `/careers` | `Careers \| Join Tech Groww (Greater Noida)` | Open sales, engineering, and internship opportunities. | `<header>`, `<main id="main">`, `<footer>` | `job_postings` (`status = 'open'`) |
| `/careers/internships` | `Internship Program \| Tech Groww Cohorts` | Structured cohort tracks, mentorship, offer letter & verifiable certificate. | `<header>`, `<main id="main">`, `<footer>` | `internship_programs` + `job_postings` |
| `/careers/[slug]` | `{Role Title} \| Careers at Tech Groww` | Job description, requirements & encrypted resume application form. | `<header>`, Breadcrumb `<nav>`, `<main id="main">`, `<footer>` | `job_postings` row by `slug` |
| `/careers/status` | `Application Status \| Tech Groww Careers` *(noindex, nofollow)* | Tokenized candidate stage view, interview schedule & offer accept/decline (scorecards omitted). | `<header>`, `<main id="main">`, `<footer>` | `applications` + `interviews` + `offers` via `status_token_hash` |
| `/contact` | `Contact Tech Groww \| Start a Project Inquiry` | Scope your project or reach our Greater Noida team directly. | `<header>`, `<main id="main">`, `<footer>` | `system_settings` -> Sales API |
| `/privacy`, `/terms`, `/cookies` | `{Policy Name} \| Tech Groww Legal` | DPDP Act 2023 privacy disclosures, terms of use & cookie preferences. | `<header>`, `<main id="main">`, `<footer>` | `pages` (Counsel signed off) |

---

## 5. Decisions, Assumptions, Outstanding Confirmations & Acceptance Criteria

- **Decisions:** Enforce strict `V-PUB` / `S-POST` / `[COMPANY CONFIRMATION REQUIRED]` tagging across all public copy; prohibit migration of unverified legacy demo stats and footer `/admin` links.
- **Assumptions:** Initial launch features Reference Blueprints cleanly on `/work` unless leadership supplies signed commercial case study approval before cutover.
- **Outstanding Confirmations:** Tracked centrally in `21_PRELAUNCH_VERIFICATION_CHECKLIST.md` (`C-01`–`C-13`, including `C-02` phone, `C-06` AI/SEO service scope, `C-07` team consent, `C-10` DPDP Grievance Officer & Jurisdiction, `C-12` open roles, `C-13` 1-business-day SLA).
- **Acceptance Criteria:** Every public route specifies purpose, sections, title/meta intent, WCAG 2.2 AA landmarks (`header`, `main`, `footer`, single `h1`), and DB/config source; zero unverified claims ship unflagged.
- **Cross-References:** `COMPANY_INFORMATION_VERIFICATION.md` (Doc 03), `08_DESIGN_SYSTEM_AND_UI_SPECIFICATION.md`, `18_SEO_ACCESSIBILITY_AND_PERFORMANCE_SPECIFICATION.md`, `21_PRELAUNCH_VERIFICATION_CHECKLIST.md`.
