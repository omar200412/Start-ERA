import { streamText, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export const maxDuration = 60;

// ── Types ──────────────────────────────────────────────────────────────────────
interface UserProfile {
  skills?: string;
  workHistory?: string;
  budget?: string;
  riskTolerance?: string;
  timeAvailability?: string;
  location?: string;
  personalityType?: string;
}

interface StartupIdea {
  title?: string;
  description?: string;
}

interface MentorChatBody {
  messages: any[];
  context?: {
    userProfile?: UserProfile;
    startup?: StartupIdea;
    language?: string;
  };
}

// ── POST handler ───────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body: MentorChatBody = await request.json();
    const { messages, context } = body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ detail: "API Key Missing" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ detail: "Messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ── Extract context variables ────────────────────────────────────────────
    const profile = context?.userProfile || {};
    const startup = context?.startup || {};
    const lang = context?.language || "en";

    const langInst =
      lang === "tr"
        ? "You MUST respond in Turkish only."
        : lang === "ar"
        ? "You MUST respond in Arabic only."
        : "You MUST respond in English only.";

    // ── Build the highly specific system prompt ──────────────────────────────
    const systemPrompt = `You are the Start Era Adaptive AI Mentor — an expert startup advisor embedded inside the Start Era launch platform.

${langInst}

YOUR MISSION:
You are guiding this SPECIFIC user to launch their SPECIFIC business. You must tailor every single piece of advice to their exact profile, budget, location, and skill set. Do NOT give generic startup advice. Every response must feel like a personal 1-on-1 session with a world-class mentor who knows their situation deeply.

RULES:
1. Always reference the user's actual data when giving advice.
2. When suggesting costs, use the local currency of the user's location.
3. When discussing legal steps, reference the ACTUAL regulations and requirements for the user's specific location/country.
4. Keep responses focused, actionable, and structured. Use numbered steps, bullet points, or clear sections.
5. If the user asks something outside the scope of launching their specific startup, gently redirect them back.
6. Be warm, encouraging, and professional. You are their dedicated mentor.
7. If you don't have enough context about something specific, ask a clarifying question rather than guessing.

─── USER PROFILE ───
• Skills & Expertise: ${profile.skills || "Not yet specified"}
• Work History: ${profile.workHistory || "Not yet specified"}
• Available Budget: ${profile.budget || "Not yet specified"}
• Risk Tolerance: ${profile.riskTolerance || "Not yet specified"}
• Time Availability: ${profile.timeAvailability || "Not yet specified"}
• Location / Market: ${profile.location || "Not yet specified"}
• Personality Type: ${profile.personalityType || "Not yet specified"}

─── THEIR STARTUP ───
• Business Title: ${startup.title || "Not yet defined"}
• Business Description: ${startup.description || "Not yet defined"}

─── CURRENT PHASE ───
The user is in the LAUNCH SYSTEM phase. This means they have already:
1. Generated & selected a business idea.
2. Validated the idea.
Now they need step-by-step guidance to actually launch. Focus on:
- Phase 1: Setup & Legal (registration, permits, banking, entity formation)
- Phase 2: MVP & Pre-launch (building MVP, beta testing, initial marketing)
- Phase 3: Go-to-Market (launch strategy, pricing, customer acquisition, scaling)

Prioritize the most immediate next step they should take based on their current progress.`;

    // ── Stream the response ──────────────────────────────────────────────────
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: anthropic("claude-3-5-sonnet-latest"),
      system: systemPrompt,
      messages: modelMessages,
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("Mentor Chat API Error:", error);

    const msg = error?.message || "";
    if (/overloaded|rate.limit|529|503|429/i.test(msg)) {
      return new Response(
        JSON.stringify({ status: "error", message: "AI service is busy. Please try again in a moment." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ status: "error", message: "Mentor service error. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
