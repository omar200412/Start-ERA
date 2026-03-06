'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

// ==========================================
// SMART API URL ROUTER
// ==========================================
const API_URL = "/api"; 

// ==========================================
// YEREL TOAST SİSTEMİ (Bildirimler İçin)
// ==========================================
const toastEvents = {
  listeners: [] as ((t: any) => void)[],
  emit(toast: any) { this.listeners.forEach(l => l(toast)); },
  subscribe(l: (t: any) => void) { this.listeners.push(l); return () => { this.listeners = this.listeners.filter(x => x !== l); }; }
};

const toast = (msg: string, opts?: any) => toastEvents.emit({ id: Date.now(), msg, type: 'default', icon: opts?.icon || 'ℹ️' });

const Toaster = () => {
  const [toasts, setToasts] = useState<any[]>([]);
  useEffect(() => {
    return toastEvents.subscribe((event) => {
      setToasts(prev => [...prev, event]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== event.id)), 3000);
    });
  }, []);
  
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 animate-in slide-in-from-right-5 fade-in duration-300">
          <span className="text-lg">{t.icon}</span>
          <span className="text-sm font-bold">{t.msg}</span>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// TEMA & CONTEXT
// ==========================================
const ThemeContext = createContext<any>(null);
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
      if (typeof window !== 'undefined') {
          const theme = localStorage.getItem("theme");
          if (theme === "dark" || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
      }
  }, []);

  const toggleTheme = () => {
      const newMode = !darkMode;
      setDarkMode(newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      if (newMode) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>{children}</div>
    </ThemeContext.Provider>
  );
};
const useTheme = () => useContext(ThemeContext);

// ==========================================
// TİP TANIMLARI
// ==========================================
interface Project {
  id: number;
  title: string;
  status: string;
  date: string;
  color?: string;
  planData?: { title: string; content: string }[];
}

// ==========================================
// ÇEVİRİLER
// ==========================================
const TRANSLATIONS = {
  tr: {
    welcome: "Hoş Geldin", subtitle: "Girişimcilik yolculuğunda bugün nereye odaklanıyoruz?",
    total_plans: "Toplam Proje", completed: "Tamamlanan", active_projects: "Aktif Süreç",
    quick_start: "Hızlı Başlangıç", ai_badge: "Yapay Zeka Destekli",
    create_new_plan: "Yeni İş Planı Oluştur",
    create_plan_desc: "Fikrini anlat, yapay zeka pazar analizinden finansal projeksiyona kadar her şeyi hazırlasın.",
    start_now: "Hemen Başla", recent_activity: "Son Aktiviteler",
    guest: "Girişimci", pro_member: "Pro Üyelik", logout_tooltip: "Çıkış Yap",
    home_tooltip: "Ana Sayfa", no_activity: "Henüz bir aktivite yok.",
    opening_plan: "İş planı açılıyor...", close: "Kapat", missing_content: "Detay bulunamadı."
  },
  en: {
    welcome: "Welcome", subtitle: "Where are we focusing today?",
    total_plans: "Total Projects", completed: "Completed", active_projects: "Active Process",
    quick_start: "Quick Start", ai_badge: "AI Powered",
    create_new_plan: "Create New Plan",
    create_plan_desc: "Tell your idea, let AI prepare everything from market analysis to finance.",
    start_now: "Start Now", recent_activity: "Recent Activity",
    guest: "Entrepreneur", pro_member: "Pro Member", logout_tooltip: "Logout",
    home_tooltip: "Home", no_activity: "No activity yet.",
    opening_plan: "Opening plan...", close: "Close", missing_content: "Details not found."
  },
  ar: {
    welcome: "أهلاً بك", subtitle: "أين سنركز اليوم في رحلتك الريادية؟",
    total_plans: "إجمالي المشاريع", completed: "مكتمل", active_projects: "عملية نشطة",
    quick_start: "بداية سريعة", ai_badge: "مدعوم بالذكاء الاصطناعي",
    create_new_plan: "إنشاء خطة عمل جديدة",
    create_plan_desc: "أخبرنا بفكرتك، ودع الذكاء الاصطناعي يجهز لك كل شيء.",
    start_now: "ابدأ الآن", recent_activity: "النشاط الأخير",
    guest: "رائد أعمال", pro_member: "عضو محترف", logout_tooltip: "تسجيل الخروج",
    home_tooltip: "الرئيسية", no_activity: "لا يوجد نشاط.",
    opening_plan: "جاري فتح الخطة...", close: "إغلاق", missing_content: "لم يتم العثور على التفاصيل."
  }
};

// ==========================================
// İKONLAR
// ==========================================
const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Sun: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Moon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Rocket: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Chart: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Document: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  ArrowRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
};

