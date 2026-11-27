# 23 — ARCHITECTURE DECISION RECORDS (ADR LOG)

**Date:** 2026-11-27  
**Platform:** Tech Groww Corporate Website & Five-Portal Operations Platform  
**Status Baseline:** Planning & Architecture Specification (`DEMO` Mode — Implementation Deferred)

---

## ADR-001 — Greenfield Platform Replacement Over Legacy Hostinger PHP
- **Context:** Live `techgroww.co.in` runs monolithic Core PHP 8+ / MySQL templates on shared Hostinger Apache with zero CMS, unverified multi-city hubs/metrics, generic purple-violet styling, public `/admin/login.php` exposure, and zero RBAC or tenant isolation.
- **Decision:** Build completely from scratch in TypeScript (`Next.js 16.x App Router`) with zero reuse of legacy PHP files, CSS rules, SQL schemas, or demo portfolio data (`PROJECT_OVERVIEW.md`, `14_TECH_STACK_AND_HOSTING_DECISION.md`).
- **Consequences:** Enables unified SSR/ISR SEO, typed end-to-end validation, and multi-tenant RLS across 5 portals; requires staged Hostinger DNS cutover preserving Google Workspace `MX` (`17_DEVOPS_ENVIRONMENT_AND_DEPLOYMENT_BLUEPRINT.md`).
- **Rejected Alternative:** Refactoring/patching existing PHP templates (insufficient DX, session/RLS safety, and reactive UI scalability across 5 portals).

## ADR-002 — Unified Next.js Codebase Hosting All Five Portals in Initial Scope
- **Context:** Platform requires Public CMS plus 5 distinct operational portals (`Admin CMS`, `Client`, `Intern`, `Recruitment`, `Sales Team`) all within the initial product scope.
- **Decision:** Serve public routes and all 5 portals inside one modular Next.js App Router repository (`techgroww01/official-website-working`) protected by `proxy.ts`, shared Zod validation, server `requirePermission()`, and `X-Robots-Tag: noindex, nofollow`.
- **Consequences:** Single deployment artifact, unified auth session, zero schema drift, and shared UI primitives; requires strict boundary hygiene so public bundles never import portal modules (`14`, `16`).
- **Rejected Alternative:** Five separate apps or a NestJS + decoupled React SPA split (unnecessary DevOps/CI duplication for a lean engineering team).

## ADR-003 — Vercel Pro + Supabase Pro + Upstash Redis + Resend (vs Hobby / Self-Managed VPS)
- **Context:** Vercel Hobby strictly forbids commercial business websites and restricts Cron to 2 daily jobs; Supabase Free pauses after 7 days of inactivity; Vercel serverless isolates lack shared in-memory state for rate limiting.
- **Decision:** Standardize Production + PR Preview Staging on **Vercel Pro (`$20/seat/mo`)** + **Supabase Pro (`$25/mo`, `RPO <= 24h` daily DB backups; optional `+$100/mo` PITR add-on)** + **Upstash Redis (`$0` free tier)** + **Resend (`$0` launch -> `$20/mo` Pro)** + encrypted off-site Storage snapshot job (`14_TECH_STACK_AND_HOSTING_DECISION.md`). Retain **Hostinger KVM 2 VPS + Neon + Auth.js + R2** solely as an explicit cost-consolidated fallback.
- **Consequences:** Eliminates non-commercial license violations, 7-day DB sleep outages, and distributed rate-limiter bypasses while providing instant atomic build rollbacks.

## ADR-004 — Mail Separation: Google Workspace Root `@` vs Resend Subdomain `send.techgroww.co.in`
- **Context:** Tech Groww uses `@techgroww.co.in` mailboxes (`contact@`, `sales@`, `hr@`) for human communication; automated broadcasts and alerts must never overwrite root `MX` or pollute root domain sender reputation.
- **Decision:** Keep `@` `MX` and `@` SPF (`include:_spf.google.com`) exclusively on Google Workspace. Verify **`send.techgroww.co.in`** in Resend with dedicated Amazon SES `MX`/`TXT`/`DKIM`. Send all automated emails with `From: ...@send.techgroww.co.in` and `Reply-To: ...@techgroww.co.in` (`15_EMAIL_AND_GOOGLE_WORKSPACE_INTEGRATION.md`). Reserve `80–100` daily transactional quota strictly for `Critical` auth/invite/security emails.
- **Consequences:** Prevents HTTP `403` Resend domain rejections, keeps human replies landing in Gmail, and protects critical auth delivery during recruitment spikes.

