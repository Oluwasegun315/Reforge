/**
 * Built-in workout alarm using Web Audio API.
 * No external audio file required — clear multi-ring tone people recognize.
 */

let audioCtx: AudioContext | null = null;
let stopRequested = false;
let activeTimeouts: Array<ReturnType<typeof setTimeout>> = [];

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  return audioCtx;
}

function clearTimeouts() {
  activeTimeouts.forEach((id) => clearTimeout(id));
  activeTimeouts = [];
}

/** One sharp dual-tone ring (classic alarm feel). */
function playSingleRing(ctx: AudioContext, when: number) {
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(0.35, when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.42);

  const o1 = ctx.createOscillator();
  o1.type = "square";
  o1.frequency.setValueAtTime(880, when);
  o1.connect(gain);
  o1.start(when);
  o1.stop(when + 0.45);

  const o2 = ctx.createOscillator();
  o2.type = "square";
  o2.frequency.setValueAtTime(1174.7, when);
  o2.connect(gain);
  o2.start(when);
  o2.stop(when + 0.45);
}

/**
 * Rings the alarm a set number of times (default 8).
 * Returns a stop function.
 */
export function playAlarmBurst(rings = 8): () => void {
  stopRequested = false;
  clearTimeouts();
  const ctx = getCtx();
  if (!ctx) return () => undefined;

  void ctx.resume();
  const start = ctx.currentTime + 0.05;
  for (let i = 0; i < rings; i++) {
    if (stopRequested) break;
    playSingleRing(ctx, start + i * 0.7);
  }

  return () => {
    stopRequested = true;
    clearTimeouts();
  };
}

/**
 * Keeps ringing in bursts until stopped or maxDurationMs.
 */
export function playAlarmLoop(maxDurationMs = 45_000, ringsPerBurst = 4): () => void {
  stopRequested = false;
  clearTimeouts();
  const ctx = getCtx();
  if (!ctx) return () => undefined;

  void ctx.resume();
  const started = Date.now();
  let stopBurst: (() => void) | null = null;

  const loop = () => {
    if (stopRequested) return;
    if (Date.now() - started >= maxDurationMs) {
      stopBurst?.();
      return;
    }
    stopBurst = playAlarmBurst(ringsPerBurst);
    const id = setTimeout(loop, ringsPerBurst * 700 + 500);
    activeTimeouts.push(id);
  };

  loop();

  return () => {
    stopRequested = true;
    clearTimeouts();
    stopBurst?.();
    try {
      void ctx.suspend();
    } catch {
      /* ignore */
    }
  };
}

export function stopAlarm() {
  stopRequested = true;
  clearTimeouts();
  if (audioCtx) {
    try {
      void audioCtx.suspend();
    } catch {
      /* ignore */
    }
  }
}
