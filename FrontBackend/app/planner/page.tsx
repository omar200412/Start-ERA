'use client';

import React, { useState, useEffect, useRef, createContext, useContext } from "react";

// ==========================================
// YEREL TOAST SİSTEMİ
// ==========================================
const toastEvents = {
  listeners: [] as ((t: any) => void)[],
  emit(toast: any) { this.listeners.forEach(l => l(toast)); },
  subscribe(l: (t: any) => void) { this.listeners.push(l); return () => { this.listeners = this.listeners.filter(x => x !== l); }; }
};

const toast = (msg: string, opts?: any) => toastEvents.emit({ id: Date.now(), msg, type: 'default', icon: opts?.icon });
toast.success = (msg: string) => toastEvents.emit({ id: Date.now(), msg, type: 'success', icon: '✅' });
toast.error = (msg: string) => toastEvents.emit({ id: Date.now(), msg, type: 'error', icon: '❌' });
toast.loading = (msg: string) => { const id = Date.now(); toastEvents.emit({ id, msg, type: 'loading', icon: '⏳' }); return id; };
toast.dismiss = (id: number) => toastEvents.emit({ id, type: 'dismiss' });

const Toaster = () => {
  const [toasts, setToasts] = useState<any[]>([]);
  useEffect(() => {
    return toastEvents.subscribe((event) => {
      if (event.type === 'dismiss') {
        setToasts(prev => prev.filter(t => t.id !== event.id));
      } else {
        setToasts(prev => [...prev, event]);
        if (event.type !== 'loading') {
          setTimeout(() => setToasts(prev => prev.filter(t => t.id !== event.id)), 3000);
        }
      }
    });
  }, []);
  
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-5 fade-in duration-300">
          <span className="text-xl">{t.icon}</span>
          <span className="text-sm font-bold">{t.msg}</span>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// MOCK ROUTER & LINK
// ==========================================
const useRouter = () => {
  return {
    push: (path: string) => {
      if (typeof window !== 'undefined') {
         const isPreview = window.location.hostname.includes('googleusercontent') || window.location.protocol === 'blob:';
         if (isPreview) {
             if (path === "/login") toast("Giriş yapmanız gerekiyor (Demo)", { icon: '🔒' });
             else if (path === "/dashboard") toast("Dashboard'a yönlendiriliyor... (Demo)", { icon: '🏠' });
         } else {
             window.location.href = path;
         }
      }
    }
  };
};

const Link = ({ href, children, className, ...props }: any) => {
  return (
    <a 
      href={href} 
      className={className} 
      onClick={(e) => {
        const isPreview = typeof window !== 'undefined' && (window.location.hostname.includes('googleusercontent') || window.location.protocol === 'blob:');
        if (isPreview) {
            e.preventDefault();
            if (href === "/dashboard") toast("Dashboard'a dönülüyor... (Demo)", { icon: '🏠' });
        }
      }}
      {...props}
    >
      {children}
    </a>
  );
};

// --- MOCK CONTEXT ---
const ThemeAuthContext = createContext<any>(null);
const ThemeAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState({ email: "girisimci@startera.com" });
  
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
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>{children}</div>
    </ThemeAuthContext.Provider>
  );
};
const useThemeAuth = () => useContext(ThemeAuthContext);

