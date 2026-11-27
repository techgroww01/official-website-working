# 17 — DEVOPS, ENVIRONMENT & DEPLOYMENT BLUEPRINT

**Date:** 2026-11-27  
**Target Repository:** `https://github.com/techgroww01/official-website-working.git`  
**Hosting Strategy:** **Vercel Pro** (App) + **Supabase Pro** (DB/Auth/Storage) + **Resend** (Email) + **Google Workspace** (Mail/OAuth)

---

## 1. Purpose & Scope

Provides the complete environment variable manifest (`.env.example` specification), local-to-production Git workflow, preview/staging/production isolation, database migration discipline, backup/recovery drills, and Hostinger-to-Vercel DNS cutover plan.

**Dependencies:** `14_TECH_STACK_AND_HOSTING_DECISION.md`, `15_EMAIL_AND_GOOGLE_WORKSPACE_INTEGRATION.md`, `16_SECURITY_PRIVACY_AND_THREAT_MODEL.md`.

---

## 2. Environment Variable Manifest (`.env.example` Specification)

*Rule: Zero actual secrets may ever be stored in documentation or `.env.example`. All server secrets live exclusively in Vercel Environment Variables (scoped per `Preview` vs `Production`) and local untracked `.env.local`.*

| Variable Name | Scope | Required? | Purpose & Ownership |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Public** | Yes | Canonical base URL (`http://localhost:3000`, preview URL, or `https://techgroww.co.in`). |
| `NEXT_PUBLIC_APP_URL` | **Public** | Yes | Portal callback base URL (matches `NEXT_PUBLIC_SITE_URL`). |
| `NEXT_PUBLIC_SUPABASE_URL` | **Public** | Yes | Supabase project HTTPS URL (Staging project for Preview, Prod project for Production). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Public** | Yes | Supabase public anon key (safe ONLY when 100% RLS is active on all tables). |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server Secret** | Yes | Elevated DB/Storage key used strictly in verified webhooks, cron purges, and atomic public intake. |
| `DATABASE_URL` | **Server Secret** | Optional | Pooled Postgres connection string (if direct SQL/migration tooling used). |
| `DIRECT_URL` | **Server Secret** | Optional | Direct Postgres connection string for `supabase db push` / migrations. |
| `AUTH_SECRET` | **Server Secret** | Yes | 32-byte random secret for signed invite/unsubscribe/preview HMAC tokens. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | **Public** | Launch Req | Cloudflare Turnstile public widget key for `/contact`, `/careers`, `/newsletter`. |
| `TURNSTILE_SECRET_KEY` | **Server Secret** | Launch Req | Server-side verification secret for Turnstile tokens. |
| `GOOGLE_CLIENT_ID` | **Server / Supabase** | Recommended | Google Workspace OAuth Client ID (configured in Supabase Auth provider). |
| `GOOGLE_CLIENT_SECRET` | **Server Secret** | Recommended | Google Workspace OAuth Client Secret. |
| `GOOGLE_WORKSPACE_ALLOWED_DOMAIN` | **Server Config** | Recommended | Locked to `techgroww.co.in` for staff OAuth restriction. |
| `GOOGLE_SHEETS_LEADS_ID` | **Server Config** | Optional | Target Spreadsheet ID for non-blocking Sales lead backup mirror. |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | **Server Secret** | Optional | Service account credentials JSON (base64 or stringified) for Sheets API. |
| `RESEND_API_KEY` | **Server Secret** | Yes | Resend transactional & broadcast API key. |
| `RESEND_FROM_EMAIL` | **Server Config** | Yes | Verified sender e.g. `Tech Groww <contact@send.techgroww.co.in>`. |
| `RESEND_AUDIENCE_ID` | **Server Config** | Yes | Resend Audience ID for newsletter & broadcast sync. |
| `RESEND_WEBHOOK_SECRET` | **Server Secret** | Yes | Svix HMAC secret verifying `POST /api/v1/webhooks/resend`. |
| `STORAGE_MEDIA_BUCKET` | **Server/Public Config** | Yes | Public CMS media bucket name (e.g. `public-media`). |
| `STORAGE_PRIVATE_BUCKET` | **Server Config** | Yes | Private bucket name for resumes, client files, intern submissions (`private-vault`). |
| `CRON_SECRET` | **Server Secret** | Yes | Bearer secret authenticating Vercel Cron requests (`/api/v1/cron/*`). |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | **Public** | Optional | GA4 ID (`G-XXXX`), rendered ONLY after explicit cookie consent. |
| `SENTRY_DSN` | **Server / Public** | Recommended | Error tracking & alerting DSN. |
| `NEXT_PUBLIC_DEMO_MODE` | **Public Flag** | Dev Only | Must remain **unset / `false`** in Staging & Production (no demo passwords exposed!). |

---

## 3. Environment Separation & Git Workflow

| Environment | Git Branch | Vercel Target | Supabase Project | Resend Mode |
|---|---|---|---|---|
| **Local** | `feature/*` | `localhost:3000` | Local Supabase CLI or Dev project | Test / Console log or Sandbox |
| **Staging / Preview** | Pull Requests -> `develop` or PR preview | `*.vercel.app` (`noindex` enforced!) | Dedicated Staging Supabase | Test domain / restricted test addresses |
| **Production** | `main` (protected) | `https://techgroww.co.in` | **Supabase Pro** (daily backup + PITR) | Verified `send.techgroww.co.in` |

*Protection Rule:* Preview deployments automatically inject `X-Robots-Tag: noindex, nofollow` so Google never indexes staging URLs.

---

## 4. Database Migration, Backup & Rollback Protocol

1. **Migrations:** All schema changes live in versioned `supabase/migrations/*.sql`. Apply and verify on Staging Supabase before merging PR to `main`. Never edit production schema manually in GUI.
2. **Pre-Migration Backup:** Trigger manual snapshot before any destructive or `ALTER TABLE` release migration.
3. **Application Rollback:** Vercel keeps immutable previous builds — instant 1-click rollback in `< 30 seconds` if production health check fails.
4. **Legacy Hostinger Cutover Plan:**
   - Deploy & pass full UAT on `*.vercel.app` first.
   - Verify Google Workspace `MX` records stay untouched; update **only** `@` A record and `www` CNAME to Vercel targets.
   - Keep Hostinger legacy PHP files intact (offline fallback) for `7–14 days` post-cutover, rotate legacy `admin_users` credentials, then decommission Hostinger web hosting cleanly.

---

## 5. Acceptance Criteria & Cross-References

- Every environment variable classified (`Public`, `Server Secret`, `Optional`, `Dev Only`).
- Zero possibility of staging leakage into Google index or accidental MX breakage during DNS cutover.
- **Cross-References:** `14_TECH_STACK_AND_HOSTING_DECISION.md`, `15_EMAIL_AND_GOOGLE_WORKSPACE_INTEGRATION.md`, `21_PRELAUNCH_VERIFICATION_CHECKLIST.md`.

