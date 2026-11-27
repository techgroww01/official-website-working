# 14 — TECH STACK & HOSTING ARCHITECTURE EVALUATION

**Date:** 2026-11-27  
**Verification Basis:** Current official pricing/documentation verified via live web search on `2026-11-27` (`vercel.com`, `supabase.com`, `neon.com`, `resend.com`, `hostinger.com`, `workspace.google.com`).

---

## 1. Purpose & Scope

Evaluates frontend, backend, database, auth, storage, hosting, email, and workspace options across cost, free-tier realities, scalability, security, operational simplicity, and deployment compatibility for `https://github.com/techgroww01/official-website-working.git` — concluding with **one primary recommended architecture** and **one contingency alternative**.

**Dependencies:** `PROJECT_OVERVIEW.md` (Doc 01), `10_FIVE_PORTAL_PRODUCT_REQUIREMENTS.md`, `12_DATABASE_ARCHITECTURE_AND_ERD.md`.

---

## 2. Candidate Evaluation Matrices

### 2.1 Application Framework & Styling
- **Selected Frontend/Full-Stack:** **Next.js 16.x (App Router with `proxy.ts` edge boundary) + React 19 + TypeScript + Tailwind CSS v4 + selective `motion/react`**.
- **Document & Lightweight Integration Libraries (Serverless-Safe):**
  - **Intern Certificate PDFs:** Pure-JS **`@react-pdf/renderer`** or **`pdf-lib`** (zero Chromium/Puppeteer bloat inside Vercel Serverless 250 MB function limit).
  - **Markdown Rendering:** Plain Markdown parser (`marked`/`remark` + `rehype-sanitize`, **never evaluating JSX/MDX components from CMS database strings**).
  - **Optional Google Sheets Mirror:** Lightweight JWT signer (`jose`) + native `fetch` to Sheets REST API (`~40 MB` leaner than full `googleapis` SDK).
- **Why it fits Tech Groww:**
  - Single cohesive TypeScript codebase serves **SSR/ISR public SEO pages** alongside **5 authenticated dynamic portals** (`/admin`, `/client`, `/intern`, `/recruitment`, `/sales`) with shared Zod schemas and server-side RBAC.
  - Zero separate SPA/API repo split overhead for a small engineering team.
  - Tailwind CSS v4 + CSS custom properties cleanly enforces the dual-surface token system (`08_DESIGN_SYSTEM_AND_UI_SPECIFICATION.md`).
- **Rejected:** Rebuilding on legacy Hostinger PHP 8+ (weak reactive UI DX for 5 portals, no native RSC/ISR), or splitting into NestJS + separate React SPA (unnecessary operational complexity at launch).

### 2.2 Database, Auth & Storage Comparison (Verified `2026-11-27`)

| Dimension | **Supabase (Managed PostgreSQL + Auth + Storage)** | **Neon (Serverless PostgreSQL) + Custom Auth + Cloudflare R2** |
|---|---|---|
| **Free Tier Limits** | `500 MB` DB, `50,000` MAUs, `1 GB` file storage, `5 GB` egress, max 2 projects. **Pauses after 7 days inactivity.** | `100 CU-hours/mo`, `1 GB` DB storage, scales to zero after 5 min idle (cold starts). Postgres only — **no built-in auth or storage**. |
| **Production Tier Cost** | **Pro: `$25/mo`** (`8 GB` DB, `100 GB` Storage, `250 GB` egress, `100k` MAUs, daily backups, no auto-pause). | **Launch: Usage-based** (`$0.106/CU-hr` + `$0.35/GB-mo`), plus separate cost/setup for Auth (Auth.js/Clerk) + S3/R2 storage. |
| **Native Security** | Built-in **PostgreSQL RLS**, JWT session cookies via `@supabase/ssr`, Google OAuth, TOTP MFA, signed storage URLs out-of-the-box. | Requires manually wiring session tables, OAuth callbacks, TOTP MFA, and S3/R2 presigned upload security. |
| **Maintenance Burden** | **Low** — unified dashboard & SDK for DB, Auth, RLS, Storage, Realtime. | **Medium–High** — 3 separate services & billing/secret surfaces to glue and maintain. |
| **Vendor Lock-In** | Standard PostgreSQL (`pg_dump` portable); Auth/Storage interfaces easily abstracted behind repository layer. | Standard PostgreSQL; minimal DB lock-in, higher integration glue code. |

