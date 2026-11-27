# 15 — RESEND EMAIL & GOOGLE WORKSPACE INTEGRATION PLAN

**Date:** 2026-11-27  
**Mode:** `DEMO` Architecture Blueprint (Zero live external accounts accessed or altered during planning).

---

## 1. Purpose & Scope

Defines the dual-provider email and productivity architecture connecting **Google Workspace** (human corporate inboxes, Google OAuth staff sign-in, optional Calendar/Sheets hooks) with **Resend** (automated transactional emails, newsletter/campaign broadcasts, webhook suppression handling) without breaking existing domain mail routing.

**Dependencies:** `COMPANY_INFORMATION_VERIFICATION.md` (Doc 03), `10_FIVE_PORTAL_PRODUCT_REQUIREMENTS.md`, `13_API_AND_INTEGRATION_CONTRACTS.md`, `14_TECH_STACK_AND_HOSTING_DECISION.md`.

---

## 2. Mail Routing Separation (Critical DNS Rule)

- **Google Workspace** owns **incoming human email (`MX` records)** for `@techgroww.co.in` (`contact@`, `sales@`, `hr@`). **NEVER point root `MX` records to Resend** — doing so would break human Gmail delivery.
- **Resend** sends **automated outbound email** strictly from dedicated subdomain **`send.techgroww.co.in`** with isolated SPF/DKIM/DMARC alignment so automated sends never risk primary domain inbox reputation or trigger HTTP `403` unverified-domain errors.

### 2.1 DNS Configuration Checklist (For Launch Owner)
1. **MX Records (`@`):** Keep pointing exclusively to Google Workspace (`SMTP.GOOGLE.COM`).
2. **Root SPF Record (`@`):** Keep **strictly** Google Workspace (`v=spf1 include:_spf.google.com ~all`) — **do NOT** add Amazon SES/Resend to root `@` if sending from `send.techgroww.co.in`. Verify no duplicate SPF TXT records exist.
3. **Resend Subdomain Records (`send.techgroww.co.in`):** Add Resend's exact Amazon SES return-path **`MX` (`feedback-smtp.<region>.amazonses.com`)**, **`TXT` SPF (`v=spf1 include:amazonses.com ~all`)**, and **`TXT` DKIM (`resend._domainkey.send`)** strictly on the `send` subdomain.
4. **Google DKIM & Root DMARC (`_dmarc`):** Enable Google Workspace DKIM (`google._domainkey`) and configure `_dmarc` (`v=DMARC1; p=none; rua=mailto:contact@techgroww.co.in`), tightening to `p=quarantine` -> `p=reject` after 14 days of clean alignment.

---

## 3. Resend Architecture: Transactional vs Broadcasts

### 3.1 Transactional Track (3,000/mo · Hard 100/day Free Cap)
*Rule: Because `send.techgroww.co.in` is the verified Resend sending domain, **every** `From` header uses `@send.techgroww.co.in`, paired with `Reply-To: <official>@techgroww.co.in` so human replies deliver straight to Google Workspace.*

| Trigger Event | Recipient | `From` Header (`@send.techgroww.co.in`) | `Reply-To` Header | Priority Tier |
|---|---|---|---|---|
| Auth reset / Staff, Client & Intern Invites | Target User | `Tech Groww <noreply@send.techgroww.co.in>` | `contact@techgroww.co.in` | **Critical (Reserved)** |
| Emergency Admin / Security suspension alert | `super_admin` | `Tech Groww Security <security@send.techgroww.co.in>` | `contact@techgroww.co.in` | **Critical (Reserved)** |
| Public `/contact` inquiry submitted | `sales@techgroww.co.in` + Visitor Ack | `Tech Groww <contact@send.techgroww.co.in>` | Visitor email (internal) / `sales@techgroww.co.in` (ack) | **High** |
| Career / Internship Application submitted | `hr@techgroww.co.in` + Candidate Ack | `Tech Groww Careers <hr@send.techgroww.co.in>` | `hr@techgroww.co.in` | **High** |
| Recruitment Interview scheduled / Offer issued | Candidate + Interviewer | `Tech Groww Careers <hr@send.techgroww.co.in>` | `hr@techgroww.co.in` | **High** |
| Client Milestone ready / Ticket created | Client Admin / Ops Manager | `Tech Groww Delivery <noreply@send.techgroww.co.in>` | `contact@techgroww.co.in` | **Medium** |
| Intern Task feedback / Certificate issued | Intern | `Tech Groww Internships <hr@send.techgroww.co.in>` | `hr@techgroww.co.in` | **Medium** |

