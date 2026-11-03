"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { exercises } from "@/data/exercises";
import { ExerciseCard } from "./ExerciseCard";
import { defaultFilters, ExerciseFilters, type FilterState } from "./ExerciseFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import type { ExperienceLevel, MuscleGroup, Equipment, TrainingLocation } from "@/lib/types";

export function ExerciseExplorer() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  useEffect(() => {
    const level = searchParams.get("level");
    const muscle = searchParams.get("muscle");
    const equipment = searchParams.get("equipment");
    const location = searchParams.get("location");
    const query = searchParams.get("q") ?? "";

    setFilters((prev) => ({
      ...prev,
      query,
      level: isLevel(level) ? level : prev.level,
      muscle: isMuscle(muscle) ? muscle : prev.muscle,
      equipment: isEquipment(equipment) ? equipment : prev.equipment,
      location: isLocation(location) ? location : prev.location,
    }));
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return exercises.filter((ex) => {
      if (filters.muscle !== "all" && ex.muscleGroup !== filters.muscle) return false;
      if (filters.equipment !== "all" && ex.equipment !== filters.equipment) return false;
      if (filters.level !== "all" && ex.difficulty !== filters.level) return false;
      if (filters.location !== "all" && !ex.location.includes(filters.location)) return false;
      if (q && !ex.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="space-y-6">
      {filters.level === "beginner" && (
        <p className="rounded-xl border border-[rgba(200,255,60,0.25)] bg-[var(--lime-dim)] px-4 py-3 text-sm text-[var(--lime)]">
          Showing beginner-friendly exercises first — perfect if you just tapped{" "}
          <strong>Explore Exercises</strong> from Start Here.
        </p>
      )}
      <ExerciseFilters value={filters} onChange={setFilters} />
      <p className="text-sm text-[var(--text-muted)]">
        Showing {filtered.length} of {exercises.length} exercises. Recommendations are general
        guidance, not a guarantee of results.
      </p>
      {filtered.length === 0 ? (
        <EmptyState
          title="No exercises match"
          description="Try clearing a filter or searching a different muscle group."
          action={
            <Button variant="secondary" onClick={() => setFilters(defaultFilters)}>
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  );
}

function isLevel(v: string | null): v is ExperienceLevel {
  return v === "beginner" || v === "intermediate" || v === "advanced";
}

function isMuscle(v: string | null): v is MuscleGroup {
  return (
    v === "chest" ||
    v === "back" ||
    v === "shoulders" ||
    v === "biceps" ||
    v === "triceps" ||
    v === "abs" ||
    v === "legs" ||
    v === "glutes" ||
    v === "calves" ||
    v === "full-body"
  );
}

function isEquipment(v: string | null): v is Equipment {
  return (
    v === "none" ||
    v === "dumbbells" ||
    v === "barbells" ||
    v === "resistance-bands" ||
    v === "machines"
  );
}

function isLocation(v: string | null): v is TrainingLocation {
  return v === "home" || v === "gym";
}
