"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  AUTH_EVENT,
  getAuthSnapshot,
  markSignedIn,
  type AuthSnapshot,
} from "@/lib/auth-session";
import { createBrowserClient } from "@/lib/supabase/client";
import { hasSupabaseCredentials } from "@/lib/supabase/config";
import { localData } from "@/lib/storage";
import { normalizeProfile } from "@/lib/profile";

const AuthContext = createContext<AuthSnapshot>({
  loggedIn: false,
  preferredName: null,
  photoUrl: null,
  email: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthSnapshot>({
    loggedIn: false,
    preferredName: null,
    photoUrl: null,
    email: null,
  });

  const refresh = useCallback(() => {
    setAuth(getAuthSnapshot());
  }, []);

  useEffect(() => {
    refresh();
    const onAuth = () => refresh();
    window.addEventListener(AUTH_EVENT, onAuth);
    window.addEventListener("storage", onAuth);
    window.addEventListener("focus", onAuth);
    return () => {
      window.removeEventListener(AUTH_EVENT, onAuth);
      window.removeEventListener("storage", onAuth);
      window.removeEventListener("focus", onAuth);
    };
  }, [refresh]);

  // Heal local "Inside" state from an existing Supabase session (new device / cleared storage)
  useEffect(() => {
    if (!hasSupabaseCredentials()) return;
    const supabase = createBrowserClient();
    if (!supabase) return;

    const syncFromUser = (user: {
      email?: string | null;
      user_metadata?: Record<string, unknown>;
    }) => {
      if (getAuthSnapshot().loggedIn) {
        refresh();
        return;
      }
      const meta = user.user_metadata ?? {};
      const existing = localData.getProfile();
      const preferred =
        (typeof meta.preferred_name === "string" && meta.preferred_name) ||
        (typeof meta.full_name === "string" && meta.full_name) ||
        (typeof meta.name === "string" && meta.name) ||
        existing?.preferredName ||
        user.email?.split("@")[0] ||
        "Athlete";

      localData.saveProfile(
        normalizeProfile({
          ...existing,
          preferredName: preferred,
          email: user.email ?? existing?.email ?? "",
          country:
            (typeof meta.country === "string" && meta.country) ||
            existing?.country ||
            "Nigeria",
          emailVerified: true,
          photoUrl:
            (typeof meta.avatar_url === "string" && meta.avatar_url) ||
            (typeof meta.picture === "string" && meta.picture) ||
            existing?.photoUrl ||
            null,
        })
      );
      markSignedIn();
      refresh();
    };

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) syncFromUser(data.session.user);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) syncFromUser(session.user);
      else refresh();
    });

    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthSnapshot {
  return useContext(AuthContext);
}
