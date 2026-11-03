"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Camera, Trash2, UserRound } from "lucide-react";
import { DEMO_PROFILE } from "@/data/demo-user";
import { localData } from "@/lib/storage";
import { normalizeProfile, WEEKDAYS } from "@/lib/profile";
import type {
  Equipment,
  ExperienceLevel,
  FitnessGoal,
  MuscleGroup,
  TrainingLocation,
  UserProfile,
} from "@/lib/types";
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
import { markSignedIn } from "@/lib/auth-session";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { prepareAvatarDataUrl } from "@/lib/image";
import { notificationsStore, pushBrowserNotification } from "@/lib/notifications";

export function ProfileForm() {
  const [profile, setProfile] = useState<UserProfile>(DEMO_PROFILE);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const existing = localData.getProfile();
    if (existing) setProfile(normalizeProfile(existing));
  }, []);

  const onPhoto = (file: File | null) => {
    setError(null);
    if (!file) return;
    setUploading(true);
    void prepareAvatarDataUrl(file)
      .then((dataUrl) => {
        setProfile((p) => ({ ...p, photoUrl: dataUrl }));
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Could not use that image.");
      })
      .finally(() => setUploading(false));
  };

  const removePhoto = () => {
    setProfile((p) => ({ ...p, photoUrl: null }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const toggleList = <T extends string>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const save = () => {
    setError(null);
    const name = profile.preferredName.trim();
    if (!name) {
      setError("Add a preferred name so we can greet you on the dashboard.");
      return;
    }
    const next = normalizeProfile({
      ...profile,
      preferredName: name,
      email: profile.email.trim(),
      bio: profile.bio.trim(),
      city: profile.city.trim() || "Lagos",
      country: profile.country.trim() || "Nigeria",
      sessionMinutes: Math.min(120, Math.max(15, profile.sessionMinutes || 45)),
      equipment: profile.equipment.length ? profile.equipment : ["none"],
      preferredDays: profile.preferredDays.length
        ? profile.preferredDays
        : ["Monday", "Wednesday", "Friday"],
      focusAreas: profile.focusAreas.length ? profile.focusAreas : ["full-body"],
      emailVerified: true,
    });
    localData.saveProfile(next);
    markSignedIn();
    notificationsStore.ensureWelcomePack(name);
    notificationsStore.syncProfileReminders({
      preferredName: next.preferredName,
      preferredDays: next.preferredDays,
      focusAreas: next.focusAreas,
      sessionMinutes: next.sessionMinutes,
      notificationsEnabled: next.notificationsEnabled,
    });
    if (next.notificationsEnabled) {
      pushBrowserNotification(
        "Preferences saved",
        `Training days: ${next.preferredDays.join(", ") || "none"}`,
        "/dashboard"
      );
    }
    setProfile(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const initial = (profile.preferredName || "A").slice(0, 1).toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="section-eyebrow mb-2">Account</p>
        <h1 className="display-title text-4xl md:text-5xl mb-2">Profile</h1>
        <p className="text-[var(--text-muted)] text-sm md:text-base">
          Avatar, goals, equipment, and training days — saved on this device (and ready for
          Supabase later).
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-[rgba(255,92,92,0.4)] bg-[rgba(255,92,92,0.1)] px-4 py-3 text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      )}

      <Card className="space-y-6 !p-6 md:!p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative h-28 w-28 shrink-0 rounded-full overflow-hidden border-2 border-[rgba(200,255,60,0.45)] bg-[var(--bg-elevated)] flex items-center justify-center text-4xl font-bold text-[var(--lime)]">
            {profile.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photoUrl} alt="Your avatar" className="h-full w-full object-cover" />
            ) : (
              <span aria-hidden>{initial}</span>
            )}
          </div>
          <div className="space-y-3">
            <p className="font-semibold">Profile photo</p>
            <p className="text-sm text-[var(--text-muted)]">
              Any photo works — we resize it automatically for a clean avatar.
            </p>
            <div className="flex flex-wrap gap-2">
              <label className="btn-secondary cursor-pointer !min-h-0 !py-2 !px-4 inline-flex items-center gap-2">
                <Camera size={16} aria-hidden />
                {uploading ? "Processing…" : "Upload avatar"}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={uploading}
                  onChange={(e) => onPhoto(e.target.files?.[0] ?? null)}
                />
              </label>
              {profile.photoUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  className="!min-h-0 !py-2"
                  onClick={removePhoto}
                >
                  <Trash2 size={16} aria-hidden />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-1.5 text-sm sm:col-span-2">
            <span className="font-medium">Preferred name</span>
            <input
              className="input-field"
              value={profile.preferredName}
              onChange={(e) => setProfile((p) => ({ ...p, preferredName: e.target.value }))}
              placeholder="OLUWASEGUN"
              autoComplete="nickname"
            />
          </label>

          <label className="grid gap-1.5 text-sm sm:col-span-2">
            <span className="font-medium">Email</span>
            <input
              className="input-field"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@gmail.com"
              autoComplete="email"
            />
          </label>

          <label className="grid gap-1.5 text-sm sm:col-span-2">
            <span className="font-medium">Short bio</span>
            <textarea
              className="textarea-field min-h-[5rem]"
              value={profile.bio}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
              placeholder="Why you train — e.g. build strength, stay healthy in Lagos…"
              maxLength={280}
            />
            <span className="text-xs text-[var(--text-dim)]">{profile.bio.length}/280</span>
          </label>

          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">City</span>
            <input
              className="input-field"
              value={profile.city}
              onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
              placeholder="Lagos"
              autoComplete="address-level2"
            />
          </label>

          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Country</span>
            <input
              className="input-field"
              value={profile.country}
              onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))}
              placeholder="Nigeria"
              autoComplete="country-name"
            />
          </label>

          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Height (cm)</span>
            <input
              className="input-field"
              type="number"
              min={100}
              max={250}
              value={profile.heightCm ?? ""}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  heightCm: e.target.value ? Number(e.target.value) : null,
                }))
              }
              placeholder="Optional"
            />
          </label>

          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Weight (kg)</span>
            <input
              className="input-field"
              type="number"
              min={30}
              max={250}
              step={0.1}
              value={profile.weightKg ?? ""}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  weightKg: e.target.value ? Number(e.target.value) : null,
                }))
              }
              placeholder="Optional"
            />
          </label>
        </div>
      </Card>

      <Card className="space-y-5 !p-6 md:!p-8">
        <div>
          <h2 className="font-semibold text-lg">Training preferences</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Tap any chip to add it. Tap again to remove it. Then press Save profile.
          </p>
        </div>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Fitness goal</span>
          <select
            className="select-field"
            value={profile.goal}
            onChange={(e) =>
              setProfile((p) => ({ ...p, goal: e.target.value as FitnessGoal }))
            }
          >
            {ALL_GOALS.map((g) => (
              <option key={g} value={g}>
                {GOAL_LABELS[g]}
              </option>
            ))}
          </select>
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Experience</span>
            <select
              className="select-field"
              value={profile.experience}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  experience: e.target.value as ExperienceLevel,
                }))
              }
            >
              {ALL_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {LEVEL_LABELS[l]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Training location</span>
            <select
              className="select-field"
              value={profile.location}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  location: e.target.value as TrainingLocation,
                }))
              }
            >
              {ALL_LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {LOCATION_LABELS[l]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Typical session (minutes)</span>
          <input
            className="input-field"
            type="number"
            min={15}
            max={120}
            value={profile.sessionMinutes}
            onChange={(e) =>
              setProfile((p) => ({
                ...p,
                sessionMinutes: Number(e.target.value) || 30,
              }))
            }
          />
        </label>

        <fieldset>
          <legend className="text-sm font-medium mb-2">
            Equipment you have{" "}
            <span className="text-[var(--text-dim)] font-normal">
              ({profile.equipment.length} selected)
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {ALL_EQUIPMENT.map((item) => {
              const on = profile.equipment.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={on}
                  title={on ? "Click to remove" : "Click to add"}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm border transition cursor-pointer select-none active:scale-95",
                    on
                      ? "border-[var(--lime)] bg-[var(--lime-dim)] text-[var(--lime)]"
                      : "border-[var(--border)] bg-[var(--chip-idle-bg)] text-[var(--text-muted)] hover:border-[var(--border-strong)]"
                  )}
                  onClick={() =>
                    setProfile((p) => ({
                      ...p,
                      equipment: toggleList(p.equipment, item as Equipment),
                    }))
                  }
                >
                  {EQUIPMENT_LABELS[item]}
                  <span className="ml-1 text-[10px] opacity-70">{on ? "✓" : "+"}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium mb-2">
            Preferred training days{" "}
            <span className="text-[var(--text-dim)] font-normal">
              ({profile.preferredDays.length} selected — reminders use these)
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((day) => {
              const on = profile.preferredDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={on}
                  title={on ? "Click to remove" : "Click to add"}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm border transition cursor-pointer select-none active:scale-95",
                    on
                      ? "border-[var(--cyan)] bg-[var(--cyan-dim)] text-[var(--cyan)]"
                      : "border-[var(--border)] bg-[var(--chip-idle-bg)] text-[var(--text-muted)] hover:border-[var(--border-strong)]"
                  )}
                  onClick={() =>
                    setProfile((p) => ({
                      ...p,
                      preferredDays: toggleList(p.preferredDays, day),
                    }))
                  }
                >
                  {day.slice(0, 3)}
                  <span className="ml-1 text-[10px] opacity-70">{on ? "✓" : "+"}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium mb-2">
            Focus areas{" "}
            <span className="text-[var(--text-dim)] font-normal">
              ({profile.focusAreas.length} selected)
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {ALL_MUSCLES.map((m) => {
              const on = profile.focusAreas.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={on}
                  title={on ? "Click to remove" : "Click to add"}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm border transition cursor-pointer select-none active:scale-95",
                    on
                      ? "border-[var(--lime)] bg-[var(--lime-dim)] text-[var(--lime)]"
                      : "border-[var(--border)] bg-[var(--chip-idle-bg)] text-[var(--text-muted)] hover:border-[var(--border-strong)]"
                  )}
                  onClick={() =>
                    setProfile((p) => ({
                      ...p,
                      focusAreas: toggleList(p.focusAreas, m as MuscleGroup),
                    }))
                  }
                >
                  {MUSCLE_LABELS[m]}
                  <span className="ml-1 text-[10px] opacity-70">{on ? "✓" : "+"}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={save}>Save profile</Button>
        <Link href="/dashboard" className="btn-secondary">
          <UserRound size={16} aria-hidden />
          Open dashboard
        </Link>
        {saved && (
          <span className="text-sm text-[var(--success)]" role="status">
            Profile saved.
          </span>
        )}
      </div>
    </div>
  );
}
