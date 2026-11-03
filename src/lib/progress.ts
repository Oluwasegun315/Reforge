import type { ProgressEntry, WorkoutRecord } from "@/lib/types";
import { localData } from "@/lib/storage";
import { notificationsStore } from "@/lib/notifications";

export type DayActivity = { day: string; workouts: number; minutes: number };

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function startOfWeek(d = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay(); // 0 Sun
  x.setDate(x.getDate() - day);
  return x;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Mon–Sun style week activity from real completed records (current calendar week Sun–Sat). */
export function buildWeeklyActivity(
  records: WorkoutRecord[],
  now = new Date()
): DayActivity[] {
  const weekStart = startOfWeek(now);
  const buckets = DAY_LABELS.map((day, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return { day, key: isoDate(date), workouts: 0, minutes: 0 };
  });

  const byKey = new Map(buckets.map((b) => [b.key, b]));

  for (const r of records) {
    if (!r.completed) continue;
    const key = r.date.slice(0, 10);
    const bucket = byKey.get(key);
    if (!bucket) continue;
    bucket.workouts += 1;
    bucket.minutes += Math.max(0, r.durationMinutes || 0);
  }

  return buckets.map(({ day, workouts, minutes }) => ({ day, workouts, minutes }));
}

/** Last N calendar days of session counts for a simple day-by-day chart. */
export function buildDailySessionSeries(
  records: WorkoutRecord[],
  days = 14,
  now = new Date()
): { date: string; label: string; workouts: number; minutes: number }[] {
  const out: { date: string; label: string; workouts: number; minutes: number }[] = [];
  const completed = records.filter((r) => r.completed);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = isoDate(d);
    const dayRecords = completed.filter((r) => r.date.slice(0, 10) === key);
    out.push({
      date: key,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      workouts: dayRecords.length,
      minutes: dayRecords.reduce((sum, r) => sum + (r.durationMinutes || 0), 0),
    });
  }
  return out;
}

export function summarizeProgress(records: WorkoutRecord[]) {
  const completed = records.filter((r) => r.completed);
  const totalMinutes = completed.reduce((s, r) => s + (r.durationMinutes || 0), 0);
  const uniqueDays = new Set(completed.map((r) => r.date.slice(0, 10))).size;
  const thisWeek = buildWeeklyActivity(completed);
  const weekSessions = thisWeek.reduce((s, d) => s + d.workouts, 0);
  const weekMinutes = thisWeek.reduce((s, d) => s + d.minutes, 0);
  return {
    totalSessions: completed.length,
    totalMinutes,
    uniqueDays,
    weekSessions,
    weekMinutes,
  };
}

/** Log a completed training session from the timer (or manual tools). */
export function logCompletedSession(input: {
  name?: string;
  durationMinutes: number;
  workoutPlanId?: string;
  exercisesCompleted?: number;
  notes?: string;
  date?: string;
}): WorkoutRecord {
  const plan = localData.getActivePlan();
  const durationMinutes = Math.max(1, Math.round(input.durationMinutes));
  const record: WorkoutRecord = {
    id: `wr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    workoutPlanId: input.workoutPlanId ?? plan?.id,
    name: input.name?.trim() || plan?.name || "Timed session",
    date: input.date ?? new Date().toISOString().slice(0, 10),
    durationMinutes,
    exercisesCompleted:
      input.exercisesCompleted ?? plan?.exercises.length ?? 0,
    notes: input.notes,
    completed: true,
  };

  localData.addWorkoutRecord(record);

  notificationsStore.add({
    kind: "workout",
    title: "Session logged",
    body: `${record.name} · ${record.durationMinutes} min saved to Progress.`,
    detail: `Your day-by-day progress updated for ${record.date}. Open Progress to see this week’s activity and history.`,
    href: "/progress",
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("repforge:progress"));
  }

  return record;
}

export function progressEntriesToChart(entries: ProgressEntry[]) {
  return [...entries]
    .filter((e) => typeof e.bodyWeightKg === "number")
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({
      date: e.date.slice(5),
      bodyWeightKg: e.bodyWeightKg as number,
    }));
}