### 2.3 Application Hosting, Distributed Cache & Rate-Limiter Comparison (Verified `2026-11-27`)

| Dimension | **Vercel Pro + Upstash Redis** | **Hostinger (Shared/Managed Node vs KVM VPS)** |
|---|---|---|
| **Free / Entry Rules** | **Vercel Hobby (`$0`) is STRICTLY NON-COMMERCIAL and limits Cron to 2 daily jobs — excluded from company/PR-preview workflows.** | Shared Node (`~$3.49/mo` / `₹199/mo` intro) lacks native Next.js edge/ISR parity; **KVM 2 VPS (`~$8.79/mo` / `₹799/mo` intro, renews `₹1,199/mo`)** runs Node/Docker. |
| **Production Cost** | **Vercel Pro: `$20/mo` per active git author seat** (includes `$20` usage credit; unlimited free viewer seats; **100 Cron jobs**, up to 1-min intervals) + **Upstash Redis Free (`$0` / 10k cmds/day, then `$0.20/100k`)**. | Low fixed monthly VPS cost (`₹799–₹1,199/mo`), predictable billing. |
| **Deployment & DX** | Native Next.js 16 (`proxy.ts`), instant GitHub PR preview URLs, automatic edge CDN, zero-downtime atomic rollbacks, Upstash Edge rate limiting & redirect cache sync. | Manual Docker/PM2 + Nginx reverse proxy + SSL + CI/CD pipeline setup, manual rollback & OS security patching. |
| **Scalability & Ops** | Zero-ops global CDN + automatic scaling; ideal for 1–3 engineer team. | Self-managed single-node failure domain unless load-balanced manually. |

### 2.4 Email & Workspace Services (Verified `2026-11-27`)
- **Resend:**
  - *Transactional Free:* `3,000 emails/month`, hard **`100 emails/day`** UTC limit, `3` domains, `30-day` retention, pauses without overage if exceeded. *Pro:* `$20/mo` (`50,000/mo`, removes daily cap).
  - *Marketing / Broadcasts Free:* Free up to **`1,000` contacts** with unlimited sends to those contacts (Pro starts at `$40/mo` for `5,000` contacts).
- **Google Workspace Business Starter:**
  - *India Pricing:* ~`₹270/user/mo` annual (~`₹325` monthly, +18% GST) or `$7.00/user/mo` USD annual.
  - Includes custom `@techgroww.co.in` Gmail inboxes/aliases, 2-Step Verification, OAuth 2.0, and SAML SSO capability.

---

## 3. Primary Recommended Architecture (Single Primary Choice)

**Recommended Stack for Tech Groww:**
- **App Framework & Backend:** **Next.js 16.x (`proxy.ts`) + React 19 + TypeScript + Tailwind CSS v4**
- **Application Hosting & Edge CDN:** **Vercel Pro** (`$20/mo` per active engineering committer seat; PR Preview Staging + Production `main`)
- **Database, Auth, RLS & File Storage:** **Supabase Pro** (`$25/mo`, `ap-south-1` Mumbai / `ap-southeast-1` Singapore, **daily DB backups `RPO <= 24h`**, zero inactivity pause, Google OAuth + `aal2` TOTP MFA + private/public buckets). *Note on PITR & Storage Backups:* Sub-hour **PITR (`RPO <= 15m`) is a separate `+$100/month` Supabase add-on** (deferred until transaction volume justifies `$145/mo`); because Supabase Pro does **not** back up Storage files automatically, implement a scheduled encrypted off-site Storage snapshot job (Cloudflare R2 `10 GB` free / encrypted archive).
- **Distributed Rate Limiter & Edge Redirect Cache:** **Upstash Redis** (Free `$0` tier covers launch volume for Edge IP rate limiting & CMS redirect invalidation)
- **Email (Transactional & Broadcasts):** **Resend** (Launch on Free tier with `80/100` critical-reserve guard; upgrade to `$20/mo` Pro when daily transactional volume approaches threshold)
- **Corporate Mail & Identity:** **Google Workspace Business Starter** (`@techgroww.co.in` MX + OAuth staff sign-in)
- **Background Jobs:** **Vercel Cron** (4 scheduled `GET` jobs: `retention-purge` daily, `storage-backup` daily, `publish-scheduled` 15m, `resend-retry` 15m — requires Vercel Pro) secured by `CRON_SECRET`.

