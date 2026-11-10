"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bell, CheckCheck, Settings2, Timer, Utensils } from "lucide-react";
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
    setStatus(next ? "Training reminders ON — you’ll get day-of nudges." : "Reminders OFF.");
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
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--lime)] hover:border-[rgba(200,255,60,0.35)] transition"
        aria-label={unread ? `${unread} unread notifications` : "Notifications"}
        aria-expanded={open}
        title="Your training alerts"
        onClick={() => {
          setOpen((v) => !v);
          setStatus(null);
        }}
      >
        <Bell size={18} aria-hidden />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-[var(--lime)] text-black text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[min(22.5rem,calc(100vw-1.5rem))] rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl z-[70] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-sm">Your alerts</p>
                <p className="text-[11px] text-[var(--text-dim)]">
                  Training reminders, tips, and next actions
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-[var(--text-dim)]">
                  {remindersOn ? "On" : "Off"}
                </span>
                <ToggleSwitch
                  checked={remindersOn}
                  onChange={(v) => void setReminders(v)}
                  label="Enable training day reminders"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <QuickAction
                href="/workouts/timer"
                icon={<Timer size={14} />}
                label="Timer"
                onClick={() => setOpen(false)}
              />
              <QuickAction
                href="/nutrition"
                icon={<Utensils size={14} />}
                label="Eat"
                onClick={() => setOpen(false)}
              />
              <QuickAction
                href="/settings"
                icon={<Settings2 size={14} />}
                label="Settings"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>

          {status && (
            <p className="px-4 py-2 text-xs text-[var(--cyan)] border-b border-[var(--border)]">
              {status}
            </p>
          )}

          <div className="max-h-72 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-6 space-y-2 text-sm text-[var(--text-muted)]">
                <p>No alerts yet.</p>
                <p className="text-xs text-[var(--text-dim)]">
                  Set your training days in Profile, then turn reminders on above.
                </p>
                <Link
                  href="/profile"
                  className="inline-flex text-[var(--cyan)] hover:underline text-xs"
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
                        "w-full text-left px-4 py-3 hover:bg-[var(--bg-elevated)] transition",
                        !n.read && "bg-[var(--lime-dim)]/35"
                      )}
                      onClick={() => openDetails(n)}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <KindPill kind={n.kind} />
                        {!n.read && (
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--lime)]">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-0.5 text-[var(--text)]">{n.title}</p>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                        {n.body}
                      </p>
                      <p className="text-[10px] text-[var(--cyan)] mt-1.5">
                        {n.href ? "Open action →" : "View details →"}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-t border-[var(--border)] text-xs">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text)]"
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
              Notification settings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function KindPill({ kind }: { kind?: AppNotification["kind"] }) {
  const label =
    kind === "reminder"
      ? "Reminder"
      : kind === "tip"
        ? "Tip"
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
      className="inline-flex flex-col items-center justify-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] py-2 text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--lime)] hover:border-[rgba(200,255,60,0.35)] transition"
    >
      <span className="text-[var(--lime)]">{icon}</span>
      {label}
    </Link>
  );
}
