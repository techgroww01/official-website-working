import { ALL_CANONICAL_ROLES, type CanonicalRole } from "./roles";

/**
 * Canonical Deny-by-Default Resource x Action Matrix.
 * Matches docs/techgroww/11_RBAC_AND_AUTHORIZATION_MATRIX.md Section 3.
 */
export type RbacAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "approve"
  | "publish"
  | "assign"
  | "export"
  | "manage"
  | "audit";

export type RbacResource =
  | "cms_pages"
  | "services"
  | "blog"
  | "portfolio"
  | "media"
  | "navigation_seo"
  | "team_testimonials"
  | "broadcasts"
  | "settings"
  | "users"
  | "audit_logs"
  | "leads"
  | "contacts_orgs"
  | "opportunities"
  | "sales_activities"
  | "sales_reports"
  | "jobs"
  | "applications"
  | "interviews"
  | "recruitment_notes"
  | "offers"
  | "retention"
  | "client_org"
  | "client_projects"
  | "deliverables"
  | "files_messages"
  | "tickets"
  | "billing"
  | "internship_programs"
  | "intern_enrollment"
  | "cohort_announcements"
  | "intern_tasks"
  | "task_submissions"
  | "attendance"
  | "certificates";

type RoleMatrix = Partial<Record<RbacResource, readonly RbacAction[]>>;

const CMS_READ_ONLY: readonly RbacAction[] = ["read"];
const CRUD_FULL: readonly RbacAction[] = ["create", "read", "update", "delete"];
const CMS_FULL: readonly RbacAction[] = ["create", "read", "update", "delete", "approve", "publish"];

