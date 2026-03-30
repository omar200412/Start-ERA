import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// ── Parse budget: handles "5.000.000", "5,000,000", "5000000", "5M", "5 milyon" etc ──
function parseBudget(capital: string): number {
  if (!capital) return 0;
  const lower = capital.toLowerCase();

  // Handle written words first
  let multiplier = 1;
  if (lower.includes("milyar") || lower.includes("billion") || lower.includes("miliار")) multiplier = 1_000_000_000;
  else if (lower.includes("milyon") || lower.includes("million") || lower.includes("مليون")) multiplier = 1_000_000;
  else if (lower.includes("bin") || lower.includes("thousand") || lower.includes("ألف")) multiplier = 1_000;
  // Handle M/K/B suffixes
  else if (/\d\s*b\b/i.test(lower)) multiplier = 1_000_000_000;
  else if (/\d\s*m\b/i.test(lower)) multiplier = 1_000_000;
  else if (/\d\s*k\b/i.test(lower)) multiplier = 1_000;

  // Extract the numeric part
  // Remove currency symbols
  let s = lower.replace(/[₺$€£¥]/g, "");

  // Detect format: if dots used as thousand separators (e.g. "5.000.000")
  // vs decimal (e.g. "5.5")
  // Rule: if there are multiple dots OR dot followed by 3 digits at end → thousand separator
  const dotCount = (s.match(/\./g) || []).length;
  const commaCount = (s.match(/,/g) || []).length;

  if (dotCount > 1) {
    // "5.000.000" → remove dots
    s = s.replace(/\./g, "");
  } else if (dotCount === 1 && /\.\d{3}/.test(s) && commaCount === 0) {
    // "5.000" → thousand separator
    s = s.replace(/\./g, "");
  } else if (commaCount > 1) {
    // "5,000,000" → remove commas
    s = s.replace(/,/g, "");
  } else if (commaCount === 1 && /,\d{3}/.test(s) && dotCount === 0) {
    // "5,000" → thousand separator
    s = s.replace(/,/g, "");
  } else {
    // treat remaining dot/comma as decimal
    s = s.replace(/,/, ".");
  }

  const match = s.match(/[\d]+(?:\.\d+)?/);
  if (!match) return 0;
  return parseFloat(match[0]) * multiplier;
}

type IdeaType = "physical_high" | "physical_mid" | "digital" | "service";

function classifyIdea(idea: string): IdeaType {
  const t = (idea || "").toLowerCase();
  const physicalHigh = ["kafe","cafe","coffee","kahvehane","restoran","restaurant","fabrika","factory","otel","hotel","bar","pub","market","süpermarket","supermarket","mağaza","dükkan","store","shop","boutique","gym","spor salonu","fırın","bakery","pastane","eczane","pharmacy","hastane","klinik","clinic","araba","otomobil","araç","üretim","manufacturing","çiftlik","farm","tarım"];
  const digital = ["app","uygulama","website","web site","web sitesi","platform","saas","yazılım","software","e-ticaret","ecommerce","e-commerce","online","dijital","digital","mobil","mobile","oyun","game","blog","youtube","podcast","sosyal medya","social media","dropshipping","affiliate","kripto","crypto","api","bot","it ","it company","tech","teknoloji","technology","startup","girişim"];
  const service = ["danışman","consultant","freelance","serbest","koçluk","coaching","eğitim","training","öğretmen","ders","tercüme","translation","tasarım","design","grafik","graphic","fotoğraf","photo","video","editing","yazarlık","writing","muhasebe","accounting","hukuk","law","temizlik","cleaning"];
  if (physicalHigh.some(w => t.includes(w))) return "physical_high";
  if (digital.some(w => t.includes(w))) return "digital";
  if (service.some(w => t.includes(w))) return "service";
  return "physical_mid";
}

const MIN_TRY: Record<IdeaType, number> = {
  physical_high: 500_000,
  physical_mid:  50_000,
  digital:       5_000,
  service:       1_000,
};

function getScoreCap(capital: string, idea: string): { cap: number; ratio: number; budgetOk: boolean } {
  const budget = parseBudget(capital);
  const ideaType = classifyIdea(idea);
  const minRequired = MIN_TRY[ideaType];
  if (budget === 0) return { cap: 10, ratio: 1, budgetOk: true }; // can't parse → don't penalize
  const ratio = budget / minRequired;
  if (ratio <= 0.03) return { cap: 4, ratio, budgetOk: false };
  if (ratio <= 0.10) return { cap: 5, ratio, budgetOk: false };
  if (ratio <= 0.30) return { cap: 6, ratio, budgetOk: false };
  if (ratio <= 0.70) return { cap: 8, ratio, budgetOk: true };
  return { cap: 10, ratio, budgetOk: true }; // budget is adequate → no cap
}

function enforceScoreCap(scores: Record<string, number>, cap: number): Record<string, number> {
  // Never cap "risk" — high risk score means LOW risk which is always good
  const result: Record<string, number> = {};
  for (const key of Object.keys(scores)) {
    result[key] = key === "risk" ? scores[key] : Math.min(scores[key], cap);
  }
  return result;
}

