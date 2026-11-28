import { apiError, apiOk } from "@/lib/api/http";
import { requirePermission } from "@/lib/auth/session";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePermission("client_projects", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({
      projects: [],
      demoMode: true,
    });
  }

  const admin = getSupabaseAdminClient();
  let query = admin
    .from("client_projects")
    .select("id, code, name, current_phase, status, start_date, target_completion_date, created_at");

  // Client tenant isolation: if client role, restrict by user's organizationIds
  const isClientClass = auth.auth.accountClass === "client";
  if (isClientClass) {
    if (auth.auth.organizationIds.length === 0) {
      return apiOk({ projects: [] });
    }
    query = query.in("organization_id", auth.auth.organizationIds);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return apiError("DB_ERROR", "Failed to fetch client projects", 500);

  return apiOk({ projects: data ?? [] });
}
