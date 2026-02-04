"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useThemeAuth } from "../context/ThemeAuthContext";
import toast from "react-hot-toast";

export default function AuthPage() {
  const { login } = useThemeAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(""); // Önceki hataları temizle
    const endpoint = isLogin ? "/login" : "/register";

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "İşlem başarısız oldu.");

      if (isLogin) {
        // --- BAŞARILI GİRİŞ ---
        localStorage.setItem("userEmail", form.email);
        
        // Context'e bildiriyoruz
        login(data.token, form.email);
        toast.success("Giriş başarılı!");
        
        // Yönlendirme
        router.push("/dashboard");
      } else {
        // --- BAŞARILI KAYIT ---
        toast.success("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        setIsLogin(true); // Giriş ekranına geç
      }
    } catch (error: any) {
      setErrorMsg(error.message);
      toast.error(error.message || "İşlem başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 transition-all duration-500 hover:shadow-xl">
        
        {/* Başlık Alanı */}
        <div className="text-center mb-10">
          <Link href="/" className="text-4xl font-black text-blue-600 tracking-tight block mb-4 hover:opacity-80 transition">
            Start ERA
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {isLogin ? "Tekrar Hoşgeldin 👋" : "Aramıza Katıl 🚀"}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {isLogin ? "Girişimcilik yolculuğuna devam et." : "Hayallerini gerçeğe dönüştürmek için ilk adımı at."}
          </p>
        </div>

        {/* Hata Mesajı Kutusu */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold text-center animate-pulse">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form Alanı */}
        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">E-posta Adresi</label>
            <input 
              type="email" 
              required 
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400" 
              placeholder="ornek@mail.com" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Şifre</label>
            <input 
              type="password" 
              required 
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400" 
              placeholder="••••••••" 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full py-4 text-white font-black rounded-2xl shadow-lg transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${isLogin ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                İşlem Yapılıyor...
              </span>
            ) : (isLogin ? "Giriş Yap" : "Ücretsiz Kayıt Ol")}
          </button>
        </form>

        {/* Alt Değiştirici */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-xs mb-3 font-medium">
            {isLogin ? "Henüz bir hesabın yok mu?" : "Zaten bir hesabın var mı?"}
          </p>
          <button 
            onClick={() => {
              setIsLogin(!isLogin); 
              setForm({ email: "", password: "" }); 
              setErrorMsg("");
            }} 
            className="text-blue-600 font-black hover:underline transition text-sm"
          >
            {isLogin ? "Hemen Hesap Oluştur" : "Mevcut Hesabına Giriş Yap"}
          </button>
        </div>

        <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-400 font-bold hover:text-slate-600 transition">← Ana Sayfaya Dön</Link>
        </div>

      </div>
    </div>
  );
}
