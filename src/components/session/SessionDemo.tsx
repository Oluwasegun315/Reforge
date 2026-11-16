"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Pause, Play, Video } from "lucide-react";
import { FOUNDER, FOUNDER_SESSION } from "@/lib/seo";

type Cue = { start: number; end: number; speaker: string; line: string };

const DEMOS = [
  {
    id: "zoom-uk",
    platform: "Zoom",
    src: "/videos/founder-session-demo.mp4",
    poster: "/images/session-posters/zoom-uk.jpg",
    captions: "/captions/zoom-uk.vtt",
    label: "Zoom · UK client",
    blurb:
      "UK client (40+) stuck on daily consistency and real muscle — left with a plan he could keep.",
    cues: [
      {
        start: 0,
        end: 2.8,
        speaker: "Founder",
        line: "James, tell me where training keeps falling off for you.",
      },
      {
        start: 2.8,
        end: 5.6,
        speaker: "Client",
        line: "I start strong, then miss days — and I want real muscle, not tiny gains.",
      },
      {
        start: 5.6,
        end: 8.8,
        speaker: "Founder",
        line: "Good. We build a plan you can keep — three solid days, clear focus.",
      },
      {
        start: 8.8,
        end: 12,
        speaker: "Client",
        line: "That already feels clearer than anything I tried alone.",
      },
      {
        start: 12,
        end: 15.1,
        speaker: "Founder",
        line: "Perfect. Use RepForge this week — I will check your next steps.",
      },
    ] satisfies Cue[],
  },
  {
    id: "meet-usa",
    platform: "Google Meet",
    src: "/videos/founder-google-meet-usa.mp4",
    poster: "/images/session-posters/meet-usa.jpg",
    captions: "/captions/meet-usa.vtt",
    label: "Google Meet · USA client",
    blurb:
      "USA client on Google Meet while the founder jots her words in a notebook — clarity, then next steps.",
    cues: [
      {
        start: 0,
        end: 2.8,
        speaker: "Founder",
        line: "Sarah, what do you want from this call — say it plainly.",
      },
      {
        start: 2.8,
        end: 5.8,
        speaker: "Client",
        line: "Consistency. I keep starting over and I need a plan that sticks.",
      },
      {
        start: 5.8,
        end: 9,
        speaker: "Founder",
        line: "I am writing that down. We lock days, meals, and one weekly check-in.",
      },
      {
        start: 9,
        end: 12.2,
        speaker: "Client",
        line: "Yes — that is exactly what I needed to hear.",
      },
      {
        start: 12.2,
        end: 15.1,
        speaker: "Founder",
        line: "Great. You leave with next steps — not more confusion.",
      },
    ] satisfies Cue[],
  },
  {
    id: "zoom-ng",
    platform: "Zoom",
    src: "/videos/founder-zoom-nigeria.mp4",
    poster: "/images/session-posters/zoom-nigeria.jpg",
    captions: "/captions/zoom-nigeria.vtt",
    label: "Zoom · Nigeria client",
    blurb:
      "Nigeria client mapping a home plan that fits Lagos life — local food, busy weeks, real progress.",
    cues: [
      {
        start: 0,
        end: 2.8,
        speaker: "Founder",
        line: "Brother, what is blocking you from staying consistent in Lagos?",
      },
      {
        start: 2.8,
        end: 5.8,
        speaker: "Client",
        line: "Work, traffic, and food — I need a home plan I can actually keep.",
      },
      {
        start: 5.8,
        end: 9,
        speaker: "Founder",
        line: "We fix that. Short sessions, local plates, and a simple weekly rhythm.",
      },
      {
        start: 9,
        end: 12.2,
        speaker: "Client",
        line: "That makes sense. I can do this without an expensive gym first.",
      },
      {
        start: 12.2,
        end: 15.1,
        speaker: "Founder",
        line: "Exactly. Start this week — RepForge will keep you on track.",
      },
    ] satisfies Cue[],
  },
] as const;

const DEMOS_ZIP = "/downloads/talk-with-founder-demos.zip";

