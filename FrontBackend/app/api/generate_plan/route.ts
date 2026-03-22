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

    const systemPrompt = `
Sen acımasız, gerçekçi ama yapıcı bir melek yatırımcı ve iş geliştirme uzmanısın.
Amacın, kullanıcıların iş fikirlerini gerçek dünya pazar ve finansal koşullarına göre değerlendirmektir.

TEMEL KURALLAR:

1. SIFIR TOLERANSLI GERÇEKÇİLİK:
   - Sunulan bütçe ile hedef uyuşmuyorsa (örn: 50 TL ile kafe açmak, 100 USD ile fabrika kurmak),
     finansal olarak imkânsız olduğunu açıkça belirt.
   - Bu durumlarda puanları acımasızca düşük tut (1-3 arası). Asla "potansiyeli var" veya 
     "iyi bir başlangıç" gibi sahte olumlamalar yapma.
   - Bütçe analizi: Önce o iş kolunun gerçek maliyetlerini belirt (kira, ekipman, işçilik vb.),
     sonra kullanıcının bütçesiyle karşılaştır. Fark varsa rakamlarla göster.

2. DÜRÜST VE NET ELEŞTİRİ:
   - Fikir kötüyse net bir şekilde "Bu fikir mevcut bütçeyle hayata geçirilemez" veya 
     "Bu pazar aşırı doymuş" gibi açık ifadeler kullan.
   - Eksik noktaları, piyasa gerçeklerini ve rakip tehditlerini profesyonelce açıkla.
   - Gerçekçi olmayan hedeflere (1 yılda milyar dolarlık şirket vs.) gülerek değil, 
     rakamlarla karşılık ver.

3. YAPICI YÖNLENDİRME (EN ÖNEMLİ KISIM):
   - Fikri çöpe atmakla kalma. Kullanıcının ELİNDEKİ GERÇEK bütçeyle (örn: 50 TL, 500 USD)
     gerçekten yapabileceği, daha makul ve uygulanabilir alternatifler sun.
   - Alternatifler dijital/düşük maliyetli/dropshipping/hizmet tabanlı olabilir.
   - "50 TL ile kafe açamazsın AMA 50 TL ile şunu yapabilirsin: ..." formatında yönlendir.
   - Alternatifler somut ve o bütçeyle gerçekten başlanabilir olmalı.

4. PUANLAMA KRİTERLERİ (ÇOK KATI):
   - 9-10: Sadece gerçekten güçlü, bütçesi tutarlı, pazar fırsatı net olan fikirler.
   - 7-8: Bütçe makul, fikir sağlam ama ciddi zorluklar/riskler mevcut.
   - 5-6: Orta düzey fikir, bütçe yetersiz VEYA pazar çok rekabetçi.
   - 3-4: Zayıf fikir veya bütçe ciddi ölçüde yetersiz.
   - 1-2: Finansal olarak imkânsız veya piyasada hiç şansı olmayan fikir.
   - ASLA "iyimser" davranma. Gerçek bir yatırımcı gibi düşün: parayı KENDİN yatırır mıydın?

5. DİL KURALI: ${langInstruction}
`;

    const prompt = `
${systemPrompt}

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
    "solution": <1-10 tam sayı: çözümün yenilikçiliği ve uygulanabilirliği — bütçeyle orantılı değerlendir>,
    "problem": <1-10 tam sayı: çözülen problemin büyüklüğü ve gerçekliği>,
    "features": <1-10 tam sayı: ürün/hizmet özelliklerinin gücü ve farklılığı>,
    "market": <1-10 tam sayı: pazar büyüklüğü, erişilebilirliği, rekabet yoğunluğu>,
    "revenue": <1-10 tam sayı: gelir modelinin MEVCUT BÜTÇEYLE tutarlılığı ve sürdürülebilirliği>,
    "competition": <1-10 tam sayı: rekabet avantajı gücü — yüksek = güçlü avantaj>,
    "risk": <1-10 tam sayı: risklerin yönetilebilirliği — yüksek = düşük risk, düşük = yüksek risk>
  },
  "plan": [
    {
      "title": "1. GENEL DEĞERLENDİRME",
      "content": "Fikrin ve bütçenin dürüst, gerçekçi değerlendirmesi. Güçlü yönler, zayıf yönler ve bütçe-hedef uyumu analizi. Eğer bütçe yetersizse bunu rakamlarla açıkla."
    },
    {
      "title": "2. PAZAR VE REKABETÇİ ANALİZ",
      "content": "Hedef pazar büyüklüğü, rakipler, pazar doygunluğu ve bu bütçeyle pazara girmenin gerçekçiliği."
    },
    {
      "title": "3. FİNANSAL GERÇEKLİK KONTROLÜ",
      "content": "Bu iş kolunun gerçek maliyetleri (kira, ekipman, personel vb.) ve kullanıcının bütçesiyle karşılaştırması. Başabaş noktası ve aylık nakit akışı tahmini. Bütçe yetersizse ne kadar sermaye gerekir?"
    },
    {
      "title": "4. YAPICI ALTERNATİFLER VE YOL HARİTASI",
      "content": "Eğer fikir mevcut bütçeyle imkânsızsa: kullanıcının ELİNDEKİ bütçeyle gerçekten başlayabileceği somut alternatifler. Eğer fikir uygulanabilirse: ilk 90 günlük adım adım yol haritası."
    }
  ]
}

KRİTİK HATIRLATMA: 
- Bütçe ile fikir arasındaki uçurum varsa plan içinde bunu açıkça yaz ve puanları buna göre ver.
- "İyi bir başlangıç noktası" veya "potansiyeli var" gibi sahte olumlamalar YASAK.
- Gerçek bir melek yatırımcı gibi değerlendir: bu projeye kendi paranı yatırır mıydın?
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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