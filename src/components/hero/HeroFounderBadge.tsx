"use client";

import Link from "next/link";
import { FOUNDER, SITE_NAME } from "@/lib/seo";

/** Small moving founder credit on the hero — visible on phone and desktop. */
export function HeroFounderBadge() {
  return (
    <Link
      href="/#founder"
      className="hero-founder-badge group inline-flex items-center gap-2.5 max-w-full rounded-full border border-white/25 bg-black/55 backdrop-blur-md pl-1.5 pr-3.5 py-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.45)] touch-manipulation"
      aria-label={`${FOUNDER.formalName}, founder of ${SITE_NAME}`}
    >
      <span className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0 overflow-hidden rounded-full border border-[#c8ff3c]/60 ring-2 ring-[#c8ff3c]/25">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={FOUNDER.image}
          alt=""
          className="h-full w-full object-cover"
        />
        <span
          className="pointer-events-none absolute inset-0 rounded-full hero-founder-ring"
          aria-hidden
        />
      </span>
      <span className="min-w-0 text-left leading-tight">
        <span className="block text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[#c8ff3c] font-bold">
          Founder
        </span>
        <span className="block text-[11px] sm:text-xs font-semibold text-white truncate max-w-[11.5rem] sm:max-w-[16rem]">
          {FOUNDER.formalName}
        </span>
      </span>
      <span
        className="hidden sm:inline text-[10px] text-zinc-400 group-hover:text-[#c8ff3c] transition shrink-0"
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}
