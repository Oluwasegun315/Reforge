"use client";

import { useId, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles, Volume2, VolumeX } from "lucide-react";
import { focusGuides, type FocusGuide } from "@/data/focus-guides";
import { Button } from "@/components/ui/Button";
import { canSpeak, speak, stopSpeaking } from "@/lib/speech";
import { COACH_NAME } from "@/lib/coach";

export function FocusGuideSection() {
  const [selectedId, setSelectedId] = useState(focusGuides[0].id);
  const [voiceOn, setVoiceOn] = useState(false);
  const [isPending, startTransition] = useTransition();
  const selected = focusGuides.find((g) => g.id === selectedId) ?? focusGuides[0];
  const detailRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  const selectGuide = (id: string) => {
    startTransition(() => {
      setSelectedId(id);
    });
    const guide = focusGuides.find((g) => g.id === id);
    if (voiceOn && guide && canSpeak()) {
      speak(
        `${COACH_NAME} here. ${guide.title}. ${guide.shortBenefit}. ${guide.returnIn}`
      );
    }
  };

  return (
    <section
      id="choose-focus"
      className="container-page py-16 md:py-24"
      aria-labelledby={headingId}
    >
      <div className="max-w-3xl mb-8">
        <p className="section-eyebrow mb-3">
          <Sparkles size={14} aria-hidden />
          Pick what you want to train
        </p>
        <h2 id={headingId} className="display-title text-4xl md:text-5xl mb-4">
          Choose 1 of 15. See the full guide.
        </h2>
        <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-4">
          Tap an exercise for benefits, clear steps, and what you train toward — with{" "}
          {COACH_NAME} as your spoken coach when you turn voice on.
        </p>
        <Button
          variant="secondary"
          className="!min-h-0 !py-2"
          onClick={() => {
            if (voiceOn) stopSpeaking();
            setVoiceOn((v) => !v);
          }}
        >
          {voiceOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          {voiceOn ? `${COACH_NAME} voice on` : `${COACH_NAME} voice off`}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {focusGuides.map((guide) => {
          const active = guide.id === selectedId;
          return (
            <button
              key={guide.id}
              type="button"
              onClick={() => selectGuide(guide.id)}
              aria-pressed={active}
              className={
                active
                  ? "text-left rounded-2xl border border-[rgba(200,255,60,0.45)] bg-[var(--lime-dim)] p-3 md:p-4 transition"
                  : "text-left rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-3 md:p-4 transition hover:border-[rgba(200,255,60,0.28)]"
              }
            >
              <p className="font-semibold text-sm md:text-base leading-snug mb-1">{guide.title}</p>
              <p className="text-[11px] md:text-xs text-[var(--text-muted)] leading-snug">
                {guide.shortBenefit}
              </p>
            </button>
          );
        })}
      </div>

      <div
        ref={detailRef}
        className={`card-surface p-5 md:p-8 space-y-6 ${isPending ? "opacity-80" : ""}`}
      >
        <div className="flex flex-wrap justify-center gap-2">
          {selected.musclesWorked.map((m) => (
            <span key={m} className="badge">
              {m}
            </span>
          ))}
        </div>

        <FocusDetail
          guide={selected}
          onHearSteps={() => {
            if (!canSpeak()) return;
            setVoiceOn(true);
            speak(
              `${COACH_NAME} here. How to do ${selected.title}. ${selected.howTo.join(". ")}. Benefits: ${selected.benefits.join(". ")}.`
            );
          }}
        />
      </div>
    </section>
  );
}

function FocusDetail({
  guide,
  onHearSteps,
}: {
  guide: FocusGuide;
  onHearSteps: () => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="badge">{guide.level}</span>
        <span className="text-xs text-[var(--text-dim)]">Guidance only · not medical advice</span>
      </div>
      <h3 className="display-title text-3xl md:text-4xl mb-3">{guide.title}</h3>
      <p className="text-[var(--text-muted)] mb-6">{guide.shortBenefit}</p>

      <h4 className="font-semibold mb-3 text-[var(--lime)]">Benefits you can train for</h4>
      <ul className="space-y-2 mb-6">
        {guide.benefits.map((b) => (
          <li key={b} className="flex gap-2 text-sm text-[var(--text-muted)]">
            <CheckCircle2 size={16} className="text-[var(--lime)] shrink-0 mt-0.5" aria-hidden />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <h4 className="font-semibold mb-3 text-[var(--cyan)]">How to do it</h4>
      <ol className="space-y-3 mb-4">
        {guide.howTo.map((step, i) => (
          <li key={step} className="flex gap-3 text-sm">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--cyan-dim)] text-[var(--cyan)] font-bold text-xs">
              {i + 1}
            </span>
            <span className="text-[var(--text-muted)] pt-1">{step}</span>
          </li>
        ))}
      </ol>
      <Button variant="secondary" className="!min-h-0 !py-2 mb-6" onClick={onHearSteps}>
        <Volume2 size={16} />
        Hear {COACH_NAME} explain this move
      </Button>

      <div className="rounded-xl border border-[rgba(46,230,255,0.25)] bg-[var(--cyan-dim)] p-4 mb-6">
        <p className="text-xs uppercase tracking-wider text-[var(--cyan)] font-semibold mb-1">
          What you train toward
        </p>
        <p className="text-sm text-[var(--text)] leading-relaxed">{guide.returnIn}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={`/exercises/${guide.exerciseId}`} className="btn-primary">
          Open full exercise page
        </Link>
        <Link href="/workouts/timer" className="btn-secondary">
          Set time with {COACH_NAME}
        </Link>
        <Link href="/workouts" className="btn-ghost">
          Add to my plan
        </Link>
      </div>
    </div>
  );
}
