"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useThemeAuth } from "../context/ThemeAuthContext";
import { TRANSLATIONS } from "../lib/translations";

// ── Icon components (all decorative → aria-hidden) ─────────────────────────────
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

function MailIcon() {
  return (
    <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

// ── Field wrapper ──────────────────────────────────────────────────────────────
function Field({ icon, children, darkMode }: { icon: React.ReactNode; children: React.ReactNode; darkMode: boolean }) {
  return (
    <div className={"flex items-center gap-3 px-4 py-3.5 rounded-xl border focus-within:ring-2 focus-within:ring-green-500 transition " + (darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200")}>
      <span className="opacity-50 flex-shrink-0" aria-hidden="true">{icon}</span>
      {children}
    </div>
  );
}

// ── Page component ─────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { darkMode, toggleTheme, login, lang, setLang } = useThemeAuth();
  const t = TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  const [view, setView] = useState<"login" | "register" | "verify" | "forgot" | "reset">("login");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const isDark = darkMode;
  const inputClass = "bg-transparent border-none outline-none w-full text-sm font-medium placeholder:opacity-50";
  const bg = isDark ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900";
  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  // WCAG contrast fix: gray-400 → gray-300 on dark; gray-500 → gray-600 on light
  const subtext = isDark ? "text-gray-300" : "text-gray-600";

  const lightModeLabel = lang === "tr" ? "Aydınlık" : lang === "ar" ? "فاتح" : "Light";
  const darkModeLabel = lang === "tr" ? "Karanlık" : lang === "ar" ? "داكن" : "Dark";
  const switchLangLabel = lang === "tr" ? "Dili değiştir" : lang === "ar" ? "تغيير اللغة" : "Switch language";
  const toggleThemeLabel = isDark
    ? (lang === "tr" ? "Aydınlık moda geç" : lang === "ar" ? "التبديل إلى الوضع الفاتح" : "Switch to light mode")
    : (lang === "tr" ? "Karanlık moda geç" : lang === "ar" ? "التبديل إلى الوضع الداكن" : "Switch to dark mode");
  const showPwLabel = showPw
    ? (lang === "tr" ? "Şifreyi gizle" : lang === "ar" ? "إخفاء كلمة المرور" : "Hide password")
    : (lang === "tr" ? "Şifreyi göster" : lang === "ar" ? "إظهار كلمة المرور" : "Show password");

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

  // ── Form handlers ─────────────────────────────────────────────────────────
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
      toast.error(
        err.message === "Email already exists"
          ? (lang === "tr" ? "Bu e-posta zaten kayıtlı." : lang === "ar" ? "هذا البريد الإلكتروني مسجّل بالفعل." : "Email already registered.")
          : t.err_network
      );
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

  // ── Forgot password: request reset code ────────────────────────────────
  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Error");
      toast.success(
        lang === "tr" ? "Kod gönderildi! E-postanızı kontrol edin."
          : lang === "ar" ? "تم إرسال الرمز! تحقق من بريدك الإلكتروني."
          : "Code sent! Check your email."
      );
      setView("reset");
    } catch {
      toast.error(t.err_network);
    } finally {
      setLoading(false);
    }
  }

  // ── Reset password: confirm code + set new password ────────────────────
  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Error");
      }
      toast.success(
        lang === "tr" ? "Şifre başarıyla sıfırlandı!"
          : lang === "ar" ? "تم إعادة تعيين كلمة المرور بنجاح!"
          : "Password reset successfully!"
      );
      setCode("");
      setNewPassword("");
      setView("login");
    } catch (err: any) {
      const msg = err.message;
      if (msg === "Invalid code") {
        toast.error(lang === "tr" ? "Geçersiz kod" : lang === "ar" ? "رمز غير صالح" : "Invalid code");
      } else if (msg.includes("expired") || msg.includes("Expired")) {
        toast.error(lang === "tr" ? "Kodun süresi doldu. Yeni kod isteyin." : lang === "ar" ? "انتهت صلاحية الرمز. اطلب رمزاً جديداً." : "Code expired. Please request a new one.");
      } else {
        toast.error(t.err_network);
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={"min-h-screen flex items-center justify-center p-4 transition-colors duration-300 font-sans " + bg}>

      {/* Top controls */}
      <div className={"absolute top-5 flex items-center gap-3 z-50 " + (isRTL ? "left-5" : "right-5")}>
        <button
          onClick={toggleLang}
          aria-label={switchLangLabel}
          className={"text-sm font-bold px-3 py-1.5 rounded-lg border transition " + (isDark ? "border-gray-700 text-gray-300 hover:border-green-500" : "border-gray-300 text-gray-600 hover:border-green-600")}
        >
          {getLangLabel()}
        </button>
        <button
          onClick={toggleTheme}
          aria-label={toggleThemeLabel}
          className={"p-2 rounded-lg border transition flex items-center gap-1.5 text-xs font-medium " + (isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100")}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
          <span className="hidden sm:inline">{isDark ? lightModeLabel : darkModeLabel}</span>
        </button>
      </div>

      {/* ── MAIN landmark ──────────────────────────────────────────────────── */}
      <main id="main-content">
        <div className={"w-full max-w-md p-8 rounded-2xl shadow-xl border " + cardBg}>

          {/* Logo + header */}
          <div className="text-center mb-8">
            <a href="/" className="inline-flex items-center gap-2 mb-6 no-underline" aria-label="Start ERA — Ana Sayfa">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-base" aria-hidden="true">S</div>
              <span className={"text-xl font-black " + (isDark ? "text-gray-100" : "text-gray-900")}>Start <span className="text-green-600">ERA</span></span>
            </a>
            <h1 className={"text-2xl font-black mb-1.5 " + (isDark ? "text-gray-100" : "text-gray-900")}>
              {view === "verify" ? t.title_verify
                : view === "forgot" ? (lang === "tr" ? "Şifremi Unuttum" : lang === "ar" ? "نسيت كلمة المرور" : "Forgot Password")
                : view === "reset" ? (lang === "tr" ? "Şifreyi Sıfırla" : lang === "ar" ? "إعادة تعيين كلمة المرور" : "Reset Password")
                : view === "login" ? t.title_login : t.title_register}
            </h1>
            <p className={"text-sm " + subtext}>
              {view === "forgot" ? (lang === "tr" ? "E-posta adresinizi girin, size bir kod göndereceğiz." : lang === "ar" ? "أدخل بريدك الإلكتروني وسنرسل لك رمزاً." : "Enter your email and we'll send you a code.")
                : view === "reset" ? (lang === "tr" ? "E-postanıza gönderilen kodu ve yeni şifrenizi girin." : lang === "ar" ? "أدخل الرمز المرسل إلى بريدك الإلكتروني وكلمة المرور الجديدة." : "Enter the code sent to your email and your new password.")
                : view === "login" ? t.subtitle_login
                : view === "register" ? t.subtitle_register : t.subtitle_verify}
            </p>
          </div>

          {/* ── Form ─────────────────────────────────────────────────────────── */}
          <form
            onSubmit={view === "login" ? handleLogin : view === "register" ? handleRegister : view === "forgot" ? handleForgot : view === "reset" ? handleReset : handleVerify}
            className="space-y-4"
            noValidate
          >
            {/* Name field (register only) */}
            {view === "register" && (
              <div className="space-y-1">
                <label htmlFor="register-name" className={"text-xs font-semibold ml-1 " + subtext}>{t.label_name}</label>
                <Field icon={<UserIcon />} darkMode={isDark}>
                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className={inputClass + " " + (isDark ? "text-gray-100" : "text-gray-900")}
                    placeholder={t.ph_name}
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </Field>
              </div>
            )}

            {/* Email field */}
            {(view === "login" || view === "register" || view === "forgot") && (
              <div className="space-y-1">
                <label htmlFor="auth-email" className={"text-xs font-semibold ml-1 " + subtext}>{t.label_email}</label>
                <Field icon={<MailIcon />} darkMode={isDark}>
                  <input
                    id="auth-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={inputClass + " " + (isDark ? "text-gray-100" : "text-gray-900")}
                    placeholder={t.ph_email}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </Field>
              </div>
            )}

            {/* Password field (login & register only) */}
            {(view === "login" || view === "register") && (
              <div className="space-y-1">
                <label htmlFor="auth-password" className={"text-xs font-semibold ml-1 " + subtext}>{t.label_password}</label>
                <Field icon={<LockIcon />} darkMode={isDark}>
                  <input
                    id="auth-password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    autoComplete={view === "login" ? "current-password" : "new-password"}
                    required
                    className={inputClass + " " + (isDark ? "text-gray-100" : "text-gray-900")}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPwLabel}
                    aria-pressed={showPw}
                    className="opacity-50 hover:opacity-80 transition flex-shrink-0"
                  >
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </Field>
              </div>
            )}

            {/* Forgot password link (login view only) */}
            {view === "login" && (
              <div className={"text-right " + (isRTL ? "text-left" : "")}>
                <button
                  type="button"
                  onClick={() => { setCode(""); setNewPassword(""); setView("forgot"); }}
                  className={"text-xs font-semibold transition hover:text-green-600 " + subtext}
                >
                  {lang === "tr" ? "Şifremi Unuttum" : lang === "ar" ? "نسيت كلمة المرور" : "Forgot Password?"}
                </button>
              </div>
            )}

            {/* Reset code field (reset view) */}
            {view === "reset" && (
              <div className="space-y-1">
                <label htmlFor="reset-code" className={"text-xs font-semibold ml-1 " + subtext}>
                  {lang === "tr" ? "Doğrulama Kodu" : lang === "ar" ? "رمز التحقق" : "Verification Code"}
                </label>
                <Field icon={<KeyIcon />} darkMode={isDark}>
                  <input
                    id="reset-code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    className={inputClass + " text-center tracking-[0.6em] text-lg font-black " + (isDark ? "text-gray-100" : "text-gray-900")}
                    placeholder={t.ph_code}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                  />
                </Field>
              </div>
            )}

            {/* New password field (reset view) */}
            {view === "reset" && (
              <div className="space-y-1">
                <label htmlFor="new-password" className={"text-xs font-semibold ml-1 " + subtext}>
                  {lang === "tr" ? "Yeni Şifre" : lang === "ar" ? "كلمة المرور الجديدة" : "New Password"}
                </label>
                <Field icon={<LockIcon />} darkMode={isDark}>
                  <input
                    id="new-password"
                    name="newPassword"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    className={inputClass + " " + (isDark ? "text-gray-100" : "text-gray-900")}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPwLabel}
                    aria-pressed={showPw}
                    className="opacity-50 hover:opacity-80 transition flex-shrink-0"
                  >
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </Field>
              </div>
            )}

            {/* Verification code (verify view — registration) */}
            {view === "verify" && (
              <div className="space-y-1">
                <label htmlFor="verify-code" className={"text-xs font-semibold ml-1 " + subtext}>{t.label_code}</label>
                <Field icon={<KeyIcon />} darkMode={isDark}>
                  <input
                    id="verify-code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    className={inputClass + " text-center tracking-[0.6em] text-lg font-black " + (isDark ? "text-gray-100" : "text-gray-900")}
                    placeholder={t.ph_code}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                  />
                </Field>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className={"w-full py-3.5 rounded-full font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 text-sm " + (loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg")}
            >
              {loading ? (
                <span className="animate-pulse">{t.processing}</span>
              ) : (
                <>
                  {view === "login" ? t.btn_login
                    : view === "register" ? t.btn_register
                    : view === "forgot" ? (lang === "tr" ? "Kod Gönder" : lang === "ar" ? "إرسال الرمز" : "Send Code")
                    : view === "reset" ? (lang === "tr" ? "Şifreyi Sıfırla" : lang === "ar" ? "إعادة تعيين" : "Reset Password")
                    : t.btn_verify}
                  <ArrowIcon />
                </>
              )}
            </button>
          </form>

          {/* Toggle login/register */}
          {(view === "login" || view === "register") && (
            <p className={"text-center text-sm mt-6 " + subtext}>
              {view === "login" ? t.no_account : t.has_account}
              <button onClick={() => setView(view === "login" ? "register" : "login")} className="ml-1.5 font-bold text-green-600 hover:text-green-700 transition">
                {view === "login" ? t.link_register : t.link_login}
              </button>
            </p>
          )}

          {/* Back to login (forgot/reset views) */}
          {(view === "forgot" || view === "reset") && (
            <p className={"text-center text-sm mt-6 " + subtext}>
              <button onClick={() => setView("login")} className="font-bold text-green-600 hover:text-green-700 transition">
                {lang === "tr" ? "← Giriş Yap'a Dön" : lang === "ar" ? "← العودة إلى تسجيل الدخول" : "← Back to Login"}
              </button>
            </p>
          )}

          {/* Back to home */}
          <p className={"text-center text-xs mt-6 " + subtext}>
            <a href="/" className={"hover:text-green-600 transition no-underline " + subtext}>
              {lang === "tr" ? "← Ana Sayfaya Dön" : lang === "ar" ? "← العودة إلى الرئيسية" : "← Back to Home"}
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}