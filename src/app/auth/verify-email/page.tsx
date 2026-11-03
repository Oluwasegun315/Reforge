"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { MailCheck } from "lucide-react";
import { localData } from "@/lib/storage";
import { normalizeProfile } from "@/lib/profile";
import { hasSupabaseCredentials } from "@/lib/supabase/config";
import { createBrowserClient } from "@/lib/supabase/client";
import { notificationsStore } from "@/lib/notifications";
import { markSignedIn } from "@/lib/auth-session";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function VerifyEmailInner() {
  const router = useRouter();
  const params = useSearchParams();
  const emailParam = params.get("email") ?? "";
  const pending = localData.getPendingSignup();
  const email = emailParam || pending?.email || "";
  const supabaseReady = hasSupabaseCredentials();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const finishVerified = () => {
    const p = localData.getPendingSignup();
    if (!p) {
      setStatus("No pending signup found. Please sign up again.");
      return;
    }
    localData.saveProfile(
      normalizeProfile({
        preferredName: p.preferredName,
        email: p.email,
        country: p.country,
        emailVerified: true,
      })
    );
    if (p.password) {
      localData.saveLocalAuth({ email: p.email, password: p.password });
    }
    localData.savePendingSignup(null);
    markSignedIn();
    notificationsStore.ensureWelcomePack(p.preferredName);
    notificationsStore.add({
      title: "Email confirmed",
      body: "Your RepForge account is ready. Build today’s streak.",
      href: "/dashboard",
    });
    router.replace("/dashboard");
  };

  const resend = async () => {
    setBusy(true);
    setStatus(null);
    if (!supabase || !email) {
      setBusy(false);
      setStatus(
        supabaseReady
          ? "Could not resend. Try signing up again."
          : "Connect Supabase to send a real confirmation email. Until then use the local confirm button below for testing."
      );
      return;
    }
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    setBusy(false);
    setStatus(error ? error.message : "Confirmation email resent. Check Gmail (and Spam).");
  };

  return (
    <div className="container-page py-10 md:py-16 max-w-lg mx-auto">
      <Card className="!p-6 md:!p-8 space-y-5 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--lime-dim)] text-[var(--lime)] mx-auto">
          <MailCheck size={28} aria-hidden />
        </span>
        <div>
          <p className="section-eyebrow mb-2 justify-center">Almost there</p>
          <h1 className="display-title text-3xl md:text-4xl mb-3">Confirm your email</h1>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed">
            We need a real inbox — not a random throwaway address. Open{" "}
            <span className="text-[var(--text)] font-medium">{email || "your Gmail"}</span>, tap the
            confirmation link, then come back to enter RepForge.
          </p>
        </div>

        <ol className="text-left text-sm text-[var(--text-muted)] space-y-2 border border-[var(--border)] rounded-xl p-4">
          <li>1. Open Gmail (or your email app).</li>
          <li>2. Find the RepForge / Supabase confirmation message.</li>
          <li>3. Tap Confirm — then sign in here.</li>
        </ol>

        {status && (
          <p className="text-sm text-[var(--cyan)]" role="status">
            {status}
          </p>
        )}

        <div className="flex flex-col gap-2">
          {supabaseReady ? (
            <Button disabled={busy} onClick={() => void resend()}>
              {busy ? "Sending…" : "Resend confirmation email"}
            </Button>
          ) : (
            <Button onClick={finishVerified}>
              I confirmed my email (local test)
            </Button>
          )}
          <Link href="/auth/signin" className="btn-secondary">
            Back to sign in
          </Link>
        </div>

        <p className="text-xs text-[var(--text-dim)] leading-relaxed">
          {supabaseReady
            ? "When Supabase email confirmation is enabled, access stays locked until the inbox link is used."
            : "Supabase is not connected yet — the local confirm button is only for testing the gate. After you connect the backend, real Gmail confirmation will replace it."}
        </p>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-24 text-center text-[var(--text-muted)]">
          Loading confirmation…
        </div>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  );
}
