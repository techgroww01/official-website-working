import { NextResponse } from "next/server";
import {
  ALL_CANONICAL_ROLES,
  requiresMfa,
  type AccountClass,
  type CanonicalRole,
} from "@/lib/rbac/roles";
import {
  hasPermission,
  type PermissionCheckContext,
  type RbacAction,
  type RbacResource,
} from "@/lib/rbac/matrix";
import { createServerSupabaseClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export interface AuthContext {
  userId: string;
  email: string;
  fullName: string;
  accountClass: AccountClass;
  roles: CanonicalRole[];
  organizationIds: string[];
  aal: string | null;
  sessionVersion: number;
}

const VALID_ROLE_SET = new Set<string>(ALL_CANONICAL_ROLES);

function isCanonicalRole(role: string): role is CanonicalRole {
  return VALID_ROLE_SET.has(role);
}

/**
 * Resolves live authenticated user state directly from PostgreSQL (`users.status = 'active'`
 * and `session_version` verified against JWT custom claims) so suspended or demoted users
 * cannot continue calling portals for the remaining lifetime of an access token.
 */
export async function getServerAuthContext(): Promise<AuthContext | null> {
  if (!isSupabaseServerConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const tokenSessionVersion =
    typeof sessionData.session?.user?.app_metadata?.session_version === "number"
      ? sessionData.session.user.app_metadata.session_version
      : undefined;

  const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  const { data: dbUser } = await supabase
    .from("users")
    .select("id, email, full_name, account_class, status, session_version, deleted_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!dbUser || dbUser.status !== "active" || dbUser.deleted_at !== null) {
    return null;
  }

  if (tokenSessionVersion !== undefined && dbUser.session_version !== tokenSessionVersion) {
    return null;
  }

  const [{ data: roleRows }, { data: orgRows }] = await Promise.all([
    supabase.from("user_roles").select("roles(slug)").eq("user_id", user.id),
    supabase.from("organization_members").select("organization_id, org_role").eq("user_id", user.id),
  ]);

  const roleSet = new Set<CanonicalRole>();

  for (const row of roleRows ?? []) {
    const slug = (row as { roles?: { slug?: string } | { slug?: string }[] }).roles;
    if (Array.isArray(slug)) {
      slug.forEach((s) => {
        if (s.slug && isCanonicalRole(s.slug)) roleSet.add(s.slug);
      });
    } else if (slug?.slug && isCanonicalRole(slug.slug)) {
      roleSet.add(slug.slug);
    }
  }

  // Canonical external client org_role sourced directly from organization_members
  const organizationIds: string[] = [];
  for (const row of orgRows ?? []) {
    organizationIds.push(row.organization_id);
    if (row.org_role && isCanonicalRole(row.org_role)) {
      roleSet.add(row.org_role);
    }
  }

  return {
    userId: dbUser.id,
    email: String(dbUser.email),
    fullName: dbUser.full_name,
    accountClass: dbUser.account_class as AccountClass,
    roles: Array.from(roleSet),
    organizationIds,
    aal: aalData?.currentLevel ?? "aal1",
    sessionVersion: dbUser.session_version,
  };
}

export async function requirePermission(
  resource: RbacResource,
  action: RbacAction,
  ctx?: PermissionCheckContext
): Promise<
  | { ok: true; auth: AuthContext }
  | { ok: false; response: NextResponse }
> {
  const auth = await getServerAuthContext();
  if (!auth) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      ),
    };
  }

  if (requiresMfa(auth.roles) && auth.aal !== "aal2" && process.env.ENFORCE_MFA !== "false") {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: { code: "MFA_REQUIRED", message: "TOTP MFA verification (aal2) required" } },
        { status: 403 }
      ),
    };
  }

  const allowed = hasPermission(auth.roles, resource, action, {
    ...ctx,
    actorUserId: auth.userId,
  });

  if (!allowed) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: { code: "FORBIDDEN", message: "Insufficient permission" } },
        { status: 403 }
      ),
    };
  }

  return { ok: true, auth };
}

export async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Allow local dev/testing when Turnstile keys are intentionally unset outside production
    return process.env.NODE_ENV !== "production";
  }

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: ip,
      }),
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export async function writeRedactedAuditLog(entry: {
  actorUserId?: string | null;
  actorRoles: readonly string[];
  action: string;
  resourceType: string;
  resourceId: string;
  changedFields?: string[];
  ipHash?: string | null;
}): Promise<void> {
  if (!isSupabaseAdminConfigured()) return;
  try {
    const admin = getSupabaseAdminClient();
    await admin.from("audit_logs").insert({
      actor_user_id: entry.actorUserId ?? null,
      actor_roles: [...entry.actorRoles],
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId,
      changed_fields: entry.changedFields ?? [],
      redacted_diff: { note: "PII-redacted field audit" },
      ip_hash: entry.ipHash ?? null,
    });
  } catch {
    // Audit helper never throws raw stack traces to callers
  }
}
