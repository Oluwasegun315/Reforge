"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/** Password input with show / hide eye control. */
export function PasswordField({
  value,
  onChange,
  autoComplete,
  placeholder = "At least 6 characters",
  id,
  required = true,
  minLength = 6,
  label = "Password",
}: {
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  id?: string;
  required?: boolean;
  minLength?: number;
  label?: string;
}) {
  const [visible, setVisible] = useState(false);
  const fieldId = id ?? "password";

  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <span className="relative block">
        <input
          id={fieldId}
          className="input-field !pr-12"
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--lime)] hover:bg-[var(--lime-dim)] transition"
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
        </button>
      </span>
    </label>
  );
}
