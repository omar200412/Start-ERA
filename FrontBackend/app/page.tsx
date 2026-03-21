"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useThemeAuth } from "./context/ThemeAuthContext";
import { TRANSLATIONS } from "./lib/translations";
import Chatbot from "./Chatbot";

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

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg className="w-4 h-4 inline-block ml-0.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const STATS = [
  { number: "10K+", label: "Business Plans Created" },
  { number: "98%", label: "User Satisfaction" },
  { number: "3", label: "Languages Supported" },
  { number: "60s", label: "Average Plan Generation" },
];

const TESTIMONIALS = [
  {
    quote: "Start ERA turned my idea into a full investor-ready business plan in under a minute. I was amazed by the depth of the market analysis.",
    name: "Ahmet Yılmaz",
    title: "Founder, TechStart Istanbul",
    initial: "A",
  },
  {
    quote: "The AI understood exactly what I needed. The financial projections were spot on and saved me weeks of research.",
    name: "Sara Al-Rashid",
    title: "CEO, GreenGrow Arabia",
    initial: "S",
  },
  {
    quote: "Multi-language support is a game changer. I got my entire business plan in Arabic and shared it with investors the same day.",
    name: "Omar Mansour",
    title: "Co-founder, NileVentures",
    initial: "O",
  },
];

const FAQS = [
  {
    q: "What is Start ERA?",
    a: "Start ERA is an AI-powered entrepreneurship platform. It prepares professional business plans, financial analysis, and market research for your startup in seconds — in Turkish, English, and Arabic.",
  },
  {
    q: "How long does it take to generate a business plan?",
    a: "Most business plans are generated in under 60 seconds. Our AI processes your idea, capital, skills, goals, and management structure to produce a comprehensive, investor-ready document.",
  },
  {
    q: "Is Start ERA free to use?",
    a: "Yes. Our Starter plan is completely free and includes unlimited business plans, PDF downloads, basic market analysis, and 24/7 AI assistant support. A Professional plan with advanced features is coming soon.",
  },
  {
    q: "What languages are supported?",
    a: "Start ERA fully supports Turkish, English, and Arabic — including the business plan content, the interface, and the PDF export.",
  },
  {
    q: "Can I download my business plan as a PDF?",
    a: "Absolutely. Every plan you generate can be exported as a professional PDF, formatted for investor presentations and pitch meetings.",
  },
];

