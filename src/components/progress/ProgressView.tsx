"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { localData } from "@/lib/storage";
import type { PersonalRecord, ProgressEntry, WorkoutRecord } from "@/lib/types";
import {
  buildDailySessionSeries,
  buildWeeklyActivity,
  progressEntriesToChart,
  summarizeProgress,
} from "@/lib/progress";
import { computeStreak } from "@/data/daily-engagement";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";

export function ProgressView() {
  const [records, setRecords] = useState<WorkoutRecord[]>([]);
  const [weights, setWeights] = useState<ProgressEntry[]>([]);
  const [prs, setPrs] = useState<PersonalRecord[]>([]);

  const [name, setName] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [notes, setNotes] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [prName, setPrName] = useState("");
  const [prValue, setPrValue] = useState("");

  const refresh = () => {
    setRecords(localData.getWorkoutRecords());
    setWeights(localData.getProgressEntries());
    setPrs(localData.getPersonalRecords());
  };

  useEffect(() => {
    refresh();
    const onProgress = () => refresh();
    window.addEventListener("repforge:progress", onProgress);
    window.addEventListener("storage", onProgress);
    window.addEventListener("focus", onProgress);
    return () => {
      window.removeEventListener("repforge:progress", onProgress);
      window.removeEventListener("storage", onProgress);
      window.removeEventListener("focus", onProgress);
    };
  }, []);

  const completed = useMemo(() => records.filter((r) => r.completed), [records]);
  const weekly = useMemo(() => buildWeeklyActivity(completed), [completed]);
  const daily = useMemo(() => buildDailySessionSeries(completed, 14), [completed]);
  const stats = useMemo(() => summarizeProgress(completed), [completed]);
  const streak = useMemo(
    () => computeStreak(completed.map((r) => r.date)),
    [completed]
  );
  const weightChart = useMemo(() => progressEntriesToChart(weights), [weights]);

  const createRecord = () => {
    if (!name.trim()) return;
    const record: WorkoutRecord = {
      id: `wr-${Date.now()}`,
      name: name.trim(),
      date: new Date().toISOString().slice(0, 10),
      durationMinutes: minutes,
      exercisesCompleted: 0,
      notes: notes.trim() || undefined,
      completed: true,
    };
    localData.addWorkoutRecord(record);
    window.dispatchEvent(new Event("repforge:progress"));
    setName("");
    setNotes("");
    refresh();
  };

  const logWeight = () => {
    const kg = Number(weightKg);
    if (!Number.isFinite(kg) || kg <= 0) return;
    localData.upsertProgressEntry({
      date: new Date().toISOString().slice(0, 10),
      bodyWeightKg: kg,
    });
    const profile = localData.getProfile();
    if (profile) {
      localData.saveProfile({ ...profile, weightKg: kg });
    }
    setWeightKg("");
    refresh();
  };

  const addPr = () => {
    if (!prName.trim() || !prValue.trim()) return;
    localData.addPersonalRecord({
      exerciseId: `pr-${Date.now()}`,
      exerciseName: prName.trim(),
      value: prValue.trim(),
      date: new Date().toISOString().slice(0, 10),
    });
    setPrName("");
    setPrValue("");
    refresh();
  };

  const remove = (id: string) => {
    localData.deleteWorkoutRecord(id);
    window.dispatchEvent(new Event("repforge:progress"));
    refresh();
  };

  const updateNotes = (id: string) => {
    const next = window.prompt("Update notes for this workout:");
    if (next === null) return;
    localData.updateWorkoutRecord(id, { notes: next.trim() || undefined });
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-eyebrow mb-2">Day by day · real data</p>
          <h1 className="display-title text-4xl md:text-5xl mb-2">Progress</h1>
          <p className="text-[var(--text-muted)] max-w-xl">
            Built from sessions you finish on the timer or log below — not sample charts.
          </p>
        </div>
        <Link href="/workouts/timer" className="btn-primary !min-h-0 !py-2">
          Train &amp; log
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Streak" value={`${streak}d`} hint="Consecutive training days" />
        <Stat label="This week" value={String(stats.weekSessions)} hint={`${stats.weekMinutes} min`} />
        <Stat label="All sessions" value={String(stats.totalSessions)} hint={`${stats.totalMinutes} min total`} />
        <Stat label="Active days" value={String(stats.uniqueDays)} hint="Days with ≥1 session" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <h2 className="font-semibold mb-1">Last 14 days</h2>
          <p className="text-xs text-[var(--text-dim)] mb-4">
            Sessions completed each day. Empty bars = rest / not logged.
          </p>
          {completed.length === 0 ? (
            <EmptyState
              title="No day-by-day data yet"
              description="Finish a timer session (or log a workout below) and today’s bar will appear."
            />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={daily}>
                  <XAxis dataKey="label" stroke="var(--chart-axis)" fontSize={11} />
                  <YAxis allowDecimals={false} stroke="var(--chart-axis)" fontSize={11} width={24} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--chart-tooltip-bg)",
                      border: "1px solid var(--chart-tooltip-border)",
                      borderRadius: 8,
                      color: "var(--text)",
                    }}
                  />
                  <Bar dataKey="workouts" fill="var(--chart-bar)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-semibold mb-1">This week</h2>
          <p className="text-xs text-[var(--text-dim)] mb-4">Sun–Sat sessions from your logs.</p>
          <WeeklyChart data={weekly} heightClass="h-56" />
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="space-y-4">
          <div>
            <h2 className="font-semibold mb-1">Body weight</h2>
            <p className="text-xs text-[var(--text-dim)]">
              Optional. Log today’s weight to build a real trend.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              className="input-field !w-32"
              type="number"
              min={20}
              step={0.1}
              placeholder="kg"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
            />
            <Button type="button" onClick={logWeight}>
              Log today
            </Button>
          </div>
          {weightChart.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No weight entries yet.</p>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightChart}>
                  <CartesianGrid stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--chart-axis)" fontSize={11} />
                  <YAxis
                    domain={["dataMin - 1", "dataMax + 1"]}
                    stroke="var(--chart-axis)"
                    fontSize={11}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--chart-tooltip-bg)",
                      border: "1px solid var(--chart-tooltip-border)",
                      borderRadius: 8,
                      color: "var(--text)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bodyWeightKg"
                    stroke="var(--cyan)"
                    strokeWidth={2}
                    dot={{ fill: "var(--cyan)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="space-y-4">
          <div>
            <h2 className="font-semibold mb-1">Personal records</h2>
            <p className="text-xs text-[var(--text-dim)]">Add PRs you actually hit.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <input
              className="input-field"
              placeholder="Exercise"
              value={prName}
              onChange={(e) => setPrName(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="e.g. 60kg × 5"
              value={prValue}
              onChange={(e) => setPrValue(e.target.value)}
            />
          </div>
          <Button type="button" variant="secondary" onClick={addPr}>
            Save PR
          </Button>
          {prs.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No PRs saved yet.</p>
          ) : (
            <ul className="grid gap-2">
              {prs.map((pr) => (
                <li
                  key={`${pr.exerciseId}-${pr.date}`}
                  className="rounded-xl bg-[var(--bg-elevated)] p-3 flex justify-between gap-2"
                >
                  <div>
                    <p className="font-medium text-sm">{pr.exerciseName}</p>
                    <p className="text-[var(--lime)] text-sm">{pr.value}</p>
                    <p className="text-[10px] text-[var(--text-dim)]">{pr.date}</p>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-[var(--danger)]"
                    onClick={() => {
                      localData.deletePersonalRecord(pr.exerciseId, pr.date);
                      refresh();
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="space-y-4">
        <h2 className="font-semibold">Log a workout manually</h2>
        <p className="text-xs text-[var(--text-dim)]">
          Use this if you trained without the timer. Same history as timer completions.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <label className="grid gap-1 text-sm sm:col-span-1">
            <span>Name</span>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Upper body"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Duration (min)</span>
            <input
              className="input-field"
              type="number"
              min={1}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value) || 1)}
            />
          </label>
          <label className="grid gap-1 text-sm sm:col-span-3">
            <span>Notes</span>
            <input
              className="input-field"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
            />
          </label>
        </div>
        <Button onClick={createRecord}>Save workout record</Button>
      </Card>

      <div>
        <h2 className="font-semibold mb-3">Workout history</h2>
        {records.length === 0 ? (
          <EmptyState
            title="No workouts yet"
            description="Complete a timer session or save a manual log — Progress fills day by day from that."
          />
        ) : (
          <ul className="space-y-3">
            {records.map((r) => (
              <li key={r.id}>
                <Card className="flex flex-wrap items-center justify-between gap-3 !py-4">
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {r.date} · {r.durationMinutes} min
                      {r.notes ? ` · ${r.notes}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" onClick={() => updateNotes(r.id)}>
                      Edit
                    </Button>
                    <Button variant="ghost" onClick={() => remove(r.id)}>
                      Delete
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="!p-4">
      <p className="text-xs uppercase tracking-wider text-[var(--text-dim)] font-semibold mb-1">
        {label}
      </p>
      <p className="display-title text-3xl mb-1">{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{hint}</p>
    </Card>
  );
}
