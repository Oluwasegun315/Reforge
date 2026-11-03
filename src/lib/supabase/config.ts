/**
 * Supabase configuration helpers.
 * Only public anon / publishable keys belong in NEXT_PUBLIC_* env vars.
 * Never put service-role or access tokens in frontend code.
 */

export function getSupabaseConfig() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  // anon and publishable are the same public key — accept either env name
  const anonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
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
