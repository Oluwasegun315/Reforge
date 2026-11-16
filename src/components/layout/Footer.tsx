import Link from "next/link";
import { FOUNDER, FOUNDER_SESSION } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-20">
      <div className="container-page py-10">
        <div className="mb-10 rounded-[1.5rem] border border-[rgba(200,255,60,0.28)] bg-[linear-gradient(135deg,rgba(200,255,60,0.12),rgba(46,230,255,0.05))] p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="section-eyebrow">Talk with Founder</p>
              <h2 className="display-title text-3xl md:text-4xl leading-none">
                20 minutes with {FOUNDER.formalName}
              </h2>
              <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
                {FOUNDER_SESSION.favourLine} Available{" "}
                <strong className="text-[var(--text)]">
                  {FOUNDER_SESSION.availableDays.join(", ")}
                </strong>{" "}
                on Zoom or Google Meet.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link href="/session" className="btn-primary justify-center">
                {`Talk with Founder · $${FOUNDER_SESSION.collectUsd}`}
              </Link>
              <Link href="/#founder" className="btn-secondary justify-center">
                About founder
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="display-title text-2xl mb-3">RepForge</p>
            <p className="text-[var(--text-muted)] max-w-sm text-sm leading-relaxed">
              Free-first fitness for adults 18+. Discover exercises, build workouts, and track
              progress at your own pace. Guidance only — not medical advice.
            </p>
            <p className="text-sm text-[var(--text-dim)] mt-3">
              Founded by{" "}
              <Link href="/#founder" className="text-[var(--lime)] hover:underline font-medium">
                Idowu Elijah Oluwasegun
              </Link>{" "}
              · Lagos, Nigeria
            </p>
          </div>
          <div>
            <p className="font-semibold mb-3">Explore</p>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>
                <Link href="/exercises" className="hover:text-[var(--lime)]">
                  Exercise library
                </Link>
              </li>
              <li>
                <Link href="/workouts" className="hover:text-[var(--lime)]">
                  Workout builder
                </Link>
              </li>
              <li>
                <Link href="/beginners" className="hover:text-[var(--lime)]">
                  Beginner guide
                </Link>
              </li>
              <li>
                <Link href="/nutrition" className="hover:text-[var(--lime)]">
                  Nutrition (Nigeria)
                </Link>
              </li>
              <li>
                <Link href="/workouts/timer" className="hover:text-[var(--lime)]">
                  Workout timer
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3">Account</p>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>
                <Link href="/dashboard" className="hover:text-[var(--lime)]">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[var(--lime)]">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-[var(--lime)]">
                  Progress
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-[var(--lime)]">
                  Settings
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="hover:text-[var(--lime)]">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-[var(--lime)]">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3">Talk with Founder</p>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>
                <Link href="/session" className="text-[var(--lime)] font-medium hover:underline">
                  {`Book $${FOUNDER_SESSION.collectUsd} · was $${FOUNDER_SESSION.priceUsd}`}
                </Link>
              </li>
              <li>Mon · Tue · Fri</li>
              <li>Zoom or Google Meet</li>
              <li>
                <a href={`mailto:${FOUNDER.email}`} className="hover:text-[var(--lime)] break-all">
                  {FOUNDER.email}
                </a>
              </li>
              {FOUNDER.phones.map((phone) => (
                <li key={phone.number}>
                  <a href={phone.href} className="hover:text-[var(--lime)]">
                    {phone.label}: {phone.number}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="container-page pb-8 text-xs text-[var(--text-dim)]">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> RepForge · Founded by
        IDOWU ELIJAH OLUWASEGUN. Train smart. Progress at your pace.
      </div>
    </footer>
  );
}
