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
Sen uzman bir iş danışmanı ve girişim analistisin.
DİL: ${language || "tr"}
GİRİŞİM: ${idea}
SERMAYE: ${capital}
YETENEKLER: ${skills}
HEDEF/STRATEJİ: ${strategy}
YÖNETİM: ${management}

Görev: Yukarıdaki verilere dayanarak profesyonel bir iş planı ve değerlendirme skorları hazırla.

Yanıtını KESİNLİKLE aşağıdaki JSON formatında döndür. Başka hiçbir açıklama metni ekleme.

{
  "scores": {
    "overall": <0-10 arası ondalıklı sayı, diğer skorların ortalaması>,
    "solution": <0-10, önerilen çözümün ne kadar yenilikçi ve uygulanabilir olduğu>,
    "problem": <0-10, çözülen problemin ne kadar gerçek ve büyük olduğu>,
    "features": <0-10, ürün/hizmet özelliklerinin güçlü olup olmadığı>,
    "market": <0-10, pazar büyüklüğü ve erişilebilirliği>,
    "revenue": <0-10, gelir modelinin mantıklılığı ve sürdürülebilirliği>,
    "competition": <0-10, rekabet avantajının gücü — düşük = zayıf avantaj, yüksek = güçlü avantaj>,
    "risk": <0-10, risklerin ne kadar iyi yönetilebileceği — yüksek = düşük risk>
  },
  "plan": [
    {
      "title": "1. YÖNETİCİ ÖZETİ",
      "content": "Girişimin amacı, vizyonu ve hedefleri. Detaylı ve gerçekçi yaz."
    },
    {
      "title": "2. İŞ MODELİ VE PAZAR ANALİZİ",
      "content": "Nasıl para kazanılacak, hedef kitle kim, pazar büyüklüğü nedir, rakip durumu nedir."
    },
    {
      "title": "3. FİNANSAL PLAN VE YATIRIM",
      "content": "Belirtilen ${capital} sermayenin nasıl kullanılacağı, aylık giderler, başabaş noktası tahmini, 1-3 yıl projeksiyon."
    },
    {
      "title": "4. OPERASYON VE YÖNETİM",
      "content": "Ekibin yapısı, günlük operasyon planı, ilk 90 günlük yol haritası."
    }
  ]
}

Skorları gerçekçi ve eleştirel değerlendir. Hepsi 8+ olmasın — güçlü ve zayıf yönleri dürüstçe yansıt.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Clean markdown code blocks
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse and validate
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // If JSON parse fails, return raw text as fallback
      return NextResponse.json({ plan: text, scores: null }, { status: 200 });
    }

    // Calculate real overall as average of all dimension scores
    if (parsed.scores) {
      const { solution, problem, features, market, revenue, competition, risk } = parsed.scores;
      const vals = [solution, problem, features, market, revenue, competition, risk].filter(v => typeof v === "number");
      parsed.scores.overall = vals.length > 0
        ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
        : 7.0;
    }

    return NextResponse.json({
      plan: JSON.stringify(parsed.plan),
      scores: parsed.scores || null,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Generate Plan Error:", error);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}