function formatTime(seconds: number) {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function DemoPlayer({
  src,
  poster,
  captions,
  platform,
  label,
  blurb,
  cues,
}: {
  src: string;
  poster: string;
  captions: string;
  platform: string;
  label: string;
  blurb: string;
  cues: readonly Cue[];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(15);

  const progress = duration > 0 ? Math.min(1, current / duration) : 0;
  const remaining = Math.max(0, duration - current);
  const endingSoon = playing && remaining > 0 && remaining <= 3.2;
  const activeCue = cues.find((c) => current >= c.start && current < c.end) ?? null;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onTime = () => setCurrent(el.currentTime);
    const onMeta = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) setDuration(el.duration);
    };

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("durationchange", onMeta);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("durationchange", onMeta);
    };
  }, []);

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

  const seek = (ratio: number) => {
    const el = videoRef.current;
    if (!el || !duration) return;
    el.currentTime = Math.min(duration, Math.max(0, ratio * duration));
    setCurrent(el.currentTime);
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
          poster={poster}
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            setCurrent(duration);
          }}
        >
          <track kind="captions" srcLang="en" label="English" src={captions} />
        </video>

        {/* Center play / pause */}
        <button
          type="button"
          onClick={toggle}
          className={`absolute inset-0 z-[1] flex items-center justify-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--lime)] ${
            playing ? "bg-transparent" : "bg-black/25 hover:bg-black/35"
          }`}
          aria-label={playing ? `Pause ${platform} session` : `Play ${platform} session`}
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

        {/* Movie-style ending soon badge */}
        {endingSoon ? (
          <div className="pointer-events-none absolute top-3 right-3 z-[3] rounded-full border border-[rgba(200,255,60,0.45)] bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--lime)] backdrop-blur-sm animate-pulse">
            Ending soon · {formatTime(remaining)}
          </div>
        ) : null}

        {/* English subtitles overlay */}
        {playing && activeCue ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-[2.85rem] z-[3] px-3 flex justify-center">
            <p className="max-w-[95%] rounded-md bg-black/78 px-3 py-1.5 text-center text-[11px] sm:text-xs leading-snug text-white shadow-lg">
              <span className="font-bold text-[var(--lime)]">{activeCue.speaker}: </span>
              {activeCue.line}
            </p>
          </div>
        ) : null}

        {/* Movie timeline / progress (visible while playing or hovering) */}
        <div
          className={`absolute inset-x-0 bottom-0 z-[4] bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pt-8 pb-2.5 transition ${
            playing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5 text-[10px] font-semibold tracking-wide text-white/75">
            <span>{formatTime(current)}</span>
            <span className={endingSoon ? "text-[var(--lime)]" : ""}>
              {endingSoon ? "Almost finished" : formatTime(duration)}
            </span>
          </div>
          <div
            className="relative h-1.5 rounded-full bg-white/20 cursor-pointer group/bar"
            role="slider"
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(current)}
            tabIndex={0}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - rect.left) / rect.width);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") seek(Math.min(1, progress + 0.05));
              if (e.key === "ArrowLeft") seek(Math.max(0, progress - 0.05));
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[var(--lime)] transition-[width] duration-100"
              style={{ width: `${progress * 100}%` }}
            />
            <span
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow border border-black/30"
              style={{ left: `calc(${progress * 100}% - 6px)` }}
            />
          </div>
        </div>
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
    <section aria-labelledby="session-proof" className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:justify-between">
        <div className="max-w-3xl">
          <p className="section-eyebrow mb-2">Simple path · Talk with Founder</p>
          <h2 id="session-proof" className="display-title text-3xl md:text-4xl mb-3">
            See the call. Book the call. Get your plan.
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Watch how {FOUNDER.formalName} guides people in the UK, USA, and Nigeria — then secure
            your own Zoom or Google Meet slot. Same founder access. Session valued at $
            {FOUNDER_SESSION.priceUsd}; you pay{" "}
            <strong className="text-[var(--lime)]">${FOUNDER_SESSION.collectUsd}</strong> today.
          </p>
        </div>
        <a
          href={DEMOS_ZIP}
          download="talk-with-founder-sessions.zip"
          className="btn-secondary !min-h-0 !py-2.5 !px-4 text-sm inline-flex items-center gap-2 shrink-0 self-start lg:self-auto"
        >
          <Download size={16} aria-hidden />
          Download session videos
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-stretch">
        {DEMOS.map((demo) => (
          <DemoPlayer key={demo.id} {...demo} />
        ))}
      </div>
    </section>
  );
}
