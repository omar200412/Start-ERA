"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Lang } from "../lib/translations";

interface ThemeAuthContextType {
  user: string | null;
  darkMode: boolean;
  lang: Lang;
  toggleTheme: () => void;
  setLang: (lang: Lang) => void;
  login: (token: string, email: string) => void;
  logout: () => void;
}

const ThemeAuthContext = createContext<ThemeAuthContextType | undefined>(undefined);

export function ThemeAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLangState] = useState<Lang>("tr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("userEmail");
    if (token && savedUser) setUser(savedUser);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    const savedLang = localStorage.getItem("app_lang") as Lang;
    if (savedLang && ["tr", "en", "ar"].includes(savedLang)) {
      setLangState(savedLang);
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      if (next) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return next;
    });
  };

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  const login = (token: string, email: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
    setUser(email);
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUser(null);
    window.location.href = "/";
  };

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeAuthContext.Provider value={{ user, darkMode, lang, toggleTheme, setLang, login, logout }}>
      {children}
    </ThemeAuthContext.Provider>
  );
}

export const useThemeAuth = (): ThemeAuthContextType => {
  const context = useContext(ThemeAuthContext);
  if (!context) {
    return {
      user: null,
      darkMode: false,
      lang: "tr",
      toggleTheme: () => {},
      setLang: () => {},
      login: () => {},
      logout: async () => {},
    };
  }
  return context;
};