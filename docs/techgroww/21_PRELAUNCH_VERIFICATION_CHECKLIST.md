# 21 — PRE-LAUNCH COMPANY VERIFICATION & CUTOVER CHECKLIST

**Date:** 2026-11-27  
**Purpose:** Single actionable gate list of **every unverified company item, legal dependency, and external account prerequisite** that requires explicit Tech Groww leadership approval before production DNS cutover.

---

## 1. Company Factual & Legal Confirmations (`[COMPANY CONFIRMATION REQUIRED]`)

| # | Item Requiring Confirmation | Current Gap / Conflict | Required Owner Action | Blocking Cutover? |
|---|---|---|---|---|
| **C-01** | **Official Legal Entity Name** | Legacy site uses `Techgroww IT Solutions`; LinkedIn/Instagram say `Tech Groww`; no indexed MCA listing found. | Confirm exact registered entity name (Proprietorship / LLP / Pvt Ltd) for footer, Privacy Policy, Terms & Billing docs. | **YES** |
| **C-02** | **Canonical Phone & WhatsApp** | Site & confirmation use `+91 98143 90048`; legacy social references showed `+91 73008 65717`. | Confirm `+91 98143 90048` is official company number (or provide replacement). | **YES** |
| **C-03** | **Official Email Inboxes & Super Admin** | LinkedIn/site reference `contact@`, `sales@`, `hr@`, `support@`, `careers@` `@techgroww.co.in`. | Confirm active Google Workspace mailboxes/aliases and designate the official `@techgroww.co.in` initial `super_admin` email. | **YES** |
| **C-04** | **Headquarters & Extra Hubs** | LinkedIn says **Greater Noida, UP 203209**; legacy site invented Bengaluru & Mumbai hubs. | Confirm Greater Noida only (and whether full street address or city-only should be published). | **YES** |
| **C-05** | **Official Business Hours** | Legacy site says `Mon – Sat, 9:00 AM – 7:00 PM IST`. | Confirm actual working hours or remove from public footer/contact. | **Medium** |
| **C-06** | **Final Launch Service Scope** | LinkedIn lists Web/Mobile, Salesforce/OmniStudio, UI/UX, Enterprise Software, IT Consulting + SEO. Legacy site also listed AI & RPA. | Confirm whether `AI Solutions` & `Business Automation` remain `draft` in CMS or should be published with verified proof. | **YES** |
| **C-07** | **Team Profiles, Titles & Photos** | LinkedIn lists `Sonia Tiwari`, `Shainki Gautam`, `Archana Bhati` (HR Intern). | Provide written approval, exact titles, short bios, and high-res portraits before enabling `is_public = true`. | **Medium** |
| **C-08** | **Work / Client Case Studies** | Zero approved real client cases verified yet; legacy site used unverified demo metrics. | Approve real client engagements (if any) OR confirm `/work` launches with **Reference Blueprints** clearly labeled as architectures. | **YES** |
| **C-09** | **Intern Attendance Policy** | Required decision for `/intern/attendance`. | Confirm whether Intern Portal launches with attendance check-in enabled (`attendance_enabled = true`) or off. | **Low** |
| **C-10** | **Legal Counsel Sign-Off** | Privacy Policy, Terms, Cookie Notice drafts must comply with India DPDP Act 2023. | Legal review & sign-off on `/privacy`, `/terms`, `/cookies` text. | **YES** |

---

## 2. External Infrastructure & Account Readiness Checklist

| # | Service | Required Action by Tech Groww Owner | Verification Check |
|---|---|---|---|
| **I-01** | **Google Workspace** | Verify domain `techgroww.co.in`, create `contact@`, `sales@`, `hr@` aliases/mailboxes, configure OAuth Consent Screen & Client ID/Secret. | Staff `@techgroww.co.in` test login succeeds on Staging; personal Gmail blocked. |
| **I-02** | **DNS Registrar / Hostinger** | Identify login holder for `techgroww.co.in` DNS zone. Confirm **Google MX records stay untouched** during cutover. | `dig MX techgroww.co.in` resolves to `SMTP.GOOGLE.COM` pre and post cutover. |
| **I-03** | **Resend Account** | Create Resend account, verify dedicated subdomain **`send.techgroww.co.in`** (DKIM + SPF + DMARC), create Audience, copy Webhook signing secret. | Test email lands in Gmail Inbox with `SPF=PASS`, `DKIM=PASS`, `DMARC=PASS`. |
| **I-04** | **Supabase Pro** | Provision Production project (`ap-south-1` Mumbai or `ap-southeast-1` Singapore), enable daily backups + PITR, enable TOTP MFA for admins. | `ALTER TABLE` RLS audit confirms 100% tables protected. |
| **I-05** | **Vercel Pro** | Connect `techgroww01/official-website-working` (`main` -> Prod), populate all server/public env vars, bind `techgroww.co.in` & `www` redirect. | SSL valid, `*.vercel.app` staging `noindex`, Prod `200 OK`. |
| **I-06** | **Cloudflare Turnstile & GA4** | Provision Turnstile site/secret keys + GA4 property + Google Search Console property. | Turnstile blocks automated curl submits; GA4 fires *only* after `Allow analytics` click. |
| **I-07** | **LinkedIn & Instagram Sync** | **Critical:** Update LinkedIn `About -> Website` from the current Google Form link (`docs.google.com/forms/...`) to `https://techgroww.co.in/` on launch day! Update any broken Instagram links. | Live LinkedIn company button opens `https://techgroww.co.in/`. |
| **I-08** | **Legacy Hostinger Security** | Rotate legacy Hostinger MySQL & PHP `/admin/` password, keep read-only fallback 7–14 days, then retire legacy PHP document root. | Old `/admin/login.php` returns `301 -> /login` or `410` after cutover. |

---

## 3. Cross-References

`02 COMPANY_RESEARCH_AND_AUDIT.md`, `03 COMPANY_INFORMATION_VERIFICATION.md`, `15_EMAIL_AND_GOOGLE_WORKSPACE_INTEGRATION.md`, `17_DEVOPS_ENVIRONMENT_AND_DEPLOYMENT_BLUEPRINT.md`.

