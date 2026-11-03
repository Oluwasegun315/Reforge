import type {
  LocalAuthCreds,
  PendingSignup,
  PersonalRecord,
  ProgressEntry,
  UserProfile,
  WorkoutPlan,
  WorkoutRecord,
} from "./types";

const KEYS = {
  profile: "repforge.profile",
  workouts: "repforge.workoutRecords",
  activePlan: "repforge.activePlan",
  demoSession: "repforge.demoSession",
  pendingSignup: "repforge.pendingSignup",
  localAuth: "repforge.localAuth",
  progressEntries: "repforge.progressEntries",
  personalRecords: "repforge.personalRecords",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const localData = {
  getProfile(): UserProfile | null {
    return read<UserProfile | null>(KEYS.profile, null);
  },
  saveProfile(profile: UserProfile) {
    write(KEYS.profile, profile);
  },
  getWorkoutRecords(): WorkoutRecord[] {
    return read<WorkoutRecord[]>(KEYS.workouts, []);
  },
  saveWorkoutRecords(records: WorkoutRecord[]) {
    write(KEYS.workouts, records);
  },
  addWorkoutRecord(record: WorkoutRecord) {
    const list = localData.getWorkoutRecords();
    list.unshift(record);
    localData.saveWorkoutRecords(list);
  },
  updateWorkoutRecord(id: string, patch: Partial<WorkoutRecord>) {
    const list = localData.getWorkoutRecords().map((r) =>
      r.id === id ? { ...r, ...patch } : r
    );
    localData.saveWorkoutRecords(list);
  },
  deleteWorkoutRecord(id: string) {
    localData.saveWorkoutRecords(
      localData.getWorkoutRecords().filter((r) => r.id !== id)
    );
  },
  getActivePlan(): WorkoutPlan | null {
    return read<WorkoutPlan | null>(KEYS.activePlan, null);
  },
  saveActivePlan(plan: WorkoutPlan | null) {
    write(KEYS.activePlan, plan);
  },
  isDemoSignedIn(): boolean {
    return read(KEYS.demoSession, false);
  },
  /** True when the session key was never written (legacy profiles before session flag). */
  hasDemoSessionKey(): boolean {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(KEYS.demoSession) !== null;
  },
  setDemoSignedIn(value: boolean) {
    write(KEYS.demoSession, value);
  },
  getPendingSignup(): PendingSignup | null {
    return read<PendingSignup | null>(KEYS.pendingSignup, null);
  },
  savePendingSignup(pending: PendingSignup | null) {
    if (pending === null) {
      if (typeof window !== "undefined") localStorage.removeItem(KEYS.pendingSignup);
      return;
    }
    write(KEYS.pendingSignup, pending);
  },
  getLocalAuth(): LocalAuthCreds | null {
    return read<LocalAuthCreds | null>(KEYS.localAuth, null);
  },
  saveLocalAuth(creds: LocalAuthCreds | null) {
    if (creds === null) {
      if (typeof window !== "undefined") localStorage.removeItem(KEYS.localAuth);
      return;
    }
    write(KEYS.localAuth, {
      email: creds.email.trim().toLowerCase(),
      password: creds.password,
    });
  },
  getProgressEntries(): ProgressEntry[] {
    return read<ProgressEntry[]>(KEYS.progressEntries, []);
  },
  saveProgressEntries(entries: ProgressEntry[]) {
    write(KEYS.progressEntries, entries);
  },
  upsertProgressEntry(entry: ProgressEntry) {
    const list = localData.getProgressEntries().filter((e) => e.date !== entry.date);
    list.push(entry);
    list.sort((a, b) => a.date.localeCompare(b.date));
    localData.saveProgressEntries(list);
  },
  getPersonalRecords(): PersonalRecord[] {
    return read<PersonalRecord[]>(KEYS.personalRecords, []);
  },
  savePersonalRecords(records: PersonalRecord[]) {
    write(KEYS.personalRecords, records);
  },
  addPersonalRecord(record: PersonalRecord) {
    const list = localData.getPersonalRecords();
    list.unshift(record);
    localData.savePersonalRecords(list.slice(0, 40));
  },
  deletePersonalRecord(exerciseId: string, date: string) {
    localData.savePersonalRecords(
      localData.getPersonalRecords().filter(
        (r) => !(r.exerciseId === exerciseId && r.date === date)
      )
    );
  },
  clearAll() {
    if (typeof window === "undefined") return;
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
