import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Fetch the API key securely from your Vercel Environment Variables
const apiKey = process.env.ANTHROPIC_API_KEY || "";
const anthropic = new Anthropic({ apiKey });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, system_prompt } = body;

    if (!apiKey) {
      console.error("Missing ANTHROPIC_API_KEY in environment variables.");
      return NextResponse.json({ detail: "API Key Missing" }, { status: 503 });
    }

    // THE GUARDRAIL: Keeps the chatbot focused and prevents it from replacing the Planner
    const guardrail = `
    Sen StartEra için yardımcı bir asistansın.
    KULLANICI NE İSTERSE İSTESİN KESİN KURAL: Asla tam, detaylı, uzun bir iş planı, finansal tablo veya pazar analizi raporu YAZMAYACAKSIN.
    Eğer kullanıcı senden bir iş planı yazmanı, finansal hesaplama yapmanı veya detaylı pazar araştırması yapmanı isterse, ona nazikçe şunu söylemelisin: 
    "Ben sadece kısa sorularınızı yanıtlayabilirim. Kapsamlı ve profesyonel bir iş planı oluşturmak için lütfen panonuzdaki StartEra İş Planlayıcı'yı (Planner) kullanın."
    Cevapların kısa, dostane ve hedefe yönelik olmalıdır.
    `;

    // Combine the guardrail and any frontend context
    const frontendContext = system_prompt ? system_prompt : "";
    const finalSystemPrompt = `${guardrail}\n\n[Frontend Context]: ${frontendContext}`;

    // Initialize Claude request
    const result = await anthropic.messages.create({
      model: "claude-3-5-haiku-latest",
      max_tokens: 1024,
      system: finalSystemPrompt,
      messages: [{ role: "user", content: `Kullanıcının Mesajı: ${message}` }]
    });

    const responseText = result.content[0].type === 'text' ? result.content[0].text : "";

    // Send the response back to your Chatbot frontend
    return NextResponse.json({ reply: responseText }, { status: 200 });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ detail: "Server Error", error: error.message }, { status: 500 });
  }
}