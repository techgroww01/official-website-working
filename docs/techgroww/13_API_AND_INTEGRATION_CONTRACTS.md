# 13 — API & INTEGRATION CONTRACTS SPECIFICATION

**Date:** 2026-11-27  
**Transport:** Next.js App Router Route Handlers (`/api/v1/*`) + Server Actions (validated identically via shared Zod schemas & RBAC guards).

---

## 1. Purpose & Scope

Establishes uniform API conventions (versioning, envelope format, validation, pagination, filtering, sorting, idempotency, rate limiting, signed uploads, webhooks, audit logging) and concrete endpoint contracts spanning the Public Site and all **5 Initial-Scope Portals**.

**Dependencies:** `10_FIVE_PORTAL_PRODUCT_REQUIREMENTS.md`, `11_RBAC_AND_AUTHORIZATION_MATRIX.md`, `12_DATABASE_ARCHITECTURE_AND_ERD.md`.

---

## 2. Global API Standards

- **Versioning, `aal2` MFA & CSRF Protection:** Prefix REST endpoints with `/api/v1/...`. Internal Next.js mutations may use Server Actions backed by the exact same service-layer `zod` schema + `requirePermission()` wrapper (which enforces **`aal2` TOTP MFA** for the 6 privileged staff roles on every API call). All non-GET `/api/v1/*` routes verify `Origin` / `Host` match (`403` on mismatch) and require `application/json` (or validated upload `multipart/form-data`) — **explicit exceptions:** (1) cryptographically signed webhook/cron routes, and (2) **`POST /api/v1/public/newsletter/unsubscribe`** (HMAC `token`-authenticated, allowing mail-provider **RFC 8058 `application/x-www-form-urlencoded` `List-Unsubscribe=One-Click`** POSTs with no browser `Origin`).
- **Standard JSON Response Envelope:**
  ```json
  // Success
  { "ok": true, "data": { ... }, "meta": { "page": 1, "limit": 20, "total": 42 } }
  // Error
  { "ok": false, "error": { "code": "FORBIDDEN", "message": "Insufficient permission", "details": [] } }
  ```
- **HTTP Status Discipline:** `200` OK, `201` Created, `400` Validation Error (Zod field map), `401` Unauthenticated, `403` Forbidden, `404` Not Found (also used instead of `403` when probing cross-tenant resource IDs), `409` Conflict / Concurrent Lock or Body Mismatch, `413` Payload Too Large, `415` Unsupported Media Type, `422` Business Rule Blocked (e.g., publishing unapproved client work), `429` Rate Limited (`Retry-After` header), `500` Internal Error (zero stack trace leaked).
- **Pagination, Filtering & Sorting:** `?page=1&limit=20` (max `100`), `?q=search`, `?status=...`, `?sort=created_at:desc` (allow-listed columns only — never raw SQL string interpolation).
- **Idempotency (`idempotency_keys` table):** Support `Idempotency-Key` UUID header on state-changing creation/conversion endpoints (`POST /api/v1/sales/opportunities/:id/convert`, `POST /api/v1/public/offers/:id/respond`, `POST /api/v1/recruitment/offers/:id/accept`, webhook processors). Replays identical cached `200/201` response when `request_hash` matches; returns `409` on concurrent in-flight lock or mismatched payload hash.
- **Distributed Rate Limiting (Upstash Redis):** Sliding-window token bucket backed by **Upstash Redis** (`UPSTASH_REDIS_REST_*`), trusting `x-vercel-forwarded-for` ONLY (never spoofable `X-Forwarded-For`), keyed per `(IP + route)`:
  - `/api/v1/public/contact` & `/newsletter/subscribe`: `5 requests / 10 mins / IP` + Cloudflare Turnstile + honeypot.
  - `/api/v1/public/applications` & `upload-url`: `15 requests / 10 mins / IP` (accommodates campus/shared NAT hiring drives) + Cloudflare Turnstile + honeypot.
  - Auth (`/api/v1/auth/login`, `/forgot-password`): `10 attempts / 15 mins / IP + email`.
  - Authenticated Portal APIs: `120 requests / min / user`.
