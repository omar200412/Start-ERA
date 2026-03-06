'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

/**
 * --- SMART API ROUTER ---
 * Vercel uyumu için localhost bağımlılığı tamamen kaldırıldı.
 */
const API_URL = "/api"; 

// --- YEREL TOAST SİSTEMİ ---
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

// --- TEMA & CONTEXT ---
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
  return <ThemeContext.Provider value={{ darkMode, toggleTheme }}>{children}</ThemeContext.Provider>;
};
const useTheme = () => useContext(ThemeContext);

// --- IKONLAR ---
const Icons = {
  Rocket: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Sun: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Moon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
};

// ==========================================
// DASHBOARD COMPONENT
// ==========================================
function DashboardContent() {
  const { darkMode, toggleTheme } = useTheme();
  const [userEmail, setUserEmail] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [viewingProject, setViewingProject] = useState<any>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email && typeof window !== 'undefined') {
      window.location.href = "/login";
      return;
    }
    setUserEmail(email || "");
    const saved = localStorage.getItem("user_projects");
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <Toaster />

      {/* MODAL (DETAY GÖRÜNÜMÜ) */}
      {viewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-[32px] shadow-2xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-2xl font-black text-blue-600">{viewingProject.title}</h2>
              <button onClick={() => setViewingProject(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {viewingProject.planData?.map((section: any, idx: number) => (
                <div key={idx} className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <h3 className="text-xl font-bold mb-3 text-blue-600 border-b border-blue-500/20 pb-2">{section.title}</h3>
                  <p className="leading-relaxed whitespace-pre-wrap opacity-80">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR (ESKİ ŞIK HALİ) */}
      <nav className={`px-8 py-6 flex justify-between items-center sticky top-0 z-40 backdrop-blur-xl border-b ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">S</div>
          <span className="text-2xl font-black tracking-tight">Start <span className="text-blue-600">ERA</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-black">{userEmail.split('@')[0]}</p>
            <p className="text-xs opacity-50">{userEmail}</p>
          </div>
          <button onClick={toggleTheme} className="p-2.5 rounded-xl border dark:border-slate-700">{darkMode ? <Icons.Sun /> : <Icons.Moon />}</button>
          <button onClick={handleLogout} className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Icons.Logout /></button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black mb-2 tracking-tight">Hoş geldin, <span className="text-blue-600">{userEmail.split('@')[0]}</span>! 🚀</h1>
            <p className="text-lg opacity-60 font-medium">Hayallerini gerçeğe dönüştürmeye devam et.</p>
          </div>
          <a href="/planner" className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[20px] shadow-2xl shadow-blue-500/30 transition-all transform hover:-translate-y-1 no-underline">
            + Yeni İş Planı Oluştur
          </a>
        </div>

        {/* PROJE KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((project, idx) => (
              <div key={idx} onClick={() => setViewingProject(project)} className="group cursor-pointer p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📄</div>
                  <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20">{project.status}</span>
                </div>
                <h3 className="text-2xl font-black mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                <p className="text-sm font-bold opacity-40 mb-8">{project.date}</p>
                <div className="w-full py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-center font-black group-hover:bg-blue-600 group-hover:text-white transition-all">Planı Görüntüle</div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-[40px]">
              <div className="text-6xl mb-6">💡</div>
              <h3 className="text-2xl font-black opacity-50">Henüz hiç projen yok. Haydi başla!</h3>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return <ThemeProvider><DashboardContent /></ThemeProvider>;
}