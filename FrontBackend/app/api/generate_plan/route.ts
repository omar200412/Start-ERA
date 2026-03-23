import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// ─── BUDGET ANALYSIS ─────────────────────────────────────────────────────────

function parseBudget(capital: string): number {
  if (!capital) return 0;
  // Remove all non-numeric characters except dots and commas
  let s = capital
    .replace(/[₺$€£¥]/g, "")
    .replace(/[^\d.,]/g, " ")
    .trim();
  // Handle "1.500.000" (Turkish dot-thousands) → "1500000"
  // Handle "1,500,000" (English comma-thousands) → "1500000"
  // Handle "1.5" (decimal) → "1.5"
  const parts = s.match(/[\d]+/g);
  if (!parts || parts.length === 0) return 0;
  if (parts.length === 1) return parseFloat(parts[0]);
  // Multiple parts: likely thousands separators → join them
  return parseFloat(parts.join(""));
}

type IdeaType = "physical_high" | "physical_mid" | "digital" | "service";

function classifyIdea(idea: string): IdeaType {
  const t = (idea || "").toLowerCase();

  const physicalHigh = [
    "kafe","cafe","coffee shop","kahvehane","kahve","restoran","restaurant","lokal",
    "fabrika","factory","otel","hotel","bar","pub","disko","nightclub",
    "market","süpermarket","supermarket","mağaza","dükkan","store","shop","boutique",
    "gym","spor salonu","fitness","fırın","bakery","pastane","eczane","pharmacy",
    "hastane","klinik","clinic","araba","otomobil","vehicle","araç","fabrika",
    "üretim","manufacturing","çiftlik","farm","tarım"
  ];
  const physicalMid = [
    "stant","stand","seyyar","küçük dükkan","atölye","workshop","kuaför",
    "berber","barber","güzellik salonu","beauty salon","temizlik şirketi"
  ];
  const digital = [
    "app","uygulama","website","web site","web sitesi","platform","saas",
    "yazılım","software","e-ticaret","ecommerce","e-commerce","online store",
    "online mağaza","dijital","digital","mobil","mobile","oyun","game",
    "blog","içerik","content","youtube","podcast","sosyal medya","social media",
    "dropshipping","affiliate","nft","kripto","crypto","api","bot"
  ];
  const service = [
    "danışman","consultant","freelance","serbest","koçluk","coaching",
    "eğitim","training","öğretmen","teacher","ders","teaching","tercüme",
    "translation","tasarım","design","grafik","graphic","fotoğraf","photo",
    "video","editing","yazarlık","writing","muhasebe","accounting","hukuk","law"
  ];

  if (physicalHigh.some(w => t.includes(w))) return "physical_high";
  if (digital.some(w => t.includes(w))) return "digital";
  if (service.some(w => t.includes(w))) return "service";
  if (physicalMid.some(w => t.includes(w))) return "physical_mid";
  // Default: assume physical mid
  return "physical_mid";
}

// Minimum viable budget in TRY (Turkish Lira)
const MIN_TRY: Record<IdeaType, number> = {
  physical_high: 500_000,  // Cafe, restaurant, store — realistic 2024 Turkey
  physical_mid:  50_000,   // Small stand, workshop
  digital:       5_000,    // Hosting, domain, tools, freelancer
  service:       1_000,    // Almost zero cost
};

interface FeasibilityResult {
  ratio: number;          // budget / min_required
  maxScore: number;       // Hard cap for ALL scores
  feasible: boolean;
  budgetTRY: number;
  minRequiredTRY: number;
  ideaType: IdeaType;
}

function analyzeFeasibility(capital: string, idea: string): FeasibilityResult {
  const budget = parseBudget(capital);
  const ideaType = classifyIdea(idea);
  const minRequired = MIN_TRY[ideaType];

  // If budget is 0 (unparseable or not given), treat as very low
  const effectiveBudget = budget === 0 ? 0 : budget;
  const ratio = minRequired === 0 ? 1 : effectiveBudget / minRequired;

  let maxScore: number;
  let feasible: boolean;

  if (ratio <= 0.01) {
    maxScore = 2;
    feasible = false;
  } else if (ratio <= 0.05) {
    maxScore = 2;
    feasible = false;
  } else if (ratio <= 0.15) {
    maxScore = 3;
    feasible = false;
  } else if (ratio <= 0.35) {
    maxScore = 4;
    feasible = false;
  } else if (ratio <= 0.60) {
    maxScore = 6;
    feasible = true; // marginal
  } else if (ratio <= 0.85) {
    maxScore = 7;
    feasible = true;
  } else {
    maxScore = 10; // no cap
    feasible = true;
  }

  return { ratio, maxScore, feasible, budgetTRY: effectiveBudget, minRequiredTRY: minRequired, ideaType };
}

function enforceScoreCap(scores: Record<string, number>, cap: number): Record<string, number> {
  const result: Record<string, number> = {};
  for (const key of Object.keys(scores)) {
    result[key] = Math.min(scores[key], cap);
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idea, capital, skills, strategy, management, language } = body;

    if (!apiKey) {
      return NextResponse.json({ detail: "API Key Missing" }, { status: 503 });
    }

    // ── Step 1: Analyze feasibility BEFORE calling AI ──────────────────────
    const feasibility = analyzeFeasibility(capital || "", idea || "");
    const { maxScore, feasible, budgetTRY, minRequiredTRY, ideaType } = feasibility;

    // Build a feasibility context string to inject into prompt
    const feasibilityContext = feasible
      ? `Budget analysis: This budget (${budgetTRY} TRY) covers approximately ${Math.round(feasibility.ratio * 100)}% of the minimum required (${minRequiredTRY} TRY) for a ${ideaType} business. It is tight but potentially viable.`
      : `BUDGET ALERT: This budget (${budgetTRY} TRY) is only ${Math.round(feasibility.ratio * 100)}% of the minimum required (${minRequiredTRY} TRY) for a ${ideaType} business. This is financially IMPOSSIBLE to execute. Say this clearly. Score cap is ${maxScore}/10 for all dimensions.`;

    const langInstruction =
      language === "tr" ? "Respond entirely in Turkish." :
      language === "ar" ? "Respond entirely in Arabic." :
      "Respond entirely in English.";

    const prompt = `You are a ruthless but constructive startup analyst. ${langInstruction}

IDEA: ${idea}
BUDGET: ${capital}
SKILLS: ${skills}
GOALS: ${strategy}
MANAGEMENT: ${management}

SYSTEM NOTE (non-negotiable): ${feasibilityContext}

Write an honest analysis. ${!feasible ? "This startup CANNOT be launched with this budget. State this clearly and provide concrete alternatives the person can do with their actual budget." : "Be constructive but realistic about the challenges."}

Return ONLY this JSON (no markdown, no extra text):
{
  "scores": {
    "solution": <1-${maxScore}>,
    "problem": <1-${maxScore}>,
    "features": <1-${maxScore}>,
    "market": <1-${maxScore}>,
    "revenue": <1-${maxScore}>,
    "competition": <1-${maxScore}>,
    "risk": <1-${maxScore}>
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

      // ── Step 2: Clamp AI scores to 1-10 ───────────────────────────────────
      for (const key of keys) {
        const val = Number(parsed.scores[key]);
        parsed.scores[key] = isNaN(val) ? 3 : Math.min(10, Math.max(1, Math.round(val)));
      }

      // ── Step 3: HARD ENFORCE our calculated cap — AI cannot override this ─
      parsed.scores = enforceScoreCap(parsed.scores, maxScore);

      // ── Step 4: Recalculate overall as true average ───────────────────────
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