/**
 * Demo mode is active when Supabase credentials are not configured.
 * Never pretend real authentication is active without credentials.
 */
export function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !url || !key || url.includes("your-project") || key.includes("your-anon");
}

export function getAuthStatusLabel(): string {
  return isDemoMode() ? "Demo mode" : "Connected";
}
