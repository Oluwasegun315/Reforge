import type { Metadata } from "next";
import Link from "next/link";
import {
  Apple,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  budgetRules,
  consistencyStories,
  healthBenefits,
  nigerianPlates,
  nutrientPillars,
} from "@/data/nutrition";

export const metadata: Metadata = {
  title: "Nutrition (Nigeria)",
  description:
    "Practical Nigerian nutrition for training — local foods, budget plates, consistency stories, and why health comes first.",
};

export default function NutritionPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <div className="max-w-3xl mb-10">
        <p className="section-eyebrow mb-3">
          <UtensilsCrossed size={14} aria-hidden />
          Eat for your body · Built for Nigeria
        </p>
        <h1 className="display-title text-4xl md:text-6xl mb-4">
          Fuel the body you are forging.
        </h1>
        <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-4">
          Life in Nigeria can be hard — prices rise, power fails, schedules get messy. Still,{" "}
          <span className="text-[var(--text)] font-medium">your body and health matter most</span>. You do
          not need imported meal plans. You need local food, clear protein, and consistency.
        </p>
        <p className="text-sm text-[var(--text-dim)] leading-relaxed">
          Guidance only — not medical advice. If you have a health condition, talk to a qualified
          clinician or dietitian.
        </p>
      </div>

      {/* Ultra-short navbar-friendly summary */}
      <section className="mb-14" aria-labelledby="short-heading">
        <h2 id="short-heading" className="display-title text-2xl md:text-3xl mb-4">
          In very short
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              icon: Apple,
              title: "Every main meal",
              body: "Add protein: eggs, beans, fish, chicken.",
            },
            {
              icon: Wallet,
              title: "Use local markets",
              body: "Beans, titus, ugu, yam beat fancy imports.",
            },
            {
              icon: HeartPulse,
              title: "Train + eat + sleep",
              body: "Results come from months, not one perfect day.",
            },
            {
              icon: ShieldCheck,
              title: "Health first",
              body: "Steady habits help your body defend itself.",
            },
          ].map((item) => (
            <Card key={item.title} className="!p-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lime-dim)] text-[var(--lime)] mb-3">
                <item.icon size={16} aria-hidden />
              </span>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-14" aria-labelledby="needs-heading">
        <div className="max-w-2xl mb-6">
          <p className="section-eyebrow mb-2">
            <Sparkles size={14} aria-hidden />
            What your body needs
          </p>
          <h2 id="needs-heading" className="display-title text-3xl md:text-4xl mb-3">
            Five pillars. Simple Nigerian sources.
          </h2>
          <p className="text-[var(--text-muted)]">
            Understand these once. Then apply them with food you can actually buy.
          </p>
        </div>
        <div className="grid gap-4">
          {nutrientPillars.map((pillar) => (
            <Card key={pillar.id} as="article" className="!p-5 md:!p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="max-w-2xl">
                  <h3 className="display-title text-xl md:text-2xl mb-1">{pillar.title}</h3>
                  <p className="text-[var(--lime)] text-sm font-medium mb-2">{pillar.short}</p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{pillar.detail}</p>
                </div>
                <ul className="md:min-w-[220px] space-y-1.5 text-sm text-[var(--text-muted)]">
                  {pillar.nigerianSources.map((src) => (
                    <li key={src} className="flex gap-2">
                      <span className="text-[var(--lime)]" aria-hidden>
                        ·
                      </span>
                      <span>{src}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-14" aria-labelledby="plates-heading">
        <div className="max-w-2xl mb-6">
          <p className="section-eyebrow mb-2">How to eat it</p>
          <h2 id="plates-heading" className="display-title text-3xl md:text-4xl mb-3">
            Nigerian plates that work
          </h2>
          <p className="text-[var(--text-muted)]">
            Same culture. Better structure. Adjust portions to your size, budget, and goal.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {nigerianPlates.map((meal) => (
            <Card key={meal.id} as="article">
              <p className="text-xs uppercase tracking-wider text-[var(--cyan)] font-semibold mb-2">
                {meal.when}
              </p>
              <h3 className="font-semibold text-lg mb-2">{meal.title}</h3>
              <p className="text-sm text-[var(--text)] mb-3 leading-relaxed">{meal.plate}</p>
              <p className="text-sm text-[var(--text-muted)] mb-3 leading-relaxed">{meal.why}</p>
              <p className="text-xs text-[var(--text-dim)] border-t border-[var(--border)] pt-3">
                Tip: {meal.tip}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-14" aria-labelledby="budget-heading">
        <h2 id="budget-heading" className="display-title text-3xl md:text-4xl mb-4">
          Nigeria-aware rules
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {budgetRules.map((rule) => (
            <Card key={rule.title} as="article" className="!p-5">
              <h3 className="font-semibold mb-2 text-[var(--lime)]">{rule.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{rule.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-14" aria-labelledby="stories-heading">
        <div className="max-w-2xl mb-6">
          <p className="section-eyebrow mb-2">Real people · Real timelines</p>
          <h2 id="stories-heading" className="display-title text-3xl md:text-4xl mb-3">
            They started. Consistency paid.
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            This is not a one-day job. The results you want for your body system come from showing
            up again and again — training, food, rest — especially when motivation is quiet.
          </p>
        </div>
        <div className="grid gap-4">
          {consistencyStories.map((story) => (
            <Card key={story.id} as="article" className="!p-5 md:!p-6">
              <h3 className="display-title text-2xl mb-3">{story.name}</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--text-dim)] mb-1">
                    Started as
                  </p>
                  <p className="text-[var(--text-muted)] leading-relaxed">{story.startedAs}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--text-dim)] mb-1">
                    What they gained
                  </p>
                  <p className="text-[var(--text-muted)] leading-relaxed">{story.gained}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--lime)] mb-1">Lesson</p>
                  <p className="text-[var(--text)] leading-relaxed">{story.lesson}</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-[var(--text-dim)]">
                Source:{" "}
                <a
                  href={story.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--cyan)] hover:underline"
                >
                  {story.sourceLabel}
                </a>
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-14" aria-labelledby="health-heading">
        <div className="max-w-2xl mb-6">
          <p className="section-eyebrow mb-2">
            <ShieldCheck size={14} aria-hidden />
            Why sickness finds you less often
          </p>
          <h2 id="health-heading" className="display-title text-3xl md:text-4xl mb-3">
            A forged body is harder to break.
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed mb-3">
            Nobody is bulletproof. But people who train moderately, eat enough real food, sleep, and
            manage stress usually give illness a harder landing. Science does not say “you will never
            get sick.” It says consistent movers often get fewer infections and recover better than
            people who sit still and eat empty meals.
          </p>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            Large analyses of habitual physical activity report about a{" "}
            <span className="text-[var(--text)] font-semibold">31% lower risk</span> of community-acquired infections, and
            moderate training programmes often cut days of cold-like symptoms by roughly{" "}
            <span className="text-[var(--text)] font-semibold">40–50%</span>. Pair that with Nigerian protein, greens, and
            water — and you are building defence, not just muscle.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {healthBenefits.map((item) => (
            <Card key={item.title} as="article">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.body}</p>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-xs text-[var(--text-dim)]">
          Based on published research summaries (e.g. systematic reviews on physical activity and
          infection risk). Overtraining without rest can work against you — train hard, recover
          honestly.
        </p>
      </section>

      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6 !p-8 md:!p-10 bg-[linear-gradient(135deg,rgba(200,255,60,0.08),rgba(46,230,255,0.05))]">
        <div>
          <h2 className="display-title text-3xl md:text-4xl mb-3">Train the plate. Then train the body.</h2>
          <p className="text-[var(--text-muted)] max-w-lg">
            Use this page as your food map. Open exercises, set a timer with OLUWASEGUN, and stack
            ordinary days until results show.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/exercises" className="btn-primary">
            Open exercises
          </Link>
          <Link href="/workouts/timer" className="btn-secondary">
            Start timer
          </Link>
        </div>
      </Card>
    </div>
  );
}
