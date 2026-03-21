"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useThemeAuth } from "../context/ThemeAuthContext";
import { TRANSLATIONS } from "../lib/translations";

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

function MailIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function Field({ icon, children, darkMode }: { icon: React.ReactNode; children: React.ReactNode; darkMode: boolean }) {
  const cls = darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200";
  return (
    <div className={"flex items-center gap-3 px-4 py-3.5 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500 transition " + cls}>
      <span className="opacity-40 flex-shrink-0">{icon}</span>
      {children}
    </div>
  );
}

export default function LoginPage() {
  const { darkMode, toggleTheme, login, lang, setLang } = useThemeAuth();
  const t = TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  const [view, setView] = useState<"login" | "register" | "verify">("login");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

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

  const inputClass = "bg-transparent border-none outline-none w-full text-sm font-medium placeholder:opacity-40";
  const themeBtnClass = darkMode ? "bg-slate-800 text-yellow-400" : "bg-white text-slate-600 shadow";

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Error");
      }
      toast.success(t.success_register);
      setView("verify");
    } catch (err: any) {
      toast.error(err.message === "Email already exists" ? (lang === "tr" ? "Bu email zaten kayıtlı." : "Email already registered.") : t.err_network);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) throw new Error("Error");
      toast.success(t.success_verify);
      setView("login");
    } catch {
      toast.error(t.err_network);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.detail === "Not verified") { setView("verify"); return; }
        throw new Error(data.detail || "Error");
      }
      login(data.token, data.email);
      toast.success(t.success_login);
      setTimeout(() => { window.location.href = "/dashboard"; }, 900);
    } catch {
      toast.error(t.err_invalid);
    } finally {
      setLoading(false);
    }
  }

  const pageBg = darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900";
  const cardBg = darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/90 border-white";
  const submitBtn = loading
    ? "bg-slate-500 cursor-not-allowed"
    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:-translate-y-0.5 hover:shadow-lg";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={"min-h-screen flex items-center justify-center p-4 transition-colors duration-500 " + pageBg}>

      <div className={"absolute top-5 flex items-center gap-3 z-50 " + (isRTL ? "left-5" : "right-5")}>
        <button onClick={toggleLang} className="font-black text-sm px-3 py-2 hover:text-blue-600 transition">
          {getLangLabel()}
        </button>
        <button onClick={toggleTheme} className={"p-2.5 rounded-full transition " + themeBtnClass}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      <div className={"w-full max-w-md p-8 rounded-[32px] shadow-2xl border backdrop-blur-xl " + cardBg}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white font-black text-xl shadow-lg mb-5">S</div>
          <h1 className="text-2xl font-black mb-1.5 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {view === "verify" ? t.title_verify : t.app_name}
          </h1>
          <p className="text-sm opacity-60">
            {view === "login" ? t.subtitle_login : view === "register" ? t.subtitle_register : t.subtitle_verify}
          </p>
        </div>

        <form onSubmit={view === "login" ? handleLogin : view === "register" ? handleRegister : handleVerify} className="space-y-4">

          {view === "register" && (
            <div className="space-y-1">
              <label className="text-xs font-bold opacity-60 ml-1">{t.label_name}</label>
              <Field icon={<UserIcon />} darkMode={darkMode}>
                <input className={inputClass} placeholder={t.ph_name} value={name} onChange={e => setName(e.target.value)} />
              </Field>
            </div>
          )}

          {view !== "verify" && (
            <div className="space-y-1">
              <label className="text-xs font-bold opacity-60 ml-1">{t.label_email}</label>
              <Field icon={<MailIcon />} darkMode={darkMode}>
                <input type="email" required className={inputClass} placeholder={t.ph_email} value={email} onChange={e => setEmail(e.target.value)} />
              </Field>
            </div>
          )}

          {view !== "verify" && (
            <div className="space-y-1">
              <label className="text-xs font-bold opacity-60 ml-1">{t.label_password}</label>
              <Field icon={<LockIcon />} darkMode={darkMode}>
                <input type={showPw ? "text" : "password"} required className={inputClass} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="opacity-40 hover:opacity-70 transition flex-shrink-0">
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </Field>
            </div>
          )}

          {view === "verify" && (
            <div className="space-y-1">
              <label className="text-xs font-bold opacity-60 ml-1">{t.label_code}</label>
              <Field icon={<KeyIcon />} darkMode={darkMode}>
                <input type="text" maxLength={6} className={inputClass + " text-center tracking-[0.6em] text-lg font-black"} placeholder={t.ph_code} value={code} onChange={e => setCode(e.target.value)} />
              </Field>
            </div>
          )}

          <button type="submit" disabled={loading} className={"w-full py-4 rounded-xl font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 " + submitBtn}>
            {loading ? (
              <span className="animate-pulse">{t.processing}</span>
            ) : (
              <>
                {view === "login" ? t.btn_login : view === "register" ? t.btn_register : t.btn_verify}
                <ArrowIcon />
              </>
            )}
          </button>
        </form>

        {view !== "verify" && (
          <p className="text-center text-sm opacity-60 mt-6">
            {view === "login" ? t.no_account : t.has_account}
            <button onClick={() => setView(view === "login" ? "register" : "login")} className="ml-1.5 font-bold text-blue-600 underline underline-offset-4">
              {view === "login" ? t.link_register : t.link_login}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}