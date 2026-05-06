import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export const maxDuration = 60;

// ── Zod schema for a single startup idea ───────────────────────────────────────
const IdeaSchema = z.object({
  title: z.string().describe("Name of the business"),
  profitPotential: z
    .string()
    .describe("Business model and earning potential explanation, 2-3 sentences"),
  difficultyLevel: z
    .enum(["Beginner", "Intermediate", "Advanced"])
    .describe("Difficulty level of the startup"),
  startupComplexityScore: z
    .number()
    .min(1)
    .max(10)
    .describe("Startup complexity score from 1 (very simple) to 10 (extremely complex)"),
  marketSaturationScore: z
    .number()
    .min(1)
    .max(10)
    .describe("Market saturation score from 1 (blue ocean) to 10 (highly saturated)"),
  whyThisFitsYou: z
    .string()
    .describe(
      "A personalized paragraph (4-6 sentences) explaining exactly why this opportunity matches this specific person's profile, skills, experience, personality, and constraints"
    ),
});

// ── Zod schema for the full response (array of exactly 3 ideas) ────────────────
const IdeasResponseSchema = z.object({
  ideas: z
    .array(IdeaSchema)
    .length(3)
    .describe("Exactly 3 personalized startup opportunity ideas"),
});

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

    if (!process.env.ANTHROPIC_API_KEY) {
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
- All monetary references should use the local currency of the user's location.`;

    const userMsg = `USER PROFILE:
- Skills: ${skills}
- Work History: ${workHistory}
- Budget: ${budget || "Not specified"}
- Risk Tolerance: ${riskTolerance || "Not specified"}
- Time Availability: ${timeAvailability || "Not specified"}
- Location: ${location}
- Personality Type: ${personalityType || "Not specified"}`;

    const { object } = await generateObject({
      model: anthropic("claude-haiku-4-5-20251001"),
      schema: IdeasResponseSchema,
      system: systemPrompt,
      prompt: userMsg,
      temperature: 0.7,
      maxOutputTokens: 4096,
    });

    // Extra safety: clamp scores to 1-10 integers
    const sanitized = object.ideas.map((idea) => ({
      ...idea,
      startupComplexityScore: Math.min(10, Math.max(1, Math.round(idea.startupComplexityScore))),
      marketSaturationScore: Math.min(10, Math.max(1, Math.round(idea.marketSaturationScore))),
    }));

    return NextResponse.json({ ideas: sanitized }, { status: 200 });
  } catch (error: any) {
    console.error("Generate Ideas Error:", error);

    // Surface useful error messages for retryable cases
    const msg = error?.message || "";
    if (/overloaded|rate.limit|529|503|429/i.test(msg)) {
      return NextResponse.json(
        { status: "error", message: "AI service is busy. Please try again in a moment." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { status: "error", message: "AI analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
