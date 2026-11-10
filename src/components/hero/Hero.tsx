"use client";

import Link from "next/link";
import { HeroClip } from "./HeroClip";
import { HeroFounderBadge } from "./HeroFounderBadge";
import { useAuth } from "@/components/auth/AuthProvider";
import { FOUNDER } from "@/lib/seo";

/**
 * Dual-athlete hero — copy and CTAs change when signed in vs guest.
 */
export function Hero() {
  const auth = useAuth();
  const inside = auth.loggedIn && Boolean(auth.preferredName);
  const first = auth.preferredName?.split(" ")[0] ?? "Athlete";

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-black"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 grid grid-rows-2 md:grid-rows-1 md:grid-cols-2">
        <HeroClip
          src="/videos/hero-man.mp4"
          poster="/images/hero-man-poster.jpg"
          alt="Muscular man training with weights in a gym"
          position="center top"
          priority
        />
        <HeroClip
          src="/videos/hero-woman.mp4"
          poster="/images/hero-woman-poster.jpg"
          alt="Athletic woman training with push-ups in a gym"
          position="center"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/25 to-transparent md:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-12 -translate-y-1/2 bg-gradient-to-b from-transparent via-black/30 to-transparent md:hidden"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/80 via-black/35 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[100svh] items-end on-media">
        <div className="container-page w-full pb-20 pt-24 md:pb-20">
          <div className="max-w-3xl">
            <div className="mb-4">
              <HeroFounderBadge />
            </div>
            <p className="section-eyebrow mb-4 !text-zinc-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c8ff3c]" aria-hidden />
              {inside
                ? `Signed in · Welcome back, ${first}`
                : "Guest browsing · Ages 18+"}
            </p>
            <h1
              id="hero-heading"
              className="display-title text-[clamp(2.4rem,9vw,5.8rem)] mb-5 text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)]"
            >
              {inside ? (
                <>
                  Back in the forge,
                  <br />
                  <span className="hero-accent">{first}.</span>
                </>
              ) : (
                <>
                  Stop waiting.
                  <br />
                  <span className="hero-accent">Start forging.</span>
                </>
              )}
            </h1>
            <p className="mb-8 max-w-2xl text-base md:text-xl text-zinc-100 leading-relaxed drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)]">
              {inside
                ? "You’re inside your RepForge account — dashboard, alerts, and settings are unlocked. Pick up today’s session or check your streak."
                : "Every champion started as a beginner who refused to quit. Browse as a guest, or sign in to unlock your personal dashboard, reminders, and progress."}
            </p>
            <div className="flex flex-col xs:flex-row flex-wrap gap-3 mb-4 w-full max-w-md sm:max-w-none">
              {inside ? (
                <>
                  <Link href="/dashboard" className="btn-primary w-full sm:w-auto justify-center">
                    Open dashboard
                  </Link>
                  <Link
                    href="/workouts/timer"
                    className="btn-secondary w-full sm:w-auto justify-center !border-white/35 !text-white hover:!border-[#c8ff3c] hover:!text-[#c8ff3c]"
                  >
                    Start timer
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/signup" className="btn-primary w-full sm:w-auto justify-center">
                    Start for Free
                  </Link>
                  <Link
                    href="/exercises"
                    className="btn-secondary w-full sm:w-auto justify-center !border-white/35 !text-white hover:!border-[#c8ff3c] hover:!text-[#c8ff3c]"
                  >
                    Explore as guest
                  </Link>
                </>
              )}
            </div>
            <p className="text-sm text-zinc-300 tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {inside
                ? "Bell + settings only appear while you’re signed in."
                : "Men and women. Home or gym. Sign in anytime to go inside."}
            </p>
            <p className="mt-3 text-xs text-zinc-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Built by founder {FOUNDER.formalName} · Lagos, Nigeria
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
