export interface CausalNode {
  id: string;
  label: string;
  color: string;
  value: number; // current value 0-100
  unit: string;
  icon: string;
}

export interface CausalEdge {
  source: string;
  target: string;
  weight: number; // -1 to 1 (strength & direction)
  label?: string;
}

export const NODES: CausalNode[] = [
  { id: "sleep", label: "Sleep", color: "#6366f1", value: 68, unit: "hrs", icon: "🌙" },
  { id: "exercise", label: "Exercise", color: "#10b981", value: 55, unit: "min", icon: "💪" },
  { id: "mood", label: "Mood", color: "#f59e0b", value: 72, unit: "%", icon: "😊" },
  { id: "productivity", label: "Productivity", color: "#3b82f6", value: 65, unit: "%", icon: "⚡" },
  { id: "spending", label: "Spending", color: "#ef4444", value: 45, unit: "$", icon: "💳" },
  { id: "social", label: "Social", color: "#ec4899", value: 58, unit: "hrs", icon: "👥" },
  { id: "energy", label: "Energy", color: "#f97316", value: 60, unit: "%", icon: "🔋" },
];

export const EDGES: CausalEdge[] = [
  { source: "sleep", target: "mood", weight: 0.72, label: "+72%" },
  { source: "sleep", target: "energy", weight: 0.85, label: "+85%" },
  { source: "sleep", target: "productivity", weight: 0.65, label: "+65%" },
  { source: "exercise", target: "mood", weight: 0.58, label: "+58%" },
  { source: "exercise", target: "energy", weight: 0.70, label: "+70%" },
  { source: "exercise", target: "sleep", weight: 0.45, label: "+45%" },
  { source: "mood", target: "productivity", weight: 0.60, label: "+60%" },
  { source: "mood", target: "social", weight: 0.50, label: "+50%" },
  { source: "mood", target: "spending", weight: -0.35, label: "-35%" },
  { source: "energy", target: "productivity", weight: 0.75, label: "+75%" },
  { source: "energy", target: "exercise", weight: 0.40, label: "+40%" },
  { source: "social", target: "mood", weight: 0.55, label: "+55%" },
  { source: "social", target: "spending", weight: 0.30, label: "+30%" },
  { source: "productivity", target: "mood", weight: 0.35, label: "+35%" },
  { source: "spending", target: "mood", weight: -0.25, label: "-25%" },
];

export interface Insight {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  type: "discovery" | "warning" | "opportunity";
  nodes: string[];
  date: string;
}

export const INSIGHTS: Insight[] = [
  {
    id: "1",
    title: "Tuesday meetings tank your Wednesdays",
    description: "Your Tuesday afternoon meetings cause a 20% productivity drop on Wednesdays. Consider moving them to Thursday or making them async.",
    impact: "high",
    type: "discovery",
    nodes: ["productivity", "mood"],
    date: "2026-03-13",
  },
  {
    id: "2",
    title: "Morning exercise is 2.3x more impactful",
    description: "Exercise before noon has 2.3x more impact on your mood than evening exercise. Your best mood scores follow morning workouts.",
    impact: "high",
    type: "opportunity",
    nodes: ["exercise", "mood"],
    date: "2026-03-12",
  },
  {
    id: "3",
    title: "Sleep debt is compounding",
    description: "You've averaged 6.2hrs of sleep this week. Each hour below 7 reduces next-day productivity by 12% and increases impulse spending by 8%.",
    impact: "high",
    type: "warning",
    nodes: ["sleep", "productivity", "spending"],
    date: "2026-03-12",
  },
  {
    id: "4",
    title: "Social time boosts your creative output",
    description: "Days with 2+ hours of social interaction show 35% higher creative productivity the following day.",
    impact: "medium",
    type: "discovery",
    nodes: ["social", "productivity"],
    date: "2026-03-11",
  },
  {
    id: "5",
    title: "Weekend spending pattern detected",
    description: "Low mood on Fridays correlates with 40% higher weekend spending. Your mood-spending loop is strongest on weekends.",
    impact: "medium",
    type: "warning",
    nodes: ["mood", "spending"],
    date: "2026-03-10",
  },
  {
    id: "6",
    title: "Energy peaks at 10am",
    description: "Your energy consistently peaks between 10-11am. Schedule your most important work in this window for 28% more output.",
    impact: "medium",
    type: "opportunity",
    nodes: ["energy", "productivity"],
    date: "2026-03-09",
  },
];

export const TIMELINE_DATA = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 2, i + 1);
  const base = {
    date: date.toISOString().split("T")[0],
    sleep: 5.5 + Math.random() * 3,
    exercise: Math.random() * 60 + 10,
    mood: 50 + Math.random() * 40,
    productivity: 40 + Math.random() * 50,
    spending: 10 + Math.random() * 80,
    social: Math.random() * 4,
    energy: 40 + Math.random() * 50,
  };
  return {
    ...base,
    sleep: Math.round(base.sleep * 10) / 10,
    exercise: Math.round(base.exercise),
    mood: Math.round(base.mood),
    productivity: Math.round(base.productivity),
    spending: Math.round(base.spending),
    social: Math.round(base.social * 10) / 10,
    energy: Math.round(base.energy),
  };
});

export const LIFE_EVENTS = [
  { date: "2026-03-05", label: "Started new project", type: "work" },
  { date: "2026-03-10", label: "Weekend trip", type: "social" },
  { date: "2026-03-14", label: "Gym streak: 7 days", type: "health" },
  { date: "2026-03-18", label: "Big presentation", type: "work" },
  { date: "2026-03-22", label: "Concert night", type: "social" },
  { date: "2026-03-25", label: "Sleep experiment start", type: "health" },
];
