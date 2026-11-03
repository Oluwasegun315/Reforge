import Link from "next/link";
import type { Exercise } from "@/lib/types";
import {
  EQUIPMENT_LABELS,
  LEVEL_LABELS,
  LOCATION_LABELS,
  MUSCLE_LABELS,
} from "@/lib/labels";
import { getExerciseById } from "@/data/exercises";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ExercisePlayer } from "./ExercisePlayer";

export function ExerciseDetail({ exercise }: { exercise: Exercise }) {
  const alternatives = exercise.alternatives
    .map((id) => getExerciseById(id))
    .filter(Boolean);

  return (
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
      <div className="space-y-6">
        <ExercisePlayer
          videoSrc={exercise.videoSrc}
          title={exercise.name}
          captionsText={exercise.instructions.join(" ")}
        />

        <Card>
          <h2 className="text-xl font-semibold mb-4">How to perform</h2>
          <ol className="space-y-3 list-decimal list-inside text-[var(--text-muted)]">
            {exercise.instructions.map((step) => (
              <li key={step} className="leading-relaxed">
                <span className="text-[var(--text)]">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-[var(--cyan)]">{exercise.tips}</p>
        </Card>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge>{MUSCLE_LABELS[exercise.muscleGroup]}</Badge>
            <Badge className="!bg-[var(--cyan-dim)] !text-[var(--cyan)] !border-[rgba(46,230,255,0.25)]">
              {EQUIPMENT_LABELS[exercise.equipment]}
            </Badge>
            <Badge className="!bg-[rgba(155,123,255,0.14)] !text-[var(--violet)] !border-[rgba(155,123,255,0.3)]">
              {LEVEL_LABELS[exercise.difficulty]}
            </Badge>
          </div>
          <h1 className="display-title text-4xl md:text-5xl mb-2">{exercise.name}</h1>
          <p className="text-[var(--text-muted)] text-sm">
            Suitable for: {exercise.location.map((l) => LOCATION_LABELS[l]).join(" · ")}
          </p>
        </div>

        <Card>
          <h2 className="font-semibold mb-3">Sets, reps & rest</h2>
          <dl className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-[var(--bg-elevated)] p-3">
              <dt className="text-xs text-[var(--text-dim)] uppercase">Sets</dt>
              <dd className="text-xl font-semibold text-[var(--lime)]">{exercise.sets}</dd>
            </div>
            <div className="rounded-xl bg-[var(--bg-elevated)] p-3">
              <dt className="text-xs text-[var(--text-dim)] uppercase">Reps</dt>
              <dd className="text-xl font-semibold">{exercise.reps}</dd>
            </div>
            <div className="rounded-xl bg-[var(--bg-elevated)] p-3">
              <dt className="text-xs text-[var(--text-dim)] uppercase">Rest</dt>
              <dd className="text-xl font-semibold">{exercise.restSeconds}s</dd>
            </div>
          </dl>
          <p className="text-xs text-[var(--text-dim)] mt-3">
            Treat these as starting suggestions. Adjust for how you feel that day.
          </p>
        </Card>

        <Card>
          <h2 className="font-semibold mb-3">Common mistakes</h2>
          <ul className="space-y-2 text-sm text-[var(--text-muted)]">
            {exercise.commonMistakes.map((m) => (
              <li key={m}>• {m}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="font-semibold mb-3">Beginner modifications</h2>
          <ul className="space-y-2 text-sm text-[var(--text-muted)]">
            {exercise.beginnerModifications.map((m) => (
              <li key={m}>• {m}</li>
            ))}
          </ul>
        </Card>

        {alternatives.length > 0 && (
          <Card>
            <h2 className="font-semibold mb-3">Alternatives</h2>
            <ul className="space-y-2">
              {alternatives.map(
                (alt) =>
                  alt && (
                    <li key={alt.id}>
                      <Link
                        href={`/exercises/${alt.id}`}
                        className="text-[var(--lime)] hover:underline text-sm"
                      >
                        {alt.name}
                      </Link>
                    </li>
                  )
              )}
            </ul>
          </Card>
        )}

        <Link href="/workouts" className="btn-primary w-full">
          Add to a workout plan
        </Link>
      </div>
    </div>
  );
}
