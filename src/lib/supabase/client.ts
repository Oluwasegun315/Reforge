import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig, hasSupabaseCredentials } from "./config";

let browserClient: SupabaseClient | null = null;

export function createBrowserClient(): SupabaseClient | null {
  if (!hasSupabaseCredentials()) return null;
  if (browserClient) return browserClient;

  const { url, anonKey } = getSupabaseConfig();
  browserClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return browserClient;
}

export function getAuthRedirectUrl(path = "/auth/callback") {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}
