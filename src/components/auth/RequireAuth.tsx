"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { localData } from "@/lib/storage";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card } from "@/components/ui/Card";

/** Soft gate: dashboard/profile/settings require an active signed-in session. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [ready, setReady] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    const pending = localData.getPendingSignup();
    setPendingEmail(pending && !auth.loggedIn ? pending.email : null);
    setReady(true);
  }, [auth.loggedIn]);

  if (!ready) {
    return (
      <div className="container-page py-16 text-center text-[var(--text-muted)] text-sm">
        Checking your account…
      </div>
    );
  }

  if (!auth.loggedIn) {
    return (
      <div className="container-page py-12 max-w-lg mx-auto">
        <Card className="!p-6 md:!p-8 space-y-4 text-center">
          <h1 className="display-title text-3xl">Sign in required</h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {pendingEmail
              ? `Confirm ${pendingEmail} from your inbox before entering.`
              : "You are in guest mode. Sign in to open Profile, Settings, and Dashboard."}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {pendingEmail ? (
              <Link
                href={`/auth/verify-email?email=${encodeURIComponent(pendingEmail)}`}
                prefetch
                className="btn-primary"
              >
                Confirm email
              </Link>
            ) : (
              <Link href="/auth/signup" prefetch className="btn-primary">
                Sign up
              </Link>
            )}
            <Link href="/auth/signin" prefetch className="btn-secondary">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
