"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useThemeAuth } from '../context/ThemeAuthContext';
import { TRANSLATIONS } from '../lib/translations';

const Icons = {
  Mail: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Lock: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  User: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Key: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  EyeOff: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>,
  Sun: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Moon: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Arrow: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
  Back: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  Reset: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
};

// view types: login | register | verify | forgot | reset_verify | reset_new
type View = 'login' | 'register' | 'verify' | 'forgot' | 'reset_verify' | 'reset_new';

const Field = ({ icon, children, darkMode }: { icon: React.ReactNode; children: React.ReactNode; darkMode: boolean }) => (
  <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500 transition ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
    <span className="opacity-40 flex-shrink-0">{icon}</span>
    {children}
  </div>
);

const viewTitles: Record<View, Record<string, string>> = {
  login:        { tr: 'Giriş Yap',         en: 'Sign In',          ar: 'تسجيل الدخول' },
  register:     { tr: 'Kayıt Ol',           en: 'Sign Up',          ar: 'تسجيل جديد' },
  verify:       { tr: 'Kodu Doğrula',       en: 'Verify Code',      ar: 'تأكيد الرمز' },
  forgot:       { tr: 'Şifremi Unuttum',    en: 'Forgot Password',  ar: 'نسيت كلمة المرور' },
  reset_verify: { tr: 'Kodu Girin',         en: 'Enter Code',       ar: 'أدخل الرمز' },
  reset_new:    { tr: 'Yeni Şifre',         en: 'New Password',     ar: 'كلمة مرور جديدة' },
};

const viewSubtitles: Record<View, Record<string, string>> = {
  login:        { tr: 'Girişimcilik yolculuğuna devam et.',      en: 'Continue your journey.',               ar: 'أكمل رحلتك.' },
  register:     { tr: 'Yeni bir başlangıç yap.',                  en: 'Make a fresh start.',                  ar: 'ابدأ بداية جديدة.' },
  verify:       { tr: 'E-postanıza gönderilen kodu girin.',       en: 'Enter the code sent to your email.',   ar: 'أدخل الرمز المرسل إلى بريدك.' },
  forgot:       { tr: 'E-postanı gir, sana kod gönderelim.',      en: 'Enter your email to receive a code.',  ar: 'أدخل بريدك لإرسال رمز إليك.' },
  reset_verify: { tr: 'E-postanıza gönderilen sıfırlama kodunu girin.', en: 'Enter the reset code from your email.', ar: 'أدخل رمز إعادة التعيين من بريدك.' },
  reset_new:    { tr: 'Yeni şifreni belirle.',                    en: 'Set your new password.',               ar: 'حدد كلمة مرورك الجديدة.' },
};

