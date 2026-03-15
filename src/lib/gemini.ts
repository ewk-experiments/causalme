import { GoogleGenerativeAI } from "@google/generative-ai";
import { DayData, CausalEdge, VARIABLES } from "./demo-data";

export async function discoverCausalEdges(apiKey: string, data: DayData[]): Promise<CausalEdge[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const summary = data.map(d => 
    `${d.date}: sleep=${d.sleep}h mood=${d.mood} exercise=${d.exercise}min caffeine=${d.caffeine}mg productivity=${d.productivity} screenTime=${d.screenTime}h social=${d.social}h spending=$${d.spending} stress=${d.stress}`
  ).join("\n");

  const prompt = `Given this personal data over ${data.length} days, identify likely causal relationships.

DATA:
${summary}

For each causal relationship, provide a JSON array of objects with:
- cause: variable name (sleep, mood, exercise, caffeine, productivity, screenTime, social, spending, stress)
- effect: variable name  
- strength: estimated strength 0 to 1 (positive correlation) or -1 to 0 (negative)
- lagDays: estimated lag in days (0 = same day)
- reasoning: one-sentence explanation

Return ONLY a JSON array, no markdown, no explanation. Find at least 10 relationships.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  
  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Failed to parse AI response");
  
  const edges: Array<{cause: string; effect: string; strength: number; lagDays: number; reasoning: string}> = JSON.parse(jsonMatch[0]);
  
  return edges.map((e, i) => ({
    id: `ai_${Date.now()}_${i}`,
    cause: e.cause,
    effect: e.effect,
    strength: Math.max(-1, Math.min(1, e.strength)),
    lagDays: e.lagDays || 0,
    reasoning: e.reasoning,
    confirmed: false,
  }));
}

export async function runWhatIfSimulation(
  apiKey: string,
  variable: string,
  changeAmount: number,
  edges: CausalEdge[],
  data: DayData[]
): Promise<Record<string, { change: number; reasoning: string }>> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const varInfo = VARIABLES.find(v => v.id === variable);
  const recentData = data.slice(-7);
  const recentSummary = recentData.map(d => 
    `${d.date}: sleep=${d.sleep}h mood=${d.mood} exercise=${d.exercise}min caffeine=${d.caffeine}mg productivity=${d.productivity} screenTime=${d.screenTime}h social=${d.social}h spending=$${d.spending} stress=${d.stress}`
  ).join("\n");
  
  const edgeSummary = edges.filter(e => e.confirmed).map(e => 
    `${e.cause} → ${e.effect} (strength: ${e.strength}, lag: ${e.lagDays}d)`
  ).join("\n");

  const prompt = `Based on this person's recent data and confirmed causal model, predict what happens if they change "${varInfo?.name || variable}" by ${changeAmount > 0 ? '+' : ''}${changeAmount}%.

RECENT DATA (last 7 days):
${recentSummary}

CAUSAL MODEL:
${edgeSummary}

For each affected variable (sleep, mood, exercise, caffeine, productivity, screenTime, social, spending, stress), predict the percentage change.

Return ONLY a JSON object mapping variable names to objects with "change" (number, percentage) and "reasoning" (string). Only include variables that would be meaningfully affected (>2% change). Example:
{"mood": {"change": 15, "reasoning": "Better sleep improves mood"}}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse AI response");
  
  return JSON.parse(jsonMatch[0]);
}

export async function generateInsights(
  apiKey: string,
  data: DayData[],
  edges: CausalEdge[]
): Promise<Array<{ content: string; type: string; impact: "high" | "medium" | "low"; nodes: string[] }>> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const summary = data.map(d => 
    `${d.date}(${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.dayOfWeek]}): sleep=${d.sleep}h mood=${d.mood} exercise=${d.exercise}min caffeine=${d.caffeine}mg productivity=${d.productivity} screen=${d.screenTime}h social=${d.social}h spending=$${d.spending} stress=${d.stress}`
  ).join("\n");

  const prompt = `Analyze this person's life data and generate 6 specific, actionable insights. Be specific with numbers and patterns.

DATA:
${summary}

Return a JSON array of objects with:
- content: the insight text (specific, with numbers)
- type: "pattern" | "warning" | "opportunity"  
- impact: "high" | "medium" | "low"
- nodes: array of variable names involved

Return ONLY the JSON array.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Failed to parse AI response");
  
  return JSON.parse(jsonMatch[0]);
}
