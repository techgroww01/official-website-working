# 11 — CROSS-PORTAL RBAC & AUTHORIZATION MATRIX

**Date:** 2026-11-27  
**Security Posture:** **Deny-by-Default** · Server-Side Enforcement + PostgreSQL Row-Level Security (RLS)

---

## 1. Purpose & Scope

Defines every user role across all 5 portals, resource×action permission matrices (`Create`, `Read`, `Update`, `Delete`, `Approve`, `Publish`, `Assign`, `Export`, `Manage`, `View Audit`), tenant/cohort/ownership isolation rules, multi-role inheritance, session/MFA expectations, and emergency access/revocation procedures.

**Dependencies:** `10_FIVE_PORTAL_PRODUCT_REQUIREMENTS.md`, `12_DATABASE_ARCHITECTURE_AND_ERD.md`, `16_SECURITY_PRIVACY_AND_THREAT_MODEL.md`.

---

## 2. Canonical Role Catalog (20 Roles Across 3 Account Classes)

| Account Class | Roles | Sign-In Mechanism |
|---|---|---|
| **Internal Staff** (`@techgroww.co.in` domain preferred — 15 Roles) | `super_admin`, `admin`, `content_manager`, `editor`, `operations_manager`, `sales_admin`, `sales_manager`, `sales_rep`, `recruitment_admin`, `hiring_manager`, `recruiter`, `internship_admin`, `internship_coordinator`, `mentor`, `auditor` | Google Workspace OAuth (`hd=techgroww.co.in` + `Before User Created`/invite verification) or Email/Password + mandatory **`aal2` TOTP MFA** for privileged roles (`super_admin`, `admin`, `operations_manager`, `sales_admin`, `recruitment_admin`, `internship_admin`) |
| **External Client** (3 Roles) | `client_admin`, `client_member`, `client_viewer` | Tokenized Invite -> Email/Password or Magic Link, scoped strictly via `organization_members.org_role` + `organization_id` |
| **External Intern / Candidate** (2 Roles) | `intern`, `candidate` | `intern`: Tokenized Cohort Invite. `candidate`: Public application + HMAC-hashed `/careers/status` tokenized status & offer portal |

*Multi-Role & Org-Role Source of Truth:* Internal staff hold active role assignments in `user_roles` (permissions are **additive union**, bounded by explicit deny rules and immutable audit logging). External Client permissions derive canonically from `organization_members.org_role` (single source of truth per organization) to prevent role drift.

---

## 3. Master Resource × Action Permission Matrix

**Legend:** `C`=Create · `R`=Read · `U`=Update · `D`=Delete/Archive · `AP`=Approve · `P`=Publish · `AS`=Assign · `EX`=Export · `MG`=Manage · `AU`=Audit · `(Own)`=Assigned/Owned records only · `(Org)`=Own Organization only · `(Mentee)`=Assigned mentees only · `—`=Denied.

### 3.1 Admin CMS & Platform Resources

| Resource | `super_admin` | `admin` | `content_manager` | `editor` | `operations_manager` | `auditor` | All Sales/HR/Client/Intern |
|---|---|---|---|---|---|---|---|
| **CMS Pages / Services / Blog / Work** | C,R,U,D,AP,P | C,R,U,D,AP,P | C,R,U,D(Archive),AP,P | C,R,U | R | R | — |
| **Media Library** | C,R,U,D,MG | C,R,U,D,MG | C,R,U,D | C,R,U | R | R | — |
| **Navigation / SEO / Redirects** | C,R,U,D,MG | C,R,U,D,MG | R,U | — | — | R | — |
| **Team Profiles & Testimonials** | C,R,U,D,AP,P | C,R,U,D,AP,P | C,R,U (`is_public`/`is_approved = false` only) | — | — | R | — |
| **Broadcasts (Resend Audiences)** | C,R,U,D,P,EX | C,R,U,D,P | C,R,U (Draft & self-test only) | — | — | R | — |
| **Global Settings / Integrations** | R,U,MG | R,U,MG | — | — | R | R | — |
| **Users & Role Assignments** | C,R,U,D,MG | C,R,U,MG *(cannot assign/edit `super_admin` OR elevate own roles)* | — | — | — | R | — |
| **Immutable Audit Logs** | R,AU | R,AU | — | — | — | R,AU | — |

