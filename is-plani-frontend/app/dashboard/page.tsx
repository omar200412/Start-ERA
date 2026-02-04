"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";

// --- MOCK CONTEXT (Güvenli Çalıştırma İçin) ---
const ThemeAuthContext = createContext<any>(null);
const ThemeAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const user = "girisimci@startera.com"; 
  const toggleTheme = () => setDarkMode(!darkMode);
  const logout = () => {
    toast.success("Çıkış yapıldı");
    if (typeof window !== 'undefined') window.location.href = "/login";
  };
  return (
    <ThemeAuthContext.Provider value={{ user, darkMode, toggleTheme, logout }}>
      <div className={darkMode ? 'dark' : ''}>{children}</div>
    </ThemeAuthContext.Provider>
  );
};
const useThemeAuth = () => useContext(ThemeAuthContext);

// --- ICONS ---
const MoonIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeWidth={2}/></svg>);
const SunIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth={2}/></svg>);
const HomeIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth={2}/></svg>);
const LockIcon = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth={2}/></svg>);

// --- CHATBOT BUTTON ---
const ChatbotButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <button 
        onClick={() => toast("Asistan şu an müsait 🤖", { icon: '👋', style: { borderRadius: '12px', background: '#333', color: '#fff' } })} 
        className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition active:scale-95 ring-4 ring-blue-500/20"
      >
        🤖
      </button>
    </div>
  );
};

// --- ÇEVİRİ SÖZLÜĞÜ ---
const TRANSLATIONS = {
  tr: { 
      home: "Ana Sayfa", 
      hello: "Merhaba", 
      subtitle: "Bugün hangi harika fikri hayata geçirmek istersin?", 
      new_plan_title: "İş Planı Oluştur", 
      new_plan_desc: "Fikrini saniyeler içinde profesyonel bir iş planına dönüştür.", 
      idea_title: "İş Fikri Üretici", 
      idea_desc: "Pazar boşluklarını analiz ederek karlı girişim fikirleri önerir.",
      swot_title: "SWOT Analizi", 
      swot_desc: "Girişiminin Güçlü, Zayıf yönlerini, Fırsatları ve Tehditleri raporlar.",
      deck_title: "Yatırımcı Sunumu", 
      deck_desc: "Yatırımcılardan fon almanı sağlayacak profesyonel sunum taslağı.",
      coming_soon: "YAKINDA", 
      logout_btn: "Çıkış Yap", 
      start_btn: "Hemen Başla", 
      locked: "Kilitli Özellik"
  },
  en: { 
      home: "Home", 
      hello: "Hello", 
      subtitle: "Which great idea do you want to bring to life today?", 
      new_plan_title: "Create Business Plan", 
      new_plan_desc: "Turn your idea into a professional business plan in seconds.", 
      idea_title: "Business Idea Generator", 
      idea_desc: "AI suggests profitable startup ideas by analyzing market gaps.",
      swot_title: "SWOT Analysis", 
      swot_desc: "Analyze your startup's strengths, weaknesses, opportunities, and threats.",
      deck_title: "Pitch Deck Creator", 
      deck_desc: "Generate a professional pitch deck draft to get funded.",
      coming_soon: "COMING SOON", 
      logout_btn: "Logout", 
      start_btn: "Start Now", 
      locked: "Locked"
  },
  ar: { 
      home: "الرئيسية", 
      hello: "مرحباً", 
      subtitle: "أي فكرة رائعة تريد تحقيقها اليوم؟", 
      new_plan_title: "إنشاء خطة عمل", 
      new_plan_desc: "حول فكرتك إلى خطة عمل احترافية في ثوانٍ.", 
      idea_title: "مولد أفكار الأعمال", 
      idea_desc: "يقترح الذكاء الاصطناعي أفكار عمل مربحة من خلال تحليل السوق.",
      swot_title: "تحليل SWOT", 
      swot_desc: "حلل نقاط القوة والضعف والفرص والتهديدات لمشروعك.",
      deck_title: "عروض المستثمرين", 
      deck_desc: "قم بإعداد مسودة عرض تقديمي احترافية للحصول على التمويل.",
      coming_soon: "قريباً", 
      logout_btn: "تسجيل الخروج", 
      start_btn: "ابدأ الآن", 
      locked: "مغلق"
  }
};

