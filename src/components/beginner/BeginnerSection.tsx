import Link from "next/link";
import { BookOpen, Compass, LayoutList, ArrowRight } from "lucide-react";

const cards = [
  {
    icon: BookOpen,
    title: "Learn the Basics",
    body: "Understand instructions, proper movement, sets, repetitions, and rest — without jargon getting in the way.",
    href: "/beginners",
    cta: "Learn the Basics",
  },
  {
    icon: Compass,
    title: "Find Your Workout",
    body: "Explore exercises by muscle group, experience level, equipment, and whether you train at home or in a gym.",
    href: "/exercises?level=beginner",
    cta: "Explore Exercises",
  },
  {
    icon: LayoutList,
    title: "Build Your Routine",
    body: "Create a manageable plan around your goals and available time — recommended for you, or chosen by you.",
    href: "/workouts",
    cta: "Build My Plan",
  },
];

export function BeginnerSection() {
  return (
    <section
      id="start-here"
      className="container-page py-16 md:py-24"
      aria-labelledby="beginner-heading"
    >
      <div className="max-w-2xl mb-10">
        <p className="section-eyebrow mb-3">Welcoming · Clear · Practical</p>
        <h2 id="beginner-heading" className="display-title text-4xl md:text-5xl mb-4">
          New to fitness? Start here.
        </h2>
        <p className="text-[var(--text-muted)] text-lg leading-relaxed">
          Start with a clear path below, then pick from 15 exercises to see benefits, demo steps,
          and a body map of the muscles you will train.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="card-surface p-5 md:p-6 flex flex-col group transition hover:border-[rgba(200,255,60,0.35)] focus-visible:border-[var(--lime)]"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--lime-dim)] text-[var(--lime)] mb-4">
              <card.icon size={20} aria-hidden />
            </span>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--lime)] transition-colors">
              {card.title}
            </h3>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed flex-1 mb-6">
              {card.body}
            </p>
            <span className="btn-secondary self-start pointer-events-none">
              {card.cta}
              <ArrowRight size={16} aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
