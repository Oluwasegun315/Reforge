import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to RepForge with Google or email.",
};

export default function SignInPage() {
  return <AuthPanel mode="signin" />;
}