const MATRIX: Record<CanonicalRole, RoleMatrix> = {
  super_admin: {
    cms_pages: CMS_FULL,
    services: CMS_FULL,
    blog: CMS_FULL,
    portfolio: CMS_FULL,
    media: [...CRUD_FULL, "manage"],
    navigation_seo: [...CRUD_FULL, "manage"],
    team_testimonials: CMS_FULL,
    broadcasts: [...CRUD_FULL, "publish", "export"],
    settings: ["read", "update", "manage"],
    users: [...CRUD_FULL, "manage"],
    audit_logs: ["read", "audit"], // Never update/delete
    leads: ["read", "update", "assign", "export"],
    contacts_orgs: ["read", "update"],
    opportunities: ["read", "approve"],
    sales_activities: ["read"],
    sales_reports: ["read", "export"],
    jobs: ["read", "publish"],
    applications: ["read"],
    interviews: ["read"],
    recruitment_notes: ["read"],
    offers: ["read", "approve"],
    retention: ["read"],
    client_org: ["create", "read", "update", "manage"],
    client_projects: ["create", "read", "update", "manage"],
    deliverables: ["create", "read", "update"],
    files_messages: CRUD_FULL,
    tickets: ["read", "update", "assign"],
    billing: CRUD_FULL,
    internship_programs: ["read", "publish"],
    intern_enrollment: ["read"],
    cohort_announcements: ["read"],
    intern_tasks: ["read"],
    task_submissions: ["read"],
    attendance: ["read", "approve"],
    certificates: ["read", "approve"],
  },
  admin: {
    cms_pages: CMS_FULL,
    services: CMS_FULL,
    blog: CMS_FULL,
    portfolio: CMS_FULL,
    media: [...CRUD_FULL, "manage"],
    navigation_seo: [...CRUD_FULL, "manage"],
    team_testimonials: CMS_FULL,
    broadcasts: [...CRUD_FULL, "publish"], // export is super_admin only
    settings: ["read", "update", "manage"],
    users: ["create", "read", "update", "manage"], // Cannot delete/modify super_admin or self-escalate
    audit_logs: ["read", "audit"],
    leads: ["read", "update", "assign", "export"],
    contacts_orgs: ["read", "update"],
    opportunities: ["read", "approve"],
    sales_activities: ["read"],
    sales_reports: ["read", "export"],
    jobs: ["read", "publish"],
    applications: ["read"],
    interviews: ["read"],
    recruitment_notes: ["read"],
    offers: ["read", "approve"],
    retention: ["read"],
    client_org: ["create", "read", "update", "manage"],
    client_projects: ["create", "read", "update", "manage"],
    deliverables: ["create", "read", "update"],
    files_messages: CRUD_FULL,
    tickets: ["read", "update", "assign"],
    billing: CRUD_FULL,
    internship_programs: ["read", "publish"],
    intern_enrollment: ["read"],
    cohort_announcements: ["read"],
    intern_tasks: ["read"],
    task_submissions: ["read"],
    attendance: ["read", "approve"],
    certificates: ["read", "approve"],
  },
  content_manager: {
    cms_pages: CMS_FULL,
    services: CMS_FULL,
    blog: CMS_FULL,
    portfolio: CMS_FULL,
    media: CRUD_FULL,
    navigation_seo: ["read", "update"],
    team_testimonials: ["create", "read", "update"], // is_public / is_approved forced false
    broadcasts: ["create", "read", "update"], // Draft & self-test only
  },
  editor: {
    cms_pages: ["create", "read", "update"],
    services: ["create", "read", "update"],
    blog: ["create", "read", "update"],
    portfolio: ["create", "read", "update"],
    media: ["create", "read", "update"],
  },
  operations_manager: {
    cms_pages: CMS_READ_ONLY,
    services: CMS_READ_ONLY,
    blog: CMS_READ_ONLY,
    portfolio: CMS_READ_ONLY,
    media: CMS_READ_ONLY,
    settings: CMS_READ_ONLY,
    leads: CMS_READ_ONLY,
    contacts_orgs: CMS_READ_ONLY,
    opportunities: ["read", "approve"], // Won deal handoff conversion
    client_org: ["create", "read", "update"],
    client_projects: ["create", "read", "update", "assign"],
    deliverables: ["create", "read", "update"],
    files_messages: ["create", "read", "update"],
    tickets: ["read", "update", "assign", "manage"],
    billing: ["create", "read", "update"], // Explicitly NO delete!
  },
  auditor: {
    cms_pages: CMS_READ_ONLY,
    services: CMS_READ_ONLY,
    blog: CMS_READ_ONLY,
    portfolio: CMS_READ_ONLY,
    media: CMS_READ_ONLY,
    navigation_seo: CMS_READ_ONLY,
    team_testimonials: CMS_READ_ONLY,
    broadcasts: CMS_READ_ONLY,
    settings: CMS_READ_ONLY,
    users: CMS_READ_ONLY,
    audit_logs: ["read", "audit"],
  },
  sales_admin: {
    leads: [...CRUD_FULL, "assign", "export", "manage"],
    contacts_orgs: [...CRUD_FULL, "export"],
    opportunities: [...CRUD_FULL, "approve", "export", "manage"],
    sales_activities: [...CRUD_FULL, "export"],
    sales_reports: ["read", "export", "manage"],
  },
  sales_manager: {
    leads: ["create", "read", "update", "assign", "export"],
    contacts_orgs: ["create", "read", "update", "export"],
    opportunities: ["create", "read", "update", "approve", "export"],
    sales_activities: ["create", "read", "update", "export"],
    sales_reports: ["read", "export"],
  },
  sales_rep: {
    leads: ["create", "read", "update"],
    contacts_orgs: ["create", "read", "update"],
    opportunities: ["create", "read", "update"],
    sales_activities: ["create", "read", "update"],
    sales_reports: ["read"],
  },
  recruitment_admin: {
    jobs: [...CRUD_FULL, "publish", "manage"],
    applications: ["read", "update", "delete", "assign", "export", "manage"],
    interviews: [...CRUD_FULL, "manage"],
    recruitment_notes: [...CRUD_FULL, "manage"],
    offers: [...CRUD_FULL, "approve", "manage"],
    retention: ["read", "delete", "manage"], // Exclusive DPDP erasure owner
  },
  hiring_manager: {
    jobs: ["create", "read", "update", "approve"],
    applications: ["read", "update"],
    interviews: ["create", "read", "update", "approve"],
    recruitment_notes: ["create", "read", "update", "approve"],
    offers: ["create", "read", "approve"],
  },
  recruiter: {
    jobs: ["create", "read", "update"],
    applications: ["read", "update", "assign"],
    interviews: ["create", "read", "update"],
    recruitment_notes: ["create", "read", "update"],
    offers: ["read"], // Compensation strictly masked at serializer/API layer
  },
  internship_admin: {
    internship_programs: [...CRUD_FULL, "publish", "manage"],
    intern_enrollment: ["create", "read", "update", "assign", "manage"],
    cohort_announcements: CRUD_FULL,
    intern_tasks: [...CRUD_FULL, "assign", "manage"],
    task_submissions: ["read", "update", "approve", "export"],
    attendance: ["create", "read", "update", "approve", "manage"],
    certificates: ["create", "read", "update", "approve", "manage"],
  },
  internship_coordinator: {
    internship_programs: ["create", "read", "update"],
    intern_enrollment: ["create", "read", "update", "assign"],
    cohort_announcements: ["create", "read", "update"],
    intern_tasks: ["create", "read", "update", "assign"],
    task_submissions: ["read", "update"],
    attendance: ["create", "read", "update", "approve"],
    certificates: ["create", "read", "update", "approve"],
  },
  mentor: {
    internship_programs: ["read"],
    intern_enrollment: ["read"],
    cohort_announcements: ["create", "read", "update"],
    intern_tasks: ["create", "read", "update", "assign"],
    task_submissions: ["read", "update", "approve"],
    attendance: ["create", "read", "update"],
    certificates: ["read"],
  },
  client_admin: {
    client_org: ["create", "read", "update", "delete", "manage"], // Scoped strictly to client_member/viewer in own org
    client_projects: ["read"],
    deliverables: ["read", "approve"],
    files_messages: ["create", "read"],
    tickets: ["create", "read", "update"],
    billing: ["read"], // Strict org isolation
  },
  client_member: {
    client_org: ["read"],
    client_projects: ["read"],
    deliverables: ["read"],
    files_messages: ["create", "read"],
    tickets: ["create", "read", "update"],
    // Billing strictly denied
  },
  client_viewer: {
    client_org: ["read"],
    client_projects: ["read"],
    deliverables: ["read"],
    files_messages: ["read"],
    tickets: ["read"],
    // Billing strictly denied
  },
  intern: {
    internship_programs: ["read"],
    intern_enrollment: ["read", "update"], // Own onboarding update
    cohort_announcements: ["read"],
    intern_tasks: ["read", "update"], // Own task status transition
    task_submissions: ["create", "read"],
    attendance: ["create", "read"], // Self check-in only if feature flag enabled
    certificates: ["read"],
  },
  candidate: {
    jobs: ["read"],
    applications: ["create", "read", "update"], // Withdraw own
    interviews: ["read"], // Schedule metadata only; scorecards denied
    offers: ["read", "approve"], // Accept/Decline own offer
  },
};