// --- MAIN DASHBOARD CONTENT ---
function DashboardContent() {
  const { user, darkMode, toggleTheme, logout } = useThemeAuth();
  const [lang, setLang] = useState<"tr" | "en" | "ar">("tr");

  // Dil Yükleme
  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as "tr" | "en" | "ar";
    if (savedLang && ["tr", "en", "ar"].includes(savedLang)) {
        setLang(savedLang);
    }
  }, []);

  const toggleLang = () => {
    let newLang: "tr" | "en" | "ar" = lang === "tr" ? "en" : lang === "en" ? "ar" : "tr";
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  const getLangLabel = () => { 
    if (lang === "tr") return "EN"; 
    if (lang === "en") return "AR"; 
    return "TR"; 
  };

  const t = TRANSLATIONS[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} className={`min-h-screen p-8 font-sans transition-all duration-700 relative overflow-hidden ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* --- BACKGROUND ANIMATION --- */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
         <div className={`absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 animate-pulse ${darkMode ? 'bg-blue-900' : 'bg-blue-300'}`}></div>
         <div className={`absolute top-[40%] -right-[10%] w-[50%] h-[70%] rounded-full blur-[130px] opacity-20 animate-pulse delay-1000 ${darkMode ? 'bg-purple-900' : 'bg-indigo-300'}`}></div>
         <div className={`absolute -bottom-[20%] left-[20%] w-[70%] h-[50%] rounded-full blur-[110px] opacity-15 animate-pulse delay-2000 ${darkMode ? 'bg-emerald-900' : 'bg-teal-300'}`}></div>
      </div>

      <Toaster position="top-center" />
      <ChatbotButton />

      {/* --- NAVBAR --- */}
      <nav className={`px-8 py-5 flex flex-col md:flex-row justify-between items-center backdrop-blur-xl sticky top-0 z-40 border-b mb-10 transition-colors rounded-2xl ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white/60 border-slate-200"}`}>
        <a href="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-80 transition cursor-pointer mb-4 md:mb-0 no-underline">
            Start ERA
        </a>
        <div className="flex items-center gap-4">
             <a href="/" className={`flex items-center gap-2 font-bold text-sm px-4 py-2.5 rounded-xl border transition-all hover:shadow-lg no-underline active:scale-95 ${darkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-200' : 'border-slate-200 hover:bg-white text-slate-700 bg-white/50'}`}>
                <HomeIcon /><span>{t.home}</span>
             </a>
             
             <button onClick={toggleLang} className="font-black text-lg hover:scale-110 transition active:scale-95 px-2 w-10 text-center" title="Change Language">{getLangLabel()}</button>
             
             <button onClick={toggleTheme} className={`p-2.5 rounded-xl transition-all active:scale-95 ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-600 shadow-sm hover:shadow-md border border-slate-100'}`}>
                {darkMode ? <SunIcon /> : <MoonIcon />}
             </button>
             
             <button onClick={logout} className="text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors">
                {t.logout_btn}
             </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className={`text-4xl md:text-5xl font-black mb-3 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {t.hello}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{user?.split('@')[0]}</span> 👋
        </h1>
        <p className={`mb-12 text-lg font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.subtitle}</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Active Card - Create Plan */}
          <a href="/planner" className={`group relative p-1 rounded-[32px] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl hover:shadow-blue-500/30 transition-all hover:-translate-y-2 no-underline active:scale-[0.99]`}>
            <div className={`relative h-full p-8 rounded-[30px] flex flex-col justify-between ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                <div>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg ${darkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>📄</div>
                    <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t.new_plan_title}</h3>
                    <p className={`text-base leading-relaxed mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.new_plan_desc}</p>
                </div>
                <div className={`font-bold text-lg flex items-center gap-2 group-hover:gap-4 transition-all text-blue-600 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    {t.start_btn} <span className={`transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`}>→</span>
                </div>
            </div>
          </a>

          {/* Locked Cards - Grid */}
          {[
            { icon: "💡", title: t.idea_title, desc: t.idea_desc, badge: "yellow" },
            { icon: "📊", title: t.swot_title, desc: t.swot_desc, badge: "orange" },
            { icon: "🎤", title: t.deck_title, desc: t.deck_desc, badge: "purple" }
          ].map((item, idx) => (
            <div key={idx} className={`relative p-8 rounded-[32px] border border-dashed transition-all hover:bg-slate-50/50 dark:hover:bg-slate-900/50 ${darkMode ? 'bg-slate-900/40 border-slate-700' : 'bg-white/60 border-slate-300'}`}>
                <div className={`absolute top-5 right-5 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse uppercase tracking-wide shadow-lg ${
                    item.badge === 'yellow' ? 'bg-yellow-500' : item.badge === 'orange' ? 'bg-orange-500' : 'bg-purple-500'
                }`}>
                    {t.coming_soon}
                </div>
                
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 grayscale opacity-60 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{item.icon}</div>
                <h3 className={`text-xl font-bold mb-3 opacity-70 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                <p className={`text-sm opacity-60 mb-6 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <LockIcon /> <span>{t.locked}</span>
                </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeAuthProvider>
      <DashboardContent />
    </ThemeAuthProvider>
  );
}