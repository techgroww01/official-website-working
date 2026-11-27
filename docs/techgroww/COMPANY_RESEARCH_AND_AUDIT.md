# 02 — COMPANY RESEARCH AND CURRENT WEBSITE AUDIT

**Audit Date:** 2026-11-27  
**Audited Sources:**
1. Live Website: `https://techgroww.co.in/` (HTTP 200 verified across `/`, `/about`, `/services`, `/portfolio`, `/contact`, `/privacy-policy`, `/terms`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`)
2. Legacy Codebase Reference (Read-Only): `u:\techgroww web final`
3. Official LinkedIn Page: `https://www.linkedin.com/company/tech-growww` (accessed 2026-11-27 via Chromium/Playwright)
4. Official Instagram Account: `https://www.instagram.com/info_techgroww.co.in/` (accessed 2026-11-27 via Chromium/Playwright)
5. Official Brand Assets: `C:\Users\MSI\Downloads\techgroww_logo.svg` + user-provided cover/badge renders

---

## 1. Current Website Technical & Structural Audit (`https://techgroww.co.in/`)

### 1.1 Tech Stack & Hosting
- **Frontend:** Server-rendered Core PHP 8+ templates, custom CSS (`assets/css/style.css?v=1.3.0`, 51.6 KB), Vanilla ES6+ JS (`assets/js/main.js`).
- **Fonts:** `Plus Jakarta Sans` + `Inter` via Google Fonts.
- **Database:** Hostinger MySQL/MariaDB via PDO (`contact_enquiries`, `newsletter_subscribers`, `admin_users`, `email_notifications`).
- **Admin:** Basic PHP session portal at `/admin/login.php` (`dashboard.php`, `enquiries.php`, `subscribers.php`) — **no CMS**, **no page/service/blog/career/team management**, **no RBAC granularity**.
- **Hosting:** Hostinger shared/cloud Apache (`u215281564_*` naming convention in `config.sample.php`).

### 1.2 Current Sitemap & Navigation
- **Top Nav:** `Home`, `About`, `Services` (dropdown of 6 items), `Portfolio`, `Contact`, `Get a Quote` CTA + top utility strip (`+91 98143 90048`, `contact@techgroww.co.in`).
- **Pages:** `/`, `/about`, `/services`, `/services/web-development`, `/services/software-development`, `/services/automation`, `/services/ai-solutions`, `/services/digital-marketing`, `/services/it-consulting`, `/portfolio`, `/contact`, `/privacy-policy`, `/terms`, `/404`.
- **Missing Essential Corporate Pages:** No `/insights` or blog, no `/careers` portal (despite active LinkedIn hiring!), no dedicated team visibility, no cookie/data-protection detail.

### 1.3 Critical Weaknesses Identified

| Severity | Finding | Evidence |
|---|---|---|
| **CRITICAL (Credibility)** | **Conflicting Company Name & Tagline** | Live site uses `Techgroww` / `Techgroww IT Solutions` and *"Transforming Ideas Into Digital Solutions"*. Official LinkedIn, Instagram, and brand banner use **`TECH GROWW`** and ***"Technology That Drives Growth"***. |
| **CRITICAL (Credibility)** | **Unverified Multi-City Hubs & Addresses** | `contact.php` JSON-LD & `llms.txt` claim *"Bengaluru Headquarters (ORR/HSR 560102)"*, *"Mumbai Technology Center (BKC 400051)"*, and *"Noida Sector 62 Tech Hub (201309)"*. LinkedIn explicitly states HQ is **Greater Noida, Uttar Pradesh 203209, IN** with no Bengaluru or Mumbai offices. |
| **CRITICAL (Credibility)** | **Mismatched Service Offerings** | Live site sells `Business Process Automation (RPA)` and `AI & Intelligent Solutions (LLM/RAG)` while **omitting** `Salesforce Ecosystem Solutions (Admin & OmniStudio)`, `Mobile App Development`, and `UI/UX & Product Design`, which are explicitly listed on LinkedIn & Instagram. |
| **CRITICAL (Conversion)** | **LinkedIn Website Field Points to a Google Form** | On `linkedin.com/company/tech-growww`, the official `Website` link currently routes to `docs.google.com/forms/d/e/1FAIpQLSe...` instead of `https://techgroww.co.in/`. |
| **HIGH (Broken Social Links)** | **Wrong LinkedIn URL & Unverified Social Links in Footer/Schema** | Live `config.php` defines `SOCIAL_LINKEDIN` as `linkedin.com/company/techgroww` (wrong slug; official is `tech-growww`), `SOCIAL_INSTAGRAM` as `instagram.com/techgroww` (official is `info_techgroww.co.in`), plus `x.com/techgroww` & `facebook.com/techgroww` in JSON-LD `sameAs`. |
| **HIGH (Security)** | **Admin Portal Exposed in Public Footer & Default Seed Password** | `footer.php` line 148 renders a public `<a href="/admin/login.php">Admin Portal</a>` link, inviting automated brute-force scanners. `schema.sql` contains a hardcoded default password (`TechgrowwAdmin@2026!`) in repository SQL. |
| **HIGH (Factual Proof)** | **Unverified Numerical Claims & Synthetic Demo Numbers** | Homepage hero claims `99.9% Uptime Architecture`; service pages claim `95+ Google PageSpeed` and `Sub-Second Page Load Speeds`; demonstration portfolio cards cite specific metrics (`5 hours -> 45s`, `25+ hrs/week`, `7s -> 650ms`, `1,500+ concurrent checkouts`, `99.4% precision`, `15-min RPO/RTO`) without verifiable client attribution. |
| **MEDIUM (Visual & UX)** | **Generic Navy + Blue/Violet AI-Template Styling** | Live CSS (`#0b132b`, `--grad-primary: linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)`, rounded white cards with icon boxes) reads like an AI-generated IT template rather than a distinctive modern engineering firm. |
| **MEDIUM (SEO)** | **Keyword-Stuffed Meta Tags** | Header injects stuffed `<meta name="keywords">` targeting `web development company Bangalore`, `custom software development Mumbai`, etc., along with `geo.region` for KA/MH despite having no offices there. |
| **MEDIUM (Brand Assets)** | **Raster-Embedded Official SVG** | `C:\Users\MSI\Downloads\techgroww_logo.svg` is a `1536×1536` base64 raster image wrapped in `<svg>`, not pure vector paths, increasing payload and risking blur at extreme sizes. |

---

## 2. Official LinkedIn Audit (`https://www.linkedin.com/company/tech-growww`)

Captured **2026-11-27** via browser inspection:

- **Company Name:** Tech Groww
- **Descriptor:** Software Development · IT Services & IT Consulting
- **Headquarters:** Greater Noida, Uttar Pradesh 203209, IN
- **Founded:** 2026
- **Company Size (LinkedIn field):** `11-50 employees` (Type: `Self-Employed`)
- **Publicly Linked Employees (3 visible):**
  1. `Shainki Gautam` (`/in/shainki-gautam-40431a228`)
  2. `Sonia Tiwari` (`/in/sonia-tiwari-18381b274`)
  3. `Archana Bhati` (`/in/archana-bhati-9795123b0`) — explicitly welcomed as **HR Intern** in company post (~4 weeks prior)
- **Followers at Audit:** 198 followers
- **5 Core Capabilities Listed in About:**
  1. Custom Web & Mobile Engineering
  2. Salesforce Ecosystem Solutions (Administration, support, OmniStudio)
  3. UI/UX & Product Design
  4. Enterprise Software Development
  5. IT Consulting & Strategic Transformation
- **6th Capability Promoted in Posts & Instagram:** SEO & Digital Visibility
- **Email Addresses Published in Posts:** `contact@techgroww.co.in`, `sales@techgroww.co.in`, `hr@techgroww.co.in`
- **Active Hiring Posts:**
  1. **Sales Executive** (full-time; apply via `contact@techgroww.co.in`)
  2. **Sales Intern** (2-month internship; offer letter + completion certificate; apply via `sales@techgroww.co.in`)

---

## 3. Official Instagram Audit (`https://www.instagram.com/info_techgroww.co.in/`)

Captured **2026-11-27**:
- **Handle:** `@info_techgroww.co.in`
- **Display Name:** `TECH GROWW`
- **Bio:** `Tech Groww Digital Solutions for Modern Businesses Web • Salesforce • Software • UI/UX Consulting & Digital...`
- **Activity:** 12 followers, 31 following, 11+ published posts/reels.

---

## 4. Audit Verdict

The gap between `techgroww.co.in` and Tech Groww's actual LinkedIn/Instagram identity is the single biggest threat to corporate credibility. The new website must **start completely clean from zero**, eliminate every fabricated hub/metric, align 100% with verified capabilities and authentic early-stage honesty, and turn the platform into an extensible CMS + 5-portal operational hub.

---

## 5. Standard Planning Metadata

- **Purpose & Scope:** Establish an evidence-based audit of `https://techgroww.co.in/`, `https://www.linkedin.com/company/tech-growww`, and `https://www.instagram.com/info_techgroww.co.in/` prior to system design.
- **Dependencies:** `PROJECT_OVERVIEW.md` (Doc 01), `COMPANY_INFORMATION_VERIFICATION.md` (Doc 03).
- **Decisions:** Treat LinkedIn & official brand assets (`techgroww_logo.svg`) as higher-authority truth than legacy Hostinger PHP copy (note: phone `+91 98143 90048` on legacy `techgroww.co.in` is omitted on public LinkedIn overview and flagged in `21` `C-02`); replace Hostinger PHP site entirely rather than patching it.
- **Assumptions:** Legacy Hostinger site stays untouched in read-only operation until new platform passes UAT and DNS cutover.
- **Outstanding Confirmations:** Legal entity name, canonical company phone/WhatsApp (`C-02`), office hours, AI/Automation status, and real client case study permissions (`21_PRELAUNCH_VERIFICATION_CHECKLIST.md`).
- **Acceptance Criteria:** Every legacy inconsistency identified here is either corrected in verified config or tracked in `COMPANY_INFORMATION_VERIFICATION.md` (Doc 03).
- **Cross-References:** `COMPANY_INFORMATION_VERIFICATION.md` (Doc 03), `BRAND_STRATEGY.md` (Doc 05), `21_PRELAUNCH_VERIFICATION_CHECKLIST.md`.
