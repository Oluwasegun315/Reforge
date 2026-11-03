"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bot, Pause, Play, Square, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { localData } from "@/lib/storage";
import { formatTimeLabel, suggestDuration } from "@/lib/workout-generator";
import { speak, stopSpeaking, canSpeak } from "@/lib/speech";
import { playAlarmLoop, stopAlarm } from "@/lib/alarm";
import { COACH_NAME, coachGreeting } from "@/lib/coach";
import { clamp } from "@/lib/utils";
import { logCompletedSession } from "@/lib/progress";

type TimerStatus = "idle" | "running" | "paused" | "ended";

function parseTimeInput(value: string): Date | null {
  if (!value) return null;
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function toTimeInputValue(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatRemaining(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

const ALERT_MAX_MS = 60_000;

export function WorkoutTimer() {
  const plan = useMemo(() => localData.getActivePlan(), []);
  const defaultMinutes = plan?.durationMinutes ?? 30;
  const suggestions = suggestDuration(plan?.level ?? "beginner", 90);

  const now = new Date();
  const defaultEnd = new Date(now.getTime() + defaultMinutes * 60_000);

  const [startInput, setStartInput] = useState(toTimeInputValue(now));
  const [endInput, setEndInput] = useState(toTimeInputValue(defaultEnd));
  const [customMinutes, setCustomMinutes] = useState(defaultMinutes);
  const [remaining, setRemaining] = useState(defaultMinutes * 60);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [alerting, setAlerting] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const endAtRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopAlertRef = useRef<(() => void) | null>(null);
  const plannedSecRef = useRef(defaultMinutes * 60);
  const loggedRef = useRef(false);

  useEffect(() => {
    setSpeechSupported(canSpeak());
  }, []);

  const clearTick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stopAlert = useCallback(() => {
    stopAlertRef.current?.();
    stopAlertRef.current = null;
    stopSpeaking();
    stopAlarm();
    setAlerting(false);
  }, []);

  useEffect(() => () => {
    clearTick();
    stopAlert();
  }, [stopAlert]);

  const applyDurationMinutes = (minutes: number) => {
    const safe = clamp(minutes, 1, 180);
    setCustomMinutes(safe);
    const start = parseTimeInput(startInput) ?? new Date();
    const end = new Date(start.getTime() + safe * 60_000);
    setEndInput(toTimeInputValue(end));
    if (status === "idle") setRemaining(safe * 60);
  };

  const syncFromStartEnd = (startVal: string, endVal: string) => {
    const start = parseTimeInput(startVal);
    const end = parseTimeInput(endVal);
    if (!start || !end) return;
    let endDate = end;
    if (endDate <= start) {
      endDate = new Date(endDate.getTime() + 24 * 60 * 60_000);
    }
    const mins = Math.max(1, Math.round((endDate.getTime() - start.getTime()) / 60_000));
    setCustomMinutes(mins);
    if (status === "idle") setRemaining(mins * 60);
  };

  const startAlert = () => {
    setAlerting(true);
    const text = `${COACH_NAME} here. Your workout time is up. Great job showing up today. The alarm will ring next. Press Stop Alert to silence it.`;
    setMessage(text);

    const beginRinging = () => {
      const stopRing = playAlarmLoop(ALERT_MAX_MS, 5);
      stopAlertRef.current = () => {
        stopRing();
        stopAlarm();
      };
      window.setTimeout(() => {
        stopAlert();
      }, ALERT_MAX_MS);
    };

    if (canSpeak()) {
      speak(text, beginRinging);
    } else {
      beginRinging();
    }
  };

  const persistSession = (durationMinutes: number, note?: string) => {
    if (loggedRef.current) return;
    if (durationMinutes < 1) return;
    loggedRef.current = true;
    const record = logCompletedSession({
      durationMinutes,
      notes: note,
    });
    setMessage(
      `${COACH_NAME} logged ${record.durationMinutes} min — ${record.name}. Check Progress for today’s work.`
    );
  };

  const tick = () => {
    const endAt = endAtRef.current;
    if (!endAt) return;
    const left = Math.ceil((endAt - Date.now()) / 1000);
    if (left <= 0) {
      setRemaining(0);
      setStatus("ended");
      clearTick();
      const doneMin = Math.max(1, Math.round(plannedSecRef.current / 60));
      persistSession(doneMin, "Completed full timer session");
      startAlert();
      return;
    }
    setRemaining(left);
  };

  const handleStart = () => {
    stopAlert();
    const start = parseTimeInput(startInput) ?? new Date();
    const end = parseTimeInput(endInput);
    let durationSec = customMinutes * 60;

    if (end) {
      let endDate = end;
      const startDate = start;
      if (endDate <= startDate) {
        endDate = new Date(endDate.getTime() + 24 * 60 * 60_000);
      }
      // If start time is still in the future today, count full planned duration from now for v1 reliability while app is open
      durationSec = Math.max(60, Math.round((endDate.getTime() - Date.now()) / 1000));
      // Prefer custom duration if user set end relative to start in the past/near now
      if (durationSec > customMinutes * 60 + 120) {
        durationSec = customMinutes * 60;
      }
    }

    plannedSecRef.current = durationSec;
    loggedRef.current = false;
    endAtRef.current = Date.now() + durationSec * 1000;
    setRemaining(durationSec);
    setStatus("running");
    setMessage(null);
    clearTick();
    intervalRef.current = setInterval(tick, 250);

    const announceStart = parseTimeInput(startInput) ?? new Date();
    const announceEnd =
      parseTimeInput(endInput) ??
      new Date(announceStart.getTime() + customMinutes * 60_000);

    const confirmation = `${coachGreeting()} Your workout with me, ${COACH_NAME}, is scheduled to start at ${formatTimeLabel(announceStart)} and finish at ${formatTimeLabel(announceEnd)}. I will talk to you when time is up, then ring the alarm.`;
    setMessage(confirmation);
    speak(confirmation);
  };

  const handlePause = () => {
    if (status !== "running") return;
    clearTick();
    const left = endAtRef.current
      ? Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000))
      : remaining;
    setRemaining(left);
    endAtRef.current = null;
    setStatus("paused");
  };

  const handleResume = () => {
    if (status !== "paused") return;
    endAtRef.current = Date.now() + remaining * 1000;
    setStatus("running");
    clearTick();
    intervalRef.current = setInterval(tick, 250);
  };

  const handleStop = () => {
    const elapsedSec = Math.max(0, plannedSecRef.current - remaining);
    const elapsedMin = Math.round(elapsedSec / 60);
    clearTick();
    stopAlert();
    endAtRef.current = null;
    setStatus("idle");
    setRemaining(customMinutes * 60);
    if (elapsedMin >= 1) {
      persistSession(elapsedMin, "Stopped early — partial session counted");
      speak(
        `${COACH_NAME} stopped the timer and logged ${elapsedMin} minutes to your progress.`
      );
    } else {
      const stoppedMsg = `${COACH_NAME} stopped the timer. Great effort showing up today.`;
      setMessage(stoppedMsg);
      speak(stoppedMsg);
    }
  };

  const hearSchedule = () => {
    const start = parseTimeInput(startInput) ?? new Date();
    const end =
      parseTimeInput(endInput) ?? new Date(start.getTime() + customMinutes * 60_000);
    const text = `${coachGreeting()} Your workout is set for ${customMinutes} minutes, from ${formatTimeLabel(start)} to ${formatTimeLabel(end)}. Press Start when you are ready. When time ends, I will speak first, then ring a loud alarm until you press Stop Alert.`;
    setMessage(text);
    speak(text, () => {
      // Short confirmation rings after the coach finishes talking
      playAlarmLoop(3_500, 3);
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="space-y-4 border-[rgba(200,255,60,0.28)]">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--lime-dim)] text-[var(--lime)]">
            <Bot size={22} aria-hidden />
          </span>
          <div>
            <p className="section-eyebrow mb-1">Talking AI coach · {COACH_NAME}</p>
            <h2 className="text-xl font-semibold mb-1">
              {COACH_NAME} speaks your time and alarm
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Set your start time, end time, or duration. {COACH_NAME} confirms the schedule out
              loud, then rings a clear alarm after speaking when the session ends. Keep this page
              open for reliable audio.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={hearSchedule} disabled={!speechSupported}>
            <Volume2 size={16} />
            Hear my schedule
          </Button>
          <Button variant="secondary" onClick={() => stopSpeaking()}>
            <VolumeX size={16} />
            Silence coach
          </Button>
        </div>
        {!speechSupported && (
          <p className="text-xs text-[var(--danger)]">
            This browser does not support spoken coach audio. Visual timer still works.
          </p>
        )}
      </Card>

      <Card className="space-y-5">
        <div>
          <p className="section-eyebrow mb-2">Session timer</p>
          <h1 className="display-title text-4xl mb-2">Workout timer</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Works reliably while this page stays open. Browsers may pause audio when the tab is
            backgrounded or the phone is locked — we do not promise continuous background alerts.
          </p>
        </div>

        {plan && (
          <p className="text-sm rounded-xl bg-[var(--lime-dim)] text-[var(--lime)] px-3 py-2">
            Active plan: <strong>{plan.name}</strong> ({plan.durationMinutes} min suggested)
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-1 text-sm">
            <span>Start time</span>
            <input
              type="time"
              className="input-field"
              value={startInput}
              onChange={(e) => {
                setStartInput(e.target.value);
                syncFromStartEnd(e.target.value, endInput);
              }}
              disabled={status === "running"}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>End time</span>
            <input
              type="time"
              className="input-field"
              value={endInput}
              onChange={(e) => {
                setEndInput(e.target.value);
                syncFromStartEnd(startInput, e.target.value);
              }}
              disabled={status === "running"}
            />
          </label>
        </div>

        <div>
          <p className="text-sm mb-2">Suggested durations</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((m) => (
              <Button
                key={m}
                variant={customMinutes === m ? "primary" : "secondary"}
                className="!min-h-0 !py-2"
                disabled={status === "running"}
                onClick={() => applyDurationMinutes(m)}
              >
                {m} min
              </Button>
            ))}
          </div>
        </div>

        <label className="grid gap-1 text-sm max-w-xs">
          <span>Custom duration (minutes)</span>
          <input
            type="number"
            min={1}
            max={180}
            className="input-field"
            value={customMinutes}
            disabled={status === "running"}
            onChange={(e) => applyDurationMinutes(Number(e.target.value) || 1)}
          />
        </label>

        <div
          className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--bg-elevated)] py-10 text-center"
          aria-live="polite"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-dim)] mb-2">
            {status === "running"
              ? "Remaining"
              : status === "paused"
                ? "Paused"
                : status === "ended"
                  ? "Time is up"
                  : "Ready"}
          </p>
          <p className="display-title text-6xl md:text-7xl text-[var(--lime)] tabular-nums">
            {formatRemaining(remaining)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {status === "idle" || status === "ended" ? (
            <Button onClick={handleStart}>
              <Play size={16} />
              Start
            </Button>
          ) : null}
          {status === "running" ? (
            <Button variant="secondary" onClick={handlePause}>
              <Pause size={16} />
              Pause
            </Button>
          ) : null}
          {status === "paused" ? (
            <Button onClick={handleResume}>
              <Play size={16} />
              Resume
            </Button>
          ) : null}
          <Button variant="secondary" onClick={handleStop}>
            <Square size={16} />
            Stop
          </Button>
          {alerting && (
            <Button variant="danger" onClick={stopAlert}>
              <VolumeX size={16} />
              Stop Alert
            </Button>
          )}
        </div>

        {!speechSupported && (
          <p className="text-xs text-[var(--text-dim)]">
            Spoken alerts are not available in this browser. Visual alerts still work.
          </p>
        )}

        {message && (
          <p className="text-sm text-[var(--text-muted)] border-l-2 border-[var(--lime)] pl-3">
            {message}
          </p>
        )}
      </Card>
    </div>
  );
}
