import Link from "next/link";
import { FOUNDER } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-20">
      <div className="container-page py-10 grid gap-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
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
          <p className="font-semibold mb-3">Contact</p>
          <ul className="space-y-2 text-sm text-[var(--text-muted)]">
            <li>
              <Link href="/#founder" className="hover:text-[var(--lime)]">
                About founder
              </Link>
            </li>
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
      <div className="container-page pb-8 text-xs text-[var(--text-dim)]">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> RepForge · Founded by
        IDOWU ELIJAH OLUWASEGUN. Train smart. Progress at your pace.
      </div>
    </footer>
  );
}
