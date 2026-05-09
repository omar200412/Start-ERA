"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useThemeAuth } from "../context/ThemeAuthContext";
import {
  TrendingUp, Shield, DollarSign, Scale, Loader2, ArrowLeft,
  Sun, Moon, CheckCircle2, AlertTriangle, XCircle, BarChart3,
  Sparkles, ChevronRight, Rocket,
} from "lucide-react";

interface ValidationData {
  demandTrendScore: number;
  competitionIntensity: "Low" | "Medium" | "High";
  estimatedRevenueRange: string;
  localRegulationNotes: string;
}

interface SelectedIdea {
  title: string;
  description: string;
}

const LOADING_STEPS_MAP: Record<string, string[]> = {
  tr: ["Pazar talebi analiz ediliyor...", "Yerel rekabet taranıyor...", "Gelir potansiyeli hesaplanıyor...", "Yerel düzenlemeler inceleniyor...", "Sonuçlar derleniyor..."],
  en: ["Analyzing market demand...", "Scanning local competition...", "Calculating revenue potential...", "Reviewing local regulations...", "Compiling results..."],
  ar: ["تحليل الطلب في السوق...", "فحص المنافسة المحلية...", "حساب إمكانية الإيرادات...", "مراجعة اللوائح المحلية...", "تجميع النتائج..."],
};

const T: Record<string, Record<string, string>> = {
  tr: { title: "Pazar Doğrulama", subtitle: "Girişim fikrinizin pazar analizi", back: "Geri", demandTitle: "Talep Trendi Puanı", compTitle: "Rekabet Yoğunluğu", revTitle: "Tahmini Gelir Aralığı", regTitle: "Yerel Düzenleme Notları", low: "Düşük", medium: "Orta", high: "Yüksek", monthly: "/ay", validating: "Fikriniz Doğrulanıyor", goBack: "Fikirlere Dön", noData: "Seçili fikir bulunamadı", noDataDesc: "Lütfen fikirler sayfasına dönün ve bir fikir seçin.", badge: "Yapay Zeka Doğrulaması", demandDesc: "Mevcut pazar talebini ölçer", compDesc: "Pazardaki rekabet seviyesi", revDesc: "İlk 6-12 ay tahmini", regDesc: "İşletme türüne özel yasal gereksinimler", proceedToLaunch: "Lansman Sistemine Geç" },
  en: { title: "Market Validation", subtitle: "Market analysis of your startup idea", back: "Back", demandTitle: "Demand Trend Score", compTitle: "Competition Intensity", revTitle: "Estimated Revenue Range", regTitle: "Local Regulation Notes", low: "Low", medium: "Medium", high: "High", monthly: "/mo", validating: "Validating Your Idea", goBack: "Back to Ideas", noData: "No idea selected", noDataDesc: "Please go back to the ideas page and select an idea.", badge: "AI Validation", demandDesc: "Measures current market demand", compDesc: "Level of competition in this market", revDesc: "Projected first 6-12 months", regDesc: "Legal requirements specific to this business type", proceedToLaunch: "Proceed to Launch System" },
  ar: { title: "التحقق من السوق", subtitle: "تحليل السوق لفكرة شركتك الناشئة", back: "عودة", demandTitle: "درجة اتجاه الطلب", compTitle: "شدة المنافسة", revTitle: "نطاق الإيرادات المقدر", regTitle: "ملاحظات التنظيم المحلي", low: "منخفضة", medium: "متوسطة", high: "عالية", monthly: "/شهر", validating: "جارٍ التحقق من فكرتك", goBack: "العودة للأفكار", noData: "لم يتم اختيار فكرة", noDataDesc: "يرجى العودة إلى صفحة الأفكار واختيار فكرة.", badge: "تحقق بالذكاء الاصطناعي", demandDesc: "يقيس الطلب الحالي في السوق", compDesc: "مستوى المنافسة في هذا السوق", revDesc: "التوقعات لأول 6-12 شهر", regDesc: "المتطلبات القانونية الخاصة بهذا النوع من الأعمال", proceedToLaunch: "انتقل إلى نظام الإطلاق" },
};