export default function LandingPage() {
  const { user, darkMode, toggleTheme, logout, lang, setLang } = useThemeAuth();
  const t = TRANSLATIONS[lang];
  const isRTL = lang === "ar";
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  }

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success(t.contact_toast);
  }

  const isDark = darkMode;
  const bg = isDark ? "bg-gray-950" : "bg-white";
  const text = isDark ? "text-gray-100" : "text-gray-900";
  const subtext = isDark ? "text-gray-400" : "text-gray-600";
  const border = isDark ? "border-gray-800" : "border-gray-200";
  const navBg = isDark ? "bg-gray-950/95 border-gray-800" : "bg-white/95 border-gray-200";
  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const sectionBg = isDark ? "bg-gray-900" : "bg-gray-50";
  const inputBg = isDark ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600";
  const faqBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const statBg = isDark ? "bg-gray-900" : "bg-blue-700";

  const freeItems = [t.li_1, t.li_2, t.li_3, t.li_4];
  const proItems = [t.pro_li1, t.pro_li2, t.pro_li3, t.pro_li4];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={"min-h-screen font-sans transition-colors duration-300 " + bg + " " + text}>
      <Chatbot />

      {/* TOP BAR */}
      <div className={"hidden md:flex items-center justify-end px-8 py-1.5 text-xs font-medium border-b " + (isDark ? "bg-gray-900 border-gray-800 text-gray-400" : "bg-gray-50 border-gray-200 text-gray-500")}>
        <div className="flex items-center gap-6 max-w-7xl w-full justify-end mx-auto">
          <button onClick={toggleLang} className="hover:text-blue-600 transition">{getLangLabel()} — Change Language</button>
          <button onClick={toggleTheme} className="hover:text-blue-600 transition flex items-center gap-1">
            {isDark ? <SunIcon /> : <MoonIcon />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className={"sticky top-0 z-50 border-b backdrop-blur-md " + navBg}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">S</div>
              <span className="text-xl font-black tracking-tight">
                Start <span className="text-blue-600">ERA</span>
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              <button onClick={() => scrollTo("features")} className={"px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-100 " + (isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")}>
                {t.nav_features} <ChevronDown />
              </button>
              <button onClick={() => scrollTo("pricing")} className={"px-4 py-2 rounded-lg text-sm font-medium transition " + (isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")}>
                {t.nav_pricing}
              </button>
              <button onClick={() => scrollTo("about")} className={"px-4 py-2 rounded-lg text-sm font-medium transition " + (isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")}>
                {t.nav_about}
              </button>
              <button onClick={() => scrollTo("contact")} className={"px-4 py-2 rounded-lg text-sm font-medium transition " + (isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")}>
                {t.nav_contact}
              </button>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <span className={"hidden lg:block text-sm font-semibold " + subtext}>{user.split("@")[0]}</span>
                  <a href="/dashboard" className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition no-underline">
                    {t.dashboard}
                  </a>
                  <button onClick={logout} className={"text-sm font-medium transition " + subtext + " hover:text-red-500"}>
                    {t.logout}
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className={"hidden md:block px-4 py-2 text-sm font-medium transition rounded-lg " + (isDark ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-700")}>
                    {t.login}
                  </a>
                  <a href="/login" className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition shadow-sm no-underline">
                    {t.start_free}
                  </a>
                </>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={"md:hidden p-2 rounded-lg transition " + (isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")}
              >
                <div className="w-5 h-0.5 bg-current mb-1" />
                <div className="w-5 h-0.5 bg-current mb-1" />
                <div className="w-5 h-0.5 bg-current" />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className={"md:hidden py-4 border-t space-y-1 " + border}>
              <button onClick={() => scrollTo("features")} className={"w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition " + (isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")}>{t.nav_features}</button>
              <button onClick={() => scrollTo("pricing")} className={"w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition " + (isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")}>{t.nav_pricing}</button>
              <button onClick={() => scrollTo("about")} className={"w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition " + (isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")}>{t.nav_about}</button>
              <button onClick={() => scrollTo("contact")} className={"w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition " + (isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")}>{t.nav_contact}</button>
              <div className="flex items-center gap-2 px-4 pt-2">
                <button onClick={toggleLang} className="text-sm font-bold text-blue-600">{getLangLabel()}</button>
                <button onClick={toggleTheme} className={"p-1.5 rounded-lg " + (isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")}>
                  {isDark ? <SunIcon /> : <MoonIcon />}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className={"py-20 md:py-28 px-6 " + (isDark ? "bg-gray-950" : "bg-white")}>
        <div className="max-w-4xl mx-auto text-center">
          <div className={"inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border " + (isDark ? "border-blue-800 bg-blue-950 text-blue-400" : "border-blue-200 bg-blue-50 text-blue-700")}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {t.badge}
          </div>
          <h1 className={"text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.05] tracking-tight " + text}>
            {t.hero_title}
          </h1>
          <p className={"text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed " + subtext}>
            {t.hero_desc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={user ? "/dashboard" : "/login"}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-base transition shadow-lg hover:shadow-xl no-underline"
            >
              {t.start_free}
            </a>
            <button
              onClick={() => scrollTo("features")}
              className={"px-8 py-3.5 font-bold rounded-full text-base transition border-2 " + (isDark ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-900 text-gray-900 hover:bg-gray-50")}
            >
              {t.how_it_works}
            </button>
          </div>
          <p className={"mt-5 text-sm " + subtext}>
            {lang === "tr" ? "Kredi kartı gerekmez. Ücretsiz başla." : lang === "ar" ? "لا حاجة لبطاقة ائتمان. ابدأ مجاناً." : "No credit card required. Start for free."}
          </p>
        </div>
      </section>

      {/* STATS BAND */}
      <section className={"py-14 px-6 " + (isDark ? "bg-blue-900" : "bg-blue-600")}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-black text-white mb-1">{stat.number}</div>
                <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={"py-20 px-6 " + sectionBg}>
        <div className="max-w-7xl mx-auto">
          <p className={"text-sm font-bold uppercase tracking-widest text-center mb-12 " + subtext}>
            {lang === "tr" ? "Girişimciler Ne Diyor?" : lang === "ar" ? "ماذا يقول رواد الأعمال؟" : "What Entrepreneurs Are Saying"}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item, i) => (
              <div key={i} className={"p-7 rounded-2xl border " + cardBg}>
                <div className="flex mb-4">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className={"text-sm leading-relaxed mb-6 " + subtext}>"{item.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {item.initial}
                  </div>
                  <div>
                    <div className={"text-sm font-bold " + text}>{item.name}</div>
                    <div className={"text-xs " + subtext}>{item.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className={"py-20 px-6 " + (isDark ? "bg-gray-950" : "bg-white")}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className={"text-3xl md:text-4xl font-black mb-4 " + text}>{t.feat_title}</h2>
            <p className={"text-lg max-w-xl mx-auto " + subtext}>
              {lang === "tr" ? "Yapay zeka ile saniyeler içinde profesyonel iş planı oluştur." : lang === "ar" ? "أنشئ خطة عمل احترافية في ثوانٍ باستخدام الذكاء الاصطناعي." : "Create a professional business plan in seconds with AI."}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🧠", title: t.feat1_t, desc: t.feat1_d, detail: lang === "tr" ? "Gemini 2.5 Flash ile desteklenen analizimiz, fikrinizi saniyeler içinde işler." : lang === "ar" ? "تحليلنا المدعوم بـ Gemini 2.5 Flash يعالج فكرتك في ثوانٍ." : "Our analysis powered by Gemini 2.5 Flash processes your idea in seconds." },
              { icon: "🌍", title: t.feat2_t, desc: t.feat2_d, detail: lang === "tr" ? "Türkçe, İngilizce ve Arapça tam destek ile küresel piyasalara ulaş." : lang === "ar" ? "تواصل مع الأسواق العالمية بدعم كامل للعربية والإنجليزية والتركية." : "Reach global markets with full support for Arabic, English, and Turkish." },
              { icon: "📄", title: t.feat3_t, desc: t.feat3_d, detail: lang === "tr" ? "Yatırımcı sunumları için hazır, profesyonel formatlı PDF raporları." : lang === "ar" ? "تقارير PDF احترافية جاهزة لعروض المستثمرين." : "Professional formatted PDF reports ready for investor presentations." },
            ].map((item, i) => (
              <div key={i} className={"p-8 rounded-2xl border hover:shadow-lg transition-shadow " + cardBg}>
                <div className="text-3xl mb-5">{item.icon}</div>
                <h3 className={"text-lg font-bold mb-2 " + text}>{item.title}</h3>
                <p className={"text-sm font-semibold mb-3 text-blue-500"}>{item.desc}</p>
                <p className={"text-sm leading-relaxed " + subtext}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={"py-20 px-6 " + sectionBg}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className={"text-3xl md:text-4xl font-black mb-4 " + text}>
            {lang === "tr" ? "3 Adımda İş Planı" : lang === "ar" ? "خطة عمل في 3 خطوات" : "Business Plan in 3 Steps"}
          </h2>
          <p className={"text-lg mb-14 " + subtext}>
            {lang === "tr" ? "Kayıt ol, fikrini anlat, planını indir." : lang === "ar" ? "سجّل، أخبرنا بفكرتك، نزّل خطتك." : "Sign up, describe your idea, download your plan."}
          </p>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              { step: "01", title: lang === "tr" ? "Kayıt Ol" : lang === "ar" ? "سجّل" : "Sign Up", desc: lang === "tr" ? "Ücretsiz hesap oluştur, e-posta ile doğrula." : lang === "ar" ? "أنشئ حساباً مجانياً وتحقق منه عبر البريد الإلكتروني." : "Create a free account and verify with email." },
              { step: "02", title: lang === "tr" ? "Fikrni Anlat" : lang === "ar" ? "أخبرنا بفكرتك" : "Describe Your Idea", desc: lang === "tr" ? "5 kısa soruyu yanıtla: fikrin, sermaye, beceriler, hedefler, yönetim." : lang === "ar" ? "أجب على 5 أسئلة قصيرة: الفكرة، رأس المال، المهارات، الأهداف، الإدارة." : "Answer 5 short questions: idea, capital, skills, goals, management." },
              { step: "03", title: lang === "tr" ? "Planını Al" : lang === "ar" ? "احصل على خطتك" : "Get Your Plan", desc: lang === "tr" ? "Yapay zeka kapsamlı planı hazırlar. PDF olarak indir." : lang === "ar" ? "يقوم الذكاء الاصطناعي بإعداد الخطة الشاملة. نزّلها بصيغة PDF." : "AI prepares your comprehensive plan. Download as PDF." },
            ].map((item, i) => (
              <div key={i} className={"p-8 rounded-2xl border text-left " + cardBg}>
                <div className="text-5xl font-black text-blue-600/20 mb-4">{item.step}</div>
                <h3 className={"text-lg font-bold mb-2 " + text}>{item.title}</h3>
                <p className={"text-sm leading-relaxed " + subtext}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className={"py-20 px-6 " + (isDark ? "bg-gray-950" : "bg-white")}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className={"text-xs font-bold uppercase tracking-widest text-blue-600 mb-4"}>{t.nav_about}</div>
              <h2 className={"text-3xl md:text-4xl font-black mb-6 leading-tight " + text}>{t.about_title}</h2>
              <p className={"text-lg leading-relaxed mb-6 " + subtext}>{t.about_text}</p>
              <p className={"text-base leading-relaxed " + subtext}>
                {lang === "tr" ? "Yapay zeka, veri analizi ve kullanıcı odaklı tasarımı bir araya getirerek girişimcilerin hayallerini gerçeğe dönüştürmelerine yardımcı oluyoruz." : lang === "ar" ? "نجمع بين الذكاء الاصطناعي وتحليل البيانات والتصميم المتمحور حول المستخدم لمساعدة رواد الأعمال على تحويل أحلامهم إلى واقع." : "We combine AI, data analysis, and user-centered design to help entrepreneurs turn their dreams into reality."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "10K+", label: lang === "tr" ? "Aktif Kullanıcı" : lang === "ar" ? "مستخدم نشط" : "Active Users" },
                { num: "60s", label: lang === "tr" ? "Ortalama Süre" : lang === "ar" ? "متوسط الوقت" : "Avg Generation" },
                { num: "3", label: lang === "tr" ? "Dil Desteği" : lang === "ar" ? "لغات مدعومة" : "Languages" },
                { num: "100%", label: lang === "tr" ? "Ücretsiz Başlangıç" : lang === "ar" ? "بداية مجانية" : "Free to Start" },
              ].map((s, i) => (
                <div key={i} className={"p-6 rounded-2xl border text-center " + cardBg}>
                  <div className="text-3xl font-black text-blue-600 mb-1">{s.num}</div>
                  <div className={"text-xs font-medium " + subtext}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className={"py-20 px-6 " + sectionBg}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className={"text-3xl md:text-4xl font-black mb-4 " + text}>{t.price_title}</h2>
            <p className={"text-lg " + subtext}>
              {lang === "tr" ? "Büyüyen her girişim için esnek planlar." : lang === "ar" ? "خطط مرنة لكل شركة ناشئة في نمو." : "Flexible plans for every growing startup."}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

            {/* Free */}
            <div className={"p-8 rounded-2xl border-2 border-blue-600 relative " + (isDark ? "bg-gray-900" : "bg-white")}>
              <div className="absolute -top-3 left-6 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">{t.popular}</div>
              <div className={"text-xs font-bold uppercase tracking-widest text-blue-600 mb-2"}>{t.p_free_t}</div>
              <div className={"text-5xl font-black mb-1 " + text}>{t.p_free_p}</div>
              <div className={"text-sm mb-6 " + subtext}>{t.p_free_d}</div>
              <ul className="space-y-3 mb-8">
                {freeItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckIcon />
                    <span className={"text-sm " + text}>{item}</span>
                  </li>
                ))}
              </ul>
              <a href={user ? "/dashboard" : "/login"} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-center transition no-underline block text-sm">
                {t.start_free}
              </a>
            </div>

            {/* Pro */}
            <div className={"p-8 rounded-2xl border " + cardBg + " relative opacity-80"}>
              <div className={"absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full animate-pulse " + (isDark ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-700")}>{t.coming_soon}</div>
              <div className={"text-xs font-bold uppercase tracking-widest text-purple-500 mb-2"}>{t.p_pro_t}</div>
              <div className={"text-5xl font-black mb-1 " + subtext}>{t.p_pro_p}</div>
              <div className={"text-sm mb-6 " + subtext}>{t.p_pro_d}</div>
              <ul className="space-y-3 mb-8">
                {proItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={"text-sm " + subtext}>{item}</span>
                  </li>
                ))}
              </ul>
              <button disabled className={"w-full py-3.5 font-bold rounded-full text-sm border cursor-not-allowed " + (isDark ? "border-gray-700 text-gray-600" : "border-gray-300 text-gray-400")}>
                {t.coming_soon}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={"py-20 px-6 " + (isDark ? "bg-gray-950" : "bg-white")}>
        <div className="max-w-3xl mx-auto">
          <h2 className={"text-3xl md:text-4xl font-black mb-12 text-center " + text}>
            {lang === "tr" ? "Sık Sorulan Sorular" : lang === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className={"rounded-xl border overflow-hidden " + faqBg}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={"w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-sm transition " + (isDark ? "hover:bg-gray-800 text-gray-200" : "hover:bg-gray-50 text-gray-900")}
                >
                  <span>{faq.q}</span>
                  <svg className={"w-5 h-5 flex-shrink-0 transition-transform " + (openFaq === i ? "rotate-180" : "") + " " + subtext} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className={"px-6 pb-5 text-sm leading-relaxed border-t " + border + " " + subtext + " pt-4"}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className={"py-20 px-6 " + sectionBg}>
        <div className="max-w-2xl mx-auto">
          <h2 className={"text-3xl md:text-4xl font-black mb-3 text-center " + text}>{t.contact_title}</h2>
          <p className={"text-center mb-10 " + subtext}>
            {lang === "tr" ? "Sorularınız için bize yazın." : lang === "ar" ? "اكتب لنا لأي أسئلة." : "Write to us for any questions."}
          </p>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder={t.form_name}
                required
                className={"w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 transition " + inputBg}
              />
              <input
                type="email"
                placeholder={t.form_email}
                required
                className={"w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 transition " + inputBg}
              />
            </div>
            <textarea
              placeholder={t.form_msg}
              required
              rows={5}
              className={"w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 transition resize-none " + inputBg}
            />
            <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition text-sm">
              {t.form_btn}
            </button>
          </form>
        </div>
      </section>

      {/* CTA BAND */}
      <section className={"py-20 px-6 " + (isDark ? "bg-blue-900" : "bg-blue-600")}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {lang === "tr" ? "Bugün başla. Ücretsiz." : lang === "ar" ? "ابدأ اليوم. مجاناً." : "Get started today. For free."}
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            {lang === "tr" ? "Kredi kartı gerekmez. 30 saniyede hesap aç." : lang === "ar" ? "لا حاجة لبطاقة ائتمان. افتح حساباً في 30 ثانية." : "No credit card required. Open an account in 30 seconds."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={user ? "/dashboard" : "/login"} className="px-8 py-3.5 bg-white text-blue-700 font-bold rounded-full text-base transition hover:bg-blue-50 no-underline shadow-lg">
              {t.start_free}
            </a>
            <button onClick={() => scrollTo("features")} className="px-8 py-3.5 border-2 border-white text-white font-bold rounded-full text-base transition hover:bg-white/10">
              {t.how_it_works}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={"border-t py-12 px-6 " + (isDark ? "bg-gray-950 border-gray-800" : "bg-gray-50 border-gray-200")}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
                <span className={"font-black " + text}>Start ERA</span>
              </div>
              <p className={"text-sm leading-relaxed " + subtext}>{t.about_text}</p>
            </div>
            <div>
              <h4 className={"text-sm font-bold mb-3 " + text}>{lang === "tr" ? "Ürün" : lang === "ar" ? "المنتج" : "Product"}</h4>
              <ul className={"space-y-2 text-sm " + subtext}>
                <li><button onClick={() => scrollTo("features")} className="hover:text-blue-600 transition">{t.nav_features}</button></li>
                <li><button onClick={() => scrollTo("pricing")} className="hover:text-blue-600 transition">{t.nav_pricing}</button></li>
                <li><a href={user ? "/dashboard" : "/login"} className="hover:text-blue-600 transition no-underline">{t.dashboard}</a></li>
              </ul>
            </div>
            <div>
              <h4 className={"text-sm font-bold mb-3 " + text}>{lang === "tr" ? "Şirket" : lang === "ar" ? "الشركة" : "Company"}</h4>
              <ul className={"space-y-2 text-sm " + subtext}>
                <li><button onClick={() => scrollTo("about")} className="hover:text-blue-600 transition">{t.nav_about}</button></li>
                <li><button onClick={() => scrollTo("contact")} className="hover:text-blue-600 transition">{t.nav_contact}</button></li>
              </ul>
            </div>
            <div>
              <h4 className={"text-sm font-bold mb-3 " + text}>{lang === "tr" ? "Dil" : lang === "ar" ? "اللغة" : "Language"}</h4>
              <div className="flex flex-wrap gap-2">
                {(["tr", "en", "ar"] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={"px-3 py-1 rounded-full text-xs font-bold border transition " + (lang === l ? "bg-blue-600 text-white border-blue-600" : (isDark ? "border-gray-700 text-gray-400 hover:border-blue-500" : "border-gray-300 text-gray-600 hover:border-blue-600"))}
                  >
                    {l === "tr" ? "Türkçe" : l === "en" ? "English" : "العربية"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={"flex flex-col md:flex-row items-center justify-between pt-8 border-t text-sm " + border + " " + subtext}>
            <span>{t.footer}</span>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <button onClick={toggleTheme} className="hover:text-blue-600 transition flex items-center gap-1.5">
                {isDark ? <SunIcon /> : <MoonIcon />}
                {isDark ? (lang === "tr" ? "Aydınlık" : lang === "ar" ? "فاتح" : "Light") : (lang === "tr" ? "Karanlık" : lang === "ar" ? "داكن" : "Dark")}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}