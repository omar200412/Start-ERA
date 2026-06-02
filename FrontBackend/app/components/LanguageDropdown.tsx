"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useThemeAuth } from "../context/ThemeAuthContext";

export default function LanguageDropdown() {
  const { lang, setLang, darkMode } = useThemeAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const d = darkMode;
  
  const languages = [
    { code: "ar", label: "AR" },
    { code: "tr", label: "TR" },
    { code: "en", label: "EN" }
  ] as const;

  const textColor = d ? "text-gray-300 hover:text-green-400" : "text-gray-600 hover:text-green-600";
  const dropdownBg = d ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const itemHover = d ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-50 text-gray-700";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition flex items-center justify-center border ${
          d ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-100"
        } ${textColor}`}
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className={`absolute top-full right-0 mt-2 w-24 py-1.5 rounded-xl border shadow-lg z-50 ${dropdownBg}`}>
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs font-bold transition ${itemHover} ${
                lang === l.code ? (d ? "text-green-400" : "text-green-600") : ""
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
