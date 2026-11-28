import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      data: {
        status: "healthy",
        service: "techgroww-platform",
        databaseConfigured: isSupabaseAdminConfigured(),
        rateLimiter: process.env.UPSTASH_REDIS_REST_URL ? "upstash" : "memory_fallback",
        emailProvider: process.env.RESEND_API_KEY ? "resend" : "demo_unconfigured",
      },
    },
    { status: 200 }
  );
}
