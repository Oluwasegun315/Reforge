import { DEMO_PROFILE } from "@/data/demo-user";
import type { UserProfile } from "@/lib/types";

/** Merge stored/partial profiles so older localStorage data still works. */
export function normalizeProfile(input?: Partial<UserProfile> | null): UserProfile {
  const base = DEMO_PROFILE;
  if (!input) {
    return {
      ...base,
      id: `user-${Date.now()}`,
      preferredName: "",
      email: "",
      createdAt: new Date().toISOString(),
    };
  }

  return {
    id: input.id ?? `user-${Date.now()}`,
    preferredName: input.preferredName ?? "",
    email: input.email ?? "",
    photoUrl: input.photoUrl ?? null,
    bio: input.bio ?? "",
    city: input.city ?? "Lagos",
    country: input.country ?? "Nigeria",
    heightCm: input.heightCm ?? null,
    weightKg: input.weightKg ?? null,
    goal: input.goal ?? base.goal,
    experience: input.experience ?? base.experience,
    location: input.location ?? base.location,
    equipment: input.equipment ?? base.equipment,
    preferredDays: input.preferredDays ?? base.preferredDays,
    sessionMinutes: input.sessionMinutes ?? base.sessionMinutes,
    focusAreas: input.focusAreas ?? base.focusAreas,
    notificationsEnabled: input.notificationsEnabled ?? false,
    // Legacy local profiles (pre email-gate) stay usable; new signups start unverified.
    emailVerified:
      typeof input.emailVerified === "boolean"
        ? input.emailVerified
        : Boolean(input.preferredName && input.email),
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
