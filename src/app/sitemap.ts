import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** Public pages only — private app routes stay out of Google’s index. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }[] = [
    { path: "", changeFrequency: "daily", priority: 1 },
    { path: "/exercises", changeFrequency: "weekly", priority: 0.9 },
    { path: "/workouts", changeFrequency: "weekly", priority: 0.9 },
    { path: "/nutrition", changeFrequency: "weekly", priority: 0.85 },
    { path: "/beginners", changeFrequency: "weekly", priority: 0.85 },
    { path: "/workouts/timer", changeFrequency: "monthly", priority: 0.7 },
    { path: "/auth/signup", changeFrequency: "monthly", priority: 0.6 },
    { path: "/auth/signin", changeFrequency: "monthly", priority: 0.5 },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
