"use client";

import { cn } from "@/lib/utils";

export function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onChange(!checked);
      }}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors",
        checked
          ? "bg-[var(--lime)] border-[var(--lime)]"
          : "bg-[var(--bg-elevated)] border-[var(--border-strong)]",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[var(--bg-card)] shadow transition-transform duration-200",
          checked ? "left-[calc(100%-1.35rem)]" : "left-0.5"
        )}
      />
    </button>
  );
}
