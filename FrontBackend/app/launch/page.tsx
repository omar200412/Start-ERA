"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useThemeAuth } from "../context/ThemeAuthContext";
import {
  Sun, Moon, ArrowLeft, Send, Rocket,
  CheckCircle2, Circle, Bot, User, Loader2, AlertTriangle,
  Sparkles, Shield, Code, BarChart3,
} from "lucide-react";

// ── Translations ───────────────────────────────────────────────────────────────
const T: Record<string, Record<string, string>> = {
  tr: {
    badge: "Lansman Sistemi", title: "Lansman Kontrol Merkezi",
    subtitle: "Girişiminizi adım adım hayata geçirin.", back: "Geri",
    noData: "Oturum verisi bulunamadı",
    noDataDesc: "Lütfen önce fikir üretimi ve doğrulama adımlarını tamamlayın.",
    goBack: "Fikir Üreticiye Dön",
    phase1: "Kurulum & Hukuki", phase1Desc: "Şirket kuruluşu, izinler, banka hesabı",
    phase2: "MVP & Ön Lansman", phase2Desc: "MVP geliştirme, beta test, ilk pazarlama",
    phase3: "Pazara Giriş", phase3Desc: "Lansman stratejisi, fiyatlama, müşteri kazanımı",
    step1_1: "Şirket türünü belirle", step1_2: "Ticari sicil kaydı", step1_3: "Banka hesabı aç",
    step2_1: "MVP'yi oluştur", step2_2: "Beta kullanıcı bul", step2_3: "Geri bildirim topla",
    step3_1: "Lansman planı hazırla", step3_2: "Fiyatlandırmayı belirle", step3_3: "İlk müşterileri kazan",
    mentorTitle: "Yapay Zeka Mentörü", mentorSubtitle: "Kişiselleştirilmiş rehberlik",
    placeholder: "Mentörünüze soru sorun...",
    welcome: "Merhaba! Ben Start Era AI Mentörünüzüm. Girişiminizi başlatmak için size özel rehberlik sağlamak için buradayım. Ne ile başlamak istersiniz?",
    thinking: "Düşünüyor...", online: "Çevrimiçi", phase: "AŞAMA",
  },
  en: {
    badge: "Launch System", title: "Launch Control Center",
    subtitle: "Bring your startup to life, step by step.", back: "Back",
    noData: "No session data found",
    noDataDesc: "Please complete the idea generation and validation steps first.",
    goBack: "Back to Idea Generator",
    phase1: "Setup & Legal", phase1Desc: "Entity formation, permits, banking",
    phase2: "MVP & Pre-launch", phase2Desc: "Build MVP, beta testing, initial marketing",
    phase3: "Go-to-Market", phase3Desc: "Launch strategy, pricing, customer acquisition",
    step1_1: "Choose entity type", step1_2: "Register your business", step1_3: "Open a bank account",
    step2_1: "Build your MVP", step2_2: "Find beta users", step2_3: "Collect feedback",
    step3_1: "Create launch plan", step3_2: "Set pricing strategy", step3_3: "Acquire first customers",
    mentorTitle: "AI Mentor", mentorSubtitle: "Personalized guidance",
    placeholder: "Ask your mentor anything...",
    welcome: "Hello! I'm your Start Era AI Mentor. I'm here to provide personalized guidance to help you launch your startup. What would you like to start with?",
    thinking: "Thinking...", online: "Online", phase: "PHASE",
  },
  ar: {
    badge: "نظام الإطلاق", title: "مركز التحكم بالإطلاق",
    subtitle: "أطلق شركتك الناشئة خطوة بخطوة.", back: "عودة",
    noData: "لم يتم العثور على بيانات الجلسة",
    noDataDesc: "يرجى إكمال خطوات توليد الأفكار والتحقق أولاً.",
    goBack: "العودة إلى مولّد الأفكار",
    phase1: "الإعداد والقانون", phase1Desc: "تأسيس الشركة، التصاريح، الحساب البنكي",
    phase2: "MVP والإطلاق التجريبي", phase2Desc: "بناء MVP، اختبار تجريبي، تسويق أولي",
    phase3: "دخول السوق", phase3Desc: "استراتيجية الإطلاق، التسعير، اكتساب العملاء",
    step1_1: "اختر نوع الكيان", step1_2: "سجّل شركتك", step1_3: "افتح حساب بنكي",
    step2_1: "ابنِ MVP", step2_2: "ابحث عن مستخدمين تجريبيين", step2_3: "اجمع الملاحظات",
    step3_1: "أنشئ خطة الإطلاق", step3_2: "حدد استراتيجية التسعير", step3_3: "اكتسب أول العملاء",
    mentorTitle: "المرشد الذكي", mentorSubtitle: "إرشاد مخصص",
    placeholder: "اسأل مرشدك أي شيء...",
    welcome: "مرحباً! أنا مرشد Start Era الذكي. أنا هنا لتقديم إرشاد مخصص لمساعدتك في إطلاق شركتك الناشئة. بماذا تود أن تبدأ؟",
    thinking: "يفكر...", online: "متصل", phase: "المرحلة",
  },
};

