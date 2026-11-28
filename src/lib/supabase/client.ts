import { createBrowserClient } from "@supabase/ssr";

export function isSupabasePublicConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      anon &&
      !url.includes("your-project-ref") &&
      !url.includes("example.supabase.co") &&
      !anon.includes("placeholder")
  );
}

export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "ci-placeholder-anon-key";
  return createBrowserClient(url, anon);
}
