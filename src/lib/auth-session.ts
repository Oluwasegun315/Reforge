import { createBrowserClient } from "@/lib/supabase/client";
import { localData } from "@/lib/storage";
import { normalizeProfile } from "@/lib/profile";

export const AUTH_EVENT = "repforge:auth";

export type AuthSnapshot = {
  loggedIn: boolean;
  preferredName: string | null;
  photoUrl: string | null;
  email: string | null;
};

/** Broadcast so Navbar / RequireAuth update in the same tab instantly. */
export function emitAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: getAuthSnapshot() }));
}

export function getAuthSnapshot(): AuthSnapshot {
  const profile = localData.getProfile();
  const normalized = profile ? normalizeProfile(profile) : null;
  const verified = Boolean(normalized?.emailVerified && normalized.preferredName);

  // Legacy: verified profile existed before the session flag — heal once.
  // After an explicit logout the key is present as `false`, so this does not re-login.
  if (verified && !localData.hasDemoSessionKey()) {
    localData.setDemoSignedIn(true);
  }

  const sessionLive = localData.isDemoSignedIn();
  const loggedIn = Boolean(sessionLive && verified);

  return {
    loggedIn,
    preferredName: loggedIn ? normalized?.preferredName ?? null : null,
    photoUrl: loggedIn ? normalized?.photoUrl ?? null : null,
    email: loggedIn ? normalized?.email ?? null : null,
  };
}

/** True when the user has an active local/cloud session on this device. */
export function isLoggedIn(): boolean {
  return getAuthSnapshot().loggedIn;
}

/** Mark the user signed in locally and notify listeners. */
export function markSignedIn() {
  localData.setDemoSignedIn(true);
  emitAuthChange();
}

/** Clear local session immediately (does not navigate). */
export function clearLocalSession(options?: { wipeLocal?: boolean }) {
  localData.setDemoSignedIn(false);
  localData.savePendingSignup(null);
  if (options?.wipeLocal) {
    localData.clearAll();
  }
  emitAuthChange();
}

function cloudSignOutBestEffort() {
  const supabase = createBrowserClient();
  if (!supabase) return;
  void Promise.race([
    supabase.auth.signOut().catch(() => undefined),
    new Promise((resolve) => setTimeout(resolve, 1200)),
  ]);
}

/**
 * Sign out immediately. Local session clears first so the UI never waits on the network.
 * Callers should navigate with Next router after this (or pass redirectTo for a soft replace).
 */
export async function signOutUser(options?: {
  wipeLocal?: boolean;
  /** If set, navigates with location.replace after local clear (fast hard nav). Prefer router from UI. */
  redirectTo?: string;
}) {
  clearLocalSession({ wipeLocal: options?.wipeLocal });
  cloudSignOutBestEffort();

  if (options?.redirectTo && typeof window !== "undefined") {
    window.location.replace(options.redirectTo);
  }
}
