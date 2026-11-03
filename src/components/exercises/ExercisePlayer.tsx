"use client";

import { useRef, useState } from "react";
import { Pause, Play, RotateCcw, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Reusable exercise media player.
 * Prepared for future 3D animations / muscle maps via the `futureSlot` prop.
 * Does not claim AI form correction.
 */
export function ExercisePlayer({
  videoSrc,
  title,
  captionsText,
}: {
  videoSrc: string | null;
  title: string;
  captionsText?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const toggle = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const replay = async () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    await video.play();
    setPlaying(true);
  };

  if (!videoSrc || failed) {
    return (
      <div className="relative aspect-video rounded-[1rem] border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden flex flex-col items-center justify-center gap-3 p-6 text-center">
        <VideoOff className="text-[var(--text-dim)]" size={36} aria-hidden />
        <div>
          <p className="font-semibold mb-1">Demonstration coming soon</p>
          <p className="text-sm text-[var(--text-muted)] max-w-sm">
            No video file is available for {title} yet. Follow the written instructions below —
            they cover form, breathing, and common mistakes.
          </p>
        </div>
        {/* Slot reserved for future 3D / muscle-map visuals */}
        <div data-future="muscle-map-3d" className="sr-only" aria-hidden />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video rounded-[1rem] overflow-hidden border border-[var(--border)] bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          playsInline
          controls={false}
          onEnded={() => setPlaying(false)}
          onError={() => setFailed(true)}
          aria-label={`${title} demonstration video`}
        >
          <source src={videoSrc} type="video/mp4" />
          {captionsText && (
            <track
              kind="captions"
              srcLang="en"
              label="English instructions"
              src={`data:text/vtt,WEBVTT%0A%0A00:00:00.000 --> 00:00:30.000%0A${encodeURIComponent(captionsText)}`}
            />
          )}
        </video>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => void toggle()} aria-pressed={playing}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
          {playing ? "Pause" : "Play"}
        </Button>
        <Button variant="secondary" onClick={() => void replay()}>
          <RotateCcw size={16} />
          Replay
        </Button>
      </div>
      <p className="text-xs text-[var(--text-dim)]">
        Written instructions are always available as an accessible alternative to video.
      </p>
    </div>
  );
}
