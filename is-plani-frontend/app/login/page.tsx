"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useThemeAuth } from "../context/ThemeAuthContext";

// 👇 Render URL'ni buraya yapıştırdım
const API_URL = "https://srart-era.onrender.com";

export default function AuthPage() {
  const { login } = useThemeAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? "/login" : "/register";

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "İşlem başarısız.");

      if (isLogin) {
        // user_email bilgisini de kaydediyoruz ki Dashboard'da görünsün
        localStorage.setItem("user_email", form.email);
        login(data.token, form.email);
        router.push("/dashboard"); // Dashboard'a yönlendiriyoruz
      } else {
        alert("Kayıt Başarılı! Şimdi giriş yapabilirsiniz.");
        setIsLogin(true);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 mb-2">
            {isLogin ? "Tekrar Hoşgeldin 👋" : "Aramıza Katıl 🚀"}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {isLogin ? "Fikirlerini işe dönüştürmeye devam et." : "Hayalindeki girişimi bugün planla."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">E-posta</label>
            <input 
              type="email" 
              required 
              // 👇 text-slate-900 EKLEYEREK YAZIYI GÖRÜNÜR YAPTIK
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
              placeholder="okhalefa5@gmail.com" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Şifre</label>
            <input 
              type="password" 
              required 
              // 👇 text-slate-900 EKLEYEREK YAZIYI GÖRÜNÜR YAPTIK
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
              placeholder="••••••••" 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 text-white font-black rounded-2xl bg-blue-600 hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Lütfen Bekleyin..." : (isLogin ? "Giriş Yap" : "Kayıt Ol")}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-50 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-blue-600 font-bold hover:underline transition text-sm"
          >
            {isLogin ? "Hesabın yok mu? Hemen Kayıt Ol" : "Zaten hesabın var mı? Giriş Yap"}
          </button>
        </div>
      </div>
    </div>
  );
}