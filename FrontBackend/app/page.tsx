"use client";

import React from 'react';
import toast from 'react-hot-toast';
import { useThemeAuth } from './context/ThemeAuthContext';
import { TRANSLATIONS } from './lib/translations';
import Chatbot from './Chatbot';

const MoonIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>);
const SunIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);
const CheckIcon = () => (<svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>);

export default function LandingPage() {
  const { user, darkMode, toggleTheme, logout, lang, setLang } = useThemeAuth();
  const t = TRANSLATIONS[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const getLangLabel = () => lang === "tr" ? "EN" : lang === "en" ? "AR" : "TR";
  const toggleLang = () => setLang(lang === "tr" ? "en" : lang === "en" ? "ar" : "tr");
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div dir={dir} className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Chatbot />

      {/* Navbar */}
      <nav className={`fixed w-full z-50 backdrop-blur-md border-b ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-2xl font-black text-blue-600 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Start <span className={darkMode ? 'text-white' : 'text-slate-900'}>ERA</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <button onClick={() => scrollTo('about')} className="hover:text-blue-600 transition">{t.nav_about}</button>
            <button onClick={() => scrollTo('features')} className="hover:text-blue-600 transition">{t.nav_features}</button>
            <button onClick={() => scrollTo('pricing')} className="hover:text-blue-600 transition">{t.nav_pricing}</button>
            <button onClick={() => scrollTo('contact')} className="hover:text-blue-600 transition">{t.nav_contact}</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleLang} className="font-black text-sm w-8 text-center hover:text-blue-600 transition">{getLangLabel()}</button>
            <button onClick={toggleTheme} className={`p-2 rounded-full transition ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden lg:block text-sm font-bold text-blue-600">{user.split('@')[0]}</span>
                <a href="/dashboard" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-sm transition shadow-lg no-underline">{t.dashboard}</a>
                <button onClick={logout} className="text-sm text-red-500 hover:text-red-600 font-bold transition">{t.logout}</button>
              </div>
            ) : (
              <a href="/login" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition shadow-lg no-underline text-sm">{t.login}</a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs mb-6 uppercase tracking-widest">{t.badge}</div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">{t.hero_title}</h1>
        <p className={`text-xl mb-10 max-w-3xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.hero_desc}</p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a href={user ? "/dashboard" : "/login"} className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl shadow-xl transition transform hover:-translate-y-1 no-underline">{t.start_free}</a>
          <button onClick={() => scrollTo('features')} className={`px-10 py-4 border-2 font-bold rounded-xl transition ${darkMode ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-white'}`}>{t.how_it_works}</button>
        </div>
      </section>

      {/* About */}
      <section id="about" className={`py-20 px-6 border-t ${darkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-6">{t.about_title}</h2>
          <p className="text-lg leading-relaxed opacity-80">{t.about_text}</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-16">{t.feat_title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {([['🧠', t.feat1_t, t.feat1_d], ['🌍', t.feat2_t, t.feat2_d], ['📄', t.feat3_t, t.feat3_d]] as [string, string, string][]).map(([icon, title, desc], i) => (
              <div key={i} className={`p-8 rounded-2xl border transition hover:shadow-xl hover:-translate-y-1 duration-300 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="text-4xl mb-6">{icon}</div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="opacity-60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-blue-600/5">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-16">{t.price_title}</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div className={`p-8 rounded-3xl border-2 flex flex-col relative ${darkMode ? 'bg-slate-900 border-blue-600' : 'bg-white border-blue-600 shadow-xl'}`}>
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase">{t.popular}</div>
              <h3 className="text-2xl font-bold mb-2">{t.p_free_t}</h3>
              <div className="text-4xl font-black text-blue-600 mb-6">{t.p_free_p}</div>
              <ul className="space-y-4 mb-8 flex-1">
                {([t.li_1, t.li_2, t.li_3, t.li_4] as string[]).map((item, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckIcon /><span>{item}</span></li>
                ))}
              </ul>
              <a href={user ? "/dashboard" : "/login"} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center transition no-underline block">{t.start_free}</a>
            </div>
            <div className={`p-8 rounded-3xl border border-dashed relative overflow-hidden ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
              <div className="absolute top-4 right-4 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse uppercase">{t.coming_soon}</div>
              <h3 className="text-2xl font-bold mb-2 opacity-60">{t.p_pro_t}</h3>
              <div className="text-4xl font-black text-slate-400 mb-6">{t.p_pro_p}</div>
              <p className="mb-6 text-sm opacity-50 italic">{t.p_pro_d}</p>
              <ul className="space-y-4 mb-8 opacity-70">
                {([t.pro_li1, t.pro_li2, t.pro_li3, t.pro_li4] as string[]).map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm"><CheckIcon /><span>{item}</span></li>
                ))}
              </ul>
              <button disabled className="w-full py-4 font-bold rounded-xl border border-slate-300 cursor-not-allowed opacity-40">{t.coming_soon}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6">
        <div className={`max-w-4xl mx-auto p-10 rounded-3xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h2 className="text-3xl font-black mb-8 text-center">{t.contact_title}</h2>
          <form className="grid md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); toast.success(t.contact_toast); }}>
            <input placeholder={t.form_name} className={`p-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} required />
            <input type="email" placeholder={t.form_email} className={`p-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} required />
            <textarea placeholder={t.form_msg} className={`p-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2 resize-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} rows={4} required />
            <button type="submit" className="md:col-span-2 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition">{t.form_btn}</button>
          </form>
        </div>
      </section>

      <footer className={`py-10 text-center border-t opacity-50 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="mb-2 font-bold text-xl">Start ERA</div>
        <p className="text-sm">{t.footer}</p>
      </footer>
    </div>
  );
}