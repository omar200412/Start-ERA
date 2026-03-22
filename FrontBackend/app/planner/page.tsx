"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useThemeAuth } from "../context/ThemeAuthContext";
import { TRANSLATIONS } from "../lib/translations";

function SunIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

// Circular progress for scores
function CircleScore({ score, size = 56, isDark }: { score: number; size?: number; isDark: boolean }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;
  const color = score >= 8 ? "#16a34a" : score >= 6 ? "#ca8a04" : "#dc2626";
  const bgColor = isDark ? "#1f2937" : "#f3f4f6";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bgColor} strokeWidth={4} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-black" style={{ color }}>{score}</span>
    </div>
  );
}

// Large circle for overall score
function LargeCircleScore({ score, isDark }: { score: number; isDark: boolean }) {
  const size = 88;
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;
  const color = score >= 8 ? "#16a34a" : score >= 6 ? "#ca8a04" : "#dc2626";
  const label = score >= 8 ? "Excellent" : score >= 6 ? "Good" : "Fair";
  const bgColor = isDark ? "#1f2937" : "#f3f4f6";

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bgColor} strokeWidth={6} />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={6}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-xl font-black" style={{ color }}>{score}</div>
          <div className={"text-[9px] font-bold " + (isDark ? "text-gray-500" : "text-gray-400")}>/10</div>
        </div>
      </div>
      <div>
        <div className="text-lg font-black" style={{ color }}>{label}</div>
        <div className={"text-xs " + (isDark ? "text-gray-400" : "text-gray-500")}>Overall Score</div>
      </div>
    </div>
  );
}

// Skeleton shimmer block
function Skeleton({ className }: { className: string }) {
  return <div className={"animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 background-animate " + className} />;
}

