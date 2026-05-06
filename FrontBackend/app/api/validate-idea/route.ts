import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const apiKey = process.env.ANTHROPIC_API_KEY || "";
const anthropic = new Anthropic({ apiKey });

function stripFences(text: string): string {
  return text.replace(/^```json\s*/gm, "").replace(/^```\s*/gm, "").replace(/\s*```\s*$/gm, "").trim();
}

const MAX_RETRIES = 2;
const BASE_DELAY_MS = 500;

async function callWithRetry(payload: any): Promise<any> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await anthropic.messages.create(payload);
    } catch (err: any) {
      const status = err?.status ?? err?.httpStatusCode;
      const retryable = status === 503 || status === 429 || /overloaded|rate limit|503|429/i.test(err?.message || "");
      if (retryable && attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, Math.min(BASE_DELAY_MS * 2 ** attempt, 1500)));
        continue;
      }
      throw err;
    }
  }
}

export async function POST(request: Request) {
  try {
    const { idea, location, budget, language } = await request.json();

    if (!apiKey) return NextResponse.json({ detail: "API Key Missing" }, { status: 503 });
    if (!idea || !location) return NextResponse.json({ detail: "Missing required fields" }, { status: 400 });

    const langInst = language === "tr" ? "Write your ENTIRE response in Turkish only." : language === "ar" ? "Write your ENTIRE response in Arabic only." : "Write your ENTIRE response in English only.";

    const systemPrompt = `You are a strict, data-driven market analyst. Validate the startup idea below. ${langInst}

ANALYSIS:
1. demandTrendScore (1-100): Current market demand. 1-20=dying, 21-40=niche, 41-60=moderate, 61-80=strong, 81-100=explosive.
2. competitionIntensity ("Low"/"Medium"/"High"): Based on competitors in the user's location.
3. estimatedRevenueRange: Realistic monthly revenue for first 6-12 months. Use local currency formatting.
4. localRegulationNotes: A detailed paragraph (4-6 sentences) about specific permits, licenses, legal requirements, tax obligations, and regulatory hurdles for THIS business type in THIS location. Mention actual permit names and agencies where possible.

JSON RULE: Return ONLY valid JSON. Never use double quotes inside string values — use single quotes instead. No markdown fences.
{"demandTrendScore":NUMBER,"competitionIntensity":"STRING","estimatedRevenueRange":"STRING","localRegulationNotes":"STRING"}`;

    const userMsg = `Startup Idea: ${idea}\nUser Location: ${location}\nAvailable Budget: ${budget || "Not specified"}`;

    const result = await callWithRetry({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      temperature: 0.5,
      system: systemPrompt,
      messages: [{ role: "user", content: userMsg }],
    });

    let text = result.content[0].type === "text" ? result.content[0].text : "";
    text = stripFences(text);
    const s = text.indexOf("{"), e = text.lastIndexOf("}");
    if (s !== -1 && e > s) text = text.slice(s, e + 1);

    let parsed: any;
    try { parsed = JSON.parse(text); } catch {
      console.error("validate-idea JSON failed:", text.slice(0, 500));
      return NextResponse.json({ status: "error", message: "AI analysis failed. Please try again." }, { status: 400 });
    }

    const ds = Number(parsed.demandTrendScore);
    parsed.demandTrendScore = isNaN(ds) ? 50 : Math.min(100, Math.max(1, Math.round(ds)));
    if (!["Low", "Medium", "High"].includes(parsed.competitionIntensity)) parsed.competitionIntensity = "Medium";

    return NextResponse.json(parsed, { status: 200 });
  } catch (error: any) {
    console.error("Validate Idea Error:", error);
    return NextResponse.json({ status: "error", message: "Server busy. Please try again." }, { status: 500 });
  }
}
