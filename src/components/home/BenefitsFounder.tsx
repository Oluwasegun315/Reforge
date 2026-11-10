import Link from "next/link";
import { CheckCircle2, Mail, Phone } from "lucide-react";
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
          <div className="flex flex-col lg:flex-row gap-8 md:gap-10 items-start">
            <div className="relative h-32 w-32 sm:h-36 sm:w-36 shrink-0 rounded-2xl overflow-hidden border border-[rgba(200,255,60,0.35)] bg-[var(--bg-elevated)] shadow-[0_0_40px_rgba(200,255,60,0.12)]">
              <FounderPhoto />
            </div>

            <div className="min-w-0 flex-1 space-y-5">
              <div>
                <p className="section-eyebrow mb-3">About the founder</p>
                <h2 id="founder-heading" className="display-title text-3xl md:text-4xl mb-3">
                  {FOUNDER.formalName}
                </h2>
                <p className="text-sm text-[var(--text-dim)] mb-4">
                  Founder of {SITE_NAME} · {FOUNDER.city}, {FOUNDER.country}
                </p>
                <p className="text-[var(--text-muted)] max-w-3xl leading-relaxed mb-3">
                  {FOUNDER.story}
                </p>
                <p className="text-[var(--text-muted)] max-w-3xl leading-relaxed">
                  That is why {SITE_NAME} exists — clear exercise guidance, Nigerian nutrition ideas,
                  a reliable timer, and honest progress tracking, free-first for adults 18+ who want
                  to train at home or in the gym.
                </p>
              </div>

              <div
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg)]/50 p-4 sm:p-5 space-y-3"
                aria-label="Contact the founder"
              >
                <p className="text-xs uppercase tracking-wider font-semibold text-[var(--lime)]">
                  Contact
                </p>
                <a
                  href={`mailto:${FOUNDER.email}`}
                  className="flex items-center gap-3 text-sm text-[var(--text)] hover:text-[var(--lime)] transition break-all"
                >
                  <Mail size={16} className="text-[var(--lime)] shrink-0" aria-hidden />
                  <span>
                    <span className="text-[var(--text-dim)] block text-xs mb-0.5">Gmail</span>
                    {FOUNDER.email}
                  </span>
                </a>
                {FOUNDER.phones.map((phone) => (
                  <a
                    key={phone.number}
                    href={phone.href}
                    className="flex items-center gap-3 text-sm text-[var(--text)] hover:text-[var(--lime)] transition"
                  >
                    <Phone size={16} className="text-[var(--lime)] shrink-0" aria-hidden />
                    <span>
                      <span className="text-[var(--text-dim)] block text-xs mb-0.5">
                        {phone.label}
                      </span>
                      {phone.number}
                    </span>
                  </a>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/auth/signup" className="btn-primary">
                  Start free with RepForge
                </Link>
                <Link href="/beginners" className="btn-secondary">
                  Beginner path
                </Link>
                <a href={`mailto:${FOUNDER.email}`} className="btn-secondary">
                  Email founder
                </a>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
