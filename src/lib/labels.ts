import type {
  Equipment,
  ExperienceLevel,
  FitnessGoal,
  MuscleGroup,
  TrainingLocation,
} from "./types";

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  biceps: "Biceps",
  triceps: "Triceps",
  abs: "Abs",
  legs: "Legs",
  glutes: "Glutes",
  calves: "Calves",
  "full-body": "Full body",
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  none: "No equipment",
  dumbbells: "Dumbbells",
  barbells: "Barbells",
  "resistance-bands": "Resistance bands",
  machines: "Gym machines",
};

export const LEVEL_LABELS: Record<ExperienceLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const LOCATION_LABELS: Record<TrainingLocation, string> = {
  home: "Home",
  gym: "Gym",
};

export const GOAL_LABELS: Record<FitnessGoal, string> = {
  "build-muscle": "Build muscle",
  "get-stronger": "Get stronger",
  "lose-fat": "Lose fat",
  "improve-fitness": "Improve fitness",
  "general-conditioning": "General conditioning",
};

export const ALL_MUSCLES = Object.keys(MUSCLE_LABELS) as MuscleGroup[];
export const ALL_EQUIPMENT = Object.keys(EQUIPMENT_LABELS) as Equipment[];
export const ALL_LEVELS = Object.keys(LEVEL_LABELS) as ExperienceLevel[];
export const ALL_LOCATIONS = Object.keys(LOCATION_LABELS) as TrainingLocation[];
export const ALL_GOALS = Object.keys(GOAL_LABELS) as FitnessGoal[];
