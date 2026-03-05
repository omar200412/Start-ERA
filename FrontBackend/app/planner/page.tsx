'use client';

import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

/**
 * --- API URL GÜNCELLEMESİ ---
 * Localhost bağımlılığı tamamen kaldırıldı. 
 * Vercel üzerinde '/api' üzerinden doğrudan kendi backend'ine bağlanır.
 */
const API_URL = "/api";

// --- MOCK CONTEXT ---
const ThemeAuthContext = createContext<any>(null);
const ThemeAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
      if (typeof window !== 'undefined') {
          const theme = localStorage.getItem("theme");
          if (theme === "dark" || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
          }
          const storedEmail = localStorage.getItem("userEmail");
          if (storedEmail) setUser({ email: storedEmail });
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
    <ThemeAuthContext.Provider value={{ user, darkMode, toggleTheme }}>
      <div className={`${darkMode ? 'dark' : ''}`}>{children}</div>
    </ThemeAuthContext.Provider>
  );
};
const useThemeAuth = () => useContext(ThemeAuthContext);

// --- YARDIMCI BİLEŞENLER ---
const ResearchLoading = ({ status }: { status: string }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-3xl transition-all duration-500">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl">🤖</div>
      </div>
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">Start ERA AI</h3>
      <div className="mt-4 flex flex-col items-center gap-2 text-center px-4">
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 animate-fade-in max-w-sm">{status}</span>
        <div className="w-48 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-blue-600 animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  );
};

