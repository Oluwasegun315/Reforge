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
      <div className="container-page flex items-center justify-between h-16 md:h-[4.25rem]">
        <Link href="/" prefetch className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lime)] text-black">
            <Dumbbell size={18} aria-hidden />
          </span>
          <span className="display-title text-xl normal-case tracking-tight">RepForge</span>
          <span
            className={cn(
              "hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              inside
                ? "bg-[var(--lime)] text-black"
                : "border border-[var(--border-strong)] text-[var(--text-dim)]"
            )}
          >
            {inside ? "Inside" : "Guest"}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
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

        <div className="hidden lg:flex items-center gap-2">
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

        <div className="flex lg:hidden items-center gap-1">
          <ThemeToggle />
          {inside && <NotificationBell />}
          {inside && auth.preferredName ? (
            <UserMenu preferredName={auth.preferredName} photoUrl={auth.photoUrl} />
          ) : (
            <Link
              href="/auth/signin"
              prefetch
              className="btn-ghost !min-h-0 !py-2 !px-3 text-sm"
            >
              Sign in
            </Link>
          )}
          <Button
            variant="ghost"
            className="!min-h-0 !p-2"
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
        <div id="mobile-nav" className="lg:hidden border-t border-[var(--border)] bg-[var(--bg)]">
          <nav className="container-page py-4 flex flex-col gap-1" aria-label="Mobile">
            <p
              className={cn(
                "px-3 py-2 mb-1 rounded-lg text-xs font-semibold uppercase tracking-wider",
                inside ? "bg-[var(--lime-dim)] text-[var(--lime)]" : "text-[var(--text-dim)]"
              )}
            >
              {inside ? `Inside · ${auth.preferredName}` : "Guest mode"}
            </p>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-3 rounded-lg font-medium",
                  pathname === link.href
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
