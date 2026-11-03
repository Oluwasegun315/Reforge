import type { Metadata } from "next";
import { WorkoutTimer } from "@/components/timer/WorkoutTimer";

export const metadata: Metadata = {
  title: "Workout Timer",
  description: "Schedule workout duration with pause, resume, and spoken end alerts.",
};

export default function TimerPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <WorkoutTimer />
    </div>
  );
}