// --- ICONS ---
const MoonIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeWidth={2}/></svg>);
const SunIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth={2}/></svg>);
const SparkleIcon = () => (<svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" /></svg>);

// --- TRANSLATIONS ---
const TRANSLATIONS: any = {
  tr: {
    nav_back: "Vazgeç", step_progress: "İlerleme Durumu", step: "Adım", back: "Geri", next: "Devam Et",
    start_magic: "Sihri Başlat", success_title: "İş Planın Hazır!",
    success_desc: "Yapay zeka, güncel piyasa verilerini ve konum analizini işledi.",
    download_pdf: "PDF Olarak İndir", new_plan: "Yeni Plan Oluştur",
    toast_success: "İş planı oluşturuldu ve panele kaydedildi!",
    toast_pdf_preparing: "Rapor derleniyor...", toast_pdf_success: "Rapor İndirildi!",
    err_empty: "Bu alan boş bırakılamaz.",
    status_gathering: "İnternet üzerinden gerçek zamanlı veriler taranıyor...",
    status_generating: "Rapor derleniyor, lütfen bekleyin...",
    questions: [
      { id: 1, key: "idea", title: "Hayalindeki Girişim Nedir?", subtitle: "Konum ve sektör belirtirsen (Örn: Şirinevler'de Kafe) nokta atışı kira analizi yapabilirim.", ph: "Örn: Kadıköy Moda'da 3. nesil kahveci açmak istiyorum..." },
      { id: 2, key: "capital", title: "Başlangıç Sermayesi", subtitle: "2025-2026 ekonomik verilerine göre bütçeni değerlendireceğim.", ph: "Örn: 1.500.000 TL" },
      { id: 3, key: "skills", title: "Süper Güçlerin", subtitle: "Hangi konularda iyisiniz?", ph: "Örn: İşletme yönetimi, pazarlama..." },
      { id: 4, key: "strategy", title: "Hedeflerin", subtitle: "1 yıl sonra neye ulaşmak istiyorsun?", ph: "Örn: Aylık 500bin TL ciro..." },
      { id: 5, key: "management", title: "Yönetim", subtitle: "Projeyi kim yönetecek?", ph: "Örn: Ben ve ortağım..." }
    ]
  },
  en: {
    nav_back: "Cancel", step_progress: "Progress", step: "Step", back: "Back", next: "Continue",
    start_magic: "Start Magic", success_title: "Plan Ready!",
    success_desc: "AI processed current market data and location analysis.",
    download_pdf: "Download PDF", new_plan: "Create New Plan",
    toast_success: "Plan created and saved to dashboard!",
    toast_pdf_preparing: "Compiling report...", toast_pdf_success: "Report Downloaded!",
    err_empty: "This field cannot be empty.",
    status_gathering: "Scanning real-time data from the internet...",
    status_generating: "Compiling the report, please wait...",
    questions: [
      { id: 1, key: "idea", title: "Startup Idea", subtitle: "Mention location & sector (e.g. Cafe in Manhattan) for precise rent analysis.", ph: "Ex: Coffee shop in Manhattan square..." },
      { id: 2, key: "capital", title: "Capital", subtitle: "I will evaluate budget based on 2025-2026 economic data.", ph: "Ex: $50,000" },
      { id: 3, key: "skills", title: "Skills", subtitle: "What are you good at?", ph: "Ex: Management, marketing..." },
      { id: 4, key: "strategy", title: "Goals", subtitle: "Where do you see yourself in 1 year?", ph: "Ex: $500k monthly revenue..." },
      { id: 5, key: "management", title: "Management", subtitle: "Who is leading?", ph: "Ex: Me and my brother..." }
    ]
  },
  ar: {
    nav_back: "إلغاء", step_progress: "التقدم", step: "خطوة", back: "عودة", next: "استمرار",
    start_magic: "ابدأ السحر", success_title: "الخطة جاهزة!",
    success_desc: "قام الذكاء الاصطناعي بمعالجة بيانات السوق الحالية وتحليل الموقع.",
    download_pdf: "تحميل PDF", new_plan: "خطة جديدة",
    toast_success: "تم إنشاء الخطة وحفظها!",
    toast_pdf_preparing: "جاري تجميع التقرير...", toast_pdf_success: "تم تحميل التقرير!",
    err_empty: "هذا الحقل مطلوب.",
    status_gathering: "جاري مسح البيانات في الوقت الفعلي من الإنترنت...",
    status_generating: "جاري تجميع التقرير، يرجى الانتظار...",
    questions: [
      { id: 1, key: "idea", title: "فكرة المشروع", subtitle: "اذكر الموقع والقطاع (مثلاً: مقهى في شيرين إيفلر) لتحليل دقيق.", ph: "مثال: مقهى في ميدان شيرين إيفلر..." },
      { id: 2, key: "capital", title: "رأس المال", subtitle: "سأقيم الميزانية بناءً على البيانات الاقتصادية لعام 2025-2026.", ph: "مثال: 1,500,000 ليرة" },
      { id: 3, key: "skills", title: "المهارات", subtitle: "بماذا تتميز؟", ph: "مثال: الإدارة، التسويق..." },
      { id: 4, key: "strategy", title: "الأهداف", subtitle: "أين ترى نفسك بعد عام؟", ph: "مثال: إيرادات شهرية 500 ألف..." },
      { id: 5, key: "management", title: "الإدارة", subtitle: "من يدير؟", ph: "مثال: أنا وأخي..." }
    ]
  }
};

function PlannerContent() {
  const { user, darkMode, toggleTheme } = useThemeAuth();
  const [lang, setLang] = useState<"tr" | "en" | "ar">("tr");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [planResult, setPlanResult] = useState<{ title: string; content: string }[] | null>(null);
  const [formData, setFormData] = useState<any>({ idea: "", capital: "", skills: "", strategy: "", management: "", language: "tr" });

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedLang = localStorage.getItem("app_lang") as "tr" | "en" | "ar";
        if (savedLang && ["tr", "en", "ar"].includes(savedLang)) { 
          setLang(savedLang); 
          setFormData((prev: any) => ({ ...prev, language: savedLang })); 
        }
    }
  }, []);

  const toggleLang = () => {
    let newLang: "tr" | "en" | "ar" = lang === "tr" ? "en" : lang === "en" ? "ar" : "tr";
    setLang(newLang); 
    setFormData((prev: any) => ({ ...prev, language: newLang })); 
    localStorage.setItem("app_lang", newLang);
  };

  const t = TRANSLATIONS[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const handleNext = () => {
    const currentKey = t.questions[step - 1].key;
    if (!formData[currentKey]?.trim()) {
      toast.error(t.err_empty);
      return;
    }
    if (step < 5) setStep(step + 1); 
    else generateSmartPlan();
  };

  // --- API CALL: GENERATE PLAN ---
  const generateSmartPlan = async () => {
    setLoading(true);
    setLoadingStatus(t.status_gathering);
    
    try {
      setLoadingStatus(t.status_generating);
      
      const res = await fetch(`${API_URL}/generate_plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("API Error");
      const data = await res.json();

      let finalPlan = [];
      try {
        finalPlan = JSON.parse(data.plan);
      } catch {
        finalPlan = [{ title: "İş Planı", content: data.plan }];
      }

      setPlanResult(finalPlan);

      // Save to LocalStorage for Dashboard
      if (typeof window !== 'undefined') {
          const newProject = {
              id: Date.now(),
              title: formData.idea.substring(0, 30) + (formData.idea.length > 30 ? "..." : ""),
              status: lang === 'tr' ? 'Tamamlandı' : 'Completed',
              date: new Date().toLocaleDateString(),
              planData: finalPlan 
          };
          const existing = JSON.parse(localStorage.getItem("user_projects") || "[]");
          localStorage.setItem("user_projects", JSON.stringify([newProject, ...existing]));
      }

      toast.success(t.toast_success);
    } catch (error) {
      console.error(error);
      toast.error("Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // --- API CALL: DOWNLOAD PDF ---
  const downloadPDF = async () => {
    if (!planResult) return;
    const tid = toast.loading(t.toast_pdf_preparing);
    
    try {
        const res = await fetch(`${API_URL}/create_pdf`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan_data: planResult }) // backend 'plan_data' bekliyor
        });

        if (!res.ok) throw new Error("PDF API Error");

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a"); 
        a.href = url; 
        a.download = `StartERA_Plan.pdf`; 
        document.body.appendChild(a); 
        a.click(); 
        a.remove();
        
        toast.dismiss(tid);
        toast.success(t.toast_pdf_success);
    } catch (err) {
        toast.dismiss(tid);
        toast.error("PDF hatası.");
    }
  };

  if (!user) return <div className="flex h-screen items-center justify-center opacity-50 font-bold">Lütfen giriş yapın...</div>;

  return (
    <div dir={dir} className={`min-h-screen transition-all duration-700 relative overflow-hidden ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      <Toaster position="top-center" />
      
      {/* Background Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className={`absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 ${darkMode ? 'bg-blue-900' : 'bg-blue-300'}`}></div>
          <div className={`absolute top-[40%] -right-[10%] w-[50%] h-[70%] rounded-full blur-[130px] opacity-20 ${darkMode ? 'bg-purple-900' : 'bg-indigo-300'}`}></div>
      </div>
      
      {/* Navbar */}
      <nav className={`px-8 py-5 flex justify-between items-center backdrop-blur-lg sticky top-0 z-40 border-b ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white/60 border-slate-200"}`}>
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">S</div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Start ERA</span>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={toggleLang} className="font-black text-lg px-2">{lang === "tr" ? "EN" : lang === "en" ? "AR" : "TR"}</button>
            <button onClick={toggleTheme} className={`p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-200 text-slate-600'}`}>{darkMode ? <SunIcon /> : <MoonIcon />}</button>
            <a href="/dashboard" className={`px-5 py-2.5 rounded-xl font-bold text-sm border no-underline transition-all ${darkMode ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-900 bg-white hover:bg-slate-50"}`}>{t.nav_back}</a>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-5xl mx-auto min-h-[calc(100vh-80px)]">
        {planResult ? (
            <div className={`w-full p-8 md:p-12 rounded-[32px] shadow-2xl backdrop-blur-2xl border ${darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-white"}`}>
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 text-white text-4xl mb-6 shadow-lg shadow-green-500/30">🎉</div>
                    <h2 className="text-4xl font-black mb-4 tracking-tight">{t.success_title}</h2>
                    <p className="text-lg opacity-80">{t.success_desc}</p>
                </div>
                
                <div className="grid gap-6 w-full mb-10">
                   {planResult.map((section, idx) => (
                      <div key={idx} className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white/60 border-slate-100"}`}>
                         <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400 border-b border-dashed border-slate-300 dark:border-slate-700 pb-2">{section.title}</h3>
                         <p className="leading-relaxed text-lg whitespace-pre-wrap opacity-90">{section.content}</p>
                      </div>
                   ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                    <button onClick={downloadPDF} className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl transition-all w-full sm:w-auto flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2}/></svg>{t.download_pdf}
                    </button>
                    <button onClick={() => { setPlanResult(null); setStep(1); setFormData({...formData, idea: ""}); }} className={`px-8 py-4 rounded-xl font-bold border transition-all w-full sm:w-auto ${darkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}>{t.new_plan}</button>
                </div>
            </div>
        ) : (
            <div className="relative w-full max-w-3xl">
                {loading && <ResearchLoading status={loadingStatus} />}
                
                <div className="flex justify-between mb-3 px-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{t.step_progress}</span>
                    <span className="text-xs font-bold opacity-70">{t.step} {step} / 5</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-10 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full transition-all duration-700" style={{ width: `${(step / 5) * 100}%` }}></div>
                </div>

                <div className={`p-8 md:p-12 rounded-[32px] shadow-2xl backdrop-blur-xl border ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-white/60"}`}>
                    <div className="mb-8" key={step}>
                        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{t.questions[step - 1].title}</h2>
                        <p className="text-lg opacity-80">{t.questions[step - 1].subtitle}</p>
                    </div>
                    <textarea rows={6} className={`w-full p-6 rounded-2xl border-none outline-none text-xl resize-none transition-all ${darkMode ? "bg-slate-950 text-white focus:bg-slate-900" : "bg-slate-100 text-slate-900 focus:bg-white"}`} placeholder={t.questions[step - 1].ph} value={formData[t.questions[step - 1].key]} onChange={(e) => setFormData({...formData, [t.questions[step - 1].key]: e.target.value})} autoFocus />
                    
                    <div className="flex justify-between items-center mt-12">
                        {step > 1 ? <button onClick={() => setStep(step - 1)} className="px-6 py-3 font-bold opacity-60 hover:opacity-100 transition-opacity">← {t.back}</button> : <div />}
                        <button onClick={handleNext} disabled={loading} className="px-10 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl transition-all flex items-center gap-2">
                            {step === 5 ? <><SparkleIcon />{t.start_magic}</> : <>{t.next} →</>}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeAuthProvider>
      <PlannerContent />
    </ThemeAuthProvider>
  );
}