// ── Helper: extract text from UIMessage ────────────────────────────────────────
function getMessageText(msg: UIMessage): string {
  if (!msg.parts) return "";
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function LaunchPage() {
  const router = useRouter();
  const { darkMode, toggleTheme, lang, setLang } = useThemeAuth();
  const d = darkMode;
  const isRTL = lang === "ar";
  const t = T[lang] || T.en;

  const [hasData, setHasData] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [startup, setStartup] = useState<any>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Load session data ──────────────────────────────────────────────────────
  useEffect(() => {
    const rawInput = sessionStorage.getItem("idea_generation_input");
    const rawIdea = sessionStorage.getItem("selected_idea_for_validation");
    if (!rawInput && !rawIdea) { setHasData(false); return; }
    try {
      if (rawInput) setUserProfile(JSON.parse(rawInput));
      if (rawIdea) setStartup(JSON.parse(rawIdea));
    } catch { setHasData(false); }
  }, []);

  // ── useChat (AI SDK v6) ────────────────────────────────────────────────────
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/mentor-chat",
      body: {
        context: {
          userProfile: userProfile || {},
          startup: startup || {},
          language: lang,
        },
      },
    }),
    messages: [
      {
        id: "welcome",
        role: "assistant" as const,
        parts: [{ type: "text" as const, text: t.welcome }],
      },
    ],
  });

  const isLoading = status === "streaming" || status === "submitted";

  // ── Auto-scroll chat ──────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── Handle send ───────────────────────────────────────────────────────────
  function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInputValue("");
  }

  // ── Toggle step ───────────────────────────────────────────────────────────
  function toggleStep(id: string) {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function getLangLabel() { return lang === "tr" ? "EN" : lang === "en" ? "AR" : "TR"; }
  function toggleLang() { setLang(lang === "tr" ? "en" : lang === "en" ? "ar" : "tr"); }

  // ── Tokens ────────────────────────────────────────────────────────────────
  const pageBg = d ? "bg-gray-950" : "bg-gray-50";
  const cardBg = d ? "bg-gray-900/80 border-gray-800 backdrop-blur-xl" : "bg-white/80 border-gray-200 backdrop-blur-xl";
  const textP = d ? "text-gray-100" : "text-gray-900";
  const textS = d ? "text-gray-400" : "text-gray-500";
  const navBg = d ? "bg-gray-950/95 border-gray-800" : "bg-white/95 border-gray-100";

  // ── Phases ────────────────────────────────────────────────────────────────
  const phases = [
    { id: "p1", icon: Shield, title: t.phase1, desc: t.phase1Desc,
      color: d ? "text-sky-400" : "text-sky-600", bg: d ? "bg-sky-950/60" : "bg-sky-50",
      border: d ? "border-sky-800" : "border-sky-200",
      line: d ? "from-sky-600 to-violet-600" : "from-sky-400 to-violet-400",
      steps: [{ id: "s1_1", l: t.step1_1 }, { id: "s1_2", l: t.step1_2 }, { id: "s1_3", l: t.step1_3 }] },
    { id: "p2", icon: Code, title: t.phase2, desc: t.phase2Desc,
      color: d ? "text-violet-400" : "text-violet-600", bg: d ? "bg-violet-950/60" : "bg-violet-50",
      border: d ? "border-violet-800" : "border-violet-200",
      line: d ? "from-violet-600 to-emerald-600" : "from-violet-400 to-emerald-400",
      steps: [{ id: "s2_1", l: t.step2_1 }, { id: "s2_2", l: t.step2_2 }, { id: "s2_3", l: t.step2_3 }] },
    { id: "p3", icon: BarChart3, title: t.phase3, desc: t.phase3Desc,
      color: d ? "text-emerald-400" : "text-emerald-600", bg: d ? "bg-emerald-950/60" : "bg-emerald-50",
      border: d ? "border-emerald-800" : "border-emerald-200", line: "",
      steps: [{ id: "s3_1", l: t.step3_1 }, { id: "s3_2", l: t.step3_2 }, { id: "s3_3", l: t.step3_3 }] },
  ];

  // ── No data ───────────────────────────────────────────────────────────────
  if (!hasData) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen ${pageBg} flex items-center justify-center px-6`}>
        <div className={`max-w-md w-full p-10 rounded-3xl border text-center ${cardBg}`}>
          <div className={`mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center ${d ? "bg-amber-950/50" : "bg-amber-50"}`}>
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className={`text-xl font-black mb-2 ${textP}`}>{t.noData}</h2>
          <p className={`text-sm mb-6 ${textS}`}>{t.noDataDesc}</p>
          <button onClick={() => router.push("/idea-generation")} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-all">{t.goBack}</button>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen ${pageBg} transition-colors duration-300`}>
      {/* Navbar */}
      <nav className={`sticky top-0 z-40 border-b backdrop-blur-md ${navBg}`}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 no-underline">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
            <span className={`text-base font-black ${textP}`}>Start ERA</span>
          </a>
          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition ${d ? "border-gray-700 text-gray-300 hover:border-green-600" : "border-gray-200 text-gray-600 hover:border-green-500"}`}>{getLangLabel()}</button>
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition flex items-center border ${d ? "border-gray-700 text-yellow-400 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
              {d ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => router.push("/dashboard")} className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs border transition ${d ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
              <ArrowLeft className="w-3.5 h-3.5" />{t.back}
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4 text-center" style={{ animation: "fadeSlideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards" }}>
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border ${d ? "bg-emerald-950/40 border-emerald-900 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}>
          <Rocket className="w-3.5 h-3.5" />{t.badge}
        </div>
        <h1 className={`text-2xl md:text-3xl font-black mb-1 tracking-tight ${textP}`} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.title}</h1>
        <p className={`text-sm max-w-lg mx-auto ${textS}`}>{t.subtitle}</p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left: Blueprint */}
          <div className="lg:col-span-2 space-y-0" style={{ animation: "fadeSlideIn 0.45s cubic-bezier(0.16,1,0.3,1) forwards" }}>
            {phases.map((ph, pi) => {
              const Icon = ph.icon;
              const done = ph.steps.filter((s) => completedSteps.has(s.id)).length;
              const all = done === ph.steps.length;
              return (
                <div key={ph.id} className="relative">
                  {pi < phases.length - 1 && (
                    <div className={`absolute ${isRTL ? "right-6" : "left-6"} top-[4.5rem] w-0.5 bg-gradient-to-b ${ph.line} opacity-30`} style={{ height: "calc(100% - 1rem)" }} />
                  )}
                  <div className={`rounded-2xl border p-5 mb-4 ${cardBg} transition-all duration-300 hover:shadow-lg ${d ? "hover:shadow-emerald-500/5" : "hover:shadow-emerald-500/10"}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${ph.bg} ${ph.border}`}>
                        {all ? <CheckCircle2 className={`w-6 h-6 ${ph.color}`} /> : <Icon className={`w-6 h-6 ${ph.color}`} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${ph.color}`}>{t.phase} {pi + 1}</span>
                          {all && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d ? "bg-emerald-950/60 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>✓</span>}
                        </div>
                        <h3 className={`text-sm font-black ${textP}`}>{ph.title}</h3>
                        <p className={`text-xs ${textS}`}>{ph.desc}</p>
                      </div>
                      <span className={`text-xs font-bold ${ph.color}`}>{done}/{ph.steps.length}</span>
                    </div>
                    <div className="space-y-1.5">
                      {ph.steps.map((s) => {
                        const ok = completedSteps.has(s.id);
                        return (
                          <button key={s.id} onClick={() => toggleStep(s.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${ok ? (d ? "bg-emerald-950/30" : "bg-emerald-50/80") : (d ? "hover:bg-gray-800/60" : "hover:bg-gray-50")}`}>
                            {ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <Circle className={`w-4 h-4 flex-shrink-0 ${d ? "text-gray-600 group-hover:text-gray-400" : "text-gray-300 group-hover:text-gray-500"}`} />}
                            <span className={`text-xs font-medium transition ${ok ? (d ? "text-emerald-400 line-through opacity-70" : "text-emerald-700 line-through opacity-70") : textP}`}>{s.l}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className={`w-full h-1 rounded-full overflow-hidden mt-4 ${d ? "bg-gray-800" : "bg-gray-200"}`}>
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 ease-out" style={{ width: `${(done / ph.steps.length) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Chat */}
          <div className="lg:col-span-3" style={{ animation: "fadeSlideIn 0.55s cubic-bezier(0.16,1,0.3,1) forwards" }}>
            <div className={`rounded-2xl border overflow-hidden flex flex-col ${cardBg}`} style={{ height: "calc(100vh - 14rem)", minHeight: 500 }}>
              {/* Header */}
              <div className={`px-5 py-4 border-b flex items-center gap-3 ${d ? "border-gray-800" : "border-gray-200"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d ? "bg-emerald-950/60" : "bg-emerald-50"}`}>
                  <Sparkles className={`w-5 h-5 ${d ? "text-emerald-400" : "text-emerald-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`text-sm font-black ${textP}`}>{t.mentorTitle}</h2>
                  <p className={`text-xs ${textS}`}>{t.mentorSubtitle}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className={`text-[10px] font-bold ${d ? "text-emerald-400" : "text-emerald-600"}`}>{t.online}</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((msg: UIMessage) => {
                  const isUser = msg.role === "user";
                  const text = getMessageText(msg);
                  if (!text) return null;
                  return (
                    <div key={msg.id} className={`flex ${isUser ? (isRTL ? "justify-start" : "justify-end") : (isRTL ? "justify-end" : "justify-start")} gap-2.5`}>
                      {!isUser && (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${d ? "bg-emerald-950/60" : "bg-emerald-50"}`}>
                          <Bot className={`w-4 h-4 ${d ? "text-emerald-400" : "text-emerald-600"}`} />
                        </div>
                      )}
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser ? "bg-emerald-600 text-white rounded-br-md"
                          : d ? "bg-gray-800/80 text-gray-200 border border-gray-700/50 rounded-bl-md"
                            : "bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-md"
                      }`}>{text}</div>
                      {isUser && (
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
                {isLoading && (
                  <div className={`flex ${isRTL ? "justify-end" : "justify-start"} gap-2.5`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${d ? "bg-emerald-950/60" : "bg-emerald-50"}`}>
                      <Bot className={`w-4 h-4 ${d ? "text-emerald-400" : "text-emerald-600"}`} />
                    </div>
                    <div className={`px-4 py-3 rounded-2xl rounded-bl-md text-sm border ${d ? "bg-gray-800/80 border-gray-700/50" : "bg-gray-100 border-gray-200"}`}>
                      <div className="flex items-center gap-2">
                        <Loader2 className={`w-3.5 h-3.5 animate-spin ${d ? "text-emerald-400" : "text-emerald-600"}`} />
                        <span className={`text-xs font-medium ${textS}`}>{t.thinking}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className={`p-4 border-t ${d ? "border-gray-800" : "border-gray-200"}`}>
                <div className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all focus-within:ring-2 focus-within:ring-emerald-500/40 ${d ? "bg-gray-800/60 border-gray-700" : "bg-white border-gray-200"}`}>
                  <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={t.placeholder}
                    className={`flex-1 bg-transparent text-sm py-2 outline-none placeholder:text-gray-400 ${textP}`} disabled={isLoading} />
                  <button type="submit" disabled={isLoading || !inputValue.trim()}
                    className={`p-2 rounded-lg transition-all ${inputValue.trim() && !isLoading ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20" : (d ? "bg-gray-700 text-gray-500" : "bg-gray-100 text-gray-400")} disabled:cursor-not-allowed`}>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeSlideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
