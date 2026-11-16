"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Bell,
  CheckCheck,
  Dumbbell,
  Flame,
  Salad,
  Settings2,
  Timer,
  Zap,
} from "lucide-react";
import {
  notificationsStore,
  pushBrowserNotification,
  requestBrowserPermission,
  type AppNotification,
} from "@/lib/notifications";
import { localData } from "@/lib/storage";
import { normalizeProfile } from "@/lib/profile";
import { useAuth } from "@/components/auth/AuthProvider";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { cn } from "@/lib/utils";

/** Only mounts for signed-in users (Navbar gates this). */
export function NotificationBell() {
  const auth = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [remindersOn, setRemindersOn] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const refresh = () => {
    setItems(notificationsStore.list());
    const profile = localData.getProfile();
    setRemindersOn(Boolean(profile?.notificationsEnabled));
  };

  useEffect(() => {
    if (!auth.loggedIn) return;

    const profile = localData.getProfile();
    const name = profile?.preferredName || auth.preferredName || "Athlete";
    notificationsStore.ensureWelcomePack(name);
    if (profile) {
      notificationsStore.ensureDailyMemberAlert({
        preferredName: profile.preferredName,
        preferredDays: profile.preferredDays,
        focusAreas: profile.focusAreas,
        sessionMinutes: profile.sessionMinutes,
        notificationsEnabled: profile.notificationsEnabled,
      });
    }
    refresh();

    const onStore = () => refresh();
    window.addEventListener(notificationsStore.eventName, onStore);
    window.addEventListener("storage", onStore);
    window.addEventListener("focus", onStore);
    return () => {
      window.removeEventListener(notificationsStore.eventName, onStore);
      window.removeEventListener("storage", onStore);
      window.removeEventListener("focus", onStore);
    };
  }, [auth.loggedIn, auth.preferredName]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (!auth.loggedIn) return null;

  const unread = items.filter((n) => !n.read).length;
  const firstName = (auth.preferredName || "Athlete").split(" ")[0];

  const setReminders = async (next: boolean) => {
    setStatus(null);
    const existing = localData.getProfile();
    if (!existing) {
      setStatus("Open Profile first so reminders know your training days.");
      return;
    }

    if (next) {
      const permission = await requestBrowserPermission();
      if (permission === "denied") {
        setRemindersOn(false);
        localData.saveProfile(normalizeProfile({ ...existing, notificationsEnabled: false }));
        setStatus("Browser blocked alerts. Allow them, then try again.");
        return;
      }
      pushBrowserNotification(
        "RepForge reminders on",
        `We’ll nudge you on: ${existing.preferredDays.join(", ") || "your training days"}.`,
        "/dashboard"
      );
      notificationsStore.syncProfileReminders({
        preferredName: existing.preferredName,
        preferredDays: existing.preferredDays,
        focusAreas: existing.focusAreas,
        sessionMinutes: existing.sessionMinutes,
        notificationsEnabled: true,
      });
    }

    setRemindersOn(next);
    localData.saveProfile(normalizeProfile({ ...existing, notificationsEnabled: next }));
    setStatus(next ? "Training reminders ON — day-of nudges are live." : "Reminders OFF.");
    refresh();
  };

  const openDetails = (n: AppNotification) => {
    notificationsStore.markRead(n.id);
    setOpen(false);
    router.push(`/notifications/${n.id}`);
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className={cn(
          "relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition",
          open
            ? "border-[rgba(200,255,60,0.55)] bg-[var(--lime-dim)] text-[var(--lime)]"
            : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--lime)] hover:border-[rgba(200,255,60,0.35)]"
        )}
        aria-label={unread ? `${unread} unread training alerts` : "Training alerts"}
        aria-expanded={open}
        title="Training alerts"
        onClick={() => {
          setOpen((v) => !v);
          setStatus(null);
        }}
      >
        <Bell size={17} aria-hidden />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[1.15rem] h-[1.15rem] px-1 rounded-full bg-[var(--lime)] text-black text-[10px] font-bold flex items-center justify-center ring-2 ring-[var(--bg)]">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2.5 w-[min(23.5rem,calc(100vw-1.25rem))] rounded-[1.35rem] border border-[rgba(200,255,60,0.22)] bg-[var(--bg-card)] shadow-[0_28px_70px_rgba(0,0,0,0.55)] z-[70] overflow-hidden">
          <div
            className="px-4 pt-4 pb-3 border-b border-[var(--border)] space-y-3"
            style={{
              background:
                "linear-gradient(145deg, rgba(200,255,60,0.12), transparent 55%), linear-gradient(180deg, rgba(46,230,255,0.06), transparent)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="section-eyebrow !mb-1">Training alerts</p>
                <p className="font-semibold text-[0.95rem] leading-tight truncate">
                  Stay ready, {firstName}
                </p>
                <p className="text-[11px] text-[var(--text-dim)] mt-1 leading-relaxed">
                  Reminders, fuel tips, and next moves for your week.
                </p>
              </div>
              <div className="shrink-0 rounded-xl border border-[var(--border)] bg-[var(--bg)]/70 px-2.5 py-2 text-center min-w-[3.4rem]">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-dim)]">New</p>
                <p className="display-title text-xl text-[var(--lime)] leading-none">{unread}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]/55 px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--text)]">Training day nudges</p>
                <p className="text-[10px] text-[var(--text-dim)]">
                  {remindersOn ? "On for your preferred days" : "Off — turn on to stay consistent"}
                </p>
              </div>
              <ToggleSwitch
                checked={remindersOn}
                onChange={(v) => void setReminders(v)}
                label="Enable training day reminders"
              />
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              <QuickAction
                href="/workouts/timer"
                icon={<Timer size={15} />}
                label="Train"
                onClick={() => setOpen(false)}
              />
              <QuickAction
                href="/nutrition"
                icon={<Salad size={15} />}
                label="Fuel"
                onClick={() => setOpen(false)}
              />
              <QuickAction
                href="/progress"
                icon={<Flame size={15} />}
                label="Progress"
                onClick={() => setOpen(false)}
              />
              <QuickAction
                href="/settings"
                icon={<Settings2 size={15} />}
                label="Settings"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>

          {status && (
            <p className="px-4 py-2.5 text-xs text-[var(--cyan)] border-b border-[var(--border)] bg-[var(--bg-elevated)]/40">
              {status}
            </p>
          )}

          <div className="max-h-[19rem] overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-5 py-8 text-center space-y-3">
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--lime-dim)] text-[var(--lime)]">
                  <Dumbbell size={22} aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-sm mb-1">Your training inbox is clear</p>
                  <p className="text-xs text-[var(--text-dim)] leading-relaxed max-w-[16rem] mx-auto">
                    Set training days in Profile, then turn on nudges above for day-of reminders.
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="inline-flex text-[var(--lime)] hover:underline text-xs font-semibold"
                  onClick={() => setOpen(false)}
                >
                  Open profile →
                </Link>
              </div>
            ) : (
              <ul>
                {items.map((n) => (
                  <li key={n.id} className="border-b border-[var(--border)] last:border-0">
                    <button
                      type="button"
                      className={cn(
                        "w-full text-left px-3.5 py-3.5 hover:bg-[var(--bg-elevated)] transition flex gap-3",
                        !n.read && "bg-[rgba(200,255,60,0.06)]"
                      )}
                      onClick={() => openDetails(n)}
                    >
                      <KindIcon kind={n.kind} unread={!n.read} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <KindPill kind={n.kind} />
                          {!n.read && (
                            <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--lime)]">
                              New
                            </span>
                          )}
                          <span className="ml-auto text-[10px] text-[var(--text-dim)] shrink-0">
                            {relativeTime(n.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm font-semibold mb-0.5 text-[var(--text)] leading-snug">
                          {n.title}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                          {n.body}
                        </p>
                        <p className="text-[11px] font-medium text-[var(--cyan)] mt-1.5">
                          {n.href ? "Take action →" : "View details →"}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-t border-[var(--border)] bg-[var(--bg)]/40 text-xs">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text)] transition"
              onClick={() => {
                notificationsStore.markAllRead();
                refresh();
              }}
            >
              <CheckCheck size={14} aria-hidden />
              Mark all read
            </button>
            <Link
              href="/settings"
              className="text-[var(--cyan)] hover:underline"
              onClick={() => setOpen(false)}
            >
              Alert settings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString();
}

function KindIcon({
  kind,
  unread,
}: {
  kind?: AppNotification["kind"];
  unread: boolean;
}) {
  const icon =
    kind === "reminder" ? (
      <Timer size={15} aria-hidden />
    ) : kind === "tip" ? (
      <Salad size={15} aria-hidden />
    ) : kind === "workout" ? (
      <Dumbbell size={15} aria-hidden />
    ) : (
      <Zap size={15} aria-hidden />
    );

  return (
    <span
      className={cn(
        "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
        unread
          ? "border-[rgba(200,255,60,0.35)] bg-[var(--lime-dim)] text-[var(--lime)]"
          : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)]"
      )}
    >
      {icon}
    </span>
  );
}

function KindPill({ kind }: { kind?: AppNotification["kind"] }) {
  const label =
    kind === "reminder"
      ? "Reminder"
      : kind === "tip"
        ? "Fuel tip"
        : kind === "workout"
          ? "Workout"
          : "Update";
  return (
    <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-dim)]">
      {label}
    </span>
  );
}

function QuickAction({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex flex-col items-center justify-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg)]/60 py-2.5 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--lime)] hover:border-[rgba(200,255,60,0.4)] hover:bg-[var(--lime-dim)]/40 transition"
    >
      <span className="text-[var(--lime)]">{icon}</span>
      {label}
    </Link>
  );
}
