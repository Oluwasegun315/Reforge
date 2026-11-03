"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/components/auth/AuthProvider";

export function HomeCta() {
  const auth = useAuth();
  const inside = auth.loggedIn && Boolean(auth.preferredName);
  const first = auth.preferredName?.split(" ")[0] ?? "Athlete";

  return (
    <section className="container-page pb-20">
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6 !p-8 md:!p-10 bg-[linear-gradient(135deg,rgba(200,255,60,0.08),rgba(46,230,255,0.05))]">
        <div>
          <h2 className="display-title text-3xl md:text-4xl mb-3">
            {inside ? `${first}, keep the streak alive.` : "Ready to forge your next rep?"}
          </h2>
          <p className="text-[var(--text-muted)] max-w-lg">
            {inside
              ? "You’re signed in — open your dashboard, run the timer, or update your profile."
              : "Browsing as a guest is fine. Sign up to unlock dashboard, alerts, settings, and saved progress."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {inside ? (
            <>
              <Link href="/dashboard" className="btn-primary">
                Go to dashboard
              </Link>
              <Link href="/workouts/timer" className="btn-secondary">
                Start timer
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/signup" className="btn-primary">
                Start for Free
              </Link>
              <Link href="/auth/signin" className="btn-secondary">
                Sign in
              </Link>
              <Link href="/exercises" className="btn-ghost">
                Keep browsing
              </Link>
            </>
          )}
        </div>
      </Card>
    </section>
  );
}
