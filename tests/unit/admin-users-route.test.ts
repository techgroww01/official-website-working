import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import type { CanonicalRole } from "@/lib/rbac/roles";

const {
  mockRequirePermission,
  mockWriteRedactedAuditLog,
  mockIsSupabaseAdminConfigured,
  mockGetSupabaseAdminClient,
} = vi.hoisted(() => ({
  mockRequirePermission: vi.fn(),
  mockWriteRedactedAuditLog: vi.fn(),
  mockIsSupabaseAdminConfigured: vi.fn(),
  mockGetSupabaseAdminClient: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  requirePermission: mockRequirePermission,
  writeRedactedAuditLog: mockWriteRedactedAuditLog,
}));

vi.mock("@/lib/supabase/admin", () => ({
  isSupabaseAdminConfigured: mockIsSupabaseAdminConfigured,
  getSupabaseAdminClient: mockGetSupabaseAdminClient,
}));

import { GET, PATCH } from "@/app/api/v1/admin/users/route";

const ACTOR_ID = "11111111-1111-4111-8111-111111111111";
const TARGET_ID = "22222222-2222-4222-8222-222222222222";

function makePatchRequest(body: unknown, headers?: Record<string, string>) {
  return new NextRequest("http://localhost:3000/api/v1/admin/users", {
    method: "PATCH",
    headers: {
      host: "localhost:3000",
      origin: "http://localhost:3000",
      "content-type": "application/json",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function makeAuthOk(roles: CanonicalRole[] = ["admin"], userId = ACTOR_ID) {
  return {
    ok: true as const,
    auth: {
      userId,
      email: "admin@techgroww.co.in",
      fullName: "Workspace Admin",
      accountClass: "internal" as const,
      roles,
      organizationIds: [],
      aal: "aal2",
      sessionVersion: 1,
    },
  };
}

describe("/api/v1/admin/users", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWriteRedactedAuditLog.mockResolvedValue(undefined);
  });

  it("GET returns 401 when requirePermission('users', 'read') fails", async () => {
    mockRequirePermission.mockResolvedValue({
      ok: false,
      response: NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      ),
    });

    const res = await GET();
    const json = (await res.json()) as { ok: boolean; error: { code: string } };

    expect(res.status).toBe(401);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe("UNAUTHORIZED");
    expect(mockRequirePermission).toHaveBeenCalledWith("users", "read");
  });

  it("GET returns empty users array with demoMode when Supabase is unconfigured", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk());
    mockIsSupabaseAdminConfigured.mockReturnValue(false);

    const res = await GET();
    const json = (await res.json()) as {
      ok: boolean;
      data: { users: unknown[]; demoMode: boolean };
    };

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.data).toEqual({ users: [], demoMode: true });
  });

  it("GET formats users and nested role slugs when Supabase is configured, and handles DB error", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk());
    mockIsSupabaseAdminConfigured.mockReturnValue(true);

    const orderMock = vi.fn().mockResolvedValueOnce({
      data: [
        {
          id: TARGET_ID,
          email: "staff@techgroww.co.in",
          full_name: "Staff Member",
          account_class: "internal",
          status: "active",
          mfa_enabled: true,
          last_login_at: "2026-01-15T10:00:00Z",
          created_at: "2026-01-01T00:00:00Z",
          user_roles: [{ role: { slug: "editor", label: "Editor" } }],
        },
      ],
      error: null,
    });
    const isMock = vi.fn().mockReturnValue({ order: orderMock });
    const selectMock = vi.fn().mockReturnValue({ is: isMock });
    mockGetSupabaseAdminClient.mockReturnValue({
      from: vi.fn().mockReturnValue({ select: selectMock }),
    });

    const res = await GET();
    const json = (await res.json()) as {
      ok: boolean;
      data: { users: Array<{ id: string; roles: string[] }> };
    };

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.data.users[0]?.id).toBe(TARGET_ID);
    expect(json.data.users[0]?.roles).toEqual(["editor"]);

    orderMock.mockResolvedValueOnce({ data: null, error: { message: "DB failed" } });
    const errRes = await GET();
    const errJson = (await errRes.json()) as { ok: boolean; error: { code: string } };
    expect(errRes.status).toBe(500);
    expect(errJson.error.code).toBe("DB_ERROR");
  });

  it("PATCH rejects cross-origin request with 403 CSRF_REJECTED", async () => {
    const res = await PATCH(
      makePatchRequest(
        { userId: TARGET_ID, status: "active" },
        { origin: "https://evil.example.com" }
      )
    );
    const json = (await res.json()) as { ok: boolean; error: { code: string } };

    expect(res.status).toBe(403);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe("CSRF_REJECTED");
    expect(mockRequirePermission).not.toHaveBeenCalled();
  });

  it("PATCH returns 403 when requirePermission('users', 'update') fails", async () => {
    mockRequirePermission.mockResolvedValue({
      ok: false,
      response: NextResponse.json(
        { ok: false, error: { code: "FORBIDDEN", message: "Insufficient permission" } },
        { status: 403 }
      ),
    });

    const res = await PATCH(makePatchRequest({ userId: TARGET_ID, status: "active" }));
    const json = (await res.json()) as { ok: boolean; error: { code: string } };

    expect(res.status).toBe(403);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe("FORBIDDEN");
    expect(mockRequirePermission).toHaveBeenCalledWith("users", "update");
  });

  it("PATCH rejects invalid JSON (400 INVALID_JSON) and invalid Zod fields (400 VALIDATION_ERROR)", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk());

    const invalidJsonRes = await PATCH(makePatchRequest("{not-valid-json"));
    const invalidJsonBody = (await invalidJsonRes.json()) as { error: { code: string } };
    expect(invalidJsonRes.status).toBe(400);
    expect(invalidJsonBody.error.code).toBe("INVALID_JSON");

    const invalidZodRes = await PATCH(
      makePatchRequest({ userId: "not-a-uuid", status: "unknown_status", extra: true })
    );
    const invalidZodBody = (await invalidZodRes.json()) as { error: { code: string } };
    expect(invalidZodRes.status).toBe(400);
    expect(invalidZodBody.error.code).toBe("VALIDATION_ERROR");
  });

  it("PATCH rejects unknown roleSlugs against VALID_ROLE_SET with 400 INVALID_ROLE", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk(["super_admin"]));

    const res = await PATCH(
      makePatchRequest({ userId: TARGET_ID, roleSlugs: ["invalid_role"] })
    );
    const json = (await res.json()) as { ok: boolean; error: { code: string } };

    expect(res.status).toBe(400);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe("INVALID_ROLE");
  });

  it("PATCH blocks non-super_admin from granting super_admin and from modifying own roles", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk(["admin"], ACTOR_ID));

    const grantSuperRes = await PATCH(
      makePatchRequest({ userId: TARGET_ID, roleSlugs: ["super_admin"] })
    );
    const grantSuperJson = (await grantSuperRes.json()) as { error: { code: string } };
    expect(grantSuperRes.status).toBe(403);
    expect(grantSuperJson.error.code).toBe("FORBIDDEN_ROLE");

    const selfEscRes = await PATCH(
      makePatchRequest({ userId: ACTOR_ID, roleSlugs: ["sales_admin"] })
    );
    const selfEscJson = (await selfEscRes.json()) as { error: { code: string } };
    expect(selfEscRes.status).toBe(403);
    expect(selfEscJson.error.code).toBe("SELF_ROLE_MODIFICATION_BLOCKED");
  });

  it("PATCH blocks non-super_admin from modifying an existing super_admin target user", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk(["admin"], ACTOR_ID));
    mockIsSupabaseAdminConfigured.mockReturnValue(true);

    const eqMock = vi.fn().mockResolvedValue({
      data: [{ role: { slug: "super_admin" } }],
      error: null,
    });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    mockGetSupabaseAdminClient.mockReturnValue({
      from: vi.fn().mockReturnValue({ select: selectMock }),
    });

    const res = await PATCH(
      makePatchRequest({ userId: TARGET_ID, status: "suspended" })
    );
    const json = (await res.json()) as { ok: boolean; error: { code: string } };

    expect(res.status).toBe(403);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe("FORBIDDEN_ROLE");
  });

  it("PATCH blocks self-suspension/deactivation with 400 SELF_SUSPENSION_BLOCKED", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk(["super_admin"], ACTOR_ID));

    const res = await PATCH(
      makePatchRequest({ userId: ACTOR_ID, status: "suspended" })
    );
    const json = (await res.json()) as { ok: boolean; error: { code: string } };

    expect(res.status).toBe(400);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe("SELF_SUSPENSION_BLOCKED");
  });

  it("PATCH returns demoMode success when Supabase is unconfigured", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk(["admin"], ACTOR_ID));
    mockIsSupabaseAdminConfigured.mockReturnValue(false);

    const res = await PATCH(
      makePatchRequest({ userId: TARGET_ID, status: "active" })
    );
    const json = (await res.json()) as {
      ok: boolean;
      data: { updated: boolean; userId: string; demoMode: boolean };
    };

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.data).toEqual({
      updated: true,
      userId: TARGET_ID,
      demoMode: true,
    });
  });

  it("PATCH updates status, invokes increment_session_version, persists roleSlugs, and writes audit log", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk(["admin"], ACTOR_ID));
    mockIsSupabaseAdminConfigured.mockReturnValue(true);

    const targetRolesEqMock = vi.fn().mockResolvedValue({
      data: [{ role: { slug: "editor" } }],
      error: null,
    });
    const usersUpdateEqMock = vi.fn().mockResolvedValue({ error: null });
    const usersUpdateMock = vi.fn().mockReturnValue({ eq: usersUpdateEqMock });
    const rolesInMock = vi.fn().mockResolvedValue({
      data: [{ id: "role-id-1", slug: "content_manager" }],
      error: null,
    });
    const userRolesDeleteEqMock = vi.fn().mockResolvedValue({ error: null });
    const userRolesInsertMock = vi.fn().mockResolvedValue({ error: null });
    const rpcMock = vi.fn().mockResolvedValue({ data: null, error: null });

    const fromMock = vi.fn((table: string) => {
      if (table === "user_roles") {
        return {
          select: vi.fn().mockReturnValue({ eq: targetRolesEqMock }),
          delete: vi.fn().mockReturnValue({ eq: userRolesDeleteEqMock }),
          insert: userRolesInsertMock,
        };
      }
      if (table === "users") {
        return {
          update: usersUpdateMock,
        };
      }
      if (table === "roles") {
        return {
          select: vi.fn().mockReturnValue({ in: rolesInMock }),
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    mockGetSupabaseAdminClient.mockReturnValue({
      from: fromMock,
      rpc: rpcMock,
    });

    const res = await PATCH(
      makePatchRequest({
        userId: TARGET_ID,
        status: "suspended",
        roleSlugs: ["content_manager"],
      })
    );
    const json = (await res.json()) as {
      ok: boolean;
      data: { updated: boolean; userId: string };
    };

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.data).toEqual({ updated: true, userId: TARGET_ID });
    expect(usersUpdateMock).toHaveBeenCalledWith({ status: "suspended" });
    expect(usersUpdateEqMock).toHaveBeenCalledWith("id", TARGET_ID);
    expect(rolesInMock).toHaveBeenCalledWith("slug", ["content_manager"]);
    expect(userRolesDeleteEqMock).toHaveBeenCalledWith("user_id", TARGET_ID);
    expect(userRolesInsertMock).toHaveBeenCalledWith([
      {
        user_id: TARGET_ID,
        role_id: "role-id-1",
        granted_by: ACTOR_ID,
      },
    ]);
    expect(rpcMock).toHaveBeenCalledWith("increment_session_version", {
      p_user_id: TARGET_ID,
    });
    expect(mockWriteRedactedAuditLog).toHaveBeenCalledWith({
      actorUserId: ACTOR_ID,
      actorRoles: ["admin"],
      action: "USER_ADMIN_UPDATED",
      resourceType: "users",
      resourceId: TARGET_ID,
      changedFields: ["userId", "status", "roleSlugs"],
    });
  });

  it("PATCH returns 500 DB_ERROR when status update fails and falls back cleanly when increment_session_version RPC errors", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk(["super_admin"], ACTOR_ID));
    mockIsSupabaseAdminConfigured.mockReturnValue(true);

    // Case 1: users.update fails
    const failUpdateEq = vi.fn().mockResolvedValue({ error: { message: "Update failed" } });
    mockGetSupabaseAdminClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({ eq: failUpdateEq }),
      }),
      rpc: vi.fn(),
    });

    const failRes = await PATCH(
      makePatchRequest({ userId: TARGET_ID, status: "suspended" })
    );
    const failJson = (await failRes.json()) as { ok: boolean; error: { code: string } };
    expect(failRes.status).toBe(500);
    expect(failJson.error.code).toBe("DB_ERROR");

    // Case 2: RPC errors -> fallback increments session_version directly
    const statusUpdateEq = vi.fn().mockResolvedValue({ error: null });
    const sessionVersionUpdateEq = vi.fn().mockResolvedValue({ error: null });
    const usersUpdateMock = vi
      .fn()
      .mockReturnValueOnce({ eq: statusUpdateEq })
      .mockReturnValueOnce({ eq: sessionVersionUpdateEq });
    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: { session_version: 2 },
      error: null,
    });
    const usersSelectEq = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const rpcMock = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "function increment_session_version does not exist" },
    });

    mockGetSupabaseAdminClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        update: usersUpdateMock,
        select: vi.fn().mockReturnValue({ eq: usersSelectEq }),
      }),
      rpc: rpcMock,
    });

    const fallbackRes = await PATCH(
      makePatchRequest({ userId: TARGET_ID, status: "deactivated" })
    );
    const fallbackJson = (await fallbackRes.json()) as {
      ok: boolean;
      data: { updated: boolean; userId: string };
    };

    expect(fallbackRes.status).toBe(200);
    expect(fallbackJson.ok).toBe(true);
    expect(rpcMock).toHaveBeenCalledWith("increment_session_version", {
      p_user_id: TARGET_ID,
    });
    expect(usersUpdateMock).toHaveBeenNthCalledWith(2, { session_version: 3 });
  });
});
