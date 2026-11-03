import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import {
  BookOpen,
  Clock3,
  Dumbbell,
  Home,
  Repeat,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Beginner Guide",
  description: "Learn the basics of sets, reps, rest, and how to start training safely.",
};

const topics = [
  {
    icon: Dumbbell,
    title: "Sets",
    body: "A set is a group of repetitions performed back-to-back. Beginners often start with 2–3 sets per exercise.",
  },
  {
    icon: Repeat,
    title: "Repetitions (reps)",
    body: "A rep is one complete movement. Eight to fifteen controlled reps is a common starting range for many exercises.",
  },
  {
    icon: Clock3,
    title: "Rest",
    body: "Rest is the pause between sets. About 45–90 seconds works for many beginner sessions. Longer rest can help heavier strength work.",
  },
  {
    icon: ShieldCheck,
    title: "Form first",
    body: "Move with control. If form breaks, reduce range, slow down, or choose an easier variation. Pain is a stop signal — seek professional advice when needed.",
  },
  {
    icon: TrendingUp,
    title: "Progress",
    body: "Progress can mean better form, more reps, slightly more load, or simply showing up consistently. There is no single timeline.",
  },
  {
    icon: Home,
    title: "Home or gym",
    body: "You can train effectively in either place. Match exercises to the equipment and space you actually have.",
  },
];

const steps = [
  {
    n: "01",
    title: "Learn what the words mean",
    body: "Sets, reps, and rest are the building blocks of every workout. Read the cards below once — that is enough to start.",
  },
  {
    n: "02",
    title: "Pick a few beginner exercises",
    body: "Open the exercise library filtered for beginners. Start with movements you can do with good control.",
  },
  {
    n: "03",
    title: "Build a short plan",
    body: "Use Recommend a Workout or choose exercises yourself. Keep the first sessions around 20–45 minutes.",
  },
  {
    n: "04",
    title: "Start the timer and show up",
    body: "Press Start on the workout timer, follow your list, and finish strong. Consistency beats perfection.",
  },
];

export default function BeginnersPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <div className="max-w-2xl mb-10">
        <p className="section-eyebrow mb-3">
          <BookOpen size={14} aria-hidden />
          Learn the Basics
        </p>
        <h1 className="display-title text-4xl md:text-5xl mb-4">
          New to fitness? You belong here.
        </h1>
        <p className="text-[var(--text-muted)] text-lg leading-relaxed">
          You do not need a perfect plan on day one. Learn a few basics, pick a handful of
          movements, and build the habit. This page is your starting map.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {steps.map((step) => (
          <Card key={step.n} as="article" className="!p-5">
            <p className="text-[var(--lime)] font-bold tracking-widest text-sm mb-2">{step.n}</p>
            <h2 className="text-xl font-semibold mb-2">{step.title}</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{step.body}</p>
          </Card>
        ))}
      </div>

      <h2 className="display-title text-3xl mb-5">Key words, simply explained</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {topics.map((t) => (
          <Card key={t.title} as="article">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--lime-dim)] text-[var(--lime)] mb-3">
              <t.icon size={18} aria-hidden />
            </span>
            <h3 className="text-xl font-semibold mb-2">{t.title}</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t.body}</p>
          </Card>
        ))}
      </div>

      <Card className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <p className="text-[var(--text-muted)]">
          Ready for the next step? Browse beginner exercises or build a short plan.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/exercises?level=beginner" className="btn-primary">
            Explore Exercises
          </Link>
          <Link href="/workouts" className="btn-secondary">
            Build My Plan
          </Link>
        </div>
      </Card>
    </div>
  );
}
