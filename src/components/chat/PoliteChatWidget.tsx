"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const SUGGESTED_QUESTIONS = [
  "How do I form an LLC?",
  "What are my tax deadlines?",
  "How to get an EIN?",
  "Wyoming vs Delaware LLC?",
];

export function PoliteChatWidget() {
  const { user, profile, company } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      const name = profile?.full_name?.split(" ")[0] || (user ? "there" : "there");
      const greeting = user
        ? `Hi ${name}! I'm Polite, your Prolify AI assistant. I can help you with company formation, compliance, taxes, and anything business-related. What can I help you with today?`
        : `Hi! I'm Polite, your Prolify AI assistant. I can answer questions about LLC formation, taxes, compliance, and running a US business. How can I help you?`;

      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: greeting,
          timestamp: new Date(),
        },
      ]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, user, profile]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const getUserContext = useCallback(() => {
    if (!user) return null;
    return {
      userName: profile?.full_name || "",
      companyName: company?.name || "Not yet formed",
      entityType: company?.business_type || "Not selected",
      currentPlan: company?.current_plan || "free",
      businessType: company?.business_type || "Not specified",
    };
  }, [user, profile, company]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
    ]);

    abortControllerRef.current = new AbortController();

    try {
      const apiMessages = [...messages, userMsg]
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          userContext: getUserContext(),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated } : m
          )
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, something went wrong. Please try again." }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, getUserContext]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    abortControllerRef.current?.abort();
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^### (.*$)/gm, '<p class="font-bold text-sm mt-3 mb-1">$1</p>')
      .replace(/^## (.*$)/gm, '<p class="font-bold text-sm mt-3 mb-1">$1</p>')
      .replace(/^# (.*$)/gm, '<p class="font-bold text-sm mt-3 mb-1">$1</p>')
      .replace(/^- (.*$)/gm, '<span class="flex gap-1.5 my-0.5"><span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-current shrink-0"></span><span>$1</span></span>')
      .replace(/\n\n/g, '<div class="h-2"></div>')
      .replace(/\n/g, "<br/>");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClose}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {isOpen && (
          <div
            className="w-[380px] max-w-[calc(100vw-3rem)] bg-white dark:bg-[#111] rounded-2xl border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] flex flex-col overflow-hidden"
            style={{ height: "520px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-[#FFC107] border-b-2 border-black dark:border-black shrink-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#FFC107]">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#FFC107]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-black text-sm leading-tight">Polite</p>
                <p className="text-black/60 text-xs">Prolify AI Assistant · Online</p>
              </div>
              <button
                onClick={handleClose}
                className="w-7 h-7 rounded-lg bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-[#FFC107] border border-black flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-black">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="currentColor"/>
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-black dark:bg-white text-white dark:text-black rounded-tr-sm"
                        : "bg-gray-100 dark:bg-[#222] text-gray-900 dark:text-gray-100 rounded-tl-sm border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      msg.content ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                        />
                      ) : (
                        <div className="flex gap-1 items-center py-1">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      )
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {messages.length <= 1 && !isLoading && (
                <div className="pt-1">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Suggested questions</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[#FFC107]/10 hover:bg-[#FFC107]/20 border border-[#FFC107]/30 text-gray-700 dark:text-gray-300 transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="px-3 py-3 border-t-2 border-black dark:border-white shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Polite anything..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl border-2 border-black dark:border-white bg-white dark:bg-[#1a1a1a] text-black dark:text-white placeholder:text-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-[#FFC107] transition-colors max-h-24 overflow-y-auto"
                  style={{ minHeight: "40px" }}
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-[#FFC107] hover:bg-[#FFD54F] disabled:opacity-40 disabled:cursor-not-allowed border-2 border-black dark:border-black flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 shrink-0"
                  aria-label="Send message"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mt-2">
                Powered by Prolify AI · Press Enter to send
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-14 h-14 rounded-2xl border-2 border-black dark:border-white flex items-center justify-center transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
            isOpen
              ? "bg-black dark:bg-white"
              : "bg-[#FFC107] hover:bg-[#FFD54F]"
          }`}
          aria-label={isOpen ? "Close Polite chat" : "Open Polite chat"}
        >
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" className="dark:stroke-black" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-black">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="currentColor"/>
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
