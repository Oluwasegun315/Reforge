import Link from "next/link";
import type { WorkoutPlan } from "@/lib/types";
import { GOAL_LABELS, LEVEL_LABELS } from "@/lib/labels";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function WorkoutCard({ plan }: { plan: WorkoutPlan }) {
  return (
    <Card as="article">
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge>{GOAL_LABELS[plan.goal]}</Badge>
        <Badge className="!bg-[var(--cyan-dim)] !text-[var(--cyan)] !border-[rgba(46,230,255,0.25)]">
          {LEVEL_LABELS[plan.level]}
        </Badge>
      </div>
      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
      <p className="text-sm text-[var(--text-muted)] mb-4">{plan.description}</p>
      <p className="text-sm mb-5">
        <span className="text-[var(--lime)] font-semibold">{plan.durationMinutes} min</span>
        <span className="text-[var(--text-dim)]"> · {plan.exercises.length} exercises</span>
      </p>
      <Link href="/workouts/timer" className="btn-primary w-full">
        Start with timer
      </Link>
    </Card>
  );
}
