"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  applyTheme,
  getStoredTheme,
  THEME_EVENT,
  type ThemeMode,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

/** Explicit Dark / Light control. Use compact on mobile headers. */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<ThemeMode | null>(null);

  useEffect(() => {
    const current = getStoredTheme();
    applyTheme(current);
    setMode(current);
    setMounted(true);
    const onTheme = (e: Event) => {
      const detail = (e as CustomEvent<ThemeMode>).detail;
      if (detail === "light" || detail === "dark") setMode(detail);
    };
    window.addEventListener(THEME_EVENT, onTheme);
    return () => window.removeEventListener(THEME_EVENT, onTheme);
  }, []);

  const setModeAndApply = (next: ThemeMode) => {
    applyTheme(next);
    setMode(next);
  };

  if (!mounted) {
    return (
      <span
        className={cn(
          "inline-flex h-9 rounded-full border border-[var(--border)] shrink-0",
          compact ? "w-9" : "w-[7.5rem]"
        )}
        aria-hidden
      />
    );
  }

  if (compact) {
    const next = mode === "dark" ? "light" : "dark";
    return (
      <button
        type="button"
        aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={mode === "dark" ? "Light mode" : "Dark mode"}
        onClick={() => setModeAndApply(next)}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text)] touch-manipulation"
      >
        {mode === "dark" ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="inline-flex items-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-0.5 shadow-sm shrink-0"
    >
      <button
        type="button"
        aria-pressed={mode === "dark"}
        aria-label="Dark mode"
        title="Switch to Dark"
        onClick={() => setModeAndApply("dark")}
        onMouseEnter={() => setHovered("dark")}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setHovered("dark")}
        onBlur={() => setHovered(null)}
        className={cn(
          "inline-flex items-center gap-1 h-8 px-2.5 rounded-full text-xs font-semibold transition-colors duration-150",
          mode === "dark"
            ? "bg-[var(--lime)] text-[#0a0a0a]"
            : hovered === "dark"
              ? "text-[var(--lime)]"
              : "text-[var(--text-muted)]"
        )}
      >
        <Moon size={13} aria-hidden />
        Dark
      </button>
      <button
        type="button"
        aria-pressed={mode === "light"}
        aria-label="Light mode"
        title="Switch to Light"
        onClick={() => setModeAndApply("light")}
        onMouseEnter={() => setHovered("light")}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setHovered("light")}
        onBlur={() => setHovered(null)}
        className={cn(
          "inline-flex items-center gap-1 h-8 px-2.5 rounded-full text-xs font-semibold transition-colors duration-150",
          mode === "light"
            ? "bg-[var(--lime)] text-[#0a0a0a]"
            : hovered === "light"
              ? "text-[var(--lime)]"
              : "text-[var(--text-muted)]"
        )}
      >
        <Sun size={13} aria-hidden />
        Light
      </button>
    </div>
  );
}
