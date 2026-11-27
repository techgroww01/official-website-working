# 19 — QA, TESTING STRATEGY & ACCEPTANCE CRITERIA

**Date:** 2026-11-27  
**Quality Mandate:** Zero decorative non-functional buttons · Zero fake form success states · All 5 portals verified end-to-end before launch.

---

## 1. Purpose & Scope

Defines the multi-layer testing pyramid (Unit, Integration/RLS, End-to-End Playwright, Accessibility, Security, and Performance/Lighthouse) and objective release gates for the Tech Groww platform.

**Dependencies:** `11_RBAC_AND_AUTHORIZATION_MATRIX.md`, `13_API_AND_INTEGRATION_CONTRACTS.md`, `16_SECURITY_PRIVACY_AND_THREAT_MODEL.md`, `18_SEO_ACCESSIBILITY_AND_PERFORMANCE_SPECIFICATION.md`.

---

## 2. Automated Testing Stack & Coverage Plan

| Test Layer | Tooling | Mandatory Test Targets |
|---|---|---|
| **1. Static & Type Safety** | TypeScript (`tsc --noEmit`) + ESLint + Prettier | Strict type-checking across RSC, Server Actions, Zod schemas, and DB types. Zero `any` in auth/RBAC code. |
| **2. Unit Tests** | Vitest | Zod input schemas, RBAC `hasPermission(roles, resource, action, scope)` matrix (all 18 roles), sanitize/magic-byte helpers, date/currency formatters, Resend daily quota guard. |
| **3. Integration & RLS Tests** | Vitest + Local Supabase Postgres | Verify PostgreSQL RLS isolation: Client Org A **cannot** read/update Client Org B projects/files/tickets; Intern A **cannot** read Intern B evaluations; Sales Rep **cannot** read HR resumes or another rep's private leads; `audit_logs` rejects `UPDATE`/`DELETE`. |
| **4. End-to-End (E2E) Browser Tests** | Playwright | Full flows across Chrome, Firefox, WebKit + Mobile viewports (`375×812`, `768×1024`, `1440×900`):<br>- Public navigation, service blueprint hover/tap, cookie consent gating GA4, 301 legacy redirects<br>- `/contact` submit -> persists DB -> appears in `/sales/leads` -> Resend mock/test receipt<br>- `/careers/[slug]` apply with PDF resume -> appears in `/recruitment/applications` -> confidential notes hidden from candidate<br>- Won deal conversion -> `/client` onboarding -> deliverable approval -> ticket creation<br>- Intern task submission -> mentor feedback -> certificate issue<br>- CMS draft -> publish -> public page updates without redeploy |
| **5. Accessibility & Visual Checks** | `@axe-core/playwright` + Keyboard test | Zero Critical/Serious axe violations; keyboard-only tab walkthrough across header, dropdowns, mobile drawer, FAQ accordion, and portal tables; `prefers-reduced-motion: reduce` test. |
| **6. Security & Abuse Checks** | Playwright + API negative suite | Unauthenticated requests to `/admin`, `/sales`, `/recruitment`, `/client`, `/intern` & `/api/v1/*` return redirect/`401`; oversized/spoofed-MIME resume `.exe` renamed `.pdf` rejected (`400`); rate limit triggers `429`; webhook with bad HMAC returns `401`. |
| **7. Performance & SEO Audit** | Lighthouse CI (`lhci`) | Verify CWV (`LCP <= 2.5s`, `INP <= 200ms`, `CLS <= 0.1`), `robots.txt` disallows all 5 portals, `sitemap.xml` includes only published public URLs, valid JSON-LD schemas. |

---

## 3. Manual UAT Sign-Off Matrix (Pre-Cutover Gate)

1. **Responsive Device Sweep:** Real-device or emulator verification on small Android (`360px`), iPhone (`390px` + safe area), iPad (`768px`/`1024px`), laptop (`1280px`), desktop (`1440px+`).
2. **Email End-to-End Verification:** Send real test inquiry, application, invite, and Resend test broadcast on staging; inspect SPF/DKIM/DMARC `PASS` headers in Google Workspace Gmail.
3. **Link & Button Integrity Crawl:** Automated link checker confirms zero `404` internal links and zero dead/placeholder buttons (`#` hrefs).
4. **Account Suspension Drill:** Suspend test staff account -> confirm immediate session rejection on next request.

---

## 4. Release Gate Criteria

**Nothing deploys to `techgroww.co.in` production unless:**
- `tsc --noEmit`, ESLint, Unit, RLS Integration, and E2E suites pass 100% in CI.
- Zero `Critical` or `High` security/RBAC defects open.
- All `[COMPANY CONFIRMATION REQUIRED: ...]` blockers in `21_PRELAUNCH_VERIFICATION_CHECKLIST.md` are formally signed off.

---

## 5. Cross-References

`11_RBAC_AND_AUTHORIZATION_MATRIX.md`, `16_SECURITY_PRIVACY_AND_THREAT_MODEL.md`, `18_SEO_ACCESSIBILITY_AND_PERFORMANCE_SPECIFICATION.md`, `20_IMPLEMENTATION_ROADMAP_AND_ENGINEERING_BACKLOG.md`, `21_PRELAUNCH_VERIFICATION_CHECKLIST.md`.

