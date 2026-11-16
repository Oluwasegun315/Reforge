"use client";

import { useRef, useState } from "react";
import { Pause, Play, Video } from "lucide-react";
import { FOUNDER, FOUNDER_SESSION } from "@/lib/seo";

const DEMOS = [
  {
    id: "zoom",
    platform: "Zoom",
    src: "/videos/founder-session-demo.mp4",
    label: "Zoom · UK client",
    blurb:
      "UK client (40+) stuck on daily consistency and real muscle — left with a plan he could keep.",
  },
  {
    id: "meet",
    platform: "Google Meet",
    src: "/videos/founder-google-meet-usa.mp4",
    label: "Google Meet · USA client",
    blurb:
      "USA client on Google Meet while the founder jots her words in a notebook — clarity, then next steps.",
  },
] as const;

function DemoPlayer({
  src,
  platform,
  label,
  blurb,
}: {
  src: string;
  platform: string;
  label: string;
  blurb: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <article className="relative flex flex-col overflow-hidden rounded-[1.25rem] border border-[rgba(200,255,60,0.28)] bg-black shadow-[0_20px_50px_rgba(0,0,0,0.4)] min-w-0">
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b border-white/10 bg-[#1b1b1f]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--lime)] text-black">
            <Video size={14} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{label}</p>
            <p className="text-[10px] text-white/55 truncate">
              Talk with Founder · {FOUNDER_SESSION.durationMinutes} min
            </p>
          </div>
        </div>
        <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/80 shrink-0">
          {platform}
        </span>
      </div>

      <div className="group relative aspect-video bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={src}
          poster="/images/founder.jpg"
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
        <button
          type="button"
          onClick={toggle}
          className={`absolute inset-0 flex items-center justify-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--lime)] ${
            playing ? "bg-transparent" : "bg-black/35 hover:bg-black/45"
          }`}
          aria-label={playing ? `Pause ${platform} demo` : `Play ${platform} demo`}
        >
          <span
            className={`inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[var(--lime)] text-black shadow-lg transition ${
              playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            }`}
          >
            {playing ? (
              <Pause size={20} aria-hidden />
            ) : (
              <Play size={20} className="ml-0.5" aria-hidden />
            )}
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-3 px-3 sm:px-4 py-3 border-t border-white/10 bg-[#121214] flex-1">
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed flex-1">{blurb}</p>
        <a
          href="#book"
          className="btn-primary !min-h-0 !py-2.5 !px-4 text-sm justify-center w-full"
        >
          Book for ${FOUNDER_SESSION.collectUsd}
        </a>
      </div>
    </article>
  );
}

export function SessionDemo() {
  return (
    <section aria-labelledby="session-demo" className="space-y-5">
      <div className="max-w-3xl">
        <p className="section-eyebrow mb-2">2 live demos · side by side</p>
        <h2 id="session-demo" className="display-title text-3xl md:text-4xl mb-3">
          Zoom + Google Meet with the founder
        </h2>
        <p className="text-[var(--text-muted)] leading-relaxed">
          Left: Zoom with a UK client. Right: Google Meet with a USA client while{" "}
          {FOUNDER.formalName} notes her goals. Valued at ${FOUNDER_SESSION.priceUsd} — founder
          favour{" "}
          <strong className="text-[var(--lime)]">${FOUNDER_SESSION.collectUsd}</strong>.
        </p>
      </div>

      {/* Always two columns from tablet up so both videos are visible together */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 items-stretch">
        {DEMOS.map((demo) => (
          <DemoPlayer key={demo.id} {...demo} />
        ))}
      </div>
    </section>
  );
}
