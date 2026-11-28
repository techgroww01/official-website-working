import { apiError, apiOk } from "@/lib/api/http";
import { requirePermission } from "@/lib/auth/session";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePermission("intern_tasks", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ tasks: [], demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  // Fetch tasks assigned to any of the current user's enrollments
  const { data: enrollments, error: enrollErr } = await admin
    .from("intern_enrollments")
    .select("id")
    .eq("user_id", auth.auth.userId);

  if (enrollErr) return apiError("DB_ERROR", "Failed to load intern enrollment", 500);

  const enrollmentIds = (enrollments ?? []).map((e) => e.id);
  if (enrollmentIds.length === 0 && auth.auth.accountClass === "intern") {
    return apiOk({ tasks: [] });
  }

  let query = admin
    .from("intern_tasks")
    .select("id, title, instructions, due_at, priority, status, task_submissions(id, submission_url, mentor_feedback, rating, reviewed_at)");

  if (enrollmentIds.length > 0) {
    query = query.in("enrollment_id", enrollmentIds);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return apiError("DB_ERROR", "Failed to load tasks", 500);

  return apiOk({ tasks: data ?? [] });
}
