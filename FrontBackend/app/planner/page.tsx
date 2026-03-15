"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useThemeAuth } from "../context/ThemeAuthContext";
import { TRANSLATIONS } from "../lib/translations";

const MoonIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeWidth={2} /></svg>);
const SunIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth={2} /></svg>);
const SparkleIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" /></svg>);

const ResearchLoading = ({ status, darkMode }: { status: string; darkMode: boolean }) => (
  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-3xl">
    <div className="relative w-20 h-20 mb-6">
      <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center text-3xl">🤖</div>
    </div>
    <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">Start ERA AI</h3>
    <div className="mt-4 flex flex-col items-center gap-3 px-6 text-center">
      <span className={`text-sm font-semibold max-w-xs ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{status}</span>
      <div className={`w-40 h-1 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
        <div className="h-full bg-blue-600 animate-pulse w-full" />
      </div>
    </div>
  </div>
);

export default function PlannerPage() {
  const { user, darkMode, toggleTheme, lang, setLang } = useThemeAuth();
  const t = TRANSLATIONS[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [planResult, setPlanResult] = useState<{ title: string; content: string }[] | null>(null);
  const [formData, setFormData] = useState({
    idea: "", capital: "", skills: "", strategy: "", management: "", language: lang,
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, language: lang }));
  }, [lang]);

  useEffect(() => {
    const saved = sessionStorage.getItem("planner_form");
    if (saved) {
      try { setFormData(prev => ({ ...prev, ...JSON.parse(saved) })); } catch {}
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("planner_form", JSON.stringify(formData));
  }, [formData]);

  const getLangLabel = () => lang === "tr" ? "EN" : lang === "en" ? "AR" : "TR";
  const toggleLang = () => setLang(lang === "tr" ? "en" : lang === "en" ? "ar" : "tr");
  const currentQuestion = t.questions[step - 1];

  // --- GIBBERISH DETECTION ---
  const isGibberish = (text: string): boolean => {
    const trimmed = text.trim();
    if (trimmed.length < 3) return true;

    // Allow if mostly numbers (capital amounts, dates, etc.)
    const digitRatio = (trimmed.match(/\d/g) || []).length / trimmed.length;
    if (digitRatio > 0.5) return false;

    // Count vowels — real words in any language have vowels
    const vowels = (trimmed.match(/[aeiouAEIOUğüışöçİĞÜŞÖÇاوي]/g) || []).length;
    const letters = (trimmed.match(/[a-zA-ZğüışöçİĞÜŞÖÇ\u0600-\u06FF]/g) || []).length;
    if (letters < 2) return false;

    const vowelRatio = vowels / letters;

    // Too many consecutive same characters: "aaaaaaa", "sssss"
    if (/(.)\1{3,}/.test(trimmed)) return true;

    // Random consonant clusters with no vowels in long text
    if (letters > 6 && vowelRatio < 0.05) return true;

    return false;
  };

  // --- NEXT STEP ---
  const handleNext = () => {
    const val = (formData[currentQuestion.key as keyof typeof formData] as string).trim();

    if (!val) {
      toast.error(t.err_empty);
      return;
    }

    if (isGibberish(val)) {
      toast.error(
        lang === 'tr' ? 'Lütfen gerçek bir cevap yazın.' :
        lang === 'ar' ? 'يرجى كتابة إجابة حقيقية.' :
        'Please enter a real answer.'
      );
      return;
    }

    if (step < 5) setStep(step + 1);
    else generatePlan();
  };

  // --- GENERATE PLAN ---
  const generatePlan = async () => {
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

      // Save to localStorage instantly
      const newProject = {
        id: Date.now(),
        title: formData.idea.substring(0, 35) + (formData.idea.length > 35 ? "..." : ""),
        status: lang === "tr" ? "Tamamlandı" : lang === "ar" ? "مكتمل" : "Completed",
        date: new Date().toLocaleDateString(),
        planData: finalPlan,
      };
      const existing = JSON.parse(localStorage.getItem("user_projects") || "[]");
      localStorage.setItem("user_projects", JSON.stringify([newProject, ...existing]));

      // Save to DB in background
      const token = localStorage.getItem("token");
      if (token) {
        fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ title: newProject.title, status: newProject.status, planData: finalPlan }),
        }).catch(console.error);
      }

      sessionStorage.removeItem("planner_form");
      toast.success(t.toast_success);
    } catch {
      toast.error(
        lang === "tr" ? "Hata oluştu. Lütfen tekrar deneyin." :
        lang === "ar" ? "حدث خطأ. حاول مرة أخرى." :
        "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- DOWNLOAD PDF (client-side, no server needed) ---
  const downloadPDF = async () => {
    if (!planResult) return;
    const tid = toast.loading(t.toast_pdf_preparing);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      let y = margin;

      const addPageIfNeeded = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };

      // Header bar
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 28, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Start ERA', margin, 18);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(new Date().toLocaleDateString(), pageWidth - margin, 18, { align: 'right' });

      y = 38;

      // Idea as heading
      if (formData.idea) {
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        const ideaLines = doc.splitTextToSize(formData.idea, maxWidth);
        addPageIfNeeded(ideaLines.length * 6 + 10);
        doc.text(ideaLines, margin, y);
        y += ideaLines.length * 6 + 8;
      }

      // Divider
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // Plan sections
      planResult.forEach((section, idx) => {
        addPageIfNeeded(14);

        // Section title background
        doc.setFillColor(239, 246, 255);
        doc.rect(margin, y - 5, maxWidth, 12, 'F');
        doc.setTextColor(37, 99, 235);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(section.title, margin + 3, y + 3);
        y += 14;

        // Section content
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(section.content, maxWidth);
        lines.forEach((line: string) => {
          addPageIfNeeded(6);
          doc.text(line, margin, y);
          y += 5.5;
        });

        y += 6;

        if (idx < planResult.length - 1) {
          addPageIfNeeded(4);
          doc.setDrawColor(226, 232, 240);
          doc.line(margin, y, pageWidth - margin, y);
          y += 6;
        }
      });

      // Footer on every page
      const totalPages = (doc as any).getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(248, 250, 252);
        doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Start ERA — AI Powered Business Plan', margin, pageHeight - 5);
        doc.text(`${i} / ${totalPages}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
      }

      doc.save('StartERA_Plan.pdf');
      toast.dismiss(tid);
      toast.success(t.toast_pdf_success);
    } catch (err) {
      console.error('PDF error:', err);
      toast.dismiss(tid);
      toast.error(lang === "tr" ? "PDF oluşturulamadı." : "PDF generation failed.");
    }
  };

  if (!user) {
    return (
      <div className={`flex h-screen items-center justify-center ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50'}`}>
        <div className="text-center">
          <p className="opacity-50 font-bold mb-4">
            {lang === "tr" ? "Lütfen giriş yapın." : lang === "ar" ? "يرجى تسجيل الدخول." : "Please sign in."}
          </p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl no-underline">
            {t.login}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className={`min-h-screen transition-all duration-700 relative overflow-hidden ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>

      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={`absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full blur-[130px] opacity-15 ${darkMode ? 'bg-blue-800' : 'bg-blue-300'}`} />
        <div className={`absolute top-1/2 -right-1/4 w-2/3 h-2/3 rounded-full blur-[140px] opacity-15 ${darkMode ? 'bg-purple-800' : 'bg-indigo-300'}`} />
      </div>

      {/* Navbar */}
      <nav className={`px-6 md:px-8 py-5 flex justify-between items-center sticky top-0 z-40 backdrop-blur-lg border-b ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white/60 border-slate-200"}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg">S</div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Start ERA</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleLang} className="font-black text-sm px-2 hover:text-blue-600 transition">{getLangLabel()}</button>
          <button onClick={toggleTheme} className={`p-2.5 rounded-xl border transition ${darkMode ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-200 text-slate-600'}`}>
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href="/dashboard" className={`px-5 py-2 rounded-xl font-bold text-sm border no-underline transition ${darkMode ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-900 bg-white hover:bg-slate-50"}`}>
            {t.nav_back}
          </a>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto min-h-[calc(100vh-80px)]">

        {planResult ? (
          /* ---- RESULTS SCREEN ---- */
          <div className={`w-full p-8 md:p-12 rounded-[32px] shadow-2xl backdrop-blur-2xl border ${darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-white"}`}>
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 text-4xl mb-5 shadow-lg shadow-green-500/20">🎉</div>
              <h2 className="text-3xl md:text-4xl font-black mb-3">{t.success_title}</h2>
              <p className="opacity-70">{t.success_desc}</p>
            </div>

            <div className="space-y-5 mb-10">
              {planResult.map((section, idx) => (
                <div key={idx} className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
                  <h3 className="text-lg font-bold mb-3 text-blue-600 dark:text-blue-400 border-b border-dashed border-slate-200 dark:border-slate-700 pb-2">{section.title}</h3>
                  <p className="leading-relaxed whitespace-pre-wrap opacity-85 text-sm md:text-base">{section.content}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadPDF}
                className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2} />
                </svg>
                {t.download_pdf}
              </button>
              <button
                onClick={() => {
                  setPlanResult(null);
                  setStep(1);
                  setFormData(prev => ({ ...prev, idea: "", capital: "", skills: "", strategy: "", management: "" }));
                }}
                className={`px-8 py-4 rounded-xl font-bold border transition ${darkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}
              >
                {t.new_plan}
              </button>
            </div>
          </div>

        ) : (
          /* ---- WIZARD SCREEN ---- */
          <div className="relative w-full max-w-2xl">
            {loading && <ResearchLoading status={loadingStatus} darkMode={darkMode} />}

            {/* Progress */}
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{t.step_progress}</span>
              <span className="text-xs font-bold opacity-50">{t.step} {step} / 5</span>
            </div>
            <div className={`w-full rounded-full h-1.5 mb-8 overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full transition-all duration-700 ease-out"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>

            {/* Card */}
            <div className={`p-8 md:p-12 rounded-[32px] shadow-2xl backdrop-blur-xl border ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-white/60"}`}>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">{currentQuestion.title}</h2>
                <p className="opacity-70">{currentQuestion.subtitle}</p>
              </div>

              <textarea
                rows={5}
                className={`w-full p-5 rounded-2xl outline-none text-base resize-none transition-all border-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-slate-950 text-white focus:bg-slate-900" : "bg-slate-100 text-slate-900 focus:bg-white"}`}
                placeholder={currentQuestion.ph}
                value={formData[currentQuestion.key as keyof typeof formData] as string}
                onChange={(e) => setFormData(prev => ({ ...prev, [currentQuestion.key]: e.target.value }))}
                autoFocus
                onKeyDown={(e) => {
                  // Enter alone advances, Shift+Enter creates new line
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
              />

              {/* Enter hint */}
              <p className="text-xs opacity-30 mt-2 text-right">
                {lang === 'tr' ? 'Enter ile devam et · Shift+Enter yeni satır' :
                 lang === 'ar' ? 'Enter للمتابعة · Shift+Enter سطر جديد' :
                 'Enter to continue · Shift+Enter for new line'}
              </p>

              <div className="flex justify-between items-center mt-8">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-5 py-3 font-bold opacity-50 hover:opacity-90 transition"
                  >
                    {lang !== 'ar' && '← '}{t.back}{lang === 'ar' && ' →'}
                  </button>
                ) : <div />}

                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {step === 5
                    ? <><SparkleIcon />{t.start_magic}</>
                    : <>{t.next} {lang === 'ar' ? '←' : '→'}</>
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}