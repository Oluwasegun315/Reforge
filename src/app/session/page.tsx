import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { FounderPhoto } from "@/components/home/FounderPhoto";
import { SessionBookingForm } from "@/components/session/SessionBookingForm";
import {
  FOUNDER,
  FOUNDER_SESSION,
  SESSION_FOCUS,
  SESSION_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: `Talk with Founder — $${FOUNDER_SESSION.priceUsd} · ${FOUNDER.formalName}`,
  description: `${FOUNDER_SESSION.tagline} Available ${FOUNDER_SESSION.availableDays.join(", ")}. ${FOUNDER.driveShort}`,
  alternates: { canonical: "/session" },
  openGraph: {
    title: `Talk with ${FOUNDER.name} — $${FOUNDER_SESSION.priceUsd} founder session`,
    description: `Mon · Tue · Fri · 20 minutes. ${FOUNDER_SESSION.tagline}`,
    url: SESSION_URL,
  },
};

const helpPoints = [
  {
    icon: Compass,
    title: "Where you are now",
    body: "Beginner, returning, or stuck — we map your level, equipment, and real schedule.",
  },
  {
    icon: Sparkles,
    title: "What to do next",
    body: "A focused plan: training days, form cues, nutrition direction, or consistency.",
  },
  {
    icon: HeartHandshake,
    title: "How the founder helps",
    body: "Honest guidance for Nigerian life — built by someone who understands the struggle.",
  },
  {
    icon: CalendarClock,
    title: "After the call",
    body: "Clear next steps inside RepForge: exercises, timer, and tracking you can keep.",
  },
];