// --- CHATBOT BİLEŞENİ ---
const Chatbot = ({ lang, darkMode }: { lang: string, darkMode: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      let reply = "Bu konuda detaylı bir analiz yapmam için biraz daha bilgi verebilir misin?";
      const lowerInput = currentInput.toLowerCase();

      if (lowerInput.includes("kira") || lowerInput.includes("fiyat")) {
        reply = "Kira fiyatları semtten semte çok değişiyor. İstanbul'da popüler bir caddede m2 fiyatı 1.000 TL'yi aşabilirken, ara sokaklarda 400-500 TL bandında olabilir.";
      } else if (lowerInput.includes("maaş") || lowerInput.includes("personel")) {
        reply = "2025 yılı itibarıyla nitelikli personel için asgari ücretin en az %30 üzerinde bir teklif sunmanız, çalışan sadakati açısından kritiktir.";
      } else if (lowerInput.includes("vergi") || lowerInput.includes("stopaj")) {
        reply = "Kira stopajı (%20) ve KDV gibi giderleri nakit akışı tablonuza mutlaka ekleyin. Birçok girişimci bu görünmez giderler yüzünden nakit sıkışıklığı yaşıyor.";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Bağlantı hatası." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className={`w-80 md:w-96 h-[500px] flex flex-col rounded-2xl shadow-2xl border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <div className="p-4 bg-blue-600 text-white rounded-t-2xl flex justify-between items-center">
            <span className="font-bold">Start ERA AI 🚀</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 && <p className="text-center text-sm opacity-50 mt-10">İş fikrinizle ilgili aklınıza takılanları sorun!</p>}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${msg.role === "user" ? "bg-blue-600 text-white" : (darkMode ? "bg-slate-700" : "bg-slate-100")}`}>{msg.content}</div>
              </div>
            ))}
            {isTyping && <div className="text-xs animate-pulse opacity-50">Yazıyor...</div>}
          </div>
          <div className="p-4 border-t dark:border-slate-700 flex gap-2">
            <input className={`flex-1 p-2 rounded-lg outline-none text-sm border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="Bir soru sor..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} />
            <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">🚀</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition animate-bounce-slow">💬</button>
      )}
    </div>
  );
};

