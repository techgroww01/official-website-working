import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePermission("tickets", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ tickets: [], demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  let query = admin
    .from("support_tickets")
    .select("id, ticket_number, subject, priority, status, created_at");

  if (auth.auth.accountClass === "client") {
    if (auth.auth.organizationIds.length === 0) return apiOk({ tickets: [] });
    query = query.in("organization_id", auth.auth.organizationIds);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return apiError("DB_ERROR", "Failed to load support tickets", 500);

  return apiOk({ tickets: data ?? [] });
}

const ticketSchema = z
  .object({
    subject: z.string().min(5).max(180),
    body: z.string().min(10).max(4000),
    priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    projectId: z.string().uuid().optional(),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("tickets", "create");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON payload", 400);

  const parsed = ticketSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid ticket parameters", 400, formatZodError(parsed.error));
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ created: true, ticketId: "demo-ticket-id", demoMode: true }, 201);
  }

  const admin = getSupabaseAdminClient();
  const orgId = auth.auth.organizationIds[0];
  if (!orgId) return apiError("MISSING_ORG", "No client organization associated with account", 400);

  const { data, error } = await admin
    .from("support_tickets")
    .insert({
      organization_id: orgId,
      project_id: parsed.data.projectId ?? null,
      created_by: auth.auth.userId,
      subject: parsed.data.subject,
      priority: parsed.data.priority,
      status: "open",
    })
    .select("id, ticket_number, subject, status")
    .single();

  if (error || !data) return apiError("DB_ERROR", "Failed to create ticket", 500);

  // Insert initial comment
  await admin.from("ticket_comments").insert({
    ticket_id: data.id,
    author_id: auth.auth.userId,
    body: parsed.data.body,
    is_internal: false,
  });

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "SUPPORT_TICKET_CREATED",
    resourceType: "tickets",
    resourceId: data.id,
    changedFields: ["subject", "priority"],
  });

  return apiOk(data, 201);
}
