"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useThemeAuth } from "../../context/ThemeAuthContext";
import {
  Sparkles, Loader2, ArrowLeft, Sun, Moon, Rocket, Target,
  TrendingUp, BarChart3, Brain, CheckCircle2, ChevronRight,
  AlertTriangle, XCircle,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface IdeaResult {
  title: string;
  profitPotential: string;
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
  startupComplexityScore: number;
  marketSaturationScore: number;
  whyThisFitsYou: string;
}

// ── Loading steps per language ─────────────────────────────────────────────────
const LOADING_STEPS_MAP: Record<string, string[]> = {
  tr: [
    "Profiliniz analiz ediliyor...",
    "Pazar fırsatları haritalanıyor...",
    "Beceri-fırsat eşleştirmesi yapılıyor...",
    "Kârlılık modelleri hesaplanıyor...",
    "Kişiselleştirilmiş fikirler üretiliyor...",
  ],
  en: [
    "Analyzing your profile...",
    "Mapping market opportunities...",
    "Matching skills to opportunities...",
    "Calculating profitability models...",
    "Generating personalized ideas...",
  ],
  ar: [
    "جارٍ تحليل ملفك الشخصي...",
    "رسم خريطة الفرص السوقية...",
    "مطابقة المهارات مع الفرص...",
    "حساب نماذج الربحية...",
    "توليد أفكار مخصصة...",
  ],
};

// ── Translations ───────────────────────────────────────────────────────────────
const T: Record<string, Record<string, string>> = {
  tr: {
    badge: "Yapay Zeka Fikir Üretimi",
    title: "Sizin İçin Üretilen Fikirler",
    subtitle: "Yapay zeka profilinizi analiz etti ve size özel 3 girişim fırsatı üretti.",
    loading: "Fikirleriniz Üretiliyor",
    back: "Geri",
    home: "Ana Sayfa",
    profit: "Kâr Potansiyeli",
    difficulty: "Zorluk",
    complexity: "Karmaşıklık",
    saturation: "Pazar Doygunluğu",
    whyFits: "Neden Size Uyuyor",
    validate: "Bu Fikri Doğrula",
    beginner: "Başlangıç",
    intermediate: "Orta",
    advanced: "İleri",
    noData: "Profil verisi bulunamadı",
    noDataDesc: "Lütfen fikir üretimi formuna geri dönün ve profilinizi doldurun.",
    goBack: "Forma Dön",
    retry: "Tekrar Dene",
    errorTitle: "Bir hata oluştu",
    ideaLabel: "FİKİR",
  },
  en: {
    badge: "AI Idea Generation",
    title: "Ideas Generated For You",
    subtitle: "Our AI analyzed your profile and generated 3 personalized startup opportunities.",
    loading: "Generating Your Ideas",
    back: "Back",
    home: "Home",
    profit: "Profit Potential",
    difficulty: "Difficulty",
    complexity: "Complexity",
    saturation: "Market Saturation",
    whyFits: "Why This Fits You",
    validate: "Validate This Idea",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    noData: "No profile data found",
    noDataDesc: "Please go back to the idea generation form and fill in your profile.",
    goBack: "Back to Form",
    retry: "Retry",
    errorTitle: "Something went wrong",
    ideaLabel: "IDEA",
  },
  ar: {
    badge: "توليد أفكار بالذكاء الاصطناعي",
    title: "أفكار مولّدة خصيصاً لك",
    subtitle: "حلل الذكاء الاصطناعي ملفك الشخصي وأنتج 3 فرص شركات ناشئة مخصصة.",
    loading: "جارٍ توليد أفكارك",
    back: "عودة",
    home: "الرئيسية",
    profit: "إمكانية الربح",
    difficulty: "الصعوبة",
    complexity: "التعقيد",
    saturation: "تشبع السوق",
    whyFits: "لماذا يناسبك",
    validate: "تحقق من هذه الفكرة",
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
    noData: "لم يتم العثور على بيانات الملف الشخصي",
    noDataDesc: "يرجى العودة إلى نموذج توليد الأفكار وملء ملفك الشخصي.",
    goBack: "العودة إلى النموذج",
    retry: "إعادة المحاولة",
    errorTitle: "حدث خطأ ما",
    ideaLabel: "فكرة",
  },
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function IdeaResultsPage() {
  const router = useRouter();
  const { darkMode, toggleTheme, lang, setLang } = useThemeAuth();
  const d = darkMode;
  const isRTL = lang === "ar";
  const t = T[lang] || T.en;
  const loadingSteps = LOADING_STEPS_MAP[lang] || LOADING_STEPS_MAP.en;

  const [ideas, setIdeas] = useState<IdeaResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [hasInput, setHasInput] = useState(true);
  const hasFetched = useRef(false);
  const inputRef = useRef<any>(null);

  // ── Load input from sessionStorage ─────────────────────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem("idea_generation_input");
    if (!raw) {
      setHasInput(false);
      setLoading(false);
      return;
    }
    try {
      inputRef.current = JSON.parse(raw);
    } catch {
      setHasInput(false);
      setLoading(false);
    }
  }, []);

  // ── Animate loading steps ──────────────────────────────────────────────────
  useEffect(() => {
    if (!loading || !hasInput) return;
    const interval = setInterval(() => {
      setLoadingStep((s) => (s < loadingSteps.length - 1 ? s + 1 : s));
    }, 2400);
    return () => clearInterval(interval);
  }, [loading, hasInput, loadingSteps.length]);

  // ── Fetch ideas ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasInput || !inputRef.current || hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      try {
        const res = await fetch("/api/generate-ideas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...inputRef.current, language: lang }),
        });
        if (!res.ok) throw new Error("API error");
        const json = await res.json();
        if (json.status === "error") throw new Error(json.message);
        setIdeas(json.ideas || []);
      } catch (e: any) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, [hasInput, lang]);

  // ── Handle validate click ──────────────────────────────────────────────────
  function handleValidate(idea: IdeaResult) {
    sessionStorage.setItem(
      "selected_idea_for_validation",
      JSON.stringify({ title: idea.title, description: idea.whyThisFitsYou })
    );
    router.push("/validation");
  }

  // ── Language / theme helpers ───────────────────────────────────────────────
  function getLangLabel() { return lang === "tr" ? "EN" : lang === "en" ? "AR" : "TR"; }
  function toggleLang() { setLang(lang === "tr" ? "en" : lang === "en" ? "ar" : "tr"); }

  // ── Color tokens ──────────────────────────────────────────────────────────
  const pageBg = d ? "bg-gray-950" : "bg-gray-50";
  const cardBg = d ? "bg-gray-900/80 border-gray-800 backdrop-blur-xl" : "bg-white/80 border-gray-200 backdrop-blur-xl";
  const textPrimary = d ? "text-gray-100" : "text-gray-900";
  const textSecondary = d ? "text-gray-400" : "text-gray-500";
  const textMuted = d ? "text-gray-500" : "text-gray-400";
  const navBg = d ? "bg-gray-950/95 border-gray-800" : "bg-white/95 border-gray-100";

  function getDifficultyBadge(level: string) {
    const lbl = level === "Beginner" ? t.beginner : level === "Advanced" ? t.advanced : t.intermediate;
    if (level === "Beginner") return { label: lbl, cls: d ? "bg-emerald-950/60 text-emerald-400 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (level === "Advanced") return { label: lbl, cls: d ? "bg-red-950/60 text-red-400 border-red-800" : "bg-red-50 text-red-700 border-red-200" };
    return { label: lbl, cls: d ? "bg-amber-950/60 text-amber-400 border-amber-800" : "bg-amber-50 text-amber-700 border-amber-200" };
  }

  function getScoreColor(score: number) {
    if (score <= 3) return d ? "text-emerald-400" : "text-emerald-600";
    if (score <= 6) return d ? "text-amber-400" : "text-amber-600";
    return d ? "text-red-400" : "text-red-600";
  }

  function getScoreBarColor(score: number) {
    if (score <= 3) return "from-emerald-500 to-emerald-400";
    if (score <= 6) return "from-amber-500 to-yellow-400";
    return "from-red-500 to-orange-400";
  }

  // ── Shared Navbar ─────────────────────────────────────────────────────────
  const navbar = (
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
          <button onClick={() => router.push("/idea-generation")} className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs border no-underline transition ${d ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"}`}>
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.back}
          </button>
        </div>
      </div>
    </nav>
  );

  // ── No input data state ───────────────────────────────────────────────────
  if (!hasInput && !loading) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen ${pageBg} flex items-center justify-center px-6`}>
        <div className={`max-w-md w-full p-10 rounded-3xl border text-center ${cardBg}`}>
          <div className={`mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center ${d ? "bg-amber-950/50" : "bg-amber-50"}`}>
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className={`text-xl font-black mb-2 ${textPrimary}`}>{t.noData}</h2>
          <p className={`text-sm mb-6 ${textSecondary}`}>{t.noDataDesc}</p>
          <button onClick={() => router.push("/idea-generation")} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-all">
            {t.goBack}
          </button>
        </div>
      </div>
    );
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen ${pageBg}`}>
        {navbar}
        <div className="flex items-center justify-center px-6 py-24">
          <div className={`max-w-lg w-full p-10 rounded-3xl border text-center ${cardBg}`} style={{ animation: "fadeInScale 0.5s cubic-bezier(0.16,1,0.3,1) forwards" }}>
            <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
            <h2 className={`text-2xl font-black mb-3 ${textPrimary}`} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.loading}</h2>
            <div className="space-y-3 text-left mt-6">
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

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen ${pageBg} flex items-center justify-center px-6`}>
        <div className={`max-w-md w-full p-10 rounded-3xl border text-center ${cardBg}`}>
          <div className={`mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center ${d ? "bg-red-950/50" : "bg-red-50"}`}>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className={`text-xl font-black mb-2 ${textPrimary}`}>{t.errorTitle}</h2>
          <p className={`text-sm mb-6 ${textSecondary}`}>{error}</p>
          <button
            onClick={() => { hasFetched.current = false; setError(""); setLoading(true); setLoadingStep(0); }}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-all"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen ${pageBg} transition-colors duration-300`}>
      {navbar}

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10" style={{ animation: "fadeSlideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards" }}>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 border ${d ? "bg-emerald-950/40 border-emerald-900 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}>
            <Sparkles className="w-3.5 h-3.5" />{t.badge}
          </div>
          <h1 className={`text-3xl md:text-4xl font-black mb-2 tracking-tight ${textPrimary}`} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.title}</h1>
          <p className={`text-sm max-w-lg mx-auto ${textSecondary}`}>{t.subtitle}</p>
        </div>

        {/* Idea Cards */}
        <div className="grid grid-cols-1 gap-6">
          {ideas.map((idea, idx) => {
            const diffBadge = getDifficultyBadge(idea.difficultyLevel);
            return (
              <div
                key={idx}
                className={`rounded-3xl border p-7 md:p-8 ${cardBg} transition-all duration-300 hover:shadow-lg ${d ? "hover:shadow-emerald-500/5" : "hover:shadow-emerald-500/10"}`}
                style={{ animation: `fadeSlideIn ${0.35 + idx * 0.12}s cubic-bezier(0.16,1,0.3,1) forwards` }}
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${d ? "bg-emerald-950/60 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                      {idx === 0 ? <Target className="w-5 h-5" /> : idx === 1 ? <TrendingUp className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{t.ideaLabel} {idx + 1}</span>
                      <h2 className={`text-lg md:text-xl font-black ${textPrimary} leading-tight`}>{idea.title}</h2>
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0 ${diffBadge.cls}`}>
                    {diffBadge.label}
                  </div>
                </div>

                {/* Profit Potential */}
                <div className={`rounded-2xl border p-5 mb-5 ${d ? "bg-gray-800/40 border-gray-700/50" : "bg-gray-50/80 border-gray-100"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className={`w-4 h-4 ${d ? "text-sky-400" : "text-sky-600"}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${d ? "text-sky-400" : "text-sky-600"}`}>{t.profit}</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${textSecondary}`}>{idea.profitPotential}</p>
                </div>

                {/* Scores Row */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {/* Complexity */}
                  <div className={`rounded-2xl border p-4 ${d ? "bg-gray-800/40 border-gray-700/50" : "bg-gray-50/80 border-gray-100"}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${textMuted}`}>{t.complexity}</span>
                    <div className="flex items-end gap-1.5">
                      <span className={`text-2xl font-black tabular-nums ${getScoreColor(idea.startupComplexityScore)}`}>{idea.startupComplexityScore}</span>
                      <span className={`text-xs font-bold mb-0.5 ${textMuted}`}>/10</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden mt-2 ${d ? "bg-gray-700" : "bg-gray-200"}`}>
                      <div className={`h-full rounded-full bg-gradient-to-r ${getScoreBarColor(idea.startupComplexityScore)} transition-all duration-1000 ease-out`} style={{ width: `${idea.startupComplexityScore * 10}%` }} />
                    </div>
                  </div>
                  {/* Saturation */}
                  <div className={`rounded-2xl border p-4 ${d ? "bg-gray-800/40 border-gray-700/50" : "bg-gray-50/80 border-gray-100"}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${textMuted}`}>{t.saturation}</span>
                    <div className="flex items-end gap-1.5">
                      <span className={`text-2xl font-black tabular-nums ${getScoreColor(idea.marketSaturationScore)}`}>{idea.marketSaturationScore}</span>
                      <span className={`text-xs font-bold mb-0.5 ${textMuted}`}>/10</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden mt-2 ${d ? "bg-gray-700" : "bg-gray-200"}`}>
                      <div className={`h-full rounded-full bg-gradient-to-r ${getScoreBarColor(idea.marketSaturationScore)} transition-all duration-1000 ease-out`} style={{ width: `${idea.marketSaturationScore * 10}%` }} />
                    </div>
                  </div>
                </div>

                {/* Why This Fits You */}
                <div className={`rounded-2xl border p-5 mb-6 ${d ? "bg-gray-800/40 border-gray-700/50" : "bg-gray-50/80 border-gray-100"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className={`w-4 h-4 ${d ? "text-violet-400" : "text-violet-600"}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${d ? "text-violet-400" : "text-violet-600"}`}>{t.whyFits}</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${textSecondary}`}>{idea.whyThisFitsYou}</p>
                </div>

                {/* Validate Button */}
                <button
                  id={`validate-idea-${idx}`}
                  onClick={() => handleValidate(idea)}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-all duration-200 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98]"
                >
                  <Rocket className="w-4 h-4" />
                  {t.validate}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Back to form */}
        <div className="flex justify-center mt-10" style={{ animation: "fadeSlideIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards" }}>
          <button onClick={() => router.push("/idea-generation")} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm border transition-all ${d ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
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
