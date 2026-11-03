export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "abs"
  | "legs"
  | "glutes"
  | "calves"
  | "full-body";

export type Equipment =
  | "none"
  | "dumbbells"
  | "barbells"
  | "resistance-bands"
  | "machines";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type TrainingLocation = "home" | "gym";

export type FitnessGoal =
  | "build-muscle"
  | "get-stronger"
  | "lose-fat"
  | "improve-fitness"
  | "general-conditioning";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: Equipment;
  difficulty: ExperienceLevel;
  location: TrainingLocation[];
  instructions: string[];
  sets: string;
  reps: string;
  restSeconds: number;
  commonMistakes: string[];
  beginnerModifications: string[];
  alternatives: string[];
  /** Path under /public, or null when no demo media exists */
  videoSrc: string | null;
  imageSrc: string | null;
  tips: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  goal: FitnessGoal;
  level: ExperienceLevel;
  location: TrainingLocation;
  durationMinutes: number;
  exercises: WorkoutExercise[];
  createdAt: string;
}

export interface WorkoutRecord {
  id: string;
  workoutPlanId?: string;
  name: string;
  date: string;
  durationMinutes: number;
  exercisesCompleted: number;
  notes?: string;
  completed: boolean;
}

export interface UserProfile {
  id: string;
  preferredName: string;
  email: string;
  photoUrl: string | null;
  bio: string;
  city: string;
  country: string;
  heightCm: number | null;
  weightKg: number | null;
  goal: FitnessGoal;
  experience: ExperienceLevel;
  location: TrainingLocation;
  equipment: Equipment[];
  preferredDays: string[];
  sessionMinutes: number;
  focusAreas: MuscleGroup[];
  notificationsEnabled: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export type PendingSignup = {
  preferredName: string;
  email: string;
  country: string;
  passwordHint: boolean;
  /** Kept briefly for local (no-Supabase) confirm → sign-in. Cleared after verify. */
  password?: string;
  createdAt: string;
};

/** Local email/password credentials when Supabase is not connected. */
export type LocalAuthCreds = {
  email: string;
  password: string;
};

export interface ProgressEntry {
  date: string;
  bodyWeightKg?: number;
  notes?: string;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  value: string;
  date: string;
}

export interface TimerConfig {
  startTime: string;
  endTime: string;
  durationMinutes: number;
}
