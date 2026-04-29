import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// ── VERCEL TIMEOUT OVERRIDE (CRITICAL) ──
// Prevents Vercel Hobby tier from killing the function after 10 seconds.
export const maxDuration = 60;

const apiKey = process.env.ANTHROPIC_API_KEY || "";
const anthropic = new Anthropic({ apiKey });

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
  const physicalHigh = ["kafe", "cafe", "coffee", "kahvehane", "restoran", "restaurant", "fabrika", "factory", "otel", "hotel", "bar", "pub", "market", "süpermarket", "supermarket", "mağaza", "dükkan", "store", "shop", "boutique", "gym", "spor salonu", "fırın", "bakery", "pastane", "eczane", "pharmacy", "hastane", "klinik", "clinic", "araba", "otomobil", "araç", "üretim", "manufacturing", "çiftlik", "farm", "tarım"];
  const digital = ["app", "uygulama", "website", "web site", "web sitesi", "platform", "saas", "yazılım", "software", "e-ticaret", "ecommerce", "e-commerce", "online", "dijital", "digital", "mobil", "mobile", "oyun", "game", "blog", "youtube", "podcast", "sosyal medya", "social media", "dropshipping", "affiliate", "kripto", "crypto", "api", "bot", "it ", "it company", "tech", "teknoloji", "technology", "startup", "girişim"];
  const service = ["danışman", "consultant", "freelance", "serbest", "koçluk", "coaching", "eğitim", "training", "öğretmen", "ders", "tercüme", "translation", "tasarım", "design", "grafik", "graphic", "fotoğraf", "photo", "video", "editing", "yazarlık", "writing", "muhasebe", "accounting", "hukuk", "law", "temizlik", "cleaning"];
  if (physicalHigh.some(w => t.includes(w))) return "physical_high";
  if (digital.some(w => t.includes(w))) return "digital";
  if (service.some(w => t.includes(w))) return "service";
  return "physical_mid";
}

