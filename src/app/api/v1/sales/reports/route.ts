import { type NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/api/http";
import { requirePermission } from "@/lib/auth/session";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePermission("sales_reports", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({
      metrics: {
        totalLeads: 3,
        qualifiedLeads: 2,
        activeOpportunities: 2,
        wonDeals: 1,
      },
      demoMode: true,
    });
  }

  const admin = getSupabaseAdminClient();
  const { count: leadsCount } = await admin.from("leads").select("id", { count: "exact", head: true });
  const { count: wonCount } = await admin.from("opportunities").select("id", { count: "exact", head: true }).eq("pipeline_stage", "won");

  return apiOk({
    metrics: {
      totalLeads: leadsCount ?? 0,
      wonDeals: wonCount ?? 0,
    },
  });
}
