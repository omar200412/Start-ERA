'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Chatbot from '../Chatbot'; // Chatbot bileşeni

// ==========================================
// VERCEL UYUMLU ROUTER
// ==========================================
const safeRedirect = (path: string) => {
  if (typeof window !== 'undefined') {
      window.location.href = path;
  }
};

const Link = ({ href, children, className, title }: any) => {
  return (
    <a href={href} className={className} title={title}>
      {children}
    </a>
  );
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
  planData?: any[]; 
  planContent?: any[]; 
}

// ==========================================
// MULTI-LANGUAGE SÖZLÜK
// ==========================================
const TRANSLATIONS: any = {
  tr: {
    welcome: "Hoş geldin",
    subtitle: "Girişimcilik yolculuğunda bugün nereye odaklanıyoruz?",
    total_plans: "Toplam Proje",
    completed: "Tamamlanan",
    active_projects: "Aktif Süreç",
    ai_badge: "Yapay Zeka Destekli",
    create_new_plan: "Yeni İş Planı Oluştur",
    create_plan_desc: "Fikrini anlat, yapay zeka pazar analizinden finansal projeksiyona kadar her şeyi hazırlasın.",
    start_now: "Hemen Başla",
    recent_activity: "Son Aktiviteler",
    no_activity: "Henüz bir aktivite yok.",
    pro_member: "Pro Üye",
    home_tooltip: "Ana Sayfaya Dön",
    opening_plan: "Açılıyor...",
    close: "Kapat",
    missing_content: "Detay bulunamadı.",
    guest: "Girişimci"
  },
  en: {
    welcome: "Welcome",
    subtitle: "Where are we focusing today on your entrepreneurial journey?",
    total_plans: "Total Projects",
    completed: "Completed",
    active_projects: "Active Process",
    ai_badge: "AI Powered",
    create_new_plan: "Create New Business Plan",
    create_plan_desc: "Tell your idea, let AI prepare everything from market analysis to financial projections.",
    start_now: "Start Now",
    recent_activity: "Recent Activity",
    no_activity: "No activity yet.",
    pro_member: "Pro Member",
    home_tooltip: "Go to Home",
    opening_plan: "Opening...",
    close: "Close",
    missing_content: "Details not found.",
    guest: "Entrepreneur"
  },
  ar: {
    welcome: "أهلاً بك",
    subtitle: "أين سنركز اليوم في رحلتك الريادية؟",
    total_plans: "إجمالي المشاريع",
    completed: "مكتمل",
    active_projects: "عملية نشطة",
    ai_badge: "مدعوم بالذكاء الاصطناعي",
    create_new_plan: "إنشاء خطة عمل جديدة",
    create_plan_desc: "أخبرنا بفكرتك، ودع الذكاء الاصطناعي يجهز لك كل شيء من تحليل السوق إلى التوقعات المالية.",
    start_now: "ابدأ الآن",
    recent_activity: "النشاط الأخير",
    no_activity: "لا يوجد نشاط حتى الآن.",
    pro_member: "عضو محترف",
    home_tooltip: "العودة للرئيسية",
    opening_plan: "جاري الفتح...",
    close: "إغلاق",
    missing_content: "التفاصيل غير موجودة.",
    guest: "رائد أعمال"
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
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
};

// ==========================================
// DASHBOARD İÇERİĞİ
// ==========================================
function DashboardContent() {
  const { darkMode, toggleTheme } = useTheme();
  const [userEmail, setUserEmail] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [lang, setLang] = useState<"tr" | "en" | "ar">("tr");
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  const t = TRANSLATIONS[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    // 1. Auth Kontrolü
    const email = localStorage.getItem("userEmail");
    if (!email && typeof window !== 'undefined') {
       window.location.href = "/login";
       return;
    }
    setUserEmail(email || "");

    // 2. Projeler
    const saved = localStorage.getItem("user_projects");
    if (saved) setProjects(JSON.parse(saved));

    // 3. Dil
    const savedLang = localStorage.getItem("app_lang") as any;
    if (savedLang && ["tr", "en", "ar"].includes(savedLang)) {
        setLang(savedLang);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    safeRedirect("/login");
  };

  const toggleLang = () => {
    const newLang = lang === "tr" ? "en" : lang === "en" ? "ar" : "tr";
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  // İstatistikler
  const totalPlans = projects.length;
  const completedPlans = projects.filter(p => 
    p.status.includes("Tamam") || p.status.includes("Comp") || p.status.includes("مكتمل") || p.status === 'TAMAMLANDI'
  ).length;

  return (
    <div dir={dir} className={`min-h-screen transition-colors duration-500 font-sans ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <Toaster />
      
      {/* VERCEL UYUMLU CHATBOT */}
      <Chatbot />

      {/* PLAN DETAY MODALI */}
      {viewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-[32px] shadow-2xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
              <div>
                 <h2 className="text-2xl font-black text-blue-600">{viewingProject.title}</h2>
                 <p className="text-sm opacity-50">{viewingProject.date}</p>
              </div>
              <button onClick={() => setViewingProject(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <Icons.Close />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {(viewingProject.planData || viewingProject.planContent) ? (
                (viewingProject.planData || viewingProject.planContent)!.map((section: any, idx: number) => (
                  <div key={idx} className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                    <h3 className="text-xl font-bold mb-3 text-blue-600 border-b border-blue-500/20 pb-2">{section.title}</h3>
                    <p className="leading-relaxed whitespace-pre-wrap opacity-80">{section.content}</p>
                  </div>
                ))
              ) : (
                 <div className="text-center py-20 opacity-50">{t.missing_content}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className={`px-8 py-6 flex justify-between items-center sticky top-0 z-40 backdrop-blur-xl border-b ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"}`}>
        <div className="flex items-center gap-3">
          <Link href="/" className="group">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">S</div>
          </Link>
          <span className="text-2xl font-black tracking-tight hidden sm:block">Start <span className="text-blue-600">ERA</span></span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className={`hidden md:block ${lang === 'ar' ? 'ml-4 text-left' : 'mr-4 text-right'}`}>
            <p className="text-sm font-black">{userEmail ? userEmail.split('@')[0] : t.guest}</p>
            <p className="text-xs opacity-50 font-bold uppercase tracking-widest">{t.pro_member}</p>
          </div>
          
          <button onClick={toggleLang} className="font-black text-lg px-2 hover:scale-110 transition">
             {lang === "tr" ? "EN" : lang === "en" ? "AR" : "TR"}
          </button>

          {/* ANA SAYFA BUTONU */}
          <button 
             onClick={() => safeRedirect("/")} 
             title={t.home_tooltip}
             className={`p-2.5 rounded-xl border transition-all hover:bg-blue-600 hover:text-white ${darkMode ? 'bg-slate-800 border-slate-700 text-blue-400' : 'bg-white border-slate-200 text-blue-600'}`}
          >
            <Icons.Home />
          </button>

          <button onClick={toggleTheme} className={`p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-200 text-slate-600'}`}>
             {darkMode ? <Icons.Sun /> : <Icons.Moon />}
          </button>
          
          <button onClick={handleLogout} className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
             <Icons.Logout />
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto p-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
            {t.welcome}, <span className="text-blue-600">{userEmail ? userEmail.split('@')[0] : t.guest}</span>! 🚀
          </h1>
          <p className="text-lg opacity-60 font-medium">{t.subtitle}</p>
        </header>

        {/* İSTATİSTİKLER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
           <div className={`p-8 rounded-[32px] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest mb-2">{t.total_plans}</p>
              <div className="text-5xl font-black">{totalPlans}</div>
           </div>
           <div className={`p-8 rounded-[32px] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest mb-2">{t.completed}</p>
              <div className="text-5xl font-black text-green-500">{completedPlans}</div>
           </div>
           <div className={`p-8 rounded-[32px] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest mb-2">{t.active_projects}</p>
              <div className="text-5xl font-black text-orange-500">{totalPlans - completedPlans}</div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* HIZLI BAŞLANGIÇ KARTI */}
          <div className="lg:col-span-2">
            <Link href="/planner" className="block group no-underline text-inherit">
              <div className={`p-10 rounded-[40px] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700' : 'bg-gradient-to-br from-white to-blue-50 border-slate-200'}`}>
                 <div className="flex justify-between items-start mb-8">
                    <div>
                       <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-4">{t.ai_badge}</div>
                       <h2 className="text-4xl font-black mb-4">{t.create_new_plan}</h2>
                       <p className="opacity-60 max-w-lg text-lg leading-relaxed">{t.create_plan_desc}</p>
                    </div>
                    <div className="p-6 bg-blue-600 text-white rounded-3xl shadow-xl group-hover:scale-110 transition-transform">
                       <Icons.Rocket />
                    </div>
                 </div>
                 <div className="mt-4 font-black text-blue-600 text-xl flex items-center gap-2 group-hover:gap-4 transition-all">
                    {t.start_now} <span className={lang === 'ar' ? 'rotate-180' : ''}>→</span>
                 </div>
              </div>
            </Link>
          </div>

          {/* SON AKTİVİTELER */}
          <div>
             <h3 className="text-2xl font-black mb-6">{t.recent_activity}</h3>
             <div className={`p-8 rounded-[40px] border min-h-[350px] ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                {projects.length === 0 ? (
                   <div className="opacity-30 text-center py-24 font-bold text-lg">{t.no_activity}</div>
                ) : (
                   [...projects].reverse().slice(0, 5).map((project, i) => (
                      <div key={i} onClick={() => {toast(t.opening_plan); setViewingProject(project);}} className="flex items-center gap-5 cursor-pointer py-4 border-b last:border-0 dark:border-slate-800 hover:text-blue-600 transition-all group">
                         <div className="w-3 h-3 rounded-full bg-blue-600 group-hover:scale-125 transition-transform"></div>
                         <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-base truncate">{project.title}</h4>
                            <p className="text-xs opacity-40 font-bold uppercase tracking-tighter">{project.date}</p>
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

export default function Dashboard() {
  return <ThemeProvider><DashboardContent /></ThemeProvider>;
}