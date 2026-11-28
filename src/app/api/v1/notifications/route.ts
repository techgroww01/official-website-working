import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { getServerAuthContext } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const auth = await getServerAuthContext();
  if (!auth) return apiError("UNAUTHORIZED", "Authentication required", 401);

  const limitParam = Number.parseInt(request.nextUrl.searchParams.get("limit") ?? "20", 10);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 20;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ notifications: [], unreadCount: 0, demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const { data: list, error } = await admin
    .from("notifications")
    .select("id, portal, title, body, link_href, read_at, created_at")
    .eq("user_id", auth.userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return apiError("QUERY_FAILED", "Failed to fetch notifications", 500);
  }

  const unreadCount = list?.filter((n) => !n.read_at).length ?? 0;
  return apiOk({ notifications: list ?? [], unreadCount });
}

const patchSchema = z
  .object({
    notificationIds: z.array(z.string().uuid()).min(1),
  })
  .strict();

export async function PATCH(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await getServerAuthContext();
  if (!auth) return apiError("UNAUTHORIZED", "Authentication required", 401);

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON body", 400);

  const parsed = patchSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Valid notification IDs required", 400, formatZodError(parsed.error));
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ markedRead: parsed.data.notificationIds.length, demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const { error } = await admin
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", auth.userId)
    .in("id", parsed.data.notificationIds);

  if (error) {
    return apiError("UPDATE_FAILED", "Could not mark notifications as read", 500);
  }

  return apiOk({ markedRead: parsed.data.notificationIds.length });
}
