"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useThemeAuth } from "../context/ThemeAuthContext";
import { IDEA_FORM_T } from "../lib/ideaFormTranslations";
import {
  Sparkles, Brain, Briefcase, Wallet, ShieldAlert, Clock, MapPin, User,
  ChevronRight, ChevronLeft, Check, Rocket, Loader2, Sun, Moon, ArrowLeft,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface FormData {
  skills: string; workHistory: string; budget: string; riskTolerance: string;
  timeAvailability: string; location: string; personalityType: string;
}
type InputType = "textarea" | "text" | "dropdown";
interface Option { value: string; label: string; description?: string }

const FORM_KEYS: (keyof FormData)[] = ["skills","workHistory","budget","riskTolerance","timeAvailability","location","personalityType"];
const STEP_ICONS = [
  <Brain key="b" className="w-5 h-5" />, <Briefcase key="br" className="w-5 h-5" />,
  <Wallet key="w" className="w-5 h-5" />, <ShieldAlert key="s" className="w-5 h-5" />,
  <Clock key="c" className="w-5 h-5" />, <MapPin key="m" className="w-5 h-5" />,
  <User key="u" className="w-5 h-5" />,
];
const STEP_TYPES: InputType[] = ["textarea","textarea","dropdown","dropdown","dropdown","text","dropdown"];

// ── Component ──────────────────────────────────────────────────────────────────
export default function IdeaGenerationForm() {
  const router = useRouter();
  const { darkMode, toggleTheme, lang, setLang } = useThemeAuth();
  const d = darkMode;
  const isRTL = lang === "ar";
  const t = IDEA_FORM_T[lang];

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    skills: "", workHistory: "", budget: "", riskTolerance: "",
    timeAvailability: "", location: "", personalityType: "",
  });

  const totalSteps = 7;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const key = FORM_KEYS[currentStep];
  const stepT = t.steps[currentStep];
  const inputType = STEP_TYPES[currentStep];

  // Get options for current step
  function getOptions(): Option[] {
    if (currentStep === 2) return t.budgetOptions as unknown as Option[];
    if (currentStep === 3) return t.riskOptions as unknown as Option[];
    if (currentStep === 4) return t.timeOptions as unknown as Option[];
    if (currentStep === 6) return t.personalityOptions as unknown as Option[];
    return [];
  }

  const updateField = useCallback((k: keyof FormData, v: string) => {
    setFormData(prev => ({ ...prev, [k]: v }));
  }, []);

  const canProceed = formData[key].trim() !== "";

  function handleNext() {
    if (!canProceed) return;
    if (currentStep < totalSteps - 1) setCurrentStep(s => s + 1);
    else handleSubmit();
  }
  function handleBack() { if (currentStep > 0) setCurrentStep(s => s - 1); }

  async function handleSubmit() {
    setIsSubmitting(true);
    sessionStorage.setItem("idea_generation_input", JSON.stringify(formData));
    router.push("/idea-generation/results");
  }

  // Language cycle
  function getLangLabel() { return lang === "tr" ? "EN" : lang === "en" ? "AR" : "TR"; }
  function toggleLang() { setLang(lang === "tr" ? "en" : lang === "en" ? "ar" : "tr"); }

  // ── Color Tokens ─────────────────────────────────────────────────────────
  const pageBg = d ? "bg-gray-950" : "bg-gray-50";
  const cardBg = d ? "bg-gray-900/80 border-gray-800 backdrop-blur-xl" : "bg-white/80 border-gray-200 backdrop-blur-xl";
  const cardBgSolid = d ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const textPrimary = d ? "text-gray-100" : "text-gray-900";
  const textSecondary = d ? "text-gray-400" : "text-gray-500";
  const textMuted = d ? "text-gray-500" : "text-gray-400";
  const inputBg = d ? "bg-gray-800/60 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:bg-gray-800" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white";
  const optionBase = d ? "bg-gray-800/40 border-gray-700 hover:border-emerald-600 hover:bg-gray-800/80" : "bg-gray-50/60 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/40";
  const optionSelected = d ? "bg-emerald-950/60 border-emerald-600 ring-1 ring-emerald-500/30" : "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-400/30";
  const progressTrack = d ? "bg-gray-800" : "bg-gray-200";
  const navBg = d ? "bg-gray-950/95 border-gray-800" : "bg-white/95 border-gray-100";

  // Resolve display value for summary
  function getDisplayValue(stepIdx: number, val: string): string {
    const type = STEP_TYPES[stepIdx];
    if (type !== "dropdown" || !val) return val;
    const opts = stepIdx === 2 ? t.budgetOptions : stepIdx === 3 ? t.riskOptions : stepIdx === 4 ? t.timeOptions : t.personalityOptions;
    const found = (opts as unknown as Option[]).find(o => o.value === val);
    return found ? found.label : val;
  }

  // ── Success State ────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen ${pageBg}`}>
        <nav className={`sticky top-0 z-40 border-b backdrop-blur-md ${navBg}`}>
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 no-underline">
              <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
              <span className={`text-base font-black ${textPrimary}`}>Start ERA</span>
            </a>
          </div>
        </nav>
        <div className="flex items-center justify-center px-6 py-20">
          <div className={`max-w-lg w-full p-10 rounded-3xl border text-center ${cardBg}`} style={{ animation: "fadeInScale 0.5s cubic-bezier(0.16,1,0.3,1) forwards" }}>
            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-500" strokeWidth={3} />
              </div>
            </div>
            <h2 className={`text-2xl font-black mb-3 ${textPrimary}`} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.successTitle}</h2>
            <p className={`text-sm leading-relaxed mb-8 ${textSecondary}`}>{t.successDesc}</p>
            <div className={`rounded-2xl border p-5 text-left mb-6 ${cardBgSolid}`}>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3">{t.blueprintPreview}</p>
              <div className="space-y-2.5">
                {[t.bp1, t.bp2, t.bp3, t.bp4, t.bp5, t.bp6].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2.5 text-sm ${textSecondary}`}><span>{item}</span></div>
                ))}
              </div>
            </div>
            <button onClick={() => { setIsSubmitted(false); setCurrentStep(0); setFormData({ skills:"",workHistory:"",budget:"",riskTolerance:"",timeAvailability:"",location:"",personalityType:"" }); }}
              className={`w-full py-3.5 font-bold rounded-full text-sm transition border ${d ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {t.startOver}
            </button>
          </div>
        </div>
        <style>{`@keyframes fadeInScale { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }`}</style>
      </div>
    );
  }

  // ── Main Form ────────────────────────────────────────────────────────────
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen ${pageBg} transition-colors duration-300`}>
      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className={`sticky top-0 z-40 border-b backdrop-blur-md ${navBg}`}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 no-underline">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
            <span className={`text-base font-black ${textPrimary}`}>Start ERA</span>
          </a>
          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition ${d ? "border-gray-700 text-gray-300 hover:border-green-600" : "border-gray-200 text-gray-600 hover:border-green-500"}`}>
              {getLangLabel()}
            </button>
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition flex items-center gap-1.5 text-xs font-medium border ${d ? "border-gray-700 text-yellow-400 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
              {d ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a href="/" className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs border no-underline transition ${d ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"}`}>
              <ArrowLeft className="w-3.5 h-3.5" />
              {lang === "tr" ? "Ana Sayfa" : lang === "ar" ? "الرئيسية" : "Home"}
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 border ${d ? "bg-emerald-950/40 border-emerald-900 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}>
            <Sparkles className="w-3.5 h-3.5" />{t.badge}
          </div>
          <h1 className={`text-3xl md:text-4xl font-black mb-3 tracking-tight ${textPrimary}`} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.pageTitle}</h1>
          <p className={`text-sm max-w-md mx-auto leading-relaxed ${textSecondary}`}>{t.pageSubtitle}</p>
        </div>

        {/* ── Progress ─────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{t.profileLabel}</span>
            <span className={`text-xs font-bold ${textMuted}`}>{t.stepLabel} {currentStep + 1} {t.ofLabel} {totalSteps}</span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${progressTrack}`} role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-3">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <button key={i} onClick={() => { if (i < currentStep) setCurrentStep(i); }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentStep ? "bg-emerald-500 scale-125 shadow-md shadow-emerald-500/30" : i < currentStep ? "bg-emerald-600 cursor-pointer hover:scale-110" : (d ? "bg-gray-700" : "bg-gray-300")}`} />
            ))}
          </div>
        </div>

        {/* ── Step Card ────────────────────────────────────────────────────── */}
        <div key={currentStep} className={`rounded-3xl border p-8 md:p-10 shadow-sm ${cardBg}`} style={{ animation: "fadeSlideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d ? "bg-emerald-950/60 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>{STEP_ICONS[currentStep]}</div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">{t.stepLabel} {currentStep + 1}</span>
          </div>
          <h2 className={`text-xl md:text-2xl font-black mb-2 ${textPrimary}`}>{stepT.label}</h2>
          <p className={`text-sm mb-6 leading-relaxed ${textSecondary}`}>{stepT.subtitle}</p>

          {/* Input */}
          {inputType === "textarea" && (
            <textarea id={`input-${key}`} rows={5} autoFocus
              className={`w-full px-5 py-4 rounded-2xl border text-sm outline-none resize-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20 ${inputBg}`}
              placeholder={stepT.placeholder} value={formData[key]}
              onChange={e => updateField(key, e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && canProceed) { e.preventDefault(); handleNext(); } }} />
          )}
          {inputType === "text" && (
            <input id={`input-${key}`} type="text" autoFocus
              className={`w-full px-5 py-4 rounded-2xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20 ${inputBg}`}
              placeholder={stepT.placeholder} value={formData[key]}
              onChange={e => updateField(key, e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && canProceed) { e.preventDefault(); handleNext(); } }} />
          )}
          {inputType === "dropdown" && (
            <div className="grid gap-3" role="radiogroup">
              {getOptions().map(opt => {
                const sel = formData[key] === opt.value;
                return (
                  <button key={opt.value} role="radio" aria-checked={sel} onClick={() => updateField(key, opt.value)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all duration-200 ${sel ? optionSelected : optionBase}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${sel ? "border-emerald-500 bg-emerald-500" : d ? "border-gray-600" : "border-gray-300"}`}>
                      {sel && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold ${sel ? (d ? "text-emerald-400" : "text-emerald-700") : textPrimary}`}>{opt.label}</div>
                      {opt.description && <div className={`text-xs mt-0.5 ${sel ? (d ? "text-emerald-500/70" : "text-emerald-600/70") : textMuted}`}>{opt.description}</div>}
                    </div>
                    {sel && <div className="flex-shrink-0"><div className={`w-6 h-6 rounded-full flex items-center justify-center ${d ? "bg-emerald-900/50" : "bg-emerald-100"}`}><Check className={`w-3.5 h-3.5 ${d ? "text-emerald-400" : "text-emerald-600"}`} strokeWidth={2.5} /></div></div>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex items-center justify-between mt-8">
            {currentStep > 0 ? (
              <button onClick={handleBack} className={`flex items-center gap-1.5 px-5 py-2.5 font-semibold text-sm rounded-full border transition-all duration-200 ${d ? "border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600" : "border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300"}`}>
                <ChevronLeft className="w-4 h-4" />{t.backBtn}
              </button>
            ) : <div />}
            <button onClick={handleNext} disabled={!canProceed || isSubmitting}
              className={`flex items-center gap-2 px-7 py-3 font-bold text-sm rounded-full transition-all duration-200 shadow-md ${canProceed && !isSubmitting ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20" : d ? "bg-gray-800 text-gray-600 cursor-not-allowed shadow-none" : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"}`}>
              {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" />{t.analyzingBtn}</>)
                : currentStep === totalSteps - 1 ? (<><Rocket className="w-4 h-4" />{t.generateBtn}</>)
                : (<>{t.nextBtn}<ChevronRight className="w-4 h-4" /></>)}
            </button>
          </div>
        </div>

        {/* ── Summary ──────────────────────────────────────────────────────── */}
        {currentStep > 0 && (
          <div className={`mt-6 rounded-2xl border p-6 ${cardBgSolid}`} style={{ animation: "fadeSlideIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards" }}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${textMuted}`}>{t.profileSoFar}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FORM_KEYS.slice(0, currentStep).map((k, i) => {
                const val = formData[k];
                if (!val) return null;
                const display = getDisplayValue(i, val);
                return (
                  <div key={k} className={`flex items-start gap-2.5 p-3 rounded-xl ${d ? "bg-gray-800/40" : "bg-gray-50"}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${d ? "bg-emerald-950/50 text-emerald-500" : "bg-emerald-50 text-emerald-600"}`}>
                      {React.cloneElement(STEP_ICONS[i], { className: "w-3.5 h-3.5" })}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${textMuted}`}>{t.steps[i].summaryLabel}</div>
                      <div className={`text-xs truncate ${textSecondary}`} title={display}>{display.length > 60 ? display.slice(0, 60) + "..." : display}</div>
                    </div>
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Footer badge ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <div className={`w-1 h-1 rounded-full ${d ? "bg-gray-700" : "bg-gray-300"}`} />
          <p className={`text-[10px] font-medium uppercase tracking-widest ${textMuted}`}>{t.secureNote}</p>
          <div className={`w-1 h-1 rounded-full ${d ? "bg-gray-700" : "bg-gray-300"}`} />
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeInScale { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
      `}</style>
    </div>
  );
}
