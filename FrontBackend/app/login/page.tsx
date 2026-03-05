'use client';

import React, { useState, useEffect } from 'react';

// ==========================================
// API URL (Vercel Desteği İçin Güncellendi)
// ==========================================
const API_URL = "/api"; 

// ==========================================
// YEREL TOAST SİSTEMİ (Bildirimler İçin)
// ==========================================
const toastEvents = {
  listeners: [] as ((t: any) => void)[],
  emit(toast: any) { this.listeners.forEach(l => l(toast)); },
  subscribe(l: (t: any) => void) { this.listeners.push(l); return () => { this.listeners = this.listeners.filter(x => x !== l); }; }
};

const toast = (msg: string, opts?: any) => toastEvents.emit({ id: Date.now(), msg, type: 'default', icon: opts?.icon || 'ℹ️' });
toast.success = (msg: string) => toastEvents.emit({ id: Date.now(), msg, type: 'success', icon: '✅' });
toast.error = (msg: string) => toastEvents.emit({ id: Date.now(), msg, type: 'error', icon: '❌' });

const Toaster = () => {
  const [toasts, setToasts] = useState<any[]>([]);
  useEffect(() => {
    return toastEvents.subscribe((event) => {
      setToasts(prev => [...prev, event]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== event.id)), 3000);
    });
  }, []);
  
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 animate-in slide-in-from-right-5 fade-in duration-300">
          <span className="text-lg">{t.icon}</span>
          <span className="text-sm font-bold">{t.msg}</span>
        </div>
      ))}
    </div>
  );
};

const safeRedirect = (path: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
};

// ==========================================
// ÇEVİRİLER
// ==========================================
const TRANSLATIONS = {
  tr: {
    app_name: "Start ERA", title_login: "Giriş Yap", title_register: "Kayıt Ol", title_verify: "Kodu Doğrula",
    subtitle_login: "Girişimcilik yolculuğuna devam et.", subtitle_register: "Yeni bir başlangıç yap.",
    subtitle_verify: "E-postanıza gönderilen 6 haneli kodu girin.", label_name: "Ad Soyad",
    label_email: "E-Posta Adresi", label_password: "Şifre", label_code: "Doğrulama Kodu",
    ph_name: "Örn: Ömer Kaya", ph_email: "ornek@sirket.com", ph_code: "123456",
    btn_login: "Giriş Yap", btn_register: "Hesap Oluştur", btn_verify: "Kodu Onayla",
    processing: "İşleniyor...", no_account: "Henüz hesabın yok mu?", has_account: "Zaten hesabın var mı?",
    link_register: "Kayıt Ol", link_login: "Giriş Yap", err_invalid: "Geçersiz email veya şifre.",
    err_network: "Sunucuya bağlanılamadı.", success_register: "Kod gönderildi!",
    success_verify: "Doğrulandı!", success_login: "Giriş başarılı!"
  },
  en: {
    app_name: "Start ERA", title_login: "Sign In", title_register: "Sign Up", title_verify: "Verify Code",
    subtitle_login: "Continue your journey.", subtitle_register: "Make a fresh start.",
    subtitle_verify: "Enter the code.", label_name: "Full Name",
    label_email: "Email Address", label_password: "Password", label_code: "Verification Code",
    ph_name: "Ex: Omar Kaya", ph_email: "example@company.com", ph_code: "123456",
    btn_login: "Sign In", btn_register: "Create Account", btn_verify: "Verify",
    processing: "Processing...", no_account: "No account?", has_account: "Already have an account?",
    link_register: "Sign Up", link_login: "Sign In", err_invalid: "Invalid email or password.",
    err_network: "Network error.", success_register: "Code sent!",
    success_verify: "Verified!", success_login: "Success!"
  },
  ar: {
    app_name: "بداية العصر", title_login: "تسجيل الدخول", title_register: "تسجيل جديد", title_verify: "تأكيد الرمز",
    subtitle_login: "أكمل رحلتك.", subtitle_register: "ابدأ بداية جديدة.",
    subtitle_verify: "أدخل الرمز.", label_name: "الاسم الكامل",
    label_email: "البريد الإلكتروني", label_password: "كلمة المرور", label_code: "رمز التحقق",
    ph_name: "مثال: عمر كايا", ph_email: "example@company.com", ph_code: "123456",
    btn_login: "تسجيل دخول", btn_register: "إنشاء حساب", btn_verify: "تأكيد",
    processing: "جاري المعالجة...", no_account: "ليس لديك حساب؟", has_account: "لديك حساب بالفعل؟",
    link_register: "سجل الآن", link_login: "دخول", err_invalid: "خطأ في البيانات.",
    err_network: "خطأ في الاتصال.", success_register: "تم الإرسال!",
    success_verify: "تم التأكيد!", success_login: "تم الدخول!"
  }
};

