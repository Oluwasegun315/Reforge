import type { Metadata } from "next";
import { Suspense } from "react";
import { ExerciseExplorer } from "@/components/exercises/ExerciseExplorer";

export const metadata: Metadata = {
  title: "Exercise Explorer",
  description:
    "Browse RepForge exercises by muscle group, equipment, experience, and training location.",
};

export default function ExercisesPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <div className="max-w-2xl mb-8">
        <p className="section-eyebrow mb-3">Find Your Workout</p>
        <h1 className="display-title text-4xl md:text-5xl mb-3">Exercise explorer</h1>
        <p className="text-[var(--text-muted)]">
          Filter by muscle, equipment, experience, and location. Open any exercise for
          instructions, sets, reps, and common mistakes.
        </p>
      </div>
      <Suspense fallback={<p className="text-[var(--text-muted)]">Loading exercises…</p>}>
        <ExerciseExplorer />
      </Suspense>
    </div>
  );
}
