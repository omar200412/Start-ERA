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

function RocketIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
      if (cached) {
        try { setProjects(JSON.parse(cached)); } catch {}
      }
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

  const bg = darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900";
  const navBg = darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200";
  const cardBg = darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm";
  const activityBg = darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm";
  const ctaBg = darkMode ? "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700" : "bg-gradient-to-br from-white to-blue-50/50 border-slate-200";
  const modalBg = darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200";
  const modalHeaderBg = darkMode ? "border-slate-800" : "border-slate-100";
  const sectionBg = darkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100";
  const homeBtnClass = darkMode ? "bg-slate-800 border-slate-700 text-blue-400" : "bg-white border-slate-200 text-blue-600";
  const themeBtnClass = darkMode ? "bg-slate-800 border-slate-700 text-yellow-400" : "bg-white border-slate-200 text-slate-600";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={"min-h-screen font-sans transition-colors duration-500 " + bg}>
      <Chatbot />

      {viewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className={"relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-[32px] shadow-2xl border " + modalBg}>
            <div className={"p-6 border-b flex justify-between items-start " + modalHeaderBg}>
              <div>
                <h2 className="text-2xl font-black text-blue-600">{viewingProject.title}</h2>
                <p className="text-sm opacity-40 mt-0.5">{viewingProject.date}</p>
              </div>
              <button onClick={() => setViewingProject(null)} className={"p-2 rounded-full transition " + (darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100")}>
                <CloseIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {viewingProject.planData ? (
                viewingProject.planData.map((section: any, idx: number) => (
                  <div key={idx} className={"p-6 rounded-2xl border " + sectionBg}>
                    <h3 className="text-lg font-bold mb-3 text-blue-600 border-b border-blue-500/20 pb-2">{section.title}</h3>
                    <p className="leading-relaxed whitespace-pre-wrap opacity-80 text-sm">{section.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 opacity-40 font-bold">{t.missing_content}</div>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className={"px-6 md:px-8 py-5 flex justify-between items-center sticky top-0 z-40 backdrop-blur-xl border-b " + navBg}>
        <div className="flex items-center gap-3">
          <a href="/">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg hover:scale-105 transition">S</div>
          </a>
          <span className="text-xl font-black tracking-tight hidden sm:block">Start <span className="text-blue-600">ERA</span></span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:block text-right mr-2">
            <p className="text-sm font-black leading-none">{user ? user.split("@")[0] : t.guest}</p>
            <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest mt-0.5">{t.pro_member}</p>
          </div>
          <button onClick={toggleLang} className="font-black text-sm px-2 hover:text-blue-600 transition">{getLangLabel()}</button>
          <button onClick={() => window.location.href = "/"} title={t.home_tooltip} className={"p-2.5 rounded-xl border transition hover:bg-blue-600 hover:text-white hover:border-blue-600 " + homeBtnClass}>
            <HomeIcon />
          </button>
          <button onClick={toggleTheme} className={"p-2.5 rounded-xl border transition " + themeBtnClass}>
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <button onClick={logout} className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition">
            <LogoutIcon />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
            {t.welcome}, <span className="text-blue-600">{user ? user.split("@")[0] : t.guest}</span>! 🚀
          </h1>
          <p className="text-lg opacity-60">{t.subtitle}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center">
          {[
            { label: t.total_plans, value: totalPlans, color: "" },
            { label: t.completed, value: completedPlans, color: "text-green-500" },
            { label: t.active_projects, value: totalPlans - completedPlans, color: "text-orange-500" },
          ].map((stat, i) => (
            <div key={i} className={"p-8 rounded-[28px] border " + cardBg}>
              <p className="text-xs font-bold opacity-40 uppercase tracking-widest mb-3">{stat.label}</p>
              <div className={"text-5xl font-black " + stat.color}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <a href="/planner" className="block group no-underline">
              <div className={"p-8 md:p-10 rounded-[36px] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 " + ctaBg}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 pr-4">
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-4">{t.ai_badge}</div>
                    <h2 className="text-3xl md:text-4xl font-black mb-3">{t.create_new_plan}</h2>
                    <p className="opacity-60 text-base leading-relaxed">{t.create_plan_desc}</p>
                  </div>
                  <div className="p-5 bg-blue-600 text-white rounded-3xl shadow-xl group-hover:scale-110 transition-transform flex-shrink-0">
                    <RocketIcon />
                  </div>
                </div>
                <div className="font-black text-blue-600 text-lg flex items-center gap-2 group-hover:gap-4 transition-all">
                  {t.start_now} <span className={isRTL ? "rotate-180 inline-block" : ""}>→</span>
                </div>
              </div>
            </a>
          </div>

          <div>
            <h3 className="text-xl font-black mb-5">{t.recent_activity}</h3>
            <div className={"p-6 rounded-[36px] border min-h-[300px] " + activityBg}>
              {loadingProjects ? (
                <div className="opacity-30 text-center py-20 text-sm font-bold">{t.loading_projects}</div>
              ) : projects.length === 0 ? (
                <div className="opacity-30 text-center py-20 font-bold">{t.no_activity}</div>
              ) : (
                projects.slice(0, 6).map((project, i) => (
                  <div
                    key={project.id ?? i}
                    onClick={() => { toast(t.opening_plan); setViewingProject(project); }}
                    className="flex items-center gap-4 cursor-pointer py-4 border-b last:border-0 dark:border-slate-800 hover:text-blue-600 transition-all group"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 group-hover:scale-125 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{project.title}</h4>
                      <p className="text-xs opacity-40 font-semibold mt-0.5">{project.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}