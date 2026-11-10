import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { FounderPhoto } from "@/components/home/FounderPhoto";
import { BENEFITS, FOUNDER, SITE_NAME } from "@/lib/seo";

export function BenefitsFounder() {
  return (
    <>
      <section
        className="container-page py-16 md:py-20"
        aria-labelledby="benefits-heading"
      >
        <div className="max-w-2xl mb-10">
          <p className="section-eyebrow mb-3">Why people choose RepForge</p>
          <h2 id="benefits-heading" className="display-title text-4xl md:text-5xl mb-4">
            Benefits you can feel.
          </h2>
          <p className="text-[var(--text-muted)] text-lg">
            Practical tools for real life — clearer form, better consistency, and progress you can
            trust day by day.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((item) => (
            <Card key={item.title} as="article" className="!p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="text-[var(--lime)] shrink-0 mt-0.5"
                  size={18}
                  aria-hidden
                />
                <div>
                  <h3 className="font-semibold mb-1.5">{item.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section
        className="container-page pb-8"
        aria-labelledby="founder-heading"
        id="founder"
      >
        <Card className="!p-6 md:!p-10 bg-[linear-gradient(135deg,rgba(200,255,60,0.1),rgba(46,230,255,0.05))]">
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-start">
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-2xl overflow-hidden border border-[rgba(200,255,60,0.35)] bg-[var(--bg-elevated)] shadow-[0_0_40px_rgba(200,255,60,0.12)]">
              <FounderPhoto />
            </div>
            <div className="min-w-0 flex-1">
              <p className="section-eyebrow mb-3">Founder</p>
              <h2 id="founder-heading" className="display-title text-3xl md:text-4xl mb-3">
                {FOUNDER.formalName}
              </h2>
              <p className="text-[var(--text-muted)] max-w-3xl leading-relaxed mb-4">
                {FOUNDER.name} is the founder of {SITE_NAME}. He built this platform so adults 18+ —
                especially people training in Nigeria — can access clear exercise guidance, local
                nutrition ideas, a reliable workout timer, and honest progress tracking without
                paying just to get started.
              </p>
              <ul className="text-sm text-[var(--text-muted)] space-y-1.5 mb-5">
                <li>
                  <span className="text-[var(--lime)] font-semibold">Founder:</span>{" "}
                  {FOUNDER.formalName}
                </li>
                <li>
                  <span className="text-[var(--lime)] font-semibold">Based:</span> {FOUNDER.city},{" "}
                  {FOUNDER.country}
                </li>
                <li>
                  <span className="text-[var(--lime)] font-semibold">Mission:</span> Make serious
                  fitness guidance free-first and practical for everyday life.
                </li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link href="/auth/signup" className="btn-primary">
                  Start free with RepForge
                </Link>
                <Link href="/beginners" className="btn-secondary">
                  Beginner path
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
