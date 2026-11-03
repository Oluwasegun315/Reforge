"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { exercises, getExerciseById } from "@/data/exercises";
import {
  ALL_EQUIPMENT,
  ALL_GOALS,
  ALL_LEVELS,
  ALL_LOCATIONS,
  ALL_MUSCLES,
  EQUIPMENT_LABELS,
  GOAL_LABELS,
  LEVEL_LABELS,
  LOCATION_LABELS,
  MUSCLE_LABELS,
} from "@/lib/labels";
import type {
  Equipment,
  ExperienceLevel,
  FitnessGoal,
  MuscleGroup,
  TrainingLocation,
  WorkoutPlan,
} from "@/lib/types";
import { recommendWorkout, suggestDuration } from "@/lib/workout-generator";
import { localData } from "@/lib/storage";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type Mode = "pick" | "recommend" | "choose" | "review";

export function WorkoutBuilder() {
  const [mode, setMode] = useState<Mode>("pick");
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);

  // Recommend form
  const [goal, setGoal] = useState<FitnessGoal>("build-muscle");
  const [experience, setExperience] = useState<ExperienceLevel>("beginner");
  const [location, setLocation] = useState<TrainingLocation>("home");
  const [equipment, setEquipment] = useState<Equipment[]>(["none"]);
  const [days, setDays] = useState<string[]>(["Monday", "Wednesday", "Friday"]);
  const [duration, setDuration] = useState(30);
  const [focus, setFocus] = useState<MuscleGroup[]>(["full-body"]);

  // Choose mode
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [chooseDuration, setChooseDuration] = useState(30);

  const suggestions = useMemo(
    () => suggestDuration(experience, duration),
    [experience, duration]
  );

  const toggleEquip = (eq: Equipment) => {
    setEquipment((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    );
  };

  const toggleFocus = (m: MuscleGroup) => {
    setFocus((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const toggleDay = (d: string) => {
    setDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const toggleExercise = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const moveExercise = (index: number, dir: -1 | 1) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const generateRecommended = () => {
    const next = recommendWorkout({
      goal,
      experience,
      location,
      equipment: equipment.length ? equipment : ["none"],
      durationMinutes: duration,
      focusAreas: focus.length ? focus : ["full-body"],
      preferredDays: days,
    });
    setPlan(next);
    localData.saveActivePlan(next);
    setMode("review");
  };

  const buildChosen = () => {
    const next: WorkoutPlan = {
      id: `plan-${Date.now()}`,
      name: "Custom Workout",
      description:
        "A routine you built yourself. Review the list, then start when ready. Guidance only.",
      goal,
      level: experience,
      location,
      durationMinutes: chooseDuration,
      exercises: selectedIds.map((id) => {
        const ex = getExerciseById(id)!;
        return {
          exerciseId: id,
          sets: 3,
          reps: ex.reps,
          restSeconds: ex.restSeconds,
        };
      }),
      createdAt: new Date().toISOString(),
    };
    setPlan(next);
    localData.saveActivePlan(next);
    setMode("review");
  };

  if (mode === "pick") {
    return (
      <div className="grid md:grid-cols-2 gap-5">
        <Card className="flex flex-col">
          <Badge className="self-start mb-4">Option A</Badge>
          <h2 className="text-2xl font-semibold mb-2">Recommend a workout</h2>
          <p className="text-[var(--text-muted)] text-sm mb-6 flex-1">
            Answer a few questions about your goal, level, location, equipment, days, and time.
            We will build a sensible plan from the exercise library — no AI API required.
          </p>
          <Button onClick={() => setMode("recommend")}>Recommend a workout</Button>
        </Card>
        <Card className="flex flex-col">
          <Badge className="self-start mb-4 !bg-[var(--cyan-dim)] !text-[var(--cyan)] !border-[rgba(46,230,255,0.25)]">
            Option B
          </Badge>
          <h2 className="text-2xl font-semibold mb-2">Let me choose</h2>
          <p className="text-[var(--text-muted)] text-sm mb-6 flex-1">
            Pick muscle groups and individual exercises, add or remove them, and arrange your own
            routine before you start.
          </p>
          <Button variant="secondary" onClick={() => setMode("choose")}>
            Build it myself
          </Button>
        </Card>
      </div>
    );
  }

  if (mode === "recommend") {
    const weekdays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return (
      <Card className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Recommend a workout</h2>
          <Button variant="ghost" onClick={() => setMode("pick")}>
            Back
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="grid gap-1 text-sm">
            <span>Fitness goal</span>
            <select
              className="select-field"
              value={goal}
              onChange={(e) => setGoal(e.target.value as FitnessGoal)}
            >
              {ALL_GOALS.map((g) => (
                <option key={g} value={g}>
                  {GOAL_LABELS[g]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span>Experience level</span>
            <select
              className="select-field"
              value={experience}
              onChange={(e) => setExperience(e.target.value as ExperienceLevel)}
            >
              {ALL_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {LEVEL_LABELS[l]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span>Training location</span>
            <select
              className="select-field"
              value={location}
              onChange={(e) => setLocation(e.target.value as TrainingLocation)}
            >
              {ALL_LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {LOCATION_LABELS[l]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span>Session duration (minutes)</span>
            <input
              className="input-field"
              type="number"
              min={15}
              max={120}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value) || 30)}
            />
          </label>
        </div>

        <fieldset>
          <legend className="text-sm mb-2">Suggested durations</legend>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((m) => (
              <Button
                key={m}
                variant={duration === m ? "primary" : "secondary"}
                className="!min-h-0 !py-2"
                onClick={() => setDuration(m)}
              >
                {m} min
              </Button>
            ))}
          </div>
          <p className="text-xs text-[var(--text-dim)] mt-2">
            Suggestions only — not rigid exercise limits.
          </p>
        </fieldset>

        <fieldset>
          <legend className="text-sm mb-2">Available equipment</legend>
          <div className="flex flex-wrap gap-2">
            {ALL_EQUIPMENT.map((eq) => (
              <Button
                key={eq}
                variant={equipment.includes(eq) ? "primary" : "secondary"}
                className="!min-h-0 !py-2 text-sm"
                onClick={() => toggleEquip(eq)}
              >
                {EQUIPMENT_LABELS[eq]}
              </Button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm mb-2">Preferred training days</legend>
          <div className="flex flex-wrap gap-2">
            {weekdays.map((d) => (
              <Button
                key={d}
                variant={days.includes(d) ? "primary" : "secondary"}
                className="!min-h-0 !py-2 text-sm"
                onClick={() => toggleDay(d)}
              >
                {d.slice(0, 3)}
              </Button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm mb-2">Areas you want to train</legend>
          <div className="flex flex-wrap gap-2">
            {ALL_MUSCLES.map((m) => (
              <Button
                key={m}
                variant={focus.includes(m) ? "primary" : "secondary"}
                className="!min-h-0 !py-2 text-sm"
                onClick={() => toggleFocus(m)}
              >
                {MUSCLE_LABELS[m]}
              </Button>
            ))}
          </div>
        </fieldset>

        <Button onClick={generateRecommended}>Generate my plan</Button>
      </Card>
    );
  }

  if (mode === "choose") {
    return (
      <div className="space-y-5">
        <Card className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Build your own</h2>
            <p className="text-sm text-[var(--text-muted)]">
              {selectedIds.length} exercise{selectedIds.length === 1 ? "" : "s"} selected
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => setMode("pick")}>
              Back
            </Button>
            <Button
              disabled={selectedIds.length === 0}
              onClick={buildChosen}
            >
              Review plan
            </Button>
          </div>
        </Card>

        <label className="grid gap-1 text-sm max-w-xs">
          <span>Planned duration (minutes)</span>
          <input
            className="input-field"
            type="number"
            min={15}
            max={120}
            value={chooseDuration}
            onChange={(e) => setChooseDuration(Number(e.target.value) || 30)}
          />
        </label>

        {selectedIds.length > 0 && (
          <Card>
            <h3 className="font-semibold mb-3">Your order</h3>
            <ul className="space-y-2">
              {selectedIds.map((id, index) => {
                const ex = getExerciseById(id);
                if (!ex) return null;
                return (
                  <li
                    key={id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--bg-elevated)] px-3 py-2"
                  >
                    <span className="text-sm font-medium">
                      {index + 1}. {ex.name}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        className="!min-h-0 !px-2 !py-1 text-xs"
                        onClick={() => moveExercise(index, -1)}
                        aria-label="Move up"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        className="!min-h-0 !px-2 !py-1 text-xs"
                        onClick={() => moveExercise(index, 1)}
                        aria-label="Move down"
                      >
                        ↓
                      </Button>
                      <Button
                        variant="ghost"
                        className="!min-h-0 !px-2 !py-1 text-xs"
                        onClick={() => toggleExercise(id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {exercises.map((ex) => {
            const selected = selectedIds.includes(ex.id);
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => toggleExercise(ex.id)}
                className={`text-left card-surface p-4 transition border ${
                  selected
                    ? "border-[rgba(200,255,60,0.45)]"
                    : "border-[var(--border)] hover:border-[var(--border-strong)]"
                }`}
              >
                <p className="font-semibold mb-1">{ex.name}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {MUSCLE_LABELS[ex.muscleGroup]} · {EQUIPMENT_LABELS[ex.equipment]}
                </p>
                <p className="text-xs mt-2 text-[var(--lime)]">
                  {selected ? "Selected — tap to remove" : "Tap to add"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // review
  if (mode === "review" && !plan) {
    return (
      <Card>
        <p className="text-[var(--text-muted)] mb-4">No plan to review yet.</p>
        <Button onClick={() => setMode("pick")}>Choose how to start</Button>
      </Card>
    );
  }

  if (!plan) return null;

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="section-eyebrow mb-2">Ready to train</p>
          <h2 className="text-3xl font-semibold mb-2">{plan.name}</h2>
          <p className="text-[var(--text-muted)] text-sm max-w-xl">{plan.description}</p>
        </div>
        <Button variant="ghost" onClick={() => setMode("pick")}>
          Start over
        </Button>
      </div>

      <p className="text-sm">
        <span className="text-[var(--lime)] font-semibold">{plan.durationMinutes} minutes</span>
        <span className="text-[var(--text-dim)]">
          {" "}
          · {LEVEL_LABELS[plan.level]} · {LOCATION_LABELS[plan.location]}
        </span>
      </p>

      <ol className="space-y-3">
        {plan.exercises.map((item, i) => {
          const ex = getExerciseById(item.exerciseId);
          if (!ex) return null;
          return (
            <li
              key={`${item.exerciseId}-${i}`}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {i + 1}. {ex.name}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {item.sets} sets · {item.reps} · rest {item.restSeconds}s
                  </p>
                </div>
                <Link
                  href={`/exercises/${ex.id}`}
                  className="text-sm text-[var(--cyan)] hover:underline"
                >
                  Demo & cues
                </Link>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap gap-3">
        <Link href="/workouts/timer" className="btn-primary">
          Start workout timer
        </Link>
        <Button
          variant="secondary"
          onClick={() => {
            localData.saveActivePlan(plan);
            alert("Plan saved on this device.");
          }}
        >
          Save plan locally
        </Button>
      </div>
    </Card>
  );
}
