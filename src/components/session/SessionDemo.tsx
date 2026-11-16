"use client";

import { useRef, useState } from "react";
import { Pause, Play, Video } from "lucide-react";
import { FOUNDER, FOUNDER_SESSION } from "@/lib/seo";

export function SessionDemo() {
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
    <section aria-labelledby="session-demo" className="space-y-4">
      <div className="max-w-2xl">
        <p className="section-eyebrow mb-2">Live session preview</p>
        <h2 id="session-demo" className="display-title text-3xl md:text-4xl mb-3">
          See how Talk with Founder feels
        </h2>
        <p className="text-[var(--text-muted)] leading-relaxed">
          Real founder energy on Zoom or Google Meet. Watch {FOUNDER.formalName} guide a UK
          client (40+) who was stuck on consistency — then walk away with a clear plan. Sessions
          like this are valued at ${FOUNDER_SESSION.priceUsd}; your founder favour price today is{" "}
          <strong className="text-[var(--lime)]">${FOUNDER_SESSION.collectUsd}</strong>.
        </p>
      </div>

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
                Zoom / Google Meet · {FOUNDER_SESSION.durationMinutes} min
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {FOUNDER_SESSION.meetingPlatforms.map((p) => (
              <span
                key={p}
                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/80"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="group relative aspect-video bg-black">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="/videos/founder-session-demo.mp4"
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
            aria-label={playing ? "Pause demo" : "Play demo"}
          >
            <span
              className={`inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--lime)] text-black shadow-lg transition ${
                playing ? "opacity-0 hover:opacity-100 group-hover:opacity-100" : "opacity-100"
              }`}
            >
              {playing ? <Pause size={22} aria-hidden /> : <Play size={22} className="ml-0.5" aria-hidden />}
            </span>
          </button>
        </div>

        <div className="grid sm:grid-cols-[1fr_auto] gap-3 px-4 py-3 border-t border-white/10 bg-[#121214]">
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            Client problem solved on the call: daily consistency + building real muscle — with a
            plan he could keep. He paid for founder time. You can too for{" "}
            <strong className="text-[var(--lime)]">${FOUNDER_SESSION.collectUsd}</strong> today.
          </p>
          <a href="#book" className="btn-primary !min-h-0 !py-2.5 !px-4 text-sm justify-center self-center">
            Book for ${FOUNDER_SESSION.collectUsd}
          </a>
        </div>
      </div>
    </section>
  );
}
