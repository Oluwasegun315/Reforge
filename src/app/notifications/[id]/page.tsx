"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Bell, Dumbbell, Salad, Timer, Zap } from "lucide-react";
import { notificationsStore, type AppNotification } from "@/lib/notifications";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function NotificationDetailPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<AppNotification | null>(null);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    const found = notificationsStore.get(id);
    setItem(found);
    if (found) notificationsStore.markRead(id);
  }, [params]);

  if (!item) {
    return (
      <div className="container-page py-12 max-w-lg mx-auto">
        <Card className="!p-6 space-y-4 text-center">
          <h1 className="display-title text-3xl">Alert not found</h1>
          <p className="text-sm text-[var(--text-muted)]">
            This training alert may have been cleared. Open the bell for current alerts.
          </p>
          <Link href="/dashboard" className="btn-primary inline-flex">
            Back to dashboard
          </Link>
        </Card>
      </div>
    );
  }

  const kindLabel =
    item.kind === "reminder"
      ? "Training reminder"
      : item.kind === "tip"
        ? "Fuel tip"
        : item.kind === "workout"
          ? "Workout"
          : "Update";

  const Icon =
    item.kind === "reminder"
      ? Timer
      : item.kind === "tip"
        ? Salad
        : item.kind === "workout"
          ? Dumbbell
          : Zap;

  return (
    <div className="container-page py-10 md:py-14 max-w-2xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--lime)] mb-6"
      >
        <ArrowLeft size={16} aria-hidden />
        Back to training
      </Link>

      <Card
        className="!p-6 md:!p-8 space-y-5 border-[rgba(200,255,60,0.22)]"
        style={{
          background:
            "linear-gradient(160deg, rgba(200,255,60,0.08), transparent 45%), var(--bg-card)",
        }}
      >
        <div className="flex items-start gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--lime-dim)] text-[var(--lime)] border border-[rgba(200,255,60,0.3)]">
            <Icon size={22} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-[var(--text-dim)] mb-1">
              {kindLabel} · {new Date(item.createdAt).toLocaleString()}
            </p>
            <h1 className="display-title text-3xl md:text-4xl leading-none">{item.title}</h1>
          </div>
        </div>

        <p className="text-[var(--text-muted)] leading-relaxed text-base">{item.body}</p>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)]/55 p-4 md:p-5">
          <p className="text-xs uppercase tracking-wider text-[var(--lime)] font-semibold mb-2 inline-flex items-center gap-1.5">
            <Bell size={12} aria-hidden />
            Coach note
          </p>
          <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">
            {item.detail || item.body}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {item.href && (
            <Link href={item.href} className="btn-primary">
              Take action
            </Link>
          )}
          <Link href="/workouts/timer" className="btn-secondary">
            Start timer
          </Link>
          <Button
            variant="ghost"
            onClick={() => {
              notificationsStore.markRead(item.id);
              window.history.back();
            }}
          >
            Done
          </Button>
        </div>
      </Card>
    </div>
  );
}
