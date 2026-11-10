"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ExternalLink, MailCheck } from "lucide-react";
import { localData } from "@/lib/storage";
import { normalizeProfile } from "@/lib/profile";
import { hasSupabaseCredentials } from "@/lib/supabase/config";
import { createBrowserClient, getAuthRedirectUrl } from "@/lib/supabase/client";
import { notificationsStore } from "@/lib/notifications";
import { markSignedIn } from "@/lib/auth-session";
import { SITE_URL } from "@/lib/seo";
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

  // If user already confirmed in another tab, enter the app
  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive || !data.session?.user) return;
      const user = data.session.user;
      const preferred =
        (user.user_metadata?.preferred_name as string | undefined) ||
        pending?.preferredName ||
        user.email?.split("@")[0] ||
        "Athlete";
      localData.saveProfile(
        normalizeProfile({
          preferredName: preferred,
          email: user.email ?? email,
          country: (user.user_metadata?.country as string) || pending?.country || "Nigeria",
          emailVerified: true,
        })
      );
      localData.savePendingSignup(null);
      markSignedIn();
      notificationsStore.ensureWelcomePack(preferred);
      router.replace("/dashboard");
    };
    void check();
    const id = window.setInterval(() => void check(), 4000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [supabase, email, pending, router]);

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
          : "Supabase keys are missing on this deploy. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy."
      );
      return;
    }
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: getAuthRedirectUrl("/auth/callback"),
      },
    });
    setBusy(false);
    setStatus(
      error
        ? error.message
        : "Confirmation email resent. Check Inbox, Spam, and Promotions in Gmail."
    );
  };

  const gmailSearch = email
    ? `https://mail.google.com/mail/u/0/#search/RepForge+OR+Supabase+OR+Confirm+to%3A${encodeURIComponent(email)}`
    : "https://mail.google.com/mail/u/0/#search/Supabase+OR+Confirm";

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
            We sent a confirmation link to{" "}
            <span className="text-[var(--text)] font-medium">{email || "your Gmail"}</span>. Open
            it, tap Confirm, then return here — this page will unlock automatically.
          </p>
        </div>

        <ol className="text-left text-sm text-[var(--text-muted)] space-y-2 border border-[var(--border)] rounded-xl p-4">
          <li>1. Open Gmail on your phone or computer.</li>
          <li>2. Look for “Confirm your signup” from Supabase / RepForge (also check Spam).</li>
          <li>3. Tap the confirm link — you’ll land back in RepForge.</li>
        </ol>

        {status && (
          <p className="text-sm text-[var(--cyan)]" role="status">
            {status}
          </p>
        )}

        {!supabaseReady && (
          <p className="text-sm text-[var(--danger)] text-left border border-[rgba(255,90,90,0.35)] rounded-xl p-3">
            Live email is not connected on this environment. Add Supabase URL + anon key in Vercel
            Environment Variables, set Auth redirect URL to{" "}
            <code className="text-xs break-all">{SITE_URL}/auth/callback</code>, then redeploy.
          </p>
        )}

        <div className="flex flex-col gap-2">
          <a
            href={gmailSearch}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex gap-2 justify-center"
          >
            Open Gmail
            <ExternalLink size={16} aria-hidden />
          </a>
          {supabaseReady ? (
            <Button disabled={busy} onClick={() => void resend()}>
              {busy ? "Sending…" : "Resend confirmation email"}
            </Button>
          ) : (
            <Button onClick={finishVerified}>
              Continue without email (local only)
            </Button>
          )}
          <Link href="/auth/signin" className="btn-secondary">
            Back to sign in
          </Link>
        </div>

        <p className="text-xs text-[var(--text-dim)] leading-relaxed">
          {supabaseReady
            ? "Default Supabase mail can be slow or land in Spam. After you confirm, sign-in works with the same email and password."
            : "Until Supabase keys are on Vercel, no real Gmail message can be sent from this site."}
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
