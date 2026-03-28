import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// ── Budget feasibility enforcement ────────────────────────────────────────
function parseBudget(capital: string): number {
  if (!capital) return 0;
  const digits = (capital.match(/[\d]+/g) || []);
  if (digits.length === 0) return 0;
  if (digits.length === 1) return parseFloat(digits[0]);
  return parseFloat(digits.join(""));
}

type IdeaType = "physical_high" | "physical_mid" | "digital" | "service";

function classifyIdea(idea: string): IdeaType {
  const t = (idea || "").toLowerCase();
  const physicalHigh = ["kafe","cafe","coffee","kahvehane","restoran","restaurant","fabrika","factory","otel","hotel","bar","pub","market","süpermarket","supermarket","mağaza","dükkan","store","shop","boutique","gym","spor salonu","fırın","bakery","pastane","eczane","pharmacy","hastane","klinik","clinic","araba","otomobil","araç","üretim","manufacturing","çiftlik","farm","tarım"];
  const digital = ["app","uygulama","website","web site","web sitesi","platform","saas","yazılım","software","e-ticaret","ecommerce","e-commerce","online","dijital","digital","mobil","mobile","oyun","game","blog","youtube","podcast","sosyal medya","social media","dropshipping","affiliate","kripto","crypto","api","bot"];
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

function getScoreCap(capital: string, idea: string): number {
  const budget = parseBudget(capital);
  const ideaType = classifyIdea(idea);
  const minRequired = MIN_TRY[ideaType];
  if (budget === 0) return 2;
  const ratio = budget / minRequired;
  if (ratio <= 0.05) return 2;
  if (ratio <= 0.15) return 3;
  if (ratio <= 0.35) return 4;
  if (ratio <= 0.60) return 6;
  if (ratio <= 0.85) return 7;
  return 10;
}

function enforceScoreCap(scores: Record<string, number>, cap: number): Record<string, number> {
  const result: Record<string, number> = {};
  for (const key of Object.keys(scores)) {
    result[key] = Math.min(scores[key], cap);
  }
  return result;
}

// ── Strip all markdown fences from AI output ──────────────────────────────
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

    if (!apiKey) {
      return NextResponse.json({ detail: "API Key Missing" }, { status: 503 });
    }

    const scoreCap = getScoreCap(capital || "", idea || "");
    const budgetNum = parseBudget(capital || "");
    const ideaType = classifyIdea(idea || "");
    const minRequired = MIN_TRY[ideaType];

    const langInstruction =
      language === "tr" ? "Respond entirely in Turkish." :
      language === "ar" ? "Respond entirely in Arabic." :
      "Respond entirely in English.";

    const feasibilityNote = scoreCap <= 4
      ? `CRITICAL: Budget (${budgetNum} TRY) is only ${Math.round(budgetNum/minRequired*100)}% of minimum needed (${minRequired} TRY) for this type of business. This is financially IMPOSSIBLE. All scores must be between 1 and ${scoreCap}. Say so clearly in the plan and suggest what the person CAN do with their actual budget.`
      : `Budget covers ${Math.round(budgetNum/minRequired*100)}% of minimum needed. Score cap is ${scoreCap}/10.`;

    const prompt = `You are a brutally honest startup analyst. ${langInstruction}

${feasibilityNote}

STARTUP:
Idea: ${idea}
Budget: ${capital}
Skills: ${skills}
Goals: ${strategy}
Management: ${management}

Return ONLY valid JSON, absolutely no markdown, no backticks, no extra text before or after:

{"scores":{"solution":NUMBER,"problem":NUMBER,"features":NUMBER,"market":NUMBER,"revenue":NUMBER,"competition":NUMBER,"risk":NUMBER},"plan":[{"title":"1. GENEL DEĞERLENDİRME","content":"..."},{"title":"2. PAZAR VE REKABETÇİ ANALİZ","content":"..."},{"title":"3. FİNANSAL GERÇEKLİK KONTROLÜ","content":"..."},{"title":"4. YAPICI ALTERNATİFLER VE YOL HARİTASI","content":"..."}]}

All scores must be integers between 1 and ${scoreCap}. No score can exceed ${scoreCap}.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Aggressively clean the response
    text = stripFences(text);

    // Extract JSON object if there's surrounding text
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      text = text.slice(jsonStart, jsonEnd + 1);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("JSON parse failed:", text.slice(0, 300));
      return NextResponse.json({ detail: "AI response could not be parsed" }, { status: 500 });
    }

    // ── Validate structure ────────────────────────────────────────────────
    if (!parsed.scores || !Array.isArray(parsed.plan)) {
      console.error("Unexpected structure:", Object.keys(parsed));
      return NextResponse.json({ detail: "Unexpected AI response structure" }, { status: 500 });
    }

    // ── Clamp scores to 1-10 then enforce cap ─────────────────────────────
    const scoreKeys = ["solution","problem","features","market","revenue","competition","risk"];
    for (const key of scoreKeys) {
      const val = Number(parsed.scores[key]);
      parsed.scores[key] = isNaN(val) ? 1 : Math.min(10, Math.max(1, Math.round(val)));
    }
    parsed.scores = enforceScoreCap(parsed.scores, scoreCap);

    // ── Recalculate overall as true average ───────────────────────────────
    const vals = scoreKeys.map(k => parsed.scores[k]);
    const overall = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;

    // ── Return cleanly separated: scores and plan array ───────────────────
    return NextResponse.json({
      scores: { ...parsed.scores, overall },
      plan: JSON.stringify(parsed.plan),   // just the array, stringified
    }, { status: 200 });

  } catch (error: any) {
    console.error("Generate Plan Error:", error);
    return NextResponse.json({ detail: String(error?.message || "Server Error") }, { status: 500 });
  }
}