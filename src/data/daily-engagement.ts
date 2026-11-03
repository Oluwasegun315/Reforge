const QUOTES = [
  "Consistency is louder than motivation. Show up.",
  "Your future body is built by today’s ordinary session.",
  "Train hard. Eat local. Sleep honest.",
  "One more controlled set beats one more excuse.",
  "Champions are beginners who refused to quit.",
  "Health first — the body you protect is the body that carries you.",
];

const MISSIONS = [
  { title: "15-minute movement", body: "Do any workout with the timer — even a short one counts.", href: "/workouts/timer" },
  { title: "Protein at your next meal", body: "Add eggs, beans, or fish. Open the Nigeria nutrition guide.", href: "/nutrition" },
  { title: "Learn one exercise", body: "Open the library and study form for one move.", href: "/exercises" },
  { title: "Log how you feel", body: "After training, note it in Progress so streaks stay honest.", href: "/progress" },
];

const TIPS = [
  "Beans + plantain + egg is a budget plate that still rebuilds muscle.",
  "Drink water before soft drinks — dehydration feels like weakness.",
  "Sleep is training too. Guard it like a session.",
  "Preferred training days only work if you protect them on your calendar.",
];

function dayIndex(length: number) {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const day = Math.floor(diff / 86_400_000);
  return day % length;
}

export function getDailyEngagement() {
  return {
    quote: QUOTES[dayIndex(QUOTES.length)],
    mission: MISSIONS[dayIndex(MISSIONS.length)],
    tip: TIPS[dayIndex(TIPS.length)],
  };
}

export function computeStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const unique = [...new Set(dates.map((d) => d.slice(0, 10)))].sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let cursor = today;

  for (const iso of unique) {
    const d = new Date(iso);
    d.setHours(0, 0, 0, 0);
    const diffDays = Math.round((cursor.getTime() - d.getTime()) / 86_400_000);
    if (diffDays === 0 || diffDays === 1) {
      streak += 1;
      cursor = d;
      cursor.setDate(cursor.getDate() - 1);
    } else if (streak === 0 && diffDays > 1) {
      break;
    } else {
      break;
    }
  }
  return streak;
}