**Total Estimated Monthly Baseline Cost:**
- **Local Development:** `$0` (Local Supabase CLI / Docker + Next.js dev server — zero Hobby commercial staging violation).
- **Unified Staging (PR Previews) & Production Launch:** **`$45/month` baseline (~₹3,800–₹4,000/mo for 1 active engineering seat)** (`Vercel Pro $20/seat` + `Supabase Pro $25` + `Supabase Staging Free $0` + `Upstash Free $0` + `Resend Free $0`) + Google Workspace seats (`~₹270/user/mo` + GST). *(Each additional contributing Vercel committer seat adds `$20/mo`; optional Supabase PITR adds `+$100/mo` -> `$145/mo`.)*

**Why This Is Best for Tech Groww:**
1. Eliminates server maintenance, Nginx/PM2 patching, and fragmented auth/storage glue so a lean team ships all 5 portals cleanly.
2. Enforces **PostgreSQL RLS** directly alongside server-side RBAC — strongest security posture for multi-tenant Client, Intern, and HR resume isolation.
3. Native PR preview deployments on `techgroww01/official-website-working` let leadership review every change visually before DNS/production release.

---

## 4. Contingency Architecture (Cost-Minimized Self-Managed Fallback)

*Use ONLY if monthly SaaS spend (`$45/mo`) must be consolidated onto existing Hostinger infrastructure:*
- **Compute:** **Hostinger KVM 2 VPS** (`₹799–₹1,199/mo`) running containerized Next.js (`output: 'standalone'`) behind Caddy/Nginx + PM2.
- **Database & Storage:** **Neon Launch** (or self-hosted PostgreSQL on VPS with automated encrypted S3/Backblaze off-site backups) + Auth.js v5 + Cloudflare R2 (`10 GB` free storage).
- **Trade-off:** Adds `~15–25 hours` of DevOps hardening, manual preview environment setup, and ongoing OS/TLS/backup maintenance burden.

---

## 5. GitHub Repository Workflow (`techgroww01/official-website-working`)

- `main` branch = protected Production branch (auto-deploys to Vercel Production after CI checks pass).
- `feature/*` & `fix/*` branches -> Pull Request -> Automated TypeScript + ESLint + Playwright smoke + Vercel Preview Deployment -> Peer/Lead review -> Squash merge to `main`.
- Database migrations tracked under `supabase/migrations/*.sql` and applied via gated release checklist prior to app rollout (`17_DEVOPS_ENVIRONMENT_AND_DEPLOYMENT_BLUEPRINT.md`).

---

## 6. Acceptance Criteria & Cross-References

- Single primary stack locked with exact verified provider constraints (no commercial-use violation on Vercel Hobby, no Supabase Free 7-day auto-pause in production, no Resend 100/day silent drop).
- **Cross-References:** `12_DATABASE_ARCHITECTURE_AND_ERD.md`, `15_EMAIL_AND_GOOGLE_WORKSPACE_INTEGRATION.md`, `17_DEVOPS_ENVIRONMENT_AND_DEPLOYMENT_BLUEPRINT.md`, `23_ARCHITECTURE_DECISION_RECORDS.md`.
