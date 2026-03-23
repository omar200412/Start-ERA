import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// ─── SERVER-SIDE SCORE CORRECTION ────────────────────────────────────────────
// We don't rely on AI to follow its own scoring rules.
// Instead, we detect budget infeasibility ourselves and enforce it in code.

function extractBudgetNumber(capital: string): number {
  // Remove currency symbols and words, extract the first number found
  const cleaned = capital.replace(/[₺$€£¥,]/g, "").replace(/[a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, " ");
  const match = cleaned.match(/[\d]+(?:[.,]\d+)*/);
  if (!match) return 0;
  return parseFloat(match[0].replace(",", "."));
}

function detectIdeaCategory(idea: string): "physical_high" | "physical_low" | "digital" | "service" {
  const lower = idea.toLowerCase();
  // High-cost physical businesses
  const highCost = ["kafe","cafe","coffee","restoran","restaurant","fabrika","factory","market","mağaza","store","shop","otel","hotel","bar","pub","gym","spor salonu","fırın","bakery","eczane","pharmacy","hastane","hospital","araba","car","vehicle","araç"];
  // Low-cost physical
  const lowCost = ["stant","stand","seyyar","seyyar","market tezgah"];
  // Digital
  const digital = ["app","uygulama","website","web site","platform","saas","yazılım","software","e-ticaret","ecommerce","online","dijital","digital","mobil","mobile","oyun","game"];
  // Service
  const service = ["danışman","consultant","freelance","hizmet","service","eğitim","training","koçluk","coaching","temizlik","cleaning","taşımacılık","logistics"];

  if (highCost.some(w => lower.includes(w))) return "physical_high";
  if (digital.some(w => lower.includes(w))) return "digital";
  if (service.some(w => lower.includes(w))) return "service";
  if (lowCost.some(w => lower.includes(w))) return "physical_low";
  return "physical_low";
}

// Minimum viable budget thresholds (in TL equivalent roughly)
const MIN_BUDGETS: Record<string, number> = {
  physical_high: 150000, // 150K TL minimum for a cafe/restaurant/store
  physical_low:  5000,
  digital:       2000,   // Hosting, domain, tools
  service:       500,    // Almost zero cost
};

function correctScores(
  scores: Record<string, number>,
  capital: string,
  idea: string
): Record<string, number> {
  const budget = extractBudgetNumber(capital);
  const category = detectIdeaCategory(idea);
  const minRequired = MIN_BUDGETS[category];

  // If budget is 0 (couldn't parse) or clearly symbolic (< 1% of minimum), apply max correction
  if (budget === 0 || budget < minRequired * 0.01) {
    // Completely impossible — cap everything at 2
    return Object.fromEntries(Object.keys(scores).map(k => [k, Math.min(scores[k], 2)]));
  }

  // Calculate feasibility ratio (how much of minimum budget they have)
  const ratio = budget / minRequired;

  if (ratio < 0.05) {
    // < 5% of needed budget → cap at 2
    const cap = 2;
    return Object.fromEntries(Object.keys(scores).map(k => [k, Math.min(scores[k], cap)]));
  }
  if (ratio < 0.20) {
    // < 20% of needed budget → cap at 3
    const cap = 3;
    return Object.fromEntries(Object.keys(scores).map(k => [k, Math.min(scores[k], cap)]));
  }
  if (ratio < 0.50) {
    // < 50% of needed budget → cap at 5
    // But allow market/problem to stay higher since the IDEA might be good
    return {
      ...scores,
      revenue:     Math.min(scores.revenue, 4),
      risk:        Math.min(scores.risk, 4),
      solution:    Math.min(scores.solution, 5),
      features:    Math.min(scores.features, 5),
      competition: Math.min(scores.competition, 5),
    };
  }
  if (ratio < 0.80) {
    // 50-80% of needed budget → slightly constrain
    return {
      ...scores,
      revenue: Math.min(scores.revenue, 6),
      risk:    Math.min(scores.risk, 5),
    };
  }

  // Budget is >= 80% of minimum → trust AI scores as-is
  return scores;
}
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idea, capital, skills, strategy, management, language } = body;

    if (!apiKey) {
      return NextResponse.json({ detail: "API Key Missing" }, { status: 503 });
    }

    const langInstruction =
      language === "tr" ? "Respond entirely in Turkish." :
      language === "ar" ? "Respond entirely in Arabic." :
      "Respond entirely in English.";

    // Short, clear prompt — no contradictions
    const prompt = `You are a ruthless but constructive startup analyst. ${langInstruction}

IDEA: ${idea}
BUDGET: ${capital}
SKILLS: ${skills}
GOALS: ${strategy}
MANAGEMENT: ${management}

Evaluate this startup honestly. Score based on EXECUTION feasibility with THIS specific budget and skills — not the idea in theory.

If the budget cannot realistically cover startup costs, say so clearly in the plan and give low scores.
Always end with concrete alternatives the person can do with their actual budget.

Return ONLY this JSON (no markdown):
{
  "scores": {
    "solution": <1-10>,
    "problem": <1-10>,
    "features": <1-10>,
    "market": <1-10>,
    "revenue": <1-10>,
    "competition": <1-10>,
    "risk": <1-10>
  },
  "plan": [
    {"title": "1. GENEL DEĞERLENDİRME", "content": "..."},
    {"title": "2. PAZAR VE REKABETÇİ ANALİZ", "content": "..."},
    {"title": "3. FİNANSAL GERÇEKLİK KONTROLÜ", "content": "..."},
    {"title": "4. YAPICI ALTERNATİFLER VE YOL HARİTASI", "content": "..."}
  ]
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Strip markdown fences
    text = text.replace(/^```json\s*/m, "").replace(/^```\s*/m, "").replace(/\s*```$/m, "").trim();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try { parsed = JSON.parse(jsonMatch[0]); }
        catch { return NextResponse.json({ plan: text, scores: null }, { status: 200 }); }
      } else {
        return NextResponse.json({ plan: text, scores: null }, { status: 200 });
      }
    }

    if (parsed.scores) {
      const keys = ["solution", "problem", "features", "market", "revenue", "competition", "risk"];

      // Step 1: Clamp AI scores to 1-10
      for (const key of keys) {
        const val = Number(parsed.scores[key]);
        parsed.scores[key] = isNaN(val) ? 5 : Math.min(10, Math.max(1, Math.round(val)));
      }

      // Step 2: Apply server-side budget correction (this is the real enforcement)
      parsed.scores = correctScores(parsed.scores, capital || "", idea || "");

      // Step 3: Recalculate true overall average
      const vals = keys.map(k => parsed.scores[k]);
      parsed.scores.overall =
        Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
    }

    return NextResponse.json(
      { plan: JSON.stringify(parsed.plan), scores: parsed.scores || null },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Generate Plan Error:", error);
    return NextResponse.json(
      { detail: String(error?.message || "Server Error") },
      { status: 500 }
    );
  }
}