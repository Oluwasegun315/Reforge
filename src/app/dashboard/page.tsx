import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { RequireAuth } from "@/components/auth/RequireAuth";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your RepForge training overview — today's workout, consistency, and quick links.",
};

export default function DashboardPage() {
  return (
    <div className="container-page py-6 sm:py-8 md:py-12">
      <RequireAuth>
        <DashboardView />
      </RequireAuth>
    </div>
  );
}