- **File Upload Security Contract (Signed Direct-to-Storage + Path Isolation):**
  1. Authenticated portal users call `POST /api/v1/media/upload-url` (`{ domain: 'cms'|'client'|'intern'|'offer'|'proposal'|'billing', scopeId?, filename, mimeType, byteSize }`); unauthenticated job applicants call Turnstile-protected `POST /api/v1/public/applications/upload-url` (`{ postingId, filename, mimeType, byteSize, turnstileToken }`). Server enforces server-generated UUID paths scoped strictly by domain/org/posting (`client/{org_id}/...`, `resumes/{posting_id}/{uuid}.ext` — **client NEVER supplies raw storage path**).
  2. Server validates allow-listed MIME (`image/png`, `image/jpeg`, `image/webp` for CMS; `application/pdf`, `.docx` only for resumes/vault/billing docs; **user `.svg` uploads strictly forbidden**) and per-bucket byte ceiling (`5 MB` resumes/vault docs, `10 MB` CMS raster).
  3. Server returns short-lived signed upload URL (`120s`) + HMAC-signed `uploadCommitToken`; client PUTs binary directly to Supabase Storage.
  4. **Commit Verification:** Authenticated callers commit via `POST /api/v1/media/commit`; public job applicants pass `uploadCommitToken` directly into **`POST /api/v1/public/applications`**, which inspects bytes `0–15` + `.docx` ZIP central directory/XML safety check (rejecting macros/embedded executables), creates `media_assets` + `applications` atomically via `create_application(...)` RPC, strips EXIF from any rasters, and marks the asset active.

---

## 3. Endpoint Catalog Across All Five Portals