*(Critical Separation of Duties: Neither `super_admin` nor `admin` may update or delete `audit_logs` (`append-only` at PostgreSQL privilege/RLS level), and `admin` cannot self-escalate own roles or touch `super_admin` accounts.)*

### 3.2 Sales Team Portal Resources

| Resource | `super_admin` / `admin` | `sales_admin` | `sales_manager` | `sales_rep` | `operations_manager` | All Other Roles |
|---|---|---|---|---|---|---|
| **Contact Enquiries & Leads** | R,U,AS,EX | C,R,U,D,AS,EX,MG | C,R,U,AS,EX | C(Own forced),R(Own + Unassigned Queue if enabled),U(Own) | R (handoff context) | — |
| **Contacts & Organizations** | R,U | C,R,U,D,EX | C,R,U,EX | C,R(Linked to Own Leads/Opps),U(Own) | R (handoff context) | — |
| **Opportunities & Proposals** | R,AP | C,R,U,D,AP,EX | C,R,U,AP,EX | C,R(Own),U(Own) | R(Won), AP(Won deal handoff) | — |
| **Sales Activities** | R | C,R,U,D,EX | C,R,U,EX | C(Own),R(Own),U(Own) | — | — |
| **Sales Reports** | R,EX | R,EX,MG | R,EX | R(Own) | — | — |

### 3.3 Recruitment Portal Resources

| Resource | `super_admin` / `admin` | `recruitment_admin` | `hiring_manager` | `recruiter` | `candidate` | All Sales/CMS/Client/Intern |
|---|---|---|---|---|---|---|
| **Job & Internship Postings** | R,P | C,R,U,D,P,MG | C,R,U,AP | C,R,U | R(Open) | — |
| **Applications & Resumes** | R | R,U,D,AS,EX,MG | R(Dept),U | R,U,AS | C, R(Own), U(Withdraw Own) | — |
| **Interviews (Schedule)** | R | C,R,U,D,MG | C,R,U,AP | C,R,U | R(Own schedule only) | — |
| **Private Scorecards & Notes** | R | C,R,U,D,MG | C,R,U,AP | C,R,U *(must hold `hiring_manager` or `recruiter` to submit scorecard)* | **— (Strictly Denied)** | — |
| **Offers** | R,AP | C,R,U,D,AP,MG | C,R,AP | R(Status/Dates ONLY; Comp Masked) | R(Own offer), AP(Accept/Decline) | — |
| **Retention & DPDP Erasure** | R | R,D,MG *(Exclusive)* | — | — | R(Own erasure status) | — |

### 3.4 Client Portal Resources (Strict Organization Isolation)

| Resource | `super_admin` / `admin` | `operations_manager` | `client_admin` | `client_member` | `client_viewer` | All Sales/HR/Intern |
|---|---|---|---|---|---|---|
| **Client Org & Members** | C,R,U,MG | C,R,U | R(Org), C/U/D(`client_member`/`client_viewer` in Org only; last `client_admin` protected) | R(Org) | R(Org) | — |
| **Projects & Milestones** | C,R,U,MG | C,R,U,AS | R(Org) | R(Org) | R(Org) | — |
| **Deliverables (Sign-off)** | C,R,U | C,R,U | R(Org),AP(Org) | R(Org) | R(Org) | — |
| **Shared Files & Messages** | C,R,U,D | C,R,U | C,R(Org) | C,R(Org) | R(Org) | — |
| **Support Tickets & Comments** | R,U,AS | R,U,AS,MG *(incl. internal notes)* | C,R,U(Org) | C,R,U(Org) | R(Org) | — |
| **Billing Documents** | C,R,U,D | C,R,U | R(Org) | **— (Denied)** | **— (Denied)** | — |

### 3.5 Intern Portal Resources (Cohort & Individual Isolation)

