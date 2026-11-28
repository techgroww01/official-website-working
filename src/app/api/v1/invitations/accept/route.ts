import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { sha256Hex } from "@/lib/security/crypto";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { writeRedactedAuditLog } from "@/lib/auth/session";

const acceptSchema = z
  .object({
    token: z.string().min(16),
    fullName: z.string().min(2).max(120),
    password: z.string().min(12).max(128),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "CSRF_REJECTED", message: csrf.reason } },
      { status: csrf.status ?? 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: "INVALID_JSON" } }, { status: 400 });
  }

  const parsed = acceptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_UNCONFIGURED", message: "Supabase not configured locally" } },
      { status: 503 }
    );
  }

  const admin = getSupabaseAdminClient();
  const tokenHash = sha256Hex(parsed.data.token);

  const { data: invite } = await admin
    .from("invitations")
    .select("id, email, target_role_id, organization_id, cohort_id, expires_at, accepted_at, revoked_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (
    !invite ||
    invite.accepted_at ||
    invite.revoked_at ||
    new Date(invite.expires_at).getTime() < Date.now()
  ) {
    return NextResponse.json(
      { ok: false, error: { code: "INVITE_INVALID", message: "Invitation expired or invalid" } },
      { status: 410 }
    );
  }

  const { data: authCreated, error: authErr } = await admin.auth.admin.createUser({
    email: String(invite.email),
    password: parsed.data.password,
    email_confirm: true,
  });

  if (authErr || !authCreated.user) {
    return NextResponse.json(
      { ok: false, error: { code: "USER_CREATE_FAILED", message: authErr?.message } },
      { status: 409 }
    );
  }

  const { data: roleRow } = await admin
    .from("roles")
    .select("slug, portal_scope")
    .eq("id", invite.target_role_id)
    .single();

  const accountClass =
    roleRow?.portal_scope === "client"
      ? "client"
      : roleRow?.slug === "intern"
      ? "intern"
      : "staff";

  await admin.from("users").insert({
    id: authCreated.user.id,
    email: invite.email,
    full_name: parsed.data.fullName,
    account_class: accountClass,
    status: "active",
  });

  await admin.from("user_roles").insert({
    user_id: authCreated.user.id,
    role_id: invite.target_role_id,
  });

  if (invite.organization_id && (roleRow?.slug === "client_admin" || roleRow?.slug === "client_member" || roleRow?.slug === "client_viewer")) {
    await admin.from("organization_members").insert({
      organization_id: invite.organization_id,
      user_id: authCreated.user.id,
      org_role: roleRow.slug,
    });
  }

  await admin
    .from("invitations")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invite.id);

  await writeRedactedAuditLog({
    actorUserId: authCreated.user.id,
    actorRoles: [roleRow?.slug ?? "unknown"],
    action: "INVITE_ACCEPTED",
    resourceType: "user",
    resourceId: authCreated.user.id,
    changedFields: ["status", "accepted_at"],
  });

  return NextResponse.json({ ok: true, data: { userId: authCreated.user.id } }, { status: 201 });
}
