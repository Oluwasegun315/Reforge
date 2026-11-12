"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createBrowserClient, getAuthRedirectUrl } from "@/lib/supabase/client";
import { hasSupabaseCredentials } from "@/lib/supabase/config";
import { localData } from "@/lib/storage";
import { normalizeProfile } from "@/lib/profile";
import { COUNTRY_OPTIONS, validateSignupEmail } from "@/lib/auth-gate";
import { notificationsStore } from "@/lib/notifications";
import { emitAuthChange, isLoggedIn, markSignedIn } from "@/lib/auth-session";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/PasswordField";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { cn } from "@/lib/utils";

export type AuthMode = "signin" | "signup";

export function AuthPanel({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState<string>("Nigeria");
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tabHover, setTabHover] = useState<AuthMode | null>(null);

  const supabaseReady = hasSupabaseCredentials();
  const supabase = useMemo(() => createBrowserClient(), []);

  // Already signed in → dashboard (Sign in ≠ Log out flow)
  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const enterApp = (preferredName: string, userEmail: string, userCountry: string) => {
    const existing = localData.getProfile();
    localData.saveProfile(
      normalizeProfile({
        ...existing,
        preferredName: preferredName || userEmail.split("@")[0] || "Athlete",
        email: userEmail,
        country: userCountry || existing?.country || "Nigeria",
        emailVerified: true,
      })
    );
    localData.savePendingSignup(null);
    markSignedIn();
    notificationsStore.ensureWelcomePack(preferredName || "Athlete");
    router.replace("/dashboard");
  };

  const submitEmail = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const emailError = validateSignupEmail(cleanEmail);
    if (emailError) {
      setError(emailError);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Add your preferred name.");
        return;
      }
      if (!country.trim()) {
        setError("Select the country you come from.");
        return;
      }
    }

    setLoading("email");

    if (mode === "signup") {
      localData.savePendingSignup({
        preferredName: name.trim(),
        email: cleanEmail,
        country,
        passwordHint: true,
        password,
        createdAt: new Date().toISOString(),
      });
      localData.setDemoSignedIn(false);
      emitAuthChange();

      if (!supabase) {
        setLoading(null);
        router.push(`/auth/verify-email?email=${encodeURIComponent(cleanEmail)}`);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            preferred_name: name.trim(),
            country,
          },
          emailRedirectTo: getAuthRedirectUrl("/auth/callback"),
        },
      });

      if (signUpError) {
        setLoading(null);
        setError(signUpError.message);
        return;
      }

      if (!data.session) {
        const identities = data.user?.identities ?? [];
        if (data.user && identities.length === 0) {
          setLoading(null);
          setError("An account with this email already exists. Sign in instead.");
          return;
        }
        setLoading(null);
        setMessage("Confirmation email sent. Open Gmail (check Spam too), then come back.");
        router.push(`/auth/verify-email?email=${encodeURIComponent(cleanEmail)}`);
        return;
      }

      localData.saveLocalAuth({ email: cleanEmail, password });
      enterApp(name.trim(), cleanEmail, country);
      setLoading(null);
      return;
    }

    // —— Sign in ——
    if (!supabase) {
      const pending = localData.getPendingSignup();
      const profile = localData.getProfile();
      const localAuth = localData.getLocalAuth();

      if (pending && pending.email === cleanEmail) {
        setLoading(null);
        setError("Confirm your email first before signing in.");
        router.push(`/auth/verify-email?email=${encodeURIComponent(cleanEmail)}`);
        return;
      }

      const credsOk =
        localAuth &&
        localAuth.email === cleanEmail &&
        localAuth.password === password;

      const legacyOk =
        !localAuth &&
        profile &&
        profile.email?.toLowerCase() === cleanEmail &&
        profile.emailVerified;

      if (credsOk || legacyOk) {
        if (credsOk) {
          // keep creds
        } else if (legacyOk) {
          localData.saveLocalAuth({ email: cleanEmail, password });
        }
        enterApp(
          profile?.preferredName || cleanEmail.split("@")[0],
          cleanEmail,
          profile?.country || "Nigeria"
        );
        setLoading(null);
        return;
      }

      if (localAuth && localAuth.email === cleanEmail && localAuth.password !== password) {
        setLoading(null);
        setError("Wrong password. Use the eye icon to check what you typed, then try again.");
        return;
      }

      setLoading(null);
      setError(
        "No account found for this email on this device. Use Sign up first, or connect Supabase for cloud login."
      );
      return;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (signInError) {
      setLoading(null);
      const msg = signInError.message.toLowerCase();
      if (msg.includes("confirm") || msg.includes("verified")) {
        setError("Confirm your email from your inbox before signing in.");
        router.push(`/auth/verify-email?email=${encodeURIComponent(cleanEmail)}`);
        return;
      }
      if (msg.includes("invalid") || msg.includes("credentials")) {
        setError("Wrong email or password. Use the eye icon to check your password.");
        return;
      }
      setError(signInError.message);
      return;
    }

    localData.saveLocalAuth({ email: cleanEmail, password });
    const meta = data.user?.user_metadata ?? {};
    enterApp(
      (typeof meta.preferred_name === "string" && meta.preferred_name) ||
        name.trim() ||
        cleanEmail.split("@")[0],
      cleanEmail,
      (typeof meta.country === "string" && meta.country) || country
    );
    setLoading(null);
  };

  const tabClass = (tab: AuthMode) =>
    cn(
      "rounded-full py-2.5 text-sm font-semibold text-center transition-colors duration-150",
      mode === tab
        ? "bg-[var(--lime)] text-[#0a0a0a]"
        : tabHover === tab
          ? "text-[var(--lime)]"
          : "text-[var(--text-muted)]"
    );

  return (
    <div className="container-page w-full max-w-lg mx-auto py-5 md:py-12">
      <div className="rounded-2xl border-2 border-[rgba(200,255,60,0.4)] bg-[var(--bg-card)] p-5 md:p-7 space-y-4 shadow-[0_0_40px_rgba(200,255,60,0.08)]">
        <div>
          <p className="section-eyebrow mb-1">RepForge account</p>
          <h1 className="display-title text-3xl md:text-4xl mb-1">
            {mode === "signup" ? "Create account" : "Welcome back"}
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {mode === "signup"
              ? "New here? Create an account, then confirm your email."
              : "Already have an account? Sign in below. Log out is only in your profile menu when you are signed in."}
          </p>
        </div>

        <div
          className="grid grid-cols-2 gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-1"
          role="tablist"
          aria-label="Auth mode"
        >
          <Link
            href="/auth/signin"
            role="tab"
            aria-selected={mode === "signin"}
            className={tabClass("signin")}
            onMouseEnter={() => setTabHover("signin")}
            onMouseLeave={() => setTabHover(null)}
            onFocus={() => setTabHover("signin")}
            onBlur={() => setTabHover(null)}
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            role="tab"
            aria-selected={mode === "signup"}
            className={tabClass("signup")}
            onMouseEnter={() => setTabHover("signup")}
            onMouseLeave={() => setTabHover(null)}
            onFocus={() => setTabHover("signup")}
            onBlur={() => setTabHover(null)}
          >
            Sign up
          </Link>
        </div>

        {(error || message) && (
          <div
            className={
              error
                ? "rounded-xl border border-[rgba(255,92,92,0.45)] bg-[rgba(255,92,92,0.12)] px-4 py-3 text-sm text-[var(--danger)]"
                : "rounded-xl border border-[rgba(46,230,255,0.35)] bg-[var(--cyan-dim)] px-4 py-3 text-sm text-[var(--cyan)]"
            }
            role={error ? "alert" : "status"}
          >
            {error || message}
          </div>
        )}

        <SocialAuthButtons
          loading={loading}
          setLoading={setLoading}
          onError={(msg) => {
            setMessage(null);
            setError(msg || null);
          }}
        />

        <div className="flex items-center gap-3 text-xs text-[var(--text-dim)]">
          <span className="h-px flex-1 bg-[var(--border)]" />
          or continue with email
          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <form className="space-y-3" onSubmit={(e) => void submitEmail(e)}>
          {mode === "signup" && (
            <>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium">Preferred name</span>
                <input
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="nickname"
                  placeholder="OLUWASEGUN"
                  required
                />
              </label>

              <label className="grid gap-1.5 text-sm">
                <span className="font-medium">Country you come from</span>
                <select
                  className="select-field"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                >
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Email (Gmail or permanent inbox)</span>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@gmail.com"
              required
            />
          </label>

          <PasswordField
            value={password}
            onChange={setPassword}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />

          <Button type="submit" className="w-full !min-h-[3.25rem]" disabled={loading !== null}>
            {loading === "email"
              ? "Please wait…"
              : mode === "signup"
                ? "Sign up — then confirm email"
                : "Sign in with email"}
          </Button>
        </form>

        <p className="text-xs text-[var(--text-dim)] leading-relaxed border-t border-[var(--border)] pt-3">
          {supabaseReady
            ? "Secure sign-in connected. Use email or a social account (Discord, Google, and more)."
            : "Social login is offline on this deploy until Supabase keys are added in Vercel and the site is redeployed."}
        </p>
      </div>

      <p className="text-center text-sm text-[var(--text-muted)] mt-5">
        <Link href="/exercises" className="text-[var(--cyan)] hover:underline">
          Browse exercises without an account
        </Link>
      </p>
    </div>
  );
}
