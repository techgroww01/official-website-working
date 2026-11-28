import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePermission("offers", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ offers: [], demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const isRecruiter = auth.auth.roles.includes("recruiter") && !auth.auth.roles.includes("hiring_manager") && !auth.auth.roles.includes("recruitment_admin");

  const { data, error } = await admin
    .from("offers")
    .select("id, application_id, offer_kind, compensation_summary, status, issued_at, expires_at, responded_at")
    .order("created_at", { ascending: false });

  if (error) return apiError("DB_ERROR", "Failed to retrieve offers", 500);

  // Mask compensation from recruiters per spec
  const sanitized = data?.map((o) => ({
    ...o,
    compensation_summary: isRecruiter ? "[CONFIDENTIAL TO HIRING MANAGER]" : o.compensation_summary,
  }));

  return apiOk({ offers: sanitized ?? [] });
}
