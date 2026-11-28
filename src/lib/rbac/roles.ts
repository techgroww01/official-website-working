/**
 * Canonical 20-Role Catalog across 3 Account Classes
 * See docs/techgroww/11_RBAC_AND_AUTHORIZATION_MATRIX.md Section 2.
 */

export const STAFF_ROLES = [
  "super_admin",
  "admin",
  "content_manager",
  "editor",
  "operations_manager",
  "sales_admin",
  "sales_manager",
  "sales_rep",
  "recruitment_admin",
  "hiring_manager",
  "recruiter",
  "internship_admin",
  "internship_coordinator",
  "mentor",
  "auditor",
] as const;

export const CLIENT_ROLES = [
  "client_admin",
  "client_member",
  "client_viewer",
] as const;

export const EXTERNAL_ROLES = ["intern", "candidate"] as const;

export const ALL_CANONICAL_ROLES = [
  ...STAFF_ROLES,
  ...CLIENT_ROLES,
  ...EXTERNAL_ROLES,
] as const;

export type CanonicalRole = (typeof ALL_CANONICAL_ROLES)[number];
export type AccountClass = "staff" | "client" | "intern" | "candidate";

export const MFA_REQUIRED_ROLES: ReadonlySet<CanonicalRole> = new Set([
  "super_admin",
  "admin",
  "operations_manager",
  "sales_admin",
  "recruitment_admin",
  "internship_admin",
]);

export type PortalKey = "admin" | "client" | "intern" | "recruitment" | "sales";

export const PORTAL_ALLOWED_ROLES: Record<PortalKey, ReadonlySet<CanonicalRole>> = {
  admin: new Set([
    "super_admin",
    "admin",
    "content_manager",
    "editor",
    "operations_manager",
    "auditor",
  ]),
  sales: new Set([
    "super_admin",
    "admin",
    "sales_admin",
    "sales_manager",
    "sales_rep",
    "operations_manager",
  ]),
  recruitment: new Set([
    "super_admin",
    "admin",
    "recruitment_admin",
    "hiring_manager",
    "recruiter",
  ]),
  client: new Set([
    "super_admin",
    "admin",
    "operations_manager",
    "client_admin",
    "client_member",
    "client_viewer",
  ]),
  intern: new Set([
    "super_admin",
    "admin",
    "internship_admin",
    "internship_coordinator",
    "mentor",
    "intern",
  ]),
};

export function requiresMfa(roles: readonly CanonicalRole[]): boolean {
  return roles.some((role) => MFA_REQUIRED_ROLES.has(role));
}

export function getAccessiblePortals(roles: readonly CanonicalRole[]): PortalKey[] {
  const portals: PortalKey[] = [];
  (Object.keys(PORTAL_ALLOWED_ROLES) as PortalKey[]).forEach((portal) => {
    const allowed = PORTAL_ALLOWED_ROLES[portal];
    if (roles.some((r) => allowed.has(r))) {
      portals.push(portal);
    }
  });
  return portals;
}

export function getDefaultPortalForRoles(roles: readonly CanonicalRole[]): string {
  const portals = getAccessiblePortals(roles);
  if (portals.includes("admin")) return "/admin";
  if (portals.includes("sales")) return "/sales";
  if (portals.includes("recruitment")) return "/recruitment";
  if (portals.includes("client")) return "/client";
  if (portals.includes("intern")) return "/intern";
  if (roles.includes("candidate")) return "/careers/status";
  return "/";
}
