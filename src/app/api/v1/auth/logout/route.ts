import { NextResponse, type NextRequest } from "next/server";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { createServerSupabaseClient, isSupabaseServerConfigured } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "CSRF_REJECTED", message: csrf.reason } },
      { status: csrf.status ?? 403 }
    );
  }

  if (isSupabaseServerConfigured()) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }

  return NextResponse.json({ ok: true, data: { signedOut: true } });
}