// ==========================================
// DASHBOARD CONTENT
// ==========================================
function DashboardContent() {
  const { darkMode, toggleTheme } = useTheme();
  const [user, setUser] = useState({ name: "", email: "" });
  const [projects, setProjects] = useState<Project[]>([]);
  const [lang, setLang] = useState<"tr" | "en" | "ar">("tr");
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  const t = TRANSLATIONS[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    // 1. Kullanıcı Verisi
    const email = localStorage.getItem("userEmail");
    if (!email && typeof window !== 'undefined') {
       window.location.href = "/login";
       return;
    }
    setUser({ name: email?.split('@')[0] || "Girişimci", email: email || "" });

    // 2. Proje Verisi (Planner'dan gelen)
    const storedProjects = localStorage.getItem("user_projects");
    if (storedProjects) setProjects(JSON.parse(storedProjects));

    // 3. Dil Ayarı
    const savedLang = localStorage.getItem("app_lang") as any;
    if (savedLang) setLang(savedLang);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
  };

  const handleActivityClick = (project: Project) => {
    toast(t.opening_plan, { icon: '📂' });
    setViewingProject(project);
  };

  const totalPlans = projects.length;
  const completedPlans = projects.filter(p => p.status.includes("Tamam") || p.status.includes("Comp") || p.status.includes("مكتمل")).length;
  const goalPercent = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0;

  return (
    <div dir={dir} className={`min-h-screen transition-colors duration-500 font-sans ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <Toaster />

      {/* MODAL (DETAY GÖRÜNÜMÜ) */}
      {viewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[32px] shadow-2xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center p-6 border-b dark:border-slate-800">
                <div>
                  <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{viewingProject.title}</h2>
                  <p className="text-sm opacity-50">{viewingProject.date} - {viewingProject.status}</p>
                </div>
                <button onClick={() => setViewingProject(null)} className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors">
                    <Icons.Close />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                {viewingProject.planData ? (
                    viewingProject.planData.map((section: any, idx: number) => (
                        <div key={idx} className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
                            <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400 border-b border-slate-200 dark:border-slate-700 pb-2">{section.title}</h3>
                            <p className={`leading-relaxed text-lg whitespace-pre-wrap ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{section.content}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 opacity-50">{t.missing_content}</div>
                )}
            </div>
            <div className="p-6 border-t dark:border-slate-800 flex justify-end gap-4">
                <button onClick={() => setViewingProject(null)} className={`px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 ${darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}`}>
                    {t.close}
                </button>
            </div>
          </div>
        </div>
      )}
      
      {/* NAVBAR */}
      <nav className={`px-6 py-4 flex justify-between items-center sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"}`}>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">S</div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">Start ERA</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => {
              const newLang = lang === "tr" ? "en" : lang === "en" ? "ar" : "tr";
              setLang(newLang); localStorage.setItem("app_lang", newLang);
            }} className="font-black text-lg hover:scale-110 transition active:scale-95 px-2">{lang === "tr" ? "EN" : lang === "en" ? "AR" : "TR"}</button>
            <button onClick={toggleTheme} className={`p-2.5 rounded-xl transition-all active:scale-95 ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-600 shadow-sm border border-slate-100'}`}><Icons.Sun /></button>
            <button onClick={handleLogout} className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-all active:scale-95"><Icons.Logout /></button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {t.welcome}, {user.name}
            </h1>
            <p className={`text-lg opacity-60`}>{t.subtitle}</p>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-center">
           <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-center gap-4 mb-2">
                 <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"><Icons.Document /></div>
                 <span className="font-bold opacity-60">{t.total_plans}</span>
              </div>
              <div className="text-4xl font-black">{totalPlans}</div>
           </div>
           <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-center gap-4 mb-2">
                 <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"><Icons.Chart /></div>
                 <span className="font-bold opacity-60">{t.completed}</span>
              </div>
              <div className="text-4xl font-black">{completedPlans}</div>
           </div>
           <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-center gap-4 mb-2">
                 <div className="p-2 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"><Icons.Rocket /></div>
                 <span className="font-bold opacity-60">{t.active_projects}</span>
              </div>
              <div className="text-4xl font-black">{totalPlans - completedPlans}</div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CTA */}
            <div className="lg:col-span-2">
                <a href="/planner" className="block group no-underline text-inherit">
                    <div className={`relative p-8 rounded-[32px] overflow-hidden border transition-all duration-300 hover:shadow-2xl ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-blue-500/50' : 'bg-gradient-to-br from-white to-blue-50 border-slate-200 hover:border-blue-300'}`}>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                            <div>
                                <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold uppercase mb-3">{t.ai_badge}</div>
                                <h2 className="text-3xl font-black mb-2">{t.create_new_plan}</h2>
                                <p className={`max-w-md opacity-60`}>{t.create_plan_desc}</p>
                            </div>
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Icons.Rocket /></div>
                        </div>
                        <div className="mt-8 flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 group-hover:gap-4 transition-all">
                            {t.start_now} <span>→</span>
                        </div>
                    </div>
                </a>
            </div>

            {/* RECENT ACTIVITY */}
            <div>
                <h3 className="text-xl font-bold mb-5">{t.recent_activity}</h3>
                <div className={`p-6 rounded-3xl border min-h-[300px] ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 opacity-30">
                            <Icons.Document />
                            <p className="text-sm mt-2 font-medium">{t.no_activity}</p>
                        </div>
                    ) : (
                        [...projects].reverse().slice(0, 5).map((project, i) => (
                            <div key={i} onClick={() => handleActivityClick(project)} className={`flex items-center gap-4 cursor-pointer p-3 -mx-3 rounded-2xl transition-all ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm truncate">{project.title}</h4>
                                    <p className="text-xs opacity-50">{project.date}</p>
                                </div>
                                <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-blue-500/10 text-blue-500">{project.status}</span>
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

export default function App() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
}