### 3.1 Auth, Public Intake, Candidate Lookup, Media & Webhooks
| Method & Route | Auth / Permission | Request Payload / Purpose | Response, Atomicity & Audit |
|---|---|---|---|
| `GET /api/v1/health` | Public (Lightweight) | Verifies Next.js runtime, PostgreSQL connectivity, and Upstash Redis ping | `200` `{ status: 'ok' }` (zero secret/stack disclosure). |
| `GET /auth/callback` | Public PKCE callback | Exchanges OAuth code; verifies `hd === 'techgroww.co.in'` + pre-invited active `users` row (`auth.admin.deleteUser` on uninvited attempt). | Sets `@supabase/ssr` cookies -> portal redirect; `403` uninvited. |
| `POST /api/v1/auth/login` | Public + Turnstile + Rate Limit | Proxies password auth -> verifies `users.status = 'active'`; prompts `aal2` MFA challenge if required. | `200` `{ mfaRequired }`; `429` rate limit. Audit: `LOGIN_SUCCEEDED`/`FAILED`. |
| `POST /api/v1/auth/logout` & `POST /api/v1/invitations/accept` | Session / Hashed Token | Ends session or accepts `72h` invite token -> binds password/user + marks `accepted_at`. | `200`; `404`/`410` invalid/expired token. Audit: `INVITE_ACCEPTED`. |
| `POST /api/v1/media/upload-url` & `POST /api/v1/media/commit` | Authenticated + Role Scope | Generates tenant-scoped UUID signed PUT URL; verifies magic bytes + EXIF strip on commit for portal uploads. | `201` `{ uploadUrl, uploadCommitToken }` / `{ assetId }`. `413`/`415`/`400`. |
| `POST /api/v1/public/applications/upload-url` | Public + Turnstile + Rate Limit | Validates `{ postingId, filename, mimeType, byteSize }` -> issues isolated `resumes/{postingId}/{uuid}` PUT URL + `uploadCommitToken`. | Prevents IDOR path spoofing; unlinked files purged after 24h. |
| `POST /api/v1/public/contact` | Public + Turnstile + Rate Limit | `{ fullName, email, phone?, company?, service, budget?, preferredChannel, message, privacyConsent, turnstileToken }` | Executes `SECURITY DEFINER` RPC `create_enquiry_with_lead(...)` (`201`); Resend `@send.techgroww.co.in` alert + ack; optional Sheets mirror. Audit: `ENQUIRY_CREATED`. |
| `POST /api/v1/public/applications` | Public + Turnstile + Rate Limit | `{ postingId, fullName, email, phone, linkedinUrl?, coverNote, uploadCommitToken, privacyConsent, talentPoolConsent }` | Verifies magic bytes & `.docx` XML via `uploadCommitToken`, commits `media_assets` + `applications` via RPC (`201`), sends ack + HR alert. |
| `GET /api/v1/public/applications/status` & `POST /api/v1/public/applications/withdraw` | Tokenized (`status_token`) | Candidate checks stage/interview schedule (scorecards strictly omitted) or withdraws own application. | `200` sanitized view; `404` invalid token. |
| `POST /api/v1/public/offers/[id]/respond` | Tokenized + `Idempotency-Key` | `{ token, decision: 'accepted'|'declined' }` for unauthenticated `candidate` offer acceptance/decline (supports nullable `actor_user_id` idempotency). | `200`; updates `offers` + alerts HR. |
| `GET /api/v1/public/certificates/[code]` | Public (Rate-limited) | Verifies `certificate_code` validity without exposing PII (`recipient_name`, `program_title_snapshot`, `issued_at`, `revoked_at == null`). | `200` `{ valid, holder, program, issuedAt }` or `404`. |
| `POST /api/v1/public/newsletter/subscribe` & `GET /api/v1/public/newsletter/confirm` | Public + Turnstile (`subscribe` only) | Subscribes email (`pending` -> `active` via double opt-in HMAC token) + syncs Resend Audience. | `200`; zero Turnstile on `confirm` GET link. |
| `GET / POST /api/v1/public/newsletter/unsubscribe` | HMAC `token` (NO Turnstile / NO `Origin` check) | One-click **RFC 8058 (`POST` `application/x-www-form-urlencoded` `List-Unsubscribe=One-Click`)** + web link (`GET`) unsubscribe using HMAC `token`. | `200`; updates `newsletter_subscribers` + `email_suppressions` + Resend Audience. |
| `GET /api/v1/notifications` & `PATCH /api/v1/notifications` | Authenticated (`user_id = auth.uid()`) | List unread/recent portal alerts and mark `read_at`. | Strict own-user RLS. |
| `POST /api/v1/webhooks/resend` | HMAC (`svix-signature`) | Handles `email.delivered`, `bounced`, `complained`, and `contact.updated` (unsubscribe sync); strips raw PII keys from stored payload. | `200`; idempotent `webhook_events`; adds `email_suppressions`. `401` bad sig. |

