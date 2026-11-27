# 16 — SECURITY, PRIVACY & THREAT MODEL SPECIFICATION

**Date:** 2026-11-27  
**Compliance Baseline:** OWASP ASVS Level 1–2 · India Digital Personal Data Protection (DPDP) Act 2023 Alignment · Zero Credential Exposure

---

## 1. Purpose & Scope

Establishes the application threat model, defensive controls, session/MFA lifecycle, file upload hardening, spam/rate defenses, personal data protection, and operational security procedures across the Public Site and all **5 Initial-Scope Portals**.

**Dependencies:** `11_RBAC_AND_AUTHORIZATION_MATRIX.md`, `12_DATABASE_ARCHITECTURE_AND_ERD.md`, `13_API_AND_INTEGRATION_CONTRACTS.md`.

---

## 2. STRIDE Threat Model & Mitigations

| Threat / Vector | Target Surface | Concrete Mitigation |
|---|---|---|
| **Spoofing / Credential Stuffing** | `/login`, `/forgot-password` | Rate limiting (`10 attempts / 15 min`), `HttpOnly`, `Secure`, `SameSite=Lax` cookies via `@supabase/ssr`, Google OAuth `hd=techgroww.co.in` check + invite pre-verification, mandatory TOTP MFA for `super_admin`/`admin`/`recruitment_admin`/`sales_admin`. |
| **Privilege Escalation / IDOR** | `/api/v1/client/*`, `/api/v1/intern/*`, `/api/v1/sales/*` | Deny-by-default `requirePermission()` on every server handler + PostgreSQL RLS checking `auth.uid()`, `organization_members`, or `assigned_to`. Cross-tenant probes return `404` rather than leaking existence via `403`. |
| **Tampering / CSRF / Mass Assignment** | All `POST`/`PATCH`/`DELETE` routes | Next.js Server Actions built-in Origin/Host validation + `SameSite=Lax` cookies; strict Zod schemas with `.strict()` or explicit field allow-lists (no `...body` spreading into DB). |
| **SQL Injection** | PostgreSQL queries | Parameterized Supabase queries / Postgres prepared statements only; zero string-concatenated SQL; allow-listed sort/filter column maps. |
| **XSS & Content Injection** | CMS Blog MDX, Contact messages, File names | Strict Markdown/MDX sanitization (`rehype-sanitize` — zero raw `dangerouslySetInnerHTML`), CSP headers (`script-src` nonce/strict allow-list), `X-Content-Type-Options: nosniff`. |
| **Malicious File Upload** | Resume uploads (`/careers`), Client files, Media Library | Signed direct-to-storage upload (`5 MB` docs, `10 MB` media), strict extension + MIME allow-list, server-side **magic-byte verification** (`%PDF`, `PK\x03\x04` DOCX, PNG/JPEG/WebP), randomized UUID storage keys (`Content-Disposition: attachment` on downloads), private buckets requiring `60s`–`300s` signed URLs. |
| **Bot Spam & DoS** | `/contact`, `/careers/[slug]`, `/api/v1/public/newsletter` | Cloudflare Turnstile token verified server-side + hidden honeypot field + sliding-window IP rate limit (`5 req / 10 min`). |
| **Information Disclosure** | Public responses, error logs, `.env`, `/admin` | Zero `service_role` or `RESEND_API_KEY` in `NEXT_PUBLIC_*`; stack traces stripped in production; `/admin`, `/sales`, `/recruitment`, `/client`, `/intern` served with `X-Robots-Tag: noindex, nofollow` and excluded in `robots.txt`. Never link `/admin` in public footer. |
| **Webhook Spoofing** | `/api/v1/webhooks/resend` | Verify `svix-signature` HMAC against `RESEND_WEBHOOK_SECRET` + reject stale timestamps (`> 5 min`) + idempotent `webhook_events` check. |

---

## 3. Authentication, Password, Session & Revocation Rules

- **Password Policy (for non-OAuth Client/Intern/Staff logins):** Minimum `12` characters, checked against breached-password rules via Supabase Auth; hashed automatically using Argon2id/bcrypt by Supabase Auth (never stored in app tables).
- **Session Expiration:** Short-lived JWT access tokens (`1h`), sliding refresh tokens (`7d` idle / `30d` max), immediate server revocation when `users.status` transitions to `'suspended'` or roles change.
- **Account Suspension & Offboarding:** `super_admin`/`admin` suspends user in `/admin/users` -> revokes Supabase refresh tokens (`auth.admin.signOut`), marks `users.status = 'suspended'`, deletes active invites, logs `USER_SUSPENDED` in `audit_logs`.

---

## 4. Personal Data Protection & DPDP Act 2023 Alignment

- **Data Minimization:** Contact forms collect only scope-relevant fields; resumes never stored in public buckets.
- **Explicit Consent:** Separate checkboxes on Contact/Careers/Newsletter forms linking to `/privacy`; Analytics (`GA4`) blocked until user explicitly selects `Allow analytics` in Cookie banner.
- **Retention & Erasure:**
  - Rejected `applications` + stored resume PDFs/DOCX automatically flagged for purge after **`180 days`** (via scheduled cron `POST /api/v1/recruitment/retention/purge`) unless candidate opts into future-role retention.
  - Inactive `contact_enquiries` without active client conversion reviewed/archived at `24 months`.
  - Immutable `audit_logs` store actor UUID + anonymized/hashed IP (`SHA-256(ip + salt)`), retained `365 days` for security forensics.

---

## 5. HTTP Security Headers (Applied via `next.config.ts`)

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY` (or `frame-ancestors 'none'` in CSP)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 6. Acceptance Criteria & Cross-References

- Zero secrets in client bundles or git history; 100% of tables covered by RLS; all uploads magic-byte checked and stored in private buckets where PII exists.
- **Cross-References:** `11_RBAC_AND_AUTHORIZATION_MATRIX.md`, `12_DATABASE_ARCHITECTURE_AND_ERD.md`, `17_DEVOPS_ENVIRONMENT_AND_DEPLOYMENT_BLUEPRINT.md`, `19_QA_TESTING_AND_ACCEPTANCE_CRITERIA.md`.

