"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Dumbbell, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { useAuth } from "@/components/auth/AuthProvider";
import { signOutUser } from "@/lib/auth-session";

const guestLinks = [
  { href: "/exercises", label: "Exercises" },
  { href: "/workouts", label: "Workouts" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/workouts/timer", label: "Timer" },
];

const memberLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/exercises", label: "Exercises" },
  { href: "/workouts", label: "Workouts" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/workouts/timer", label: "Timer" },
  { href: "/progress", label: "Progress" },
];

export function Navbar() {
  const pathname = usePathname();
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const inside = auth.loggedIn && Boolean(auth.preferredName);
  const links = inside ? memberLinks : guestLinks;

  const logout = () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setOpen(false);
    void signOutUser();
    window.location.assign("/");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur-md",
        inside
          ? "border-[rgba(200,255,60,0.28)] bg-[var(--nav-blur)]"
          : "border-[var(--border)] bg-[var(--nav-blur)]"
      )}
    >
      <div className="container-page flex items-center gap-2 h-14 sm:h-16 md:h-[4.25rem]">
        <Link
          href="/"
          prefetch
          className="flex items-center gap-2 font-bold text-lg tracking-tight min-w-0 shrink"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--lime)] text-black">
            <Dumbbell size={18} aria-hidden />
          </span>
          <span className="display-title text-lg sm:text-xl normal-case tracking-tight truncate">
            RepForge
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 mx-auto" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-[var(--lime)] bg-[var(--lime-dim)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0 ml-auto">
          <ThemeToggle />
          {inside && <NotificationBell />}
          {inside && auth.preferredName ? (
            <UserMenu preferredName={auth.preferredName} photoUrl={auth.photoUrl} />
          ) : (
            <>
              <Link href="/auth/signin" prefetch className="btn-ghost !min-h-0 !py-2">
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                prefetch
                className="btn-primary !min-h-0 !py-2 !px-4 text-sm"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Phone / tablet: icon theme + menu only — no cramped Sign in / full toggle */}
        <div className="flex lg:hidden items-center gap-1.5 shrink-0 ml-auto">
          <ThemeToggle compact />
          {inside && <NotificationBell />}
          {inside && auth.preferredName ? (
            <UserMenu preferredName={auth.preferredName} photoUrl={auth.photoUrl} />
          ) : null}
          <Button
            variant="ghost"
            className="!min-h-0 !p-2 shrink-0"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="lg:hidden border-t border-[var(--border)] bg-[var(--bg)] max-h-[min(70vh,28rem)] overflow-y-auto"
        >
          <nav className="container-page py-3 flex flex-col gap-1" aria-label="Mobile">
            {inside && auth.preferredName ? (
              <p className="px-3 py-2 mb-1 rounded-lg text-xs font-semibold text-[var(--lime)] bg-[var(--lime-dim)]">
                {auth.preferredName}
              </p>
            ) : null}
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-3 rounded-lg font-medium touch-manipulation",
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "text-[var(--lime)] bg-[var(--lime-dim)]"
                    : "text-[var(--text-muted)]"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[var(--border)]">
              {inside ? (
                <>
                  <Link
                    href="/profile"
                    prefetch
                    className="btn-secondary"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    prefetch
                    className="btn-secondary"
                    onClick={() => setOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    disabled={loggingOut}
                    className="btn-secondary !justify-center gap-2 text-[var(--danger)]"
                    onClick={logout}
                  >
                    <LogOut size={16} aria-hidden />
                    {loggingOut ? "Signing out…" : "Log out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    prefetch
                    className="btn-secondary"
                    onClick={() => setOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    prefetch
                    className="btn-primary"
                    onClick={() => setOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
