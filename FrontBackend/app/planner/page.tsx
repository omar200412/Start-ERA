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

function ResearchLoading({ status, darkMode }: { status: string; darkMode: boolean }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-3xl">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-3xl">🤖</div>
      </div>
      <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">Start ERA AI</h3>
      <div className="mt-4 flex flex-col items-center gap-3 px-6 text-center">
        <span className={"text-sm font-semibold max-w-xs " + (darkMode ? "text-slate-300" : "text-slate-600")}>{status}</span>
        <div className={"w-40 h-1 rounded-full overflow-hidden " + (darkMode ? "bg-slate-800" : "bg-slate-200")}>
          <div className="h-full bg-blue-600 animate-pulse w-full" />
        </div>
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
      a.href = url;
      a.download = "StartERA_Plan.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.dismiss(tid);
      toast.success(t.toast_pdf_success);
    } catch {
      toast.dismiss(tid);
      toast.error(lang === "tr" ? "PDF oluşturulamadı." : "PDF generation failed.");
    }
  }

  const bg = darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900";
  const navBg = darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white/60 border-slate-200";
  const cardBg = darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-white/60";
  const resultBg = darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-white";
  const sectionBg = darkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100";
  const textareaBg = darkMode ? "bg-slate-950 text-white focus:bg-slate-900" : "bg-slate-100 text-slate-900 focus:bg-white";
  const backBtnClass = darkMode ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-900 bg-white hover:bg-slate-50";
  const newPlanClass = darkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50";
  const themeBtnClass = darkMode ? "bg-slate-800 border-slate-700 text-yellow-400" : "bg-white border-slate-200 text-slate-600";
  const progressBg = darkMode ? "bg-slate-800" : "bg-slate-200";

  if (!user) {
    return (
      <div className={"flex h-screen items-center justify-center " + bg}>
        <div className="text-center">
          <p className="opacity-50 font-bold mb-4">
            {lang === "tr" ? "Lütfen giriş yapın." : lang === "ar" ? "يرجى تسجيل الدخول." : "Please sign in."}
          </p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl no-underline">{t.login}</a>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={"min-h-screen transition-all duration-700 relative overflow-hidden " + bg}>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={"absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full blur-[130px] opacity-15 " + (darkMode ? "bg-blue-800" : "bg-blue-300")} />
        <div className={"absolute top-1/2 -right-1/4 w-2/3 h-2/3 rounded-full blur-[140px] opacity-15 " + (darkMode ? "bg-purple-800" : "bg-indigo-300")} />
      </div>

      <nav className={"px-6 md:px-8 py-5 flex justify-between items-center sticky top-0 z-40 backdrop-blur-lg border-b " + navBg}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg">S</div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Start ERA</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleLang} className="font-black text-sm px-2 hover:text-blue-600 transition">{getLangLabel()}</button>
          <button onClick={toggleTheme} className={"p-2.5 rounded-xl border transition " + themeBtnClass}>
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href="/dashboard" className={"px-5 py-2 rounded-xl font-bold text-sm border no-underline transition " + backBtnClass}>{t.nav_back}</a>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto min-h-[calc(100vh-80px)]">
        {planResult ? (
          <div className={"w-full p-8 md:p-12 rounded-[32px] shadow-2xl backdrop-blur-2xl border " + resultBg}>
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 text-4xl mb-5 shadow-lg shadow-green-500/20">🎉</div>
              <h2 className="text-3xl md:text-4xl font-black mb-3">{t.success_title}</h2>
              <p className="opacity-70">{t.success_desc}</p>
            </div>
            <div className="space-y-5 mb-10">
              {planResult.map((section, idx) => (
                <div key={idx} className={"p-6 rounded-2xl border " + sectionBg}>
                  <h3 className="text-lg font-bold mb-3 text-blue-600 dark:text-blue-400 border-b border-dashed border-slate-200 dark:border-slate-700 pb-2">{section.title}</h3>
                  <p className="leading-relaxed whitespace-pre-wrap opacity-85 text-sm md:text-base">{section.content}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={downloadPDF} className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl transition-all flex items-center justify-center gap-2">
                <DownloadIcon />
                {t.download_pdf}
              </button>
              <button
                onClick={() => { setPlanResult(null); setStep(1); setFormData(prev => ({ ...prev, idea: "", capital: "", skills: "", strategy: "", management: "" })); }}
                className={"px-8 py-4 rounded-xl font-bold border transition " + newPlanClass}
              >
                {t.new_plan}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-2xl">
            {loading && <ResearchLoading status={loadingStatus} darkMode={darkMode} />}
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{t.step_progress}</span>
              <span className="text-xs font-bold opacity-50">{t.step} {step} / 5</span>
            </div>
            <div className={"w-full rounded-full h-1.5 mb-8 overflow-hidden " + progressBg}>
              <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full transition-all duration-700 ease-out" style={{ width: (step / 5 * 100) + "%" }} />
            </div>
            <div className={"p-8 md:p-12 rounded-[32px] shadow-2xl backdrop-blur-xl border " + cardBg}>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">{currentQuestion.title}</h2>
                <p className="opacity-70">{currentQuestion.subtitle}</p>
              </div>
              <textarea
                rows={5}
                className={"w-full p-5 rounded-2xl outline-none text-base resize-none transition-all border-none focus:ring-2 focus:ring-blue-500 " + textareaBg}
                placeholder={currentQuestion.ph}
                value={formData[currentQuestion.key as keyof typeof formData] as string}
                onChange={e => setFormData(prev => ({ ...prev, [currentQuestion.key]: e.target.value }))}
                autoFocus
              />
              <div className="flex justify-between items-center mt-8">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} className="px-5 py-3 font-bold opacity-50 hover:opacity-90 transition">
                    {isRTL ? "" : "← "}{t.back}{isRTL ? " →" : ""}
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl disabled:opacity-50 transition-all flex items-center gap-2"
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