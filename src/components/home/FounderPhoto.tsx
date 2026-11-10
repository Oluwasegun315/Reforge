"use client";

import { useState } from "react";
import { FOUNDER, SITE_NAME } from "@/lib/seo";

export function FounderPhoto() {
  const [failed, setFailed] = useState(false);
  const initial = FOUNDER.name.trim().charAt(0).toUpperCase() || "I";

  if (failed) {
    return (
      <div
        className="h-full w-full flex items-center justify-center text-3xl font-bold text-[var(--lime)]"
        aria-hidden
      >
        {initial}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={FOUNDER.image}
      alt={`${FOUNDER.name}, founder of ${SITE_NAME}`}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
