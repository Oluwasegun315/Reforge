"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { DEMO_PROFILE } from "@/data/demo-user";
import { computeStreak, getDailyEngagement } from "@/data/daily-engagement";
import { localData } from "@/lib/storage";
import { buildWeeklyActivity } from "@/lib/progress";
import { Card } from "@/components/ui/Card";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { UserProfile, WorkoutPlan, WorkoutRecord } from "@/lib/types";
import { normalizeProfile } from "@/lib/profile";
import {
  ArrowUpRight,
  Flame,
  Play,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Utensils,
} from "lucide-react";

const WeeklyChart = dynamic(
  () => import("./WeeklyChart").then((m) => m.WeeklyChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 rounded-xl bg-[var(--bg-elevated)] animate-pulse" aria-hidden />
    ),
  }
);

export function DashboardView() {
  const [profile, setProfile] = useState<UserProfile>(DEMO_PROFILE);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [history, setHistory] = useState<WorkoutRecord[]>([]);
  const daily = useMemo(() => getDailyEngagement(), []);

  useEffect(() => {
    const refresh = () => {
      const saved = localData.getProfile();
      const active = localData.getActivePlan();
      const records = localData.getWorkoutRecords();
      if (saved) setProfile(normalizeProfile(saved));
      if (active) setPlan(active);
      setHistory(records);
    };
    refresh();
    window.addEventListener("repforge:progress", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("repforge:progress", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const name = profile.preferredName || "Athlete";
  const completed = useMemo(() => history.filter((h) => h.completed), [history]);
  const weekly = useMemo(() => buildWeeklyActivity(completed), [completed]);
  const streak = useMemo(
    () => computeStreak(completed.map((h) => h.date)),
    [completed]
  );
  const sessions = completed.length;
  const level = Math.max(1, Math.floor(sessions / 3) + 1);
  const xpIntoLevel = sessions % 3;
  const xpPct = Math.round((xpIntoLevel / 3) * 100);

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const isTrainingDay = profile.preferredDays.includes(todayName);
  const duration = plan?.durationMinutes ?? profile.sessionMinutes;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-card)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(900px 420px at 12% -10%, rgba(200,255,60,0.18), transparent 55%), radial-gradient(700px 380px at 95% 10%, rgba(46,230,255,0.14), transparent 50%), linear-gradient(135deg, transparent 40%, rgba(155,123,255,0.08))",
          }}
          aria-hidden
        />
        <div className="relative grid lg:grid-cols-[1.35fr_0.85fr] gap-6 p-6 md:p-8">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden border border-[rgba(200,255,60,0.35)] bg-[var(--bg-elevated)] flex items-center justify-center text-2xl font-bold text-[var(--lime)] shadow-[0_0_40px_rgba(200,255,60,0.15)]">
                {profile.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.photoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  name.slice(0, 1).toUpperCase()
                )}
              </div>
              <div>
                <p className="section-eyebrow mb-1">Your forge</p>
                <h1 className="display-title text-4xl md:text-5xl leading-none">
                  {name.split(" ")[0]}.
                </h1>
              </div>
            </div>
            <p className="text-[var(--text-muted)] max-w-xl text-base md:text-lg leading-relaxed">
              {[profile.city, profile.country].filter(Boolean).join(" · ") || "Ready when you are"}
              {isTrainingDay
                ? " · Training day — protect the streak."
                : " · Recovery window — move light or plan tomorrow."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/workouts/timer" className="btn-primary inline-flex gap-2">
                <Play size={16} aria-hidden />
                Start session
              </Link>
              <Link href="/profile" className="btn-secondary">
                Edit profile
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)]/70 backdrop-blur-sm p-5 flex flex-col justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--lime)] font-semibold mb-2">
                Daily forge line
              </p>
              <p className="text-lg md:text-xl text-[var(--text)] leading-relaxed font-medium">
                {daily.quote}
              </p>
            </div>
            <div className="flex items-end justify-between gap-3 border-t border-[var(--border)] pt-4">
              <div>
                <p className="text-xs text-[var(--text-dim)] uppercase tracking-wide mb-1">
                  Next block
                </p>
                <p className="font-semibold text-[var(--text)]">
                  {plan?.name ?? "Full Body Starter"}
                </p>
              </div>
              <p className="display-title text-3xl text-[var(--lime)] leading-none">
                {duration}
                <span className="text-base text-[var(--text-muted)]">m</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <StatTile
          icon={<Flame size={18} aria-hidden />}
          label="Streak"
          value={String(streak)}
          hint={`day${streak === 1 ? "" : "s"} active`}
          accent="var(--lime)"
        />
        <StatTile
          icon={<Trophy size={18} aria-hidden />}
          label="Forge level"
          value={String(level)}
          hint={`${xpIntoLevel}/3 to next`}
          accent="var(--cyan)"
          meter={xpPct}
        />
        <StatTile
          icon={<Target size={18} aria-hidden />}
          label="Completed"
          value={String(sessions)}
          hint="logged workouts"
          accent="var(--violet)"
        />
      </section>

      <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-5">
        <Card className="!p-0 overflow-hidden border-[rgba(200,255,60,0.22)]">
          <div className="p-5 md:p-6 space-y-4 bg-[linear-gradient(160deg,rgba(200,255,60,0.12),transparent_55%)]">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[var(--lime)]" aria-hidden />
              <h2 className="font-semibold">Today&apos;s mission</h2>
            </div>
            <p className="text-2xl md:text-3xl font-semibold tracking-tight">
              {daily.mission.title}
            </p>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xl">
              {daily.mission.body}
            </p>
            <Link href={daily.mission.href} className="btn-primary inline-flex gap-2">
              Do it now
              <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
        </Card>

        <Card className="!p-5 md:!p-6 space-y-4">
          <h2 className="font-semibold">Move fast</h2>
          <div className="grid gap-2">
            <QuickLink href="/workouts/timer" icon={<Timer size={16} />} label="Open timer" />
            <QuickLink href="/nutrition" icon={<Utensils size={16} />} label="Nigeria nutrition" />
            <QuickLink href="/exercises" icon={<Play size={16} />} label="Browse exercises" />
            <QuickLink href="/progress" icon={<Trophy size={16} />} label="Check progress" />
          </div>
          <p className="text-xs text-[var(--text-dim)] border-t border-[var(--border)] pt-3">
            Tip: {daily.tip}
          </p>
        </Card>
      </section>

      <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5">
        <Card className="relative overflow-hidden !p-6 md:!p-7">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[rgba(46,230,255,0.12)] blur-2xl"
            aria-hidden
          />
          <p className="text-sm text-[var(--text-dim)] uppercase tracking-wide mb-2">
            Today&apos;s workout
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-2 tracking-tight">
            {plan?.name ?? "Full Body Starter"}
          </h2>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            {plan
              ? `${plan.durationMinutes} min · ${plan.exercises.length} exercises`
              : "45 min · sample plan — build your own anytime"}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/workouts/timer" className="btn-primary">
              Start workout
            </Link>
            <Link href="/workouts" className="btn-secondary">
              Change plan
            </Link>
          </div>
        </Card>

        <Card className="!p-6 flex flex-col justify-between">
          <div>
            <p className="text-sm text-[var(--text-dim)] uppercase tracking-wide mb-2">
              Session length
            </p>
            <p className="display-title text-5xl text-[var(--lime)] mb-2">
              {duration}
              <span className="text-2xl text-[var(--text-muted)]"> min</span>
            </p>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Suggested length. Adjust freely in the timer when you start.
          </p>
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-5">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">This week (real sessions)</h2>
          </div>
          <WeeklyChart data={weekly} />
          <p className="text-xs text-[var(--text-dim)] mt-2">
            Bars update when you finish or stop the timer (≥1 min).
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent history</h2>
            <Link href="/progress" className="text-sm text-[var(--cyan)] hover:underline">
              View progress
            </Link>
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">
              No sessions yet. Run the timer or log a workout on Progress.
            </p>
          ) : (
            <ul className="space-y-3">
              {history.slice(0, 4).map((w) => (
                <li
                  key={w.id}
                  className="flex justify-between gap-3 text-sm border-b border-[var(--border)] pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{w.name}</p>
                    <p className="text-[var(--text-dim)]">{w.date}</p>
                  </div>
                  <p className="text-[var(--lime)] font-semibold">{w.durationMinutes}m</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold mb-2">Your days</h3>
          <p className="text-sm text-[var(--text-muted)]">
            {(profile.preferredDays.length
              ? profile.preferredDays
              : DEMO_PROFILE.preferredDays
            ).join(" · ")}
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2">Focus</h3>
          <p className="text-sm text-[var(--text-muted)]">
            {profile.focusAreas.slice(0, 4).join(" · ") || "Full body"}
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2">Stay loop</h3>
          <p className="text-sm text-[var(--text-muted)] mb-2">
            Mission → train → eat → log. That loop keeps people coming back.
          </p>
          <Link href="/nutrition" className="text-sm text-[var(--cyan)] hover:underline">
            Open nutrition →
          </Link>
        </Card>
      </section>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  hint,
  accent,
  meter,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
  accent: string;
  meter?: number;
}) {
  return (
    <Card className="!p-5 relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-2xl"
        style={{ background: accent }}
        aria-hidden
      />
      <div className="flex items-center gap-2 mb-2" style={{ color: accent }}>
        {icon}
        <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <p className="display-title text-4xl mb-1">{value}</p>
      {typeof meter === "number" && (
        <div className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden mb-1">
          <div className="h-full transition-all" style={{ width: `${meter}%`, background: accent }} />
        </div>
      )}
      <p className="text-sm text-[var(--text-muted)]">{hint}</p>
    </Card>
  );
}

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-3 text-sm font-medium hover:border-[rgba(200,255,60,0.35)] transition"
    >
      <span className="inline-flex items-center gap-2 text-[var(--text)]">
        <span className="text-[var(--lime)]">{icon}</span>
        {label}
      </span>
      <ArrowUpRight
        size={15}
        className="text-[var(--text-dim)] group-hover:text-[var(--lime)] transition"
        aria-hidden
      />
    </Link>
  );
}
