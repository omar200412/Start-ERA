import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const apiKey = process.env.ANTHROPIC_API_KEY || "";
const anthropic = new Anthropic({ apiKey });

// ── Helpers ────────────────────────────────────────────────────────────────────
function stripFences(text: string): string {
  return text
    .replace(/^```json\s*/gm, "")
    .replace(/^```\s*/gm, "")
    .replace(/\s*```\s*$/gm, "")
    .trim();
}

const MAX_RETRIES = 2;
const BASE_DELAY_MS = 500;

async function callWithRetry(payload: any): Promise<any> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await anthropic.messages.create(payload);
    } catch (err: any) {
      const status = err?.status ?? err?.httpStatusCode;
      const retryable =
        status === 503 ||
        status === 429 ||
        /overloaded|rate limit|503|429/i.test(err?.message || "");
      if (retryable && attempt < MAX_RETRIES) {
        await new Promise((r) =>
          setTimeout(r, Math.min(BASE_DELAY_MS * 2 ** attempt, 1500))
        );
        continue;
      }
      throw err;
    }
  }
}

// ── POST handler ───────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const {
      skills,
      workHistory,
      budget,
      riskTolerance,
      timeAvailability,
      location,
      personalityType,
      language,
    } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ detail: "API Key Missing" }, { status: 503 });
    }

    if (!skills || !workHistory || !location) {
      return NextResponse.json(
        { detail: "Missing required fields" },
        { status: 400 }
      );
    }

    const langInst =
      language === "tr"
        ? "Write your ENTIRE response in Turkish only."
        : language === "ar"
        ? "Write your ENTIRE response in Arabic only."
        : "Write your ENTIRE response in English only.";

    const systemPrompt = `You are an expert business strategist and startup advisor with deep knowledge of global and local markets. ${langInst}

Given a user's personal profile, generate EXACTLY 3 personalized startup / business opportunity ideas that fit their unique combination of skills, experience, budget, risk appetite, available time, location, and personality type.

RULES:
- Each idea must be realistic, actionable, and clearly different from the others.
- Ideas should span a range: one safer/simpler option, one moderate, and one ambitious.
- Tailor every field to the user's SPECIFIC profile — do not give generic advice.
- The "whyThisFitsYou" field must directly reference the user's skills, work history, personality, and constraints.
- All monetary references should use the local currency of the user's location.

OUTPUT FORMAT — Return ONLY a valid JSON array with EXACTLY 3 objects. No markdown fences, no explanations outside the JSON.
Each object MUST have these exact keys:
{
  "title": "Name of the business (string)",
  "profitPotential": "Business model and earning potential explanation (string, 2-3 sentences)",
  "difficultyLevel": "Beginner | Intermediate | Advanced",
  "startupComplexityScore": NUMBER (1-10, where 1=very simple, 10=extremely complex),
  "marketSaturationScore": NUMBER (1-10, where 1=blue ocean, 10=highly saturated),
  "whyThisFitsYou": "A personalized paragraph (4-6 sentences) explaining exactly why this opportunity matches this specific person's profile, skills, experience, personality, and constraints."
}

JSON RULE: Never use unescaped double quotes inside string values — use single quotes or escaped quotes instead. Return ONLY the JSON array.`;

    const userMsg = `USER PROFILE:
- Skills: ${skills}
- Work History: ${workHistory}
- Budget: ${budget || "Not specified"}
- Risk Tolerance: ${riskTolerance || "Not specified"}
- Time Availability: ${timeAvailability || "Not specified"}
- Location: ${location}
- Personality Type: ${personalityType || "Not specified"}`;

    const result = await callWithRetry({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: "user", content: userMsg }],
    });

    let text =
      result.content[0].type === "text" ? result.content[0].text : "";
    text = stripFences(text);

    // Extract the JSON array from the response
    const arrStart = text.indexOf("[");
    const arrEnd = text.lastIndexOf("]");
    if (arrStart !== -1 && arrEnd > arrStart) {
      text = text.slice(arrStart, arrEnd + 1);
    }

    let parsed: any[];
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error("generate-ideas JSON parse failed:", text.slice(0, 500));
      return NextResponse.json(
        { status: "error", message: "AI analysis failed. Please try again." },
        { status: 400 }
      );
    }

    // Validate and sanitize each idea
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return NextResponse.json(
        { status: "error", message: "AI returned invalid data. Please try again." },
        { status: 400 }
      );
    }

    const VALID_DIFFICULTY = ["Beginner", "Intermediate", "Advanced"];

    const sanitized = parsed.slice(0, 3).map((idea: any) => {
      const complexityRaw = Number(idea.startupComplexityScore);
      const saturationRaw = Number(idea.marketSaturationScore);

      return {
        title: idea.title || "Untitled Idea",
        profitPotential: idea.profitPotential || "",
        difficultyLevel: VALID_DIFFICULTY.includes(idea.difficultyLevel)
          ? idea.difficultyLevel
          : "Intermediate",
        startupComplexityScore: isNaN(complexityRaw)
          ? 5
          : Math.min(10, Math.max(1, Math.round(complexityRaw))),
        marketSaturationScore: isNaN(saturationRaw)
          ? 5
          : Math.min(10, Math.max(1, Math.round(saturationRaw))),
        whyThisFitsYou: idea.whyThisFitsYou || "",
      };
    });

    return NextResponse.json({ ideas: sanitized }, { status: 200 });
  } catch (error: any) {
    console.error("Generate Ideas Error:", error);
    return NextResponse.json(
      { status: "error", message: "Server busy. Please try again." },
      { status: 500 }
    );
  }
}
