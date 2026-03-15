// Generates 30 days of realistic, correlated demo data
// Uses seeded random for reproducibility

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function gaussianRandom(rng: () => number): number {
  const u1 = rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1 || 0.001)) * Math.cos(2 * Math.PI * u2);
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export interface DayData {
  date: string;
  dayOfWeek: number; // 0=Sun
  sleep: number;      // hours, 4-10
  mood: number;       // 1-10
  exercise: number;   // minutes, 0-90
  caffeine: number;   // mg, 0-400
  productivity: number; // 1-10
  screenTime: number; // hours, 2-14
  social: number;     // hours, 0-5
  spending: number;   // dollars, 10-200
  stress: number;     // 1-10
}

export interface Variable {
  id: string;
  name: string;
  domain: string;
  unit: string;
  icon: string;
  color: string;
  min: number;
  max: number;
}

export const VARIABLES: Variable[] = [
  { id: "sleep", name: "Sleep", domain: "health", unit: "hrs", icon: "🌙", color: "#818cf8", min: 4, max: 10 },
  { id: "mood", name: "Mood", domain: "mental", unit: "/10", icon: "😊", color: "#fbbf24", min: 1, max: 10 },
  { id: "exercise", name: "Exercise", domain: "health", unit: "min", icon: "💪", color: "#34d399", min: 0, max: 90 },
  { id: "caffeine", name: "Caffeine", domain: "health", unit: "mg", icon: "☕", color: "#a78bfa", min: 0, max: 400 },
  { id: "productivity", name: "Productivity", domain: "work", unit: "/10", icon: "⚡", color: "#60a5fa", min: 1, max: 10 },
  { id: "screenTime", name: "Screen Time", domain: "lifestyle", unit: "hrs", icon: "📱", color: "#f472b6", min: 2, max: 14 },
  { id: "social", name: "Social", domain: "lifestyle", unit: "hrs", icon: "👥", color: "#fb923c", min: 0, max: 5 },
  { id: "spending", name: "Spending", domain: "finance", unit: "$", icon: "💳", color: "#f87171", min: 10, max: 200 },
  { id: "stress", name: "Stress", domain: "mental", unit: "/10", icon: "😰", color: "#e879f9", min: 1, max: 10 },
];

export const DOMAIN_COLORS: Record<string, string> = {
  health: "#34d399",
  mental: "#fbbf24",
  work: "#60a5fa",
  lifestyle: "#f472b6",
  finance: "#f87171",
};

export function generateDemoData(days = 30, seed = 42): DayData[] {
  const rng = seededRandom(seed);
  const data: DayData[] = [];
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dow = date.getDay();
    const isWeekend = dow === 0 || dow === 6;
    
    const prevSleep = i > 0 ? data[i - 1].sleep : 7;
    const prevMood = i > 0 ? data[i - 1].mood : 6;
    const prevExercise = i > 0 ? data[i - 1].exercise : 30;
    const prevStress = i > 0 ? data[i - 1].stress : 5;

    // Sleep: base 7, weekends +0.8, some noise
    const sleep = clamp(
      7 + (isWeekend ? 0.8 : 0) + gaussianRandom(rng) * 1.0 - prevStress * 0.08,
      4, 10
    );

    // Exercise: 4-5 days/week, correlated with sleep
    const exerciseChance = isWeekend ? 0.5 : 0.7;
    const doesExercise = rng() < exerciseChance + (sleep - 7) * 0.1;
    const exercise = doesExercise 
      ? clamp(30 + gaussianRandom(rng) * 20 + (sleep - 7) * 5, 15, 90)
      : 0;

    // Caffeine: inversely correlated with sleep
    const caffeine = clamp(
      200 + (7 - sleep) * 40 + gaussianRandom(rng) * 60,
      0, 400
    );

    // Stress: inversely correlated with sleep and exercise
    const stress = clamp(
      5 - (sleep - 7) * 0.8 - (exercise / 90) * 1.5 + gaussianRandom(rng) * 1.2 + (isWeekend ? -1 : 0.5),
      1, 10
    );

    // Mood: correlated with sleep (+0.6), exercise (+0.4), inversely with stress
    const mood = clamp(
      6 + (sleep - 7) * 0.6 + (exercise / 90) * 2 - (stress - 5) * 0.4 + gaussianRandom(rng) * 0.8,
      1, 10
    );

    // Productivity: correlated with sleep, mood, caffeine (inverted at high levels)
    const caffeineEffect = caffeine < 200 ? caffeine / 200 * 1.5 : 1.5 - (caffeine - 200) / 200 * 1;
    const productivity = clamp(
      5 + (sleep - 7) * 0.7 + (mood - 6) * 0.5 + caffeineEffect - (stress - 5) * 0.3 + gaussianRandom(rng) * 0.7,
      1, 10
    );

    // Screen time: inversely correlated with exercise
    const screenTime = clamp(
      8 - (exercise / 90) * 4 + (stress - 5) * 0.5 + gaussianRandom(rng) * 1.5,
      2, 14
    );

    // Social: positively correlated with mood, more on weekends
    const social = clamp(
      2 + (mood - 6) * 0.3 + (isWeekend ? 1.5 : 0) + gaussianRandom(rng) * 0.8,
      0, 5
    );

    // Spending: weakly correlated with mood and stress
    const spending = clamp(
      60 + (mood - 6) * 8 + (stress - 5) * 10 + (isWeekend ? 25 : 0) + gaussianRandom(rng) * 25,
      10, 200
    );

    data.push({
      date: date.toISOString().split("T")[0],
      dayOfWeek: dow,
      sleep: Math.round(sleep * 10) / 10,
      mood: Math.round(mood * 10) / 10,
      exercise: Math.round(exercise),
      caffeine: Math.round(caffeine),
      productivity: Math.round(productivity * 10) / 10,
      screenTime: Math.round(screenTime * 10) / 10,
      social: Math.round(social * 10) / 10,
      spending: Math.round(spending),
      stress: Math.round(stress * 10) / 10,
    });
  }

  return data;
}

