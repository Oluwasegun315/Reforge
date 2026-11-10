import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "/exercises",
    "/workouts",
    "/workouts/timer",
    "/nutrition",
    "/beginners",
    "/dashboard",
    "/progress",
    "/profile",
    "/settings",
    "/auth/signin",
    "/auth/signup",
  ];

  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/auth") ? 0.5 : 0.8,
  }));
}
