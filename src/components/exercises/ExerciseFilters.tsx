"use client";

import {
  ALL_EQUIPMENT,
  ALL_LEVELS,
  ALL_LOCATIONS,
  ALL_MUSCLES,
  EQUIPMENT_LABELS,
  LEVEL_LABELS,
  LOCATION_LABELS,
  MUSCLE_LABELS,
} from "@/lib/labels";
import type {
  Equipment,
  ExperienceLevel,
  MuscleGroup,
  TrainingLocation,
} from "@/lib/types";

export interface FilterState {
  muscle: MuscleGroup | "all";
  equipment: Equipment | "all";
  level: ExperienceLevel | "all";
  location: TrainingLocation | "all";
  query: string;
}

export const defaultFilters: FilterState = {
  muscle: "all",
  equipment: "all",
  level: "all",
  location: "all",
  query: "",
};

export function ExerciseFilters({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  return (
    <div className="card-surface p-4 md:p-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <label className="grid gap-1 text-sm xl:col-span-1">
        <span className="text-[var(--text-dim)]">Search</span>
        <input
          className="input-field"
          type="search"
          placeholder="Push-ups, squats…"
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="text-[var(--text-dim)]">Muscle group</span>
        <select
          className="select-field"
          value={value.muscle}
          onChange={(e) =>
            onChange({ ...value, muscle: e.target.value as FilterState["muscle"] })
          }
        >
          <option value="all">All muscles</option>
          {ALL_MUSCLES.map((m) => (
            <option key={m} value={m}>
              {MUSCLE_LABELS[m]}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span className="text-[var(--text-dim)]">Equipment</span>
        <select
          className="select-field"
          value={value.equipment}
          onChange={(e) =>
            onChange({
              ...value,
              equipment: e.target.value as FilterState["equipment"],
            })
          }
        >
          <option value="all">All equipment</option>
          {ALL_EQUIPMENT.map((eq) => (
            <option key={eq} value={eq}>
              {EQUIPMENT_LABELS[eq]}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span className="text-[var(--text-dim)]">Experience</span>
        <select
          className="select-field"
          value={value.level}
          onChange={(e) =>
            onChange({ ...value, level: e.target.value as FilterState["level"] })
          }
        >
          <option value="all">All levels</option>
          {ALL_LEVELS.map((l) => (
            <option key={l} value={l}>
              {LEVEL_LABELS[l]}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span className="text-[var(--text-dim)]">Location</span>
        <select
          className="select-field"
          value={value.location}
          onChange={(e) =>
            onChange({
              ...value,
              location: e.target.value as FilterState["location"],
            })
          }
        >
          <option value="all">Home or gym</option>
          {ALL_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {LOCATION_LABELS[loc]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
