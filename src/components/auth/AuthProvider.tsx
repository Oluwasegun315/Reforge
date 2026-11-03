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
  type AuthSnapshot,
} from "@/lib/auth-session";

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

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthSnapshot {
  return useContext(AuthContext);
}
