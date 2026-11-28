import { NextResponse } from "next/server";
import type { z } from "zod";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { sha256Hex } from "@/lib/security/crypto";

export function apiOk<T>(data: T, status = 200, headers?: HeadersInit) {
  return NextResponse.json({ ok: true, data }, { status, headers });
}

export function apiError(
  code: string,
  message: string,
  status = 400,
  details?: unknown,
  headers?: HeadersInit
) {
  return NextResponse.json(
    { ok: false, error: { code, message, ...(details !== undefined ? { details } : {}) } },
    { status, headers }
  );
}

export function formatZodError(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export async function parseJsonBody(request: Request): Promise<{ ok: true; data: unknown } | { ok: false }> {
  try {
    const data: unknown = await request.json();
    return { ok: true, data };
  } catch {
    return { ok: false };
  }
}

export function verifyCronSecret(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization") ?? "";
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  return authHeader === `Bearer ${secret}`;
}

export async function checkIdempotency(
  key: string | null,
  route: string,
  requestBody: unknown
): Promise<{ hit: true; response: NextResponse } | { hit: false; requestHash: string | null }> {
  if (!key || !isSupabaseAdminConfigured()) {
    return { hit: false, requestHash: null };
  }
  const admin = getSupabaseAdminClient();
  const requestHash = sha256Hex(JSON.stringify(requestBody ?? {}));

  const { data: existing } = await admin
    .from("idempotency_keys")
    .select("request_hash, response_status, response_body, expires_at")
    .eq("key", key)
    .eq("route", route)
    .maybeSingle();

  if (!existing) {
    return { hit: false, requestHash };
  }

  if (existing.request_hash !== requestHash) {
    return {
      hit: true,
      response: apiError("IDEMPOTENCY_CONFLICT", "Idempotency-Key reused with different payload", 409),
    };
  }

  return {
    hit: true,
    response: NextResponse.json(existing.response_body, { status: existing.response_status }),
  };
}

export async function saveIdempotency(
  key: string | null,
  route: string,
  actorUserId: string | null,
  requestHash: string | null,
  responseStatus: number,
  responseBody: Record<string, unknown>
): Promise<void> {
  if (!key || !requestHash || !isSupabaseAdminConfigured()) return;
  const admin = getSupabaseAdminClient();
  await admin.from("idempotency_keys").upsert(
    {
      key,
      route,
      actor_user_id: actorUserId,
      request_hash: requestHash,
      response_status: responseStatus,
      response_body: responseBody,
    },
    { onConflict: "key,route" }
  );
}
