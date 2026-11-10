"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Home, LineChart, Timer, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

const tabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/exercises", label: "Train", icon: Dumbbell },
  { href: "/workouts/timer", label: "Timer", icon: Timer },
  { href: "/nutrition", label: "Fuel", icon: Utensils },
  { href: "/progress", label: "Stats", icon: LineChart },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();
  const auth = useAuth();
  const inside = auth.loggedIn && Boolean(auth.preferredName);

  if (!inside) return null;

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-[var(--border)] bg-[var(--nav-blur)] backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
      aria-label="App tabs"
    >
      <ul className="grid grid-cols-5 gap-0.5 px-1 pt-1.5 pb-1.5 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href ||
            (tab.href !== "/dashboard" && pathname.startsWith(tab.href));
          const Icon = tab.icon;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                prefetch
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-xl py-2 min-h-[3.25rem] text-[10px] font-semibold tracking-wide transition",
                  active
                    ? "text-[var(--lime)] bg-[var(--lime-dim)]"
                    : "text-[var(--text-dim)] hover:text-[var(--text-muted)]"
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 2} aria-hidden />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
