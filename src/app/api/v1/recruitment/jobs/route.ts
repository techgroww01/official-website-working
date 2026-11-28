import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePermission("jobs", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({
      jobs: [
        {
          id: "j1",
          slug: "sales-executive-greater-noida",
          title: "Sales Executive",
          posting_kind: "job",
          status: "open",
          department: "Sales & Growth",
        },
      ],
      demoMode: true,
    });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("job_postings")
    .select("id, slug, title, posting_kind, status, department, employment_type, location, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) return apiError("DB_ERROR", "Failed to load jobs", 500);
  return apiOk({ jobs: data ?? [] });
}

const jobSchema = z
  .object({
    slug: z.string().min(2).max(100),
    title: z.string().min(2).max(120),
    postingKind: z.enum(["job", "internship"]).default("job"),
    employmentType: z.string().default("Full-time"),
    department: z.string().default("Engineering"),
    location: z.string().default("Greater Noida, Uttar Pradesh"),
    summary: z.string().min(10).max(600),
    responsibilities: z.string().min(10).max(4000),
    requirements: z.string().min(10).max(4000),
    stipendOrRange: z.string().max(80).optional(),
    status: z.enum(["draft", "in_review", "open", "closed", "archived"]).default("draft"),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("jobs", "create");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON body", 400);

  const parsed = jobSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid job parameters", 400, formatZodError(parsed.error));
  }

  if (parsed.data.status === "open") {
    const pubAuth = await requirePermission("jobs", "publish");
    if (!pubAuth.ok) return pubAuth.response;
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ created: true, slug: parsed.data.slug, demoMode: true }, 201);
  }

  const admin = getSupabaseAdminClient();
  const publishedAt = parsed.data.status === "open" ? new Date().toISOString() : null;

  const { data, error } = await admin
    .from("job_postings")
    .insert({
      slug: parsed.data.slug,
      title: parsed.data.title,
      posting_kind: parsed.data.postingKind,
      employment_type: parsed.data.employmentType,
      department: parsed.data.department,
      location: parsed.data.location,
      summary: parsed.data.summary,
      responsibilities: parsed.data.responsibilities,
      requirements: parsed.data.requirements,
      stipend_or_range: parsed.data.stipendOrRange ?? null,
      status: parsed.data.status,
      published_at: publishedAt,
      hiring_manager_id: auth.auth.userId,
    })
    .select("id, slug, title, status")
    .single();

  if (error || !data) {
    if (error?.code === "23505") return apiError("DUPLICATE_SLUG", "Job slug already exists", 409);
    return apiError("INSERT_FAILED", "Failed to create job", 500);
  }

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "JOB_REQUISITION_CREATED",
    resourceType: "jobs",
    resourceId: data.id,
    changedFields: ["slug", "title", "status"],
  });

  return apiOk(data, 201);
}
