import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { checkRateLimit, getTrustedClientIp } from "@/lib/security/rate-limit";
import { hashClientIp } from "@/lib/security/crypto";
import { verifyTurnstileToken, writeRedactedAuditLog } from "@/lib/auth/session";
import { createServerSupabaseClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { getDefaultPortalForRoles, type CanonicalRole } from "@/lib/rbac/roles";

const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(12),
    turnstileToken: z.string().min(1),
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

  const ip = getTrustedClientIp(request);

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "INVALID_JSON", message: "Invalid JSON payload" } },
      { status: 400 }
    );
  }

  const parsed = loginSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  const rl = await checkRateLimit("auth_login", `${ip}:${parsed.data.email.toLowerCase()}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: { code: "RATE_LIMITED", message: "Too many login attempts" } },
      { status: 429, headers: { "Retry-After": String(rl.resetSeconds) } }
    );
  }

  const turnstileOk = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
  if (!turnstileOk) {
    return NextResponse.json(
      { ok: false, error: { code: "TURNSTILE_FAILED", message: "Verification challenge failed" } },
      { status: 400 }
    );
  }

  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "AUTH_UNCONFIGURED",
          message: "Supabase authentication is not configured in local environment (.env.local).",
        },
      },
      { status: 503 }
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    await writeRedactedAuditLog({
      actorRoles: ["anonymous"],
      action: "LOGIN_FAILED",
      resourceType: "user",
      resourceId: "unknown",
      ipHash: hashClientIp(ip),
    });
    return NextResponse.json(
      { ok: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" } },
      { status: 401 }
    );
  }

  const { data: dbUser } = await supabase
    .from("users")
    .select("id, status, deleted_at")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!dbUser || dbUser.status !== "active" || dbUser.deleted_at !== null) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { ok: false, error: { code: "ACCOUNT_SUSPENDED", message: "Account suspended or inactive" } },
      { status: 403 }
    );
  }

  const { data: roleRows } = await supabase
    .from("user_roles")
    .select("roles(slug)")
    .eq("user_id", dbUser.id);

  const roles: CanonicalRole[] = [];
  for (const row of roleRows ?? []) {
    const slug = (row as { roles?: { slug?: string } }).roles?.slug;
    if (slug) roles.push(slug as CanonicalRole);
  }

  await writeRedactedAuditLog({
    actorUserId: dbUser.id,
    actorRoles: roles,
    action: "LOGIN_SUCCEEDED",
    resourceType: "user",
    resourceId: dbUser.id,
    ipHash: hashClientIp(ip),
  });

  return NextResponse.json({
    ok: true,
    data: { redirectTo: getDefaultPortalForRoles(roles) },
  });
}
