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
Sen acımasız, gerçekçi ama yapıcı bir melek yatırımcı ve iş geliştirme uzmanısın.
Amacın, kullanıcıların iş fikirlerini gerçek dünya pazar ve finansal koşullarına göre değerlendirmektir.

MUTLAK VE KESİN KURALLAR (BUNLARI İHLAL ETMEN YASAKTIR):

1. ÖLÜMCÜL HATA (FATAL FLAW) KURALI - BÜTÇE KONTROLÜ:
   - İlk yapman gereken şey bütçeyi (SERMAYE) ve fikri karşılaştırmaktır.
   - Eğer bütçe, hedeflenen iş için komik veya mantıksız derecede yetersizse (Örn: 200 TL ile kafe açmak, 1000 TL ile fabrika kurmak), bu bir ÖLÜMCÜL HATA'dır.
   - ÖLÜMCÜL HATA durumunda, fikrin soyut olarak ne kadar iyi olduğunun HİÇBİR önemi yoktur. Pazar büyük olsa bile, bütçe olmadığı için o pazara girilemez.
   - BU DURUMDA İSTİSNASIZ TÜM PUANLAR (solution, problem, features, market, revenue, competition, risk) MAKSİMUM 1, 2 veya 3 OLMALIDIR. Ortalama puan KESİNLİKLE 3'ü geçemez. Asla "Pazar büyük" diyerek pazar puanını yüksek verme.

2. SOYUT DEĞERLENDİRME YAPMA:
   - "Kafe açmak" genel olarak karlı olabilir, ancak "200 TL ile kafe açmak" %100 başarısızlıktır. Değerlendirmeyi genel sektöre göre değil, kullanıcının MEVCUT BÜTÇESİYLE bu işi yapıp yapamayacağına göre yap.

3. DÜRÜST VE NET ELEŞTİRİ:
   - Fikir kötüyse veya bütçe yetersizse net bir şekilde "Bu bütçeyle hayata geçirilemez" de. Eksikleri rakamlarla açıkla.

4. YAPICI YÖNLENDİRME (EN ÖNEMLİ KISIM):
   - Fikri çöpe atmakla kalma. Kullanıcının ELİNDEKİ GERÇEK bütçeyle (örn: 200 TL) gerçekten yapabileceği, daha makul, dijital veya mikro alternatifler sun. "200 TL ile kafe açamazsın AMA 200 TL ile şunu yapabilirsin: ..." formatında yönlendir.

5. DİL KURALI: ${langInstruction}

---
DEĞERLENDİRİLECEK GİRİŞİM:
FİKİR: ${idea}
SERMAYE / BÜTÇE: ${capital}
BECERİLER: ${skills}
HEDEF / STRATEJİ: ${strategy}
YÖNETİM: ${management}
---

Görevi: Yukarıdaki girişim fikrini sistem kurallarına göre değerlendir ve iş planı hazırla.

SADECE aşağıdaki JSON formatında yanıt ver. Markdown yok, açıklama yok, sadece JSON:

{
  "scores": {
    "solution": <1-10: Bütçe komikse direkt 1-2 ver. Yenilikçilik bütçe yoksa işe yaramaz.>,
    "problem": <1-10: Bütçe yetersizse bu problemi çözmeleri imkansızdır, direkt 1-2 ver.>,
    "features": <1-10: Bütçe yoksa ürün/hizmet özelliği de yoktur, direkt 1-2 ver.>,
    "market": <1-10: Bütçe yoksa o pazara girilemez, direkt 1-2 ver.>,
    "revenue": <1-10: Sermaye yetersizse gelir modeli çöker, direkt 1-2 ver.>,
    "competition": <1-10: Bu bütçeyle rekabet edilemez, direkt 1-2 ver.>,
    "risk": <1-10: Bütçe imkansızsa risk %100'dür (yüksek risk = düşük puan), direkt 1-2 ver.>
  },
  "plan": [
    {
      "title": "1. GENEL DEĞERLENDİRME",
      "content": "Fikrin ve bütçenin dürüst, gerçekçi değerlendirmesi. Bütçe komikse bunu acımasızca yüzlerine vur."
    },
    {
      "title": "2. PAZAR VE REKABETÇİ ANALİZ",
      "content": "Hedef pazar büyüklüğü ve bu bütçeyle pazara girmenin neden imkansız olduğu (veya normalse analizi)."
    },
    {
      "title": "3. FİNANSAL GERÇEKLİK KONTROLÜ",
      "content": "Bu iş kolunun gerçek maliyetleri ve kullanıcının bütçesiyle yüzleşmesi."
    },
    {
      "title": "4. YAPICI ALTERNATİFLER VE YOL HARİTASI",
      "content": "Eğer bütçe yetersizse: Kullanıcının ELİNDEKİ KÜÇÜK BÜTÇEYLE (örn: 200 TL) sıfırdan yapabileceği somut, dijital/mikro alternatifler."
    }
  ]
}
`;

    // Temperature 0.1 eklendi: Modelin iyimser/rastgele davranmasını engeller, kurallara harfiyen uymasını sağlar.
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { temperature: 0.1 }
    });
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Strip markdown code fences
    text = text.replace(/```json[\s\S]*?```/g, (match) => match.slice(7, -3).trim());
    text = text.replace(/```[\s\S]*?```/g, (match) => match.slice(3, -3).trim());
    text = text.trim();

    // If starts with ``` without closing, strip it
    if (text.startsWith("```json")) text = text.slice(7).trim();
    if (text.startsWith("```")) text = text.slice(3).trim();
    if (text.endsWith("```")) text = text.slice(0, -3).trim();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json({ plan: text, scores: null }, { status: 200 });
    }

    // Validate and clamp scores to 1-10
    if (parsed.scores) {
      const keys = ["solution", "problem", "features", "market", "revenue", "competition", "risk"];
      for (const key of keys) {
        if (typeof parsed.scores[key] !== "number") {
          parsed.scores[key] = 5;
        }
        parsed.scores[key] = Math.min(10, Math.max(1, Math.round(Number(parsed.scores[key]))));
      }
      // True average for overall
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