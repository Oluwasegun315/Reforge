import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  Compass,
  HeartHandshake,
  Sparkles,
  Video,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { FounderPhoto } from "@/components/home/FounderPhoto";
import { SessionBookingForm } from "@/components/session/SessionBookingForm";
import { SessionDemo } from "@/components/session/SessionDemo";
import {
  FOUNDER,
  FOUNDER_SESSION,
  SESSION_FOCUS,
  SESSION_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: `Talk with Founder — $${FOUNDER_SESSION.collectUsd} (was $${FOUNDER_SESSION.priceUsd}) · ${FOUNDER.formalName}`,
  description: `${FOUNDER_SESSION.favourLine} Available ${FOUNDER_SESSION.availableDays.join(", ")} on Zoom or Google Meet. ${FOUNDER.driveShort}`,
  alternates: { canonical: "/session" },
  openGraph: {
    title: `Talk with ${FOUNDER.name} — $${FOUNDER_SESSION.collectUsd} founder favour`,
    description: `Was $${FOUNDER_SESSION.priceUsd}. Mon · Tue · Fri · Zoom / Google Meet. ${FOUNDER_SESSION.tagline}`,
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
    body: "Honest guidance from the Founder & CEO — built by someone who understands the struggle.",
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
            <p className="section-eyebrow">Talk with Founder · Limited favour</p>
            <h1 className="display-title text-4xl sm:text-5xl md:text-[3.35rem] leading-[0.95]">
              A ${FOUNDER_SESSION.priceUsd} founder session.
              <br />
              <span className="text-[var(--lime)]">
                You pay ${FOUNDER_SESSION.collectUsd} today.
              </span>
            </h1>
            <p className="text-[var(--text-muted)] text-base md:text-lg leading-relaxed max-w-xl">
              {FOUNDER_SESSION.favourLine} Sit with{" "}
              <strong className="text-[var(--text)]">{FOUNDER.formalName}</strong> for{" "}
              {FOUNDER_SESSION.durationMinutes} focused minutes on Zoom or Google Meet.
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
              {FOUNDER_SESSION.meetingPlatforms.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-[var(--border-strong)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] inline-flex items-center gap-1"
                >
                  <Video size={12} aria-hidden />
                  {p}
                </span>
              ))}
            </div>
            <Link href="#book" className="btn-primary inline-flex">
              Claim my ${FOUNDER_SESSION.collectUsd} founder slot
            </Link>
          </div>

          <Card className="!p-0 overflow-hidden border-[rgba(200,255,60,0.3)]">
            <div className="p-5 sm:p-6 bg-[linear-gradient(160deg,rgba(200,255,60,0.16),transparent_55%)] space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border border-[rgba(200,255,60,0.35)]">
                  <FounderPhoto />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-[var(--lime)] font-semibold mb-1">
                    Founder &amp; CEO
                  </p>
                  <p className="font-semibold text-lg leading-tight mb-1">{FOUNDER.formalName}</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {SITE_NAME} · {FOUNDER.city}, {FOUNDER.country}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)]/70 p-4">
                <p className="text-xs text-[var(--text-dim)] uppercase tracking-wider mb-1">
                  Founder favour price
                </p>
                <p className="flex items-baseline gap-3 mb-2">
                  <span className="display-title text-4xl text-[var(--lime)] leading-none">
                    ${FOUNDER_SESSION.collectUsd}
                  </span>
                  <span className="text-lg text-[var(--text-dim)] line-through">
                    ${FOUNDER_SESSION.priceUsd}
                  </span>
                </p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  He is opening his calendar as a favour — so you can talk to the CEO without
                  paying the full ${FOUNDER_SESSION.priceUsd} rate. Serious users only.
                </p>
              </div>
              <Link href="#book" className="btn-primary w-full justify-center">
                Book Talk with Founder · ${FOUNDER_SESSION.collectUsd}
              </Link>
            </div>
          </Card>
        </header>

        <SessionDemo />

        <section aria-labelledby="why-pay">
          <div className="max-w-2xl mb-6">
            <p className="section-eyebrow mb-2">Why people pay</p>
            <h2 id="why-pay" className="display-title text-3xl md:text-4xl mb-3">
              Why ${FOUNDER_SESSION.collectUsd} is a smart move
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Free tools stay free on RepForge. This call is private access to the Founder &amp;
              CEO — discounted from ${FOUNDER_SESSION.priceUsd} so ready users can get clarity now.
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
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
            <Link href="#book" className="btn-primary justify-center">
              Yes — book my ${FOUNDER_SESSION.collectUsd} call
            </Link>
            <p className="text-sm text-[var(--text-dim)]">
              Slots: Monday, Tuesday, Friday · Zoom or Google Meet
            </p>
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
          <Card className="!p-5 sm:!p-6 space-y-4">
            <h2 className="font-semibold">What you get in {FOUNDER_SESSION.durationMinutes} minutes</h2>
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
            <p className="text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] pt-4">
              Live on <strong className="text-[var(--text)]">Zoom</strong> or{" "}
              <strong className="text-[var(--text)]">Google Meet</strong>. Confirm payment of{" "}
              <strong className="text-[var(--lime)]">${FOUNDER_SESSION.collectUsd}</strong> with the
              founder after you message him.
            </p>
          </Card>

          <Card id="book" className="!p-5 sm:!p-7 scroll-mt-24">
            <p className="section-eyebrow mb-3">Secure your slot</p>
            <h2 className="display-title text-3xl mb-2">Request Talk with Founder</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
              Fill the form — WhatsApp opens to {FOUNDER.name}. Confirm the{" "}
              <strong className="text-[var(--lime)]">${FOUNDER_SESSION.collectUsd}</strong> founder
              favour (was ${FOUNDER_SESSION.priceUsd}), pick Zoom or Google Meet, then he locks your
              Monday, Tuesday, or Friday time.
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
