"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useThemeAuth } from "../context/ThemeAuthContext";
import { TRANSLATIONS } from "../lib/translations";

// ── Icon components (all decorative → aria-hidden) ─────────────────────────────
function SunIcon() {
  return <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
}
function MoonIcon() {
  return <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
}
function SparkleIcon() {
  return <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" /></svg>;
}
function DownloadIcon() {
  return <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
}
function TrendingIcon() {
  return <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
}
function StarIcon() {
  return <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface Scores {
  overall: number;
  solution: number;
  problem: number;
  features: number;
  market: number;
  revenue: number;
  competition: number;
  risk: number;
}
interface PlanSection { title: string; content: string; }

// ── Safely parse whatever the API returns into {plan, scores} ──────────────
function parseApiResponse(data: any): { plan: PlanSection[]; scores: Scores | null } {
  let plan: PlanSection[] = [];
  let scores: Scores | null = data.scores || null;

  const rawPlan = data.plan;

  if (Array.isArray(rawPlan)) {
    plan = rawPlan;
  } else if (typeof rawPlan === "string") {
    const cleaned = rawPlan
      .replace(/^```json\s*/m, "")
      .replace(/^```\s*/m, "")
      .replace(/\s*```$/m, "")
      .trim();
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        plan = parsed;
      } else if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.plan)) plan = parsed.plan;
        if (parsed.scores && !scores) scores = parsed.scores;
      }
    } catch {
      plan = [{ title: "Plan", content: cleaned }];
    }
  }

  return { plan, scores };
}

// ── Recalculate overall from the 7 dimension scores ───────────────────────
function recalcOverall(s: Scores): Scores {
  const keys: (keyof Scores)[] = ["solution", "problem", "features", "market", "revenue", "competition", "risk"];
  const sum = keys.reduce((acc, k) => acc + s[k], 0);
  return { ...s, overall: Math.round((sum / keys.length) * 10) / 10 };
}

// ── Circular score ring ────────────────────────────────────────────────────
function CircleScore({ score, size = 56, isDark }: { score: number; size?: number; isDark: boolean }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.min(10, Math.max(0, score));
  const offset = circumference - (safeScore / 10) * circumference;
  const color = safeScore >= 8 ? "#16a34a" : safeScore >= 6 ? "#ca8a04" : "#dc2626";
  const bgColor = isDark ? "#1f2937" : "#e5e7eb";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }} role="img" aria-label={`Score: ${safeScore}/10`}>
      <svg aria-hidden="true" width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={bgColor} strokeWidth={4} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-sm font-black" style={{ color }} aria-hidden="true">{safeScore}</span>
    </div>
  );
}

function LargeCircleScore({ score, isDark, lang }: { score: number; isDark: boolean; lang: string }) {
  const size = 88;
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.min(10, Math.max(0, score));
  const offset = circumference - (safeScore / 10) * circumference;
  const color = safeScore >= 8 ? "#16a34a" : safeScore >= 6 ? "#ca8a04" : "#dc2626";
  const bgColor = isDark ? "#1f2937" : "#e5e7eb";
  const label = safeScore >= 8
    ? (lang === "tr" ? "Mükemmel" : lang === "ar" ? "ممتاز" : "Excellent")
    : safeScore >= 6
    ? (lang === "tr" ? "İyi" : lang === "ar" ? "جيد" : "Good")
    : safeScore >= 4
    ? (lang === "tr" ? "Orta" : lang === "ar" ? "متوسط" : "Fair")
    : (lang === "tr" ? "Zayıf" : lang === "ar" ? "ضعيف" : "Poor");
  const overallLabel = lang === "tr" ? "Genel Puan" : lang === "ar" ? "الدرجة الكلية" : "Overall Score";
  return (
    <div className="flex items-center gap-4" role="img" aria-label={`${overallLabel}: ${safeScore}/10 — ${label}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg aria-hidden="true" width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={bgColor} strokeWidth={6} />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={6}
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="absolute text-center" aria-hidden="true">
          <div className="text-xl font-black" style={{ color }}>{safeScore}</div>
          <div className={"text-[9px] font-bold " + (isDark ? "text-gray-400" : "text-gray-500")}>/10</div>
        </div>
      </div>
      <div aria-hidden="true">
        <div className="text-lg font-black" style={{ color }}>{label}</div>
        <div className={"text-xs " + (isDark ? "text-gray-300" : "text-gray-600")}>{overallLabel}</div>
      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────
function Skeleton({ className }: { className: string }) {
  return <div className={"rounded-lg animate-pulse " + className} />;
}
function SkeletonResults({ isDark }: { isDark: boolean }) {
  const bg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const sk = isDark ? "bg-gray-700" : "bg-gray-200";
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="Loading results">
      <div className="lg:col-span-2 space-y-5">
        <div className={"rounded-2xl border p-6 " + bg}>
          <div className="flex items-center gap-2 mb-5">
            <Skeleton className={"w-4 h-4 " + sk} /><Skeleton className={"h-4 w-32 " + sk} />
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <Skeleton className={"w-20 h-20 rounded-full " + sk} />
            <div className="flex gap-4 flex-wrap">
              {[1,2,3,4,5,6,7].map(i => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <Skeleton className={"w-12 h-12 rounded-full " + sk} />
                  <Skeleton className={"h-2 w-10 " + sk} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {[1,2,3,4].map(i => (
          <div key={i} className={"rounded-2xl border p-6 " + bg}>
            <div className="flex items-center gap-2 mb-4"><Skeleton className={"w-4 h-4 " + sk} /><Skeleton className={"h-4 w-40 " + sk} /></div>
            <div className={"rounded-xl p-5 " + (isDark ? "bg-gray-800" : "bg-gray-50")}>
              <div className="space-y-2">
                <Skeleton className={"h-3 w-full " + sk} /><Skeleton className={"h-3 w-5/6 " + sk} /><Skeleton className={"h-3 w-4/6 " + sk} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <Skeleton className={"h-12 rounded-xl " + sk} />
        <Skeleton className={"h-12 rounded-xl " + sk} />
        <Skeleton className={"h-12 rounded-xl " + sk} />
        <div className={"rounded-2xl border p-5 " + bg}>
          <Skeleton className={"h-4 w-32 mb-4 " + sk} />
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <Skeleton className={"h-3 w-20 " + sk} />
              <Skeleton className={"h-2 flex-1 rounded-full " + sk} />
              <Skeleton className={"h-3 w-4 " + sk} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionIcon({ title }: { title: string }) {
  const t = (title || "").toLowerCase();
  if (t.includes("market") || t.includes("pazar") || t.includes("سوق") || t.includes("rekabet")) return <TrendingIcon />;
  if (t.includes("finans") || t.includes("financial") || t.includes("مالي") || t.includes("yatırım")) {
    return <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  }
  if (t.includes("operat") || t.includes("yönetim") || t.includes("إدارة") || t.includes("alternatif")) {
    return <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
  }
  return <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
}

// ── Page component ─────────────────────────────────────────────────────────────
export default function PlannerPage() {
  const router = useRouter();
  const { user, darkMode, toggleTheme, lang, setLang } = useThemeAuth();
  const t = TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [planResult, setPlanResult] = useState<PlanSection[] | null>(null);
  const [scores, setScores] = useState<Scores | null>(null);
  const [formData, setFormData] = useState({ idea: "", capital: "", skills: "", strategy: "", management: "", language: lang });

  useEffect(() => { setFormData(prev => ({ ...prev, language: lang })); }, [lang]);
  useEffect(() => {
    const saved = sessionStorage.getItem("planner_form");
    if (saved) { try { setFormData(prev => ({ ...prev, ...JSON.parse(saved) })); } catch {} }
  }, []);
  useEffect(() => {
    sessionStorage.setItem("planner_form", JSON.stringify(formData));
  }, [formData]);

  const isDark = darkMode;

  // ── Language cycle ────────────────────────────────────────────────────────
  function getLangLabel() {
    if (lang === "tr") return "EN"; if (lang === "en") return "AR"; return "TR";
  }
  function toggleLang() {
    if (lang === "tr") { setLang("en"); return; }
    if (lang === "en") { setLang("ar"); return; }
    setLang("tr");
  }

  // ── Translated labels ─────────────────────────────────────────────────────
  const switchLangLabel  = lang === "tr" ? "Dili değiştir" : lang === "ar" ? "تغيير اللغة" : "Switch language";
  const toggleThemeLabel = isDark
    ? (lang === "tr" ? "Aydınlık moda geç" : lang === "ar" ? "التبديل إلى الوضع الفاتح" : "Switch to light mode")
    : (lang === "tr" ? "Karanlık moda geç" : lang === "ar" ? "التبديل إلى الوضع الداكن" : "Switch to dark mode");
  const lightLabel     = lang === "tr" ? "Aydınlık"        : lang === "ar" ? "فاتح"               : "Light";
  const darkLabel      = lang === "tr" ? "Karanlık"        : lang === "ar" ? "داكن"               : "Dark";
  const evalLabel      = lang === "tr" ? "Değerlendirme Puanları" : lang === "ar" ? "درجات التقييم" : "Evaluation Scores";
  const aiEvalLabel    = lang === "tr" ? "Yapay Zeka Değerlendirmesi" : lang === "ar" ? "تقييم الذكاء الاصطناعي" : "AI Evaluation";
  const startLabel     = lang === "tr" ? "Planı Uygula"    : lang === "ar" ? "ابدأ التنفيذ"       : "Start Building Now";
  const downloadLabel  = lang === "tr" ? "Analizi İndir"   : lang === "ar" ? "تنزيل التحليل"      : "Download Analysis";
  const newPlanLabel   = lang === "tr" ? "Yeni Plan"       : lang === "ar" ? "خطة جديدة"          : "New Plan";
  const pageTitle      = lang === "tr" ? "İş Planı Oluşturucu" : lang === "ar" ? "منشئ خطة العمل" : "Business Plan Generator";

  const scoreKeys: (keyof Scores)[] = ["solution","problem","features","market","revenue","competition","risk"];
  const scoreLabels: Record<string, string> = {
    solution:    lang === "tr" ? "Çözüm"      : lang === "ar" ? "الحل"         : "Solution",
    problem:     lang === "tr" ? "Problem"    : lang === "ar" ? "المشكلة"      : "Problem",
    features:    lang === "tr" ? "Özellikler" : lang === "ar" ? "الميزات"      : "Features",
    market:      lang === "tr" ? "Pazar"      : lang === "ar" ? "السوق"        : "Market",
    revenue:     lang === "tr" ? "Gelir"      : lang === "ar" ? "الإيرادات"    : "Revenue",
    competition: lang === "tr" ? "Rekabet"    : lang === "ar" ? "المنافسة"     : "Competition",
    risk:        lang === "tr" ? "Risk"       : lang === "ar" ? "المخاطر"      : "Risk",
  };

  // ── Color tokens (WCAG-fixed) ─────────────────────────────────────────────
  const bg      = isDark ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900";
  const navBg   = isDark ? "bg-gray-950/95 border-gray-800" : "bg-white/95 border-gray-200";
  const card    = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const sub     = isDark ? "text-gray-300" : "text-gray-600";
  const subFine = isDark ? "text-gray-400" : "text-gray-500";
  const bdr     = isDark ? "border-gray-800" : "border-gray-200";
  const txBg    = isDark ? "bg-gray-800 text-gray-100 placeholder-gray-500 border-gray-700 focus:bg-gray-900" : "bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200 focus:bg-white";
  const progrBg = isDark ? "bg-gray-800" : "bg-gray-200";
  const innerBg = isDark ? "bg-gray-800/60" : "bg-green-50/60";

  // ── Wizard logic ──────────────────────────────────────────────────────────
  const currentQuestion = t.questions[step - 1];

  function handleValidationRedirect() {
    // Extract location from the idea text (step 1) — the idea field typically contains location context
    sessionStorage.setItem(
      "idea_generation_input",
      JSON.stringify({ location: formData.idea, budget: formData.capital })
    );
    sessionStorage.setItem(
      "selected_idea_for_validation",
      JSON.stringify({ title: "Custom Startup Idea", description: formData.idea })
    );
    router.push("/validation");
  }

  function handleNext() {
    const val = formData[currentQuestion.key as keyof typeof formData];
    if (!val?.trim()) { toast.error(t.err_empty); return; }
    if (step < 5) setStep(step + 1);
    else handleValidationRedirect();
  }

  async function generatePlan() {
    setLoading(true);
    setShowSkeleton(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoadingStatus(t.status_gathering);
    setTimeout(() => setLoadingStatus(t.status_generating), 1500);

    try {
      const res = await fetch("/api/generate_plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, language: lang }),
      });
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();

      const { plan: finalPlan, scores: rawScores } = parseApiResponse(data);

      let finalScores: Scores | null = null;
      if (rawScores) {
        const keys: (keyof Scores)[] = ["solution","problem","features","market","revenue","competition","risk"];
        const clamped: any = { ...rawScores };
        for (const k of keys) {
          clamped[k] = Math.min(10, Math.max(1, Math.round(Number(clamped[k]) || 1)));
        }
        finalScores = recalcOverall(clamped as Scores);
      }

      await new Promise(r => setTimeout(r, 400));
      setPlanResult(finalPlan);
      setScores(finalScores);
      setShowSkeleton(false);

      // Save to localStorage / DB
      const newProject = {
        id: Date.now(),
        title: formData.idea.substring(0, 35) + (formData.idea.length > 35 ? "..." : ""),
        status: lang === "tr" ? "Tamamlandı" : lang === "ar" ? "مكتمل" : "Completed",
        date: new Date().toLocaleDateString(),
        planData: finalPlan,
        scores: finalScores,
      };
      const existing = JSON.parse(localStorage.getItem("user_projects") || "[]");
      localStorage.setItem("user_projects", JSON.stringify([newProject, ...existing]));

      const token = localStorage.getItem("token");
      if (token) {
        fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify({ title: newProject.title, status: newProject.status, planData: finalPlan, scores: finalScores }),
        }).catch(console.error);
      }
      sessionStorage.removeItem("planner_form");
      toast.success(t.toast_success);
    } catch {
      setShowSkeleton(false);
      toast.error(lang === "tr" ? "Hata oluştu. Lütfen tekrar deneyin." : lang === "ar" ? "حدث خطأ. حاول مرة أخرى." : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPDF() {
    if (!planResult) return;
    const tid = toast.loading(t.toast_pdf_preparing);
    try {
      const res = await fetch("/api/create_pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_data: planResult, language: lang }),
      });
      if (!res.ok) throw new Error("PDF error");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "StartERA_Plan.pdf";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      toast.dismiss(tid);
      toast.success(t.toast_pdf_success);
    } catch {
      toast.dismiss(tid);
      toast.error(lang === "tr" ? "PDF oluşturulamadı." : lang === "ar" ? "فشل إنشاء PDF." : "PDF generation failed.");
    }
  }

  function resetWizard() {
    setPlanResult(null); setScores(null); setStep(1);
    setFormData(prev => ({ ...prev, idea:"", capital:"", skills:"", strategy:"", management:"" }));
  }

  // ── Not logged in guard ───────────────────────────────────────────────────
  if (!user) return (
    <div className={"flex h-screen items-center justify-center " + bg}>
      <main className="text-center">
        <p className={"font-bold mb-4 " + sub}>{lang === "tr" ? "Lütfen giriş yapın." : lang === "ar" ? "يرجى تسجيل الدخول." : "Please sign in."}</p>
        <a href="/login" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-sm transition no-underline">{t.login}</a>
      </main>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={"min-h-screen font-sans transition-colors duration-300 " + bg}>

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <nav aria-label="Planner navigation" className={"sticky top-0 z-40 border-b backdrop-blur-md " + navBg}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 no-underline" aria-label="Start ERA — Home">
              <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center text-white font-black text-xs" aria-hidden="true">S</div>
              <span className={"text-base font-black " + (isDark ? "text-gray-100" : "text-gray-900")}>Start ERA</span>
            </a>
            <div className="flex items-center gap-2">
              {/* Language toggle */}
              <button
                onClick={toggleLang}
                aria-label={switchLangLabel}
                className={"text-xs font-bold px-2.5 py-1.5 rounded-lg border transition " + (isDark ? "border-gray-700 text-gray-300 hover:border-green-600" : "border-gray-200 text-gray-600 hover:border-green-500")}
              >
                {getLangLabel()}
              </button>
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                aria-label={toggleThemeLabel}
                className={"p-2.5 rounded-lg border transition flex items-center gap-1.5 text-xs font-medium " + (isDark ? "border-gray-700 text-yellow-400 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-100")}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
                <span className="hidden sm:inline">{isDark ? lightLabel : darkLabel}</span>
              </button>
              {/* Back to dashboard */}
              <a href="/dashboard" className={"px-4 py-2 rounded-full font-bold text-xs border no-underline transition " + (isDark ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50")}>{t.nav_back}</a>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <main id="main-content" className="max-w-6xl mx-auto px-6 py-8">

        {/* Visually hidden page heading for a11y heading hierarchy */}
        <h1 className="sr-only">{pageTitle}</h1>

        {/* ── SKELETON (loading state) ─────────────────────────────────────── */}
        {showSkeleton && !planResult && (
          <div>
            <div className={"mb-6 p-4 rounded-xl border flex items-center gap-3 " + card} role="status">
              <div
                className="w-5 h-5 border-t-2 border-green-600 rounded-full flex-shrink-0 animate-spin"
                aria-hidden="true"
              />
              <div>
                <p className={"text-sm font-semibold " + (isDark ? "text-gray-200" : "text-gray-800")}>{loadingStatus}</p>
                <p className={"text-xs " + sub}>{lang === "tr" ? "Yapay zeka analiz ediyor..." : lang === "ar" ? "الذكاء الاصطناعي يحلل..." : "AI is analyzing..."}</p>
              </div>
            </div>
            <SkeletonResults isDark={isDark} />
          </div>
        )}

        {/* ── RESULTS ──────────────────────────────────────────────────────── */}
        {planResult && !showSkeleton && (
          <div>
            {/* Top bar */}
            <div className={"mb-6 p-4 rounded-2xl border flex items-center justify-between " + card}>
              <button
                onClick={resetWizard}
                aria-label={lang === "tr" ? "Geri dön" : lang === "ar" ? "عودة" : "Go back"}
                className={"flex items-center gap-2 text-sm font-medium transition hover:text-green-600 " + sub}
              >
                <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                {lang === "tr" ? "Geri" : lang === "ar" ? "عودة" : "Back"}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                <span className={"font-bold text-sm " + (isDark ? "text-gray-200" : "text-gray-800")}>
                  {formData.idea.substring(0, 45) + (formData.idea.length > 45 ? "..." : "")}
                </span>
              </div>
              <span className={"text-xs " + sub}>Start ERA AI</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── LEFT: Plan content ─────────────────────────────────────── */}
              <div className="lg:col-span-2 space-y-5">

                {/* Scores card */}
                <section aria-labelledby="eval-heading" className={"rounded-2xl border p-6 " + card}>
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-yellow-500" aria-hidden="true"><StarIcon /></span>
                    <h2 id="eval-heading" className={"text-sm font-bold " + (isDark ? "text-gray-200" : "text-gray-800")}>{evalLabel}</h2>
                    {scores && (
                      <span className={"ml-auto text-xs px-2.5 py-1 rounded-full font-medium " + (isDark ? "bg-green-950 text-green-400" : "bg-green-50 text-green-700")}>{aiEvalLabel}</span>
                    )}
                  </div>
                  {scores ? (
                    <div className="flex items-center gap-6 flex-wrap">
                      <LargeCircleScore score={scores.overall} isDark={isDark} lang={lang} />
                      <div className={"w-px h-16 self-stretch " + (isDark ? "bg-gray-700" : "bg-gray-200")} aria-hidden="true" />
                      <div className="flex gap-5 flex-wrap">
                        {scoreKeys.map(key => (
                          <div key={key} className="flex flex-col items-center gap-1">
                            <CircleScore score={scores[key]} isDark={isDark} />
                            <span className={"text-[10px] font-medium " + subFine}>{scoreLabels[key]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className={"text-sm " + sub}>{lang === "tr" ? "Skor bilgisi mevcut değil." : lang === "ar" ? "معلومات الدرجة غير متاحة." : "Score information not available."}</p>
                  )}
                </section>

                {/* Plan sections */}
                {planResult.map((section, idx) => (
                  <section key={idx} aria-labelledby={`section-heading-${idx}`} className={"rounded-2xl border overflow-hidden " + card}>
                    <div className={"px-5 py-4 border-b flex items-center gap-2 " + bdr}>
                      <span className="text-green-600" aria-hidden="true"><TrendingIcon /></span>
                      <h2 id={`section-heading-${idx}`} className={"text-sm font-bold " + (isDark ? "text-gray-200" : "text-gray-800")}>{section.title}</h2>
                    </div>
                    <div className="p-5">
                      <div className={"rounded-xl p-5 " + innerBg}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-green-600" aria-hidden="true"><SectionIcon title={section.title} /></span>
                          <h3 className={"text-sm font-bold " + (isDark ? "text-green-400" : "text-green-700")}>{section.title}</h3>
                        </div>
                        <p className={"text-sm leading-relaxed whitespace-pre-wrap " + sub}>{section.content}</p>
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              {/* ── RIGHT SIDEBAR ──────────────────────────────────────────── */}
              <aside aria-label={lang === "tr" ? "Eylem paneli" : lang === "ar" ? "لوحة الإجراءات" : "Action panel"} className="space-y-4 lg:sticky lg:top-20 lg:self-start">
                <button onClick={() => window.location.href = "/dashboard"}
                  className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md">
                  <SparkleIcon />{startLabel}
                </button>
                <button onClick={downloadPDF}
                  className={"w-full py-3.5 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 border " + (isDark ? "border-gray-700 text-gray-200 hover:bg-gray-800 bg-gray-900" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white")}>
                  <DownloadIcon />{downloadLabel}
                </button>
                <button onClick={resetWizard}
                  className={"w-full py-3 font-semibold rounded-xl text-sm transition border " + (isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50")}>
                  {newPlanLabel}
                </button>

                {/* Score bars */}
                {scores && (
                  <div className={"rounded-2xl border p-5 " + card}>
                    <h3 className={"text-xs font-bold uppercase tracking-widest mb-4 " + subFine}>{evalLabel}</h3>
                    <div className="space-y-3">
                      {scoreKeys.map(key => {
                        const val = scores[key];
                        const barColor = val >= 8 ? "bg-green-500" : val >= 6 ? "bg-yellow-500" : "bg-red-500";
                        return (
                          <div key={key} className="flex items-center gap-3">
                            <span className={"text-xs w-20 " + subFine}>{scoreLabels[key]}</span>
                            <div className={"flex-1 h-1.5 rounded-full " + (isDark ? "bg-gray-700" : "bg-gray-200")} role="progressbar" aria-valuenow={val} aria-valuemin={0} aria-valuemax={10} aria-label={`${scoreLabels[key]}: ${val}/10`}>
                              <div className={"h-full rounded-full transition-all duration-700 " + barColor} style={{ width: (val / 10 * 100) + "%" }} />
                            </div>
                            <span className={"text-xs font-black w-5 text-right " + (val >= 8 ? "text-green-600" : val >= 6 ? "text-yellow-600" : "text-red-600")}>{val}</span>
                          </div>
                        );
                      })}
                      <div className={"border-t pt-3 flex items-center justify-between " + bdr}>
                        <span className={"text-xs font-bold " + subFine}>{lang === "tr" ? "Genel" : lang === "ar" ? "الإجمالي" : "Overall"}</span>
                        <span className={"text-base font-black " + (scores.overall >= 8 ? "text-green-600" : scores.overall >= 6 ? "text-yellow-600" : "text-red-600")}>{scores.overall}/10</span>
                      </div>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        )}

        {/* ── WIZARD ───────────────────────────────────────────────────────── */}
        {!planResult && !showSkeleton && (
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="mb-8" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={5} aria-label={`${t.step} ${step} / 5`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-green-600 uppercase tracking-widest">{t.step_progress}</span>
                <span className={"text-xs font-bold " + subFine}>{t.step} {step} / 5</span>
              </div>
              <div className={"w-full rounded-full h-2 overflow-hidden " + progrBg}>
                <div className="bg-green-600 h-full transition-all duration-500 ease-out rounded-full" style={{ width: (step/5*100)+"%" }} />
              </div>
              <div className="flex justify-between mt-3">
                {[1,2,3,4,5].map(s => (
                  <div key={s} className={"w-2 h-2 rounded-full transition-colors " + (s <= step ? "bg-green-600" : (isDark ? "bg-gray-700" : "bg-gray-300"))} aria-hidden="true" />
                ))}
              </div>
            </div>

            {/* Question card */}
            <div className={"p-8 md:p-10 rounded-2xl border " + card}>
              <div className="mb-7">
                <div className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">{t.step} {step}</div>
                <h2 className={"text-2xl md:text-3xl font-black mb-3 " + (isDark ? "text-gray-100" : "text-gray-900")}>{currentQuestion.title}</h2>
                <p className={"text-sm " + sub}>{currentQuestion.subtitle}</p>
              </div>
              <label htmlFor="wizard-input" className="sr-only">{currentQuestion.title}</label>
              <textarea
                id="wizard-input"
                name={currentQuestion.key}
                rows={5}
                className={"w-full px-5 py-4 rounded-xl outline-none text-base resize-none transition-all border focus:border-green-500 focus:ring-2 focus:ring-green-500/20 " + txBg}
                placeholder={currentQuestion.ph}
                value={formData[currentQuestion.key as keyof typeof formData] as string}
                onChange={e => setFormData(prev => ({ ...prev, [currentQuestion.key]: e.target.value }))}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey && !loading) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                autoFocus
              />
              <div className="flex justify-between items-center mt-6">
                {step > 1 ? (
                  <button onClick={() => setStep(step-1)} className={"px-5 py-2.5 font-semibold text-sm rounded-full border transition " + (isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100")}>
                    {isRTL ? "" : "← "}{t.back}{isRTL ? " →" : ""}
                  </button>
                ) : <div />}
                <button onClick={handleNext} disabled={loading}
                  aria-busy={loading}
                  className="px-7 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-full text-sm transition flex items-center gap-2 shadow-md">
                  {step === 5 ? (<><SparkleIcon />{t.start_magic}</>) : (<>{t.next} {isRTL ? "←" : "→"}</>)}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}