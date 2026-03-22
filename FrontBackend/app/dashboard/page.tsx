"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useThemeAuth } from "../context/ThemeAuthContext";
import { TRANSLATIONS } from "../lib/translations";
import Chatbot from "../Chatbot";

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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

function StarIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

// Circular score ring
function ScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;
  const color = score >= 8 ? "#16a34a" : score >= 6 ? "#ca8a04" : "#dc2626";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-xs font-black" style={{ color }}>{score}</span>
    </div>
  );
}

interface Project {
  id: number;
  title: string;
  status: string;
  date: string;
  planData?: any[];
}

export default function DashboardPage() {
  const { user, darkMode, toggleTheme, logout, lang, setLang } = useThemeAuth();
  const t = TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [idea, setIdea] = useState("");

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

  useEffect(() => {
    async function loadProjects() {
      const cached = localStorage.getItem("user_projects");
      if (cached) { try { setProjects(JSON.parse(cached)); } catch {} }
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch("/api/projects", { headers: { Authorization: "Bearer " + token } });
          if (res.ok) {
            const data = await res.json();
            setProjects(data.projects);
            localStorage.setItem("user_projects", JSON.stringify(data.projects));
          }
        } catch {}
      }
      setLoadingProjects(false);
    }
    loadProjects();
  }, []);

  function handleGenerateIdea() {
    if (idea.trim()) {
      sessionStorage.setItem("planner_form", JSON.stringify({ idea, capital: "", skills: "", strategy: "", management: "", language: lang }));
    }
    window.location.href = "/planner";
  }

  const totalPlans = projects.length;
  const completedPlans = projects.filter(p =>
    p.status?.toLowerCase().includes("comp") ||
    p.status?.toLowerCase().includes("tamam") ||
    p.status?.includes("مكتمل")
  ).length;

  const isDark = darkMode;

  const placeholderText = lang === "tr"
    ? "Yeni bir girişim fikri girin..."
    : lang === "ar"
    ? "أدخل فكرة شركة ناشئة جديدة..."
    : "Enter a new startup idea...";

  const charsLeft = `${400 - idea.length} ${lang === "tr" ? "karakter kaldı" : lang === "ar" ? "حرف متبقٍ" : "characters left"}`;

  const newPlanLabel = lang === "tr" ? "Yeni İş Planı" : lang === "ar" ? "خطة عمل جديدة" : "New Business Plan";
  const myPlansLabel = lang === "tr" ? "Planlarım" : lang === "ar" ? "خططي" : "My Plans";
  const viewAllLabel = lang === "tr" ? "Tümünü Gör" : lang === "ar" ? "عرض الكل" : "View all";
  const emptyLabel = lang === "tr" ? "Henüz plan yok. İlk planını oluştur!" : lang === "ar" ? "لا توجد خطط بعد. أنشئ خطتك الأولى!" : "No plans yet. Create your first one!";
  const loadingLabel = lang === "tr" ? "Yükleniyor..." : lang === "ar" ? "جارٍ التحميل..." : "Loading...";
  const openLabel = lang === "tr" ? "Aç" : lang === "ar" ? "فتح" : "Open";
  const generateLabel = lang === "tr" ? "Önizleme Oluştur" : lang === "ar" ? "إنشاء معاينة" : "Generate Preview";

  const TRENDING_IDEAS = [
    { idea: lang === "tr" ? "Fatura ödemelerini otomatikleştiren uygulama" : lang === "ar" ? "تطبيق لأتمتة مدفوعات الفواتير" : "App that automates invoice payments", tag: "FinTech", score: 8.1 },
    { idea: lang === "tr" ? "Yerel zanaatkarlara pazar yeri platformu" : lang === "ar" ? "منصة سوق للحرفيين المحليين" : "Marketplace platform for local artisans", tag: "E-commerce", score: 7.8 },
    { idea: lang === "tr" ? "Yapay zeka destekli CV oluşturucu" : lang === "ar" ? "منشئ سيرة ذاتية بالذكاء الاصطناعي" : "AI-powered CV builder for job seekers", tag: "HR Tech", score: 8.3 },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={"min-h-screen font-sans " + (isDark ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900")}>
      <Chatbot />

      {/* Plan detail modal */}
      {viewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className={"relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border " + (isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200")}>
            <div className={"p-5 border-b flex justify-between items-center " + (isDark ? "border-gray-800" : "border-gray-200")}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                  <TrendingIcon />
                </div>
                <div>
                  <h2 className={"font-black text-base " + (isDark ? "text-gray-100" : "text-gray-900")}>{viewingProject.title}</h2>
                  <p className={"text-xs " + (isDark ? "text-gray-500" : "text-gray-400")}>{viewingProject.date}</p>
                </div>
              </div>
              <button onClick={() => setViewingProject(null)} className={"p-2 rounded-lg transition " + (isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500")}>
                <CloseIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {viewingProject.planData ? (
                viewingProject.planData.map((section: any, idx: number) => (
                  <div key={idx} className={"rounded-xl border overflow-hidden " + (isDark ? "border-gray-800" : "border-gray-200")}>
                    <div className={"px-5 py-3 border-b flex items-center gap-2 " + (isDark ? "bg-gray-800 border-gray-700" : "bg-green-50 border-gray-200")}>
                      <span className="text-green-600"><TrendingIcon /></span>
                      <h3 className={"text-sm font-bold " + (isDark ? "text-gray-200" : "text-gray-800")}>{section.title}</h3>
                    </div>
                    <div className={"p-5 " + (isDark ? "bg-gray-900" : "bg-white")}>
                      <p className={"text-sm leading-relaxed whitespace-pre-wrap " + (isDark ? "text-gray-400" : "text-gray-600")}>{section.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={"text-center py-16 text-sm " + (isDark ? "text-gray-600" : "text-gray-400")}>{t.missing_content}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className={"sticky top-0 z-40 border-b backdrop-blur-md " + (isDark ? "bg-gray-950/95 border-gray-800" : "bg-white/95 border-gray-100")}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <a href="/" className="flex items-center gap-2 no-underline">
              <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
              <span className={"text-base font-black " + (isDark ? "text-gray-100" : "text-gray-900")}>Start ERA</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <div className={"hidden md:flex items-center gap-2 mr-2 " + (isDark ? "text-gray-500" : "text-gray-500")}>
              <span className="text-sm font-semibold">{user ? user.split("@")[0] : t.guest}</span>
              <span className="text-xs">·</span>
              <span className={"text-xs " + (isDark ? "text-gray-600" : "text-gray-400")}>{t.pro_member}</span>
            </div>
            <button onClick={toggleLang} className={"text-xs font-bold px-2.5 py-1.5 rounded-lg border transition " + (isDark ? "border-gray-700 text-gray-400 hover:border-green-600" : "border-gray-200 text-gray-500 hover:border-green-500")}>
              {getLangLabel()}
            </button>
            <button onClick={toggleTheme} className={"p-2 rounded-lg transition " + (isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100")}>
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={logout} className={"p-2 rounded-lg transition text-red-400 hover:bg-red-50 " + (isDark ? "hover:bg-red-950" : "hover:bg-red-50")}>
              <LogoutIcon />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Welcome + quick stats */}
            <div>
              <h1 className={"text-2xl font-black mb-1 " + (isDark ? "text-gray-100" : "text-gray-900")}>
                {t.welcome}, <span className="text-green-600">{user ? user.split("@")[0] : t.guest}</span> 👋
              </h1>
              <p className={"text-sm " + (isDark ? "text-gray-500" : "text-gray-500")}>{t.subtitle}</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: t.total_plans, value: totalPlans, color: "text-green-600", bg: isDark ? "bg-green-950 border-green-900" : "bg-green-50 border-green-100" },
                { label: t.completed, value: completedPlans, color: "text-blue-600", bg: isDark ? "bg-blue-950 border-blue-900" : "bg-blue-50 border-blue-100" },
                { label: t.active_projects, value: totalPlans - completedPlans, color: "text-orange-600", bg: isDark ? "bg-orange-950 border-orange-900" : "bg-orange-50 border-orange-100" },
              ].map((stat, i) => (
                <div key={i} className={"rounded-2xl border p-5 text-center " + stat.bg}>
                  <div className={"text-4xl font-black mb-1 " + stat.color}>{stat.value}</div>
                  <div className={"text-xs font-medium " + (isDark ? "text-gray-400" : "text-gray-500")}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* New idea input — startup.ai style */}
            <div className={"rounded-2xl border overflow-hidden " + (isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200")}>
              <div className={"px-5 py-4 border-b " + (isDark ? "border-gray-800" : "border-gray-100")}>
                <h3 className={"text-sm font-bold flex items-center gap-2 " + (isDark ? "text-gray-200" : "text-gray-800")}>
                  <PlusIcon />
                  {newPlanLabel}
                </h3>
              </div>
              <div className="p-5">
                <textarea
                  value={idea}
                  onChange={e => setIdea(e.target.value.slice(0, 400))}
                  placeholder={placeholderText}
                  rows={3}
                  className={"w-full resize-none outline-none text-sm leading-relaxed mb-3 " + (isDark ? "bg-gray-900 text-gray-200 placeholder-gray-600" : "bg-white text-gray-800 placeholder-gray-400")}
                />
                <div className="flex items-center justify-between">
                  <span className={"text-xs " + (isDark ? "text-gray-600" : "text-gray-400")}>{charsLeft}</span>
                  <button
                    onClick={handleGenerateIdea}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-xs transition shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    {generateLabel}
                  </button>
                </div>
              </div>
            </div>

            {/* My plans */}
            <div className={"rounded-2xl border overflow-hidden " + (isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200")}>
              <div className={"px-5 py-4 border-b flex items-center justify-between " + (isDark ? "border-gray-800" : "border-gray-100")}>
                <h3 className={"text-sm font-bold " + (isDark ? "text-gray-200" : "text-gray-800")}>{myPlansLabel}</h3>
                {projects.length > 5 && (
                  <button className="text-xs font-medium text-green-600 hover:text-green-700 transition">{viewAllLabel}</button>
                )}
              </div>

              {loadingProjects ? (
                <div className="p-5 space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className={"h-14 rounded-xl animate-pulse " + (isDark ? "bg-gray-800" : "bg-gray-100")} />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="p-10 text-center">
                  <div className={"w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center " + (isDark ? "bg-gray-800" : "bg-gray-100")}>
                    <TrendingIcon />
                  </div>
                  <p className={"text-sm mb-4 " + (isDark ? "text-gray-500" : "text-gray-400")}>{emptyLabel}</p>
                  <a href="/planner" className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-xs transition no-underline">
                    <PlusIcon />
                    {newPlanLabel}
                  </a>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {projects.slice(0, 6).map((project, i) => (
                    <div
                      key={project.id ?? i}
                      onClick={() => { toast(t.opening_plan); setViewingProject(project); }}
                      className={"flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors group " + (isDark ? "hover:bg-gray-800" : "hover:bg-gray-50")}
                    >
                      {/* Score ring */}
                      <ScoreRing score={7 + Math.floor(Math.random() * 2)} />

                      <div className="flex-1 min-w-0">
                        <h4 className={"font-semibold text-sm truncate " + (isDark ? "text-gray-200" : "text-gray-800")}>{project.title}</h4>
                        <p className={"text-xs mt-0.5 " + (isDark ? "text-gray-500" : "text-gray-400")}>{project.date}</p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={"inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border " + (isDark ? "bg-green-950 text-green-400 border-green-900" : "bg-green-50 text-green-700 border-green-100")}>
                          {project.status}
                        </span>
                        <span className={"text-gray-400 group-hover:text-green-600 transition " + (isDark ? "text-gray-600" : "text-gray-300")}>
                          <ChevronRight />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-5">

            {/* Quick actions */}
            <div className={"rounded-2xl border overflow-hidden " + (isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200")}>
              <div className={"px-5 py-4 border-b " + (isDark ? "border-gray-800" : "border-gray-100")}>
                <h3 className={"text-xs font-bold uppercase tracking-widest " + (isDark ? "text-gray-500" : "text-gray-400")}>
                  {lang === "tr" ? "Hızlı Erişim" : lang === "ar" ? "وصول سريع" : "Quick Access"}
                </h3>
              </div>
              <div className="p-4 space-y-2">
                <a href="/planner" className={"flex items-center gap-3 p-3.5 rounded-xl transition no-underline group " + (isDark ? "hover:bg-gray-800" : "hover:bg-green-50")}>
                  <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                    <PlusIcon />
                  </div>
                  <div>
                    <div className={"text-sm font-bold " + (isDark ? "text-gray-200" : "text-gray-800")}>{t.create_new_plan}</div>
                    <div className={"text-xs " + (isDark ? "text-gray-500" : "text-gray-400")}>{lang === "tr" ? "Yeni bir fikir analiz et" : lang === "ar" ? "حلّل فكرة جديدة" : "Analyze a new idea"}</div>
                  </div>
                </a>
                <a href="/" className={"flex items-center gap-3 p-3.5 rounded-xl transition no-underline group " + (isDark ? "hover:bg-gray-800" : "hover:bg-gray-50")}>
                  <div className={"w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 " + (isDark ? "bg-gray-800" : "bg-gray-100")}>
                    <svg className={"w-4 h-4 " + (isDark ? "text-gray-400" : "text-gray-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  </div>
                  <div>
                    <div className={"text-sm font-bold " + (isDark ? "text-gray-200" : "text-gray-800")}>{t.home_tooltip}</div>
                    <div className={"text-xs " + (isDark ? "text-gray-500" : "text-gray-400")}>{lang === "tr" ? "Ana sayfaya dön" : lang === "ar" ? "العودة إلى الرئيسية" : "Go back to homepage"}</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Trending ideas to try */}
            <div className={"rounded-2xl border overflow-hidden " + (isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200")}>
              <div className={"px-5 py-4 border-b flex items-center gap-2 " + (isDark ? "border-gray-800" : "border-gray-100")}>
                <span className="text-green-600"><TrendingIcon /></span>
                <h3 className={"text-xs font-bold uppercase tracking-widest " + (isDark ? "text-gray-500" : "text-gray-400")}>
                  {lang === "tr" ? "Trend Fikirler" : lang === "ar" ? "أفكار رائجة" : "Trending Ideas"}
                </h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {TRENDING_IDEAS.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => { setIdea(item.idea); }}
                    className={"px-5 py-4 cursor-pointer transition group " + (isDark ? "hover:bg-gray-800" : "hover:bg-gray-50")}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={"inline-block px-2 py-0.5 rounded-full text-[10px] font-bold " + (isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500")}>{item.tag}</span>
                      <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                        <StarIcon />
                        <span className="text-[10px] font-black text-yellow-600">{item.score}</span>
                      </div>
                    </div>
                    <p className={"text-xs leading-relaxed font-medium " + (isDark ? "text-gray-300 group-hover:text-green-400" : "text-gray-600 group-hover:text-green-700") + " transition"}>{item.idea}</p>
                    <p className={"text-[10px] mt-2 " + (isDark ? "text-gray-600" : "text-gray-400")}>
                      {lang === "tr" ? "→ Bununla devam et" : lang === "ar" ? "→ المتابعة بهذه الفكرة" : "→ Try this idea"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* User card */}
            <div className={"rounded-2xl border p-5 " + (isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200")}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {user ? user.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="min-w-0">
                  <div className={"text-sm font-bold truncate " + (isDark ? "text-gray-200" : "text-gray-800")}>{user ? user.split("@")[0] : t.guest}</div>
                  <div className={"text-xs truncate " + (isDark ? "text-gray-500" : "text-gray-400")}>{user}</div>
                </div>
              </div>
              <div className={"flex items-center justify-between p-3 rounded-xl mb-3 " + (isDark ? "bg-gray-800" : "bg-gray-50")}>
                <div className="text-center">
                  <div className={"text-xl font-black " + (isDark ? "text-gray-100" : "text-gray-900")}>{totalPlans}</div>
                  <div className={"text-[10px] " + (isDark ? "text-gray-500" : "text-gray-400")}>{t.total_plans}</div>
                </div>
                <div className={"w-px h-8 " + (isDark ? "bg-gray-700" : "bg-gray-200")} />
                <div className="text-center">
                  <div className="text-xl font-black text-green-600">{completedPlans}</div>
                  <div className={"text-[10px] " + (isDark ? "text-gray-500" : "text-gray-400")}>{t.completed}</div>
                </div>
                <div className={"w-px h-8 " + (isDark ? "bg-gray-700" : "bg-gray-200")} />
                <div className="text-center">
                  <div className="text-xl font-black text-orange-500">{totalPlans - completedPlans}</div>
                  <div className={"text-[10px] " + (isDark ? "text-gray-500" : "text-gray-400")}>{lang === "tr" ? "Aktif" : lang === "ar" ? "نشط" : "Active"}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className={"w-full py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 " + (isDark ? "border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-red-400" : "border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200")}
              >
                <LogoutIcon />
                {t.logout}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}