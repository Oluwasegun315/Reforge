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
      <div className="h-40 rounded-xl bg-[var(--bg-elevated)] animate-pulse" aria-hidden />
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
  const firstName = name.split(" ")[0];
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
  const planName = plan?.name ?? "Full Body Starter";
  const exerciseCount = plan?.exercises.length ?? 6;
  const days =
    profile.preferredDays.length > 0 ? profile.preferredDays : DEMO_PROFILE.preferredDays;
  const focus = profile.focusAreas.slice(0, 4);

  return (
    <div className="space-y-7 md:space-y-10 max-w-5xl mx-auto">
      {/* Greeting — airy, one job */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-2xl overflow-hidden border border-[rgba(200,255,60,0.3)] bg-[var(--bg-elevated)] flex items-center justify-center text-xl font-bold text-[var(--lime)]">
            {profile.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              firstName.slice(0, 1).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-[var(--text-dim)] mb-0.5">
              {isTrainingDay ? "Training day" : "Recovery day"} · {todayName}
            </p>
            <h1 className="display-title text-3xl sm:text-4xl md:text-[2.75rem] leading-none truncate">
              Hey, {firstName}
            </h1>
          </div>
        </div>
        <Link href="/profile" className="btn-secondary !min-h-0 !py-2.5 !px-4 text-sm self-start sm:self-auto">
          Edit profile
        </Link>
      </header>

      {/* Primary action — today’s workout */}
      <section
        className="relative overflow-hidden rounded-[1.5rem] border border-[rgba(200,255,60,0.22)] bg-[var(--bg-card)]"
        aria-labelledby="today-workout"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(700px 280px at 0% 0%, rgba(200,255,60,0.16), transparent 55%), radial-gradient(500px 240px at 100% 100%, rgba(46,230,255,0.1), transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative p-5 sm:p-7 md:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--lime)] font-semibold">
              Up next
            </p>
            <h2 id="today-workout" className="text-2xl sm:text-3xl font-semibold tracking-tight">
              {planName}
            </h2>
            <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed">
              {duration} min · {exerciseCount} moves
              {isTrainingDay
                ? " — protect the streak today."
                : " — optional; keep it light if you need rest."}
            </p>
            <p className="text-sm text-[var(--text-dim)] italic leading-relaxed">
              “{daily.quote}”
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <Link href="/workouts/timer" className="btn-primary inline-flex gap-2 justify-center">
              <Play size={16} aria-hidden />
              Start session
            </Link>
            <Link href="/workouts" className="btn-secondary justify-center">
              Change plan
            </Link>
          </div>
        </div>
      </section>

      {/* Compact stats */}
      <section className="grid grid-cols-3 gap-2.5 sm:gap-4" aria-label="Your stats">
        <StatTile
          icon={<Flame size={16} aria-hidden />}
          label="Streak"
          value={String(streak)}
          hint="days"
          accent="var(--lime)"
        />
        <StatTile
          icon={<Trophy size={16} aria-hidden />}
          label="Level"
          value={String(level)}
          hint={`${xpIntoLevel}/3 XP`}
          accent="var(--cyan)"
          meter={xpPct}
        />
        <StatTile
          icon={<Target size={16} aria-hidden />}
          label="Done"
          value={String(sessions)}
          hint="sessions"
          accent="var(--violet)"
        />
      </section>

      {/* Mission + shortcuts */}
      <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4 md:gap-5">
        <Card className="!p-5 sm:!p-6 space-y-3.5">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--lime)]" aria-hidden />
            <h2 className="font-semibold text-sm uppercase tracking-wide text-[var(--text-dim)]">
              Today&apos;s mission
            </h2>
          </div>
          <p className="text-xl sm:text-2xl font-semibold tracking-tight leading-snug">
            {daily.mission.title}
          </p>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {daily.mission.body}
          </p>
          <Link href={daily.mission.href} className="btn-primary inline-flex gap-2 !min-h-0 !py-2.5 text-sm">
            Do it now
            <ArrowUpRight size={15} aria-hidden />
          </Link>
        </Card>

        <Card className="!p-5 sm:!p-6 space-y-3">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-[var(--text-dim)]">
            Quick links
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <QuickLink href="/workouts/timer" icon={<Timer size={15} />} label="Timer" />
            <QuickLink href="/nutrition" icon={<Utensils size={15} />} label="Nutrition" />
            <QuickLink href="/exercises" icon={<Play size={15} />} label="Exercises" />
            <QuickLink href="/progress" icon={<Trophy size={15} />} label="Progress" />
          </div>
          <p className="text-xs text-[var(--text-dim)] pt-1 border-t border-[var(--border)]">
            Tip: {daily.tip}
          </p>
        </Card>
      </section>

      {/* Week + history */}
      <section className="grid md:grid-cols-2 gap-4 md:gap-5">
        <Card className="!p-5 sm:!p-6">
          <h2 className="font-semibold mb-4">This week</h2>
          <WeeklyChart data={weekly} />
          <p className="text-xs text-[var(--text-dim)] mt-3">
            Updates when you finish the timer (≥1 min).
          </p>
        </Card>

        <Card className="!p-5 sm:!p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h2 className="font-semibold">Recent</h2>
            <Link href="/progress" className="text-sm text-[var(--cyan)] hover:underline shrink-0">
              All progress
            </Link>
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] leading-relaxed py-6">
              No sessions yet. Start the timer to log your first workout.
            </p>
          ) : (
            <ul className="space-y-0 divide-y divide-[var(--border)]">
              {history.slice(0, 4).map((w) => (
                <li key={w.id} className="flex justify-between gap-3 text-sm py-3 first:pt-0">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{w.name}</p>
                    <p className="text-[var(--text-dim)] text-xs mt-0.5">{w.date}</p>
                  </div>
                  <p className="text-[var(--lime)] font-semibold shrink-0">{w.durationMinutes}m</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      {/* Profile chips — not three heavy cards */}
      <section
        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 px-4 py-4 sm:px-5 sm:py-5"
        aria-label="Training preferences"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-2">Your days</p>
            <div className="flex flex-wrap gap-1.5">
              {days.map((d) => (
                <span
                  key={d}
                  className="inline-flex rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]"
                >
                  {d.slice(0, 3)}
                </span>
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-2">Focus</p>
            <div className="flex flex-wrap gap-1.5">
              {(focus.length ? focus : ["Full body"]).map((f) => (
                <span
                  key={f}
                  className="inline-flex rounded-lg bg-[var(--lime-dim)] text-[var(--lime)] px-2.5 py-1 text-xs font-semibold capitalize"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/nutrition"
            className="text-sm text-[var(--cyan)] hover:underline shrink-0 sm:self-center"
          >
            Fuel tips →
          </Link>
        </div>
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
    <div className="card-surface !rounded-2xl p-3.5 sm:p-5 relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-25 blur-xl"
        style={{ background: accent }}
        aria-hidden
      />
      <div className="flex items-center gap-1.5 mb-1.5" style={{ color: accent }}>
        {icon}
        <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <p className="display-title text-2xl sm:text-3xl md:text-4xl mb-0.5">{value}</p>
      {typeof meter === "number" && (
        <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden mb-1 max-w-[5rem]">
          <div className="h-full transition-all" style={{ width: `${meter}%`, background: accent }} />
        </div>
      )}
      <p className="text-[11px] sm:text-sm text-[var(--text-muted)]">{hint}</p>
    </div>
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
      className="group flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-3 text-sm font-medium hover:border-[rgba(200,255,60,0.35)] transition min-h-[2.85rem]"
    >
      <span className="inline-flex items-center gap-2 text-[var(--text)]">
        <span className="text-[var(--lime)]">{icon}</span>
        {label}
      </span>
      <ArrowUpRight
        size={14}
        className="text-[var(--text-dim)] group-hover:text-[var(--lime)] transition"
        aria-hidden
      />
    </Link>
  );
}
