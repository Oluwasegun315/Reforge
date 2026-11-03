"use client";

import type { ReactNode } from "react";
import type { Provider } from "@supabase/supabase-js";
import { createBrowserClient, getAuthRedirectUrl } from "@/lib/supabase/client";
import { hasSupabaseCredentials } from "@/lib/supabase/config";
import { Button } from "@/components/ui/Button";

const PROVIDERS: {
  id: Provider;
  label: string;
  icon: ReactNode;
}[] = [
  { id: "google", label: "Google", icon: <GoogleIcon /> },
  { id: "discord", label: "Discord", icon: <DiscordIcon /> },
  { id: "twitter", label: "Twitter / X", icon: <TwitterIcon /> },
  { id: "github", label: "GitHub", icon: <GitHubIcon /> },
];

export function SocialAuthButtons({
  loading,
  setLoading,
  onError,
}: {
  loading: string | null;
  setLoading: (v: string | null) => void;
  onError: (msg: string) => void;
}) {
  const startOAuth = async (provider: Provider) => {
    onError("");
    setLoading(provider);

    if (!hasSupabaseCredentials()) {
      setLoading(null);
      onError(
        `${providerLabel(provider)} login needs Supabase. Add keys to .env.local, enable ${providerLabel(provider)} under Authentication → Providers, then restart.`
      );
      return;
    }

    const supabase = createBrowserClient();
    if (!supabase) {
      setLoading(null);
      onError("Could not start auth client. Check your Supabase env keys.");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getAuthRedirectUrl("/auth/callback"),
      },
    });

    if (error) {
      setLoading(null);
      onError(error.message);
    }
  };

  return (
    <div className="grid gap-2">
      {PROVIDERS.map((p) => (
        <Button
          key={p.id}
          type="button"
          variant="secondary"
          className="w-full !justify-center gap-3 !min-h-[3rem] !border-[var(--border-strong)] !text-[var(--text)] !bg-[var(--bg-elevated)]"
          disabled={loading !== null}
          onClick={() => void startOAuth(p.id)}
        >
          {p.icon}
          {loading === p.id ? `Connecting ${p.label}…` : `Continue with ${p.label}`}
        </Button>
      ))}
    </div>
  );
}

function providerLabel(id: string) {
  if (id === "twitter") return "Twitter / X";
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.1 4 9.2 8.5 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.1 39.5 16 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.5 7.1l.1.1 6.2 5.2C36.8 39.2 44 34 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2" aria-hidden>
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.07.07 0 0 0-.074.035c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.07.07 0 0 0-.074-.035A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.08.08 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.07.07 0 0 0-.041-.098 13.107 13.107 0 0 1-1.872-.892.07.07 0 0 1-.007-.117c.126-.094.252-.192.372-.292a.07.07 0 0 1 .074-.01c3.928 1.793 8.18 1.793 12.062 0a.07.07 0 0 1 .075.01c.12.098.246.198.373.292a.07.07 0 0 1-.006.117 12.3 12.3 0 0 1-1.873.891.07.07 0 0 0-.041.099c.36.698.772 1.362 1.225 1.993a.08.08 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.08.08 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