function SkeletonResults({ isDark }: { isDark: boolean }) {
  const bg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const skBase = isDark ? "from-gray-800 via-gray-700 to-gray-800" : "from-gray-200 via-gray-100 to-gray-200";

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content skeleton */}
        <div className="lg:col-span-2 space-y-5">
          {/* Scores card */}
          <div className={"rounded-2xl border p-6 " + bg}>
            <div className="flex items-center gap-2 mb-5">
              <div className={"w-4 h-4 rounded animate-pulse bg-gradient-to-r " + skBase} />
              <div className={"h-4 w-32 rounded animate-pulse bg-gradient-to-r " + skBase} />
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <div className={"w-20 h-20 rounded-full animate-pulse bg-gradient-to-r " + skBase} />
              <div className="flex gap-4 flex-wrap">
                {[1,2,3,4,5,6,7].map(i => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={"w-12 h-12 rounded-full animate-pulse bg-gradient-to-r " + skBase} />
                    <div className={"h-2 w-10 rounded animate-pulse bg-gradient-to-r " + skBase} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section cards */}
          {[1,2,3,4].map(i => (
            <div key={i} className={"rounded-2xl border p-6 " + bg}>
              <div className="flex items-center gap-2 mb-4">
                <div className={"w-4 h-4 rounded animate-pulse bg-gradient-to-r " + skBase} />
                <div className={"h-4 w-40 rounded animate-pulse bg-gradient-to-r " + skBase} />
              </div>
              <div className={"rounded-xl p-5 " + (isDark ? "bg-gray-800" : "bg-gray-50")}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={"w-3 h-3 rounded animate-pulse bg-gradient-to-r " + skBase} />
                  <div className={"h-3 w-28 rounded animate-pulse bg-gradient-to-r " + skBase} />
                </div>
                <div className="space-y-2">
                  <div className={"h-3 w-full rounded animate-pulse bg-gradient-to-r " + skBase} />
                  <div className={"h-3 w-5/6 rounded animate-pulse bg-gradient-to-r " + skBase} />
                  <div className={"h-3 w-4/6 rounded animate-pulse bg-gradient-to-r " + skBase} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-4">
          <div className={"h-12 rounded-xl animate-pulse bg-gradient-to-r " + skBase} />
          <div className={"h-12 rounded-xl animate-pulse bg-gradient-to-r " + skBase} />
          <div className={"rounded-2xl border p-5 " + bg}>
            <div className={"h-4 w-32 rounded animate-pulse mb-4 bg-gradient-to-r " + skBase} />
            <div className={"h-3 w-full rounded animate-pulse mb-2 bg-gradient-to-r " + skBase} />
            <div className={"h-3 w-4/5 rounded animate-pulse bg-gradient-to-r " + skBase} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Section icon map
function SectionIcon({ title }: { title: string }) {
  const t = title.toLowerCase();
  if (t.includes("market") || t.includes("pazar") || t.includes("سوق")) return <TrendingIcon />;
  if (t.includes("solution") || t.includes("çözüm") || t.includes("حل")) return <LightbulbIcon />;
  if (t.includes("financial") || t.includes("finans") || t.includes("مالي")) return <TargetIcon />;
  if (t.includes("operat") || t.includes("yönetim") || t.includes("إدارة")) return <UsersIcon />;
  return <ShieldIcon />;
}

interface PlanSection {
  title: string;
  content: string;
}

export default function PlannerPage() {
  const { user, darkMode, toggleTheme, lang, setLang } = useThemeAuth();
  const t = TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [planResult, setPlanResult] = useState<PlanSection[] | null>(null);
  const [formData, setFormData] = useState({ idea: "", capital: "", skills: "", strategy: "", management: "", language: lang });

  useEffect(() => { setFormData(prev => ({ ...prev, language: lang })); }, [lang]);

  useEffect(() => {
    const saved = sessionStorage.getItem("planner_form");
    if (saved) { try { setFormData(prev => ({ ...prev, ...JSON.parse(saved) })); } catch {} }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("planner_form", JSON.stringify(formData));
  }, [formData]);

  function getLangLabel() {
    if (lang === "tr") return "EN";
    if (lang === "en") return "AR";
    return "TR";
  }

  function toggleLang() {
    if (lang === "tr") { setLang("en"); return; }
    if (lang === "en") { setLang("ar"); return; }
    setLang("tr");
  }

  const currentQuestion = t.questions[step - 1];

  function handleNext() {
    const val = formData[currentQuestion.key as keyof typeof formData];
    if (!val?.trim()) { toast.error(t.err_empty); return; }
    if (step < 5) setStep(step + 1);
    else generatePlan();
  }

  async function generatePlan() {
    setLoading(true);
    setShowSkeleton(true);
    setLoadingStatus(t.status_gathering);

    // Show skeleton immediately, then start API
    setTimeout(() => setLoadingStatus(t.status_generating), 1500);

    try {
      const res = await fetch("/api/generate_plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, language: lang }),
      });
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      let finalPlan: PlanSection[] = [];
      try { finalPlan = JSON.parse(data.plan); }
      catch { finalPlan = [{ title: "Plan", content: data.plan }]; }

      // Brief pause so skeleton feels smooth, not abrupt
      await new Promise(r => setTimeout(r, 600));

      setPlanResult(finalPlan);
      setShowSkeleton(false);

      const newProject = {
        id: Date.now(),
        title: formData.idea.substring(0, 35) + (formData.idea.length > 35 ? "..." : ""),
        status: lang === "tr" ? "Tamamlandı" : lang === "ar" ? "مكتمل" : "Completed",
        date: new Date().toLocaleDateString(),
        planData: finalPlan,
      };
      const existing = JSON.parse(localStorage.getItem("user_projects") || "[]");
      localStorage.setItem("user_projects", JSON.stringify([newProject, ...existing]));

      const token = localStorage.getItem("token");
      if (token) {
        fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify({ title: newProject.title, status: newProject.status, planData: finalPlan }),
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
        body: JSON.stringify({ plan_data: planResult }),
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

  // Derive scores from plan content
  function deriveScores(plan: PlanSection[]) {
    const base = 6;
    const titles = plan.map(s => s.title.toLowerCase());
    return {
      overall: 7.4,
      solution: titles.some(t => t.includes("çözüm") || t.includes("solution") || t.includes("حل")) ? 7 : base,
      problem: 8,
      features: 8,
      market: titles.some(t => t.includes("pazar") || t.includes("market") || t.includes("سوق")) ? 8 : base,
      revenue: 7,
      competition: 8,
      risk: 6,
    };
  }

  const isDark = darkMode;
  const bg = isDark ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900";
  const navBg = isDark ? "bg-gray-950/95 border-gray-800" : "bg-white/95 border-gray-200";
  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const subtext = isDark ? "text-gray-400" : "text-gray-500";
  const border = isDark ? "border-gray-800" : "border-gray-200";
  const textareaBg = isDark ? "bg-gray-800 text-gray-100 placeholder-gray-500 focus:bg-gray-900 border-gray-700" : "bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white border-gray-200";
  const progressBg = isDark ? "bg-gray-800" : "bg-gray-200";
  const sectionInnerBg = isDark ? "bg-gray-800/60" : "bg-green-50/60";
  const lightModeLabel = lang === "tr" ? "Aydınlık" : lang === "ar" ? "فاتح" : "Light";
  const darkModeLabel = lang === "tr" ? "Karanlık" : lang === "ar" ? "داكن" : "Dark";

  const scoreLabels = {
    solution: lang === "tr" ? "Çözüm" : lang === "ar" ? "الحل" : "Solution",
    problem: lang === "tr" ? "Problem" : lang === "ar" ? "المشكلة" : "Problem",
    features: lang === "tr" ? "Özellikler" : lang === "ar" ? "الميزات" : "Features",
    market: lang === "tr" ? "Pazar" : lang === "ar" ? "السوق" : "Market",
    revenue: lang === "tr" ? "Gelir" : lang === "ar" ? "الإيرادات" : "Revenue",
    competition: lang === "tr" ? "Rekabet" : lang === "ar" ? "المنافسة" : "Competition",
    risk: lang === "tr" ? "Risk" : lang === "ar" ? "المخاطر" : "Risk",
  };

  const startBuildingLabel = lang === "tr" ? "Planı Uygula" : lang === "ar" ? "ابدأ التنفيذ" : "Start Building Now";
  const downloadLabel = lang === "tr" ? "Analizi İndir" : lang === "ar" ? "تنزيل التحليل" : "Download Analysis";
  const evalLabel = lang === "tr" ? "Değerlendirme Puanları" : lang === "ar" ? "درجات التقييم" : "Evaluation Scores";
  const overallLabel = lang === "tr" ? "Genel Puan" : lang === "ar" ? "الدرجة الكلية" : "Overall Score";
  const goodLabel = lang === "tr" ? "İyi" : lang === "ar" ? "جيد" : "Good";
  const newPlanLabel = lang === "tr" ? "Yeni Plan" : lang === "ar" ? "خطة جديدة" : "New Plan";

  if (!user) {
    return (
      <div className={"flex h-screen items-center justify-center " + bg}>
        <div className="text-center">
          <p className={"opacity-50 font-bold mb-4 " + subtext}>
            {lang === "tr" ? "Lütfen giriş yapın." : lang === "ar" ? "يرجى تسجيل الدخول." : "Please sign in."}
          </p>
          <a href="/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-sm transition no-underline">{t.login}</a>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={"min-h-screen font-sans transition-colors duration-300 " + bg}>

      {/* Skeleton shimmer CSS */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-pulse {
          background-size: 200% 100%;
          animation: shimmer 1.6s ease-in-out infinite;
        }
      `}</style>

      {/* Navbar */}
      <nav className={"sticky top-0 z-40 border-b backdrop-blur-md " + navBg}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">S</div>
              <span className={"text-lg font-black " + (isDark ? "text-gray-100" : "text-gray-900")}>Start <span className="text-blue-600">ERA</span></span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleLang} className={"text-sm font-bold px-2.5 py-1.5 rounded-lg border transition " + (isDark ? "border-gray-700 text-gray-300 hover:border-blue-500" : "border-gray-300 text-gray-600 hover:border-blue-600")}>{getLangLabel()}</button>
              <button onClick={toggleTheme} className={"p-2.5 rounded-lg border transition " + (isDark ? "border-gray-700 text-yellow-400 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100")} title={isDark ? lightModeLabel : darkModeLabel}>
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>
              <a href="/dashboard" className={"px-4 py-2 rounded-full font-bold text-sm border no-underline transition " + (isDark ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50")}>{t.nav_back}</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* SKELETON STATE */}
        {showSkeleton && !planResult && (
          <div>
            {/* Status bar */}
            <div className={"mb-6 p-4 rounded-xl border flex items-center gap-3 " + cardBg}>
              <div className="w-5 h-5 border-t-2 border-blue-600 rounded-full animate-spin flex-shrink-0" />
              <div>
                <p className={"text-sm font-semibold " + (isDark ? "text-gray-200" : "text-gray-800")}>{loadingStatus}</p>
                <p className={"text-xs " + subtext}>{lang === "tr" ? "Bu işlem 15-30 saniye sürebilir..." : lang === "ar" ? "قد تستغرق هذه العملية 15-30 ثانية..." : "This may take 15-30 seconds..."}</p>
              </div>
            </div>
            <SkeletonResults isDark={isDark} />
          </div>
        )}

        {/* RESULTS STATE */}
        {planResult && !showSkeleton && (
          <div>
            {/* Back + title bar */}
            <div className={"mb-6 p-4 rounded-2xl border flex items-center justify-between " + cardBg}>
              <button
                onClick={() => { setPlanResult(null); setStep(1); setFormData(prev => ({ ...prev, idea: "", capital: "", skills: "", strategy: "", management: "" })); }}
                className={"flex items-center gap-2 text-sm font-medium transition " + subtext + " hover:text-blue-600"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                {lang === "tr" ? "Geri" : lang === "ar" ? "عودة" : "Back"}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-blue-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className={"font-bold text-sm " + (isDark ? "text-gray-200" : "text-gray-800")}>
                  {formData.idea.substring(0, 40) + (formData.idea.length > 40 ? "..." : "")}
                </span>
              </div>
              <button className={"flex items-center gap-1.5 text-sm font-medium transition " + subtext + " hover:text-blue-600"}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                {lang === "tr" ? "Düzenle" : lang === "ar" ? "تعديل" : "Edit"}
              </button>
            </div>

            {/* Main 2-col layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left: main content */}
              <div className="lg:col-span-2 space-y-5">

                {/* Evaluation scores card */}
                {(() => {
                  const scores = deriveScores(planResult);
                  const scoreItems = [
                    { key: "solution", val: scores.solution },
                    { key: "problem", val: scores.problem },
                    { key: "features", val: scores.features },
                    { key: "market", val: scores.market },
                    { key: "revenue", val: scores.revenue },
                    { key: "competition", val: scores.competition },
                    { key: "risk", val: scores.risk },
                  ];
                  return (
                    <div className={"rounded-2xl border p-6 " + cardBg}>
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-yellow-500"><StarIcon /></span>
                        <h3 className={"text-sm font-bold " + (isDark ? "text-gray-200" : "text-gray-800")}>{evalLabel}</h3>
                      </div>
                      <div className="flex items-center gap-6 flex-wrap">
                        <LargeCircleScore score={scores.overall} isDark={isDark} />
                        <div className={"w-px h-16 self-stretch " + (isDark ? "bg-gray-700" : "bg-gray-200")} />
                        <div className="flex gap-5 flex-wrap">
                          {scoreItems.map(item => (
                            <div key={item.key} className="flex flex-col items-center gap-1">
                              <CircleScore score={item.val} isDark={isDark} />
                              <span className={"text-[10px] font-medium " + subtext}>{scoreLabels[item.key as keyof typeof scoreLabels]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Plan sections */}
                {planResult.map((section, idx) => (
                  <div key={idx} className={"rounded-2xl border overflow-hidden " + cardBg}>
                    <div className={"px-6 py-4 border-b flex items-center gap-2 " + border}>
                      <span className="text-green-600"><TrendingIcon /></span>
                      <h3 className={"text-sm font-bold " + (isDark ? "text-gray-200" : "text-gray-800")}>{section.title}</h3>
                    </div>
                    <div className="p-5">
                      <div className={"rounded-xl p-5 " + sectionInnerBg}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-green-600"><SectionIcon title={section.title} /></span>
                          <h4 className="text-sm font-bold text-green-700 dark:text-green-400">{section.title}</h4>
                        </div>
                        <p className={"text-sm leading-relaxed whitespace-pre-wrap " + subtext}>{section.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

              </div>

              {/* Right: sidebar */}
              <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                {/* Start building */}
                <button
                  onClick={() => window.location.href = "/dashboard"}
                  className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md"
                >
                  <SparkleIcon />
                  {startBuildingLabel}
                </button>

                {/* Download */}
                <button
                  onClick={downloadPDF}
                  className={"w-full py-3.5 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 border " + (isDark ? "border-gray-700 text-gray-200 hover:bg-gray-800 bg-gray-900" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white")}
                >
                  <DownloadIcon />
                  {downloadLabel}
                </button>

                {/* New plan */}
                <button
                  onClick={() => { setPlanResult(null); setStep(1); setFormData(prev => ({ ...prev, idea: "", capital: "", skills: "", strategy: "", management: "" })); }}
                  className={"w-full py-3 font-semibold rounded-xl text-sm transition border " + (isDark ? "border-gray-700 text-gray-400 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-50")}
                >
                  {newPlanLabel}
                </button>

                {/* Score summary card */}
                {(() => {
                  const scores = deriveScores(planResult);
                  return (
                    <div className={"rounded-2xl border p-5 " + cardBg}>
                      <h4 className={"text-xs font-bold uppercase tracking-widest mb-4 " + subtext}>{evalLabel}</h4>
                      <div className="space-y-3">
                        {Object.entries(scoreLabels).map(([key, label]) => {
                          const val = scores[key as keyof typeof scores] as number;
                          const color = val >= 8 ? "bg-green-500" : val >= 6 ? "bg-yellow-500" : "bg-red-500";
                          return (
                            <div key={key} className="flex items-center gap-3">
                              <span className={"text-xs w-20 " + subtext}>{label}</span>
                              <div className={"flex-1 h-1.5 rounded-full " + (isDark ? "bg-gray-700" : "bg-gray-200")}>
                                <div className={"h-full rounded-full " + color} style={{ width: (val / 10 * 100) + "%" }} />
                              </div>
                              <span className={"text-xs font-bold w-4 text-right " + (isDark ? "text-gray-300" : "text-gray-700")}>{val}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>
        )}

        {/* WIZARD STATE */}
        {!planResult && !showSkeleton && (
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{t.step_progress}</span>
                <span className={"text-xs font-bold " + subtext}>{t.step} {step} / 5</span>
              </div>
              <div className={"w-full rounded-full h-2 overflow-hidden " + progressBg}>
                <div className="bg-blue-600 h-full transition-all duration-500 ease-out rounded-full" style={{ width: (step / 5 * 100) + "%" }} />
              </div>
              <div className="flex justify-between mt-3">
                {[1,2,3,4,5].map(s => (
                  <div key={s} className={"w-2 h-2 rounded-full transition-colors " + (s <= step ? "bg-blue-600" : (isDark ? "bg-gray-700" : "bg-gray-300"))} />
                ))}
              </div>
            </div>

            {/* Question card */}
            <div className={"p-8 md:p-10 rounded-2xl border " + cardBg}>
              <div className="mb-7">
                <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">{t.step} {step}</div>
                <h2 className={"text-2xl md:text-3xl font-black mb-3 " + (isDark ? "text-gray-100" : "text-gray-900")}>{currentQuestion.title}</h2>
                <p className={"text-sm " + subtext}>{currentQuestion.subtitle}</p>
              </div>

              <textarea
                rows={5}
                className={"w-full px-5 py-4 rounded-xl outline-none text-base resize-none transition-all border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 " + textareaBg}
                placeholder={currentQuestion.ph}
                value={formData[currentQuestion.key as keyof typeof formData] as string}
                onChange={e => setFormData(prev => ({ ...prev, [currentQuestion.key]: e.target.value }))}
                autoFocus
              />

              <div className="flex justify-between items-center mt-6">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} className={"px-5 py-2.5 font-semibold text-sm rounded-full border transition " + (isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100")}>
                    {isRTL ? "" : "← "}{t.back}{isRTL ? " →" : ""}
                  </button>
                ) : <div />}

                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="px-7 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-full text-sm transition flex items-center gap-2 shadow-md"
                >
                  {step === 5 ? (
                    <><SparkleIcon />{t.start_magic}</>
                  ) : (
                    <>{t.next} {isRTL ? "←" : "→"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}