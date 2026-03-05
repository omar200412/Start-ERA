import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, system_prompt } = body;

    if (!apiKey) {
      return NextResponse.json({ detail: "API Key Missing" }, { status: 503 });
    }

    // THE GUARDRAIL
    const guardrail = `
    Sen StartEra için yardımcı bir asistansın.
    KULLANICI NE İSTERSE İSTESİN KESİN KURAL: Asla tam, detaylı, uzun bir iş planı, finansal tablo veya pazar analizi raporu YAZMAYACAKSIN.
    Eğer kullanıcı senden bir iş planı yazmanı, finansal hesaplama yapmanı veya detaylı pazar araştırması yapmanı isterse, ona nazikçe şunu söylemelisin: 
    "Ben sadece kısa sorularınızı yanıtlayabilirim. Kapsamlı ve profesyonel bir iş planı oluşturmak için lütfen panonuzdaki StartEra İş Planlayıcı'yı (Planner) kullanın."
    Cevapların kısa, dostane ve hedefe yönelik olmalıdır.
    `;

    const frontendContext = system_prompt ? system_prompt : "";
    const finalPrompt = `${guardrail}\n\n[Frontend Context]: ${frontendContext}\n\nKullanıcının Mesajı: ${message}`;

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Generate content
    const result = await model.generateContent(finalPrompt);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText }, { status: 200 });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}