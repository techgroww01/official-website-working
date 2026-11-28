import { describe, expect, it } from "vitest";
import { ALL_CANONICAL_ROLES, getAccessiblePortals } from "@/lib/rbac/roles";
import { hasPermission } from "@/lib/rbac/matrix";

describe("20-Role Canonical RBAC Matrix", () => {
  it("includes all 20 canonical roles", () => {
    expect(ALL_CANONICAL_ROLES.length).toBe(20);
    const unique = new Set(ALL_CANONICAL_ROLES);
    expect(unique.size).toBe(20);
  });

  it("super_admin has comprehensive access across domains", () => {
    expect(hasPermission(["super_admin"], "cms_pages", "publish")).toBe(true);
    expect(hasPermission(["super_admin"], "users", "manage")).toBe(true);
    expect(hasPermission(["super_admin"], "audit_logs", "read")).toBe(true);
    // super_admin cannot delete audit logs (immutable)
    expect(hasPermission(["super_admin"], "audit_logs", "delete")).toBe(false);
  });

  it("editor role can update blog but cannot publish", () => {
    expect(hasPermission(["editor"], "blog", "update")).toBe(true);
    expect(hasPermission(["editor"], "blog", "publish")).toBe(false);
  });

  it("client_member can read projects but cannot access billing", () => {
    expect(hasPermission(["client_member"], "client_projects", "read")).toBe(true);
    expect(hasPermission(["client_member"], "billing", "read")).toBe(false);
  });

  it("client_admin can access billing", () => {
    expect(hasPermission(["client_admin"], "billing", "read")).toBe(true);
  });

  it("intern can view own tasks but cannot view other applicants", () => {
    expect(hasPermission(["intern"], "intern_tasks", "read")).toBe(true);
    expect(hasPermission(["intern"], "applications", "read")).toBe(false);
  });

  it("recruiter can read applications but cannot manage retention purge", () => {
    expect(hasPermission(["recruiter"], "applications", "read")).toBe(true);
    expect(hasPermission(["recruiter"], "retention", "manage")).toBe(false);
  });

  it("recruitment_admin can manage retention purge", () => {
    expect(hasPermission(["recruitment_admin"], "retention", "manage")).toBe(true);
  });

  it("maps accessible portals accurately", () => {
    expect(getAccessiblePortals(["super_admin"])).toContain("admin");
    expect(getAccessiblePortals(["client_admin"])).toEqual(["client"]);
    expect(getAccessiblePortals(["intern"])).toEqual(["intern"]);
    expect(getAccessiblePortals(["sales_rep"])).toEqual(["sales"]);
    expect(getAccessiblePortals(["recruiter"])).toEqual(["recruitment"]);
  });
});
