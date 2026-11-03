"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

const FLAG = "repforge.justSignedOut";

function BannerInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let shouldShow = false;
    try {
      if (sessionStorage.getItem(FLAG) === "1") {
        sessionStorage.removeItem(FLAG);
        shouldShow = true;
      }
    } catch {
      // ignore
    }
    if (params.get("signedOut") === "1") {
      shouldShow = true;
      router.replace("/", { scroll: false });
    }
    if (shouldShow) setShow(true);
  }, [params, router]);

  if (!show) return null;

  return (
    <div
      role="status"
      className="relative z-30 border-b border-[rgba(200,255,60,0.35)] bg-[var(--lime-dim)]"
    >
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
        <p className="text-sm text-[var(--text)] inline-flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[var(--lime)] shrink-0" aria-hidden />
          You are signed out. Use <strong className="font-semibold">Sign in</strong> to come back —
          that is different from Log out.
        </p>
        <div className="flex items-center gap-2">
          <Link href="/auth/signin" className="btn-primary !min-h-0 !py-2 !px-4 text-sm">
            Sign in
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)]"
            aria-label="Dismiss"
            onClick={() => setShow(false)}
          >
            <X size={16} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

export function SignedOutBanner() {
  return (
    <Suspense fallback={null}>
      <BannerInner />
    </Suspense>
  );
}

/** Call right before navigating home after logout. */
export function markJustSignedOut() {
  try {
    sessionStorage.setItem(FLAG, "1");
  } catch {
    // ignore
  }
}
