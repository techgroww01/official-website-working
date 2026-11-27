# Documentation Changelog — Tech Groww Architecture Suite

**Date:** 2026-11-27  
**Scope:** Revision history across initial audit, 5-portal greenfield specification, Multi-Agent Review Pass 1, and Adversarial Review Pass 2.

---

## v1.2 — Adversarial Review Pass 2 Hardening (`2026-11-27`)
- **API & Security RFC 8058 Compatibility (`13`, `16`, `19`, `20`):** Exempted HMAC-tokenized `POST /api/v1/public/newsletter/unsubscribe` from browser `Origin`/JSON-only CSRF checks so mail-client `application/x-www-form-urlencoded` (`List-Unsubscribe=One-Click`) succeeds cleanly.
- **Vercel Cron & Ops Completeness (`12`, `13`, `14`, `17`, `20`):** Switched all `/api/v1/cron/*` endpoints to `GET` (adding daily `/cron/storage-backup`), added `/api/v1/health`, `/ops/projects`, `/ops/milestones`, `/ops/deliverables`, restricted `DELETE /ops/billing/[id]` strictly to `billing:delete` (`admin`/`super_admin`), documented all 13 FK checks on media delete, added `/admin/pages/[id]/preview-token`, `/admin/media` list/patch, `/admin/subscribers`, split `/admin/navigation` & `.../redirects` from `/admin/settings`, moved resume commit verification cleanly inside `POST /api/v1/public/applications`, added missing CRUD verbs across Sales/Recruitment/Intern, and placed `contact_enquiries` & comms explicitly inside migration `003_cms_and_comms.sql` before `004_sales_leads.sql`.
- **Auth & DPDP Refinements (`11`, `12`, `15`, `16`, `23`):** Specified Supabase Custom Access Token Hook (`auth_hook_custom_claims`) for JWT `session_version` claim parity with live `users.status` RLS/RBAC checks; specified PII stripping on `email_events.payload` & `webhook_events.payload` plus `email_events.recipient_email` masking during both `/erase` and 180-day `retention-purge`; clarified `90/100` High-tier vs `80/100` Medium-tier Resend quota reservation.
- **Design, Accessibility & Fact-Checking (`01`, `07`, `08`, `09`, `18`, `20`, `21`):** Restricted `--focus-dark` (`#38BDF8`) strictly to dark `--ink`/`--ink-elevated` surfaces while keeping `--focus-light` (`#1D4ED8`) on light-canvas buttons (`>= 5.99:1` WCAG 1.4.11 pass); synchronized `16`–`21` cleanly on disk (`C-01`–`C-13`, WCAG 2.2 SCs `2.4.11`/`2.5.7`/`2.5.8`/`3.3.8`, `Organization` schema, non-blocking hero reveal, 20-role parity, redirect ordering before `/admin/*` auth in `proxy.ts`).

## v1.1 — Multi-Agent Review Pass 1 Resolutions (`2026-11-27`)
- Upgraded WCAG 2.2 AA contrast tokens (`--brand-link` `#0369A1`, `--status-warn` `#92400E`, `--line-control` `#6E7785`, `--text-muted-dark` `#94A3B8`), standardized 5 delivery stages (`01 Understand`–`05 Support`), eliminated blocking hero preloader curtain, documented exact `50,753-byte` JPEG-in-SVG finding in `BRAND_STRATEGY.md`.
- Eliminated schema forward FKs & circular `opportunities` <-> `client_projects` FK; added 6 missing domain tables (`contacts`, `broadcast_campaigns`, `ticket_comments`, `cohort_announcements`, `email_suppressions`, `idempotency_keys`) and composite FKs `(project_id, organization_id)`.
- Fixed `GET /api/v1/client/projects/[id]` billing RBAC leak, aligned all 20 roles across `10`/`11`/`19`/`20`, pinned Next.js 16 + Upstash Redis + `@react-pdf/renderer`, corrected Resend `send.techgroww.co.in` SPF/DKIM/DMARC & `@send.techgroww.co.in` `From` headers, reconciled Supabase Pro `$25/mo` daily backup vs optional `+$100/mo` PITR, and expanded DPDP legal disclosures & gated `C-02` phone verification.

## v1.0 — Initial Greenfield Research, Brand Strategy & Full Platform Docs (`01`–`21`) (`2026-11-27`)
- Audited live `https://techgroww.co.in/`, `u:\techgroww web final`, LinkedIn (`company/tech-growww`), Instagram (`@info_techgroww.co.in`), `C:\Users\MSI\Downloads\techgroww_logo.svg`, 5 creative benchmarks, and peer competitors.
- Expanded scope from CMS-only draft assumptions to full initial-scope architecture covering Public Website + all 5 Portals (`Admin CMS`, `Client`, `Intern`, `Recruitment`, `Sales Team`), authoring `08`–`21` and updating `01`–`07`.
