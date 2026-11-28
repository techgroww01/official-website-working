import { type NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/api/http";
import { requirePermission } from "@/lib/auth/session";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  // Strict rule: billing read requires explicit 'billing' 'read' permission
  const auth = await requirePermission("billing", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({
      invoices: [
        {
          id: "INV-2026-001",
          invoice_number: "TG-INV-2026-001",
          description: "Phase 01 Discovery & Architecture Kickoff",
          amount: 0,
          currency: "INR",
          status: "paid",
          issued_at: "2026-02-01T00:00:00Z",
        },
      ],
      demoMode: true,
    });
  }

  const admin = getSupabaseAdminClient();
  let query = admin
    .from("billing_invoices")
    .select("id, invoice_number, description, amount, currency, status, due_date, issued_at, paid_at");

  if (auth.auth.accountClass === "client") {
    if (auth.auth.organizationIds.length === 0) return apiOk({ invoices: [] });
    query = query.in("organization_id", auth.auth.organizationIds);
  }

  const { data, error } = await query.order("issued_at", { ascending: false });
  if (error) return apiError("DB_ERROR", "Failed to retrieve billing records", 500);

  return apiOk({ invoices: data ?? [] });
}
