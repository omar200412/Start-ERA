'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

// ==========================================
// API & ROUTER GÜNCELLEMESİ
// ==========================================
const API_URL = "/api"; 

const safeRedirect = (path: string) => {
  if (typeof window !== 'undefined') {
      window.location.href = path;
  }
};

// ==========================================
// YEREL TOAST SİSTEMİ
// ==========================================
const toastEvents = {
  listeners: [] as ((t: any) => void)[],
  emit(toast: any) { this.listeners.forEach(l => l(toast)); },
  subscribe(l: (t: any) => void) { this.listeners.push(l); return () => { this.listeners = this.listeners.filter(x => x !== l); }; }
};

const toast = (msg: string, opts?: any) => toastEvents.emit({ id: Date.now(), msg, type: 'default', icon: opts?.icon || 'ℹ️' });
toast.success = (msg: string) => toastEvents.emit({ id: Date.now(), msg, type: 'success', icon: '✅' });
toast.error = (msg: string) => toastEvents.emit({ id: Date.now(), msg, type: 'error', icon: '❌' });

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
  color: string;
  planData?: { title: string; content: string }[]; // Planner'dan 'planData' olarak geliyor
}

// ==========================================
// ÇEVİRİLER
// ==========================================
const TRANSLATIONS: any = {
  tr: {
    welcome: "Hoş Geldin", subtitle: "Bugün nereye odaklanıyoruz?",
    total_plans: "Toplam Proje", completed: "Tamamlanan", active_projects: "Aktif Süreç",
    quick_start: "Hızlı Başlangıç", ai_badge: "Yapay Zeka Destekli",
    create_new_plan: "Yeni İş Planı Oluştur",
    create_plan_desc: "Fikrini anlat, yapay zeka her şeyi hazırlasın.",
    start_now: "Hemen Başla", recent_activity: "Son Aktiviteler",
    guest: "Girişimci", pro_member: "Pro Üyelik", logout_tooltip: "Çıkış Yap",
    home_tooltip: "Ana Sayfa", no_activity: "Henüz bir aktivite yok.",
    opening_plan: "İş planı açılıyor...", close: "Kapat",
    missing_content: "Bu planın detayları bulunamadı."
  },
  en: {
    welcome: "Welcome", subtitle: "Where are we focusing today?",
    total_plans: "Total Projects", completed: "Completed", active_projects: "Active Process",
    quick_start: "Quick Start", ai_badge: "AI Powered",
    create_new_plan: "Create New Plan",
    create_plan_desc: "Tell your idea, let AI prepare everything.",
    start_now: "Start Now", recent_activity: "Recent Activity",
    guest: "Entrepreneur", pro_member: "Pro Member", logout_tooltip: "Logout",
    home_tooltip: "Home", no_activity: "No activity yet.",
    opening_plan: "Opening plan...", close: "Close",
    missing_content: "Details not found."
  },
  ar: {
    welcome: "أهلاً بك", subtitle: "أين سنركز اليوم؟",
    total_plans: "إجمالي المشاريع", completed: "مكتمل", active_projects: "عملية نشطة",
    quick_start: "بداية سريعة", ai_badge: "مدعوم بالذكاء الاصطناعي",
    create_new_plan: "إنشاء خطة جديدة",
    create_plan_desc: "أخبرنا بفكرتك، ودع الذكاء الاصطناعي يجهز لك كل شيء.",
    start_now: "ابدأ الآن", recent_activity: "النشاط الأخير",
    guest: "رائد أعمال", pro_member: "عضو محترف", logout_tooltip: "خروج",
    home_tooltip: "الرئيسية", no_activity: "لا يوجد نشاط.",
    opening_plan: "جاري الفتح...", close: "إغلاق",
    missing_content: "لم يتم العثور على التفاصيل."
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
// MAIN COMPONENT
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
    // 1. Auth & Projeleri Yükle
    const email = localStorage.getItem("userEmail");
    if (!email && typeof window !== 'undefined') {
       window.location.href = "/login";
       return;
    }
    setUser({ name: email?.split('@')[0] || "Girişimci", email: email || "" });

    const storedProjects = localStorage.getItem("user_projects");
    if (storedProjects) setProjects(JSON.parse(storedProjects));

    // 2. Dil
    const savedLang = localStorage.getItem("app_lang") as any;
    if (savedLang) setLang(savedLang);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    safeRedirect("/login");
  };

  const handleActivityClick = (project: Project) => {
    toast(t.opening_plan, { icon: '📂' });
    setViewingProject(project);
  };

  const totalPlans = projects.length;
  const completedCount = projects.filter(p => p.status.includes("Tamam") || p.status.includes("Comp") || p.status.includes("مكتمل")).length;

  return (
    <div dir={dir} className={`min-h-screen transition-colors duration-500 font-sans ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <Toaster />

      {/* MODAL */}
      {viewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[32px] shadow-2xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center p-6 border-b dark:border-slate-800">
                <div>
                  <h2 className="text-2xl font-black text-blue-600">{viewingProject.title}</h2>
                  <p className="text-sm opacity-50">{viewingProject.date} - {viewingProject.status}</p>
                </div>
                <button onClick={() => setViewingProject(null)} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Icons.Close />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {viewingProject.planData ? (
                    viewingProject.planData.map((section: any, idx: number) => (
                        <div key={idx} className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
                            <h3 className="text-xl font-bold mb-4 text-blue-600">{section.title}</h3>
                            <p className="leading-relaxed whitespace-pre-wrap opacity-90">{section.content}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 opacity-50">{t.missing_content}</div>
                )}
            </div>
            <div className="p-6 border-t dark:border-slate-800 flex justify-end">
                <button onClick={() => setViewingProject(null)} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">{t.close}</button>
            </div>
          </div>
        </div>
      )}
      
      {/* NAVBAR */}
      <nav className={`px-6 py-4 flex justify-between items-center sticky top-0 z-40 backdrop-blur-xl border-b ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"}`}>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">Start ERA</span>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={() => {
              const newLang = lang === "tr" ? "en" : lang === "en" ? "ar" : "tr";
              setLang(newLang); localStorage.setItem("app_lang", newLang);
            }} className="font-bold">{lang === "tr" ? "EN" : lang === "en" ? "AR" : "TR"}</button>
            <button onClick={toggleTheme} className="p-2.5 rounded-xl border dark:border-slate-700">{darkMode ? <Icons.Sun /> : <Icons.Moon />}</button>
            <button onClick={handleLogout} className="p-2.5 rounded-xl bg-red-500/10 text-red-500"><Icons.Logout /></button>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-blue-600">{t.welcome}, {user.name}</h1>
            <p className="opacity-60">{t.subtitle}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-center">
           <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="opacity-50 text-sm mb-2">{t.total_plans}</div>
              <div className="text-4xl font-black">{totalPlans}</div>
           </div>
           <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="opacity-50 text-sm mb-2">{t.completed}</div>
              <div className="text-4xl font-black text-green-500">{completedCount}</div>
           </div>
           <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="opacity-50 text-sm mb-2">{t.active_projects}</div>
              <div className="text-4xl font-black text-orange-500">{totalPlans - completedCount}</div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <a href="/planner" className="block group no-underline text-inherit">
                    <div className={`p-8 rounded-[32px] border transition-all hover:shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-xs font-bold text-blue-600 uppercase mb-2">{t.ai_badge}</div>
                                <h2 className="text-3xl font-black mb-2">{t.create_new_plan}</h2>
                                <p className="opacity-60 max-w-md">{t.create_plan_desc}</p>
                            </div>
                            <div className="p-4 bg-blue-600 text-white rounded-2xl"><Icons.Rocket /></div>
                        </div>
                        <div className="mt-8 font-bold text-blue-600 flex items-center gap-2 group-hover:gap-4 transition-all">{t.start_now} →</div>
                    </div>
                </a>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-5">{t.recent_activity}</h3>
                <div className={`p-6 rounded-3xl border min-h-[300px] ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    {projects.length === 0 ? (
                        <div className="opacity-30 text-center py-20">{t.no_activity}</div>
                    ) : (
                        [...projects].reverse().slice(0, 5).map((project, i) => (
                            <div key={i} onClick={() => handleActivityClick(project)} className="flex items-center gap-4 cursor-pointer py-3 border-b last:border-0 dark:border-slate-800 hover:text-blue-600 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm truncate">{project.title}</h4>
                                    <p className="text-xs opacity-50">{project.date}</p>
                                </div>
                                <span className="text-[10px] font-black uppercase opacity-60">{project.status}</span>
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