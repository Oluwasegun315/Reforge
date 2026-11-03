import type {
  PersonalRecord,
  ProgressEntry,
  UserProfile,
  WorkoutRecord,
} from "@/lib/types";

/** Clearly labeled sample data for demo mode only — not real user results. */
export const DEMO_PROFILE: UserProfile = {
  id: "demo-user",
  preferredName: "Alex",
  email: "demo@repforge.app",
  photoUrl: null,
  bio: "",
  city: "Lagos",
  country: "Nigeria",
  heightCm: null,
  weightKg: null,
  goal: "build-muscle",
  experience: "beginner",
  location: "gym",
  equipment: ["dumbbells", "none", "machines"],
  preferredDays: ["Monday", "Wednesday", "Friday"],
  sessionMinutes: 45,
  focusAreas: ["chest", "back", "legs"],
  notificationsEnabled: false,
  emailVerified: true,
  createdAt: new Date().toISOString(),
};

export const DEMO_WORKOUT_HISTORY: WorkoutRecord[] = [
  {
    id: "wr-1",
    name: "Full Body Starter",
    date: "2026-10-25",
    durationMinutes: 42,
    exercisesCompleted: 6,
    completed: true,
    notes: "Felt strong on squats.",
  },
  {
    id: "wr-2",
    name: "Upper Body Focus",
    date: "2026-10-23",
    durationMinutes: 38,
    exercisesCompleted: 5,
    completed: true,
  },
  {
    id: "wr-3",
    name: "Legs & Core",
    date: "2026-10-21",
    durationMinutes: 40,
    exercisesCompleted: 5,
    completed: true,
  },
];

export const DEMO_PROGRESS: ProgressEntry[] = [
  { date: "2026-09-15", bodyWeightKg: 72.5 },
  { date: "2026-09-29", bodyWeightKg: 72.8 },
  { date: "2026-10-13", bodyWeightKg: 73.1 },
  { date: "2026-10-27", bodyWeightKg: 73.0 },
];

export const DEMO_PRS: PersonalRecord[] = [
  {
    exerciseId: "push-ups",
    exerciseName: "Push-Ups",
    value: "15 unbroken",
    date: "2026-10-20",
  },
  {
    exerciseId: "goblet-squats",
    exerciseName: "Goblet Squats",
    value: "16 kg × 10",
    date: "2026-10-22",
  },
];

export const DEMO_WEEKLY_ACTIVITY = [
  { day: "Mon", workouts: 1 },
  { day: "Tue", workouts: 0 },
  { day: "Wed", workouts: 1 },
  { day: "Thu", workouts: 0 },
  { day: "Fri", workouts: 1 },
  { day: "Sat", workouts: 0 },
  { day: "Sun", workouts: 0 },
];
