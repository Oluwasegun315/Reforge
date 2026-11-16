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
    <div className="relative overflow-hidden rounded-[1.35rem] border border-[rgba(200,255,60,0.28)] bg-black shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/10 bg-[#1b1b1f]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--lime)] text-black">
            <Video size={14} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              RepForge · Talk with Founder
            </p>
            <p className="text-[10px] text-white/55 truncate">
              {label} · {FOUNDER_SESSION.durationMinutes} min session
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
            className={`inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--lime)] text-black shadow-lg transition ${
              playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            }`}
          >
            {playing ? (
              <Pause size={22} aria-hidden />
            ) : (
              <Play size={22} className="ml-0.5" aria-hidden />
            )}
          </span>
        </button>
      </div>

      <div className="grid sm:grid-cols-[1fr_auto] gap-3 px-4 py-3 border-t border-white/10 bg-[#121214]">
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
          {blurb} You can book the same founder time for{" "}
          <strong className="text-[var(--lime)]">${FOUNDER_SESSION.collectUsd}</strong> today.
        </p>
        <a
          href="#book"
          className="btn-primary !min-h-0 !py-2.5 !px-4 text-sm justify-center self-center"
        >
          Book for ${FOUNDER_SESSION.collectUsd}
        </a>
      </div>
    </div>
  );
}

export function SessionDemo() {
  return (
    <section aria-labelledby="session-demo" className="space-y-5">
      <div className="max-w-2xl">
        <p className="section-eyebrow mb-2">Live session previews</p>
        <h2 id="session-demo" className="display-title text-3xl md:text-4xl mb-3">
          Zoom + Google Meet — see the founder at work
        </h2>
        <p className="text-[var(--text-muted)] leading-relaxed">
          Two real-feel demos with {FOUNDER.formalName}: a Zoom call with a UK client, and a Google
          Meet call with a USA client while he notes her goals with pen and notebook. Sessions are
          valued at ${FOUNDER_SESSION.priceUsd}; your founder favour is{" "}
          <strong className="text-[var(--lime)]">${FOUNDER_SESSION.collectUsd}</strong>.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-5">
        {DEMOS.map((demo) => (
          <DemoPlayer key={demo.id} {...demo} />
        ))}
      </div>
    </section>
  );
}
