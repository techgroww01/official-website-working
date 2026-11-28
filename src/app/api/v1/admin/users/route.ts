import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { ALL_CANONICAL_ROLES } from "@/lib/rbac/roles";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const VALID_ROLE_SET = new Set<string>(ALL_CANONICAL_ROLES);

export async function GET() {
  const auth = await requirePermission("users", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({
      users: [],
      demoMode: true,
    });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("users")
    .select("id, email, full_name, account_class, status, mfa_enabled, last_login_at, created_at, user_roles(role:roles(slug, label))")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) return apiError("DB_ERROR", "Failed to load users", 500);

  const formatted = data?.map((u) => ({
    id: u.id,
    email: u.email,
    fullName: u.full_name,
    accountClass: u.account_class,
    status: u.status,
    mfaEnabled: u.mfa_enabled,
    lastLoginAt: u.last_login_at,
    createdAt: u.created_at,
    roles:
      ((u.user_roles as unknown as Array<{ role?: { slug: string; label: string } | null }>)
        ?.map((ur) => ur.role?.slug)
        .filter(Boolean) as string[]) ?? [],
  }));

  return apiOk({ users: formatted ?? [] });
}

const patchUserSchema = z
  .object({
    userId: z.string().uuid(),
    status: z.enum(["invited", "active", "suspended", "deactivated"]).optional(),
    roleSlugs: z.array(z.string()).optional(),
  })
  .strict();

export async function PATCH(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("users", "update");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON payload", 400);

  const parsed = patchUserSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid user parameters", 400, formatZodError(parsed.error));
  }

  if (parsed.data.roleSlugs) {
    const invalidRoles = parsed.data.roleSlugs.filter((slug) => !VALID_ROLE_SET.has(slug));
    if (invalidRoles.length > 0) {
      return apiError("INVALID_ROLE", "One or more role slugs are invalid", 400, {
        invalidRoles,
      });
    }
  }

  // Hard invariants: prevent modifying/granting super_admin or self-role modification without super_admin
  const isSuperAdmin = auth.auth.roles.includes("super_admin");
  if (parsed.data.roleSlugs?.includes("super_admin") && !isSuperAdmin) {
    return apiError("FORBIDDEN_ROLE", "Only super_admin can grant super_admin privilege", 403);
  }

  if (!isSuperAdmin && parsed.data.userId === auth.auth.userId && parsed.data.roleSlugs) {
    return apiError("SELF_ROLE_MODIFICATION_BLOCKED", "You cannot modify your own roles", 403);
  }

  // Prevent users from suspending themselves
  if (parsed.data.userId === auth.auth.userId && parsed.data.status && parsed.data.status !== "active") {
    return apiError("SELF_SUSPENSION_BLOCKED", "You cannot suspend or deactivate your own account", 400);
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ updated: true, userId: parsed.data.userId, demoMode: true });
  }

  const admin = getSupabaseAdminClient();

  if (!isSuperAdmin) {
    const { data: targetRoleRows, error: targetRoleErr } = await admin
      .from("user_roles")
      .select("role:roles(slug)")
      .eq("user_id", parsed.data.userId);

    if (targetRoleErr) {
      return apiError("DB_ERROR", "Failed to verify target user roles", 500);
    }

    const targetRoles = (targetRoleRows ?? []).flatMap((row) => {
      const r = row as {
        role?: { slug?: string } | Array<{ slug?: string }> | null;
        roles?: { slug?: string } | Array<{ slug?: string }> | null;
      };
      const entry = r.role ?? r.roles;
      if (Array.isArray(entry)) {
        return entry.map((e) => e?.slug).filter((s): s is string => Boolean(s));
      }
      return entry?.slug ? [entry.slug] : [];
    });

    if (targetRoles.includes("super_admin")) {
      return apiError("FORBIDDEN_ROLE", "Only super_admin can modify a super_admin account", 403);
    }
  }

  let shouldBumpSessionVersion = false;

  if (parsed.data.status) {
    const { error: updateErr } = await admin
      .from("users")
      .update({ status: parsed.data.status })
      .eq("id", parsed.data.userId);

    if (updateErr) {
      return apiError("DB_ERROR", "Failed to update user status", 500);
    }

    // If suspended or deactivated, increment session_version to evict all active sessions immediately
    if (parsed.data.status === "suspended" || parsed.data.status === "deactivated") {
      shouldBumpSessionVersion = true;
    }
  }

  if (parsed.data.roleSlugs !== undefined) {
    const uniqueSlugs = Array.from(new Set(parsed.data.roleSlugs));
    let resolvedRoles: Array<{ id: string; slug: string }> = [];

    if (uniqueSlugs.length > 0) {
      const { data: fetchedRoles, error: rolesErr } = await admin
        .from("roles")
        .select("id, slug")
        .in("slug", uniqueSlugs);

      if (rolesErr) {
        return apiError("DB_ERROR", "Failed to resolve target roles", 500);
      }

      resolvedRoles = (fetchedRoles ?? []) as Array<{ id: string; slug: string }>;
      if (resolvedRoles.length !== uniqueSlugs.length) {
        return apiError("INVALID_ROLE", "One or more role slugs do not exist", 400);
      }
    }

    const { error: deleteErr } = await admin
      .from("user_roles")
      .delete()
      .eq("user_id", parsed.data.userId);

    if (deleteErr) {
      return apiError("DB_ERROR", "Failed to update user roles", 500);
    }

    if (resolvedRoles.length > 0) {
      const { error: insertErr } = await admin.from("user_roles").insert(
        resolvedRoles.map((role) => ({
          user_id: parsed.data.userId,
          role_id: role.id,
          granted_by: auth.auth.userId,
        }))
      );

      if (insertErr) {
        return apiError("DB_ERROR", "Failed to assign user roles", 500);
      }
    }

    shouldBumpSessionVersion = true;
  }

  if (shouldBumpSessionVersion) {
    const rpcRes = await admin.rpc("increment_session_version", {
      p_user_id: parsed.data.userId,
    });
    if (rpcRes?.error) {
      // Fallback when increment_session_version RPC is absent in local DB
      const { data: userRow } = await admin
        .from("users")
        .select("session_version")
        .eq("id", parsed.data.userId)
        .maybeSingle();

      if (userRow && typeof userRow.session_version === "number") {
        await admin
          .from("users")
          .update({ session_version: userRow.session_version + 1 })
          .eq("id", parsed.data.userId);
      }
    }
  }

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "USER_ADMIN_UPDATED",
    resourceType: "users",
    resourceId: parsed.data.userId,
    changedFields: Object.keys(parsed.data),
  });

  return apiOk({ updated: true, userId: parsed.data.userId });
}
