import type { Metadata } from "next";
import { ProgressView } from "@/components/progress/ProgressView";

export const metadata: Metadata = {
  title: "Progress",
  description: "Track workout history, activity, and personal records in RepForge.",
};

export default function ProgressPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <ProgressView />
    </div>
  );
}
