"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useThemeAuth } from "../context/ThemeAuthContext";
import { TRANSLATIONS } from "../lib/translations";

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

function SparkleIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function LoadingOverlay({ status, darkMode }: { status: string; darkMode: boolean }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl rounded-2xl">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🤖</div>
      </div>
      <p className="text-lg font-black text-blue-600 mb-3">Start ERA AI</p>
      <p className={"text-sm text-center max-w-xs px-4 " + (darkMode ? "text-gray-400" : "text-gray-600")}>{status}</p>
      <div className={"w-48 h-1 rounded-full overflow-hidden mt-4 " + (darkMode ? "bg-gray-800" : "bg-gray-200")}>
        <div className="h-full bg-blue-600 animate-pulse w-full" />
      </div>
    </div>
  );
}

export default function PlannerPage() {
  const { user, darkMode, toggleTheme, lang, setLang } = useThemeAuth();
  const t = TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [planResult, setPlanResult] = useState<{ title: string; content: string }[] | null>(null);
  const [formData, setFormData] = useState({ idea: "", capital: "", skills: "", strategy: "", management: "", language: lang });

  useEffect(() => { setFormData(prev => ({ ...prev, language: lang })); }, [lang]);

  useEffect(() => {
    const saved = sessionStorage.getItem("planner_form");
    if (saved) { try { setFormData(prev => ({ ...prev, ...JSON.parse(saved) })); } catch {} }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("planner_form", JSON.stringify(formData));
  }, [formData]);

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

  const currentQuestion = t.questions[step - 1];

  function handleNext() {
    const val = formData[currentQuestion.key as keyof typeof formData];
    if (!val?.trim()) { toast.error(t.err_empty); return; }
    if (step < 5) setStep(step + 1);
    else generatePlan();
  }

  async function generatePlan() {
    setLoading(true);
    setLoadingStatus(t.status_gathering);
    try {
      setTimeout(() => setLoadingStatus(t.status_generating), 1500);
      const res = await fetch("/api/generate_plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, language: lang }),
      });
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      let finalPlan: { title: string; content: string }[] = [];
      try { finalPlan = JSON.parse(data.plan); }
      catch { finalPlan = [{ title: "Plan", content: data.plan }]; }
      setPlanResult(finalPlan);
      const newProject = {
        id: Date.now(),
        title: formData.idea.substring(0, 35) + (formData.idea.length > 35 ? "..." : ""),
        status: lang === "tr" ? "Tamamlandı" : lang === "ar" ? "مكتمل" : "Completed",
        date: new Date().toLocaleDateString(),
        planData: finalPlan,
      };
      const existing = JSON.parse(localStorage.getItem("user_projects") || "[]");
      localStorage.setItem("user_projects", JSON.stringify([newProject, ...existing]));
      const token = localStorage.getItem("token");
      if (token) {
        fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify({ title: newProject.title, status: newProject.status, planData: finalPlan }),
        }).catch(console.error);
      }
      sessionStorage.removeItem("planner_form");
      toast.success(t.toast_success);
    } catch {
      toast.error(lang === "tr" ? "Hata oluştu. Lütfen tekrar deneyin." : lang === "ar" ? "حدث خطأ. حاول مرة أخرى." : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPDF() {
    if (!planResult) return;
    const tid = toast.loading(t.toast_pdf_preparing);
    try {
      const res = await fetch("/api/create_pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_data: planResult }),
      });
      if (!res.ok) throw new Error("PDF error");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "StartERA_Plan.pdf";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      toast.dismiss(tid);
      toast.success(t.toast_pdf_success);
    } catch {
      toast.dismiss(tid);
      toast.error(lang === "tr" ? "PDF oluşturulamadı." : lang === "ar" ? "فشل إنشاء PDF." : "PDF generation failed.");
    }
  }

  const isDark = darkMode;
  const bg = isDark ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900";
  const navBg = isDark ? "bg-gray-950/95 border-gray-800" : "bg-white/95 border-gray-200";
  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const subtext = isDark ? "text-gray-400" : "text-gray-600";
  const border = isDark ? "border-gray-800" : "border-gray-200";
  const textareaBg = isDark ? "bg-gray-800 text-gray-100 placeholder-gray-500 focus:bg-gray-900" : "bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white";
  const sectionBg = isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-100";
  const progressBg = isDark ? "bg-gray-800" : "bg-gray-200";
  const lightModeLabel = lang === "tr" ? "Aydınlık" : lang === "ar" ? "فاتح" : "Light";
  const darkModeLabel = lang === "tr" ? "Karanlık" : lang === "ar" ? "داكن" : "Dark";

  if (!user) {
    return (
      <div className={"flex h-screen items-center justify-center " + bg}>
        <div className="text-center">
          <p className={"opacity-50 font-bold mb-4 " + subtext}>
            {lang === "tr" ? "Lütfen giriş yapın." : lang === "ar" ? "يرجى تسجيل الدخول." : "Please sign in."}
          </p>
          <a href="/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-sm transition no-underline">{t.login}</a>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={"min-h-screen font-sans transition-colors duration-300 " + bg}>

      {/* Navbar */}
      <nav className={"sticky top-0 z-40 border-b backdrop-blur-md " + navBg}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">S</div>
              <span className={"text-lg font-black " + (isDark ? "text-gray-100" : "text-gray-900")}>Start <span className="text-blue-600">ERA</span></span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleLang} className={"text-sm font-bold px-2.5 py-1.5 rounded-lg border transition " + (isDark ? "border-gray-700 text-gray-300 hover:border-blue-500" : "border-gray-300 text-gray-600 hover:border-blue-600")}>{getLangLabel()}</button>
              <button onClick={toggleTheme} className={"p-2.5 rounded-lg border transition " + (isDark ? "border-gray-700 text-yellow-400 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100")} title={isDark ? lightModeLabel : darkModeLabel}>
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>
              <a href="/dashboard" className={"px-4 py-2 rounded-full font-bold text-sm border no-underline transition " + (isDark ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50")}>{t.nav_back}</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto min-h-[calc(100vh-64px)]">

        {planResult ? (
          /* Results */
          <div className={"w-full p-8 md:p-10 rounded-2xl border " + cardBg}>
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-4xl mb-5">🎉</div>
              <h2 className={"text-2xl md:text-3xl font-black mb-3 " + (isDark ? "text-gray-100" : "text-gray-900")}>{t.success_title}</h2>
              <p className={subtext}>{t.success_desc}</p>
            </div>

            <div className="space-y-4 mb-8">
              {planResult.map((section, idx) => (
                <div key={idx} className={"p-6 rounded-xl border " + sectionBg}>
                  <h3 className="text-base font-bold mb-3 text-blue-600 border-b border-blue-500/20 pb-2">{section.title}</h3>
                  <p className={"leading-relaxed whitespace-pre-wrap text-sm " + subtext}>{section.content}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={downloadPDF} className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-sm transition flex items-center justify-center gap-2">
                <DownloadIcon />
                {t.download_pdf}
              </button>
              <button
                onClick={() => { setPlanResult(null); setStep(1); setFormData(prev => ({ ...prev, idea: "", capital: "", skills: "", strategy: "", management: "" })); }}
                className={"px-7 py-3.5 font-bold rounded-full text-sm border transition " + (isDark ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50")}
              >
                {t.new_plan}
              </button>
            </div>
          </div>

        ) : (
          /* Wizard */
          <div className="relative w-full">
            {loading && <LoadingOverlay status={loadingStatus} darkMode={isDark} />}

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{t.step_progress}</span>
                <span className={"text-xs font-bold " + subtext}>{t.step} {step} / 5</span>
              </div>
              <div className={"w-full rounded-full h-2 overflow-hidden " + progressBg}>
                <div className="bg-blue-600 h-full transition-all duration-500 ease-out rounded-full" style={{ width: (step / 5 * 100) + "%" }} />
              </div>
              {/* Step dots */}
              <div className="flex justify-between mt-3">
                {[1, 2, 3, 4, 5].map(s => (
                  <div key={s} className={"w-2 h-2 rounded-full transition-colors " + (s <= step ? "bg-blue-600" : (isDark ? "bg-gray-700" : "bg-gray-300"))} />
                ))}
              </div>
            </div>

            {/* Card */}
            <div className={"p-8 md:p-10 rounded-2xl border " + cardBg}>
              <div className="mb-7">
                <div className={"text-xs font-bold uppercase tracking-widest text-blue-600 mb-2"}>{t.step} {step}</div>
                <h2 className={"text-2xl md:text-3xl font-black mb-3 " + (isDark ? "text-gray-100" : "text-gray-900")}>{currentQuestion.title}</h2>
                <p className={"text-sm " + subtext}>{currentQuestion.subtitle}</p>
              </div>

              <textarea
                rows={5}
                className={"w-full px-5 py-4 rounded-xl outline-none text-base resize-none transition-all border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 " + textareaBg + " " + border}
                placeholder={currentQuestion.ph}
                value={formData[currentQuestion.key as keyof typeof formData] as string}
                onChange={e => setFormData(prev => ({ ...prev, [currentQuestion.key]: e.target.value }))}
                autoFocus
              />

              <div className="flex justify-between items-center mt-6">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} className={"px-5 py-2.5 font-semibold text-sm rounded-full border transition " + (isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100")}>
                    {isRTL ? "" : "← "}{t.back}{isRTL ? " →" : ""}
                  </button>
                ) : <div />}

                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="px-7 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-full text-sm transition flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {step === 5 ? (
                    <><SparkleIcon />{t.start_magic}</>
                  ) : (
                    <>{t.next} {isRTL ? "←" : "→"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}