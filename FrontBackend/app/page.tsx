"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { useThemeAuth } from "./context/ThemeAuthContext";
import { TRANSLATIONS } from "./lib/translations";
import { Lightbulb, Target, ChevronRight, Sparkles, Globe, FileText, TrendingUp, BarChart3, Users, Star, Zap, Shield, ArrowRight } from "lucide-react";
import Chatbot from "./Chatbot";
import LanguageDropdown from "./components/LanguageDropdown";

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

// ── Scroll Reveal Hook ─────────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ── Animated Counter Hook ──────────────────────────────────────────────────────
function useAnimatedCounter(target: number, suffix = "", duration = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) { setStarted(true); observer.unobserve(el); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { ref, display: `${count.toLocaleString()}${suffix}` };
}

// ── Static data ────────────────────────────────────────────────────────────────
const MOCKUP_STARTUPS = [
  { name: "Justi.items", colorDark: "bg-white/5 backdrop-blur-md", colorLight: "bg-gray-100", tag: "E-commerce" },
  { name: "CoMoon.ai", colorDark: "bg-green-500/10 backdrop-blur-md", colorLight: "bg-green-100", tag: "AI Tools" },
  { name: "Musicify", colorDark: "bg-emerald-500/10 backdrop-blur-md", colorLight: "bg-emerald-100", tag: "Music Tech" },
];

