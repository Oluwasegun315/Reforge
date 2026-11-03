"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Always-visible cue: Guest browsing vs signed-in inside RepForge.
 */
export function SessionStatusBar() {
  const auth = useAuth();

  if (auth.loggedIn && auth.preferredName) {
    const first = auth.preferredName.split(" ")[0];
    return (
      <div
        role="status"
        className="border-b border-[rgba(200,255,60,0.28)] bg-[var(--lime-dim)]"
      >
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
          <p className="text-[var(--text)]">
            <span className="inline-flex items-center gap-2 font-semibold text-[var(--lime)]">
              <span className="h-2 w-2 rounded-full bg-[var(--lime)] animate-pulse" aria-hidden />
              You are inside
            </span>
            <span className="text-[var(--text-muted)]"> · Signed in as </span>
            <span className="font-semibold text-[var(--text)]">{first}</span>
          </p>
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Link href="/dashboard" className="text-[var(--cyan)] hover:underline font-medium">
              Dashboard
            </Link>
            <Link href="/profile" className="text-[var(--text-muted)] hover:text-[var(--text)]">
              Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div role="status" className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
        <p className="text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-2 font-semibold text-[var(--text-dim)]">
            <span className="h-2 w-2 rounded-full bg-[var(--text-dim)]" aria-hidden />
            Guest mode
          </span>
          <span> · Browse freely. Sign in to unlock your dashboard, alerts & settings.</span>
        </p>
        <div className="flex items-center gap-2">
          <Link href="/auth/signin" className="text-[var(--cyan)] hover:underline text-xs sm:text-sm font-medium">
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center rounded-full bg-[var(--lime)] text-black px-3 py-1 text-xs font-semibold"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