const MIN_TRY: Record<IdeaType, number> = {
  physical_high: 500_000,
  physical_mid: 50_000,
  digital: 5_000,
  service: 1_000,
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

// ── Exponential Backoff Retry for Anthropic API (handles 503 / 429) ──
// Serverless-friendly: short delays to stay within Vercel's 60s timeout.
const MAX_RETRIES = 2;
const BASE_DELAY_MS = 500;

async function callAnthropicWithRetry(
  requestPayload: any,
): Promise<any> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await anthropic.messages.create(requestPayload);
      return result;
    } catch (err: any) {
      const status = err?.status ?? err?.httpStatusCode ?? err?.code;
      const isRetryable = status === 503 || status === 429
        || String(err?.message).includes("503")
        || String(err?.message).includes("429")
        || String(err?.message).toLowerCase().includes("overloaded")
        || String(err?.message).toLowerCase().includes("rate limit");

      if (isRetryable && attempt < MAX_RETRIES) {
        const delay = Math.min(BASE_DELAY_MS * Math.pow(2, attempt), 1500); // 500ms → 1000ms → 1500ms (capped)
        console.warn(`Anthropic API error (${status || err?.message}). Retry ${attempt + 1}/${MAX_RETRIES} in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Non-retryable error or max retries exhausted
      throw err;
    }
  }
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

    const systemPrompt = `You are an elite VC investor and startup mentor. You must evaluate the user's startup profile and generate 7 metrics on a scale of 1 to 10. A score of 10 is ALWAYS the best/safest outcome for the user. ${langInstruction}

${budgetContext}

═══════════════════════════════════════════
CROSS-REFERENCING SCORING ALGORITHM (MANDATORY):
═══════════════════════════════════════════
You MUST calculate these scores by cross-referencing the user's 5 inputs. Do NOT evaluate the 'Idea' in a vacuum. Each metric has a specific formula:

1. PROBLEM (Evaluate: Idea only)
   → Is the problem a bleeding-neck, urgent pain point (10) or a nice-to-have luxury (1)?
   → A clearly defined, widespread problem scores high. A vague or niche hobby scores low.

2. SOLUTION (Cross-reference: Idea + Skills + Capital)
   → Even if the idea is brilliant, if the user LACKS the Skills to build it or the Capital to fund it, the Solution score MUST be low.
   → A great idea + matching skills + sufficient capital = 8-10.
   → A great idea + no relevant skills + tiny capital = 3-4.

3. FEATURES / MOAT (Cross-reference: Idea + Skills + Management)
   → Does the team have unfair advantages, unique skills, patents, or proprietary tech that make it hard to copy (10)?
   → Or is it a generic idea anyone can replicate overnight with no defensibility (1)?
   → Solo founder with no unique edge = score low. Strong team with rare expertise = score high.

4. MARKET (Cross-reference: Idea + Goal)
   → Does the Total Addressable Market (TAM) actually support their stated Goal?
   → If they want to build a billion-dollar company in a 10M market, score low.
   → If their goal is modest and the market is large, score high.

5. REVENUE (Cross-reference: Idea + Capital)
   → Does the business model provide healthy margins? Can it realistically generate revenue given the initial Capital constraints?
   → High-margin digital product with low capital needs = 8-10.
   → Capital-intensive physical business with razor-thin margins and tiny budget = 2-4.

6. COMPETITION (Cross-reference: Idea + Skills)
   → 10 = Blue Ocean or the user's skills easily crush competitors.
   → 1 = Red Ocean dominated by monopolies with infinite resources.
   → Does the user's specific skillset give them a competitive edge, or are they bringing a knife to a gunfight?

7. RISK (Cross-reference: ALL 5 inputs)
   → This is holistic safety score. 10 = very safe, 1 = extremely risky.
   → [Low Capital + Unrealistic Goal + Solo Management + Complex Idea + No Skills] = VERY HIGH RISK (Score: 1-2).
   → [Sufficient Capital + Realistic Goal + Strong Team + Good Skills] = LOW RISK (Score: 8-10).
   → Be brutally honest here. This score protects the user from making a catastrophic mistake.

═══════════════════════════════════════════
TONE AND PLAN CONTENT RULES:
═══════════════════════════════════════════
- Be candid, data-driven, and constructive. Never be cruel, but never sugarcoat fatal flaws.
- In the plan sections, EXPLAIN your cross-referencing logic. Tell the user exactly WHY each score is what it is by referencing their specific inputs.
- Always end with actionable next steps the user can take to improve their weakest scores.

═══════════════════════════════════════════
JSON SAFETY RULE (CRITICAL):
═══════════════════════════════════════════
MANDATORY RULE: Return your output ONLY as valid JSON. NEVER use double quotes (") inside JSON string values (content). For emphasis or quotations, use only single quotes (').

Return ONLY valid JSON. No markdown backticks, no extra text before or after the JSON object. Scores must be integers 1-10.

{"scores":{"problem":NUMBER,"solution":NUMBER,"features":NUMBER,"market":NUMBER,"revenue":NUMBER,"competition":NUMBER,"risk":NUMBER},"plan":[{"title":"1. GENEL DEĞERLENDİRME","content":"WRITE IN THE SPECIFIED LANGUAGE"},{"title":"2. PAZAR VE REKABETÇİ ANALİZ","content":"WRITE IN THE SPECIFIED LANGUAGE"},{"title":"3. FİNANSAL GERÇEKLİK KONTROLÜ","content":"WRITE IN THE SPECIFIED LANGUAGE"},{"title":"4. YAPICI ALTERNATİFLER VE YOL HARİTASI","content":"WRITE IN THE SPECIFIED LANGUAGE"}]}`;

    const userMessage = `═══════════════════════════════════════════
USER'S STARTUP PROFILE:
═══════════════════════════════════════════
Idea: ${idea}
Capital: ${capital}
Skills: ${skills}
Goal/Strategy: ${strategy}
Management: ${management}`;

    const result = await callAnthropicWithRetry({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8192,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    let text = result.content[0].type === 'text' ? result.content[0].text : "";
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
    } catch (firstError) {
      // Attempt to fix unescaped double quotes inside JSON string values
      try {
        const sanitized = text.replace(
          /"content"\s*:\s*"((?:[^"\\]|\\.)*?)"/g,
          (_match: string, inner: string) => `"content":"${inner.replace(/(?<!\\)"/g, "'")}"`
        );
        parsed = JSON.parse(sanitized);
        console.warn("JSON recovered after sanitizing unescaped quotes.");
      } catch (secondError) {
        console.error("JSON parse failed (unrecoverable):", text.slice(0, 500));
        return NextResponse.json(
          {
            status: "error",
            message: "Yapay zeka analizde zorlandı, lütfen 'Önizleme Oluştur' butonuna tekrar tıklayın.",
          },
          { status: 400 }
        );
      }
    }

    if (!parsed.scores || !Array.isArray(parsed.plan)) {
      console.error("Bad structure:", Object.keys(parsed));
      return NextResponse.json({ detail: "Unexpected AI response structure" }, { status: 500 });
    }

    // Clamp all scores to 1-10
    const scoreKeys = ["solution", "problem", "features", "market", "revenue", "competition", "risk"];
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
    return NextResponse.json(
      {
        status: "error",
        message: "Sunucularımız şu an çok yoğun, lütfen birkaç saniye sonra tekrar deneyin.",
      },
      { status: 500 }
    );
  }
}