export type NutrientPillar = {
  id: string;
  title: string;
  short: string;
  detail: string;
  nigerianSources: string[];
};

export type NigerianPlate = {
  id: string;
  title: string;
  when: string;
  plate: string;
  why: string;
  tip: string;
};

export type ConsistencyStory = {
  id: string;
  name: string;
  startedAs: string;
  gained: string;
  lesson: string;
  sourceLabel: string;
  sourceUrl: string;
};

export const nutrientPillars: NutrientPillar[] = [
  {
    id: "protein",
    title: "Protein — rebuild",
    short: "Repairs muscle after training.",
    detail:
      "Every hard session creates tiny muscle stress. Protein is the raw material your body uses to rebuild stronger. Aim to put a clear protein food in each main meal — not only on “gym days.”",
    nigerianSources: [
      "Eggs",
      "Beans / moi-moi / akara",
      "Titus, sardine, catfish, dry fish",
      "Chicken, turkey, gizzard",
      "Groundnuts, milk (if you tolerate it)",
    ],
  },
  {
    id: "carbs",
    title: "Carbs — fuel",
    short: "Energy for training and recovery.",
    detail:
      "Without enough carbs, workouts feel heavy and the body may burn protein for energy instead of using it to build. Nigerian staples already give strong carb options — the skill is portion and pairing with protein and vegetables.",
    nigerianSources: [
      "Rice, yam, plantain",
      "Sweet potato, oats",
      "Garri / eba, fufu, semo (in sensible portions)",
      "Pap with a protein side",
    ],
  },
  {
    id: "fats",
    title: "Fats — hormones",
    short: "Support hormones and long energy.",
    detail:
      "Healthy fats help hormone balance and vitamin absorption. Use them wisely: cook with moderate oil, add egusi, avocado, or groundnuts — not endless deep-fry every day.",
    nigerianSources: [
      "Egusi (melon seed)",
      "Groundnuts / peanut sauce",
      "Avocado when affordable",
      "Palm oil or groundnut oil in moderation",
    ],
  },
  {
    id: "plants",
    title: "Veg & fruit — defence",
    short: "Vitamins, fibre, and recovery support.",
    detail:
      "Ugu, spinach, okra, tomatoes, oranges, and bananas are not “extra.” They support digestion, blood health, and the daily recovery that keeps you training instead of always feeling drained.",
    nigerianSources: [
      "Ugu, spinach, waterleaf",
      "Okra, tomatoes, peppers",
      "Orange, banana, pawpaw when in season",
      "Garden egg, cucumber",
    ],
  },
  {
    id: "water",
    title: "Water — performance",
    short: "Hydration keeps strength and focus.",
    detail:
      "Dehydration feels like weakness and headache. Drink water through the day, more on hot days and after training. Soft drinks are not a recovery plan.",
    nigerianSources: ["Plain water", "Coconut water occasionally", "Avoid replacing meals with sugary drinks"],
  },
];

export const nigerianPlates: NigerianPlate[] = [
  {
    id: "breakfast",
    title: "Morning fuel",
    when: "Breakfast",
    plate: "Eggs + yam or oats · or akara/moi-moi + pap · add tomato/pepper sauce",
    why: "Starts protein early so you are not empty before work or training.",
    tip: "If money is tight: 2 eggs + leftover yam still beats bread + soft drink.",
  },
  {
    id: "lunch",
    title: "Workday plate",
    when: "Lunch",
    plate: "Beans + plantain + fish · or rice + chicken/fish + ugu · or egusi + swallow + fish",
    why: "Protein + carbs + greens keep energy steady through the afternoon.",
    tip: "Cook a pot of beans or soup on Sunday — portion for 2–3 days to save fuel and cash.",
  },
  {
    id: "post",
    title: "After training",
    when: "Within ~2 hours of workout",
    plate: "Eggs + plantain · or moi-moi + milk · or rice + fish · or beans + sardine",
    why: "Carbs refill energy stores; protein starts repair while you still have appetite.",
    tip: "You do not need imported whey. Local protein done consistently beats expensive powder used once a week.",
  },
  {
    id: "dinner",
    title: "Night recovery",
    when: "Dinner",
    plate: "Okra or efo riro with fish + moderate swallow · or yam + egg sauce + vegetables",
    why: "Supports overnight repair. Keep portions honest if you train late and sleep soon after.",
    tip: "Finish eating early enough to sleep well — sleep is also “nutrition” for muscle and immunity.",
  },
];