## ADR-005 — Canonical Entity Deduplication & Non-Circular Relational Modeling
- **Context:** Unnormalized initial portal concepts overlapped across `clients` vs `organizations`, `portfolio` vs `client_projects`, `enquiries` vs `leads`, and `job_applications` vs `internships`.
- **Decision:** Standardize canonical `organizations` (`org_type`), separate public `portfolio_items` (`project_type` + `is_client_approved` DB `CHECK`) from confidential `client_projects`, unify `job_postings` & `applications` (`posting_kind`/`application_kind`), enforce composite FKs `(project_id, organization_id)` on `support_tickets`/`billing_records`, and remove circular `opportunities.converted_project_id` (`12_DATABASE_ARCHITECTURE_AND_ERD.md`).
- **Consequences:** Zero orphaned data models, impossible cross-tenant FK mismatches, and clean linear SQL migrations (`001`–`009`).

## ADR-006 — PostgreSQL `SECURITY DEFINER` RPCs for Multi-Write Transactions & Public Intake
- **Context:** `supabase-js` PostgREST cannot wrap multi-table HTTP mutations in a client transaction, and calling `SUPABASE_SERVICE_ROLE_KEY` directly in public route handlers widens blast radius.
- **Decision:** Encapsulate multi-step public/internal mutations (`create_enquiry_with_lead`, `create_application`, `convert_opportunity_to_project`) inside parameterized PostgreSQL `SECURITY DEFINER` (`SET search_path = public`) functions paired with `Idempotency-Key` records (`12`, `13`, `16`).
- **Consequences:** Guarantees ACID atomicity without introducing full ORM/pooler complexity into stateless route handlers.

## ADR-007 — 20-Role Deny-by-Default RBAC with Live `users.status` & RLS Enforcement
- **Context:** Stateless JWTs (`15m–60m`) allow suspended or demoted accounts to continue calling endpoints unless DB status is checked synchronously.
- **Decision:** Govern 20 canonical roles across 3 account classes (`staff`, `client`, `intern`/`candidate`) via three synchronized gates: `proxy.ts` route/noindex guard, server-side `requirePermission()` querying live `users.status = 'active'` + `session_version` + `user_roles`/`organization_members.org_role`, and non-recursive `SECURITY DEFINER` PostgreSQL RLS helpers (`11`, `16`). Require `aal2` TOTP MFA for the 6 privileged staff roles, block OAuth auto-provisioning via Supabase `Before User Created` hook, and inject `session_version` via Custom Access Token Hook (`15`).
- **Consequences:** User suspension or role revocation takes effect immediately (`< 1s`), and cross-tenant probes fail closed (`404`/`401`).

## ADR-008 — Brand-Anchored Dual-Surface Design System, Pure-Vector Logo & WCAG 2.2 AA Contrast
- **Context:** Legacy templates used generic violet glows, while master `techgroww_logo.svg` wrapped an opaque-navy JPEG (`/9j/4AAQ`) inside a PNG data URI (`50,753 bytes`). Unadjusted `#0284C7` cobalt also fails WCAG 4.5:1 on light stone `#F5F2EB`.
- **Decision:** Require faithful **pure-vector SVG tracing** of `techgroww_logo.svg` for dark, light, portal `#FFFFFF`, and monochrome lockups (`BRAND_STRATEGY.md` Doc 05). Use **Direction A** (`#070D19` ink + `#F5F2EB` warm stone + `#0369A1` links + `#1D4ED8` royal CTAs) on public pages and **Direction C** (`#F7F7F5` + `#FFFFFF`) on all 5 portals, omitting blocking preloaders on Hero LCP and enforcing WCAG 2.2 SCs `2.4.11`, `2.5.7`, `2.5.8`, `3.3.8` (`08`, `18`).

## ADR-009 — Server-Safe PDF, Plain Markdown XSS Prevention & Hardened Direct Uploads
- **Context:** Heavy headless Chromium (`Puppeteer`) breaks 250 MB serverless bundle limits for intern certificates; runtime MDX JSX evaluation introduces XSS/code-injection surfaces; uploaded SVGs and `.docx` archives carry stored XSS/macro risks.
- **Decision:** Generate intern certificates via `@react-pdf/renderer` / `pdf-lib` (`14`); restrict CMS blog/broadcast content to sanitized plain Markdown (`remark` + `rehype-sanitize`, zero raw client `previewHtml` or MDX eval); enforce server-generated UUID signed upload intents, `.svg` upload ban, magic-byte + `.docx` ZIP/XML checks, and EXIF stripping (`13`, `16`).

## ADR-010 — DPDP Act 2023 Retention Cascade with PII-Free Immutable `audit_logs`
- **Context:** Storing raw candidate names/emails inside append-only `audit_logs` creates a direct legal contradiction when 180-day DPDP retention or candidate right-to-erasure runs.
- **Decision:** Store strictly `changed_fields` + redacted/hashed diffs inside immutable `audit_logs` (retained 365 days), require explicit `privacy_consented_at` & optional `talent_pool_consent`, and execute synchronous cascading erasure across `applications`, Storage binaries, `email_events`, `newsletter_subscribers`, and Resend Audiences (`12`, `16`).
