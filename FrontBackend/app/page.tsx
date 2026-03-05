"use client";

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import toast, { Toaster } from "react-hot-toast";

/**
 * --- API URL GÜNCELLEMESİ ---
 * Vercel üzerinde projenin kendi API'sine gitmesi için sadece '/api' yeterlidir.
 * Localhost bağımlılığı tamamen kaldırıldı.
 */
const API_URL = "/api";

// --- MOCK / INTERNAL CONTEXT ---
const ThemeAuthContext = createContext<any>(null);

const ThemeAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem("userEmail");
      const theme = localStorage.getItem("theme");
      if (savedUser) setUser(savedUser);
      if (theme === "dark") setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", newMode ? "dark" : "light");
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
    }
  };

  const login = (token: string, email: string) => {
    setUser(email);
    if (typeof window !== 'undefined') {
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);
    }
  };

  return (
    <ThemeAuthContext.Provider value={{ user, darkMode, toggleTheme, logout, login }}>
      <div className={darkMode ? 'dark' : ''}>
        {children}
      </div>
    </ThemeAuthContext.Provider>
  );
};

const useThemeAuth = () => useContext(ThemeAuthContext);

// --- CHATBOT BİLEŞENİ ---
const Chatbot = ({ lang, darkMode }: { lang: "tr" | "en" | "ar", darkMode: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      // VERCEL ÇÖZÜMÜ: Dinamik API yolu kullanıldı.
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: currentInput,
          system_prompt: "You are a helpful Start ERA assistant. Reply in the user's language."
        }),
      });

      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("Chat Error:", err);
      const errorMsg = {
        tr: "⚠️ Bağlantı hatası.",
        en: "⚠️ Connection error.",
        ar: "⚠️ خطأ في الاتصال."
      };
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg[lang] }]);
    } finally {
      setIsTyping(false);
    }
  };

  const placeholders = { tr: "Mesaj yaz...", en: "Type a message...", ar: "اكتب رسالة..." };
  const welcomeMsg = { tr: "Merhaba! Yardımcı olabilir miyim?", en: "Hello! How can I help?", ar: "مرحباً! كيف يمكنني مساعدتك؟" };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className={`w-80 md:w-96 h-[500px] flex flex-col rounded-2xl shadow-2xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <div className="p-4 bg-blue-600 text-white rounded-t-2xl flex justify-between items-center">
            <span className="font-bold">Start ERA AI 🚀</span>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-75">✕</button>
          </div>
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 && (
              <p className="text-center text-sm opacity-50 mt-10">{welcomeMsg[lang]}</p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-blue-600 text-white" : (darkMode ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-900")}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-xs animate-pulse opacity-50 italic">Düşünüyor...</div>}
          </div>
          <div className="p-4 border-t dark:border-slate-700 flex gap-2">
            <input 
              className={`flex-1 p-2 rounded-lg outline-none text-sm ${darkMode ? 'bg-slate-900 text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-200'} border`}
              placeholder={placeholders[lang]}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">🚀</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition active:scale-95">💬</button>
      )}
    </div>
  );
};

// --- İKONLAR VE DİĞER BİLEŞENLER AYNI KALDI ---
const MoonIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>);
const SunIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);
const CheckIcon = () => (<svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>);

const TRANSLATIONS: any = {
  tr: {
    nav_about: "Hakkımızda", nav_features: "Özellikler", nav_pricing: "Fiyatlandırma", nav_contact: "İletişim", login: "Giriş Yap", dashboard: "Panelim", logout: "Çıkış",
    badge: "YAPAY ZEKA DESTEKLİ GİRİŞİMCİLİK",
    hero_title: "Fikrini Saniyeler İçinde İşe Dönüştür.",
    hero_desc: "Start ERA, girişimin için profesyonel iş planı, finansal analiz ve pazar araştırması hazırlar.",
    start_free: "Ücretsiz Başla →", how_it_works: "Nasıl Çalışır?",
    feat_title: "Neden Start ERA?",
    feat1_t: "Yapay Zeka Analizi", feat1_d: "Gelişmiş yapay zeka teknolojisi ile fikrini analiz eder.",
    feat2_t: "Çoklu Dil Desteği", feat2_d: "Raporlarını Türkçe, İngilizce ve Arapça olarak al.",
    feat3_t: "Profesyonel PDF", feat3_d: "Yatırımcı sunumlarında kullanabileceğin formatta hazır PDF raporu.",
    price_title: "Fiyatlandırma",
    p_free_t: "Başlangıç", p_free_p: "0₺", p_free_d: "Öğrenciler ve yeni başlayanlar için.",
    p_pro_t: "Profesyonel", p_pro_p: "Yakında", p_pro_d: "Ciddi girişimler ve şirketler için.",
    li_1: "Sınırsız İş Planı", li_2: "PDF İndirme", li_3: "Temel Pazar Analizi", li_4: "7/24 AI Asistan",
    pro_li1: "Rakip Analizi Modülü", pro_li2: "Yatırımcı Sunumu Taslağı", pro_li3: "Pazar Büyüklüğü Tahmini", pro_li4: "Özelleştirilebilir PDF Teması",
    about_title: "Hakkımızda", about_text: "Start ERA, girişimcilerin fikirlerini hayata geçirmelerine yardımcı olmak için tasarlanmış yeni nesil bir platformdur.",
    contact_title: "Bizimle İletişime Geçin 📬",
    form_name: "İsim Soyisim", form_email: "E-posta", form_msg: "Mesajınız", form_btn: "Mesajı Gönder 🚀",
    footer: "© 2026 Start ERA. Tüm hakları saklıdır.",
    coming_soon: "Yakında",
    popular: "POPÜLER"
  },
  en: {
    nav_about: "About Us", nav_features: "Features", nav_pricing: "Pricing", nav_contact: "Contact", login: "Login", dashboard: "Dashboard", logout: "Logout",
    badge: "AI POWERED ENTREPRENEURSHIP",
    hero_title: "Turn Your Idea Into Business in Seconds.",
    hero_desc: "Start ERA prepares professional business plans, financial analysis, and market research for your startup.",
    start_free: "Start for Free →", how_it_works: "How it Works?",
    feat_title: "Why Start ERA?",
    feat1_t: "AI Analysis", feat1_d: "Analyzes your idea using advanced AI technology.",
    feat2_t: "Multi-Language", feat2_d: "Get reports in Turkish, English and Arabic.",
    feat3_t: "Professional PDF", feat3_d: "Ready-to-use PDF reports for investors.",
    price_title: "Pricing",
    p_free_t: "Starter", p_free_p: "$0", p_free_d: "For students and beginners.",
    p_pro_t: "Professional", p_pro_p: "Soon", p_pro_d: "For serious startups.",
    li_1: "Unlimited Plans", li_2: "PDF Download", li_3: "Market Analysis", li_4: "24/7 AI Support",
    pro_li1: "Competitor Analysis Module", pro_li2: "Pitch Deck Drafts", pro_li3: "Market Size Estimation", pro_li4: "Custom PDF Themes",
    about_title: "About Us", about_text: "Start ERA is a next-generation platform for entrepreneurs designed to help bring ideas to life.",
    contact_title: "Get in Touch 📬",
    form_name: "Full Name", form_email: "Email", form_msg: "Message", form_btn: "Send 🚀",
    footer: "© 2026 Start ERA. All rights reserved.",
    coming_soon: "Soon",
    popular: "POPULAR"
  },
  ar: {
    nav_about: "من نحن", nav_features: "الميزات", nav_pricing: "الأسعار", nav_contact: "اتصل بنا", login: "دخول", dashboard: "لوحة التحكم", logout: "خروج",
    badge: "ريادة الأعمال المدعومة بالذكاء الاصطناعي",
    hero_title: "حول فكرتك إلى عمل تجاري في ثوانٍ.",
    hero_desc: "تقوم Start ERA بإعداد خطط عمل احترافية وتحليل مالي وأبحاث سوق لشركتك الناشئة.",
    start_free: "ابدأ مجانًا ←", how_it_works: "كيف يعمل؟",
    feat_title: "لماذا Start ERA؟",
    feat1_t: "تحليل الذكاء الاصطناعي", feat1_d: "يحلل فكرتك باستخدام تقنية الذكاء الاصطناعي المتقدمة.",
    feat2_t: "دعم متعدد اللغات", feat2_d: "احصل على تقارير باللغة التركية أو الإنجليزية و العربية.",
    feat3_t: "PDF احترافي", feat3_d: "تقارير PDF جاهزة للاستخدام لعروض المستثمرين.",
    price_title: "الأسعار",
    p_free_t: "البداية", p_free_p: "مجاناً", p_free_d: "للطلاب والمبتدئين.",
    p_pro_t: "محترف", p_pro_p: "قريباً", p_pro_d: "للشركات الناشئة الجادة.",
    li_1: "خطط عمل غير محدودة", li_2: "تنزيل PDF", li_3: "تحليل السوق", li_4: "دعم 24/7",
    pro_li1: "وحدة تحليل المنافسين", pro_li2: "مسودات عروض المستثمرين", pro_li3: "تقدير حجم السوق", pro_li4: "قوالب PDF مخصصة",
    about_title: "من نحن", about_text: "Start ERA هي منصة من الجيل التالي مصممة لمساعدة رواد الأعمال على تحقيق أفكارهم.",
    contact_title: "تواصل معنا 📬",
    form_name: "الاسم الكامل", form_email: "البريد الإلكتروني", form_msg: "رسالتك", form_btn: "إرسال 🚀",
    footer: "© 2026 Start ERA. جميع الحقوق محفوظة.",
    coming_soon: "قريباً",
    popular: "شائع"
  }
};

function LandingPageContent() {
  const { user, darkMode, toggleTheme, logout } = useThemeAuth();
  const [lang, setLang] = useState<"tr" | "en" | "ar">("tr");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem("app_lang") as "tr" | "en" | "ar";
      if (savedLang && ["tr", "en", "ar"].includes(savedLang)) {
        setLang(savedLang);
      }
    }
  }, []);

  const toggleLang = () => {
    let newLang: "tr" | "en" | "ar" = lang === "tr" ? "en" : lang === "en" ? "ar" : "tr";
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem("app_lang", newLang);
    }
  };

  const getLangLabel = () => { 
    if (lang === "tr") return "EN"; 
    if (lang === "en") return "AR"; 
    return "TR"; 
  };

  const showToast = (msg: string) => {
    toast.success(msg);
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const t = TRANSLATIONS[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Toaster position="top-center" />
      <Chatbot lang={lang} darkMode={darkMode} />

      <nav className={`fixed w-full z-50 backdrop-blur-md border-b ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-2xl font-black text-blue-600 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            Start <span className={darkMode ? 'text-white' : 'text-slate-900'}>ERA</span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
             <button onClick={() => scrollTo('about')} className="hover:text-blue-600 transition">{t.nav_about}</button>
             <button onClick={() => scrollTo('features')} className="hover:text-blue-600 transition">{t.nav_features}</button>
             <button onClick={() => scrollTo('pricing')} className="hover:text-blue-600 transition">{t.nav_pricing}</button>
             <button onClick={() => scrollTo('contact')} className="hover:text-blue-600 transition">{t.nav_contact}</button>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleLang} className="font-black text-lg hover:scale-110 transition active:scale-95 w-10 text-center" title="Change Language">{getLangLabel()}</button>
            
            <button onClick={toggleTheme} className={`p-2 rounded-full transition ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
                {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>

            {user ? (
                <div className="flex items-center gap-3">
                    <span className="hidden lg:block text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                        {user.split('@')[0]}
                    </span>
                    <a href="/dashboard" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-sm transition shadow-lg no-underline">
                        {t.dashboard}
                    </a>
                    <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition">{t.logout}</button>
                </div>
            ) : (
                <a href="/login" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition shadow-lg no-underline">
                    {t.login}
                </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs mb-6 uppercase tracking-widest">{t.badge}</div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">{t.hero_title}</h1>
        <p className={`text-xl mb-10 max-w-3xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.hero_desc}</p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a href={user ? "/dashboard" : "/login"} className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl shadow-xl transition transform hover:-translate-y-1 no-underline">{t.start_free}</a>
          <button onClick={() => scrollTo('features')} className={`px-10 py-4 border-2 font-bold rounded-xl transition ${darkMode ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-white'}`}>{t.how_it_works}</button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 px-6 border-t ${darkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-6">{t.about_title}</h2>
            <p className="text-lg leading-relaxed opacity-80">{t.about_text}</p>
          </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-16">{t.feat_title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`p-8 rounded-2xl border transition hover:shadow-xl ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="text-4xl mb-6">{i===1?'🧠':(i===2?'🌍':'📄')}</div>
                <h3 className="text-xl font-bold mb-3">{t[`feat${i}_t` as keyof typeof t]}</h3>
                <p className="opacity-60">{t[`feat${i}_d` as keyof typeof t]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-blue-600/5">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-16">{t.price_title}</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
             <div className={`p-8 rounded-3xl border-2 flex flex-col relative ${darkMode ? 'bg-slate-900 border-blue-600' : 'bg-white border-blue-600 shadow-xl'}`}>
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase">{t.popular}</div>
                <h3 className="text-2xl font-bold mb-2">{t.p_free_t}</h3>
                <div className="text-4xl font-black text-blue-600 mb-6">{t.p_free_p}</div>
                <ul className="space-y-4 mb-8 flex-1">
                   {[1,2,3,4].map(i => <li key={i} className="flex items-center gap-2"><CheckIcon /><span>{t[`li_${i}` as keyof typeof t]}</span></li>)}
                </ul>
                <a href={user ? "/dashboard" : "/login"} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center transition no-underline">{t.start_free}</a>
             </div>

             <div className={`p-8 rounded-3xl border border-dashed relative overflow-hidden transition-all ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                <div className="absolute top-4 right-4 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse uppercase">{t.coming_soon}</div>
                <h3 className="text-2xl font-bold mb-2 opacity-60">{t.p_pro_t}</h3>
                <div className="text-4xl font-black text-slate-400 mb-6">{t.p_pro_p}</div>
                <p className="mb-6 text-sm opacity-50 italic">{t.p_pro_d}</p>
                <ul className="space-y-4 mb-8 flex-1 opacity-70">
                   <li><div className="flex items-center gap-2 text-sm font-medium"><CheckIcon /> <span>{t.pro_li1}</span></div></li>
                   <li><div className="flex items-center gap-2 text-sm font-medium"><CheckIcon /> <span>{t.pro_li2}</span></div></li>
                   <li><div className="flex items-center gap-2 text-sm font-medium"><CheckIcon /> <span>{t.pro_li3}</span></div></li>
                   <li><div className="flex items-center gap-2 text-sm font-medium"><CheckIcon /> <span>{t.pro_li4}</span></div></li>
                </ul>
                <button disabled className="w-full py-4 font-bold rounded-xl border border-slate-300 cursor-not-allowed opacity-40">{t.coming_soon}</button>
             </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto p-10 rounded-3xl border bg-white dark:bg-slate-800">
           <h2 className="text-3xl font-black mb-8 text-center">{t.contact_title}</h2>
           <form className="grid md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); showToast(lang === "tr" ? "Mesajınız alındı!" : lang === "ar" ? "تم استلام رسالتك!" : "Message received!"); }}>
              <input placeholder={t.form_name} className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" required />
              <input type="email" placeholder={t.form_email} className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" required />
              <textarea placeholder={t.form_msg} className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 md:col-span-2" rows={4} required />
              <button
                type="submit"
                className="md:col-span-2 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition"
              >
                {t.form_btn}
              </button>
           </form>
        </div>
      </section>

      <footer className="py-10 text-center border-t opacity-50 border-slate-200 dark:border-slate-800">
        <div className="mb-4 font-bold text-xl">Start ERA</div>
        <p className="text-sm">{t.footer}</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeAuthProvider>
      <LandingPageContent />
    </ThemeAuthProvider>
  );
}