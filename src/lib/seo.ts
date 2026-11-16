export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://oluwasegun-reforge.vercel.app";

export const SITE_NAME = "RepForge";

export const FOUNDER = {
  name: "Idowu Elijah Oluwasegun",
  formalName: "IDOWU ELIJAH OLUWASEGUN",
  role: "Founder",
  country: "Nigeria",
  city: "Lagos",
  /** Place your photo at public/images/founder.jpg */
  image: "/images/founder.jpg",
  email: "idowuoluwasegun197@gmail.com",
  phones: [
    { label: "MTN", number: "09169540998", href: "tel:+2349169540998" },
    { label: "Airtel", number: "09075288805", href: "tel:+2349075288805" },
  ],
  whatsapp: "2349169540998",
  story:
    "Life in Nigeria is not always easy. Many of us grow up surrounded by stress, long days, and food or habits that are not kind to our health. I built RepForge so people like me — and anyone who wants better — can still choose a healthier path: simple exercise that helps us look good, feel stronger, and stay fit on a daily basis, without needing an expensive gym membership just to begin.",
  driveShort:
    "Built so Nigerians can choose healthy daily exercise — look good, feel stronger, and stay fit without an expensive gym just to begin.",
} as const;

/** Distinct from Reforge.com (PM courses) and other unrelated RepForge apps. */
export const SITE_DESCRIPTION = `IDOWU ELIJAH OLUWASEGUN founded RepForge Nigeria — free fitness for adults 18+. ${FOUNDER.driveShort} Workouts, Nigerian nutrition, timer & progress.`;

export const SITE_KEYWORDS = [
  "RepForge",
  "RepForge Nigeria",
  "RepForge by Idowu Elijah Oluwasegun",
  "Idowu Elijah Oluwasegun",
  "IDOWU ELIJAH OLUWASEGUN",
  "Idowu Oluwasegun fitness",
  "RepForge fitness app",
  "RepForge Lagos",
  "oluwasegun-reforge",
  "fitness app Nigeria",
  "bodybuilding Nigeria",
  "Nigerian nutrition workouts",
  "home gym Nigeria",
  "beginner fitness Nigeria",
  "workout timer Nigeria",
  "RepForge founder",
  "RepForge founder session",
] as const;

export const SESSION_URL = `${SITE_URL}/session`;

export const SESSION_FOCUS = [
  {
    id: "beginner",
    title: "Beginner start",
    body: "Where to begin, safe form, and a simple weekly rhythm.",
  },
  {
    id: "plan",
    title: "Build your plan",
    body: "Goals, available days, home vs gym — a plan you can keep.",
  },
  {
    id: "nutrition",
    title: "Nigeria nutrition",
    body: "Local plates, budget protein, and habits that support training.",
  },
  {
    id: "consistency",
    title: "Stay consistent",
    body: "Streaks, recovery days, and how to use RepForge every week.",
  },
] as const;

export const BENEFITS = [
  {
    title: "Clear exercise demos",
    body: "Learn proper form with step-by-step cues for home or gym — no confusing jargon.",
  },
  {
    title: "Plans that fit your life",
    body: "Build routines around your goals, equipment, and available minutes.",
  },
  {
    title: "Nigeria-aware nutrition",
    body: "Budget-friendly local plates that support muscle and recovery.",
  },
  {
    title: "Honest day-by-day progress",
    body: "Timer sessions and logs update your streak and weekly activity for real.",
  },
  {
    title: "Coach voice & timer",
    body: "Schedule sessions with spoken reminders so you start and finish on time.",
  },
  {
    title: "Free-first access",
    body: "Explore as a guest, then sign in to unlock dashboard, alerts, and saved progress.",
  },
] as const;
