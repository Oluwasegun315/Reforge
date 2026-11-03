import type { Metadata } from "next";
import { WorkoutBuilder } from "@/components/workouts/WorkoutBuilder";

export const metadata: Metadata = {
  title: "Workout Builder",
  description: "Get a recommended workout or build your own routine in RepForge.",
};

export default function WorkoutsPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <div className="max-w-2xl mb-8">
        <p className="section-eyebrow mb-3">Build Your Routine</p>
        <h1 className="display-title text-4xl md:text-5xl mb-3">Workout builder</h1>
        <p className="text-[var(--text-muted)]">
          Choose <strong className="text-[var(--text)]">Recommend a workout</strong> for a guided
          plan, or <strong className="text-[var(--text)]">Let me choose</strong> to pick exercises
          yourself. Review everything before you start the timer.
        </p>
      </div>
      <WorkoutBuilder />
    </div>
  );
}
