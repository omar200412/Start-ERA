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

    const prompt = `
    Sen uzman bir iş danışmanısın.
    DİL: ${language || "tr"}
    GİRİŞİM: ${idea}
    SERMAYE: ${capital}
    YETENEKLER: ${skills}
    HEDEF/STRATEJİ: ${strategy}
    YÖNETİM: ${management}
    
    Görev: Yukarıdaki verilere dayanarak profesyonel bir iş planı hazırla.
    Yanıtını KESİNLİKLE geçerli bir JSON formatında (ARRAY of OBJECTS) döndür. Başka hiçbir açıklama metni ekleme.
    
    Format Şablonu:
    [
      {
        "title": "1. YÖNETİCİ ÖZETİ",
        "content": "Girişimin amacı, vizyonu ve hedefleri."
      },
      {
        "title": "2. İŞ MODELİ VE PAZAR ANALİZİ",
        "content": "Nasıl para kazanılacak, hedef kitle kim ve rekabet durumu nedir."
      },
      {
        "title": "3. FİNANSAL PLAN VE YATIRIM",
        "content": "Belirtilen sermayenin nasıl kullanılacağı ve başabaş noktası tahmini."
      },
      {
        "title": "4. OPERASYON VE YÖNETİM",
        "content": "Ekibin yapısı ve günlük operasyon planı."
      }
    ]
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Clean up markdown block quotes if Gemini returns them
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json({ plan: text }, { status: 200 });

  } catch (error: any) {
    console.error("Generate Plan Error:", error);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}