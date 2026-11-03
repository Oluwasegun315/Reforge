"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { LogOut, Settings, UserRound } from "lucide-react";
import { signOutUser } from "@/lib/auth-session";
import { cn } from "@/lib/utils";

export function UserMenu({
  preferredName,
  photoUrl,
}: {
  preferredName: string;
  photoUrl: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const initial = (preferredName || "A").slice(0, 1).toUpperCase();

  useEffect(() => {
    if (!open) return;

    // Use click (not mousedown) so menu items receive their click before unmount.
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    // Defer bind so the opening click does not immediately close the menu.
    const timer = window.setTimeout(() => {
      document.addEventListener("click", onDocClick);
      document.addEventListener("keydown", onKey);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const logout = () => {
    if (busy) return;
    setBusy(true);
    setOpen(false);
    void signOutUser();
    window.location.assign("/");
  };

  return (
    <div className="relative z-[60]" ref={ref}>
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-[rgba(200,255,60,0.35)] bg-[var(--lime-dim)] pl-1 pr-3 py-1 hover:border-[rgba(200,255,60,0.6)] transition"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="h-8 w-8 rounded-full overflow-hidden bg-[var(--bg-elevated)] flex items-center justify-center text-sm font-bold text-[var(--lime)]">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </span>
        <span className="text-sm font-medium max-w-[7rem] truncate text-[var(--text)]">
          {preferredName}
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-2xl z-[70] overflow-hidden"
        >
          <div className="px-4 py-2.5 border-b border-[var(--border)] bg-[var(--lime-dim)]">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--lime)]">
              Signed in
            </p>
            <p className="text-sm font-semibold truncate text-[var(--text)]">{preferredName}</p>
          </div>

          <button
            type="button"
            role="menuitem"
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--text)] hover:bg-[var(--bg-elevated)] text-left"
            onClick={() => go("/profile")}
          >
            <UserRound size={16} aria-hidden />
            Profile
          </button>
          <button
            type="button"
            role="menuitem"
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--text)] hover:bg-[var(--bg-elevated)] border-t border-[var(--border)] text-left"
            onClick={() => go("/settings")}
          >
            <Settings size={16} aria-hidden />
            Settings
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={busy}
            className={cn(
              "w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--danger)] hover:bg-[var(--bg-elevated)] border-t border-[var(--border)] text-left",
              busy && "opacity-60"
            )}
            onClick={logout}
          >
            <LogOut size={16} aria-hidden />
            {busy ? "Signing out…" : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}