export default function ValidationPage() {
  const router = useRouter();
  const { darkMode, toggleTheme, lang, setLang } = useThemeAuth();
  const d = darkMode;
  const isRTL = lang === "ar";
  const t = T[lang] || T.en;
  const loadingSteps = LOADING_STEPS_MAP[lang] || LOADING_STEPS_MAP.en;

  const [idea, setIdea] = useState<SelectedIdea | null>(null);
  const [formInput, setFormInput] = useState<any>(null);
  const [data, setData] = useState<ValidationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const hasFetched = useRef(false);

  // Load from sessionStorage
  useEffect(() => {
    const raw = sessionStorage.getItem("selected_idea_for_validation");
    const inputRaw = sessionStorage.getItem("idea_generation_input");
    if (!raw) { setLoading(false); return; }
    try {
      setIdea(JSON.parse(raw));
      if (inputRaw) setFormInput(JSON.parse(inputRaw));
    } catch { setLoading(false); }
  }, []);

  // Animate loading steps
  useEffect(() => {
    if (!loading || !idea) return;
    const interval = setInterval(() => {
      setLoadingStep((s) => (s < loadingSteps.length - 1 ? s + 1 : s));
    }, 2200);
    return () => clearInterval(interval);
  }, [loading, idea, loadingSteps.length]);

  // Fetch validation
  useEffect(() => {
    if (!idea || hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      try {
        const res = await fetch("/api/validate-idea", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idea: `${idea.title}: ${idea.description}`,
            location: formInput?.location || "Not specified",
            budget: formInput?.budget || "Not specified",
            language: lang,
          }),
        });
        if (!res.ok) throw new Error("API error");
        const json = await res.json();
        if (json.status === "error") throw new Error(json.message);
        setData(json);
      } catch (e: any) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, [idea, formInput, lang]);

  function getLangLabel() { return lang === "tr" ? "EN" : lang === "en" ? "AR" : "TR"; }
  function toggleLang() { setLang(lang === "tr" ? "en" : lang === "en" ? "ar" : "tr"); }

  // Color tokens
  const pageBg = d ? "bg-gray-950" : "bg-gray-50";
  const cardBg = d ? "bg-gray-900/80 border-gray-800 backdrop-blur-xl" : "bg-white/80 border-gray-200 backdrop-blur-xl";
  const textPrimary = d ? "text-gray-100" : "text-gray-900";
  const textSecondary = d ? "text-gray-400" : "text-gray-500";
  const textMuted = d ? "text-gray-500" : "text-gray-400";
  const navBg = d ? "bg-gray-950/95 border-gray-800" : "bg-white/95 border-gray-100";

  function getDemandColor(score: number) {
    if (score >= 70) return { bar: "from-emerald-500 to-emerald-400", text: "text-emerald-500", bg: d ? "bg-emerald-950/40" : "bg-emerald-50" };
    if (score >= 40) return { bar: "from-amber-500 to-yellow-400", text: "text-amber-500", bg: d ? "bg-amber-950/40" : "bg-amber-50" };
    return { bar: "from-red-500 to-orange-400", text: "text-red-500", bg: d ? "bg-red-950/40" : "bg-red-50" };
  }

  function getCompBadge(intensity: string) {
    const lbl = intensity === "Low" ? t.low : intensity === "High" ? t.high : t.medium;
    if (intensity === "Low") return { label: lbl, icon: <CheckCircle2 className="w-4 h-4" />, cls: d ? "bg-emerald-950/60 text-emerald-400 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (intensity === "High") return { label: lbl, icon: <XCircle className="w-4 h-4" />, cls: d ? "bg-red-950/60 text-red-400 border-red-800" : "bg-red-50 text-red-700 border-red-200" };
    return { label: lbl, icon: <AlertTriangle className="w-4 h-4" />, cls: d ? "bg-amber-950/60 text-amber-400 border-amber-800" : "bg-amber-50 text-amber-700 border-amber-200" };
  }

  // ── No idea selected ──
  if (!loading && !idea) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen ${pageBg} flex items-center justify-center px-6`}>
        <div className={`max-w-md w-full p-10 rounded-3xl border text-center ${cardBg}`}>
          <div className={`mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center ${d ? "bg-amber-950/50" : "bg-amber-50"}`}>
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className={`text-xl font-black mb-2 ${textPrimary}`}>{t.noData}</h2>
          <p className={`text-sm mb-6 ${textSecondary}`}>{t.noDataDesc}</p>
          <button onClick={() => router.push("/idea-generation/results")} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-all">
            {t.goBack}
          </button>
        </div>
      </div>
    );
  }

  // ── Loading state ──
  if (loading) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen ${pageBg}`}>
        <nav className={`sticky top-0 z-40 border-b backdrop-blur-md ${navBg}`}>
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 no-underline">
              <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
              <span className={`text-base font-black ${textPrimary}`}>Start ERA</span>
            </a>
          </div>
        </nav>
        <div className="flex items-center justify-center px-6 py-24">
          <div className={`max-w-lg w-full p-10 rounded-3xl border text-center ${cardBg}`} style={{ animation: "fadeInScale 0.5s cubic-bezier(0.16,1,0.3,1) forwards" }}>
            <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
            <h2 className={`text-2xl font-black mb-3 ${textPrimary}`} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.validating}</h2>
            {idea && <p className={`text-sm mb-8 font-medium ${textSecondary}`}>{idea.title}</p>}
            <div className="space-y-3 text-left">
              {loadingSteps.map((step, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500 ${i <= loadingStep ? (d ? "bg-gray-800/60" : "bg-gray-100") : "opacity-30"}`}>
                  {i < loadingStep ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : i === loadingStep ? (
                    <Loader2 className="w-4 h-4 text-emerald-500 animate-spin flex-shrink-0" />
                  ) : (
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${d ? "border-gray-700" : "border-gray-300"}`} />
                  )}
                  <span className={`text-sm font-medium ${i <= loadingStep ? textPrimary : textMuted}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@keyframes fadeInScale{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}`}</style>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen ${pageBg} flex items-center justify-center px-6`}>
        <div className={`max-w-md w-full p-10 rounded-3xl border text-center ${cardBg}`}>
          <div className={`mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center ${d ? "bg-red-950/50" : "bg-red-50"}`}>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className={`text-xl font-black mb-2 ${textPrimary}`}>Error</h2>
          <p className={`text-sm mb-6 ${textSecondary}`}>{error}</p>
          <button onClick={() => { hasFetched.current = false; setError(""); setLoading(true); setLoadingStep(0); }} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-all">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const demandColor = getDemandColor(data.demandTrendScore);
  const compBadge = getCompBadge(data.competitionIntensity);

  // ── Dashboard ──
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen ${pageBg} transition-colors duration-300`}>
      {/* Navbar */}
      <nav className={`sticky top-0 z-40 border-b backdrop-blur-md ${navBg}`}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 no-underline">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
            <span className={`text-base font-black ${textPrimary}`}>Start ERA</span>
          </a>
          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition ${d ? "border-gray-700 text-gray-300 hover:border-green-600" : "border-gray-200 text-gray-600 hover:border-green-500"}`}>
              {getLangLabel()}
            </button>
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition flex items-center text-xs font-medium border ${d ? "border-gray-700 text-yellow-400 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
              {d ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => router.push("/idea-generation/results")} className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs border no-underline transition ${d ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"}`}>
              <ArrowLeft className="w-3.5 h-3.5" />
              {t.back}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10" style={{ animation: "fadeSlideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards" }}>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 border ${d ? "bg-emerald-950/40 border-emerald-900 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}>
            <Sparkles className="w-3.5 h-3.5" />{t.badge}
          </div>
          <h1 className={`text-3xl md:text-4xl font-black mb-2 tracking-tight ${textPrimary}`} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.title}</h1>
          <p className={`text-sm max-w-md mx-auto ${textSecondary}`}>{t.subtitle}</p>
          {idea && (
            <div className={`mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-bold border ${d ? "bg-gray-800/60 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}>
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              {idea.title}
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ animation: "fadeSlideIn 0.45s cubic-bezier(0.16,1,0.3,1) forwards" }}>
          {/* Demand Score */}
          <div className={`rounded-3xl border p-7 ${cardBg}`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${demandColor.bg}`}>
                <TrendingUp className={`w-5 h-5 ${demandColor.text}`} />
              </div>
              <div>
                <h3 className={`text-sm font-black ${textPrimary}`}>{t.demandTitle}</h3>
                <p className={`text-xs ${textMuted}`}>{t.demandDesc}</p>
              </div>
            </div>
            <div className="flex items-end gap-3 mb-4">
              <span className={`text-5xl font-black tabular-nums ${demandColor.text}`}>{data.demandTrendScore}</span>
              <span className={`text-lg font-bold mb-1 ${textMuted}`}>/100</span>
            </div>
            <div className={`w-full h-3 rounded-full overflow-hidden ${d ? "bg-gray-800" : "bg-gray-200"}`}>
              <div className={`h-full rounded-full bg-gradient-to-r ${demandColor.bar} transition-all duration-1000 ease-out`} style={{ width: `${data.demandTrendScore}%` }} />
            </div>
          </div>

          {/* Competition */}
          <div className={`rounded-3xl border p-7 ${cardBg}`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d ? "bg-violet-950/40" : "bg-violet-50"}`}>
                <Shield className={`w-5 h-5 ${d ? "text-violet-400" : "text-violet-600"}`} />
              </div>
              <div>
                <h3 className={`text-sm font-black ${textPrimary}`}>{t.compTitle}</h3>
                <p className={`text-xs ${textMuted}`}>{t.compDesc}</p>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-base font-black ${compBadge.cls}`}>
              {compBadge.icon}
              {compBadge.label}
            </div>
          </div>

          {/* Revenue */}
          <div className={`rounded-3xl border p-7 ${cardBg}`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d ? "bg-sky-950/40" : "bg-sky-50"}`}>
                <DollarSign className={`w-5 h-5 ${d ? "text-sky-400" : "text-sky-600"}`} />
              </div>
              <div>
                <h3 className={`text-sm font-black ${textPrimary}`}>{t.revTitle}</h3>
                <p className={`text-xs ${textMuted}`}>{t.revDesc}</p>
              </div>
            </div>
            <p className={`text-2xl font-black ${d ? "text-sky-400" : "text-sky-600"}`}>{data.estimatedRevenueRange}</p>
          </div>

          {/* Regulations */}
          <div className={`rounded-3xl border p-7 ${cardBg}`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d ? "bg-amber-950/40" : "bg-amber-50"}`}>
                <Scale className={`w-5 h-5 ${d ? "text-amber-400" : "text-amber-600"}`} />
              </div>
              <div>
                <h3 className={`text-sm font-black ${textPrimary}`}>{t.regTitle}</h3>
                <p className={`text-xs ${textMuted}`}>{t.regDesc}</p>
              </div>
            </div>
            <p className={`text-sm leading-relaxed ${textSecondary}`}>{data.localRegulationNotes}</p>
          </div>
        </div>

        {/* Launch CTA */}
        <div className="mt-10" style={{ animation: "fadeSlideIn 0.55s cubic-bezier(0.16,1,0.3,1) forwards" }}>
          <button onClick={() => router.push('/launch')} id="proceed-to-launch-btn"
            className="group relative flex items-center justify-center gap-3 w-full md:w-auto md:mx-auto px-10 py-4 rounded-2xl font-black text-base text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] border-0 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #059669, #10b981, #34d399)" }}>
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            <Rocket className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-8deg]" />
            <span className="relative z-10">{t.proceedToLaunch}</span>
            <ChevronRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Back CTA */}
        <div className="flex justify-center mt-5" style={{ animation: "fadeSlideIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards" }}>
          <button onClick={() => router.push("/idea-generation/results")} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm border transition-all ${d ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
            <ArrowLeft className="w-4 h-4" />
            {t.goBack}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeInScale{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
      `}</style>
    </div>
  );
}
