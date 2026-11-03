import type { Metadata } from "next";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { RequireAuth } from "@/components/auth/RequireAuth";

export const metadata: Metadata = {
  title: "Profile",
  description: "Update your RepForge name, photo, goals, and training preferences.",
};

export default function ProfilePage() {
  return (
    <div className="container-page py-10 md:py-14">
      <RequireAuth>
        <ProfileForm />
      </RequireAuth>
    </div>
  );
}
