import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const noteSchema = z
  .object({
    applicationId: z.string().uuid(),
    noteType: z.enum(["screening", "technical", "cultural", "general"]).default("general"),
    score: z.number().int().min(1).max(5).optional(),
    body: z.string().min(5).max(4000),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("recruitment_notes", "create");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON payload", 400);

  const parsed = noteSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid evaluation note", 400, formatZodError(parsed.error));
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ created: true, noteId: "demo-note-id", demoMode: true }, 201);
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("recruitment_notes")
    .insert({
      application_id: parsed.data.applicationId,
      author_id: auth.auth.userId,
      note_type: parsed.data.noteType,
      score: parsed.data.score ?? null,
      body: parsed.data.body,
    })
    .select("id, application_id, note_type, score, created_at")
    .single();

  if (error || !data) return apiError("DB_ERROR", "Failed to save evaluation note", 500);

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "INTERVIEW_NOTE_ADDED",
    resourceType: "recruitment_notes",
    resourceId: data.id,
    changedFields: ["note_type", "score"],
  });

  return apiOk(data, 201);
}
