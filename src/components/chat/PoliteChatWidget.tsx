"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Bot, Calendar, Loader2, MessageCircle, Minimize2, Send, Sparkles, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { detectMeetingRoute, emitMeetingRouteAnalytics, getMeetingRoute, shouldRecommendMeeting } from "@/lib/chat/meeting-routing";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  feedback?: "up" | "down" | null;
};

type PageContext = {
  page: string;
  greeting: string;
  suggestions: string[];
  proactiveDelay: number | null;
  proactiveMessage: string | null;
};

function getPageContext(pathname: string, isAuthenticated: boolean, firstName: string): PageContext {
  if (isAuthenticated) {
    return {
      page: "dashboard",
      greeting: `Hi${firstName ? ` ${firstName}` : ""}! Need quick help? For advanced actions, head to AI Chief of Staff.`,
      suggestions: [
        "How do I navigate the dashboard?",
        "Where can I find my documents?",
        "How do I upgrade my plan?",
        "I need help with a problem",
      ],
      proactiveDelay: null,
      proactiveMessage: null,
    };
  }

  if (pathname.includes("/pricing")) {
    return {
      page: "pricing",
      greeting: "Looking at our plans? I can help you compare them quickly.",
      suggestions: [
        "Compare Basic vs Standard vs Premium",
        "Which plan is best for SaaS?",
        "Which plan is best for e-commerce?",
        "Are there hidden fees?",
      ],
      proactiveDelay: 10000,
      proactiveMessage: "Exploring pricing? I can help you choose the best plan for your business.",
    };
  }

  if (pathname.includes("/formation")) {
    return {
      page: "formation",
      greeting: "Thinking about forming your US company? I can guide you.",
      suggestions: [
        "LLC or C-Corp?",
        "Which state should I choose?",
        "How long does formation take?",
        "What documents will I receive?",
      ],
      proactiveDelay: 15000,
      proactiveMessage: "Need help choosing the right state or entity type? I can help.",
    };
  }

  if (pathname.includes("/onboarding") || pathname.includes("/signup")) {
    return {
      page: "onboarding",
      greeting: "Welcome! Ask me anything about the signup and formation process.",
      suggestions: [
        "What happens after signup?",
        "What documents do I need?",
        "How long does the process take?",
        "Can I talk to an advisor?",
      ],
      proactiveDelay: null,
      proactiveMessage: null,
    };
  }

  return {
    page: "home",
    greeting: "Hi! I'm Polite from prolify.co. I can help with US company formation, pricing, compliance, and next steps.",
    suggestions: [
      "What's the difference between an LLC and C-Corp?",
      "How much does it cost to form a company?",
      "Which state is best for my business?",
      "I want to talk to an advisor",
    ],
    proactiveDelay: 30000,
    proactiveMessage: "Need help understanding US company formation? I'm here to help.",
  };
}

