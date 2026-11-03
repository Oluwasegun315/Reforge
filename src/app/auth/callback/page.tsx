"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
      const code = url.searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setStatus("Could not complete sign-in.");
          router.replace("/auth/signin");
          return;
        }
      }

      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user) {
        setStatus("Could not complete sign-in.");
        router.replace("/auth/signin");
        return;
      }

      applyProfile(data.session.user.email, data.session.user.user_metadata);
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
