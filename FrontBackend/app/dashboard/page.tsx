"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useThemeAuth } from "../context/ThemeAuthContext";
import { TRANSLATIONS } from "../lib/translations";
import Chatbot from "../Chatbot";

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

function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
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

  const totalPlans = projects.length;
  const completedPlans = projects.filter(p =>
    p.status?.toLowerCase().includes("comp") ||
    p.status?.toLowerCase().includes("tamam") ||
    p.status?.includes("مكتمل")
  ).length;

  const isDark = darkMode;
  const bg = isDark ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900";
  const navBg = isDark ? "bg-gray-950/95 border-gray-800" : "bg-white/95 border-gray-200";
  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const subtext = isDark ? "text-gray-400" : "text-gray-500";
  const border = isDark ? "border-gray-800" : "border-gray-200";
  const modalBg = isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200";
  const sectionBg = isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-100";
  const hoverRow = isDark ? "hover:bg-gray-800" : "hover:bg-gray-50";

  const lightModeLabel = lang === "tr" ? "Aydınlık" : lang === "ar" ? "فاتح" : "Light";
  const darkModeLabel = lang === "tr" ? "Karanlık" : lang === "ar" ? "داكن" : "Dark";

  const STATS = [
    { label: t.total_plans, value: totalPlans, color: "text-blue-600" },
    { label: t.completed, value: completedPlans, color: "text-green-600" },
    { label: t.active_projects, value: totalPlans - completedPlans, color: "text-orange-500" },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={"min-h-screen font-sans transition-colors duration-300 " + bg}>
      <Chatbot />

      {/* Plan detail modal */}
      {viewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={"relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border " + modalBg}>
            <div className={"p-6 border-b flex justify-between items-start " + border}>
              <div>
                <h2 className={"text-xl font-black " + (isDark ? "text-gray-100" : "text-gray-900")}>{viewingProject.title}</h2>
                <p className={"text-sm mt-0.5 " + subtext}>{viewingProject.date}</p>
              </div>
              <button onClick={() => setViewingProject(null)} className={"p-2 rounded-lg transition " + (isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500")}>
                <CloseIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {viewingProject.planData ? (
                viewingProject.planData.map((section: any, idx: number) => (
                  <div key={idx} className={"p-6 rounded-xl border " + sectionBg}>
                    <h3 className="text-base font-bold mb-3 text-blue-600 border-b border-blue-500/20 pb-2">{section.title}</h3>
                    <p className={"leading-relaxed whitespace-pre-wrap text-sm " + subtext}>{section.content}</p>
                  </div>
                ))
              ) : (
                <div className={"text-center py-20 font-bold " + subtext}>{t.missing_content}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className={"sticky top-0 z-40 border-b backdrop-blur-md " + navBg}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2 no-underline">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">S</div>
                <span className={"text-xl font-black tracking-tight hidden sm:block " + (isDark ? "text-gray-100" : "text-gray-900")}>Start <span className="text-blue-600">ERA</span></span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <div className={"hidden md:block text-right mr-3 " + (isRTL ? "text-left ml-3 mr-0" : "")}>
                <p className={"text-sm font-bold leading-none " + (isDark ? "text-gray-200" : "text-gray-900")}>{user ? user.split("@")[0] : t.guest}</p>
                <p className={"text-xs font-medium " + subtext}>{t.pro_member}</p>
              </div>

              <button onClick={toggleLang} className={"text-sm font-bold px-2.5 py-1.5 rounded-lg border transition " + (isDark ? "border-gray-700 text-gray-300 hover:border-blue-500" : "border-gray-300 text-gray-600 hover:border-blue-600")}>
                {getLangLabel()}
              </button>

              <a href="/" title={t.home_tooltip} className={"p-2.5 rounded-lg border transition no-underline " + (isDark ? "border-gray-700 text-blue-400 hover:bg-gray-800" : "border-gray-300 text-blue-600 hover:bg-gray-100")}>
                <HomeIcon />
              </a>

              <button onClick={toggleTheme} className={"p-2.5 rounded-lg border transition " + (isDark ? "border-gray-700 text-yellow-400 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100")} title={isDark ? lightModeLabel : darkModeLabel}>
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>

              <button onClick={logout} className="p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-200" title={t.logout}>
                <LogoutIcon />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className={"text-3xl md:text-4xl font-black mb-1 " + (isDark ? "text-gray-100" : "text-gray-900")}>
            {t.welcome}, <span className="text-blue-600">{user ? user.split("@")[0] : t.guest}</span>! 👋
          </h1>
          <p className={"text-base " + subtext}>{t.subtitle}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {STATS.map((stat, i) => (
            <div key={i} className={"p-6 rounded-2xl border " + cardBg}>
              <p className={"text-xs font-bold uppercase tracking-widest mb-3 " + subtext}>{stat.label}</p>
              <div className={"text-5xl font-black " + stat.color}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* New plan CTA */}
          <div className="lg:col-span-2">
            <a href="/planner" className="block group no-underline">
              <div className={"p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 " + (isDark ? "bg-blue-950 border-blue-800" : "bg-blue-600")}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 pr-4">
                    <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-4">{t.ai_badge}</div>
                    <h2 className="text-2xl md:text-3xl font-black mb-3 text-white">{t.create_new_plan}</h2>
                    <p className="text-blue-100 text-sm leading-relaxed">{t.create_plan_desc}</p>
                  </div>
                  <div className="p-4 bg-white/20 text-white rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                    <PlusIcon />
                  </div>
                </div>
                <div className="font-bold text-white text-base flex items-center gap-2 group-hover:gap-4 transition-all">
                  {t.start_now} <span className={isRTL ? "rotate-180 inline-block" : ""}>→</span>
                </div>
              </div>
            </a>
          </div>

          {/* Recent activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={"text-lg font-black " + (isDark ? "text-gray-100" : "text-gray-900")}>{t.recent_activity}</h3>
              {projects.length > 0 && (
                <a href="/planner" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition no-underline">{t.start_now} →</a>
              )}
            </div>
            <div className={"rounded-2xl border overflow-hidden " + cardBg}>
              {loadingProjects ? (
                <div className={"p-8 text-center text-sm " + subtext}>{t.loading_projects}</div>
              ) : projects.length === 0 ? (
                <div className="p-8 text-center">
                  <p className={"text-sm mb-4 " + subtext}>{t.no_activity}</p>
                  <a href="/planner" className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-sm transition no-underline">{t.create_new_plan}</a>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {projects.slice(0, 6).map((project, i) => (
                    <div
                      key={project.id ?? i}
                      onClick={() => { toast(t.opening_plan); setViewingProject(project); }}
                      className={"flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors " + hoverRow}
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className={"font-semibold text-sm truncate " + (isDark ? "text-gray-200" : "text-gray-800")}>{project.title}</h4>
                        <p className={"text-xs mt-0.5 " + subtext}>{project.date}</p>
                      </div>
                      <svg className={"w-4 h-4 flex-shrink-0 " + subtext} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}