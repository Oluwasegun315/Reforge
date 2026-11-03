"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Plays a looping exercise clip when visible.
 * Uses metadata preload so the homepage does not download both videos at once.
 */
export function HeroClip({
  src,
  poster,
  alt,
  position = "center",
  priority = false,
}: {
  src: string;
  poster: string;
  alt: string;
  position?: string;
  /** First visible clip can start sooner */
  priority?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(priority);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node || priority) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "120px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!active) return;
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const tryPlay = async () => {
      try {
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        await video.play();
        if (!cancelled) setReady(true);
      } catch {
        window.setTimeout(async () => {
          if (cancelled || !videoRef.current) return;
          try {
            await videoRef.current.play();
            if (!cancelled) setReady(true);
          } catch {
            if (!cancelled) setFailed(true);
          }
        }, 400);
      }
    };

    const onCanPlay = () => {
      void tryPlay();
    };

    video.addEventListener("canplay", onCanPlay);
    void tryPlay();

    return () => {
      cancelled = true;
      video.removeEventListener("canplay", onCanPlay);
    };
  }, [active, src]);

  return (
    <div ref={wrapRef} className="relative h-full min-h-[48vh] md:min-h-full overflow-hidden bg-black">
      {!ready && (
        <div
          className="absolute inset-0 z-[1] bg-cover"
          style={{
            backgroundImage: `url(${poster})`,
            backgroundPosition: position,
          }}
          aria-hidden
        />
      )}

      {active && !failed && (
        <video
          ref={videoRef}
          className={`absolute inset-0 z-[2] h-full w-full object-cover transition-opacity duration-500 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition: position }}
          autoPlay
          muted
          loop
          playsInline
          preload={priority ? "metadata" : "none"}
          poster={poster}
          onPlaying={() => setReady(true)}
          onError={() => setFailed(true)}
          aria-label={alt}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