### 3.2 Broadcast & Audience Track (1,000 Contacts Free — Separate Quota!) & Suppression Rules
- **Quota Separation Rule:** Resend Marketing Broadcasts (`1,000` free contacts, unlimited sends to subscribers) do **NOT** share the `100/day` Transactional API cap.
- **Transactional Quota Safeguard (`80/100` & `90/100` Reserve):** Application queries `email_events` (`email_kind = 'transactional'`) for current UTC day. Once daily transactional count reaches **`80/100`**, `Medium` operational alerts defer automatically (`status = 'deferred_quota'`); once daily count reaches **`90/100`**, **`High`** triggers (external contact/application notifications) digest/defer while keeping user DB writes untouched, reserving the final `10/100` sends **strictly for `Critical`** triggers (password resets, invites, MFA/security alerts). Queued items flush via `/api/v1/cron/resend-retry` after `00:00 UTC`, and Admin dashboard prompts upgrading to **Resend Pro (`$20/mo`, `50k/mo`, no daily cap)**.
- **Consent & Mandatory RFC 8058 Unsubscribe:** Explicit consent stored in `newsletter_subscribers`. Every broadcast enforces `List-Unsubscribe` one-click POST + web link (`/api/v1/public/newsletter/unsubscribe?token=...` — zero Turnstile friction!).
- **Suppression, Bounces & Bidirectional Sync:** Every outbound email checks canonical `email_suppressions` before sending. Resend webhook (`POST /api/v1/webhooks/resend`) processes `email.bounced`, `email.complained`, and **`contact.updated`** (Resend Audience unsubscribes), syncing back to `newsletter_subscribers` and `email_suppressions`. Transient `5xx` errors retry via exponential backoff (`retry_count <= 3`).

---

## 4. Google Workspace Integration Architecture

### 4.1 Verified Official Inbox & Alias Map
*(Strictly uses official company mailboxes; zero personal developer emails.)*
- Primary Inboxes / Aliases (observed in LinkedIn posts; confirm active mailboxes in `21` `C-03`):
  - `contact@techgroww.co.in` — General inquiries & official website fallback
  - `sales@techgroww.co.in` — Sales Team Portal notifications & sales applications
  - `hr@techgroww.co.in` — Recruitment & Intern Portal notifications
- `[COMPANY CONFIRMATION REQUIRED: Confirm whether Google Workspace is currently active on techgroww.co.in and which official mailbox serves as initial Super Admin — C-03]`

### 4.2 Google OAuth vs Enterprise SAML SSO (Strict Anti-Auto-Provisioning)
- **Launch Architecture (Recommended):** Use **Google OAuth 2.0 via Supabase Auth** for Staff login (`/login -> Continue with Google Workspace`).
  - **Pre-Provisioning Defense & Claim Sync:** Because Supabase exchanges OAuth codes before app callbacks execute, configure BOTH a **Supabase Auth `Before User Created` Postgres Hook** (enforcing `hd = 'techgroww.co.in'` AND active matching row in `users` or valid `invitations`) AND a **Supabase Custom Access Token Hook** (`auth_hook_custom_claims`, embedding live `users.session_version` in JWTs for instant revocation enforcement). As defense-in-depth, `/auth/callback` verifies `email_verified === true && hd === 'techgroww.co.in'` and an active `users` row; any unauthorized OAuth login immediately calls `supabaseAdmin.auth.admin.deleteUser(user.id)` + `signOut()`.
  - **Distinction from Enterprise SAML SSO:** Standard Google OAuth authenticates identity cleanly without SAML IdP XML assertions; Google Workspace Business Starter supports custom SAML apps if centralized enterprise IdP session control is required later.

### 4.3 Optional Workspace Extensions (Non-Blocking & Serverless-Light)
- **Google Sheets Lead Mirror (Optional):** Uses minimal `jose` JWT signing + native `fetch` against Google Sheets REST v4 API (`~40 MB` smaller bundle than `googleapis`) when `GOOGLE_SHEETS_LEADS_ID` + `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` are set. `Supabase PostgreSQL` always remains the single source of truth; sheet failure never blocks `/contact`.
- **Google Calendar Consultation Links (Optional):** Embed verified scheduling link on `/contact` success state & `/recruitment/interviews`.
- **Google Drive:** **Not required at launch** (resumes & client files live securely in private Supabase Storage with RLS & signed URLs).

---

## 5. Email & Workspace Environment Variables (Reference)

*(Canonical full manifest in `17_DEVOPS_ENVIRONMENT_AND_DEPLOYMENT_BLUEPRINT.md`)*
- `RESEND_API_KEY` (Server secret)
- `RESEND_FROM_EMAIL` (`Tech Groww <noreply@send.techgroww.co.in>`)
- `RESEND_AUDIENCE_ID` (Server config)
- `RESEND_WEBHOOK_SECRET` (Server secret)
- Google OAuth Client ID/Secret (`techgroww.co.in` Workforce Web OAuth): stored directly inside **Supabase Auth Dashboard -> Providers -> Google** (never shipped in client bundles; not required in Vercel env unless calling Google APIs directly as a user).
- `GOOGLE_WORKSPACE_ALLOWED_DOMAIN` (`techgroww.co.in`)
- `GOOGLE_SHEETS_LEADS_ID` & `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` (Optional server secrets)

---

## 6. Acceptance Criteria & Cross-References

- Resend free-tier limits (`3,000/mo`, `100/day`, `1,000` contacts) explicitly guarded in code design.
- Zero risk of breaking corporate Gmail MX during DNS setup.
- Workspace integrations cleanly decoupled so core portals never crash if optional Sheets/Calendar keys are absent.
- **Cross-References:** `13_API_AND_INTEGRATION_CONTRACTS.md`, `14_TECH_STACK_AND_HOSTING_DECISION.md`, `17_DEVOPS_ENVIRONMENT_AND_DEPLOYMENT_BLUEPRINT.md`.
