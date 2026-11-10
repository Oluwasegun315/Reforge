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
  story:
    "Life in Nigeria is not always easy. Many of us grow up surrounded by stress, long days, and food or habits that are not kind to our health. I built RepForge so people like me — and anyone who wants better — can still choose a healthier path: simple exercise that helps us look good, feel stronger, and stay fit on a daily basis, without needing an expensive gym membership just to begin.",
} as const;

export const SITE_DESCRIPTION =
  "RepForge is a free-first fitness and bodybuilding companion founded by Idowu Elijah Oluwasegun. Built for adults 18+ in Nigeria and worldwide — exercise demos, workout plans, Nigerian nutrition tips, a smart timer, and day-by-day progress tracking.";

export const SITE_KEYWORDS = [
  "RepForge",
  "Idowu Elijah Oluwasegun",
  "IDOWU ELIJAH OLUWASEGUN",
  "fitness app Nigeria",
  "bodybuilding Nigeria",
  "workout planner",
  "Nigerian nutrition",
  "home gym workouts",
  "beginner fitness",
  "exercise library",
  "workout timer",
  "progress tracking",
  "Lagos fitness",
  "RepForge founder",
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