### 3.2 Portal 1 — Admin CMS (`/api/v1/admin/*`)
| Method & Route | Permission Required | Request / Purpose | Response / Side Effects |
|---|---|---|---|
| `GET /api/v1/admin/dashboard` | `cms_pages:read` | Real DB aggregate counts across CMS, inquiries, leads, jobs, Resend daily quota status | `200` live dashboard summary (zero mocked KPIs). |
| `GET / POST /api/v1/admin/pages` & `PATCH / DELETE /api/v1/admin/pages/[id]` | `cms_pages:read` / `create` / `update` / `delete` / `publish` | Create/update/soft-archive modular pages (`action: 'publish'` requires `cms_pages:publish`) | Revalidates `page:{slug}`, `navigation`. Audited. |
| `POST /api/v1/admin/pages/[id]/preview-token` | `cms_pages:read` | Generate short-lived HMAC-signed preview link for staging/draft review | Enables sharing unpublished drafts without exposing to search engines. |
| `GET / POST /api/v1/admin/pages/[id]/versions` & `.../rollback` | `cms_pages:read` / `update` | Inspect `page_versions` snapshots and roll back section JSONB | Creates new revision + logs audit entry. |
| `GET / POST / PATCH / DELETE /api/v1/admin/services` (`/[id]`) | `services:*` | Manage service catalog, cover assets, FAQs, tech tags, publish status | Triggers `revalidateTag('services')`, `service:{slug}`, `sitemap`. |
| `GET / POST / PATCH / DELETE /api/v1/admin/work` (`/[id]`) | `portfolio:*` | Enforce `project_type` & `is_client_approved` gate (`422` if publishing unapproved client work) | Triggers `revalidateTag('work')`, `work:{slug}`, `sitemap`. |
| `GET / POST / PATCH / DELETE /api/v1/admin/insights` (`/[id]`) | `blog:*` | Draft, review, schedule (`scheduled_for`), or publish Markdown articles + categories/relations | Triggers `revalidateTag('insights')`, `insight:{slug}`, `blog-categories`, `sitemap`. |
| `GET / PUT /api/v1/admin/navigation` & `.../redirects` | `navigation_seo:read` / `update` | Manage header/footer nav items and `301/302/410` redirects (`redirects` cache invalidated in Upstash Redis) | Revalidates `navigation`, `redirects`. (`content_manager` permitted; excluded from settings.) |
| `GET / PATCH /api/v1/admin/settings` | `settings:read` / `manage` (`admin` / `super_admin` ONLY) | Update global `system_settings` (`site-settings`, SLA/hours config, GA4 ID) | Revalidates `site-settings`; strictly denied to `content_manager`. |
| `GET / POST / PATCH / DELETE /api/v1/admin/team` & `.../testimonials` | `team_testimonials:*` | Manage team (`is_public` gate) and testimonials (`approval_proof_note` + `is_approved` gate -> `422` if unapproved) | Revalidates `team`, `testimonials`. |
| `GET /api/v1/admin/media` & `PATCH / DELETE /api/v1/admin/media/[id]` | `media:read` / `update` / `delete` | List media library, edit `alt_text`/`folder`/`tags`, and enforce reference check across **all 13 FK tables** (`users`, `services`, `portfolio_gallery_assets`, `blog_posts`, `team_members`, `proposals`, `deliverables`, `project_files`, `billing_records`, `applications`, `offers`, `task_submissions`, `certificates`) before delete (`409` if in use) | Removes unused bucket file + DB row cleanly. |
| `GET /api/v1/admin/subscribers` | `broadcasts:read` / `export` (`super_admin` export) | View synced `newsletter_subscribers` list and export opt-in CSV (`super_admin` ONLY) | Respects DPDP & suppression status. |
| `GET / POST / PATCH / DELETE /api/v1/admin/broadcasts` (`/[id]`) | `broadcasts:read` / `create` / `update` / `delete` | Manage `broadcast_campaigns` drafts & Audience segment filters | Draft management (`content_manager` + `admin`). |
| `POST /api/v1/admin/broadcasts/test` | `broadcasts:update` (`content_manager` / `admin`) | `{ campaignId }` -> sends sanitized test preview to authenticated caller's verified email only | Allows editors/content managers to proof drafts without live send rights. |
| `POST /api/v1/admin/broadcasts/send` | `broadcasts:publish` (`admin` / `super_admin` ONLY) | `{ campaignId }` -> renders sanitized server-side Markdown HTML with RFC 8058 unsubscribe footer -> triggers Resend Broadcast API | Logs `BROADCAST_SENT` in `audit_logs`; blocks raw unvalidated client HTML. |
| `GET / POST / PATCH /api/v1/admin/users` (`/[id]`) | `users:read` / `manage` | Invite users, assign/revoke roles (**blocks `admin` self-escalation or editing `super_admin`**), suspend account | Suspension calls `auth.admin.signOut` + increments `session_version`; audited `CRITICAL`. |
| `GET /api/v1/admin/audit-logs` | `audit_logs:read` | Filterable by `actor`, `resource_type`, `dateRange` | Read-only redacted audit stream (`auditor`, `admin`, `super_admin`). |

