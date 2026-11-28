import { type NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/api/http";
import { requirePermission } from "@/lib/auth/session";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const auth = await requirePermission("audit_logs", "read");
  if (!auth.ok) return auth.response;

  const limitParam = Number.parseInt(request.nextUrl.searchParams.get("limit") ?? "50", 10);
  const limit = Math.min(Math.max(limitParam, 1), 100);

  if (!isSupabaseAdminConfigured()) {
    return apiOk({
      logs: [
        {
          id: "1",
          action: "SYSTEM_INITIALIZED",
          resource_type: "platform",
          resource_id: "root",
          actor_roles: ["system"],
          created_at: new Date().toISOString(),
        },
      ],
      demoMode: true,
    });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("audit_logs")
    .select("id, actor_user_id, actor_roles, action, resource_type, resource_id, changed_fields, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return apiError("DB_ERROR", "Failed to retrieve audit log", 500);
  return apiOk({ logs: data ?? [] });
}
