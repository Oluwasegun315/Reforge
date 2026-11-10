"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { createBrowserClient } from "@/lib/supabase/client";
import { localData } from "@/lib/storage";
import { normalizeProfile } from "@/lib/profile";
import { notificationsStore } from "@/lib/notifications";
import { markSignedIn } from "@/lib/auth-session";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Finishing sign-in…");

  useEffect(() => {
    const finish = async () => {
      const supabase = createBrowserClient();
      if (!supabase) {
        setStatus("Auth is not configured yet.");
        router.replace("/auth/signin");
        return;
      }

      const url = new URL(window.location.href);
      const oauthError =
        url.searchParams.get("error_description") ?? url.searchParams.get("error");
      if (oauthError) {
        const message = decodeURIComponent(oauthError);
        setStatus(message);
        router.replace(`/auth/signin?error=${encodeURIComponent(message)}`);
        return;
      }

      const code = url.searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setStatus(error.message || "Could not complete sign-in.");
          router.replace("/auth/signin");
          return;
        }
      }

      const session = await waitForSession(supabase);
      if (!session?.user) {
        setStatus("Could not complete sign-in.");
        router.replace("/auth/signin");
        return;
      }

      applyProfile(session.user.email, session.user.user_metadata);
      router.replace("/dashboard");
    };

    void finish();
  }, [router]);

  return (
    <div className="container-page py-24 text-center text-[var(--text-muted)]">
      {status}
    </div>
  );
}

async function waitForSession(
  supabase: NonNullable<ReturnType<typeof createBrowserClient>>
): Promise<Session | null> {
  const existing = await supabase.auth.getSession();
  if (existing.data.session?.user) return existing.data.session;

  return new Promise((resolve) => {
    let settled = false;
    const done = (session: Session | null) => {
      if (settled) return;
      settled = true;
      sub.subscription.unsubscribe();
      window.clearTimeout(timer);
      resolve(session);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) done(session);
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) done(data.session);
    });

    const timer = window.setTimeout(() => done(null), 2500);
  });
}

function applyProfile(
  email: string | undefined,
  meta: Record<string, unknown> | undefined
) {
  const preferred =
    (typeof meta?.preferred_name === "string" && meta.preferred_name) ||
    (typeof meta?.full_name === "string" && meta.full_name) ||
    (typeof meta?.name === "string" && meta.name) ||
    (email ? email.split("@")[0] : "Athlete");

  const existing = localData.getProfile();
  const country =
    (typeof meta?.country === "string" && meta.country) || existing?.country || "Nigeria";
  localData.saveProfile(
    normalizeProfile({
      ...existing,
      preferredName: preferred,
      email: email ?? existing?.email ?? "",
      country,
      emailVerified: true,
      photoUrl:
        (typeof meta?.avatar_url === "string" && meta.avatar_url) ||
        (typeof meta?.picture === "string" && meta.picture) ||
        existing?.photoUrl ||
        null,
    })
  );
  localData.savePendingSignup(null);
  markSignedIn();
  notificationsStore.ensureWelcomePack(preferred);
}
