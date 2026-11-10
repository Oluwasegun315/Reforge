import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { BeginnerSection } from "@/components/beginner/BeginnerSection";
import { FocusGuideSection } from "@/components/beginner/FocusGuideSection";
import { BenefitsFounder } from "@/components/home/BenefitsFounder";
import { HomeCta } from "@/components/home/HomeCta";
import { Card } from "@/components/ui/Card";
import { FOUNDER, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import { Timer, Dumbbell, LineChart, UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Free Fitness App by ${FOUNDER.name}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const highlights = [
  {
    icon: Dumbbell,
    title: "Exercise library",
    body: "Filter by muscle, equipment, level, and location — with clear written cues.",
  },
  {
    icon: UtensilsCrossed,
    title: "Nigerian nutrition",
    body: "Local plates, budget protein, and consistency stories built for real life here.",
  },
  {
    icon: Timer,
    title: "Workout timer",
    body: "Schedule start and end times, get spoken reminders, and silence alerts anytime.",
  },
  {
    icon: LineChart,
    title: "Progress tracking",
    body: "Log sessions and review activity privately as you train.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <BeginnerSection />
      <FocusGuideSection />

      <section className="container-page py-16 md:py-24" aria-labelledby="features-heading">
        <div className="max-w-2xl mb-10">
          <p className="section-eyebrow mb-3">Train smarter</p>
          <h2 id="features-heading" className="display-title text-4xl md:text-5xl mb-4">
            Everything you need to show up.
          </h2>
          <p className="text-[var(--text-muted)] text-lg">
            Core tools are free-first. No pressure to subscribe before you explore.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item) => (
            <Card key={item.title} as="article">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--cyan-dim)] text-[var(--cyan)] mb-4">
                <item.icon size={18} aria-hidden />
              </span>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <BenefitsFounder />
      <HomeCta />
    </>
  );
}