### 3.3 Portal 2 — Client Portal & Internal Delivery Ops (`/api/v1/client/*`, `/api/v1/ops/*`)
| Method & Route | Permission Required | Request / Purpose | Response & Tenant Isolation |
|---|---|---|---|
| `GET /api/v1/client/projects` | `client_projects:read` (Org) | List active projects for caller's `organization_id` | Strictly filtered via `organization_members` + RLS. |
| `GET /api/v1/client/projects/[id]` | `client_projects:read` (Org) | Project overview, milestones, deliverables, team contacts (**strictly NO billing records returned here**) | Returns `404` if project belongs to another org. |
| `POST / PATCH /api/v1/ops/projects`, `/ops/milestones`, `/ops/deliverables` | `client_projects:*` (`operations_manager` / `admin`) | Staff ops create/update project phase, add milestones, stage deliverables (`file_asset_id`) | Audited; triggers Client Portal notifications. |
| `POST /api/v1/client/deliverables/[id]/review` | `deliverables:approve` (`client_admin` only) | `{ decision: 'approved'|'changes_requested', feedback? }` | Updates deliverable, notifies `operations_manager` via Resend, writes `audit_logs`. |
| `GET / POST /api/v1/client/projects/[id]/messages` | `files_messages:read` / `create` (Org) | Project communication thread (`project_messages`) | Tenant RLS; `client_viewer` read-only. |
| `GET / POST /api/v1/client/files` & `GET /.../files/[assetId]/download` | `files_messages:create` / `read` (Org) | Register project file (`project_files`) after committed upload, or issue `60s` signed Storage download URL | Private vault only; `404` cross-org. |
| `GET / POST / PATCH /api/v1/client/tickets` (`/[id]`) & `.../tickets/[id]/comments` | `tickets:read` / `create` / `update` (Org) | Manage support tickets & comment replies (`is_internal = true` hidden from Client roles; settable only by `operations_manager`/`admin`) | Ops internal comments excluded via RLS. |
| `GET /api/v1/client/billing` & `GET /.../billing/[id]/download` | **`billing:read` (`client_admin` / Ops / Admin ONLY)** | List invoice/billing records and issue `60s` signed PDF download | **Returns `403`/`404` for `client_member` & `client_viewer`!** |
| `POST / PATCH /api/v1/ops/billing` (`/[id]`) | `billing:create` / `update` (`operations_manager` / `admin`) | Create drafts, issue (with attached PDF), or mark paid/void project `billing_records` | Strictly staff ops only. |
| `DELETE /api/v1/ops/billing/[id]` | **`billing:delete` (`admin` / `super_admin` ONLY)** | Soft-void or delete erroneous draft billing record | Denied to `operations_manager` per `11` §3.4 matrix. |
| `GET / POST / PATCH / DELETE /api/v1/client/team` (`/[memberId]`) | `client_org:manage` (`client_admin` only) | View own org team, invite/update/remove `client_member`/`client_viewer` (protects last `client_admin`) | Scoped strictly to own `organization_id`. |
| `GET / PATCH /api/v1/client/settings` | Own `users.notification_preferences` | Read/update own email/portal notification preferences (`Client` org admins use `/client/team` for members) | Self `user_id = (SELECT auth.uid())`. |

### 3.4 Portal 3 — Intern Portal (`/api/v1/intern/*`)
| Method & Route | Permission Required | Request / Purpose | Response & Isolation |
|---|---|---|---|
| `GET /api/v1/intern/dashboard` | `intern_enrollment:read` | Active cohort, onboarding status, mentor info, own tasks summary | Intern sees own record; Mentor sees assigned mentees only. |
| `GET / POST / PATCH /api/v1/intern/programs` (`/[id]`) & `.../enrollments` | `internship_programs:*` / `intern_enrollment:*` | Manage cohorts (`attendance_enabled` flag) and assign mentors/interns | Coordinator / Admin managed. |
| `PATCH /api/v1/intern/onboarding` | `intern_enrollment:update` (Own) | Mark onboarding checklist items, `nda_accepted_at`, `policy_accepted_at` | Updates `onboarding_status`; audited. |
| `GET / POST / PATCH / DELETE /api/v1/intern/announcements` (`/[id]`) | `cohort_announcements:*` | Read, post, edit, or remove cohort-wide notices (`cohort_announcements`) | Scoped to enrolled `program_id`. |
| `GET / POST / PATCH /api/v1/intern/tasks` (`/[id]`) | `intern_tasks:create` / `read` / `update` | Mentors assign tasks; Interns update own task `status` | Strictly own/mentee RLS. |
| `GET / POST /api/v1/intern/tasks/[id]/submit` | `task_submissions:create` (Own) | `{ submissionUrl?, fileAssetId?, notes }` | Transitions task -> `submitted`; notifies Mentor. |
| `POST /api/v1/intern/tasks/[id]/review` | `task_submissions:approve` (`mentor` / `internship_admin`) | `{ decision: 'completed'|'revision_requested', rating, mentorFeedback }` | Updates task + notifies Intern; invisible to peer interns. |
| `GET / POST / PATCH /api/v1/intern/attendance` (`/[id]`) | `attendance:read` / `create` / `update` | Daily attendance view/check-in/correction (`404` when `attendance_enabled = false`) | Intern own check-in; Mentor assigned mentees. |
| `POST /api/v1/intern/certificates/issue` & `GET /.../certificates/[id]/download` | `certificates:approve` / `read` | Generates unique `certificate_code` + `@react-pdf/renderer` PDF + signed download (`60s`); supports `PATCH .../revoke` | Audited revocation. |

