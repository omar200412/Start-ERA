"use client";

import React, { useState, useCallback } from "react";
import { useThemeAuth } from "../context/ThemeAuthContext";
import {
  Sparkles,
  Brain,
  Briefcase,
  Wallet,
  ShieldAlert,
  Clock,
  MapPin,
  User,
  ChevronRight,
  ChevronLeft,
  Check,
  Rocket,
  ArrowRight,
  Loader2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface FormData {
  skills: string;
  workHistory: string;
  budget: string;
  riskTolerance: string;
  timeAvailability: string;
  location: string;
  personalityType: string;
}

interface StepConfig {
  key: keyof FormData;
  label: string;
  subtitle: string;
  placeholder: string;
  icon: React.ReactNode;
  type: "textarea" | "text" | "dropdown";
  options?: { value: string; label: string; description?: string }[];
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function IdeaGenerationForm() {
  const { darkMode } = useThemeAuth();
  const d = darkMode;

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    skills: "",
    workHistory: "",
    budget: "",
    riskTolerance: "",
    timeAvailability: "",
    location: "",
    personalityType: "",
  });

  // ── Step Configurations ──────────────────────────────────────────────────
  const steps: StepConfig[] = [
    {
      key: "skills",
      label: "What are your skills?",
      subtitle:
        "List your technical and non-technical skills. The more detail, the better the AI can match opportunities to you.",
      placeholder:
        "e.g. Python programming, UI/UX design, sales & negotiation, data analysis, project management, public speaking...",
      icon: <Brain className="w-5 h-5" />,
      type: "textarea",
    },
    {
      key: "workHistory",
      label: "Describe your work history",
      subtitle:
        "Share your professional background — roles, industries, and key accomplishments that shape your entrepreneurial edge.",
      placeholder:
        "e.g. 3 years as a software engineer at a fintech startup, 2 years freelance web development, led a team of 5 developers...",
      icon: <Briefcase className="w-5 h-5" />,
      type: "textarea",
    },
    {
      key: "budget",
      label: "What's your startup budget?",
      subtitle:
        "Your initial investment capacity helps us recommend ventures that match your financial runway.",
      placeholder: "",
      icon: <Wallet className="w-5 h-5" />,
      type: "dropdown",
      options: [
        {
          value: "bootstrapper",
          label: "Bootstrapper — $0 – $1K",
          description: "Starting lean with minimal capital",
        },
        {
          value: "lean",
          label: "Lean — $1K – $5K",
          description: "Modest budget for early traction",
        },
        {
          value: "funded",
          label: "Funded — $5K – $25K",
          description: "Ready to invest in growth",
        },
        {
          value: "well-funded",
          label: "Well-Funded — $25K+",
          description: "Significant capital available",
        },
      ],
    },
    {
      key: "riskTolerance",
      label: "How much risk can you handle?",
      subtitle:
        "This shapes the type of ventures we suggest — from safe bets to high-reward moonshots.",
      placeholder: "",
      icon: <ShieldAlert className="w-5 h-5" />,
      type: "dropdown",
      options: [
        {
          value: "low",
          label: "Low Risk",
          description: "Prefer proven models with steady returns",
        },
        {
          value: "medium",
          label: "Medium Risk",
          description: "Comfortable with calculated risks",
        },
        {
          value: "high",
          label: "High Risk",
          description: "Ready for bold, high-reward ventures",
        },
      ],
    },
    {
      key: "timeAvailability",
      label: "How much time can you commit?",
      subtitle:
        "Your availability determines the pace and scope of opportunities we recommend.",
      placeholder: "",
      icon: <Clock className="w-5 h-5" />,
      type: "dropdown",
      options: [
        {
          value: "weekends",
          label: "Weekends Only",
          description: "A few hours on Saturday & Sunday",
        },
        {
          value: "part-time",
          label: "Part-time / Evenings",
          description: "10–20 hours per week alongside other commitments",
        },
        {
          value: "full-time",
          label: "Full-time",
          description: "40+ hours per week — all in",
        },
      ],
    },
    {
      key: "location",
      label: "Where are you based?",
      subtitle:
        "Location helps us consider local market conditions, regulations, and regional opportunities.",
      placeholder: "e.g. Istanbul, Turkey / San Francisco, CA / London, UK",
      icon: <MapPin className="w-5 h-5" />,
      type: "text",
    },
    {
      key: "personalityType",
      label: "What's your personality type?",
      subtitle:
        "Understanding your personality helps us find ventures that match your natural working style.",
      placeholder: "",
      icon: <User className="w-5 h-5" />,
      type: "dropdown",
      options: [
        {
          value: "analytical",
          label: "Analytical",
          description: "Data-driven, detail-oriented, logical thinker",
        },
        {
          value: "creative",
          label: "Creative",
          description: "Innovative, design-minded, visionary",
        },
        {
          value: "introvert",
          label: "Introvert",
          description: "Focused, deep-thinker, independent worker",
        },
        {
          value: "extrovert",
          label: "Extrovert",
          description: "People-person, networker, team energizer",
        },
        {
          value: "leader",
          label: "Leader / Manager",
          description: "Natural organizer, delegation-oriented",
        },
        {
          value: "hustler",
          label: "Hustler / Executor",
          description: "Action-oriented, relentless drive, scrappy",
        },
      ],
    },
  ];

  const currentConfig = steps[currentStep];
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const updateField = useCallback(
    (key: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const canProceed = formData[currentConfig.key].trim() !== "";

  function handleNext() {
    if (!canProceed) return;
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }

  async function handleSubmit() {
    setIsSubmitting(true);

    // Store the form data in sessionStorage for the AI backend
    sessionStorage.setItem("idea_generation_input", JSON.stringify(formData));

    // Simulate submission delay (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  }

  // ── Color Tokens ─────────────────────────────────────────────────────────
  const pageBg = d ? "bg-gray-950" : "bg-gray-50";
  const cardBg = d
    ? "bg-gray-900/80 border-gray-800 backdrop-blur-xl"
    : "bg-white/80 border-gray-200 backdrop-blur-xl";
  const cardBgSolid = d
    ? "bg-gray-900 border-gray-800"
    : "bg-white border-gray-200";
  const textPrimary = d ? "text-gray-100" : "text-gray-900";
  const textSecondary = d ? "text-gray-400" : "text-gray-500";
  const textMuted = d ? "text-gray-500" : "text-gray-400";
  const inputBg = d
    ? "bg-gray-800/60 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:bg-gray-800"
    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white";
  const optionBase = d
    ? "bg-gray-800/40 border-gray-700 hover:border-emerald-600 hover:bg-gray-800/80"
    : "bg-gray-50/60 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/40";
  const optionSelected = d
    ? "bg-emerald-950/60 border-emerald-600 ring-1 ring-emerald-500/30"
    : "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-400/30";
  const progressTrack = d ? "bg-gray-800" : "bg-gray-200";
  const dotActive = "bg-emerald-500";
  const dotDone = "bg-emerald-600";
  const dotInactive = d ? "bg-gray-700" : "bg-gray-300";

  // ── Success State ────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-6 ${pageBg}`}>
        <div
          className={`max-w-lg w-full p-10 rounded-3xl border text-center ${cardBg}`}
          style={{
            animation: "fadeInScale 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Animated checkmark circle */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-500" strokeWidth={3} />
            </div>
          </div>
          <h2
            className={`text-2xl font-black mb-3 ${textPrimary}`}
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Profile Submitted!
          </h2>
          <p className={`text-sm leading-relaxed mb-8 ${textSecondary}`}>
            Your personal context has been captured. Our AI is now analyzing
            your profile to generate a personalized startup blueprint with
            opportunity matching, profit potential, and complexity scoring.
          </p>

          {/* Preview of what the AI will output */}
          <div
            className={`rounded-2xl border p-5 text-left mb-6 ${cardBgSolid}`}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3">
              Coming up in your blueprint
            </p>
            <div className="space-y-2.5">
              {[
                "🎯 Suitable Opportunity",
                "💰 Profit Potential",
                "📊 Difficulty Level",
                "🔧 Startup Complexity Score",
                "📈 Market Saturation Score",
                "🧬 Why This Fits You",
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 text-sm ${textSecondary}`}
                >
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(0);
              setFormData({
                skills: "",
                workHistory: "",
                budget: "",
                riskTolerance: "",
                timeAvailability: "",
                location: "",
                personalityType: "",
              });
            }}
            className={`w-full py-3.5 font-bold rounded-full text-sm transition border ${
              d
                ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Start Over
          </button>
        </div>

        <style>{`
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  // ── Main Form Render ─────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${pageBg} transition-colors duration-300`}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 border ${
              d
                ? "bg-emerald-950/40 border-emerald-900 text-emerald-400"
                : "bg-emerald-50 border-emerald-100 text-emerald-700"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Idea Generation · Personal Context
          </div>
          <h1
            className={`text-3xl md:text-4xl font-black mb-3 tracking-tight ${textPrimary}`}
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Tell us about yourself
          </h1>
          <p className={`text-sm max-w-md mx-auto leading-relaxed ${textSecondary}`}>
            We'll use your personal context to generate a tailored startup blueprint
            powered by AI.
          </p>
        </div>

        {/* ── Progress Bar ─────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Your Profile
            </span>
            <span className={`text-xs font-bold ${textMuted}`}>
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <div
            className={`w-full h-1.5 rounded-full overflow-hidden ${progressTrack}`}
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex justify-between mt-3">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  // Allow navigating back to completed steps
                  if (i < currentStep) setCurrentStep(i);
                }}
                aria-label={`Go to step ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? `${dotActive} scale-125 shadow-md shadow-emerald-500/30`
                    : i < currentStep
                    ? `${dotDone} cursor-pointer hover:scale-110`
                    : dotInactive
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Step Card ────────────────────────────────────────────────────── */}
        <div
          key={currentStep}
          className={`rounded-3xl border p-8 md:p-10 shadow-sm ${cardBg}`}
          style={{
            animation: "fadeSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Step icon + label */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                d
                  ? "bg-emerald-950/60 text-emerald-400"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {currentConfig.icon}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Step {currentStep + 1}
            </span>
          </div>

          <h2
            className={`text-xl md:text-2xl font-black mb-2 ${textPrimary}`}
          >
            {currentConfig.label}
          </h2>
          <p className={`text-sm mb-6 leading-relaxed ${textSecondary}`}>
            {currentConfig.subtitle}
          </p>

          {/* ── Input Field ──────────────────────────────────────────────── */}
          {currentConfig.type === "textarea" && (
            <label className="block">
              <span className="sr-only">{currentConfig.label}</span>
              <textarea
                id={`input-${currentConfig.key}`}
                rows={5}
                className={`w-full px-5 py-4 rounded-2xl border text-sm outline-none resize-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20 ${inputBg}`}
                placeholder={currentConfig.placeholder}
                value={formData[currentConfig.key]}
                onChange={(e) =>
                  updateField(currentConfig.key, e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && canProceed) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                autoFocus
              />
            </label>
          )}

          {currentConfig.type === "text" && (
            <label className="block">
              <span className="sr-only">{currentConfig.label}</span>
              <input
                id={`input-${currentConfig.key}`}
                type="text"
                className={`w-full px-5 py-4 rounded-2xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20 ${inputBg}`}
                placeholder={currentConfig.placeholder}
                value={formData[currentConfig.key]}
                onChange={(e) =>
                  updateField(currentConfig.key, e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canProceed) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                autoFocus
              />
            </label>
          )}

          {currentConfig.type === "dropdown" && currentConfig.options && (
            <div className="grid gap-3" role="radiogroup" aria-label={currentConfig.label}>
              {currentConfig.options.map((opt) => {
                const isSelected = formData[currentConfig.key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() =>
                      updateField(currentConfig.key, opt.value)
                    }
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all duration-200 ${
                      isSelected ? optionSelected : optionBase
                    }`}
                  >
                    {/* Custom radio circle */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500"
                          : d
                          ? "border-gray-600"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-bold ${
                          isSelected
                            ? d
                              ? "text-emerald-400"
                              : "text-emerald-700"
                            : textPrimary
                        }`}
                      >
                        {opt.label}
                      </div>
                      {opt.description && (
                        <div
                          className={`text-xs mt-0.5 ${
                            isSelected
                              ? d
                                ? "text-emerald-500/70"
                                : "text-emerald-600/70"
                              : textMuted
                          }`}
                        >
                          {opt.description}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          d ? "bg-emerald-900/50" : "bg-emerald-100"
                        }`}>
                          <Check
                            className={`w-3.5 h-3.5 ${
                              d ? "text-emerald-400" : "text-emerald-600"
                            }`}
                            strokeWidth={2.5}
                          />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Navigation Buttons ────────────────────────────────────────── */}
          <div className="flex items-center justify-between mt-8">
            {currentStep > 0 ? (
              <button
                onClick={handleBack}
                className={`flex items-center gap-1.5 px-5 py-2.5 font-semibold text-sm rounded-full border transition-all duration-200 ${
                  d
                    ? "border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className={`flex items-center gap-2 px-7 py-3 font-bold text-sm rounded-full transition-all duration-200 shadow-md ${
                canProceed && !isSubmitting
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 hover:shadow-emerald-500/30"
                  : d
                  ? "bg-gray-800 text-gray-600 cursor-not-allowed shadow-none"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : currentStep === totalSteps - 1 ? (
                <>
                  <Rocket className="w-4 h-4" />
                  Generate Blueprint
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Summary Sidebar (visible from step 2+) ──────────────────────── */}
        {currentStep > 0 && (
          <div
            className={`mt-6 rounded-2xl border p-6 ${cardBgSolid}`}
            style={{
              animation: "fadeSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <p
              className={`text-xs font-bold uppercase tracking-widest mb-4 ${textMuted}`}
            >
              Your profile so far
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {steps.slice(0, currentStep).map((step) => {
                const val = formData[step.key];
                if (!val) return null;

                // Resolve display value for dropdown options
                let displayValue = val;
                if (step.type === "dropdown" && step.options) {
                  const matchedOpt = step.options.find(
                    (o) => o.value === val
                  );
                  if (matchedOpt) displayValue = matchedOpt.label;
                }

                return (
                  <div
                    key={step.key}
                    className={`flex items-start gap-2.5 p-3 rounded-xl ${
                      d ? "bg-gray-800/40" : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        d
                          ? "bg-emerald-950/50 text-emerald-500"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {React.cloneElement(step.icon as React.ReactElement, {
                        className: "w-3.5 h-3.5",
                      })}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${textMuted}`}
                      >
                        {step.label.replace("What's your ", "").replace("What are your ", "").replace("Describe your ", "").replace("How much ", "").replace("Where are you ", "").replace("?", "")}
                      </div>
                      <div
                        className={`text-xs truncate ${textSecondary}`}
                        title={displayValue}
                      >
                        {displayValue.length > 60
                          ? displayValue.slice(0, 60) + "..."
                          : displayValue}
                      </div>
                    </div>
                    <Check
                      className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5"
                      strokeWidth={2.5}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Trusted By badge ────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <div
            className={`w-1 h-1 rounded-full ${
              d ? "bg-gray-700" : "bg-gray-300"
            }`}
          />
          <p className={`text-[10px] font-medium uppercase tracking-widest ${textMuted}`}>
            Your data is encrypted & secure
          </p>
          <div
            className={`w-1 h-1 rounded-full ${
              d ? "bg-gray-700" : "bg-gray-300"
            }`}
          />
        </div>
      </div>

      {/* ── Animations ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
