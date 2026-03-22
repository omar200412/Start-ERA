"use client";
import React, { useState, useRef } from "react";
import { useThemeAuth } from "./context/ThemeAuthContext";
import { TRANSLATIONS } from "./lib/translations";
import Chatbot from "./Chatbot";

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

const MOCKUP_STARTUPS = [
  { name: "Justi.items", color: "bg-blue-600", tag: "E-commerce" },
  { name: "CoMoon.ai", color: "bg-purple-600", tag: "AI Tools" },
  { name: "Musicify", color: "bg-green-600", tag: "Music Tech" },
];

export default function LandingPage() {
  const { user, darkMode, toggleTheme, logout, lang, setLang } = useThemeAuth();
  const t = TRANSLATIONS[lang];
  const isRTL = lang === "ar";
  const [idea, setIdea] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ideaRef = useRef<HTMLTextAreaElement>(null);
  const maxChars = 400;

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

  function handleGenerate() {
    if (!user) { window.location.href = "/login"; return; }
    if (idea.trim()) {
      sessionStorage.setItem("planner_form", JSON.stringify({ idea, capital: "", skills: "", strategy: "", management: "", language: lang }));
    }
    window.location.href = "/planner";
  }

  function scrollToIdea() {
    ideaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    ideaRef.current?.focus();
  }

  const freeItems = [t.li_1, t.li_2, t.li_3, t.li_4];
  const proItems = [t.pro_li1, t.pro_li2, t.pro_li3, t.pro_li4];

  const heroSubtitle = lang === "tr"
    ? "60 saniyenin altında önizleme al. Ardından girişimini inşa et ve başlat."
    : lang === "ar"
    ? "احصل على معاينة في أقل من 60 ثانية. ثم ابنِ شركتك الناشئة وأطلقها."
    : "Get a preview in under 60 seconds. Then build & launch your startup.";

  const placeholderText = lang === "tr"
    ? "Harika fikrinizi buraya girin..."
    : lang === "ar"
    ? "أدخل فكرتك الرائعة هنا..."
    : "Enter awesome idea here...";

  const charsLeft = lang === "tr"
    ? `${maxChars - idea.length} karakter kaldı`
    : lang === "ar"
    ? `${maxChars - idea.length} حرف متبقٍ`
    : `${maxChars - idea.length} characters left`;

  const generateLabel = lang === "tr" ? "Önizleme Oluştur" : lang === "ar" ? "إنشاء معاينة" : "Generate Preview";
  const browseLabel = lang === "tr" ? "Fikirlere Göz At" : lang === "ar" ? "استعرض الأفكار" : "Browse Ideas";
  const builtOnLabel = lang === "tr" ? "START ERA İLE OLUŞTURULDU" : lang === "ar" ? "مبني على START ERA" : "BUILT ON START ERA";
  const communityTitle = lang === "tr"
    ? "Start ERA topluluğuna katıl; bağlantılar gelişir ve fikirler yeşerir."
    : lang === "ar"
    ? "انضم إلى مجتمع Start ERA حيث تزدهر العلاقات وتنمو الأفكار."
    : "Join our vibrant community at Start ERA, where connections thrive and ideas flourish.";
  const communitySubtitle = lang === "tr"
    ? "Diğer girişimcilerle ağ kur, deneyimlerini paylaş ve büyüme fırsatlarını birlikte keşfet."
    : lang === "ar"
    ? "تواصل مع رواد أعمال آخرين، شارك تجاربك، واستكشف فرص النمو معاً."
    : "Network with fellow innovators, share experiences, and explore growth opportunities together.";

  const howLabel = lang === "tr" ? "NASIL ÇALIŞIR" : lang === "ar" ? "كيف يعمل" : "HOW IT WORKS";
  const shareIdeaLabel = lang === "tr" ? "Fikrinizi Paylaşın" : lang === "ar" ? "شارك فكرتك" : "Share your idea";

  const steps = [
    {
      num: "1.",
      title: lang === "tr" ? "Fikrinizi Girin" : lang === "ar" ? "أدخل فكرتك" : "Enter your idea",
      desc: lang === "tr" ? "Startup AI modelleri, özel istemler ve tasarım kullanarak fikrinizi dakikalar içinde kodlamadan oluşturun." : lang === "ar" ? "ابنِ فكرتك في دقائق باستخدام نماذج الذكاء الاصطناعي والتصميم المخصص." : "Build your idea in minutes using AI models, custom prompts, rules and design.",
    },
    {
      num: "2.",
      title: lang === "tr" ? "Anında Önizleme Alın" : lang === "ar" ? "احصل على معاينة فورية" : "Get instant preview",
      desc: lang === "tr" ? "AI analizinizi saniyeler içinde görün — iş planı, pazar analizi, finansal projeksiyon." : lang === "ar" ? "شاهد تحليل الذكاء الاصطناعي في ثوانٍ — خطة عمل، تحليل سوق، توقعات مالية." : "See your AI analysis in seconds — business plan, market analysis, financial projections.",
    },
    {
      num: "3.",
      title: lang === "tr" ? "İndir ve Uygula" : lang === "ar" ? "نزّل ونفّذ" : "Download + launch",
      desc: lang === "tr" ? "Profesyonel PDF raporu indir ve girişimini hayata geçir." : lang === "ar" ? "نزّل تقرير PDF احترافياً وأطلق مشروعك." : "Download your professional PDF report and launch your startup.",
    },
  ];

  const trendingLabel = lang === "tr" ? "TREND FİKİRLER" : lang === "ar" ? "أفكار رائجة" : "TRENDING IDEAS FEED";
  const trendingTitle = lang === "tr"
    ? "Trend Fikirler Akışına göz atın, girişimcilik ruhunu yakalayın."
    : lang === "ar"
    ? "اطّلع على خلاصة الأفكار الرائجة واستلهم روح ريادة الأعمال."
    : "Check out our Trending Ideas Feed, a vibrant mix of entrepreneurial spirit.";

  const TRENDING = [
    { idea: lang === "tr" ? "Mahallenizdeki kedi bakıcısını bulmanıza yardımcı olan bir uygulama" : lang === "ar" ? "تطبيق يساعدك في إيجاد مربي قطط في منطقتك" : "An app that helps you find a cat sitter in your area", score: 7.8, tag: "Pet Tech" },
    { idea: lang === "tr" ? "Küçük işletmeler için yapay zeka destekli muhasebe asistanı" : lang === "ar" ? "مساعد محاسبة مدعوم بالذكاء الاصطناعي للشركات الصغيرة" : "AI-powered accounting assistant for small businesses", score: 8.2, tag: "FinTech" },
    { idea: lang === "tr" ? "Öğrencileri akıl hocalarıyla buluşturan platform" : lang === "ar" ? "منصة تربط الطلاب بالمرشدين" : "Platform connecting students with mentors", score: 7.5, tag: "EdTech" },
    { idea: lang === "tr" ? "Restoran artıkları için yemek paylaşım ağı" : lang === "ar" ? "شبكة مشاركة طعام لفائض المطاعم" : "Food sharing network for restaurant surplus", score: 8.0, tag: "FoodTech" },
    { idea: lang === "tr" ? "Sağlık verilerini takip eden akıllı giyilebilir" : lang === "ar" ? "جهاز ذكي قابل للارتداء لتتبع بيانات الصحة" : "Smart wearable that tracks health data", score: 7.9, tag: "HealthTech" },
    { idea: lang === "tr" ? "Uzak ekipler için sanal ofis platformu" : lang === "ar" ? "منصة مكتب افتراضي للفرق عن بُعد" : "Virtual office platform for remote teams", score: 8.4, tag: "SaaS" },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen font-sans">
      <Chatbot />

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-sm">S</div>
            <span className="text-lg font-black text-gray-900">Start ERA</span>
          </div>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-gray-900 transition">{t.nav_pricing}</button>
            <button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-gray-900 transition">{t.nav_about}</button>
            <button onClick={() => document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-gray-900 transition">{browseLabel}</button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button onClick={toggleLang} className="text-sm font-bold text-gray-500 hover:text-gray-800 transition">{getLangLabel()}</button>
            <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition">
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            {user ? (
              <>
                <a href="/dashboard" className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-full transition no-underline">{t.dashboard}</a>
                <button onClick={logout} className="text-sm text-gray-400 hover:text-red-500 transition">{t.logout}</button>
              </>
            ) : (
              <a href="/login" className="px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white font-bold rounded-full text-sm transition no-underline shadow-sm">{lang === "tr" ? "Başla" : lang === "ar" ? "ابدأ" : "Get started"}</a>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition">
              <div className="w-4 h-0.5 bg-gray-700 mb-1" />
              <div className="w-4 h-0.5 bg-gray-700 mb-1" />
              <div className="w-4 h-0.5 bg-gray-700" />
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-4 border-t border-gray-100 pt-3 space-y-2 bg-white">
            <button onClick={() => { document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }} className="block w-full text-left text-sm text-gray-600 py-2">{t.nav_pricing}</button>
            <button onClick={() => { document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }} className="block w-full text-left text-sm text-gray-600 py-2">{t.nav_about}</button>
          </div>
        )}
      </nav>

      {/* ── HERO (green gradient) ── */}
      <section className="relative overflow-hidden" style={{ background: "radial-gradient(ellipse at 60% 0%, #bbf7d0 0%, #d1fae5 30%, #f0fdf4 60%, #ffffff 100%)" }}>
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-gray-200 text-xs font-semibold text-gray-600 mb-8 shadow-sm">
            <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            {lang === "tr" ? "Yapay zeka destekli girişim oluşturucu" : lang === "ar" ? "منشئ الشركات الناشئة بالذكاء الاصطناعي" : "AI-powered startup builder"}
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            {lang === "tr"
              ? <>Fikrinizi yazın.<br />Girişiminizin<br />hayata geçtiğini görün.</>
              : lang === "ar"
              ? <>اكتب فكرتك.<br />شاهد شركتك الناشئة<br />تنبض بالحياة.</>
              : <>Type your idea. See your<br />startup come to life.</>
            }
          </h1>

          <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">{heroSubtitle}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button
              onClick={scrollToIdea}
              className="flex items-center gap-2 px-7 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-sm transition shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              {generateLabel}
            </button>
            <button
              onClick={() => document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-full text-sm transition border border-gray-200 shadow-sm"
            >
              {browseLabel}
            </button>
          </div>

          {/* Idea input box */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
              <textarea
                ref={ideaRef}
                value={idea}
                onChange={e => setIdea(e.target.value.slice(0, maxChars))}
                placeholder={placeholderText}
                rows={4}
                className="w-full resize-none outline-none text-gray-800 text-base placeholder-gray-400 leading-relaxed"
                onKeyDown={e => { if (e.key === "Enter" && e.metaKey) handleGenerate(); }}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-400">{charsLeft}</span>
                <button
                  onClick={handleGenerate}
                  className="w-10 h-10 bg-gray-200 hover:bg-green-600 text-gray-500 hover:text-white rounded-full flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DARK SECTION: Community ── */}
      <section className="bg-gray-950 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-16">[01] {builtOnLabel}</p>
          <div className="grid md:grid-cols-2 gap-16 items-start mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                <span className="text-white">{communityTitle.split(".")[0]}.</span>
                {communityTitle.includes(".") && <span className="text-gray-500"> {communityTitle.split(".").slice(1).join(".").trim()}</span>}
              </h2>
            </div>
            <div>
              <p className="text-gray-400 text-lg leading-relaxed">{communitySubtitle}</p>
            </div>
          </div>

          {/* Mockup startup cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {MOCKUP_STARTUPS.map((s, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900">
                <div className={s.color + " h-32 flex items-center justify-center"}>
                  <span className="text-white font-black text-2xl">{s.name}</span>
                </div>
                <div className="p-4">
                  <div className="inline-block px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 text-xs font-medium">{s.tag}</div>
                  <p className="text-gray-500 text-xs mt-2">{lang === "tr" ? "Start ERA ile oluşturuldu" : lang === "ar" ? "مبني بـ Start ERA" : "Built with Start ERA"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-16">[02] {howLabel}</p>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-0">
              {steps.map((s, i) => (
                <div key={i} className={i === 0 ? "border-b border-gray-200 pb-8 mb-8 bg-green-50 rounded-xl p-6" : "border-b border-gray-200 pb-8 mb-8 p-6"}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={i === 0 ? "w-8 h-8 rounded-full bg-green-600 flex items-center justify-center" : "w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"}>
                      <svg className={"w-4 h-4 " + (i === 0 ? "text-white" : "text-gray-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {i === 0 ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /> : i === 1 ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900">{s.num} {s.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed ml-11">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Right: idea input card (green bg) */}
            <div className="rounded-3xl p-8" style={{ background: "radial-gradient(ellipse at top, #4ade80 0%, #16a34a 100%)" }}>
              <h3 className="text-3xl font-black text-white mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{shareIdeaLabel}</h3>
              <div className="bg-white rounded-2xl p-5 shadow-lg">
                <textarea
                  value={idea}
                  onChange={e => setIdea(e.target.value.slice(0, maxChars))}
                  placeholder={lang === "tr" ? "Fikrinizi buraya yazın..." : lang === "ar" ? "اكتب فكرتك هنا..." : "a website that helps you find a cat sitter in your area"}
                  rows={5}
                  className="w-full resize-none outline-none text-gray-800 text-sm placeholder-gray-400 leading-relaxed"
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400">{charsLeft}</span>
                  <button
                    onClick={handleGenerate}
                    className="w-9 h-9 bg-gray-900 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRENDING IDEAS FEED ── */}
      <section id="trending" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">[03] {trendingLabel}</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-16 max-w-3xl leading-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            {trendingTitle}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TRENDING.map((item, i) => (
              <div
                key={i}
                onClick={() => { setIdea(item.idea); scrollToIdea(); }}
                className="bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer hover:border-green-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">{item.tag}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-yellow-600 text-[10px] font-black">{item.score}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed font-medium mb-4">{item.idea}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-green-600 transition font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  {lang === "tr" ? "Bu fikirle devam et" : lang === "ar" ? "المتابعة بهذه الفكرة" : "Continue with this idea"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">[04] {lang === "tr" ? "FİYATLANDIRMA" : lang === "ar" ? "الأسعار" : "PRICING"}</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-16" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            {t.price_title}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
            {/* Free */}
            <div className="rounded-2xl border-2 border-green-500 p-8 relative bg-white">
              <div className="absolute -top-3 left-6 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">{t.popular}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">{t.p_free_t}</div>
              <div className="text-5xl font-black text-gray-900 mb-1">{t.p_free_p}</div>
              <div className="text-sm text-gray-500 mb-6">{t.p_free_d}</div>
              <ul className="space-y-3 mb-8">
                {freeItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckIcon />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <a href={user ? "/dashboard" : "/login"} className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-center transition text-sm no-underline block">{t.start_free}</a>
            </div>
            {/* Pro */}
            <div className="rounded-2xl border border-gray-200 p-8 relative bg-gray-50 opacity-75">
              <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse">{t.coming_soon}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-2">{t.p_pro_t}</div>
              <div className="text-5xl font-black text-gray-400 mb-1">{t.p_pro_p}</div>
              <div className="text-sm text-gray-400 mb-6">{t.p_pro_d}</div>
              <ul className="space-y-3 mb-8">
                {proItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-sm text-gray-500">{item}</span>
                  </li>
                ))}
              </ul>
              <button disabled className="w-full py-3.5 font-bold rounded-full text-sm border border-gray-300 text-gray-400 cursor-not-allowed">{t.coming_soon}</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-8">[05] {lang === "tr" ? "HAKKIMIZDA" : lang === "ar" ? "من نحن" : "ABOUT"}</p>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                {t.about_title}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">{t.about_text}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "10K+", label: lang === "tr" ? "Oluşturulan Plan" : lang === "ar" ? "خطة مُنشأة" : "Plans Created" },
                { num: "60s", label: lang === "tr" ? "Ortalama Süre" : lang === "ar" ? "متوسط الوقت" : "Avg Time" },
                { num: "3", label: lang === "tr" ? "Dil" : lang === "ar" ? "لغات" : "Languages" },
                { num: "100%", label: lang === "tr" ? "Ücretsiz" : lang === "ar" ? "مجاني" : "Free to Start" },
              ].map((s, i) => (
                <div key={i} className="p-6 rounded-2xl bg-gray-900 border border-gray-800 text-center">
                  <div className="text-3xl font-black text-green-400 mb-1">{s.num}</div>
                  <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">[06] {lang === "tr" ? "İLETİŞİM" : lang === "ar" ? "التواصل" : "CONTACT"}</p>
          <h2 className="text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.contact_title}</h2>
          <p className="text-gray-500 mb-10">{lang === "tr" ? "Sorularınız için bize yazın." : lang === "ar" ? "اكتب لنا لأي أسئلة." : "Write to us for any questions."}</p>
          <form onSubmit={e => { e.preventDefault(); }} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input placeholder={t.form_name} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition" />
              <input type="email" placeholder={t.form_email} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition" />
            </div>
            <textarea placeholder={t.form_msg} required rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition resize-none" />
            <button type="submit" className="w-full py-3.5 bg-gray-900 hover:bg-gray-700 text-white font-bold rounded-full text-sm transition">{t.form_btn}</button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 border-t border-gray-900 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-xs">S</div>
                <span className="text-white font-black">Start ERA</span>
              </div>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">{t.about_text}</p>
            </div>
            <div className="flex gap-12">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{lang === "tr" ? "Ürün" : lang === "ar" ? "المنتج" : "Product"}</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition">{t.nav_pricing}</button></li>
                  <li><a href={user ? "/dashboard" : "/login"} className="hover:text-white transition no-underline">{t.dashboard}</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{lang === "tr" ? "Dil" : lang === "ar" ? "اللغة" : "Language"}</h4>
                <div className="flex flex-col gap-2">
                  {(["tr", "en", "ar"] as const).map(l => (
                    <button key={l} onClick={() => setLang(l)} className={"text-sm text-left transition " + (lang === l ? "text-green-400 font-bold" : "text-gray-500 hover:text-white")}>
                      {l === "tr" ? "Türkçe" : l === "en" ? "English" : "العربية"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-900 text-xs text-gray-600">
            <span>{t.footer}</span>
            <button onClick={toggleTheme} className="flex items-center gap-1.5 hover:text-gray-400 transition mt-4 md:mt-0">
              {darkMode ? <SunIcon /> : <MoonIcon />}
              {darkMode ? (lang === "tr" ? "Aydınlık" : lang === "ar" ? "فاتح" : "Light mode") : (lang === "tr" ? "Karanlık" : lang === "ar" ? "داكن" : "Dark mode")}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}