### 3.5 Portal 4 — Recruitment Portal (`/api/v1/recruitment/*`)
| Method & Route | Permission Required | Request / Purpose | Response & Confidentiality |
|---|---|---|---|
| `GET / POST / PATCH / DELETE /api/v1/recruitment/jobs` (`/[id]`) | `jobs:*` | Create/edit/open/close job & internship requisitions (`target_program_id` supported) | Revalidates `careers`, `career:{slug}`, `sitemap`. |
| `GET / PATCH /api/v1/recruitment/applications` (`/[id]`) | `applications:read` / `update` | Filter pipeline by stage/posting; move stage (`screening`, `interview`, etc.) | Never exposes private scorecards to `candidate`. |
| `GET /api/v1/recruitment/applications/[id]/resume` | `applications:read` | Verify HR/Hiring Manager access to posting | Returns `60s` signed resume URL; logs `RESUME_ACCESSED` audit. |
| `GET / POST / PATCH / DELETE /api/v1/recruitment/interviews` (`/[id]`) | `interviews:*` | List, schedule, reschedule, or cancel interview slots + trigger Resend emails | Candidate sees schedule metadata only. |
| `GET / POST / PATCH / DELETE /api/v1/recruitment/notes` (`/[id]`) | `recruitment_notes:*` | Confidential interview scorecards & screening notes (`hiring_manager` / `recruiter` / `recruitment_admin`) | Strictly confidential (`403` to `candidate` & non-HR). |
| `GET / POST / PATCH /api/v1/recruitment/offers` (`/[id]`) & `.../offers/[id]/accept` | `offers:*` | Extend offer, mask compensation from `recruiter`, accept & convert -> `intern_enrollments` or Staff onboarding | `Idempotency-Key` enforced on acceptance conversion. |
| `GET /api/v1/recruitment/retention` & `POST .../applications/[id]/erase` | `retention:read` / `delete` (`recruitment_admin` ONLY) | Review DPDP expiry queue (`180d`) and trigger immediate erasure cascade across `applications`, Storage, `email_events`, Resend | Audited with PII-redacted record. |

