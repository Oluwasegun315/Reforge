export type AppNotification = {
  id: string;
  title: string;
  body: string;
  /** Longer explanation shown on the detail page */
  detail?: string;
  createdAt: string;
  read: boolean;
  href?: string;
  kind?: "reminder" | "tip" | "system" | "workout";
};

const KEY = "repforge.notifications";
const EVENT = "repforge:notifications";

function read(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AppNotification[];
  } catch {
    return [];
  }
}

function write(list: AppNotification[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
  window.dispatchEvent(new Event(EVENT));
}

export const notificationsStore = {
  eventName: EVENT,
  list(): AppNotification[] {
    return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  get(id: string): AppNotification | null {
    return read().find((n) => n.id === id) ?? null;
  },
  unreadCount(): number {
    return read().filter((n) => !n.read).length;
  },
  add(
    input: Omit<AppNotification, "id" | "createdAt" | "read"> & {
      id?: string;
      read?: boolean;
    }
  ) {
    const list = read();
    const next: AppNotification = {
      id: input.id ?? `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: input.title,
      body: input.body,
      detail: input.detail,
      href: input.href,
      kind: input.kind ?? "system",
      createdAt: new Date().toISOString(),
      read: input.read ?? false,
    };
    write([next, ...list.filter((n) => n.id !== next.id)]);
    return next;
  },
  markRead(id: string) {
    write(read().map((n) => (n.id === id ? { ...n, read: true } : n)));
  },
  markAllRead() {
    write(read().map((n) => ({ ...n, read: true })));
  },
  clear() {
    write([]);
  },
  ensureWelcomePack(name: string) {
    const seeded = localStorage.getItem("repforge.notifSeeded");
    if (seeded) return;
    const first = (name || "Athlete").split(" ")[0];
    notificationsStore.add({
      id: "welcome",
      kind: "system",
      title: `Welcome, ${first}`,
      body: "Start one short session today — tap to open the timer.",
      detail:
        "Your forge starts with one completed session. Open the timer, run a short block, then log it. Set preferred training days in Profile so day-of reminders stay useful.",
      href: "/workouts/timer",
    });
    notificationsStore.add({
      id: "nutrition-tip",
      kind: "tip",
      title: "Fuel tip for today",
      body: "Add eggs, beans, or titus fish to your next meal — protein rebuilds after training.",
      detail:
        "Open Nutrition for Nigerian plates that fit real markets and budgets. Pair carbs (yam, rice, plantain) with protein (eggs, beans, fish) and greens (ugu).",
      href: "/nutrition",
    });
    localStorage.setItem("repforge.notifSeeded", "1");
  },

  /** One actionable alert per calendar day for signed-in members. */
  ensureDailyMemberAlert(input: {
    preferredName: string;
    preferredDays: string[];
    focusAreas: string[];
    sessionMinutes: number;
    notificationsEnabled: boolean;
  }) {
    const dayKey = new Date().toISOString().slice(0, 10);
    const flag = `repforge.dailyAlert.${dayKey}`;
    if (localStorage.getItem(flag)) return;

    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const focus = input.focusAreas.length ? input.focusAreas.slice(0, 3).join(", ") : "full body";
    const first = (input.preferredName || "Athlete").split(" ")[0];
    const isTrainingDay = input.preferredDays.includes(today);

    if (isTrainingDay) {
      notificationsStore.add({
        id: `daily-${dayKey}`,
        kind: "reminder",
        title: `${first} — training day`,
        body: `${today}: ~${input.sessionMinutes} min focusing on ${focus}. Tap to start.`,
        detail: `You marked ${today} as a training day.\n\nSuggested length: ${input.sessionMinutes} minutes\nFocus: ${focus}\n\nOpen the timer to start, or change days anytime in Profile / Settings.`,
        href: "/workouts/timer",
      });
    } else {
      notificationsStore.add({
        id: `daily-${dayKey}`,
        kind: "tip",
        title: `${first} — recovery window`,
        body: `${today} is off your list. Rest, walk, or hit a light plate — open Nutrition.`,
        detail: `Preferred days: ${input.preferredDays.join(", ") || "not set yet"}.\n\nToday is ${today}. Use this for sleep, protein, and optional mobility. You can still train if you feel ready.`,
        href: "/nutrition",
      });
    }

    localStorage.setItem(flag, "1");
  },
  /** Create / refresh reminders from profile preferences. */
  syncProfileReminders(input: {
    preferredName: string;
    preferredDays: string[];
    focusAreas: string[];
    sessionMinutes: number;
    notificationsEnabled: boolean;
  }) {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const dayKey = `training-day-${new Date().toISOString().slice(0, 10)}`;
    const focus = input.focusAreas.length ? input.focusAreas.join(", ") : "full body";
    const days = input.preferredDays.length
      ? input.preferredDays.join(", ")
      : "no days selected yet";

    notificationsStore.add({
      id: "prefs-saved",
      kind: "system",
      title: "Training preferences saved",
      body: `Days: ${days}. Focus: ${focus}.`,
      detail: `${input.preferredName || "Athlete"}, your profile preferences are saved on this device.\n\nPreferred days: ${days}\nFocus areas: ${focus}\nSession length: about ${input.sessionMinutes} minutes.\n\nTap Open plan to build or start a workout that matches these settings. When reminders are on, we’ll nudge you on your training days.`,
      href: "/workouts",
    });

    if (input.preferredDays.includes(today)) {
      notificationsStore.add({
        id: dayKey,
        kind: "reminder",
        title: `Training day: ${today}`,
        body: `You picked ${today}. Aim for ~${input.sessionMinutes} min focusing on ${focus}.`,
        detail: `This is your scheduled training reminder for ${today}.\n\nSuggested session: ${input.sessionMinutes} minutes\nFocus: ${focus}\n\nOpen the timer to start with coach OLUWASEGUN, or open exercises to pick moves for today’s focus. Completing the session helps your streak and forge level on the dashboard.`,
        href: "/workouts/timer",
      });
    } else {
      notificationsStore.add({
        id: `rest-${new Date().toISOString().slice(0, 10)}`,
        kind: "tip",
        title: "Recovery / light day",
        body: `Today (${today}) is not in your preferred days. Rest, walk, or do light mobility.`,
        detail: `Your preferred training days are: ${days}.\n\nToday is ${today}, so this is a good recovery window — sleep, protein, and optional light movement. You can still train if you feel ready; preferences are a guide, not a cage.`,
        href: "/nutrition",
      });
    }
  },
};

export async function requestBrowserPermission(): Promise<"granted" | "denied" | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const result = await Notification.requestPermission();
  return result === "granted" ? "granted" : "denied";
}

export function pushBrowserNotification(title: string, body: string, url?: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    const n = new Notification(title, { body, icon: "/icon" });
    if (url) {
      n.onclick = () => {
        window.focus();
        window.location.href = url;
      };
    }
  } catch {
    // Some browsers block Notification constructor outside service workers.
  }
}