// ==========================================
// İKONLAR
// ==========================================
const Icons = {
  Mail: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Lock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Key: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>,
  Eye: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  EyeOff: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>,
  ArrowRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
  Sun: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Moon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
};

// ==========================================
// AUTH SAYFASI
// ==========================================
export default function AuthPage() {
  const [view, setView] = useState<'login' | 'register' | 'verify'>('login');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lang, setLang] = useState<"tr" | "en" | "ar">("tr");
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verifyCode, setVerifyCode] = useState('');

  const t = TRANSLATIONS[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const toggleLang = () => {
    let newLang: "tr" | "en" | "ar" = lang === "tr" ? "en" : lang === "en" ? "ar" : "tr";
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error("Error");
      toast.success(t.success_register);
      setView('verify');
    } catch { toast.error(t.err_network); }
    finally { setLoading(false); }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verifyCode })
      });
      if (!res.ok) throw new Error("Error");
      toast.success(t.success_verify);
      setView('login');
    } catch { toast.error(t.err_network); }
    finally { setLoading(false); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.detail === "Not verified") { setView('verify'); return; }
        throw new Error("Error");
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);
      toast.success(t.success_login);
      setTimeout(() => safeRedirect("/dashboard"), 1000);
    } catch { toast.error(t.err_network); }
    finally { setLoading(false); }
  };

  if (!mounted) return null;

  return (
    <div dir={dir} className={`min-h-screen flex items-center justify-center transition-colors duration-500 font-sans p-4 relative overflow-hidden ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      <Toaster />
      <div className={`absolute top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} flex gap-3 z-50`}>
        <button onClick={toggleLang} className="font-black text-lg px-3 py-2">{lang === "tr" ? "EN" : lang === "en" ? "AR" : "TR"}</button>
        <button onClick={toggleTheme} className={`p-3 rounded-full ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white text-slate-600 shadow-lg'}`}>{darkMode ? <Icons.Sun /> : <Icons.Moon />}</button>
      </div>
      <div className={`w-full max-w-md p-8 rounded-[32px] shadow-2xl border backdrop-blur-xl ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-white'}`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white font-black text-2xl shadow-lg mb-6">S</div>
          <h1 className="text-3xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{view === 'verify' ? t.title_verify : t.app_name}</h1>
          <p className="text-sm font-medium opacity-70">{view === 'login' ? t.subtitle_login : view === 'register' ? t.subtitle_register : t.subtitle_verify}</p>
        </div>
        <form onSubmit={view === 'login' ? handleLogin : view === 'register' ? handleRegister : handleVerify} className="space-y-5">
          {view === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-bold mx-1 opacity-70">{t.label_name}</label>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="opacity-50"><Icons.User /></span>
                <input type="text" placeholder={t.ph_name} value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent border-none outline-none w-full text-sm font-medium" />
              </div>
            </div>
          )}
          {(view === 'login' || view === 'register') && (
            <div className="space-y-1">
              <label className="text-xs font-bold mx-1 opacity-70">{t.label_email}</label>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="opacity-50"><Icons.Mail /></span>
                <input type="email" required placeholder={t.ph_email} value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent border-none outline-none w-full text-sm font-medium" />
              </div>
            </div>
          )}
          {(view === 'login' || view === 'register') && (
            <div className="space-y-1">
              <label className="text-xs font-bold mx-1 opacity-70">{t.label_password}</label>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="opacity-50"><Icons.Lock /></span>
                <input type={showPassword ? "text" : "password"} required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-transparent border-none outline-none w-full text-sm font-medium" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="opacity-50">{showPassword ? <Icons.EyeOff /> : <Icons.Eye />}</button>
              </div>
            </div>
          )}
          {view === 'verify' && (
            <div className="space-y-1">
              <label className="text-xs font-bold mx-1 opacity-70">{t.label_code}</label>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="opacity-50"><Icons.Key /></span>
                <input type="text" maxLength={6} placeholder={t.ph_code} value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} className="bg-transparent border-none outline-none w-full text-center tracking-[0.5em] text-lg font-bold" />
              </div>
            </div>
          )}
          <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 ${loading ? 'bg-slate-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:-translate-y-1'}`}>
            {loading ? <span className="animate-pulse">{t.processing}</span> : <>{view === 'login' ? t.btn_login : view === 'register' ? t.btn_register : t.btn_verify} <span><Icons.ArrowRight /></span></>}
          </button>
        </form>
        {view !== 'verify' && (
          <div className="mt-8 text-center">
            <p className="text-sm opacity-70">
              {view === 'login' ? t.no_account : t.has_account}
              <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="mx-2 font-bold text-blue-600 underline decoration-2 underline-offset-4">{view === 'login' ? t.link_register : t.link_login}</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}