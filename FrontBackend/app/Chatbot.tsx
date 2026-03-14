"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useThemeAuth } from './context/ThemeAuthContext';

const WELCOME: Record<string, string> = {
  tr: "Merhaba! Start ERA hakkında sana nasıl yardımcı olabilirim?",
  en: "Hello! How can I help you with Start ERA?",
  ar: "مرحباً! كيف يمكنني مساعدتك في Start ERA؟",
};
const PLACEHOLDER: Record<string, string> = {
  tr: "Mesaj yaz...",
  en: "Type a message...",
  ar: "اكتب رسالة...",
};
const THINKING: Record<string, string> = {
  tr: "Düşünüyor...",
  en: "Thinking...",
  ar: "يفكر...",
};
const ERROR_MSG: Record<string, string> = {
  tr: "⚠️ Bağlantı hatası.",
  en: "⚠️ Connection error.",
  ar: "⚠️ خطأ في الاتصال.",
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

export default function Chatbot() {
  const { darkMode, lang } = useThemeAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          system_prompt: `You are a helpful Start ERA assistant. Always reply in this language: ${lang}`,
        }),
      });

      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);

    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: ERROR_MSG[lang] ?? ERROR_MSG.en, isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition active:scale-95 text-2xl"
          aria-label="Open chat"
        >
          💬
        </button>
      ) : (
        <div className={`w-80 md:w-96 h-[500px] flex flex-col rounded-2xl shadow-2xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          {/* Header */}
          <div className="p-4 bg-blue-600 text-white rounded-t-2xl flex justify-between items-center flex-shrink-0">
            <span className="font-bold text-sm">Start ERA AI 🚀</span>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-75 text-lg leading-none">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <p className="text-center text-sm opacity-50 mt-10">{WELCOME[lang] ?? WELCOME.en}</p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : msg.isError
                    ? `rounded-tl-none border ${darkMode ? 'bg-slate-700 text-orange-400 border-orange-500/30' : 'bg-orange-50 text-orange-600 border-orange-200'}`
                    : `rounded-tl-none ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`p-3 rounded-2xl rounded-tl-none text-sm animate-pulse ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                  {THINKING[lang] ?? THINKING.en}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-3 border-t flex gap-2 flex-shrink-0 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={PLACEHOLDER[lang] ?? PLACEHOLDER.en}
              disabled={isLoading}
              className={`flex-1 p-2 rounded-lg outline-none text-sm border transition ${darkMode ? 'bg-slate-900 text-white border-slate-700 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-400'}`}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition w-10 h-10 flex items-center justify-center flex-shrink-0"
            >
              🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}