import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a free RepForge account with Google or email.",
};

export default function SignUpPage() {
  return <AuthPanel mode="signup" />;
}