export function PoliteChatWidget() {
  const { user, profile } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [proactiveShown, setProactiveShown] = useState(false);
  const [proactiveToast, setProactiveToast] = useState<string | null>(null);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [showBookingCta, setShowBookingCta] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const trackedMeetingEventsRef = useRef<Set<string>>(new Set());

  const isAuthenticated = !!user;
  const firstName = profile?.full_name?.split(" ")[0] || "";
  const ctx = useMemo(() => getPageContext(pathname, isAuthenticated, firstName), [pathname, isAuthenticated, firstName]);
  const conversationText = useMemo(() => messages.map((m) => m.content).join(" "), [messages]);
  const bookingRoute = useMemo(() => {
    if (!conversationText.trim()) return getMeetingRoute("intro");
    return getMeetingRoute(detectMeetingRoute(conversationText));
  }, [conversationText]);

  const trackMeetingEvent = useCallback((action: "recommended" | "cta_shown" | "link_clicked", source: string) => {
    const key = `${bookingRoute.id}:${action}:${source}`;
    if (trackedMeetingEventsRef.current.has(key)) return;
    trackedMeetingEventsRef.current.add(key);
    emitMeetingRouteAnalytics(bookingRoute.id, action, source);
  }, [bookingRoute.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (proactiveShown || isOpen || isAuthenticated || !ctx.proactiveDelay || !ctx.proactiveMessage) return;
    const timer = setTimeout(() => {
      setProactiveToast(ctx.proactiveMessage);
      setProactiveShown(true);
      setTimeout(() => setProactiveToast(null), 8000);
    }, ctx.proactiveDelay);
    return () => clearTimeout(timer);
  }, [ctx.proactiveDelay, ctx.proactiveMessage, isAuthenticated, isOpen, proactiveShown]);

  useEffect(() => {
    const userAskedForCall = messages.some((m) => m.role === "user" && shouldRecommendMeeting(m.content));
    if ((turnCount >= 2 || userAskedForCall) && !isAuthenticated && !showBookingCta) setShowBookingCta(true);
  }, [isAuthenticated, messages, showBookingCta, turnCount]);

  useEffect(() => {
    if (!isAuthenticated && conversationText.trim() && shouldRecommendMeeting(conversationText)) {
      trackMeetingEvent("recommended", "chat_response");
    }
  }, [conversationText, isAuthenticated, trackMeetingEvent]);

  useEffect(() => {
    if (showBookingCta && !isAuthenticated) trackMeetingEvent("cta_shown", "chat_widget");
  }, [isAuthenticated, showBookingCta, trackMeetingEvent]);

  useEffect(() => {
    if (emailCaptured) return;
    const userMessages = messages.filter((m) => m.role === "user");
    for (const m of userMessages) {
      const emailMatch = m.content.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
      if (!emailMatch) continue;
      setEmailCaptured(true);
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailMatch[0], pageUrl: window.location.pathname }),
      }).catch(() => {});
      break;
    }
  }, [emailCaptured, messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setTurnCount((c) => c + 1);

    const assistantId = `assistant-${Date.now()}`;
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          mode: "public",
          pageContext: ctx.page,
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Chat request failed: ${response.status}`);
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Chat response stream unavailable");
      const decoder = new TextDecoder();
      let fullContent = "";
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        const snapshot = fullContent;
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: snapshot } : m)));
      }
      setTurnCount((c) => c + 1);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== assistantId),
        { id: assistantId, role: "assistant", content: "Sorry, something went wrong. Please try again in a moment." },
      ]);
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [ctx.page, isLoading, messages]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleFeedback = (messageId: string, feedback: "up" | "down") => {
    setMessages((previous) =>
      previous.map((message) =>
        message.id === messageId ? { ...message, feedback: message.feedback === feedback ? null : feedback } : message
      )
    );
  };

  return (
    <>
      {proactiveToast && !isOpen && (
        <div className="fixed bottom-24 right-6 z-50 max-w-[300px] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
            <button onClick={() => setProactiveToast(null)} className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800">
              <X className="h-3 w-3" />
            </button>
            <button onClick={() => { setIsOpen(true); setProactiveToast(null); }} className="text-left">
              <p className="pr-4 text-sm text-gray-800 dark:text-gray-200">{proactiveToast}</p>
              <p className="mt-2 text-xs font-medium text-amber-600">Chat with us →</p>
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button onClick={() => { setIsOpen(true); setProactiveToast(null); }} className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
          <MessageCircle className="h-6 w-6 text-white" />
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[540px] max-h-[80vh] w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none">
          <div className="flex flex-shrink-0 items-center justify-between bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"><Sparkles className="h-4 w-4 text-white" /></div>
              <div><p className="text-sm font-bold text-white">Polite</p><p className="text-[10px] text-white/80">{isAuthenticated ? "Your AI guide" : "Online • Replies instantly"}</p></div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-lg p-1.5 text-white transition-colors hover:bg-white/20"><Minimize2 className="h-4 w-4" /></button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="space-y-4 pt-2">
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500"><Bot className="h-3.5 w-3.5 text-white" /></div>
                  <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2.5 dark:bg-zinc-800"><p className="text-sm text-gray-800 dark:text-gray-200">{ctx.greeting}</p></div>
                </div>
                <div className="space-y-2 pl-10">
                  {ctx.suggestions.map((suggestion) => (
                    <button key={suggestion} onClick={() => void sendMessage(suggestion)} className="group flex w-full items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-left text-xs text-gray-700 transition-colors hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700">
                      <span>{suggestion}</span><ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
                {!isAuthenticated && (
                  <div className="flex flex-col gap-2 pl-10">
                    <a href="/signup" className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700">Create your account to get started <ArrowRight className="h-3 w-3" /></a>
                    <a href={bookingRoute.url} target="_blank" rel="noopener noreferrer" onClick={() => trackMeetingEvent("link_clicked", "empty_state_link")} className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700">Book your {bookingRoute.name} <Calendar className="h-3 w-3" /></a>
                  </div>
                )}
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div key={message.id}>
                    <div className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                      {message.role === "assistant" && <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500"><Bot className="h-3.5 w-3.5 text-white" /></div>}
                      <div className={`max-w-[80%] rounded-2xl px-3 py-2.5 ${message.role === "user" ? "rounded-tr-sm bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "rounded-tl-sm bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-200"}`}>
                        <div className="text-sm leading-relaxed">{formatMessage(message.content)}</div>
                      </div>
                    </div>
                    {message.role === "assistant" && message.content && (
                      <div className="mt-1 flex gap-1 pl-10">
                        <button onClick={() => handleFeedback(message.id, "up")} className={`rounded p-1 transition-colors ${message.feedback === "up" ? "text-emerald-500" : "text-gray-300 hover:text-gray-500"}`}><ThumbsUp className="h-3 w-3" /></button>
                        <button onClick={() => handleFeedback(message.id, "down")} className={`rounded p-1 transition-colors ${message.feedback === "down" ? "text-red-500" : "text-gray-300 hover:text-gray-500"}`}><ThumbsDown className="h-3 w-3" /></button>
                      </div>
                    )}
                  </div>
                ))}
                {showBookingCta && !isAuthenticated && !emailCaptured && (
                  <div className="mx-2 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/10">
                    <p className="mb-2 text-xs font-medium text-amber-800 dark:text-amber-300">Want personalized guidance? This is the best next call for your situation.</p>
                    <div className="flex gap-2">
                      <a href={bookingRoute.url} target="_blank" rel="noopener noreferrer" onClick={() => trackMeetingEvent("link_clicked", "booking_cta")} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-amber-600"><Calendar className="h-3 w-3" />Book your call</a>
                      <a href="/signup" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800">Get Started</a>
                    </div>
                  </div>
                )}
              </>
            )}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500"><Bot className="h-3.5 w-3.5 text-white" /></div>
                <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2.5 dark:bg-zinc-800"><div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" /><div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" /><div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" /></div></div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 border-t border-gray-200 p-3 dark:border-zinc-700">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question..." className="flex-1 rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 dark:bg-zinc-800 dark:text-gray-100" disabled={isLoading} />
              <button type="submit" disabled={!input.trim() || isLoading} className="rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 p-2 text-white transition-colors hover:from-amber-500 hover:to-yellow-600 disabled:opacity-30">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</button>
            </form>
            <p className="mt-1.5 text-center text-[10px] text-gray-400">prolify.co · Not legal or tax advice</p>
          </div>
        </div>
      )}
    </>
  );
}

