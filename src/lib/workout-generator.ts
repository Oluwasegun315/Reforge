import { exercises } from "@/data/exercises";
import type {
  Equipment,
  ExperienceLevel,
  FitnessGoal,
  MuscleGroup,
  TrainingLocation,
  WorkoutExercise,
  WorkoutPlan,
} from "./types";

export interface RecommendInput {
  goal: FitnessGoal;
  experience: ExperienceLevel;
  location: TrainingLocation;
  equipment: Equipment[];
  durationMinutes: number;
  focusAreas: MuscleGroup[];
  preferredDays?: string[];
}

const LEVEL_RANK: Record<ExperienceLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

function matchesLevel(exLevel: ExperienceLevel, userLevel: ExperienceLevel) {
  return LEVEL_RANK[exLevel] <= LEVEL_RANK[userLevel] + 1;
}

function pickCount(durationMinutes: number): number {
  if (durationMinutes <= 25) return 4;
  if (durationMinutes <= 40) return 5;
  if (durationMinutes <= 55) return 6;
  return 7;
}

function setsForLevel(level: ExperienceLevel): number {
  if (level === "beginner") return 3;
  if (level === "intermediate") return 3;
  return 4;
}

/**
 * Rule-based workout builder — no AI API required.
 * Uses safe defaults and the local exercise library.
 */
export function recommendWorkout(input: RecommendInput): WorkoutPlan {
  const equipmentSet = new Set(
    input.equipment.length ? input.equipment : (["none"] as Equipment[])
  );

  const focus =
    input.focusAreas.length > 0
      ? input.focusAreas
      : (["full-body", "legs", "chest", "back"] as MuscleGroup[]);

  let pool = exercises.filter((ex) => {
    const locOk = ex.location.includes(input.location);
    const equipOk = equipmentSet.has(ex.equipment);
    const levelOk = matchesLevel(ex.difficulty, input.experience);
    const muscleOk =
      focus.includes(ex.muscleGroup) ||
      focus.includes("full-body") ||
      (ex.secondaryMuscles?.some((m) => focus.includes(m)) ?? false);
    return locOk && equipOk && levelOk && muscleOk;
  });

  if (pool.length < 3) {
    pool = exercises.filter(
      (ex) =>
        ex.location.includes(input.location) &&
        equipmentSet.has(ex.equipment) &&
        matchesLevel(ex.difficulty, input.experience)
    );
  }

  if (pool.length < 3) {
    pool = exercises.filter(
      (ex) =>
        ex.equipment === "none" && matchesLevel(ex.difficulty, input.experience)
    );
  }

  // Prefer variety across muscle groups
  const selected: typeof pool = [];
  const usedMuscles = new Set<string>();

  const sorted = [...pool].sort((a, b) => {
    const aFocus = focus.includes(a.muscleGroup) ? 0 : 1;
    const bFocus = focus.includes(b.muscleGroup) ? 0 : 1;
    return aFocus - bFocus;
  });

  for (const ex of sorted) {
    if (selected.length >= pickCount(input.durationMinutes)) break;
    if (usedMuscles.has(ex.muscleGroup) && selected.length < 3) {
      // allow early duplicates only if needed later
    }
    if (
      usedMuscles.has(ex.muscleGroup) &&
      selected.length >= Math.ceil(pickCount(input.durationMinutes) / 2)
    ) {
      continue;
    }
    selected.push(ex);
    usedMuscles.add(ex.muscleGroup);
  }

  for (const ex of sorted) {
    if (selected.length >= pickCount(input.durationMinutes)) break;
    if (!selected.find((s) => s.id === ex.id)) selected.push(ex);
  }

  const workoutExercises: WorkoutExercise[] = selected.map((ex) => ({
    exerciseId: ex.id,
    sets: setsForLevel(input.experience),
    reps: ex.reps,
    restSeconds: ex.restSeconds,
  }));

  const goalTitle: Record<FitnessGoal, string> = {
    "build-muscle": "Muscle Builder",
    "get-stronger": "Strength Focus",
    "lose-fat": "Conditioning Circuit",
    "improve-fitness": "Fitness Foundations",
    "general-conditioning": "Balanced Conditioning",
  };

  return {
    id: `plan-${Date.now()}`,
    name: `${goalTitle[input.goal]} · ${input.durationMinutes} min`,
    description:
      "A starter plan based on your preferences. Adjust exercises anytime. This is general guidance, not a guarantee of results.",
    goal: input.goal,
    level: input.experience,
    location: input.location,
    durationMinutes: input.durationMinutes,
    exercises: workoutExercises,
    createdAt: new Date().toISOString(),
  };
}

export function suggestDuration(
  experience: ExperienceLevel,
  availableMinutes?: number
): number[] {
  const base =
    experience === "beginner"
      ? [20, 30, 45]
      : experience === "intermediate"
        ? [30, 45, 60]
        : [45, 60, 75];

  if (!availableMinutes) return base;
  return base
    .map((d) => Math.min(d, availableMinutes))
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .sort((a, b) => a - b);
}

export function formatTimeLabel(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
