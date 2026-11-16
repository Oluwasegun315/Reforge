import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, Compass, HeartHandshake, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { FounderPhoto } from "@/components/home/FounderPhoto";
import { SessionBookingForm } from "@/components/session/SessionBookingForm";
import {
  FOUNDER,
  SESSION_FOCUS,
  SESSION_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: `20-Min Founder Session — ${FOUNDER.formalName}`,
  description: `Book a 20-minute guidance session with ${FOUNDER.formalName}, founder of ${SITE_NAME} Nigeria. Get a clear plan for training, nutrition, and consistency. ${FOUNDER.driveShort}`,
  alternates: { canonical: "/session" },
  openGraph: {
    title: `Book ${FOUNDER.name} — 20-min RepForge founder session`,
    description: `Personal guidance from ${FOUNDER.formalName}. Share this link: ${SESSION_URL}`,
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
    body: "A simple 20-minute focus: plan, form cues, nutrition direction, or consistency.",
  },
  {
    icon: HeartHandshake,
    title: "How I can help",
    body: "Honest guidance for Nigerian life — no expensive gym required just to start.",
  },
  {
    icon: CalendarClock,
    title: "After the call",
    body: "You leave with clear next steps inside RepForge: exercises, timer, and tracking.",
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
        <header className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-end">
          <div className="space-y-5">
            <p className="section-eyebrow">Founder session · 20 minutes</p>
            <h1 className="display-title text-4xl sm:text-5xl md:text-[3.4rem] leading-[0.95]">
              Train with clarity.
              <br />
              <span className="text-[var(--lime)]">Talk with the founder.</span>
            </h1>
            <p className="text-[var(--text-muted)] text-base md:text-lg leading-relaxed max-w-xl">
              Book a focused 20-minute session with{" "}
              <strong className="text-[var(--text)]">{FOUNDER.formalName}</strong>. He will guide
              you based on your goal — and show how RepForge helps you stay fit daily.
            </p>
            <p className="text-sm text-[var(--text-dim)] leading-relaxed max-w-xl border-l-2 border-[var(--lime)] pl-4">
              {FOUNDER.driveShort}
            </p>
          </div>

          <Card className="!p-5 sm:!p-6 flex items-center gap-4 bg-[linear-gradient(160deg,rgba(200,255,60,0.12),transparent_55%)]">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl overflow-hidden border border-[rgba(200,255,60,0.35)]">
              <FounderPhoto />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-[var(--lime)] font-semibold mb-1">
                Your guide
              </p>
              <p className="font-semibold text-lg leading-tight mb-1">{FOUNDER.formalName}</p>
              <p className="text-sm text-[var(--text-muted)]">
                Founder of {SITE_NAME} · {FOUNDER.city}, {FOUNDER.country}
              </p>
            </div>
          </Card>
        </header>

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
              <h2 className="display-title text-2xl md:text-3xl">What you get in 20 minutes</h2>
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
                One link for Facebook, Instagram, TikTok, WhatsApp Status — users land here to book.
              </p>
              <code className="block text-sm break-all rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] px-3 py-2.5 text-[var(--lime)]">
                {SESSION_URL}
              </code>
              <p className="text-xs text-[var(--text-dim)]">
                Caption idea: “Book a 20-min session with founder {FOUNDER.formalName} — free
                fitness guidance for Nigeria.”
              </p>
            </Card>
          </div>

          <Card className="!p-5 sm:!p-7">
            <p className="section-eyebrow mb-3">Schedule now</p>
            <h2 className="display-title text-3xl mb-2">Request your session</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
              Fill this form — it opens WhatsApp to {FOUNDER.name} with your details ready. He will
              confirm a 20-minute slot and guide you from there.
            </p>
            <SessionBookingForm />
          </Card>
        </section>

        <p className="text-center text-sm text-[var(--text-dim)] pb-4">
          Prefer the app first?{" "}
          <Link href="/auth/signup" className="text-[var(--cyan)] hover:underline">
            Create a free RepForge account
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
