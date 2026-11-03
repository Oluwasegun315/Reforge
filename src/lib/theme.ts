export type ThemeMode = "dark" | "light";

const KEY = "repforge.theme";
export const THEME_EVENT = "repforge:theme";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const raw = localStorage.getItem(KEY);
  return raw === "light" ? "light" : "dark";
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(mode);
  root.setAttribute("data-theme", mode);
  root.style.colorScheme = mode;
  // Force paint so theme vars refresh even if a parent style was sticky
  root.style.backgroundColor = "";
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    // ignore private-mode write failures
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: mode }));
}

export function toggleTheme(): ThemeMode {
  const next: ThemeMode = getStoredTheme() === "light" ? "dark" : "light";
  applyTheme(next);
  return next;
}
