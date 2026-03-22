import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idea, capital, skills, strategy, management, language } = body;

    if (!apiKey) {
      return NextResponse.json({ detail: "API Key Missing" }, { status: 503 });
    }

    const langInstruction =
      language === "tr" ? "Tüm yanıtını yalnızca Türkçe ver." :
      language === "ar" ? "أعطِ جميع إجاباتك باللغة العربية فقط." :
      "Give your entire response in English only.";

    const prompt = `
You are a brutally honest angel investor and startup analyst. Your job is to evaluate startup ideas based on REAL-WORLD feasibility — not theoretical potential.

${langInstruction}

---
STARTUP TO EVALUATE:
IDEA: ${idea}
CAPITAL/BUDGET: ${capital}
SKILLS: ${skills}
GOALS: ${strategy}
MANAGEMENT: ${management}
---

CRITICAL SCORING RULES — READ CAREFULLY:

**RULE 1: BUDGET MISMATCH DESTROYS ALL SCORES**
If the budget is wildly insufficient for the idea (e.g. opening a cafe with 500 TL, building a factory with $100), 
then EVERY score must be low (1-3 range) — not just one or two scores.
- You CANNOT give market=8 or problem=8 if the person cannot even enter that market with their budget.
- A great problem does NOT matter if the solution is financially impossible.
- The scores represent THIS SPECIFIC PERSON'S chance of success, not the abstract quality of the idea.

**RULE 2: SCORES = EXECUTION FEASIBILITY, NOT IDEA QUALITY**
Ask yourself: "If THIS person, with THIS budget, with THESE skills, tries to execute this — will they succeed?"
- Scoring the idea in a vacuum is WRONG.
- Score the realistic probability of success given ALL constraints.

**RULE 3: STRICT SCORE THRESHOLDS**
- 8-10: Strong execution feasibility. Budget matches. Skills match. Real market advantage.
- 6-7: Feasible but with serious challenges. Budget is tight but possible.
- 4-5: Significant problems. Budget insufficient OR market too saturated.
- 2-3: Not feasible. Budget is far too low OR idea has fundamental flaws.
- 1: Completely impossible. No chance of success with given resources.

**RULE 4: NEVER LIE WITH NUMBERS**
If the plan text says "this is financially impossible", the scores MUST be 1-3. 
It is INCONSISTENT and WRONG to write "this cannot work" in the text but give scores of 6, 7, 8.
The numbers must match the words.

**RULE 5: ALWAYS PROVIDE ALTERNATIVES**
If the idea is infeasible: suggest what the person CAN realistically do with their actual budget.
Make alternatives concrete, specific, and actually startable with that exact budget.

---

Return ONLY valid JSON, no markdown, no explanation, nothing else:

{
  "scores": {
    "solution": <integer 1-10>,
    "problem": <integer 1-10>,
    "features": <integer 1-10>,
    "market": <integer 1-10>,
    "revenue": <integer 1-10>,
    "competition": <integer 1-10>,
    "risk": <integer 1-10>
  },
  "plan": [
    {
      "title": "1. GENEL DEĞERLENDİRME",
      "content": "Honest verdict: Is this feasible with the given budget and skills? State the budget gap with real numbers if applicable. No false encouragement."
    },
    {
      "title": "2. PAZAR VE REKABETÇİ ANALİZ",
      "content": "Real market conditions, competitor strength, and whether this budget can realistically compete."
    },
    {
      "title": "3. FİNANSAL GERÇEKLİK KONTROLÜ",
      "content": "Actual cost breakdown for this type of business. Compare against the given budget. Show the gap in numbers. Break-even analysis."
    },
    {
      "title": "4. YAPICI ALTERNATİFLER VE YOL HARİTASI",
      "content": "If infeasible: list 2-3 concrete alternatives the person can START TODAY with their exact budget. If feasible: 90-day action plan."
    }
  ]
}

FINAL CHECK BEFORE RESPONDING:
- Look at your scores. If any score is above 5 but your plan text says the idea is impossible — FIX the scores DOWN.
- The overall score (average of all 7) should reflect the TOTAL picture. If budget makes execution impossible, overall MUST be below 4.
- Be the investor who saves someone from wasting their money, not the one who flatters them into failure.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Strip all markdown fences aggressively
    text = text.replace(/^```json\s*/m, "").replace(/^```\s*/m, "").replace(/\s*```$/m, "").trim();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Try to extract JSON from the text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          return NextResponse.json({ plan: text, scores: null }, { status: 200 });
        }
      } else {
        return NextResponse.json({ plan: text, scores: null }, { status: 200 });
      }
    }

    // Validate, clamp scores 1-10, calculate real average
    if (parsed.scores) {
      const keys = ["solution", "problem", "features", "market", "revenue", "competition", "risk"];
      for (const key of keys) {
        const val = Number(parsed.scores[key]);
        parsed.scores[key] = isNaN(val) ? 5 : Math.min(10, Math.max(1, Math.round(val)));
      }
      const vals = keys.map((k) => parsed.scores[k]);
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