export interface PermissionCheckContext {
  actorUserId?: string;
  targetUserId?: string;
  targetRoles?: readonly CanonicalRole[];
}

/**
 * Pure deterministic permission evaluation over a caller's active role set.
 */
export function hasPermission(
  roles: readonly CanonicalRole[],
  resource: RbacResource,
  action: RbacAction,
  ctx?: PermissionCheckContext
): boolean {
  if (!roles || roles.length === 0) return false;

  // Hard invariant: audit_logs cannot be updated, deleted, or managed via app RBAC
  if (resource === "audit_logs" && (action === "update" || action === "delete" || action === "create")) {
    return false;
  }

  // Hard invariant: admin cannot modify super_admin or self-escalate roles
  if (resource === "users" && (action === "update" || action === "delete" || action === "manage")) {
    const isSuperAdmin = roles.includes("super_admin");
    if (!isSuperAdmin) {
      if (ctx?.targetRoles?.includes("super_admin")) {
        return false;
      }
      if (ctx?.actorUserId && ctx?.targetUserId && ctx.actorUserId === ctx.targetUserId) {
        return false;
      }
    }
  }

  return roles.some((role) => {
    const permissions = MATRIX[role]?.[resource];
    return permissions ? permissions.includes(action) : false;
  });
}

/**
 * Sanity check helper exported for Vitest unit tests verifying matrix completeness.
 */
export function getAllMatrixRoles(): readonly CanonicalRole[] {
  return ALL_CANONICAL_ROLES;
}