function formatMessage(text: string) {
  if (!text) return null;
  return text.split("\n").map((line, index, lines) => {
    let html = line;
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, (_, label, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-amber-600 underline hover:text-amber-700 dark:text-amber-400">${label}</a>`);
    html = html.replace(/(?<!href=")(https?:\/\/[^\s<"]+)/g, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="break-all text-amber-600 underline hover:text-amber-700 dark:text-amber-400">${url}</a>`);
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>').replace(/\*(.*?)\*/g, "<em>$1</em>").replace(/`(.*?)`/g, '<code class="rounded bg-gray-200/50 px-1 py-0.5 text-xs dark:bg-zinc-700/50">$1</code>');
    if (line.startsWith("### ")) html = `<span class="mb-1 mt-3 block text-sm font-semibold">${html.slice(4)}</span>`;
    else if (line.startsWith("## ")) html = `<span class="mb-1 mt-3 block text-sm font-bold">${html.slice(3)}</span>`;
    else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+\.)\s(.*)/);
      if (match) html = `<span class="relative block pl-4"><span class="absolute left-0 font-medium text-gray-400">${match[1]}</span>${match[2]}</span>`;
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      html = `<span class="relative block pl-4 before:absolute before:left-1 before:text-gray-400 before:content-['•']">${html.slice(2)}</span>`;
    }
    return <span key={index} dangerouslySetInnerHTML={{ __html: html + (index < lines.length - 1 && line !== "" ? "<br/>" : "") }} />;
  });
}
