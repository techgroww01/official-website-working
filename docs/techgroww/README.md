# Tech Groww — Complete Corporate Platform Blueprint Documentation

**Date:** 2026-11-27  
**Mode:** `Planning, Research, Architecture & Documentation Only` (`DEMO` Integrity Mode — Zero Application Code Implemented)  
**Target Repository:** `https://github.com/techgroww01/official-website-working.git`  
**Scope:** Greenfield Public Corporate Website + **All 5 Initial-Scope Portals** (`Admin CMS`, `Client`, `Intern`, `Recruitment`, `Sales Team`)

---

## Quick Navigation Index (24 Canonical Documents + Governance Guides)

### Foundation & Discovery (`01`–`07`)
| Doc | Filename | Focus Area |
|---|---|---|
| **01** | [`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md) | Executive mandate, 5-portal initial scope, objectives, architecture summary |
| **02** | [`COMPANY_RESEARCH_AND_AUDIT.md`](./COMPANY_RESEARCH_AND_AUDIT.md) | Forensic audit of live `techgroww.co.in`, legacy PHP folder, LinkedIn & Instagram |
| **03** | [`COMPANY_INFORMATION_VERIFICATION.md`](./COMPANY_INFORMATION_VERIFICATION.md) | Canonical fact register (`V-PUB`, `S-POST`, `UNVERIFIED`, `PROPOSED`) |
| **04** | [`COMPETITOR_RESEARCH.md`](./COMPETITOR_RESEARCH.md) | 19-site research synthesis (5 creative benchmarks + 11 live peers + 3 blocked search refs) |
| **05** | [`BRAND_STRATEGY.md`](./BRAND_STRATEGY.md) | Official `techgroww_logo.svg` audit (`50,753 bytes` JPEG-in-SVG), vectorization & voice rules |
| **06** | [`CREATIVE_DIRECTION.md`](./CREATIVE_DIRECTION.md) | 5-benchmark Reference-to-Design Matrix & dual-surface Direction A / C selection |
| **07** | [`WEBSITE_SITEMAP.md`](./WEBSITE_SITEMAP.md) | Public/auth/portal URL topology, `noindex` boundaries & deterministic 301/410 redirects |

### Design, Content & Portal Requirements (`08`–`11`)
| Doc | Filename | Focus Area |
|---|---|---|
| **08** | [`08_DESIGN_SYSTEM_AND_UI_SPECIFICATION.md`](./08_DESIGN_SYSTEM_AND_UI_SPECIFICATION.md) | WCAG 2.2 AA palette tokens, typography, custom modules (`GrowthSignal`, marquee), breakpoints |
| **09** | [`09_PUBLIC_WEBSITE_CONTENT_AND_PAGE_SPECIFICATIONS.md`](./09_PUBLIC_WEBSITE_CONTENT_AND_PAGE_SPECIFICATIONS.md) | Header/footer, page-by-page UI & copy framing, `/work` badge discipline, DPDP legal pages |
| **10** | [`10_FIVE_PORTAL_PRODUCT_REQUIREMENTS.md`](./10_FIVE_PORTAL_PRODUCT_REQUIREMENTS.md) | Complete workflows, roles & state transitions for Admin CMS, Client, Intern, Recruitment, Sales |
| **11** | [`11_RBAC_AND_AUTHORIZATION_MATRIX.md`](./11_RBAC_AND_AUTHORIZATION_MATRIX.md) | 20 canonical roles, resource×action matrix, `aal2` MFA, live session revocation & RLS rules |

### Technical Architecture, Security & Delivery (`12`–`21`)
| Doc | Filename | Focus Area |
|---|---|---|
| **12** | [`12_DATABASE_ARCHITECTURE_AND_ERD.md`](./12_DATABASE_ARCHITECTURE_AND_ERD.md) | Normalized PostgreSQL schema, Mermaid ERD, composite FKs, linear `001`–`009` migrations |
| **13** | [`13_API_AND_INTEGRATION_CONTRACTS.md`](./13_API_AND_INTEGRATION_CONTRACTS.md) | Full `/api/v1/*` endpoint catalog, CSRF/RFC 8058 rules, signed uploads, Upstash limits, cache tags |
| **14** | [`14_TECH_STACK_AND_HOSTING_DECISION.md`](./14_TECH_STACK_AND_HOSTING_DECISION.md) | Next.js 16.x + Vercel Pro + Supabase Pro + Upstash Redis + Resend + Hostinger VPS contingency |
| **15** | [`15_EMAIL_AND_GOOGLE_WORKSPACE_INTEGRATION.md`](./15_EMAIL_AND_GOOGLE_WORKSPACE_INTEGRATION.md) | Root `@` Google MX/SPF vs `send.techgroww.co.in` Resend isolation, `80/100` quota reserve, OAuth hooks |
| **16** | [`16_SECURITY_PRIVACY_AND_THREAT_MODEL.md`](./16_SECURITY_PRIVACY_AND_THREAT_MODEL.md) | STRIDE threats, nonce CSP, `.docx` macro/EXIF sanitization, DPDP 180d erasure, PII-free audits |
| **17** | [`17_DEVOPS_ENVIRONMENT_AND_DEPLOYMENT_BLUEPRINT.md`](./17_DEVOPS_ENVIRONMENT_AND_DEPLOYMENT_BLUEPRINT.md) | Full `.env.example` manifest, Preview/Prod workflow, Storage backups, restore drill & DNS cutover |
| **18** | [`18_SEO_ACCESSIBILITY_AND_PERFORMANCE_SPECIFICATION.md`](./18_SEO_ACCESSIBILITY_AND_PERFORMANCE_SPECIFICATION.md) | `Organization`/`JobPosting` JSON-LD, WCAG 2.2 (`2.4.11`, `2.5.7`, `2.5.8`, `3.3.8`), CWV thresholds |
| **19** | [`19_QA_TESTING_AND_ACCEPTANCE_CRITERIA.md`](./19_QA_TESTING_AND_ACCEPTANCE_CRITERIA.md) | Vitest 20-role RBAC/RLS tests, Playwright E2E, negative security checks, `gitleaks` & UAT gates |
| **20** | [`20_IMPLEMENTATION_ROADMAP_AND_ENGINEERING_BACKLOG.md`](./20_IMPLEMENTATION_ROADMAP_AND_ENGINEERING_BACKLOG.md) | 12 workstreams (`ENG-101..1202`), Mermaid dependency graph, Wave A/B gates & contingency |
| **21** | [`21_PRELAUNCH_VERIFICATION_CHECKLIST.md`](./21_PRELAUNCH_VERIFICATION_CHECKLIST.md) | Mandatory owner confirmation gates (`C-01`–`C-13`) and infrastructure prerequisites (`I-01`–`I-08`) |

### Governance, Reviews & Audit Trail (`22`–`24` + Supporting Files)
| Doc | Filename | Focus Area |
|---|---|---|
| **22** | [`22_MULTI_AGENT_REVIEW_AND_RESOLUTION_LOG.md`](./22_MULTI_AGENT_REVIEW_AND_RESOLUTION_LOG.md) | Pass 1 & Pass 2 multi-agent critique log + Final cross-doc audit verification |
| **23** | [`23_ARCHITECTURE_DECISION_RECORDS.md`](./23_ARCHITECTURE_DECISION_RECORDS.md) | 10 formalized Architecture Decision Records (`ADR-001`–`ADR-010`) |
| **24** | [`24_FINAL_PROJECT_READINESS_REPORT.md`](./24_FINAL_PROJECT_READINESS_REPORT.md) | Executive handoff verdict, blocker gates & engineering kickoff sequence |
| **—** | [`DOCUMENTATION_CHANGELOG.md`](./DOCUMENTATION_CHANGELOG.md) | Revision log across baseline, Pass 1 updates & Pass 2 hardening |
| **—** | [`DOCUMENTATION_TRACEABILITY_MATRIX.md`](./DOCUMENTATION_TRACEABILITY_MATRIX.md) | End-to-end mapping: Objectives -> Portals -> RBAC -> DB -> APIs -> Backlog -> QA -> Gates |
