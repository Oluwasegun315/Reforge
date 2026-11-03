/**
 * Browser speech synthesis helpers.
 * Works only while the tab is open and when the browser supports SpeechSynthesis.
 */

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, onEnd?: () => void): void {
  if (!canSpeak()) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    onEnd?.();
  };
  utterance.onend = finish;
  utterance.onerror = finish;
  window.speechSynthesis.speak(utterance);
  // Fallback if onend never fires (word-count based, keeps alarm after speech)
  const approxMs = Math.min(25_000, Math.max(5_000, text.split(/\s+/).length * 420));
  window.setTimeout(finish, approxMs);
}

export function stopSpeaking(): void {
  if (canSpeak()) {
    window.speechSynthesis.cancel();
  }
}

/** Repeats an announcement until stopped or maxDurationMs is reached. */
export function speakRepeating(
  text: string,
  maxDurationMs = 60_000,
  gapMs = 2500
): () => void {
  let stopped = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const started = Date.now();

  const loop = () => {
    if (stopped) return;
    if (Date.now() - started >= maxDurationMs) {
      stopSpeaking();
      return;
    }
    speak(text, () => {
      if (stopped) return;
      timeoutId = setTimeout(loop, gapMs);
    });
  };

  loop();

  return () => {
    stopped = true;
    if (timeoutId) clearTimeout(timeoutId);
    stopSpeaking();
  };
}