### 3.6 Portal 5 — Sales Team Portal (`/api/v1/sales/*`)
| Method & Route | Permission Required | Request / Purpose | Response & Ownership |
|---|---|---|---|
| `GET / POST / PATCH / DELETE /api/v1/sales/leads` (`/[id]`) | `leads:*` | List assigned/unassigned leads (`sales_rep`) or all (`sales_manager`), create manual lead (`assigned_to = auth.uid()` forced for rep), claim/assign, delete (`sales_admin` only) | Enforces `assigned_to` ownership for `sales_rep`. |
| `GET / POST / PATCH /api/v1/sales/organizations` & `.../contacts` | `contacts_orgs:*` | Manage prospect/client organizations & contacts linked to leads/opportunities | `sales_rep` scoped to linked accounts. |
| `GET / POST / PATCH /api/v1/sales/opportunities` (`/[id]`) | `opportunities:*` | Manage pipeline stages (`discovery` -> `won`/`lost`), `estimatedValueMinor`, `currency` | Requires `lostReason` when `pipelineStage = 'lost'`. |
| `GET / POST / PATCH /api/v1/sales/proposals` (`/[id]`) | `opportunities:*` | Versioned scope/pricing proposals + signed PDF attachments (`private-vault`) | Isolated from HR/Intern portals. |
| `GET / POST / PATCH /api/v1/sales/activities` (`/[id]`) | `sales_activities:read` / `create` / `update` | Log call/meeting/email/WhatsApp follow-up, mark `completed_at`, update reminder | Appends timeline & updates `leads.last_contacted_at`. |
| `GET /api/v1/sales/reports` | `sales_reports:read` | Funnel conversion metrics & rep activity (`sales_rep` own stats; manager team stats) | Real DB queries only. |
| `POST /api/v1/sales/opportunities/[id]/convert` | `opportunities:approve` (`sales_manager` / `operations_manager` / `admin`) | Calls PostgreSQL RPC `convert_opportunity_to_project(...)` -> `client_projects` + `client_admin` invite | Guarded by `Idempotency-Key` + DB transaction; audited. |

### 3.7 Scheduled Cron Jobs (`/api/v1/cron/*` — Vercel Cron `GET` + `CRON_SECRET` Bearer Auth)
*(Vercel Cron invokes scheduled routes via HTTP `GET` with `Authorization: Bearer <CRON_SECRET>`; optionally allow `POST` for manual `super_admin` smoke triggers.)*

| Route | Schedule | Purpose |
|---|---|---|
| `GET /api/v1/cron/retention-purge` | Daily `02:00 UTC` | Anonymize expired `180d` rejected applications (`talent_pool_consent = false`), delete Storage resumes + orphaned `media_assets` rows + >24h temporary uploads, mask `email_events.recipient_email`, and archive `24m` stale enquiries. |
| `GET /api/v1/cron/publish-scheduled` | Every `15 mins` | Flip `blog_posts` where `status = 'scheduled' AND scheduled_for <= now()` -> `'published'` and fire `revalidateTag('insights')` + `revalidateTag('sitemap')`. |
| `GET /api/v1/cron/resend-retry` | Every `15 mins` | Flush queued `deferred_quota` or transient-failed `email_events` when UTC daily count resets (`< 80/100`), obeying `email_suppressions`. |
| `GET /api/v1/cron/storage-backup` | Daily `03:00 UTC` | Sync encrypted off-site snapshot of `public-media` & `private-vault` Storage objects (since Supabase Pro snapshots omit Storage binaries). |

---

## 4. Cache Invalidation & Revalidation Map

| CMS / Portal / Cron Mutation | Cache Tags Revalidated (`revalidateTag`) | Public Impact |
|---|---|---|
| Page publish / update / rollback | `page:{slug}`, `navigation` | Immediate ISR refresh |
| Service publish / edit / delete | `services`, `service:{slug}`, `sitemap` | Homepage blueprint + `/services/*` + XML sitemap |
| Work / Reference Blueprint edit | `work`, `work:{slug}`, `sitemap` | `/work` + detail page (`Client Work` tab toggles dynamically) |
| Blog article / category publish or scheduled cron | `insights`, `insight:{slug}`, `blog-categories`, `sitemap` | Homepage updates + `/insights/*` |
| Team member / Testimonial publish | `team`, `testimonials` | `/about` + Homepage |
| Job posting open / close | `careers`, `career:{slug}`, `sitemap` | `/careers` + `/careers/internships` |
| Redirects / Global Settings | `redirects` (+ Upstash Edge redirect cache invalidation), `site-settings` | Global header/footer/routing (`proxy.ts` synced within seconds) |

---

## 5. Acceptance Criteria & Cross-References

- Every endpoint specifies HTTP method, route, auth, exact RBAC permission, Zod validation, idempotency/rate limits, failure behavior, and audit hook.
- **Cross-References:** `11_RBAC_AND_AUTHORIZATION_MATRIX.md`, `12_DATABASE_ARCHITECTURE_AND_ERD.md`, `16_SECURITY_PRIVACY_AND_THREAT_MODEL.md`.
