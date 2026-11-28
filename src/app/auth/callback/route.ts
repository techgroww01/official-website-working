import { NextResponse, type NextRequest } from "next/server";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { createServerSupabaseClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { getDefaultPortalForRoles, type CanonicalRole } from "@/lib/rbac/roles";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code || !isSupabaseServerConfigured()) {
    return NextResponse.redirect(`${origin}/login?error=oauth_unavailable`);
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  const email = data.user.email?.toLowerCase() ?? "";
  const hd = (data.user.user_metadata?.hd as string | undefined)?.toLowerCase() ?? "";
  const emailVerified = Boolean(data.user.email_confirmed_at || data.user.user_metadata?.email_verified);

  // Enforce strict Google Workspace domain & pre-invited active user check
  if (!emailVerified || hd !== COMPANY_CONFIG.allowedStaffOAuthDomain) {
    await supabase.auth.signOut();
    if (isSupabaseAdminConfigured()) {
      await getSupabaseAdminClient().auth.admin.deleteUser(data.user.id).catch(() => undefined);
    }
    return NextResponse.redirect(`${origin}/login?error=domain_not_allowed`);
  }

  if (isSupabaseAdminConfigured()) {
    const admin = getSupabaseAdminClient();
    const { data: invitedRow } = await admin
      .from("users")
      .select("id, status, account_class, deleted_at")
      .eq("email", email)
      .maybeSingle();

    if (!invitedRow || invitedRow.status === "suspended" || invitedRow.deleted_at !== null) {
      await supabase.auth.signOut();
      await admin.auth.admin.deleteUser(data.user.id).catch(() => undefined);
      return NextResponse.redirect(`${origin}/login?error=account_not_invited`);
    }

    const { data: roleRows } = await admin
      .from("user_roles")
      .select("roles(slug)")
      .eq("user_id", invitedRow.id);

    const roles: CanonicalRole[] = [];
    for (const row of roleRows ?? []) {
      const slug = (row as { roles?: { slug?: string } }).roles?.slug;
      if (slug) roles.push(slug as CanonicalRole);
    }

    return NextResponse.redirect(`${origin}${getDefaultPortalForRoles(roles)}`);
  }

  return NextResponse.redirect(`${origin}/admin`);
}
