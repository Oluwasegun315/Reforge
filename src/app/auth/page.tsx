import { redirect } from "next/navigation";

/** Default auth entry — send people to the visible sign-up form. */
export default function AuthIndexPage() {
  redirect("/auth/signup");
}
