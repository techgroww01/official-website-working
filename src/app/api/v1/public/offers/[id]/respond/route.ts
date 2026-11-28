import { type NextRequest } from "next/server";
import { z } from "zod";
import {
  apiError,
  apiOk,
  checkIdempotency,
  formatZodError,
  parseJsonBody,
  saveIdempotency,
} from "@/lib/api/http";
import { writeRedactedAuditLog } from "@/lib/auth/session";
import { hashClientIp } from "@/lib/security/crypto";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { checkRateLimit, getTrustedClientIp } from "@/lib/security/rate-limit";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const respondSchema = z
  .object({
    decision: z.enum(["accept", "decline"]),
    reason: z.string().max(1000).optional(),
  })
  .strict();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: offerId } = await params;
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const ip = getTrustedClientIp(request);
  const rl = await checkRateLimit("public_apply", `${ip}:offer_respond`);
  if (!rl.allowed) return apiError("RATE_LIMITED", "Too many requests. Please wait.", 429);

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON body", 400);

  const parsed = respondSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid response decision", 400, formatZodError(parsed.error));
  }

  const idemKey = request.headers.get("idempotency-key");
  const idemCheck = await checkIdempotency(idemKey, `/api/v1/public/offers/${offerId}/respond`, parsed.data);
  if (idemCheck.hit) return idemCheck.response;

  if (!isSupabaseAdminConfigured()) {
    const demoRes = { offerId, decision: parsed.data.decision, status: parsed.data.decision === "accept" ? "accepted" : "declined", demoMode: true };
    await saveIdempotency(idemKey, `/api/v1/public/offers/${offerId}/respond`, null, idemCheck.requestHash, 200, demoRes);
    return apiOk(demoRes);
  }

  const admin = getSupabaseAdminClient();
  const { data: offer, error: fetchErr } = await admin
    .from("offers")
    .select("id, status, expires_at, application_id")
    .eq("id", offerId)
    .maybeSingle();

  if (fetchErr || !offer) {
    return apiError("OFFER_NOT_FOUND", "Offer not found", 404);
  }

  if (offer.status !== "issued") {
    return apiError("OFFER_INACTIVE", `Offer cannot be answered because status is ${offer.status}`, 400);
  }

  if (offer.expires_at && new Date(offer.expires_at).getTime() < Date.now()) {
    return apiError("OFFER_EXPIRED", "Offer has expired", 410);
  }

  const newStatus = parsed.data.decision === "accept" ? "accepted" : "declined";
  const { error: updateErr } = await admin
    .from("offers")
    .update({
      status: newStatus,
      responded_at: new Date().toISOString(),
    })
    .eq("id", offerId);

  if (updateErr) {
    return apiError("UPDATE_FAILED", "Failed to update offer status", 500);
  }

  // Update associated application stage
  const appStage = parsed.data.decision === "accept" ? "offered" : "rejected";
  await admin
    .from("applications")
    .update({ stage: appStage })
    .eq("id", offer.application_id);

  await writeRedactedAuditLog({
    actorUserId: null,
    actorRoles: ["candidate_offer"],
    action: `OFFER_${newStatus.toUpperCase()}`,
    resourceType: "offer",
    resourceId: offerId,
    changedFields: ["status", "responded_at"],
    ipHash: hashClientIp(ip),
  });

  const responseData = {
    offerId,
    decision: parsed.data.decision,
    status: newStatus,
    respondedAt: new Date().toISOString(),
  };

  await saveIdempotency(
    idemKey,
    `/api/v1/public/offers/${offerId}/respond`,
    null,
    idemCheck.requestHash,
    200,
    responseData
  );

  return apiOk(responseData);
}
