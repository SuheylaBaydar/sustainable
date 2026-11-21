"use client";

import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

const STORAGE_KEY = "sustainable_chat_history";
const GREETING: ChatMessage = {
  role: "bot",
  text:
    "Merhaba! Ben Sustainable asistanıyım 🌱 Kayıt, giriş, ürünler, randevu veya iletişim hakkında sorularını yanıtlayabilirim. Nasıl yardımcı olabilirim?",
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Geçmişi sayfalar arası koru (template her gezinmede yeniden bağlanır)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      }
    } catch {
      /* yoksay */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* yoksay */
    }
  }, [messages]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, typing]);

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;

    const next = [...messages, { role: "user", text } as ChatMessage];
    setMessages(next);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: next.slice(-8),
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "bot", text: data?.reply ?? "Bir sorun oluştu, tekrar dener misin?" },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Bağlantı kurulamadı. Lütfen tekrar deneyin." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") send();
  };

  const resetChat = () => {
    setMessages([GREETING]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* yoksay */
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end">
      {/* Sohbet penceresi */}
      {open && (
        <div className="mb-3 flex h-[480px] w-[92vw] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-BorderLine bg-white shadow-2xl dark:border-dark_border dark:bg-darklight">
          {/* Başlık */}
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
                🌱
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">Sustainable Asistan</p>
                <span className="flex items-center gap-1 text-xs text-white/80">
                  <span className="inline-block h-2 w-2 rounded-full bg-LightApricot" />
                  Çevrimiçi
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                title="Sohbeti temizle"
                className="rounded-md px-2 py-1 text-xs text-white/80 transition hover:bg-white/15 hover:text-white"
              >
                Temizle
              </button>
              <button
                onClick={() => setOpen(false)}
                title="Kapat"
                aria-label="Kapat"
                className="flex h-7 w-7 items-center justify-center rounded-md text-xl leading-none transition hover:bg-white/15"
              >
                ×
              </button>
            </div>
          </div>

          {/* Mesajlar */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-AliceBlue/40 px-4 py-4 dark:bg-darkmode"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-white"
                      : "rounded-bl-sm bg-white text-secondary shadow-sm dark:bg-darklight dark:text-white"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-3.5 py-3 shadow-sm dark:bg-darklight">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-darktext [animation-delay:-0.2s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-darktext [animation-delay:-0.1s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-darktext" />
                </div>
              </div>
            )}
          </div>

          {/* Giriş */}
          <div className="flex items-center gap-2 border-t border-BorderLine px-3 py-3 dark:border-dark_border">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Bir mesaj yazın…"
              className="flex-1 rounded-full border border-BorderLine bg-transparent px-4 py-2 text-sm text-secondary outline-none transition focus:border-primary dark:border-dark_border dark:text-white"
            />
            <button
              onClick={send}
              disabled={typing || !input.trim()}
              aria-label="Gönder"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-darkprimary disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Açma/kapama butonu */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Sohbeti kapat" : "Sohbeti aç"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl transition hover:bg-darkprimary hover:scale-105"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
