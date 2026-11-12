/**
 * Supabase configuration helpers.
 * Only public anon / publishable keys belong in NEXT_PUBLIC_* env vars.
 * Never put service-role or access tokens in frontend code.
 */

/** Production fallbacks so Discord/email auth work even if Vercel env UI was skipped. */
const PRODUCTION_SUPABASE_URL = "https://aypkrbltklzgokurasdy.supabase.co";
const PRODUCTION_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5cGtyYmx0a2x6Z29rdXJhc2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMDIwMTksImV4cCI6MjEwODY3ODAxOX0.SZIrpfjwS7MRk1JOHcHDxeKaMzSnWp_v-w7p5s7dPn8";

export function getSupabaseConfig() {
  const url = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    PRODUCTION_SUPABASE_URL
  ).trim();
  // anon and publishable are the same public key — accept either env name
  const anonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    PRODUCTION_SUPABASE_ANON_KEY
  ).trim();

  return { url, anonKey };
}

export function hasSupabaseCredentials(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(
    url &&
      anonKey &&
      !url.includes("your-project") &&
      !anonKey.includes("your-anon") &&
      !anonKey.includes("your-publishable") &&
      anonKey.length > 20
  );
}