export default function LoginPage() {
  const { darkMode, toggleTheme, login, lang, setLang } = useThemeAuth();
  const t = TRANSLATIONS[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [view, setView] = useState<View>('login');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const getLangLabel = () => lang === "tr" ? "EN" : lang === "en" ? "AR" : "TR";
  const toggleLang = () => setLang(lang === "tr" ? "en" : lang === "en" ? "ar" : "tr");
  const inputClass = `bg-transparent border-none outline-none w-full text-sm font-medium placeholder:opacity-40`;

  // --- REGISTER ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || 'Error');
      }
      toast.success(lang === 'tr' ? 'Doğrulama kodu gönderildi!' : lang === 'ar' ? 'تم إرسال رمز التحقق!' : 'Verification code sent!');
      setView('verify');
    } catch (err: any) {
      const msg = err.message === 'Email already exists'
        ? (lang === 'tr' ? 'Bu email zaten kayıtlı.' : lang === 'ar' ? 'البريد الإلكتروني مسجل بالفعل.' : 'Email already registered.')
        : t.err_network;
      toast.error(msg);
    } finally { setLoading(false); }
  };

  // --- VERIFY REGISTRATION ---
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verifyCode }),
      });
      if (!res.ok) throw new Error('Error');
      toast.success(lang === 'tr' ? 'Hesabın doğrulandı!' : lang === 'ar' ? 'تم تأكيد الحساب!' : 'Account verified!');
      setView('login');
    } catch { toast.error(t.err_network); }
    finally { setLoading(false); }
  };

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.detail === 'Not verified') { setView('verify'); return; }
        throw new Error(data.detail || 'Error');
      }
      login(data.token, data.email);
      toast.success(lang === 'tr' ? 'Giriş başarılı!' : lang === 'ar' ? 'تم الدخول بنجاح!' : 'Login successful!');
      setTimeout(() => { window.location.href = '/dashboard'; }, 900);
    } catch {
      toast.error(lang === 'tr' ? 'Geçersiz email veya şifre.' : lang === 'ar' ? 'بيانات غير صحيحة.' : 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  // --- FORGOT PASSWORD: send code ---
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error(lang === 'tr' ? 'Email adresinizi girin.' : lang === 'ar' ? 'أدخل بريدك الإلكتروني.' : 'Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!res.ok) throw new Error('Error');
      toast.success(
        lang === 'tr' ? 'Sıfırlama kodu email adresinize gönderildi!' :
        lang === 'ar' ? 'تم إرسال رمز إعادة التعيين إلى بريدك!' :
        'Reset code sent to your email!'
      );
      setView('reset_verify');
    } catch {
      toast.error(t.err_network);
    } finally { setLoading(false); }
  };

  // --- RESET: verify code then set new password ---
  const handleResetVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode.trim() || resetCode.length !== 6) {
      toast.error(lang === 'tr' ? '6 haneli kodu girin.' : lang === 'ar' ? 'أدخل الرمز المكون من 6 أرقام.' : 'Enter the 6-digit code.');
      return;
    }
    // Just move to next step — actual code verification happens on final submit
    setView('reset_new');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error(lang === 'tr' ? 'Şifre en az 6 karakter olmalı.' : lang === 'ar' ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.' : 'Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(lang === 'tr' ? 'Şifreler eşleşmiyor.' : lang === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: resetCode, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.detail === 'Code expired') {
          toast.error(lang === 'tr' ? 'Kod süresi doldu. Tekrar deneyin.' : lang === 'ar' ? 'انتهت صلاحية الرمز. حاول مجدداً.' : 'Code expired. Please request a new one.');
          setView('forgot');
          return;
        }
        if (data.detail === 'Invalid code') {
          toast.error(lang === 'tr' ? 'Geçersiz kod.' : lang === 'ar' ? 'رمز غير صحيح.' : 'Invalid code.');
          setView('reset_verify');
          return;
        }
        throw new Error('Error');
      }
      toast.success(
        lang === 'tr' ? 'Şifren başarıyla sıfırlandı! Giriş yapabilirsin.' :
        lang === 'ar' ? 'تم إعادة تعيين كلمة المرور بنجاح!' :
        'Password reset successfully! You can now sign in.'
      );
      // Clear state and go back to login
      setResetCode(''); setNewPassword(''); setConfirmPassword('');
      setView('login');
    } catch {
      toast.error(t.err_network);
    } finally { setLoading(false); }
  };

  // --- Form submit dispatcher ---
  const handleSubmit = (e: React.FormEvent) => {
    if (view === 'login') return handleLogin(e);
    if (view === 'register') return handleRegister(e);
    if (view === 'verify') return handleVerify(e);
    if (view === 'forgot') return handleForgotPassword(e);
    if (view === 'reset_verify') return handleResetVerify(e);
    if (view === 'reset_new') return handleResetPassword(e);
    e.preventDefault();
  };

  const getButtonLabel = () => {
    if (loading) return lang === 'tr' ? 'İşleniyor...' : lang === 'ar' ? 'جاري المعالجة...' : 'Processing...';
    if (view === 'login') return t.btn_login;
    if (view === 'register') return t.btn_register;
    if (view === 'verify') return t.btn_verify;
    if (view === 'forgot') return lang === 'tr' ? 'Kod Gönder' : lang === 'ar' ? 'إرسال الرمز' : 'Send Code';
    if (view === 'reset_verify') return lang === 'tr' ? 'Devam Et' : lang === 'ar' ? 'متابعة' : 'Continue';
    if (view === 'reset_new') return lang === 'tr' ? 'Şifreyi Sıfırla' : lang === 'ar' ? 'إعادة تعيين' : 'Reset Password';
    return '';
  };

  // Step indicator for reset flow
  const isResetFlow = view === 'forgot' || view === 'reset_verify' || view === 'reset_new';
  const resetStep = view === 'forgot' ? 1 : view === 'reset_verify' ? 2 : 3;

  return (
    <div dir={dir} className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

      {/* Top controls */}
      <div className={`absolute top-5 ${lang === 'ar' ? 'left-5' : 'right-5'} flex items-center gap-2 z-50`}>
        <button onClick={toggleLang} className="font-black text-sm px-3 py-2 hover:text-blue-600 transition">{getLangLabel()}</button>
        <button onClick={toggleTheme} className={`p-2.5 rounded-full transition ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white text-slate-600 shadow'}`}>
          {darkMode ? <Icons.Sun /> : <Icons.Moon />}
        </button>
      </div>

      {/* Card */}
      <div className={`w-full max-w-md p-8 rounded-[32px] shadow-2xl border backdrop-blur-xl ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-white'}`}>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white font-black text-xl shadow-lg mb-5">S</div>
          <h1 className="text-2xl font-black mb-1.5 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {viewTitles[view][lang]}
          </h1>
          <p className="text-sm opacity-60">{viewSubtitles[view][lang]}</p>

          {/* Reset flow step dots */}
          {isResetFlow && (
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3].map(n => (
                <div key={n} className={`h-1.5 rounded-full transition-all duration-300 ${n === resetStep ? 'w-8 bg-blue-600' : n < resetStep ? 'w-4 bg-blue-400' : 'w-4 bg-slate-300 dark:bg-slate-700'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* REGISTER: name field */}
          {view === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-bold opacity-60 ml-1">{t.label_name}</label>
              <Field icon={<Icons.User />} darkMode={darkMode}>
                <input className={inputClass} placeholder={t.ph_name} value={name} onChange={e => setName(e.target.value)} />
              </Field>
            </div>
          )}

          {/* LOGIN / REGISTER / FORGOT: email */}
          {(view === 'login' || view === 'register' || view === 'forgot') && (
            <div className="space-y-1">
              <label className="text-xs font-bold opacity-60 ml-1">{t.label_email}</label>
              <Field icon={<Icons.Mail />} darkMode={darkMode}>
                <input type="email" required className={inputClass} placeholder={t.ph_email} value={email} onChange={e => setEmail(e.target.value)} />
              </Field>
            </div>
          )}

          {/* LOGIN / REGISTER: password */}
          {(view === 'login' || view === 'register') && (
            <div className="space-y-1">
              <label className="text-xs font-bold opacity-60 ml-1">{t.label_password}</label>
              <Field icon={<Icons.Lock />} darkMode={darkMode}>
                <input type={showPw ? 'text' : 'password'} required className={inputClass} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="opacity-40 hover:opacity-70 transition flex-shrink-0">
                  {showPw ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </Field>

              {/* Forgot password link — only on login */}
              {view === 'login' && (
                <div className={`text-right mt-1 ${lang === 'ar' ? 'text-left' : ''}`}>
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 transition underline underline-offset-2"
                  >
                    {lang === 'tr' ? 'Şifremi unuttum' : lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VERIFY REGISTRATION: code */}
          {view === 'verify' && (
            <div className="space-y-1">
              <label className="text-xs font-bold opacity-60 ml-1">{t.label_code}</label>
              <Field icon={<Icons.Key />} darkMode={darkMode}>
                <input type="text" maxLength={6} className={`${inputClass} text-center tracking-[0.6em] text-lg font-black`} placeholder="123456" value={verifyCode} onChange={e => setVerifyCode(e.target.value.replace(/\D/g, ''))} />
              </Field>
            </div>
          )}

          {/* RESET: enter code from email */}
          {view === 'reset_verify' && (
            <div className="space-y-1">
              <label className="text-xs font-bold opacity-60 ml-1">
                {lang === 'tr' ? 'Sıfırlama Kodu' : lang === 'ar' ? 'رمز إعادة التعيين' : 'Reset Code'}
              </label>
              <Field icon={<Icons.Key />} darkMode={darkMode}>
                <input type="text" maxLength={6} className={`${inputClass} text-center tracking-[0.6em] text-lg font-black`} placeholder="123456" value={resetCode} onChange={e => setResetCode(e.target.value.replace(/\D/g, ''))} autoFocus />
              </Field>
              <p className="text-xs opacity-40 ml-1 mt-1">
                {lang === 'tr' ? '15 dakika içinde geçerlidir.' : lang === 'ar' ? 'صالح لمدة 15 دقيقة.' : 'Valid for 15 minutes.'}
              </p>
            </div>
          )}

          {/* RESET: new password */}
          {view === 'reset_new' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold opacity-60 ml-1">
                  {lang === 'tr' ? 'Yeni Şifre' : lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <Field icon={<Icons.Lock />} darkMode={darkMode}>
                  <input type={showNewPw ? 'text' : 'password'} required minLength={6} className={inputClass} placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} autoFocus />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="opacity-40 hover:opacity-70 transition flex-shrink-0">
                    {showNewPw ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                </Field>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold opacity-60 ml-1">
                  {lang === 'tr' ? 'Şifre Tekrar' : lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <Field icon={<Icons.Lock />} darkMode={darkMode}>
                  <input type={showNewPw ? 'text' : 'password'} required minLength={6} className={`${inputClass} ${confirmPassword && confirmPassword !== newPassword ? 'text-red-500' : ''}`} placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </Field>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-red-500 ml-1">
                    {lang === 'tr' ? 'Şifreler eşleşmiyor' : lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 ${loading ? 'bg-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:-translate-y-0.5 hover:shadow-lg'}`}
          >
            {loading ? (
              <span className="animate-pulse">{getButtonLabel()}</span>
            ) : (
              <>
                {isResetFlow ? <Icons.Reset /> : view === 'login' || view === 'register' ? <Icons.Arrow /> : <Icons.Key />}
                {getButtonLabel()}
              </>
            )}
          </button>
        </form>

        {/* Back / switch view links */}
        <div className="mt-6 text-center space-y-3">
          {/* Reset flow: back button */}
          {isResetFlow && (
            <button
              onClick={() => {
                if (view === 'forgot') setView('login');
                if (view === 'reset_verify') setView('forgot');
                if (view === 'reset_new') setView('reset_verify');
              }}
              className="flex items-center gap-2 mx-auto text-sm font-bold opacity-50 hover:opacity-80 transition"
            >
              <Icons.Back />
              {lang === 'tr' ? 'Geri Dön' : lang === 'ar' ? 'رجوع' : 'Go Back'}
            </button>
          )}

          {/* Login/Register toggle */}
          {(view === 'login' || view === 'register') && (
            <p className="text-sm opacity-60">
              {view === 'login' ? t.no_account : t.has_account}
              <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="ml-1.5 font-bold text-blue-600 underline underline-offset-4">
                {view === 'login' ? t.link_register : t.link_login}
              </button>
            </p>
          )}

          {/* Verify page: back to login */}
          {view === 'verify' && (
            <button onClick={() => setView('login')} className="flex items-center gap-2 mx-auto text-sm font-bold opacity-50 hover:opacity-80 transition">
              <Icons.Back />
              {lang === 'tr' ? 'Girişe Dön' : lang === 'ar' ? 'العودة للدخول' : 'Back to Login'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}