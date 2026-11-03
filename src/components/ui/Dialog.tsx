"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export function Dialog({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg card-surface p-5 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 id="dialog-title" className="text-xl font-semibold">
            {title}
          </h2>
          <Button variant="ghost" aria-label="Close" onClick={onClose} className="!min-h-0 !p-2">
            <X size={18} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
