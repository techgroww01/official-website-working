import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePermission("users", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({
      users: [
        {
          id: "u1",
          email: "admin@techgroww.co.in",
          fullName: "Umesh Patel",
          accountClass: "staff",
          status: "active",
          roles: ["super_admin"],
          mfaEnabled: true,
        },
      ],
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

  // Prevent modifying super_admin roles without super_admin role
  const isSuperAdmin = auth.auth.roles.includes("super_admin");
  if (parsed.data.roleSlugs?.includes("super_admin") && !isSuperAdmin) {
    return apiError("FORBIDDEN_ROLE", "Only super_admin can grant super_admin privilege", 403);
  }

  // Prevent users from suspending themselves
  if (parsed.data.userId === auth.auth.userId && parsed.data.status && parsed.data.status !== "active") {
    return apiError("SELF_SUSPENSION_BLOCKED", "You cannot suspend or deactivate your own account", 400);
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ updated: true, userId: parsed.data.userId, demoMode: true });
  }

  const admin = getSupabaseAdminClient();

  if (parsed.data.status) {
    await admin.from("users").update({ status: parsed.data.status }).eq("id", parsed.data.userId);

    // If suspended or deactivated, increment session_version to evict all active sessions immediately!
    if (parsed.data.status === "suspended" || parsed.data.status === "deactivated") {
      await admin.rpc("increment_session_version", { p_user_id: parsed.data.userId });
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
