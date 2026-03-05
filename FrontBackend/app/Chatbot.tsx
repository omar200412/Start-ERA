"use client";

import React, { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string; isError?: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Otomatik olarak en son mesaja kaydırır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    
    // Kullanıcının mesajını ekranda göster
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      // VERCEL ÇÖZÜMÜ: Sadece '/api/chat' kullanıyoruz, localhost veya başka bir URL yok!
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userText,
          system_prompt: "" // İstersen buraya frontend bağlamı ekleyebilirsin
        }),
      });

      if (!response.ok) {
        throw new Error("Connection error.");
      }

      const data = await response.json();
      
      // Yapay zekanın cevabını ekranda göster
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      
    } catch (error) {
      console.error("Chat Error:", error);
      // Hata durumunda senin UI'ındaki uyarıyı göster
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: "⚠️ Connection error.", isError: true }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Kapalıyken Görünen Açma Butonu (Eğer sayfanın sağ alt köşesinde duruyorsa) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-105 z-50 flex items-center justify-center"
        >
          🚀 Start ERA AI
        </button>
      )}

      {/* Chatbot Penceresi */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-[#1e293b] rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-700">
          
          {/* Header Bölümü */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">Start ERA AI 🚀</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:text-gray-200 text-xl font-bold"
            >
              ✕
            </button>
          </div>

          {/* Mesajların Listelendiği Alan */}
          <div className="flex-1 p-4 overflow-y-auto h-80 flex flex-col gap-3 bg-[#1e293b]">
            {messages.length === 0 && (
              <p className="text-slate-400 text-sm text-center mt-4">
                Merhaba! StartEra hakkında sana nasıl yardımcı olabilirim?
              </p>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : msg.isError
                      ? 'bg-slate-700 text-orange-400 rounded-tl-none border border-orange-500/30 font-medium flex items-center gap-2'
                      : 'bg-slate-700 text-white rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Yükleniyor Animasyonu */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-300 max-w-[80%] p-3 rounded-2xl rounded-tl-none animate-pulse text-sm">
                  Düşünüyor...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Mesaj Yazma Alanı */}
          <div className="p-3 bg-[#0f172a] border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-[#1e293b] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700 placeholder-slate-400"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors flex items-center justify-center w-10 h-10"
            >
              🚀
            </button>
          </div>
          
        </div>
      )}
    </>
  );
}