// --- YARDIMCI BİLEŞENLER ---
const TypewriterEffect = ({ text, speed = 5 }: { text: string, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayedText(""); 
    const timer = setInterval(() => {
      if (i < text.length) { setDisplayedText((prev) => prev + text.charAt(i)); i++; } 
      else clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <div className="whitespace-pre-wrap leading-relaxed">{displayedText}</div>;
};

const ResearchLoading = ({ status }: { status: string }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-3xl transition-all duration-500">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl">🤖</div>
      </div>
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">Start ERA AI</h3>
      <div className="mt-4 flex flex-col items-center gap-2">
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 animate-fade-in">{status}</span>
        <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 animate-progress"></div>
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
const TRANSLATIONS = {
  tr: {
    nav_back: "Vazgeç", step_progress: "İlerleme Durumu", step: "Adım", back: "Geri", next: "Devam Et",
    start_magic: "Sihri Başlat", success_title: "İş Planın Hazır!",
    success_desc: "Yapay zeka, güncel piyasa verilerini ve konum analizini işledi.",
    download_pdf: "PDF Olarak İndir", new_plan: "Yeni Plan Oluştur",
    toast_success: "İş planı oluşturuldu ve panele kaydedildi!",
    toast_pdf_preparing: "Rapor derleniyor...", toast_pdf_success: "Rapor İndirildi!",
    err_empty: "Bu alan boş bırakılamaz.",
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
    questions: [
      { id: 1, key: "idea", title: "Startup Idea", subtitle: "Mention location & sector (e.g. Cafe in Şirinevler) for precise rent analysis.", ph: "Ex: Coffee shop in Şirinevler square..." },
      { id: 2, key: "capital", title: "Capital", subtitle: "I will evaluate budget based on 2025-2026 economic data.", ph: "Ex: 1,500,000 TL" },
      { id: 3, key: "skills", title: "Skills", subtitle: "What are you good at?", ph: "Ex: Management, marketing..." },
      { id: 4, key: "strategy", title: "Goals", subtitle: "Where do you see yourself in 1 year?", ph: "Ex: 500k monthly revenue..." },
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
  const [formData, setFormData] = useState({ idea: "", capital: "", skills: "", strategy: "", management: "", language: "tr" });
  
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedLang = localStorage.getItem("app_lang") as "tr" | "en" | "ar";
        if (savedLang && ["tr", "en", "ar"].includes(savedLang)) { setLang(savedLang); setFormData(prev => ({ ...prev, language: savedLang })); }
    }
  }, []);

  const toggleLang = () => {
    let newLang: "tr" | "en" | "ar" = lang === "tr" ? "en" : lang === "en" ? "ar" : "tr";
    setLang(newLang); setFormData(prev => ({ ...prev, language: newLang })); localStorage.setItem("app_lang", newLang);
  };

  const getLangLabel = () => (lang === "tr" ? "EN" : lang === "en" ? "AR" : "TR");
  const t = TRANSLATIONS[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const validateInput = (key: string, value: string) => {
    if (!value.trim()) return t.err_empty;
    return null;
  };

  const handleNext = () => {
    const currentKey = t.questions[step - 1].key as keyof typeof formData;
    const err = validateInput(currentKey, formData[currentKey]);
    if (err) { toast.error(err); return; }
    if (step < 5) setStep(step + 1); else generateSmartPlan();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleNext();
    }
  };

  const normalizeInput = (text: string) => {
    return text.toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c");
  };

  const generateSmartPlan = async () => {
    setLoading(true);
    
    setLoadingStatus(lang === 'tr' ? "İş fikri ve detaylı konum analiz ediliyor..." : "Analyzing business idea & detailed location...");
    await new Promise(r => setTimeout(r, 1500));

    const ideaNormalized = normalizeInput(formData.idea);
    let sector = "Genel Hizmet";
    let location = "İstanbul Geneli";
    
    if (ideaNormalized.includes("sirinevler")) location = "Şirinevler (Bahçelievler)";
    else if (ideaNormalized.includes("bahcelievler")) location = "Bahçelievler";
    else if (ideaNormalized.includes("kadikoy") || ideaNormalized.includes("moda")) location = "Kadıköy (Moda/Caferağa)";
    else if (ideaNormalized.includes("besiktas")) location = "Beşiktaş";
    else if (ideaNormalized.includes("sisli") || ideaNormalized.includes("mecidiyekoy")) location = "Şişli/Mecidiyeköy";

    if (ideaNormalized.includes("kahve") || ideaNormalized.includes("cafe") || ideaNormalized.includes("kafe") || ideaNormalized.includes("restoran")) sector = "Yeme-İçme (Kafe/Restoran)";
    else if (ideaNormalized.includes("yazilim") || ideaNormalized.includes("app") || ideaNormalized.includes("teknoloji")) sector = "Teknoloji/Yazılım";
    else if (ideaNormalized.includes("market") || ideaNormalized.includes("bakkal")) sector = "Perakende";

    setLoadingStatus(lang === 'tr' ? `"${location}" bölgesi için 2025/2026 kira ve maaş verileri taranıyor...` : `Scanning current rent & salary data for "${location}"...`);
    await new Promise(r => setTimeout(r, 2000));

    let rentAdvice = "";
    let staffAdvice = "";
    const minWage = 28000; 
    const staffCostMultiplier = 1.65; 

    if (location.includes("Şirinevler")) {
        rentAdvice = "Şirinevler Meydan ve E-5 kenarı yaya trafiği açısından İstanbul'un en yoğun noktalarındandır. 50-80 m2 bir dükkan için ana cadde kiraları 70.000 TL - 140.000 TL arasında değişmektedir.";
    } else if (location.includes("Kadıköy")) {
        rentAdvice = "Kadıköy (Moda/Caferağa) bölgesi, genç nüfusun ve beyaz yakalıların uğrak noktasıdır. 50m2 dükkan için kira ortalaması 85.000 TL - 150.000 TL arasındadır.";
    } else {
        rentAdvice = `${location} bölgesinde ortalama ticari kira metrekare fiyatı 700-1.100 TL bandındadır.`;
    }

    if (sector.includes("Kafe") || sector.includes("Perakende")) {
        staffAdvice = `Güncel piyasa koşullarında (Baz Asgari Ücret: ${minWage.toLocaleString()} TL):\n• Deneyimli Barista/Tezgahtar: 32.000 TL - 38.000 TL Net\n• Servis Personeli: ${minWage.toLocaleString()} TL - 30.000 TL + Tip\nBir personelin işverene toplam maliyeti yaklaşık ${(minWage * staffCostMultiplier).toLocaleString()} TL'dir.`;
    } else {
        staffAdvice = `Sektörünüzde nitelikli personel için asgari ücretin (${minWage.toLocaleString()} TL) en az %30-40 üzerinde bir başlangıç maaşı teklif etmelisiniz.`;
    }

    setLoadingStatus(lang === 'tr' ? "Yönetici özeti ve strateji raporu hazırlanıyor..." : "Preparing executive summary & strategy report...");
    await new Promise(r => setTimeout(r, 1500));

    const generatedPlan = [
        {
            title: lang === 'tr' ? "1. YÖNETİCİ ÖZETİ (EXECUTIVE SUMMARY)" : "1. EXECUTIVE SUMMARY",
            content: lang === 'tr' 
                ? `Bu iş planı, "${formData.idea}" fikrinin ${location} lokasyonunda hayata geçirilmesi için hazırlanmıştır. Sektör olarak ${sector} alanında faaliyet gösterilecek olup, "${formData.management}" liderliğindeki yönetim kadrosu ve "${formData.skills}" yetkinlikleri ile pazardaki boşluğun doldurulması hedeflenmektedir.`
                : `This plan outlines the launch of "${formData.idea}" in ${location}. Targeting the ${sector} sector.`
        },
        {
            title: lang === 'tr' ? "2. İŞ MODELİ VE STRATEJİ (BUSINESS MODEL & STRATEGY)" : "2. BUSINESS MODEL & STRATEGY",
            content: lang === 'tr'
                ? `İş modelimiz, müşteri memnuniyeti odaklı sürdürülebilir büyüme üzerine kuruludur.\n\nKonum Analizi ve Kira Stratejisi:\n${rentAdvice}\n\nİnsan Kaynakları Stratejisi:\n${staffAdvice}`
                : `Our model focuses on sustainable growth.\n\nLocation & Rent Analysis:\n${rentAdvice}\n\nHR Strategy:\n${staffAdvice}`
        },
        {
            title: lang === 'tr' ? "3. FİNANSAL PLAN VE YATIRIM (FINANCIAL PLAN & INVESTMENT)" : "3. FINANCIAL PLAN & INVESTMENT",
            content: lang === 'tr'
                ? `Başlangıç Sermayesi: ${formData.capital}\n\nYatırım Dağılımı (Tahmini):\n- Kira, Depozito ve Emlak Komisyonu: %15-20\n- Dekorasyon ve Tadilat: %30\n- Ekipman ve Teknoloji: %25\n- İlk 3 Aylık Personel Maaşları ve İşletme Giderleri: %20\n- Pazarlama ve Lansman: %10\n\nFinansal Öngörü: 8-12 ay içinde başabaş noktasına ulaşılması öngörülmektedir.`
                : `Capital: ${formData.capital}\n\nAllocation:\n- Rent/Deposit: 20%\n- Renovation: 30%\n- Equipment: 25%\n- OpEx (3 months): 20%\n- Marketing: 5%`
        },
        {
            title: lang === 'tr' ? "4. HEDEF VE VİZYON (GOAL & VISION)" : "4. GOAL & VISION",
            content: lang === 'tr'
                ? `Kısa Vadeli Hedef (1 Yıl): "${formData.strategy}" hedefine ulaşmak ve bölgede marka bilinirliğini %40 seviyesine çıkarmak.\n\nUzun Vadeli Vizyon: 3 yıl içinde franchise verilebilir bir yapıya kavuşturmak.`
                : `Short Term Goal (1 Year): Achieve "${formData.strategy}".\n\nLong Term Vision: Prepare for franchising within 3 years.`
        }
    ];

    setPlanResult(generatedPlan);

    // ===================================================================
    // DİKKAT: ARTIK planContent BİLGİSİNİ DE VERİTABANINA KAYDEDİYORUZ
    // ===================================================================
    if (typeof window !== 'undefined') {
        const newProject = {
            id: Date.now(),
            title: formData.idea.length > 25 ? formData.idea.substring(0, 25) + "..." : formData.idea,
            status: lang === 'en' ? 'Completed' : lang === 'ar' ? 'مكتمل' : 'Tamamlandı',
            date: lang === 'en' ? 'Just now' : lang === 'ar' ? 'الآن' : 'Az önce',
            color: 'text-green-500',
            planContent: generatedPlan // <- BU KISIM EKLENDİ!
        };
        const existingProjects = JSON.parse(localStorage.getItem("user_projects") || "[]");
        localStorage.setItem("user_projects", JSON.stringify([...existingProjects, newProject]));
    }

    toast.success(t.toast_success);
    setLoading(false);
  };

  const downloadPDF = async () => {
    if (!planResult) return;
    const tid = toast.loading(t.toast_pdf_preparing);
    
    setTimeout(() => {
        toast.dismiss(tid);
        const textContent = planResult.map(p => `${p.title}\n\n${p.content}\n\n`).join('-------------------\n\n');
        const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a"); 
        a.href = url; 
        a.download = `StartERA_Plan_${Date.now()}.txt`; 
        document.body.appendChild(a); 
        a.click(); 
        a.remove();
        toast.success(t.toast_pdf_success);
    }, 1500);
  };

  if (!user) return <div className="flex h-screen items-center justify-center text-slate-500">Lütfen giriş yapın.</div>;

  return (
    <div dir={dir} className={`min-h-screen transition-all duration-700 relative overflow-hidden font-sans ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
         <div className={`absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 animate-pulse ${darkMode ? 'bg-blue-900' : 'bg-blue-300'}`}></div>
         <div className={`absolute top-[40%] -right-[10%] w-[50%] h-[70%] rounded-full blur-[130px] opacity-20 animate-pulse delay-1000 ${darkMode ? 'bg-purple-900' : 'bg-indigo-300'}`}></div>
      </div>
      
      <Toaster />
      <Chatbot lang={lang} darkMode={darkMode} />
      
      <nav className={`px-8 py-5 flex justify-between items-center backdrop-blur-lg sticky top-0 z-40 border-b transition-colors ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white/60 border-slate-200"}`}>
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">S</div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Start ERA</span>
        </div>
        <div className="flex items-center gap-4">
             <div className="hidden md:block text-sm font-medium opacity-70 mr-2">{user.email}</div>
             <button onClick={toggleLang} className="font-black text-lg hover:scale-110 transition active:scale-95" title="Change Language">{getLangLabel()}</button>
             <button onClick={toggleTheme} className={`p-2.5 rounded-xl transition-all active:scale-95 ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-600 shadow-sm hover:shadow-md border border-slate-100'}`}>{darkMode ? <SunIcon /> : <MoonIcon />}</button>
             <Link href="/dashboard" className={`px-5 py-2.5 rounded-xl font-bold text-sm border transition-all hover:shadow-lg no-underline active:scale-95 flex items-center ${darkMode ? "border-slate-700 hover:bg-slate-800 text-slate-200" : "border-slate-200 hover:bg-white text-slate-900 bg-white/50"}`}>{t.nav_back}</Link>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-5xl mx-auto min-h-[calc(100vh-80px)]">
        {planResult ? (
            <div className={`relative w-full p-[1px] rounded-[32px] bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 shadow-2xl animate-in fade-in zoom-in-95 duration-700`}>
                <div className={`w-full p-8 md:p-12 rounded-[31px] backdrop-blur-2xl ${darkMode ? "bg-slate-900/90" : "bg-white/90"}`}>
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 text-white text-4xl mb-6 shadow-lg shadow-green-500/30 animate-bounce">🎉</div>
                        <h2 className={`text-4xl md:text-5xl font-black mb-4 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t.success_title}</h2>
                        <p className={`text-lg font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.success_desc}</p>
                    </div>
                    
                    <div className="grid gap-6 w-full mb-10">
                       {planResult.map((section, idx) => (
                          <div key={idx} className={`p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md animate-in slide-in-from-bottom-4 fade-in duration-500 delay-${idx * 100} ${darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white/60 border-slate-100"}`}>
                             <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400 border-b border-dashed border-slate-300 dark:border-slate-700 pb-2">{section.title}</h3>
                             <p className={`leading-relaxed text-lg whitespace-pre-wrap ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{section.content}</p>
                          </div>
                       ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <button onClick={downloadPDF} className="group relative px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 w-full sm:w-auto overflow-hidden">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            <span className="flex items-center justify-center gap-2 relative z-10"><svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>{t.download_pdf}</span>
                        </button>
                        <button onClick={() => { setPlanResult(null); setStep(1); setFormData({...formData, idea: ""}); }} className={`px-8 py-4 rounded-xl font-bold border transition-all w-full sm:w-auto hover:scale-105 active:scale-95 ${darkMode ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}>{t.new_plan}</button>
                    </div>
                </div>
            </div>
        ) : (
            <div className={`relative w-full max-w-3xl transition-all duration-500`}>
                {loading && <ResearchLoading status={loadingStatus} />}
                
                <div className="flex justify-between mb-3 px-2">
                   <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{t.step_progress}</span>
                   <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>{t.step} {step} / 5</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-10 dark:bg-slate-800 overflow-hidden"><div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.6)]" style={{ width: `${(step / 5) * 100}%` }}></div></div>
                <div className={`relative p-8 md:p-12 rounded-[32px] shadow-2xl backdrop-blur-xl border transition-all duration-500 ${darkMode ? "bg-slate-900/80 border-slate-800 shadow-black/50" : "bg-white/80 border-white/60 shadow-blue-900/5"}`}>
                    <div className="mb-8 animate-in slide-in-from-bottom-2 fade-in duration-500" key={step}>
                        <h2 className={`text-3xl md:text-5xl font-black mb-4 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t.questions[step - 1].title}</h2>
                        <p className={`text-lg md:text-xl font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{t.questions[step - 1].subtitle}</p>
                    </div>
                    <div className="relative group">
                        <div className={`absolute -inset-0.5 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500 bg-gradient-to-r from-blue-600 to-purple-600`}></div>
                        <textarea rows={6} className={`relative w-full p-6 rounded-2xl border-none outline-none text-xl resize-none shadow-inner transition-all ${darkMode ? "bg-slate-950 text-white placeholder:text-slate-500 focus:bg-slate-900" : "bg-slate-100 text-slate-900 placeholder:text-slate-600 focus:bg-white"}`} placeholder={t.questions[step - 1].ph} value={formData[t.questions[step - 1].key as keyof typeof formData]} onChange={(e) => setFormData({...formData, [t.questions[step - 1].key]: e.target.value})} onKeyDown={handleKeyDown} autoFocus />
                    </div>
                    <div className="flex justify-between items-center mt-12">
                        {step > 1 ? <button onClick={() => setStep(step - 1)} className={`px-6 py-3 font-bold rounded-xl transition-colors ${darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-black hover:bg-slate-200'}`}>{lang === "ar" ? "→" : "←"} {t.back}</button> : <div></div>}
                        <button onClick={handleNext} disabled={loading} className={`group relative px-10 py-4 rounded-xl font-bold text-white shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden ${loading ? 'bg-slate-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}>
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            <span className="flex items-center gap-2 relative z-10">{step === 5 ? <><SparkleIcon />{t.start_magic}</> : <>{t.next} <span className={`group-hover:translate-x-1 transition-transform inline-block ${lang === "ar" ? "rotate-180" : ""}`}>→</span></>}</span>
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