// ── Page component ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { user, darkMode, toggleTheme, logout, lang, setLang } = useThemeAuth();
  const t = TRANSLATIONS[lang];
  const isRTL = lang === "ar";
  const [idea, setIdea] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const maxChars = 400;

  // Scroll reveal refs
  const revealRefs = useRef<Set<HTMLElement>>(new Set());
  const addRevealRef = useCallback((el: HTMLElement | null) => {
    if (el) revealRefs.current.add(el);
  }, []);

  // Global scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 } // lowered threshold to 0.05 so large grids trigger earlier
    );
    
    // Observe all current elements
    revealRefs.current.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }); // Run on every render to catch newly mounted elements

  // Sync dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const d = darkMode;

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
  const proItems = [t.pro_li1, t.pro_li2, t.pro_li3, t.pro_li4];

  const L = {
    heroTitle: lang === "tr" ? <>Fikrinizi yazın,<br />girişiminizin hayata geçtiğini görün.</> : lang === "ar" ? <>اكتب فكرتك،<br />شاهد شركتك الناشئة تنبض بالحياة.</> : <>Type your idea,<br />See your startup come to life.</>,
    heroSub: lang === "tr" ? "Fikrini 60 saniyede gerçeğe dönüştür." : lang === "ar" ? "حوّل فكرتك إلى واقع في 60 ثانية." : "Turn your idea into reality in 60 seconds.",
    placeholder: lang === "tr" ? "Harika fikrinizi buraya girin..." : lang === "ar" ? "أدخل فكرتك الرائعة هنا..." : "Enter awesome idea here...",
    charsLeft: `${maxChars - idea.length} ${lang === "tr" ? "karakter kaldı" : lang === "ar" ? "حرف متبقٍ" : "characters left"}`,
    generate: lang === "tr" ? "Önizleme Oluştur" : lang === "ar" ? "إنشاء معاينة" : "Generate Preview",
    browse: lang === "tr" ? "Fikirlere Göz At" : lang === "ar" ? "استعرض الأفكار" : "Browse Ideas",
    ideaGen: lang === "tr" ? "Fikir Üretici" : lang === "ar" ? "مولّد الأفكار" : "Idea Generator",
    businessPlan: lang === "tr" ? "İş Planı Oluştur" : lang === "ar" ? "خطة عمل" : "Business Planner",
    getStarted: lang === "tr" ? "Başla" : lang === "ar" ? "ابدأ" : "Get started",
    builtOn: lang === "tr" ? "START ERA İLE OLUŞTURULDU" : lang === "ar" ? "مبني على START ERA" : "BUILT ON START ERA",
    communityTitle: lang === "tr" ? "Start ERA topluluğuna katıl; bağlantılar gelişir ve fikirler yeşerir." : lang === "ar" ? "انضم إلى مجتمع Start ERA حيث تزدهر العلاقات وتنمو الأفكار." : "Join our community at Start ERA, where connections thrive and ideas flourish.",
    communitySub: lang === "tr" ? "Diğer girişimcilerle ağ kur, deneyimlerini paylaş ve büyüme fırsatlarını birlikte keşfet." : lang === "ar" ? "تواصل مع رواد أعمال آخرين وشارك تجاربك." : "Network with fellow innovators, share experiences, and explore growth opportunities.",
    howLabel: lang === "tr" ? "NASIL ÇALIŞIR" : lang === "ar" ? "كيف يعمل" : "HOW IT WORKS",
    shareIdea: lang === "tr" ? "Fikrinizi Paylaşın" : lang === "ar" ? "شارك فكرتك" : "Share your idea",
    trendingLabel: lang === "tr" ? "TREND FİKİRLER" : lang === "ar" ? "أفكار رائجة" : "TRENDING IDEAS FEED",
    trendingTitle: lang === "tr" ? "Trend Fikirler Akışına göz atın, girişimcilik ruhunu yakalayın." : lang === "ar" ? "اطّلع على خلاصة الأفكار الرائجة." : "Check out our Trending Ideas Feed, a vibrant mix of entrepreneurial spirit.",
    tryIdea: lang === "tr" ? "→ Bu fikri dene" : lang === "ar" ? "→ المتابعة بهذه الفكرة" : "→ Try this idea",
    pricingSub: lang === "tr" ? "Büyüyen her girişim için esnek planlar." : lang === "ar" ? "خطط مرنة لكل شركة ناشئة." : "Flexible plans for every growing startup.",
    contactSub: lang === "tr" ? "Sorularınız için bize yazın." : lang === "ar" ? "اكتب لنا لأي أسئلة." : "Write to us for any questions.",
    builtWith: lang === "tr" ? "Start ERA ile oluşturuldu" : lang === "ar" ? "مبني بـ Start ERA" : "Built with Start ERA",
    darkLabel: lang === "tr" ? "Karanlık" : lang === "ar" ? "داكن" : "Dark",
    lightLabel: lang === "tr" ? "Aydınlık" : lang === "ar" ? "فاتح" : "Light",
    product: lang === "tr" ? "Ürün" : lang === "ar" ? "المنتج" : "Product",
    langLabel: lang === "tr" ? "Dil" : lang === "ar" ? "اللغة" : "Language",
    aiBadge: lang === "tr" ? "Yapay zeka destekli girişim oluşturucu" : lang === "ar" ? "منشئ الشركات الناشئة بالذكاء الاصطناعي" : "AI-powered startup builder",
    flowATitle: lang === "tr" ? "Bana Fikir Bul" : lang === "ar" ? "ساعدني في إيجاد فكرة" : "Help Me Find an Idea",
    flowADesc: lang === "tr" ? "7 hızlı soruyu cevaplayın, yapay zekamız becerilerinize ve bütçenize göre 3 kişiselleştirilmiş girişim planı oluştursun." : lang === "ar" ? "أجب عن 7 أسئلة سريعة وسيقوم الذكاء الاصطناعي بإنشاء 3 خطط شركات ناشئة مخصصة بناءً على مهاراتك وميزانيتك." : "Answer 7 quick questions and our AI will generate 3 personalized startup blueprints based on your skills and budget.",
    flowBTitle: lang === "tr" ? "Zaten Bir Fikrim Var" : lang === "ar" ? "لديّ فكرة بالفعل" : "I Already Have an Idea",
    flowBDesc: lang === "tr" ? "Mevcut iş fikrinizi yapay zeka pazar doğrulama motorumuzdan geçirerek talep ve rekabeti test edin." : lang === "ar" ? "قدّم فكرتك التجارية الحالية وشغّلها عبر محرك التحقق من السوق بالذكاء الاصطناعي لاختبار الطلب والمنافسة." : "Bring your existing business idea and run it through our AI market validation engine to test demand and competition.",
    openMenu: lang === "tr" ? "Menüyü aç" : lang === "ar" ? "فتح القائمة" : "Open menu",
    closeMenu: lang === "tr" ? "Menüyü kapat" : lang === "ar" ? "إغلاق القائمة" : "Close menu",
    submitIdea: lang === "tr" ? "Fikri gönder" : lang === "ar" ? "إرسال الفكرة" : "Submit idea",
    switchLang: lang === "tr" ? "Dili değiştir" : lang === "ar" ? "تغيير اللغة" : "Switch language",
    toggleTheme: d
      ? (lang === "tr" ? "Aydınlık moda geç" : lang === "ar" ? "التبديل إلى الوضع الفاتح" : "Switch to light mode")
      : (lang === "tr" ? "Karanlık moda geç" : lang === "ar" ? "التبديل إلى الوضع الداكن" : "Switch to dark mode"),
    // New sections
    featuresLabel: lang === "tr" ? "ÖZELLİKLER" : lang === "ar" ? "الميزات" : "FEATURES",
    featuresTitle: lang === "tr" ? "Girişiminizi başlatmak için ihtiyacınız olan her şey." : lang === "ar" ? "كل ما تحتاجه لإطلاق شركتك الناشئة." : "Everything you need to launch your startup.",
    featuresSub: lang === "tr" ? "Güçlü yapay zeka araçlarıyla fikrinizi gerçek bir işe dönüştürün." : lang === "ar" ? "حوّل فكرتك إلى عمل حقيقي مع أدوات الذكاء الاصطناعي." : "Transform your idea into a real business with powerful AI tools.",
    testimonialsLabel: lang === "tr" ? "KULLANICI DENEYİMLERİ" : lang === "ar" ? "تجارب المستخدمين" : "TESTIMONIALS",
    testimonialsTitle: lang === "tr" ? "Girişimciler ne diyor?" : lang === "ar" ? "ماذا يقول رواد الأعمال؟" : "What entrepreneurs say",
    trustedBy: lang === "tr" ? "girişimci tarafından güveniliyor" : lang === "ar" ? "يثق بنا من رواد الأعمال" : "entrepreneurs trust us",
  };

  // ── Features data ─────────────────────────────────────────────────────────
  const FEATURES = [
    { icon: Sparkles, title: t.feat1_t, desc: t.feat1_d, color: "text-purple-500", bg: d ? "bg-purple-500/10" : "bg-purple-50" },
    { icon: Globe, title: t.feat2_t, desc: t.feat2_d, color: "text-blue-500", bg: d ? "bg-blue-500/10" : "bg-blue-50" },
    { icon: FileText, title: t.feat3_t, desc: t.feat3_d, color: "text-green-500", bg: d ? "bg-green-500/10" : "bg-green-50" },
    { icon: TrendingUp, title: lang === "tr" ? "Pazar Araştırması" : lang === "ar" ? "بحث السوق" : "Market Research", desc: lang === "tr" ? "Gerçek zamanlı pazar verileri ile sektörünüzü analiz edin." : lang === "ar" ? "حلل قطاعك ببيانات السوق الفورية." : "Analyze your industry with real-time market data.", color: "text-orange-500", bg: d ? "bg-orange-500/10" : "bg-orange-50" },
    { icon: BarChart3, title: lang === "tr" ? "Finansal Projeksiyon" : lang === "ar" ? "التوقعات المالية" : "Financial Projections", desc: lang === "tr" ? "5 yıllık gelir ve gider projeksiyonları oluşturun." : lang === "ar" ? "أنشئ توقعات الإيرادات والمصروفات لخمس سنوات." : "Generate 5-year revenue and expense projections.", color: "text-cyan-500", bg: d ? "bg-cyan-500/10" : "bg-cyan-50" },
    { icon: Users, title: lang === "tr" ? "Rakip Analizi" : lang === "ar" ? "تحليل المنافسين" : "Competitor Analysis", desc: lang === "tr" ? "Rakiplerinizi tanıyın, avantajlarınızı keşfedin." : lang === "ar" ? "تعرف على منافسيك واكتشف مزاياك." : "Know your competitors and discover your advantages.", color: "text-rose-500", bg: d ? "bg-rose-500/10" : "bg-rose-50" },
  ];

  // ── Steps data ────────────────────────────────────────────────────────────
  const STEPS = [
    { num: "01", title: lang === "tr" ? "Fikrinizi Girin" : lang === "ar" ? "أدخل فكرتك" : "Enter your idea", desc: lang === "tr" ? "Startup AI modelleri ve özel tasarım kullanarak fikrinizi dakikalar içinde oluşturun." : lang === "ar" ? "ابنِ فكرتك في دقائق باستخدام نماذج الذكاء الاصطناعي والتصميم المخصص." : "Build your idea in minutes using AI models, custom prompts, and design.", icon: Lightbulb },
    { num: "02", title: lang === "tr" ? "Anında Önizleme Alın" : lang === "ar" ? "احصل على معاينة فورية" : "Get instant preview", desc: lang === "tr" ? "AI analizinizi saniyeler içinde görün — iş planı, pazar analizi, finansal projeksiyon." : lang === "ar" ? "شاهد تحليل الذكاء الاصطناعي في ثوانٍ." : "See your AI analysis in seconds — business plan, market analysis, financial projections.", icon: Zap },
    { num: "03", title: lang === "tr" ? "İndir ve Uygula" : lang === "ar" ? "نزّل ونفّذ" : "Download + launch", desc: lang === "tr" ? "Profesyonel PDF raporu indir ve girişimini hayata geçir." : lang === "ar" ? "نزّل تقرير PDF احترافياً وأطلق مشروعك." : "Download your professional PDF and launch your startup.", icon: ArrowRight },
  ];

  // ── Trending data ─────────────────────────────────────────────────────────
  const TRENDING = [
    { idea: lang === "tr" ? "Mahallenizdeki kedi bakıcısını bulmanıza yardımcı olan bir uygulama" : lang === "ar" ? "تطبيق يساعدك في إيجاد مربي قطط في منطقتك" : "An app that helps you find a cat sitter in your area", score: 7.8, tag: "Pet Tech" },
    { idea: lang === "tr" ? "Küçük işletmeler için yapay zeka destekli muhasebe asistanı" : lang === "ar" ? "مساعد محاسبة مدعوم بالذكاء الاصطناعي" : "AI-powered accounting assistant for small businesses", score: 8.2, tag: "FinTech" },
    { idea: lang === "tr" ? "Öğrencileri akıl hocalarıyla buluşturan platform" : lang === "ar" ? "منصة تربط الطلاب بالمرشدين" : "Platform connecting students with mentors", score: 7.5, tag: "EdTech" },
    { idea: lang === "tr" ? "Restoran artıkları için yemek paylaşım ağı" : lang === "ar" ? "شبكة مشاركة طعام لفائض المطاعم" : "Food sharing network for restaurant surplus", score: 8.0, tag: "FoodTech" },
    { idea: lang === "tr" ? "Sağlık verilerini takip eden akıllı giyilebilir cihaz" : lang === "ar" ? "جهاز ذكي قابل للارتداء لتتبع بيانات الصحة" : "Smart wearable that tracks health data", score: 7.9, tag: "HealthTech" },
    { idea: lang === "tr" ? "Uzak ekipler için sanal ofis platformu" : lang === "ar" ? "منصة مكتب افتراضي للفرق عن بُعد" : "Virtual office platform for remote teams", score: 8.4, tag: "SaaS" },
  ];

  // ── Testimonials data ─────────────────────────────────────────────────────
  const TESTIMONIALS = [
    { name: lang === "tr" ? "Ahmet Yılmaz" : lang === "ar" ? "أحمد يلماز" : "Ahmet Yilmaz", role: lang === "tr" ? "Kurucu, TechFlow" : lang === "ar" ? "مؤسس، TechFlow" : "Founder, TechFlow", quote: lang === "tr" ? "Start ERA ile iş planımı 30 dakikada oluşturdum. Yatırımcı toplantısında çok profesyonel bir izlenim bıraktım." : lang === "ar" ? "أنشأت خطة عملي في 30 دقيقة مع Start ERA. تركت انطباعاً احترافياً في اجتماع المستثمرين." : "I created my business plan in 30 minutes with Start ERA. Made a very professional impression at the investor meeting.", rating: 5 },
    { name: lang === "tr" ? "Elif Demir" : lang === "ar" ? "أليف دمير" : "Elif Demir", role: lang === "tr" ? "CEO, GreenBite" : lang === "ar" ? "CEO, GreenBite" : "CEO, GreenBite", quote: lang === "tr" ? "Pazar analizi ve finansal projeksiyonlar gerçekten etkileyici. Danışmanlık firmasına binlerce lira ödemekten kurtuldum." : lang === "ar" ? "تحليل السوق والتوقعات المالية مثيرة للإعجاب حقاً. وفّرت آلاف الليرات." : "Market analysis and financial projections are truly impressive. Saved thousands compared to consulting firms.", rating: 5 },
    { name: lang === "tr" ? "Mehmet Kara" : lang === "ar" ? "محمد كارا" : "Mehmet Kara", role: lang === "tr" ? "Öğrenci Girişimci" : lang === "ar" ? "طالب رائد أعمال" : "Student Entrepreneur", quote: lang === "tr" ? "Üniversitedeki girişimcilik yarışmasında Start ERA'nın hazırladığı plan ile birincilik aldım!" : lang === "ar" ? "فزت بالمركز الأول في مسابقة ريادة الأعمال بالجامعة بخطة Start ERA!" : "I won first place in the university entrepreneurship competition with a Start ERA plan!", rating: 5 },
  ];

  // ── Color tokens ──────────────────────────────────────────────────────────
  const pageBg = d ? "bg-gray-950" : "bg-[#faf9f6]";
  const pageText = d ? "text-gray-100" : "text-gray-900";
  const navBg = d ? "bg-gray-950/95 border-gray-800" : "bg-[#faf9f6]/90 border-gray-200";
  const linkCls = d ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900";
  const sub = d ? "text-gray-400" : "text-gray-500";
  const sectionBg = d ? "bg-gray-900" : "bg-[#f5f4f0]";
  const faqInputBg = d ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-green-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-green-500";
  const mobileMenuBg = d ? "bg-gray-950" : "bg-[#faf9f6]";
  const trendCardBg = d ? "bg-gray-900 border-gray-800 hover:border-green-600" : "bg-white border-gray-200 hover:border-green-400";
  const heroGradient = d
    ? "radial-gradient(ellipse at 60% 0%, #14532d 0%, #052e16 30%, #030712 70%, #030712 100%)"
    : "radial-gradient(ellipse at 60% 0%, #d1fae5 0%, #ecfdf5 30%, #faf9f6 60%, #faf9f6 100%)";
  const cardBg = d ? "bg-gray-900/60 border-gray-800 hover:border-gray-700" : "bg-white border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md";

  // Animated counters
  const counter1 = useAnimatedCounter(10000, "+");
  const counter2 = useAnimatedCounter(60, "s");
  const counter3 = useAnimatedCounter(3, "");
  const counter4 = useAnimatedCounter(100, "%");

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
            <img src="/logo.png" alt="Start ERA Logo" className="w-12 h-12 rounded-full object-cover" />
            <span className={"text-lg font-black " + pageText}>Start ERA</span>
          </button>

          {/* Desktop nav links */}
          <div className={"hidden md:flex items-center gap-8 text-sm font-medium"}>
            <button onClick={() => scrollTo("features")} className={"hover:text-green-600 transition " + linkCls}>{L.featuresLabel === "ÖZELLİKLER" ? t.nav_features : L.featuresLabel === "FEATURES" ? "Features" : t.nav_features}</button>
            <button onClick={() => scrollTo("pricing")} className={"hover:text-green-600 transition " + linkCls}>{t.nav_pricing}</button>
            <button onClick={() => scrollTo("about")} className={"hover:text-green-600 transition " + linkCls}>{t.nav_about}</button>
            <button onClick={() => scrollTo("trending")} className={"hover:text-green-600 transition " + linkCls}>{L.browse}</button>
            <a href="/idea-generation" className={"hover:text-green-600 transition no-underline " + linkCls}>{L.ideaGen}</a>
            <a href="/planner" className={"hover:text-green-600 transition no-underline " + linkCls}>{L.businessPlan}</a>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <LanguageDropdown />

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
              <a href="/login" className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-sm transition no-underline shadow-sm">{L.getStarted}</a>
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
              <div className={"w-4 h-0.5 " + (d ? "bg-gray-400" : "bg-gray-700")} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className={"md:hidden px-6 pb-4 border-t pt-3 space-y-1 " + mobileMenuBg + " " + (d ? "border-gray-800" : "border-gray-100")}>
            <button onClick={() => scrollTo("features")} className={"block w-full text-left text-sm py-2 " + linkCls}>{t.nav_features}</button>
            <button onClick={() => scrollTo("pricing")} className={"block w-full text-left text-sm py-2 " + linkCls}>{t.nav_pricing}</button>
            <button onClick={() => scrollTo("about")} className={"block w-full text-left text-sm py-2 " + linkCls}>{t.nav_about}</button>
            <button onClick={() => scrollTo("trending")} className={"block w-full text-left text-sm py-2 " + linkCls}>{L.browse}</button>
            <a href="/idea-generation" className={"block w-full text-left text-sm py-2 no-underline " + linkCls}>{L.ideaGen}</a>
            <a href="/planner" className={"block w-full text-left text-sm py-2 no-underline " + linkCls}>{L.businessPlan}</a>
          </div>
        )}
      </nav>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <main id="main-content">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby="hero-heading" className="relative overflow-hidden" style={{ background: heroGradient }}>
          {/* Animated background orbs */}
          <div className="hero-orb w-[500px] h-[500px] top-[-200px] right-[-100px] animate-float" style={{ background: d ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.12)" }} />
          <div className="hero-orb w-[300px] h-[300px] bottom-[-100px] left-[-50px] animate-float-delayed" style={{ background: d ? "rgba(16, 185, 129, 0.06)" : "rgba(16, 185, 129, 0.08)" }} />
          <div className="hero-orb w-[200px] h-[200px] top-[30%] left-[60%] animate-pulse-soft" style={{ background: d ? "rgba(34, 197, 94, 0.05)" : "rgba(34, 197, 94, 0.1)" }} />

          <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
            {/* Badge */}
            <div className={"inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 shadow-sm border " + (d ? "bg-gray-900/80 border-gray-700 text-gray-300" : "bg-white/80 border-gray-200 text-gray-600")}>
              <Sparkles className="w-3.5 h-3.5 text-green-500" />
              {L.aiBadge}
            </div>

            {/* h1 */}
            <h1 id="hero-heading" className={"text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight " + pageText} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              {L.heroTitle}
            </h1>
            <p className={"text-lg mb-10 max-w-lg mx-auto leading-relaxed " + sub}>{L.heroSub}</p>

            {/* CTA Flow Cards */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-2">
              {/* Flow A — Find an Idea */}
              <a
                href="/idea-generation"
                className={"group rounded-2xl border p-6 text-left no-underline transition-all duration-300 hover:shadow-lg hover:-translate-y-1 " + (d ? "bg-gray-900/70 border-gray-800 hover:border-emerald-600" : "bg-white/70 border-gray-200 hover:border-emerald-400")}
              >
                <div className={"w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors " + (d ? "bg-emerald-950/60 text-emerald-400 group-hover:bg-emerald-900/80" : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100")}>
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className={"text-base font-black mb-1.5 group-hover:text-emerald-500 transition-colors " + pageText}>{L.flowATitle}</h3>
                <p className={"text-xs leading-relaxed mb-4 " + sub}>{L.flowADesc}</p>
                <span className={"inline-flex items-center gap-1 text-xs font-bold transition-colors " + (d ? "text-emerald-400" : "text-emerald-600")}>
                  {L.getStarted} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>

              {/* Flow B — Validate Existing Idea */}
              <a
                href="/planner"
                className={"group rounded-2xl border p-6 text-left no-underline transition-all duration-300 hover:shadow-lg hover:-translate-y-1 " + (d ? "bg-gray-900/70 border-gray-800 hover:border-sky-600" : "bg-white/70 border-gray-200 hover:border-sky-400")}
              >
                <div className={"w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors " + (d ? "bg-sky-950/60 text-sky-400 group-hover:bg-sky-900/80" : "bg-sky-50 text-sky-600 group-hover:bg-sky-100")}>
                  <Target className="w-5 h-5" />
                </div>
                <h3 className={"text-base font-black mb-1.5 group-hover:text-sky-500 transition-colors " + pageText}>{L.flowBTitle}</h3>
                <p className={"text-xs leading-relaxed mb-4 " + sub}>{L.flowBDesc}</p>
                <span className={"inline-flex items-center gap-1 text-xs font-bold transition-colors " + (d ? "text-sky-400" : "text-sky-600")}>
                  {L.getStarted} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>

            {/* Trust badge */}
            <div className={"mt-10 inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-xs font-medium " + (d ? "bg-gray-900/60 text-gray-400" : "bg-white/60 text-gray-500")}>
              <div className="flex -space-x-2">
                {["bg-green-500","bg-emerald-500","bg-teal-500","bg-cyan-500"].map((c,i) => (
                  <div key={i} className={"w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold text-white " + c + " " + (d ? "border-gray-950" : "border-[#faf9f6]")}>
                    {["A","E","M","K"][i]}
                  </div>
                ))}
              </div>
              <span>10,000+ {L.trustedBy}</span>
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ──────────────────────────────────────────────────────── */}
        <section className={"py-10 px-6 border-b " + (d ? "bg-gray-900/50 border-gray-800" : "bg-white/50 border-gray-100")}>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { ref: counter1.ref, display: counter1.display, label: lang === "tr" ? "Oluşturulan Plan" : lang === "ar" ? "خطة مُنشأة" : "Plans Created" },
              { ref: counter2.ref, display: counter2.display, label: lang === "tr" ? "Ortalama Süre" : lang === "ar" ? "متوسط الوقت" : "Avg Time" },
              { ref: counter3.ref, display: counter3.display, label: lang === "tr" ? "Dil Desteği" : lang === "ar" ? "لغات مدعومة" : "Languages" },
              { ref: counter4.ref, display: counter4.display, label: lang === "tr" ? "Ücretsiz" : lang === "ar" ? "مجاني" : "Free to Start" },
            ].map((item, i) => (
              <div key={i} ref={item.ref}>
                <div className={"text-2xl md:text-3xl font-black mb-1 " + (d ? "text-green-400" : "text-green-600")}>{item.display}</div>
                <div className={"text-xs font-medium " + sub}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ───────────────────────────────────────────────────────── */}
        <section id="features" aria-labelledby="features-heading" className={"py-24 px-6 " + pageBg}>
          <div className="max-w-6xl mx-auto">
            <div ref={addRevealRef} className="reveal text-center mb-16">
              <p className={" text-xs font-bold uppercase tracking-[0.2em] mb-4 " + sub}>{L.featuresLabel}</p>
              <h2 id="features-heading" className={"text-4xl md:text-5xl font-black mb-4 max-w-3xl mx-auto leading-tight " + pageText} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                {L.featuresTitle}
              </h2>
              <p className={"max-w-xl mx-auto " + sub}>{L.featuresSub}</p>
            </div>
            <div ref={addRevealRef} className="reveal reveal-stagger grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <div key={i} className={"reveal rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 " + cardBg}>
                  <div className={"w-12 h-12 rounded-xl flex items-center justify-center mb-4 " + f.bg}>
                    <f.icon className={"w-6 h-6 " + f.color} />
                  </div>
                  <h3 className={"text-lg font-bold mb-2 " + pageText}>{f.title}</h3>
                  <p className={"text-sm leading-relaxed " + sub}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMMUNITY SECTION ─────────────────────────────────────────────── */}
        <section aria-labelledby="community-heading" className={"relative py-24 px-6 overflow-hidden " + sectionBg}>
          {d && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-green-900/20 blur-[100px] rounded-full pointer-events-none"></div>}
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div ref={addRevealRef} className="reveal">
              <p className={"text-xs font-bold uppercase tracking-[0.2em] mb-16 " + sub}>{L.builtOn}</p>
            </div>
            <div ref={addRevealRef} className="reveal grid md:grid-cols-2 gap-16 items-start mb-16">
              <h2 id="community-heading" className={"text-4xl md:text-5xl font-black leading-tight " + pageText} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                <span>{L.communityTitle.split(".")[0]}.</span>
                {L.communityTitle.includes(".") && <span className={sub}> {L.communityTitle.split(".").slice(1).join(".").trim()}</span>}
              </h2>
              <p className={"text-lg leading-relaxed " + sub}>{L.communitySub}</p>
            </div>
            <div ref={addRevealRef} className="reveal reveal-stagger grid md:grid-cols-3 gap-5">
              {MOCKUP_STARTUPS.map((s, i) => (
                <article key={i} className={"reveal rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 " + (d ? "border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10" : "border-gray-200 bg-white hover:border-green-300 shadow-sm hover:shadow-md")}>
                  <div className={(d ? s.colorDark : s.colorLight) + " h-32 flex items-center justify-center relative"}>
                    {d && <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>}
                    <span className={"font-black text-2xl drop-shadow-sm relative z-10 " + (d ? "text-white" : "text-gray-800")}>{s.name}</span>
                  </div>
                  <div className={"p-4 border-t " + (d ? "border-white/5" : "border-gray-100")}>
                    <div className={"inline-block px-2.5 py-1 rounded-full text-xs font-medium " + (d ? "bg-white/10 text-gray-200" : "bg-gray-100 text-gray-700")}>{s.tag}</div>
                    <p className={"text-xs mt-2 " + (d ? "text-gray-400" : "text-gray-500")}>{L.builtWith}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <section aria-labelledby="how-heading" className={"py-24 px-6 " + pageBg}>
          <div className="max-w-6xl mx-auto">
            <div ref={addRevealRef} className="reveal text-center mb-16">
              <p className={"text-xs font-bold uppercase tracking-[0.2em] mb-4 " + sub}>{L.howLabel}</p>
              <h2 id="how-heading" className={"text-4xl md:text-5xl font-black leading-tight max-w-3xl mx-auto " + pageText} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                {lang === "tr" ? "Üç adımda fikirden gerçeğe." : lang === "ar" ? "من الفكرة إلى الواقع في ثلاث خطوات." : "From idea to reality in three steps."}
              </h2>
            </div>
            <div className="max-w-3xl mx-auto relative">
              {/* Vertical timeline line */}
              <div className={"absolute top-0 bottom-0 w-px hidden md:block " + (isRTL ? "right-[39px]" : "left-[39px]") + " " + (d ? "bg-gray-800" : "bg-gray-200")} />

              <div className="space-y-8">
                {STEPS.map((s, i) => (
                  <div key={i} ref={addRevealRef} className={"reveal flex gap-6 items-start group"}>
                    {/* Step number circle */}
                    <div className={"flex-shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 " + (i === 0 ? "bg-green-600 text-white shadow-lg shadow-green-600/20" : d ? "bg-gray-800 text-gray-400 group-hover:bg-gray-700" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200")}>
                      <s.icon className="w-5 h-5 mb-0.5" />
                      <span className="text-xs font-black">{s.num}</span>
                    </div>
                    {/* Step content */}
                    <div className={"flex-1 rounded-2xl border p-6 transition-all duration-300 group-hover:-translate-y-0.5 " + (i === 0 ? (d ? "bg-green-950/40 border-green-900/50" : "bg-green-50/80 border-green-200") : cardBg)}>
                      <h3 className={"text-lg font-bold mb-2 " + pageText}>{s.title}</h3>
                      <p className={"text-sm leading-relaxed " + sub}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TRENDING ──────────────────────────────────────────────────────── */}
        <section id="trending" aria-labelledby="trending-heading" className={"py-24 px-6 " + sectionBg}>
          <div className="max-w-6xl mx-auto">
            <div ref={addRevealRef} className="reveal">
              <p className={"text-xs font-bold uppercase tracking-[0.2em] mb-8 " + sub}>{L.trendingLabel}</p>
              <h2 id="trending-heading" className={"text-4xl md:text-5xl font-black mb-16 max-w-3xl leading-tight " + pageText} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                {L.trendingTitle}
              </h2>
            </div>
            <div ref={addRevealRef} className="reveal reveal-stagger grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TRENDING.map((item, i) => (
                <button
                  key={i}
                  onClick={() => { setIdea(item.idea); document.getElementById("idea-input")?.scrollIntoView({ behavior: "smooth", block: "center" }); (document.getElementById("idea-input") as HTMLTextAreaElement | null)?.focus(); }}
                  className={"reveal rounded-2xl border p-6 text-left hover:shadow-md transition-all duration-300 group w-full hover:-translate-y-1 " + trendCardBg}
                  aria-label={`${L.tryIdea}: ${item.idea}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={"inline-block px-2.5 py-1 rounded-full text-xs font-bold border " + (d ? "bg-green-950 text-green-400 border-green-900" : "bg-green-50 text-green-700 border-green-100")}>{item.tag}</span>
                    <div className="flex items-center gap-1" aria-label={`Score: ${item.score}`}>
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
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

        {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
        <section aria-labelledby="testimonials-heading" className={"py-24 px-6 " + pageBg}>
          <div className="max-w-6xl mx-auto">
            <div ref={addRevealRef} className="reveal text-center mb-16">
              <p className={"text-xs font-bold uppercase tracking-[0.2em] mb-4 " + sub}>{L.testimonialsLabel}</p>
              <h2 id="testimonials-heading" className={"text-4xl md:text-5xl font-black leading-tight " + pageText} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                {L.testimonialsTitle}
              </h2>
            </div>
            <div ref={addRevealRef} className="reveal reveal-stagger grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((tm, i) => (
                <div key={i} className={"reveal relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 quote-icon " + cardBg}>
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: tm.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className={"text-sm leading-relaxed mb-6 " + pageText}>"{tm.quote}"</p>
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className={"w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white " + ["bg-green-600","bg-emerald-600","bg-teal-600"][i]}>
                      {tm.name.charAt(0)}
                    </div>
                    <div>
                      <div className={"text-sm font-bold " + pageText}>{tm.name}</div>
                      <div className={"text-xs " + sub}>{tm.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────────────────────────────── */}
        <section id="pricing" aria-labelledby="pricing-heading" className={"py-24 px-6 " + sectionBg}>
          <div className="max-w-6xl mx-auto">
            <div ref={addRevealRef} className="reveal text-center mb-16">
              <p className={"text-xs font-bold uppercase tracking-[0.2em] mb-4 " + sub}>{lang === "tr" ? "FİYATLANDIRMA" : lang === "ar" ? "الأسعار" : "PRICING"}</p>
              <h2 id="pricing-heading" className={"text-4xl md:text-5xl font-black mb-4 " + pageText} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.price_title}</h2>
              <p className={sub}>{L.pricingSub}</p>
            </div>
            <div ref={addRevealRef} className="reveal reveal-stagger grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Free plan */}
              <div className={"reveal rounded-2xl border-2 border-green-500 p-8 relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10 " + (d ? "bg-gray-900" : "bg-white")}>
                <div className="absolute -top-3 left-6 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">{t.popular}</div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">{t.p_free_t}</p>
                <p className={"text-5xl font-black mb-1 " + pageText}>{t.p_free_p}</p>
                <p className={"text-sm mb-6 " + sub}>{t.p_free_d}</p>
                <ul className="space-y-3 mb-8">
                  {freeItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckIcon />
                      </div>
                      <span className={"text-sm " + pageText}>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href={user ? "/dashboard" : "/login"} className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-center transition text-sm no-underline block shadow-lg shadow-green-600/20">{t.start_free}</a>
              </div>
              {/* Pro plan (coming soon) */}
              <div className={"reveal rounded-2xl border p-8 relative opacity-75 transition-all duration-300 hover:-translate-y-1 " + (d ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200")}>
                <div className={"absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full animate-pulse " + (d ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-700")}>{t.coming_soon}</div>
                <p className="text-xs font-bold uppercase tracking-widest text-purple-500 mb-2">{t.p_pro_t}</p>
                <p className={"text-5xl font-black mb-1 " + sub}>{t.p_pro_p}</p>
                <p className={"text-sm mb-6 " + sub}>{t.p_pro_d}</p>
                <ul className="space-y-3 mb-8">
                  {proItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className={"w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 " + (d ? "bg-purple-900/50" : "bg-purple-50")}>
                        <svg aria-hidden="true" className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      </div>
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
        <section id="about" aria-labelledby="about-heading" className={"py-24 px-6 " + pageBg}>
          <div className="max-w-6xl mx-auto">
            <div ref={addRevealRef} className="reveal">
              <p className={"text-xs font-bold uppercase tracking-[0.2em] mb-8 " + sub}>{lang === "tr" ? "HAKKIMIZDA" : lang === "ar" ? "من نحن" : "ABOUT"}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div ref={addRevealRef} className="reveal-left">
                <h2 id="about-heading" className={"text-4xl md:text-5xl font-black mb-6 leading-tight " + pageText} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.about_title}</h2>
                <p className={"text-lg leading-relaxed mb-6 " + sub}>{t.about_text}</p>
                <a href={user ? "/dashboard" : "/login"} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-sm transition no-underline shadow-lg shadow-green-600/20">
                  {L.getStarted} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div ref={addRevealRef} className="reveal-right grid grid-cols-2 gap-4">
                {[
                  { num: "10K+", label: lang === "tr" ? "Oluşturulan Plan" : lang === "ar" ? "خطة مُنشأة" : "Plans Created" },
                  { num: "60s", label: lang === "tr" ? "Ortalama Süre" : lang === "ar" ? "متوسط الوقت" : "Avg Time" },
                  { num: "3", label: lang === "tr" ? "Dil" : lang === "ar" ? "لغات" : "Languages" },
                  { num: "100%", label: lang === "tr" ? "Ücretsiz" : lang === "ar" ? "مجاني" : "Free to Start" },
                ].map((s, i) => (
                  <div key={i} className={"p-6 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 " + (d ? "bg-gray-900 border-gray-800 hover:border-gray-700" : "bg-white border-gray-200 shadow-sm hover:shadow-md")}>
                    <div className={"text-3xl font-black mb-1 " + (d ? "text-green-400" : "text-green-600")}>{s.num}</div>
                    <div className={"text-xs font-medium " + sub}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ───────────────────────────────────────────────────────── */}
        <section id="contact" aria-labelledby="contact-heading" className={"py-24 px-6 relative overflow-hidden " + sectionBg}>
          {/* Subtle background gradient and glowing orbs */}
          <div className={"absolute inset-0 pointer-events-none " + (d ? "bg-gradient-to-b from-transparent via-green-900/10 to-[#0a0a0a]" : "bg-gradient-to-b from-transparent via-green-50/50 to-transparent")} />
          {d && (
            <>
              <div className="absolute top-10 right-10 w-64 h-64 bg-green-900/20 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-emerald-900/20 blur-[100px] rounded-full pointer-events-none"></div>
            </>
          )}

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <div ref={addRevealRef} className="reveal">
              <p className={"text-xs font-bold uppercase tracking-[0.2em] mb-6 " + sub}>{lang === "tr" ? "İLETİŞİM" : lang === "ar" ? "التواصل" : "CONTACT"}</p>
              <h2 id="contact-heading" className={"text-4xl font-black mb-3 " + pageText} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.contact_title}</h2>
              <p className={"mb-10 " + sub}>{L.contactSub}</p>
            </div>
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
                className={"w-full py-3.5 font-bold rounded-full text-sm transition shadow-lg " + (contactLoading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-green-600 hover:bg-green-700 text-white shadow-green-600/20")}
              >
                {contactLoading ? (lang === "tr" ? "Gönderiliyor..." : lang === "ar" ? "جارٍ الإرسال..." : "Sending...") : t.form_btn}
              </button>
            </form>
          </div>
        </section>

      </main>{/* /main */}

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className={"relative overflow-hidden " + (d ? "bg-[#0a0a0a] border-t border-white/5" : "bg-gray-900 border-t border-gray-800")}>
        {/* Glowing top border */}
        {d && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>}
        {/* Subtle background glow for footer */}
        {d && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-green-900/10 blur-[80px] rounded-full pointer-events-none"></div>}
        <div className="max-w-6xl mx-auto py-12 px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.png" alt="Start ERA Logo" className="w-10 h-10 rounded-full object-cover" />
                <span className="text-white font-black">Start ERA</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">{t.about_text}</p>
            </div>
            <div className="flex gap-12">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{L.product}</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><button onClick={() => scrollTo("features")} className="hover:text-white transition">{t.nav_features}</button></li>
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
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800 text-xs text-gray-500">
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