function stripFences(text: string): string {
  return text
    .replace(/^```json\s*/gm, "")
    .replace(/^```\s*/gm, "")
    .replace(/\s*```\s*$/gm, "")
    .trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idea, capital, skills, strategy, management, language } = body;

    if (!apiKey) return NextResponse.json({ detail: "API Key Missing" }, { status: 503 });

    const { cap, ratio, budgetOk } = getScoreCap(capital || "", idea || "");
    const budgetNum = parseBudget(capital || "");
    const ideaType = classifyIdea(idea || "");
    const minRequired = MIN_TRY[ideaType];

    const langInstruction =
      language === "tr" ? "Write your ENTIRE response in Turkish only. Use Turkish for all text including titles, content and any analysis." :
      language === "ar" ? "Write your ENTIRE response in Arabic only." :
      "Write your ENTIRE response in English only.";

    // Budget context injected into prompt
    const budgetContext = !budgetOk
      ? `BUDGET NOTE: The stated budget (${budgetNum.toLocaleString()} TRY) is only ${Math.round(ratio * 100)}% of the typical minimum (${minRequired.toLocaleString()} TRY) needed for this type of business. Be honest about this gap but still be constructive. Suggest what they CAN do with this budget.`
      : budgetNum > 0
      ? `BUDGET NOTE: The budget (${budgetNum.toLocaleString()} TRY) is ${ratio >= 2 ? "well above" : "sufficient for"} the typical minimum for this business type. Focus your critique on the idea clarity, market, and execution — not the budget.`
      : "";

    const prompt = `You are a candid but supportive startup mentor — like a good angel investor who tells the truth but always wants to help. You give honest feedback without being cruel. ${langInstruction}

${budgetContext}

STARTUP TO EVALUATE:
Idea: ${idea}
Budget: ${capital}
Skills: ${skills}
Goals: ${strategy}
Management: ${management}

SCORING RULES — read carefully before scoring:
- If the budget is adequate AND the idea has market potential → most scores should be 6-8.
- If the budget is strong AND the idea is well-defined → scores can reach 8-10.
- A broad idea like "IT company" or "e-commerce" with good funding → score 5-6 (not lower). It's a valid starting point.
- Only go below 4 when there is a SPECIFIC concrete problem (market doesn't exist, illegal, budget is truly zero).
- NEVER score any dimension below 3 unless the idea is physically or legally impossible.
- Vagueness should lower ONLY the "solution" and "features" scores, not market/revenue/risk.
- A well-funded entrepreneur who hasn't fully defined their niche deserves encouragement, not punishment.

SCORING GUIDE per dimension (1-10):
- 8-10: Strong. Reward good budget + clear idea with real market.
- 6-7: Solid. Good money OR good idea, with gaps to address.
- 4-5: Needs more definition — say specifically what to clarify/fix.
- 3: One specific serious problem — still constructive.
- 1-2: Only if truly impossible or illegal. Extremely rare.

TONE: Balanced, honest, and encouraging. Acknowledge what's strong, then explain what needs work and how to improve it.

Return ONLY valid JSON with no markdown backticks, no extra text before or after the JSON:

{"scores":{"solution":NUMBER,"problem":NUMBER,"features":NUMBER,"market":NUMBER,"revenue":NUMBER,"competition":NUMBER,"risk":NUMBER},"plan":[{"title":"1. GENEL DEĞERLENDİRME","content":"WRITE IN THE SPECIFIED LANGUAGE"},{"title":"2. PAZAR VE REKABETÇİ ANALİZ","content":"WRITE IN THE SPECIFIED LANGUAGE"},{"title":"3. FİNANSAL GERÇEKLİK KONTROLÜ","content":"WRITE IN THE SPECIFIED LANGUAGE"},{"title":"4. YAPICI ALTERNATİFLER VE YOL HARİTASI","content":"WRITE IN THE SPECIFIED LANGUAGE"}]}

Scores must be integers 1-10. A funded idea with real market potential should score 6+ on most dimensions. Be fair and calibrated.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    text = stripFences(text);

    // Extract just the JSON object
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      text = text.slice(jsonStart, jsonEnd + 1);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("JSON parse failed:", text.slice(0, 500));
      return NextResponse.json({ detail: "AI response could not be parsed" }, { status: 500 });
    }

    if (!parsed.scores || !Array.isArray(parsed.plan)) {
      console.error("Bad structure:", Object.keys(parsed));
      return NextResponse.json({ detail: "Unexpected AI response structure" }, { status: 500 });
    }

    // Clamp all scores to 1-10
    const scoreKeys = ["solution","problem","features","market","revenue","competition","risk"];
    for (const key of scoreKeys) {
      const val = Number(parsed.scores[key]);
      parsed.scores[key] = isNaN(val) ? 5 : Math.min(10, Math.max(1, Math.round(val)));
    }

    // Apply budget-based cap (never caps "risk" score)
    if (cap < 10) {
      parsed.scores = enforceScoreCap(parsed.scores, cap);
    }

    // Recalculate overall as true average
    const vals = scoreKeys.map(k => parsed.scores[k]);
    const overall = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;

    return NextResponse.json({
      scores: { ...parsed.scores, overall },
      plan: JSON.stringify(parsed.plan),
    }, { status: 200 });

  } catch (error: any) {
    console.error("Generate Plan Error:", error);
    return NextResponse.json({ detail: String(error?.message || "Server Error") }, { status: 500 });
  }
}