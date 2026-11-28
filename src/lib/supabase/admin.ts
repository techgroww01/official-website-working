import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedAdmin: SupabaseClient | null = null;

export function isSupabaseAdminConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(
    url &&
      serviceRole &&
      !url.includes("your-project-ref") &&
      !url.includes("example.supabase.co") &&
      !serviceRole.includes("your-supabase-service-role-key")
  );
}

/**
 * Elevated Supabase service-role client restricted strictly to:
 *  - Verified webhooks & CRON jobs
 *  - Auth lifecycle (Before User Created cleanup / auth.admin.signOut)
 *  - Calling hardcoded SECURITY DEFINER RPCs
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (!isSupabaseAdminConfigured()) {
    throw new Error("SUPABASE_ADMIN_UNCONFIGURED");
  }
  if (!cachedAdmin) {
    cachedAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return cachedAdmin;
}