export default function SessionPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(900px 420px at 10% -10%, rgba(200,255,60,0.14), transparent 55%), radial-gradient(700px 380px at 100% 0%, rgba(46,230,255,0.1), transparent 50%)",
        }}
        aria-hidden
      />

      <div className="relative container-page py-10 md:py-16 space-y-10 md:space-y-14 max-w-5xl mx-auto">
        <header className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-end">
          <div className="space-y-5">
            <p className="section-eyebrow">Talk with Founder · Premium session</p>
            <h1 className="display-title text-4xl sm:text-5xl md:text-[3.35rem] leading-[0.95]">
              Not a free chat.
              <br />
              <span className="text-[var(--lime)]">A $50 clarity session.</span>
            </h1>
            <p className="text-[var(--text-muted)] text-base md:text-lg leading-relaxed max-w-xl">
              Sit with{" "}
              <strong className="text-[var(--text)]">{FOUNDER.formalName}</strong> for{" "}
              {FOUNDER_SESSION.durationMinutes} focused minutes. You leave knowing what to train,
              how to eat smarter in Nigeria, and how RepForge keeps you consistent.
            </p>
            <div className="flex flex-wrap gap-2">
              {FOUNDER_SESSION.availableDays.map((d) => (
                <span
                  key={d}
                  className="rounded-full border border-[rgba(200,255,60,0.35)] bg-[var(--lime-dim)] text-[var(--lime)] px-3 py-1 text-xs font-bold uppercase tracking-wider"
                >
                  {d}
                </span>
              ))}
              <span className="rounded-full border border-[var(--border-strong)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {FOUNDER_SESSION.durationMinutes} min
              </span>
              <span className="rounded-full bg-[var(--lime)] text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                ${FOUNDER_SESSION.priceUsd}
              </span>
            </div>
          </div>

          <Card className="!p-0 overflow-hidden border-[rgba(200,255,60,0.3)]">
            <div className="p-5 sm:p-6 bg-[linear-gradient(160deg,rgba(200,255,60,0.16),transparent_55%)] space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border border-[rgba(200,255,60,0.35)]">
                  <FounderPhoto />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-[var(--lime)] font-semibold mb-1">
                    Your guide
                  </p>
                  <p className="font-semibold text-lg leading-tight mb-1">{FOUNDER.formalName}</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    Founder · {FOUNDER.city}, {FOUNDER.country}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)]/70 p-4">
                <p className="text-xs text-[var(--text-dim)] uppercase tracking-wider mb-1">
                  Session investment
                </p>
                <p className="display-title text-4xl text-[var(--lime)] leading-none mb-2">
                  ${FOUNDER_SESSION.priceUsd}
                </p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Scrolling costs ${FOUNDER_SESSION.entryBudgetUsd} of attention and changes nothing.
                  This session buys a real plan from the founder who built {SITE_NAME}.
                </p>
              </div>
              <Link href="#book" className="btn-primary w-full justify-center">
                Book Talk with Founder
              </Link>
            </div>
          </Card>
        </header>

        <section aria-labelledby="why-pay">
          <div className="max-w-2xl mb-6">
            <p className="section-eyebrow mb-2">Why people pay</p>
            <h2 id="why-pay" className="display-title text-3xl md:text-4xl mb-3">
              Reasons behind the ${FOUNDER_SESSION.priceUsd}
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Free tools stay free on RepForge. This call is for users who want private founder
              guidance — and are ready to treat their body like an investment.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
            {FOUNDER_SESSION.valueReasons.map((item) => (
              <Card key={item.title} className="!p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-[var(--lime)] shrink-0 mt-0.5" size={18} />
                  <div>
                    <h3 className="font-semibold mb-1.5">{item.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid sm:grid-cols-2 gap-3 md:gap-4" aria-label="How the session helps">
          {helpPoints.map((item) => (
            <Card key={item.title} className="!p-5">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--lime-dim)] text-[var(--lime)] mb-3">
                <item.icon size={18} aria-hidden />
              </div>
              <h2 className="font-semibold mb-1.5">{item.title}</h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.body}</p>
            </Card>
          ))}
        </section>

        <section className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6 md:gap-8 items-start">
          <div className="space-y-5">
            <Card className="!p-5 sm:!p-6 space-y-4">
              <div className="flex items-center gap-2 text-[var(--lime)]">
                <ShieldCheck size={18} aria-hidden />
                <h2 className="font-semibold text-[var(--text)]">What you get in 20 minutes</h2>
              </div>
              <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                {SESSION_FOCUS.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--lime)] shrink-0" />
                    <span>
                      <span className="text-[var(--text)] font-medium">{item.title}: </span>
                      {item.body}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="!p-5 sm:!p-6 space-y-3 border-[rgba(200,255,60,0.22)]">
              <h2 className="font-semibold">Drop this on social media</h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                One link for Facebook, Instagram, TikTok, WhatsApp Status.
              </p>
              <code className="block text-sm break-all rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] px-3 py-2.5 text-[var(--lime)]">
                {SESSION_URL}
              </code>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Caption idea: “Talk with founder {FOUNDER.formalName} — ${FOUNDER_SESSION.priceUsd}{" "}
                · 20 min · Mon/Tue/Fri. Get a real fitness plan for Nigerian life.”
              </p>
            </Card>
          </div>

          <Card id="book" className="!p-5 sm:!p-7 scroll-mt-24">
            <p className="section-eyebrow mb-3">Secure your slot</p>
            <h2 className="display-title text-3xl mb-2">Request Talk with Founder</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
              Fill the form — WhatsApp opens to {FOUNDER.name} with your details. You confirm the{" "}
              <strong className="text-[var(--text)]">${FOUNDER_SESSION.priceUsd}</strong> payment
              with him, then he locks your Monday, Tuesday, or Friday time.
            </p>
            <SessionBookingForm />
          </Card>
        </section>

        <p className="text-center text-sm text-[var(--text-dim)] pb-4">
          App stays free-first.{" "}
          <Link href="/auth/signup" className="text-[var(--cyan)] hover:underline">
            Create a free account
          </Link>{" "}
          ·{" "}
          <Link href="/#founder" className="text-[var(--cyan)] hover:underline">
            About the founder
          </Link>{" "}
          ·{" "}
          <a href={SITE_URL} className="text-[var(--cyan)] hover:underline">
            Home
          </a>
        </p>
      </div>
    </div>
  );
}
