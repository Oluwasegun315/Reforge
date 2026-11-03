import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { exercises, getExerciseById } from "@/data/exercises";
import { ExerciseDetail } from "@/components/exercises/ExerciseDetail";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return exercises.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const exercise = getExerciseById(id);
  return {
    title: exercise?.name ?? "Exercise",
    description: exercise
      ? `How to perform ${exercise.name} with sets, reps, and form cues.`
      : "Exercise details",
  };
}

export default async function ExerciseDetailPage({ params }: Props) {
  const { id } = await params;
  const exercise = getExerciseById(id);
  if (!exercise) notFound();

  return (
    <div className="container-page py-10 md:py-14">
      <p className="mb-6">
        <Link href="/exercises" className="text-sm text-[var(--text-muted)] hover:text-[var(--lime)]">
          ← Back to exercises
        </Link>
      </p>
      <ExerciseDetail exercise={exercise} />
    </div>
  );
}