export const budgetRules = [
  {
    title: "Market first, supermarket second",
    body: "Eggs, beans, frozen titus, dry fish, and seasonal greens from the open market usually stretch farther than imported “fitspo” snacks.",
  },
  {
    title: "One pot, many days",
    body: "Egusi, beans, or pepper soup cooked once can feed several training days. Consistency dies when every meal is a fresh expensive cook.",
  },
  {
    title: "Protein in every main meal",
    body: "Even a small fish, 2 eggs, or a solid scoop of beans counts. Empty carbs alone keep you full but soft.",
  },
  {
    title: "Health over hype",
    body: "Nigeria’s prices and power situation are real. Still protect your body: water, sleep, movement, and local food done well matter more than perfect Instagram plates.",
  },
];

export const consistencyStories: ConsistencyStory[] = [
  {
    id: "dauda",
    name: "Samson Dauda",
    startedAs: "Lagos-born athlete who shifted into bodybuilding after seeing Mr. Olympia in 2013 — not overnight fame.",
    gained: "Years of shows, setbacks, and return trips to the stage. In 2024 he became Mr. Olympia — the first Nigerian-born winner — after more than a decade of work.",
    lesson:
      "From first contest (2014) to the Sandow (2024) was patience. Titles are public; the quiet years of training and eating were private.",
    sourceLabel: "BusinessDay / THEWILL",
    sourceUrl: "https://businessday.ng/news/article/road-to-gold-samson-daudas-journey-to-mr-olympia-2024/",
  },
  {
    id: "wisdom",
    name: "Wisdom Azubuike",
    startedAs: "Nigerian student who was mocked for his size and decided during the 2020 lockdown to run, then lift — first for health and self-respect.",
    gained: "Transformed his body, built discipline that spilled into business, and moved toward competitive bodybuilding.",
    lesson:
      "He did not begin as a “pro.” He began as someone tired of how he felt. Consistency turned a lockdown decision into a lifestyle.",
    sourceLabel: "The Guardian Nigeria",
    sourceUrl: "https://guardian.ng/sport/from-fat-to-fit-wisdom-azubuike-sets-sights-on-bodybuilding-gold/",
  },
  {
    id: "awodibu",
    name: "Blessing Awodibu",
    startedAs: "Bullied as a skinny African teenager; started lifting at 14 for strength and self-protection, not a trophy.",
    gained: "Built a world-class physique and career through years of training and serious attention to food — often many meals a day when bulking.",
    lesson:
      "He is clear: gym work without food research fails. Nutrition is not optional — and for many Africans, learning local food strategy matters as much as lifting.",
    sourceLabel: "Punch Nigeria",
    sourceUrl:
      "https://punchng.com/i-started-pumping-weights-at-14-when-i-was-bullied-as-skinny-boy-blessing-awodibu-us-based-nigerian-bodybuilder/",
  },
];

export const healthBenefits = [
  {
    title: "Stronger day-to-day defence",
    body: "Research linking regular moderate activity to immune health finds roughly ~31% lower risk of community-acquired infections in more active people, plus better markers of immune readiness. That does not mean you never fall sick — it means a trained, well-fed body is usually better prepared.",
  },
  {
    title: "Fewer “down days” when you train smart",
    body: "Trials of near-daily moderate exercise often show about 40–50% fewer days of upper-respiratory symptoms versus sitting still. Show up consistently, sleep, eat, and avoid destroying yourself with no recovery.",
  },
  {
    title: "Food feeds the defence system",
    body: "Immune cells need protein, vitamins, and minerals. Beans, eggs, fish, ugu, fruits, and clean water are practical Nigerian tools. Soft drinks and skipped meals starve recovery.",
  },
  {
    title: "Consistency beats crisis mode",
    body: "One week of perfect eating cannot outwork months of neglect. The people you admire stacked ordinary days. Your body system changes on that same rule — training + food + rest, repeated.",
  },
];
