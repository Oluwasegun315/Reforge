"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { useAuth } from "@/components/auth/AuthProvider";

const APP_PREFIXES = [
  "/dashboard",
  "/exercises",
  "/workouts",
  "/nutrition",
  "/progress",
  "/profile",
  "/settings",
];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
  const inside = auth.loggedIn && Boolean(auth.preferredName);
  const isAppSurface = APP_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const compactChrome = inside && isAppSurface;
  const showMobileTabs = inside;

  return (
    <>
      <Navbar />
      <main
        id="main"
        className={
          showMobileTabs
            ? "pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] lg:pb-8"
            : undefined
        }
      >
        {children}
      </main>
      {!compactChrome && <Footer />}
      <MobileTabBar />
    </>
  );
}