| Resource | `super_admin` / `admin` | `internship_admin` | `internship_coordinator` | `mentor` | `intern` | All Other Roles |
|---|---|---|---|---|---|---|
| **Internship Programs / Cohorts** | R,P | C,R,U,D,P,MG | C,R,U | R(Assigned) | R(Enrolled) | — |
| **Intern Enrollments & Onboarding** | R | C,R,U,AS,MG | C,R,U,AS | R(Mentee) | R(Own),U(Own onboarding) | — |
| **Cohort Announcements** | R | C,R,U,D | C,R,U | C,R,U(Assigned cohort) | R(Enrolled cohort) | — |
| **Assignments & Tasks** | R | C,R,U,D,AS | C,R,U,AS | C,R,U,AS(Mentee) | R(Own),U(Own Status) | — |
| **Task Submissions & Reviews** | R | R,U,AP,EX | R,U | R,U,AP(Mentee) | C,R(Own) | — |
| **Attendance (Feature-Flagged)** | R,AP | C,R,U,AP,MG | C,R,U,AP | C,R,U(Mentee) | C(Own check-in if enabled),R(Own) | — |
| **Completion Certificates** | R,AP | C,R,U,AP,MG | C,R,U,AP | R(Mentee) | R(Own) | — |

---

## 4. Enforcement Layers & Security Rules

1. **Layer 1 — Edge Route Guard (`proxy.ts`):** Rejects unauthenticated requests to `/admin/*`, `/sales/*`, `/recruitment/*`, `/client/*`, `/intern/*` with redirect to `/login` (pages) or HTTP `401` (`/api/*`). Injects **`X-Robots-Tag: noindex, nofollow`** on all portal routes, `/login`, `/forgot-password`, `/reset-password`, `/invite`, `/auth/*`, `/careers/status`, `/api/*`, and `*.vercel.app` previews.
2. **Layer 2 — Live Server-Side Permission & Session Check (`requirePermission(user, resource, action, scope)`):** Every Server Component, Server Action, and `/api/v1/*` handler queries PostgreSQL live to verify **`users.status = 'active' AND users.deleted_at IS NULL`**, checks `users.session_version` against the **Supabase Custom Access Token Hook** (`auth_hook_custom_claims`) JWT claim, reads live `user_roles` / `organization_members.org_role`, validates **`aal2` TOTP MFA** for the 6 privileged staff roles, and verifies exact ownership/org/cohort scope on the server.
3. **Layer 3 — PostgreSQL Row-Level Security (RLS):** Defense-in-depth `SECURITY DEFINER` RLS helpers verify `(SELECT auth.uid())`, live active `users` status (`users.status = 'active' AND deleted_at IS NULL`), JWT `session_version = users.session_version`, `organization_id` (`client_org`), `assigned_to`/`owner_id` (sales), `mentor_id`, `program_id`/`cohort_id`, or `enrollment_id` directly in SQL so no API defect can expose cross-tenant records.
4. **Revocation & Suspension:** Setting `users.status = 'suspended'` (or deleting/demoting a role) immediately revokes Supabase refresh tokens via `auth.admin.signOut(userId, 'global')`, increments `users.session_version` (invalidating any cached JWT `session_version` claim inside both `requirePermission()` and RLS!), blocks both live DB permission checks and RLS helpers immediately, deletes active invites, and writes a `CRITICAL` `USER_SUSPENDED` audit entry.
5. **Emergency ("Break-Glass") Access:** Two designated `super_admin` recovery accounts protected by hardware/TOTP MFA (`aal2`); all actions under emergency recovery emit immediate Resend security alerts + immutable audit logs.

---

## 5. Acceptance Criteria & Cross-References

- Zero privilege escalation paths between external portals (`/client`, `/intern`, `candidate`) and internal staff portals.
- Every endpoint in `13_API_AND_INTEGRATION_CONTRACTS.md` references an exact `(resource, action)` tuple from this matrix.
- **Cross-References:** `10_FIVE_PORTAL_PRODUCT_REQUIREMENTS.md`, `12_DATABASE_ARCHITECTURE_AND_ERD.md`, `16_SECURITY_PRIVACY_AND_THREAT_MODEL.md`.
