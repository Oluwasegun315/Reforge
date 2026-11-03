import Link from "next/link";
import type { Exercise } from "@/lib/types";
import {
  EQUIPMENT_LABELS,
  LEVEL_LABELS,
  MUSCLE_LABELS,
} from "@/lib/labels";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Card as="article" className="hover:border-[rgba(200,255,60,0.28)] transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold leading-snug">
          <Link href={`/exercises/${exercise.id}`} className="hover:text-[var(--lime)]">
            {exercise.name}
          </Link>
        </h3>
        <Badge>{LEVEL_LABELS[exercise.difficulty]}</Badge>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm text-[var(--text-muted)] mb-4">
        <div>
          <dt className="text-[var(--text-dim)] text-xs uppercase tracking-wide">Muscle</dt>
          <dd>{MUSCLE_LABELS[exercise.muscleGroup]}</dd>
        </div>
        <div>
          <dt className="text-[var(--text-dim)] text-xs uppercase tracking-wide">Equipment</dt>
          <dd>{EQUIPMENT_LABELS[exercise.equipment]}</dd>
        </div>
        <div>
          <dt className="text-[var(--text-dim)] text-xs uppercase tracking-wide">Sets × Reps</dt>
          <dd>
            {exercise.sets} × {exercise.reps}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--text-dim)] text-xs uppercase tracking-wide">Rest</dt>
          <dd>{exercise.restSeconds}s</dd>
        </div>
      </dl>
      <Link href={`/exercises/${exercise.id}`} className="btn-secondary !min-h-0 !py-2 text-sm w-full">
        View details
      </Link>
    </Card>
  );
}
