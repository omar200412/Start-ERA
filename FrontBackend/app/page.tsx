"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useThemeAuth } from "./context/ThemeAuthContext";
import { TRANSLATIONS } from "./lib/translations";
import { Lightbulb, Target, ChevronRight } from "lucide-react";
import Chatbot from "./Chatbot";

// ── Icon components ────────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg aria-hidden="true" className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ── Static data ────────────────────────────────────────────────────────────────
const MOCKUP_STARTUPS = [
  { name: "Justi.items", color: "bg-blue-600",   tag: "E-commerce" },
  { name: "CoMoon.ai",   color: "bg-purple-600", tag: "AI Tools"   },
  { name: "Musicify",    color: "bg-green-600",  tag: "Music Tech" },
];

// ── Page component ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { user, darkMode, toggleTheme, logout, lang, setLang } = useThemeAuth();
  const t = TRANSLATIONS[lang];
  const isRTL = lang === "ar";
  const [idea, setIdea]               = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg]   = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const maxChars = 400;

  // Sync dark class on <html> so Tailwind dark: variants work everywhere
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const d = darkMode;

  // ── Language cycle ────────────────────────────────────────────────────────
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

  // ── Navigation helpers ────────────────────────────────────────────────────
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  }

  // ── Plan generation ───────────────────────────────────────────────────────
  function handleGenerate() {
    if (!user) { window.location.href = "/login"; return; }
    if (idea.trim()) {
      sessionStorage.setItem(
        "planner_form",
        JSON.stringify({ idea, capital: "", skills: "", strategy: "", management: "", language: lang })
      );
    }
    window.location.href = "/planner";
  }

  // ── Contact form ──────────────────────────────────────────────────────────
  async function handleContact(e: React.FormEvent) {
    e.preventDefault();
    setContactLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMsg }),
      });
      toast.success(
        lang === "tr" ? "Mesajınız alındı!" :
        lang === "ar" ? "تم استلام رسالتك!" :
        "Message received! We'll be in touch."
      );
      setContactName(""); setContactEmail(""); setContactMsg("");
    } catch {
      toast.error(
        lang === "tr" ? "Hata oluştu, tekrar deneyin." :
        lang === "ar" ? "حدث خطأ." :
        "Something went wrong."
      );
    } finally {
      setContactLoading(false);
    }
  }

  // ── Translated strings ────────────────────────────────────────────────────
  const freeItems = [t.li_1, t.li_2, t.li_3, t.li_4];
  const proItems  = [t.pro_li1, t.pro_li2, t.pro_li3, t.pro_li4];

  const L = {
    heroTitle: lang === "tr" ? <>Fikrinizi yazın.<br />Girişiminizin<br />hayata geçtiğini görün.</> : lang === "ar" ? <>اكتب فكرتك.<br />شاهد شركتك الناشئة<br />تنبض بالحياة.</> : <>Type your idea. See your<br />startup come to life.</>,
    heroSub:        lang === "tr" ? "60 saniyenin altında önizleme al. Ardından girişimini inşa et ve başlat." : lang === "ar" ? "احصل على معاينة في أقل من 60 ثانية. ثم ابنِ شركتك الناشئة وأطلقها." : "Get a preview in under 60 seconds. Then build & launch your startup.",
    placeholder:    lang === "tr" ? "Harika fikrinizi buraya girin..." : lang === "ar" ? "أدخل فكرتك الرائعة هنا..." : "Enter awesome idea here...",
    charsLeft:      `${maxChars - idea.length} ${lang === "tr" ? "karakter kaldı" : lang === "ar" ? "حرف متبقٍ" : "characters left"}`,
    generate:       lang === "tr" ? "Önizleme Oluştur" : lang === "ar" ? "إنشاء معاينة" : "Generate Preview",
    browse:         lang === "tr" ? "Fikirlere Göz At" : lang === "ar" ? "استعرض الأفكار" : "Browse Ideas",
    ideaGen:        lang === "tr" ? "Fikir Üretici" : lang === "ar" ? "مولّد الأفكار" : "Idea Generator",
    getStarted:     lang === "tr" ? "Başla" : lang === "ar" ? "ابدأ" : "Get started",
    builtOn:        lang === "tr" ? "START ERA İLE OLUŞTURULDU" : lang === "ar" ? "مبني على START ERA" : "BUILT ON START ERA",
    communityTitle: lang === "tr" ? "Start ERA topluluğuna katıl; bağlantılar gelişir ve fikirler yeşerir." : lang === "ar" ? "انضم إلى مجتمع Start ERA حيث تزدهر العلاقات وتنمو الأفكار." : "Join our community at Start ERA, where connections thrive and ideas flourish.",
    communitySub:   lang === "tr" ? "Diğer girişimcilerle ağ kur, deneyimlerini paylaş ve büyüme fırsatlarını birlikte keşfet." : lang === "ar" ? "تواصل مع رواد أعمال آخرين وشارك تجاربك." : "Network with fellow innovators, share experiences, and explore growth opportunities.",
    howLabel:       lang === "tr" ? "NASIL ÇALIŞIR" : lang === "ar" ? "كيف يعمل" : "HOW IT WORKS",
    shareIdea:      lang === "tr" ? "Fikrinizi Paylaşın" : lang === "ar" ? "شارك فكرتك" : "Share your idea",
    trendingLabel:  lang === "tr" ? "TREND FİKİRLER" : lang === "ar" ? "أفكار رائجة" : "TRENDING IDEAS FEED",
    trendingTitle:  lang === "tr" ? "Trend Fikirler Akışına göz atın, girişimcilik ruhunu yakalayın." : lang === "ar" ? "اطّلع على خلاصة الأفكار الرائجة." : "Check out our Trending Ideas Feed, a vibrant mix of entrepreneurial spirit.",
    tryIdea:        lang === "tr" ? "→ Bu fikirle devam et" : lang === "ar" ? "→ المتابعة بهذه الفكرة" : "→ Try this idea",
    pricingSub:     lang === "tr" ? "Büyüyen her girişim için esnek planlar." : lang === "ar" ? "خطط مرنة لكل شركة ناشئة." : "Flexible plans for every growing startup.",
    contactSub:     lang === "tr" ? "Sorularınız için bize yazın." : lang === "ar" ? "اكتب لنا لأي أسئلة." : "Write to us for any questions.",
    builtWith:      lang === "tr" ? "Start ERA ile oluşturuldu" : lang === "ar" ? "مبني بـ Start ERA" : "Built with Start ERA",
    darkLabel:      lang === "tr" ? "Karanlık" : lang === "ar" ? "داكن" : "Dark",
    lightLabel:     lang === "tr" ? "Aydınlık" : lang === "ar" ? "فاتح" : "Light",
    product:        lang === "tr" ? "Ürün" : lang === "ar" ? "المنتج" : "Product",
    langLabel:      lang === "tr" ? "Dil" : lang === "ar" ? "اللغة" : "Language",
    aiBadge:        lang === "tr" ? "Yapay zeka destekli girişim oluşturucu" : lang === "ar" ? "منشئ الشركات الناشئة بالذكاء الاصطناعي" : "AI-powered startup builder",
    flowATitle:     lang === "tr" ? "Bana Fikir Bul" : lang === "ar" ? "ساعدني في إيجاد فكرة" : "Help Me Find an Idea",
    flowADesc:      lang === "tr" ? "7 hızlı soruyu cevaplayın, yapay zekamız becerilerinize ve bütçenize göre 3 kişiselleştirilmiş girişim planı oluştursun." : lang === "ar" ? "أجب عن 7 أسئلة سريعة وسيقوم الذكاء الاصطناعي بإنشاء 3 خطط شركات ناشئة مخصصة بناءً على مهاراتك وميزانيتك." : "Answer 7 quick questions and our AI will generate 3 personalized startup blueprints based on your skills and budget.",
    flowBTitle:     lang === "tr" ? "Zaten Bir Fikrim Var" : lang === "ar" ? "لديّ فكرة بالفعل" : "I Already Have an Idea",
    flowBDesc:      lang === "tr" ? "Mevcut iş fikrinizi yapay zeka pazar doğrulama motorumuzdan geçirerek talep ve rekabeti test edin." : lang === "ar" ? "قدّم فكرتك التجارية الحالية وشغّلها عبر محرك التحقق من السوق بالذكاء الاصطناعي لاختبار الطلب والمنافسة." : "Bring your existing business idea and run it through our AI market validation engine to test demand and competition.",
    openMenu:       lang === "tr" ? "Menüyü aç" : lang === "ar" ? "فتح القائمة" : "Open menu",
    closeMenu:      lang === "tr" ? "Menüyü kapat" : lang === "ar" ? "إغلاق القائمة" : "Close menu",
    submitIdea:     lang === "tr" ? "Fikri gönder" : lang === "ar" ? "إرسال الفكرة" : "Submit idea",
    switchLang:     lang === "tr" ? "Dili değiştir" : lang === "ar" ? "تغيير اللغة" : "Switch language",
    toggleTheme:    d
      ? (lang === "tr" ? "Aydınlık moda geç" : lang === "ar" ? "التبديل إلى الوضع الفاتح" : "Switch to light mode")
      : (lang === "tr" ? "Karanlık moda geç" : lang === "ar" ? "التبديل إلى الوضع الداكن" : "Switch to dark mode"),
  };

  const STEPS = [
    { num: "1.", title: lang === "tr" ? "Fikrinizi Girin" : lang === "ar" ? "أدخل فكرتك" : "Enter your idea", desc: lang === "tr" ? "Startup AI modelleri ve özel tasarım kullanarak fikrinizi dakikalar içinde oluşturun." : lang === "ar" ? "ابنِ فكرتك في دقائق باستخدام نماذج الذكاء الاصطناعي والتصميم المخصص." : "Build your idea in minutes using AI models, custom prompts, and design." },
    { num: "2.", title: lang === "tr" ? "Anında Önizleme Alın" : lang === "ar" ? "احصل على معاينة فورية" : "Get instant preview", desc: lang === "tr" ? "AI analizinizi saniyeler içinde görün — iş planı, pazar analizi, finansal projeksiyon." : lang === "ar" ? "شاهد تحليل الذكاء الاصطناعي في ثوانٍ." : "See your AI analysis in seconds — business plan, market analysis, financial projections." },
    { num: "3.", title: lang === "tr" ? "İndir ve Uygula" : lang === "ar" ? "نزّل ونفّذ" : "Download + launch", desc: lang === "tr" ? "Profesyonel PDF raporu indir ve girişimini hayata geçir." : lang === "ar" ? "نزّل تقرير PDF احترافياً وأطلق مشروعك." : "Download your professional PDF and launch your startup." },
  ];

  const TRENDING = [
    { idea: lang === "tr" ? "Mahallenizdeki kedi bakıcısını bulmanıza yardımcı olan bir uygulama" : lang === "ar" ? "تطبيق يساعدك في إيجاد مربي قطط في منطقتك" : "An app that helps you find a cat sitter in your area", score: 7.8, tag: "Pet Tech" },
    { idea: lang === "tr" ? "Küçük işletmeler için yapay zeka destekli muhasebe asistanı" : lang === "ar" ? "مساعد محاسبة مدعوم بالذكاء الاصطناعي" : "AI-powered accounting assistant for small businesses", score: 8.2, tag: "FinTech" },
    { idea: lang === "tr" ? "Öğrencileri akıl hocalarıyla buluşturan platform" : lang === "ar" ? "منصة تربط الطلاب بالمرشدين" : "Platform connecting students with mentors", score: 7.5, tag: "EdTech" },
    { idea: lang === "tr" ? "Restoran artıkları için yemek paylaşım ağı" : lang === "ar" ? "شبكة مشاركة طعام لفائض المطاعم" : "Food sharing network for restaurant surplus", score: 8.0, tag: "FoodTech" },
    { idea: lang === "tr" ? "Sağlık verilerini takip eden akıllı giyilebilir" : lang === "ar" ? "جهاز ذكي قابل للارتداء لتتبع بيانات الصحة" : "Smart wearable that tracks health data", score: 7.9, tag: "HealthTech" },
    { idea: lang === "tr" ? "Uzak ekipler için sanal ofis platformu" : lang === "ar" ? "منصة مكتب افتراضي للفرق عن بُعد" : "Virtual office platform for remote teams", score: 8.4, tag: "SaaS" },
  ];

  // ── Color tokens ──────────────────────────────────────────────────────────
  const pageBg        = d ? "bg-gray-950"  : "bg-white";
  const pageText      = d ? "text-gray-100" : "text-gray-900";
  const navBg         = d ? "bg-gray-950/95 border-gray-800" : "bg-white/90 border-gray-100";
  // WCAG fix: raised contrast — gray-400 on dark bg passes AA; gray-600 on white passes AA
  const linkCls       = d ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900";
  const sub           = d ? "text-gray-300" : "text-gray-600";
  const sectionBg     = d ? "bg-gray-900" : "bg-gray-50";
  const faqInputBg    = d ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-green-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-green-500";
  const mobileMenuBg  = d ? "bg-gray-950" : "bg-white";
  const trendCardBg   = d ? "bg-gray-900 border-gray-800 hover:border-green-600" : "bg-white border-gray-200 hover:border-green-400";
  const heroGradient  = d
    ? "radial-gradient(ellipse at 60% 0%, #14532d 0%, #052e16 30%, #030712 70%, #030712 100%)"
    : "radial-gradient(ellipse at 60% 0%, #bbf7d0 0%, #d1fae5 30%, #f0fdf4 60%, #ffffff 100%)";
  const greenCardGradient = d
    ? "radial-gradient(ellipse at top, #166534 0%, #14532d 100%)"
    : "radial-gradient(ellipse at top, #4ade80 0%, #16a34a 100%)";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={"min-h-screen font-sans transition-colors duration-300 " + pageBg + " " + pageText}>
      <Chatbot />

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <nav aria-label="Main navigation" className={"sticky top-0 z-50 border-b backdrop-blur-md " + navBg}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5"
            aria-label="Start ERA — scroll to top"
          >
            <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-sm" aria-hidden="true">S</div>
            <span className={"text-lg font-black " + pageText}>Start ERA</span>
          </button>

          {/* Desktop nav links */}
          <div className={"hidden md:flex items-center gap-8 text-sm font-medium"}>
            <button onClick={() => scrollTo("pricing")}  className={"hover:text-green-600 transition " + linkCls}>{t.nav_pricing}</button>
            <button onClick={() => scrollTo("about")}    className={"hover:text-green-600 transition " + linkCls}>{t.nav_about}</button>
            <button onClick={() => scrollTo("trending")} className={"hover:text-green-600 transition " + linkCls}>{L.browse}</button>
            <a href="/idea-generation" className={"hover:text-green-600 transition no-underline " + linkCls}>{L.ideaGen}</a>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <button
              onClick={toggleLang}
              aria-label={L.switchLang}
              className={"text-sm font-bold transition " + sub + " hover:text-green-600"}
            >
              {getLangLabel()}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={L.toggleTheme}
              className={"p-2 rounded-lg transition flex items-center gap-1.5 text-xs font-medium border " + (d ? "border-gray-700 text-yellow-400 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-100")}
            >
              {d ? <SunIcon /> : <MoonIcon />}
              <span className="hidden sm:inline">{d ? L.lightLabel : L.darkLabel}</span>
            </button>

            {/* Auth buttons */}
            {user ? (
              <>
                <a href="/dashboard" className={"px-4 py-2 text-sm font-bold rounded-full transition no-underline " + (d ? "text-gray-200 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100")}>{t.dashboard}</a>
                <button onClick={logout} className={"text-sm transition " + (d ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500")}>{t.logout}</button>
              </>
            ) : (
              <a href="/login" className="px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white font-bold rounded-full text-sm transition no-underline shadow-sm">{L.getStarted}</a>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? L.closeMenu : L.openMenu}
              className={"md:hidden p-2 rounded-lg transition " + (d ? "hover:bg-gray-800" : "hover:bg-gray-100")}
            >
              <div className={"w-4 h-0.5 mb-1 " + (d ? "bg-gray-400" : "bg-gray-700")} />
              <div className={"w-4 h-0.5 mb-1 " + (d ? "bg-gray-400" : "bg-gray-700")} />
              <div className={"w-4 h-0.5 "      + (d ? "bg-gray-400" : "bg-gray-700")} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className={"md:hidden px-6 pb-4 border-t pt-3 space-y-1 " + mobileMenuBg + " " + (d ? "border-gray-800" : "border-gray-100")}>
            <button onClick={() => scrollTo("pricing")}  className={"block w-full text-left text-sm py-2 " + linkCls}>{t.nav_pricing}</button>
            <button onClick={() => scrollTo("about")}    className={"block w-full text-left text-sm py-2 " + linkCls}>{t.nav_about}</button>
            <button onClick={() => scrollTo("trending")} className={"block w-full text-left text-sm py-2 " + linkCls}>{L.browse}</button>
            <a href="/idea-generation" className={"block w-full text-left text-sm py-2 no-underline " + linkCls}>{L.ideaGen}</a>
          </div>
        )}
      </nav>

      {/* ── MAIN CONTENT (landmark) ────────────────────────────────────────── */}
      <main id="main-content">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby="hero-heading" className="relative overflow-hidden" style={{ background: heroGradient }}>
          <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
            {/* Badge */}
            <div className={"inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 shadow-sm border " + (d ? "bg-gray-900/80 border-gray-700 text-gray-300" : "bg-white/80 border-gray-200 text-gray-600")}>
              <svg aria-hidden="true" className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {L.aiBadge}
            </div>

            {/* h1 — the one and only page heading */}
            <h1 id="hero-heading" className={"text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight " + pageText} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              {L.heroTitle}
            </h1>
            <p className={"text-lg mb-10 max-w-lg mx-auto leading-relaxed " + sub}>{L.heroSub}</p>

            {/* CTA Flow Cards */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-2">
              {/* Flow A — Find an Idea */}
              <a
                href="/idea-generation"
                className={"group rounded-2xl border p-6 text-left no-underline transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 " + (d ? "bg-gray-900/70 border-gray-800 hover:border-emerald-600" : "bg-white/70 border-gray-200 hover:border-emerald-400")}
              >
                <div className={"w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors " + (d ? "bg-emerald-950/60 text-emerald-400 group-hover:bg-emerald-900/80" : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100")}>
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className={"text-base font-black mb-1.5 group-hover:text-emerald-500 transition-colors " + pageText}>{L.flowATitle}</h3>
                <p className={"text-xs leading-relaxed mb-4 " + sub}>{L.flowADesc}</p>
                <span className={"inline-flex items-center gap-1 text-xs font-bold transition-colors " + (d ? "text-emerald-400" : "text-emerald-600")}>
                  {L.getStarted} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>

              {/* Flow B — Validate Existing Idea */}
              <a
                href="/custom-idea"
                className={"group rounded-2xl border p-6 text-left no-underline transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 " + (d ? "bg-gray-900/70 border-gray-800 hover:border-sky-600" : "bg-white/70 border-gray-200 hover:border-sky-400")}
              >
                <div className={"w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors " + (d ? "bg-sky-950/60 text-sky-400 group-hover:bg-sky-900/80" : "bg-sky-50 text-sky-600 group-hover:bg-sky-100")}>
                  <Target className="w-5 h-5" />
                </div>
                <h3 className={"text-base font-black mb-1.5 group-hover:text-sky-500 transition-colors " + pageText}>{L.flowBTitle}</h3>
                <p className={"text-xs leading-relaxed mb-4 " + sub}>{L.flowBDesc}</p>
                <span className={"inline-flex items-center gap-1 text-xs font-bold transition-colors " + (d ? "text-sky-400" : "text-sky-600")}>
                  {L.getStarted} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ── COMMUNITY SECTION ─────────────────────────────────────────────── */}
        <section aria-labelledby="community-heading" className="bg-gray-950 py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-16">[01] {L.builtOn}</p>
            <div className="grid md:grid-cols-2 gap-16 items-start mb-16">
              {/* h2 — first section heading (directly under h1) */}
              <h2 id="community-heading" className="text-4xl md:text-5xl font-black text-white leading-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                <span className="text-white">{L.communityTitle.split(".")[0]}.</span>
                {L.communityTitle.includes(".") && <span className="text-gray-400"> {L.communityTitle.split(".").slice(1).join(".").trim()}</span>}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">{L.communitySub}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {MOCKUP_STARTUPS.map((s, i) => (
                <article key={i} className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900">
                  <div className={s.color + " h-32 flex items-center justify-center"}>
                    <span className="text-white font-black text-2xl">{s.name}</span>
                  </div>
                  <div className="p-4">
                    <div className="inline-block px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 text-xs font-medium">{s.tag}</div>
                    <p className="text-gray-400 text-xs mt-2">{L.builtWith}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <section aria-labelledby="how-heading" className={"py-24 px-6 " + (d ? "bg-gray-950" : "bg-white")}>
          <div className="max-w-6xl mx-auto">
            <p className={"text-xs font-bold uppercase tracking-[0.2em] mb-16 " + sub}>[02] {L.howLabel}</p>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-0">
                {/* h2 — section heading */}
                <h2 id="how-heading" className={"sr-only"}>{L.howLabel}</h2>
                {STEPS.map((s, i) => (
                  <div key={i} className={(i === 0 ? (d ? "bg-green-950 border border-green-900 rounded-xl p-6 mb-8" : "bg-green-50 rounded-xl p-6 mb-8") : "border-b pb-8 mb-8 p-6 " + (d ? "border-gray-800" : "border-gray-200"))}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={"w-8 h-8 rounded-full flex items-center justify-center " + (i === 0 ? "bg-green-600" : (d ? "bg-gray-800" : "bg-gray-100"))} aria-hidden="true">
                        <svg className={"w-4 h-4 " + (i === 0 ? "text-white" : sub)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {i === 0 ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          : i === 1 ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />}
                        </svg>
                      </div>
                      {/* h3 — step headings (under h2) */}
                      <h3 className={"font-bold " + pageText}>{s.num} {s.title}</h3>
                    </div>
                    <p className={"text-sm leading-relaxed ml-11 " + sub}>{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* Green card with idea input */}
              <div className="rounded-3xl p-8" style={{ background: greenCardGradient }}>
                {/* h3 — sibling to step headings (both under the invisible how-heading h2) */}
                <h3 className="text-3xl font-black text-white mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{L.shareIdea}</h3>
                <div className={"rounded-2xl p-5 shadow-lg " + (d ? "bg-gray-900 border border-gray-700" : "bg-white")}>
                  <label htmlFor="idea-input" className="sr-only">{L.placeholder}</label>
                  <textarea
                    id="idea-input"
                    value={idea}
                    onChange={e => setIdea(e.target.value.slice(0, maxChars))}
                    placeholder={lang === "tr" ? "Fikrinizi buraya yazın..." : lang === "ar" ? "اكتب فكرتك هنا..." : "a website that helps you find a cat sitter in your area"}
                    rows={5}
                    className={"w-full resize-none outline-none text-sm leading-relaxed " + (d ? "bg-gray-900 text-gray-200 placeholder-gray-500" : "bg-white text-gray-800 placeholder-gray-500")}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className={"text-xs " + sub}>{L.charsLeft}</span>
                    <button
                      onClick={handleGenerate}
                      aria-label={L.submitIdea}
                      className="w-9 h-9 bg-gray-900 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition shadow-md"
                    >
                      <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRENDING ──────────────────────────────────────────────────────── */}
        <section id="trending" aria-labelledby="trending-heading" className={"py-24 px-6 " + sectionBg}>
          <div className="max-w-6xl mx-auto">
            <p className={"text-xs font-bold uppercase tracking-[0.2em] mb-8 " + sub}>[03] {L.trendingLabel}</p>
            <h2 id="trending-heading" className={"text-4xl md:text-5xl font-black mb-16 max-w-3xl leading-tight " + pageText} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              {L.trendingTitle}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TRENDING.map((item, i) => (
                <button
                  key={i}
                  onClick={() => { setIdea(item.idea); document.getElementById("idea-input")?.scrollIntoView({ behavior: "smooth", block: "center" }); (document.getElementById("idea-input") as HTMLTextAreaElement | null)?.focus(); }}
                  className={"rounded-2xl border p-6 text-left hover:shadow-md transition-all group w-full " + trendCardBg}
                  aria-label={`${L.tryIdea}: ${item.idea}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={"inline-block px-2.5 py-1 rounded-full text-xs font-bold border " + (d ? "bg-green-950 text-green-400 border-green-900" : "bg-green-50 text-green-700 border-green-100")}>{item.tag}</span>
                    <div className="flex items-center gap-1" aria-label={`Score: ${item.score}`}>
                      <svg aria-hidden="true" className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-[10px] font-black text-yellow-600">{item.score}</span>
                    </div>
                  </div>
                  <p className={"text-sm leading-relaxed font-medium mb-4 group-hover:text-green-500 transition " + pageText}>{item.idea}</p>
                  <p className={"text-[10px] " + sub} aria-hidden="true">{L.tryIdea}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────────────────────────────── */}
        <section id="pricing" aria-labelledby="pricing-heading" className={"py-24 px-6 " + (d ? "bg-gray-950" : "bg-white")}>
          <div className="max-w-6xl mx-auto">
            <p className={"text-xs font-bold uppercase tracking-[0.2em] mb-8 " + sub}>[04] {lang === "tr" ? "FİYATLANDIRMA" : lang === "ar" ? "الأسعار" : "PRICING"}</p>
            <h2 id="pricing-heading" className={"text-4xl md:text-5xl font-black mb-4 " + pageText} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.price_title}</h2>
            <p className={"mb-16 " + sub}>{L.pricingSub}</p>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
              {/* Free plan */}
              <div className={"rounded-2xl border-2 border-green-500 p-8 relative " + (d ? "bg-gray-900" : "bg-white")}>
                <div className="absolute -top-3 left-6 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">{t.popular}</div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">{t.p_free_t}</p>
                <p className={"text-5xl font-black mb-1 " + pageText}>{t.p_free_p}</p>
                <p className={"text-sm mb-6 " + sub}>{t.p_free_d}</p>
                <ul className="space-y-3 mb-8">
                  {freeItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckIcon />
                      <span className={"text-sm " + pageText}>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href={user ? "/dashboard" : "/login"} className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-center transition text-sm no-underline block">{t.start_free}</a>
              </div>
              {/* Pro plan (coming soon) */}
              <div className={"rounded-2xl border p-8 relative opacity-75 " + (d ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200")}>
                <div className={"absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full animate-pulse " + (d ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-700")}>{t.coming_soon}</div>
                <p className="text-xs font-bold uppercase tracking-widest text-purple-500 mb-2">{t.p_pro_t}</p>
                <p className={"text-5xl font-black mb-1 " + sub}>{t.p_pro_p}</p>
                <p className={"text-sm mb-6 " + sub}>{t.p_pro_d}</p>
                <ul className="space-y-3 mb-8">
                  {proItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg aria-hidden="true" className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      <span className={"text-sm " + sub}>{item}</span>
                    </li>
                  ))}
                </ul>
                <button disabled aria-disabled="true" className={"w-full py-3.5 font-bold rounded-full text-sm border cursor-not-allowed " + (d ? "border-gray-700 text-gray-500" : "border-gray-300 text-gray-400")}>{t.coming_soon}</button>
              </div>
            </div>
          </div>
        </section>

        {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
        <section id="about" aria-labelledby="about-heading" className="py-24 px-6 bg-gray-950">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">[05] {lang === "tr" ? "HAKKIMIZDA" : lang === "ar" ? "من نحن" : "ABOUT"}</p>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 id="about-heading" className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.about_title}</h2>
                <p className="text-gray-300 text-lg leading-relaxed">{t.about_text}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: "10K+", label: lang === "tr" ? "Oluşturulan Plan" : lang === "ar" ? "خطة مُنشأة" : "Plans Created" },
                  { num: "60s",  label: lang === "tr" ? "Ortalama Süre"    : lang === "ar" ? "متوسط الوقت"  : "Avg Time" },
                  { num: "3",    label: lang === "tr" ? "Dil"              : lang === "ar" ? "لغات"         : "Languages" },
                  { num: "100%", label: lang === "tr" ? "Ücretsiz"         : lang === "ar" ? "مجاني"        : "Free to Start" },
                ].map((s, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-gray-900 border border-gray-800 text-center">
                    <div className="text-3xl font-black text-green-400 mb-1">{s.num}</div>
                    <div className="text-xs text-gray-400 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ───────────────────────────────────────────────────────── */}
        <section id="contact" aria-labelledby="contact-heading" className={"py-24 px-6 " + (d ? "bg-gray-900" : "bg-white")}>
          <div className="max-w-2xl mx-auto text-center">
            <p className={"text-xs font-bold uppercase tracking-[0.2em] mb-6 " + sub}>[06] {lang === "tr" ? "İLETİŞİM" : lang === "ar" ? "التواصل" : "CONTACT"}</p>
            <h2 id="contact-heading" className={"text-4xl font-black mb-3 " + pageText} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.contact_title}</h2>
            <p className={"mb-10 " + sub}>{L.contactSub}</p>
            <form onSubmit={handleContact} className="space-y-4" noValidate>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="block text-left">
                  <span className="sr-only">{t.form_name}</span>
                  <input
                    placeholder={t.form_name}
                    required
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    className={"w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-500/20 transition " + faqInputBg}
                  />
                </label>
                <label className="block text-left">
                  <span className="sr-only">{t.form_email}</span>
                  <input
                    type="email"
                    placeholder={t.form_email}
                    required
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    className={"w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-500/20 transition " + faqInputBg}
                  />
                </label>
              </div>
              <label className="block text-left">
                <span className="sr-only">{t.form_msg}</span>
                <textarea
                  placeholder={t.form_msg}
                  required
                  rows={5}
                  value={contactMsg}
                  onChange={e => setContactMsg(e.target.value)}
                  className={"w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-500/20 transition resize-none " + faqInputBg}
                />
              </label>
              <button
                type="submit"
                disabled={contactLoading}
                aria-busy={contactLoading}
                className={"w-full py-3.5 font-bold rounded-full text-sm transition " + (contactLoading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-gray-900 hover:bg-gray-700 text-white")}
              >
                {contactLoading ? (lang === "tr" ? "Gönderiliyor..." : lang === "ar" ? "جارٍ الإرسال..." : "Sending...") : t.form_btn}
              </button>
            </form>
          </div>
        </section>

      </main>{/* /main */}

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 border-t border-gray-900 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-xs" aria-hidden="true">S</div>
                <span className="text-white font-black">Start ERA</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">{t.about_text}</p>
            </div>
            <div className="flex gap-12">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{L.product}</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><button onClick={() => scrollTo("pricing")} className="hover:text-white transition">{t.nav_pricing}</button></li>
                  <li><a href={user ? "/dashboard" : "/login"} className="hover:text-white transition no-underline">{t.dashboard}</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{L.langLabel}</h3>
                <div className="flex flex-col gap-2">
                  {(["tr", "en", "ar"] as const).map(l => (
                    <button key={l} onClick={() => setLang(l)} className={"text-sm text-left transition " + (lang === l ? "text-green-400 font-bold" : "text-gray-400 hover:text-white")}>
                      {l === "tr" ? "Türkçe" : l === "en" ? "English" : "العربية"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-900 text-xs text-gray-500">
            <span>{t.footer}</span>
            <button
              onClick={toggleTheme}
              aria-label={L.toggleTheme}
              className="flex items-center gap-1.5 hover:text-gray-300 transition mt-4 md:mt-0"
            >
              {d ? <SunIcon /> : <MoonIcon />}
              {d ? L.lightLabel : L.darkLabel}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}