export interface CausalEdge {
  id: string;
  cause: string;
  effect: string;
  strength: number;  // -1 to 1
  lagDays: number;
  reasoning: string;
  confirmed: boolean;
}

// Pre-computed causal edges that match the data generation logic
export const DEFAULT_EDGES: CausalEdge[] = [
  { id: "e1", cause: "sleep", effect: "mood", strength: 0.65, lagDays: 0, reasoning: "Better sleep consistently predicts higher mood ratings the same day", confirmed: true },
  { id: "e2", cause: "sleep", effect: "exercise", strength: 0.45, lagDays: 0, reasoning: "More sleep increases likelihood and duration of exercise", confirmed: true },
  { id: "e3", cause: "sleep", effect: "productivity", strength: 0.60, lagDays: 0, reasoning: "Sleep duration has a strong causal effect on next-day productivity", confirmed: true },
  { id: "e4", cause: "sleep", effect: "caffeine", strength: -0.55, lagDays: 0, reasoning: "Less sleep drives higher caffeine consumption as compensation", confirmed: true },
  { id: "e5", cause: "sleep", effect: "stress", strength: -0.50, lagDays: 0, reasoning: "Poor sleep significantly increases stress levels", confirmed: true },
  { id: "e6", cause: "exercise", effect: "mood", strength: 0.50, lagDays: 0, reasoning: "Exercise produces endorphins and consistently improves mood", confirmed: true },
  { id: "e7", cause: "exercise", effect: "stress", strength: -0.45, lagDays: 0, reasoning: "Physical activity is an effective stress reducer", confirmed: true },
  { id: "e8", cause: "exercise", effect: "screenTime", strength: -0.40, lagDays: 0, reasoning: "Exercise time displaces screen time", confirmed: true },
  { id: "e9", cause: "stress", effect: "mood", strength: -0.55, lagDays: 0, reasoning: "High stress directly suppresses mood", confirmed: true },
  { id: "e10", cause: "stress", effect: "spending", strength: 0.35, lagDays: 0, reasoning: "Stress triggers comfort spending and impulse purchases", confirmed: true },
  { id: "e11", cause: "stress", effect: "sleep", strength: -0.30, lagDays: 0, reasoning: "High stress makes it harder to fall and stay asleep", confirmed: false },
  { id: "e12", cause: "mood", effect: "social", strength: 0.40, lagDays: 0, reasoning: "Better mood increases desire for social interaction", confirmed: true },
  { id: "e13", cause: "mood", effect: "productivity", strength: 0.45, lagDays: 0, reasoning: "Positive mood enhances focus and work output", confirmed: true },
  { id: "e14", cause: "caffeine", effect: "productivity", strength: 0.30, lagDays: 0, reasoning: "Moderate caffeine boosts focus, but high doses reduce it", confirmed: false },
  { id: "e15", cause: "caffeine", effect: "sleep", strength: -0.25, lagDays: 0, reasoning: "High caffeine intake can impair sleep quality", confirmed: false },
  { id: "e16", cause: "social", effect: "mood", strength: 0.35, lagDays: 0, reasoning: "Social connection provides mood benefits", confirmed: true },
  { id: "e17", cause: "screenTime", effect: "sleep", strength: -0.20, lagDays: 0, reasoning: "Excessive screen time before bed disrupts sleep onset", confirmed: false },
  { id: "e18", cause: "mood", effect: "spending", strength: 0.25, lagDays: 0, reasoning: "Low mood triggers retail therapy; high mood triggers celebratory spending", confirmed: false },
];

// Pre-generated insights
export const DEFAULT_INSIGHTS = [
  {
    id: "i1",
    content: "Your mood dips every Monday — this correlates with your lowest sleep nights on Sundays and highest stress from the work week starting.",
    type: "pattern",
    impact: "high" as const,
    nodes: ["mood", "sleep", "stress"],
  },
  {
    id: "i2", 
    content: "When you exercise before noon, your productivity score is 35% higher that day. Morning exercise appears to be a keystone habit for you.",
    type: "opportunity",
    impact: "high" as const,
    nodes: ["exercise", "productivity"],
  },
  {
    id: "i3",
    content: "Your caffeine intake has been creeping up over the past 2 weeks (avg 180mg → 240mg), which is degrading your sleep quality by ~12%.",
    type: "warning",
    impact: "high" as const,
    nodes: ["caffeine", "sleep"],
  },
  {
    id: "i4",
    content: "Days with 2+ hours of social time show 28% lower stress scores the following day. Social connection is protective against burnout.",
    type: "pattern",
    impact: "medium" as const,
    nodes: ["social", "stress"],
  },
  {
    id: "i5",
    content: "Your spending spikes by $45/day when stress is above 7/10. The sleep→stress→spending chain is your biggest financial leak.",
    type: "warning",
    impact: "medium" as const,
    nodes: ["stress", "spending", "sleep"],
  },
  {
    id: "i6",
    content: "Screen time over 10hrs/day predicts a 20% mood drop the next morning. You've exceeded this 4 times in the past week.",
    type: "warning",
    impact: "medium" as const,
    nodes: ["screenTime", "mood"],
  },
];
