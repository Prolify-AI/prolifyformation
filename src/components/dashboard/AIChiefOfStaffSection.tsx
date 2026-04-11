"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Bot, Send, Sparkles, Paperclip, Loader as Loader2, Square, Building2, Shield, TrendingUp, BookOpen, CircleAlert as AlertCircle, CircleCheck as CheckCircle, FileText, Receipt, CalendarClock, UserPlus, ArrowRightLeft, List, Search, PenLine, Plus, AtSign, MessageSquare, History, CirclePlus as PlusCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import type { UserContext } from "@/lib/ai/system-prompts";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const AVAILABLE_TOOLS = [
  // Read
  { id: "list-companies", label: "My Companies", description: "View all your companies", prompt: "List all my companies", icon: List, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", category: "Read", badge: null, badgeColor: "" },
  { id: "company-info", label: "Company Info", description: "Details of active company", prompt: "Show me my company info", icon: Building2, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", category: "Read", badge: null, badgeColor: "" },
  { id: "deadlines", label: "Compliance Deadlines", description: "View upcoming deadlines", prompt: "What are my compliance deadlines?", icon: CalendarClock, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", category: "Read", badge: null, badgeColor: "" },
  { id: "expenses", label: "My Expenses", description: "Recent expenses list", prompt: "Show me my expenses", icon: Receipt, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", category: "Read", badge: null, badgeColor: "" },
  { id: "invoices", label: "My Invoices", description: "Invoices and amounts", prompt: "Show my invoices", icon: FileText, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", category: "Read", badge: null, badgeColor: "" },
  { id: "documents", label: "My Documents", description: "Company documents", prompt: "List my documents", icon: FileText, color: "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400", category: "Read", badge: null, badgeColor: "" },
  // Create
  { id: "create-company", label: "Form New Company", description: "Create a new US company", prompt: "Create a new company: ", icon: Plus, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", category: "Create", badge: "NEW", badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  { id: "add-existing", label: "Add Existing Company", description: "Import an already formed company", prompt: "Add my existing company: ", icon: Building2, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", category: "Create", badge: null, badgeColor: "" },
  { id: "add-expense", label: "Add Expense", description: "Record a new expense", prompt: "Add an expense of $ for ", icon: Receipt, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400", category: "Create", badge: null, badgeColor: "" },
  { id: "create-invoice", label: "Create Invoice", description: "New client invoice", prompt: "Create an invoice of $ for ", icon: FileText, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400", category: "Create", badge: null, badgeColor: "" },
  { id: "add-deadline", label: "Add Deadline", description: "New compliance deadline", prompt: "Add a deadline: ", icon: CalendarClock, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", category: "Create", badge: null, badgeColor: "" },
  { id: "add-cofounder", label: "Add Co-Founder", description: "Invite a business partner", prompt: "Add a co-founder: ", icon: UserPlus, color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400", category: "Create", badge: null, badgeColor: "" },
  // Modify
  { id: "update-company", label: "Update Company", description: "Change name, address, type", prompt: "Update my company: ", icon: PenLine, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400", category: "Modify", badge: null, badgeColor: "" },
  { id: "switch-company", label: "Switch Company", description: "Switch to another company", prompt: "Switch to company ", icon: ArrowRightLeft, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400", category: "Modify", badge: null, badgeColor: "" },
  { id: "mark-complete", label: "Mark Deadline Complete", description: "Complete a compliance task", prompt: "Mark as completed: ", icon: CheckCircle, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400", category: "Modify", badge: null, badgeColor: "" },
  { id: "send-invoice", label: "Send / Mark Invoice", description: "Send, mark paid, or cancel", prompt: "Mark my invoice as ", icon: Send, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400", category: "Modify", badge: null, badgeColor: "" },
  { id: "delete-expense", label: "Delete Expense", description: "Remove an expense", prompt: "Delete the expense for ", icon: Receipt, color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400", category: "Modify", badge: null, badgeColor: "" },
  { id: "delete-invoice", label: "Delete Invoice", description: "Remove an invoice", prompt: "Delete the invoice for ", icon: FileText, color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400", category: "Modify", badge: null, badgeColor: "" },
  { id: "update-profile", label: "Update Profile", description: "Change your name or phone", prompt: "Update my profile: ", icon: UserPlus, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400", category: "Modify", badge: null, badgeColor: "" },
  // AI Analysis
  { id: "financial-summary", label: "Financial Summary", description: "Revenue, expenses, profit overview", prompt: "Give me a complete financial summary", icon: TrendingUp, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", category: "AI Analysis", badge: "AI", badgeColor: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-400" },
  { id: "tax-scan", label: "Tax Deduction Scan", description: "Find missing tax deductions", prompt: "Scan my expenses for tax deductions I might be missing", icon: Search, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", category: "AI Analysis", badge: "AI", badgeColor: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-400" },
  { id: "compliance-audit", label: "Compliance Audit", description: "Full audit with risk assessment", prompt: "Run a full compliance audit on my company", icon: Shield, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", category: "AI Analysis", badge: "AI", badgeColor: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-400" },
  { id: "financial-report", label: "Financial Report", description: "P&L, expense or revenue report", prompt: "Generate a profit and loss report", icon: FileText, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", category: "AI Analysis", badge: "AI", badgeColor: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-400" },
  { id: "entity-comparison", label: "LLC vs C-Corp", description: "Compare based on your real data", prompt: "Compare LLC vs C-Corp for my situation", icon: ArrowRightLeft, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", category: "AI Analysis", badge: "AI", badgeColor: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-400" },
  { id: "tax-package", label: "Year-End Tax Package", description: "Compile everything for your CPA", prompt: "Compile my year-end tax package for 2026", icon: FileText, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", category: "AI Analysis", badge: "AI", badgeColor: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-400" },
  { id: "action-plan", label: "90-Day Action Plan", description: "Personalized growth & compliance plan", prompt: "Generate a 90-day action plan for my company", icon: CalendarClock, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", category: "AI Analysis", badge: "AI", badgeColor: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-400" },
  // AI Copilots
  { id: "formation-advice", label: "Formation Advice", description: "LLC vs C-Corp, state selection", prompt: "Advise me on forming my company: ", icon: Building2, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", category: "AI Copilots", badge: "AI", badgeColor: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-400" },
  { id: "compliance-advice", label: "Compliance Advice", description: "Filings, penalties, Form 5472", prompt: "What are my compliance risks?", icon: Shield, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", category: "AI Copilots", badge: "AI", badgeColor: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-400" },
  { id: "tax-advice", label: "Tax & Finance Advice", description: "Deductions, taxes, quarterly payments", prompt: "How can I reduce my tax burden?", icon: TrendingUp, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", category: "AI Copilots", badge: "AI", badgeColor: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-400" },
  { id: "knowledge", label: "Knowledge Base", description: "US law, banking, visas, ITIN", prompt: "Explain to me ", icon: BookOpen, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400", category: "AI Copilots", badge: "AI", badgeColor: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-400" },
];

const SUGGESTIONS = [
  { text: "Should I form an LLC or C-Corp?", icon: "🏛️" },
  { text: "What are my upcoming compliance deadlines?", icon: "🛡️" },
  { text: "How can I reduce my tax burden?", icon: "📊" },
  { text: "How do I open a US bank account?", icon: "🏦" },
];

export default function AIChiefOfStaffSection() {
  const { user, profile, company } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [contextLoaded, setContextLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const [showTools, setShowTools] = useState(false);
  const [toolFilter, setToolFilter] = useState("");
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);
  const toolsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const [conversationId, _setConversationId] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const setConversationId = (id: string | null) => {
    conversationIdRef.current = id;
    _setConversationId(id);
  };
  const [conversations, setConversations] = useState<{ id: string; title: string; updated_at: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    async function loadContext() {
      const ctx: UserContext = {
        userName: profile?.full_name || user?.email || "Founder",
        companyName: company?.name || "Not yet formed",
        entityType: company?.business_type || "Not selected",
        formationState: "",
        currentPlan: company?.current_plan || "starter",
        businessType: company?.business_type || "Not specified",
      };

      if (company?.id) {
        const [complianceRes, expenseRes, invoiceRes] = await Promise.all([
          supabase
            .from("compliance_dates")
            .select("title, due_date, status, category")
            .eq("company_id", company.id)
            .in("status", ["upcoming", "overdue"])
            .order("due_date", { ascending: true })
            .limit(10),
          supabase
            .from("expenses")
            .select("amount, category")
            .eq("company_id", company.id),
          supabase
            .from("invoices")
            .select("amount, status")
            .eq("company_id", company.id),
        ]);

        if (complianceRes.data?.length) {
          ctx.complianceDates = complianceRes.data;
        }
        if (expenseRes.data?.length) {
          const total = expenseRes.data.reduce((sum, e) => sum + Number(e.amount), 0);
          const categories = [...new Set(expenseRes.data.map((e) => e.category))];
          ctx.expenses = { total, categories };
        }
        if (invoiceRes.data?.length) {
          const total = invoiceRes.data.reduce((sum, i) => sum + Number(i.amount), 0);
          const outstanding = invoiceRes.data
            .filter((i) => i.status !== "paid")
            .reduce((sum, i) => sum + Number(i.amount), 0);
          ctx.invoices = { total, outstanding };
        }
      }

      setUserContext(ctx);
      setContextLoaded(true);
    }
    loadContext();
  }, [user, profile, company]);

  useEffect(() => {
    if (!user) return;
    loadConversations();
  }, [user]);

  const loadConversations = async () => {
    const { data, error } = await supabase.rpc("get_chat_conversations");
    console.log("[Chat] Load conversations:", data?.length ?? 0, error?.message);
    if (data && Array.isArray(data)) setConversations(data);
  };

  const loadConversation = async (convId: string) => {
    const { data } = await supabase.rpc("get_chat_messages", { p_conversation_id: convId });
    if (data && Array.isArray(data)) {
      setMessages(data.map((m: any) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content })));
      setConversationId(convId);
      setShowHistory(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setShowHistory(false);
  };

  const saveMessage = async (role: string, content: string) => {
    if (!user) return;

    let convId = conversationIdRef.current;

    if (!convId) {
      const title = content.slice(0, 60) + (content.length > 60 ? "..." : "");
      const { data, error } = await supabase.rpc("create_chat_conversation", { p_title: title });
      console.log("[Chat] Create conversation:", data, error?.message);
      if (data) {
        convId = data as string;
        setConversationId(convId);
      } else {
        console.error("[Chat] Failed to create conversation:", error);
        return;
      }
    }

    if (convId) {
      const { data: msgData, error: msgErr } = await supabase.rpc("save_chat_message", {
        p_conversation_id: convId,
        p_role: role,
        p_content: content,
      });
      console.log("[Chat] Save message:", role, msgData, msgErr?.message);
    }

    loadConversations();
  };

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const trimmed = text.trim();
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);

      saveMessage("user", trimmed);

      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }

      const assistantId = `assistant-${Date.now()}`;
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const apiMessages = updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const { data: { session } } = await supabase.auth.getSession();

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            userContext,
            accessToken: session?.access_token,
            companyId: company?.id,
            userId: user?.id,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`API error ${response.status}: ${errText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let fullContent = "";

        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "" },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          const captured = fullContent;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: captured } : m
            )
          );
        }

        if (fullContent) saveMessage("assistant", fullContent);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== assistantId),
          {
            id: assistantId,
            role: "assistant",
            content: `Sorry, I encountered an error: ${errorMsg}. Please try again.`,
          },
        ]);
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages, isLoading, userContext]
  );

  const handleStop = () => {
    abortRef.current?.abort();
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const filteredTools = AVAILABLE_TOOLS.filter(
    (t) =>
      !toolFilter ||
      t.label.toLowerCase().includes(toolFilter.toLowerCase()) ||
      t.category.toLowerCase().includes(toolFilter.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showTools) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedToolIndex((i) => Math.min(i + 1, filteredTools.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedToolIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        if (filteredTools[selectedToolIndex]) {
          selectTool(filteredTools[selectedToolIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowTools(false);
      }
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";

    const lastAtIndex = value.lastIndexOf("@");
    if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
      setShowTools(true);
      setToolFilter("");
      setSelectedToolIndex(0);
    } else if (lastAtIndex !== -1 && showTools) {
      const filterText = value.slice(lastAtIndex + 1);
      if (filterText.includes(" ") && filterText.length > 20) {
        setShowTools(false);
      } else {
        setToolFilter(filterText);
        setSelectedToolIndex(0);
      }
    } else if (lastAtIndex === -1) {
      setShowTools(false);
    }
  };

  const selectTool = (tool: (typeof AVAILABLE_TOOLS)[number]) => {
    const lastAtIndex = input.lastIndexOf("@");
    const before = lastAtIndex >= 0 ? input.slice(0, lastAtIndex) : input;
    setInput(before + tool.prompt);
    setShowTools(false);
    setToolFilter("");
    inputRef.current?.focus();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company?.id || !user?.id) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessages((prev) => [
        ...prev,
        { id: `sys-${Date.now()}`, role: "assistant", content: `"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 10MB.` },
      ]);
      return;
    }

    setUploading(true);
    const uploadMsgId = `user-upload-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: uploadMsgId, role: "user", content: `📎 ${file.name}` },
    ]);

    try {
      const fileExt = file.name.split(".").pop();
      const storagePath = `${company.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      const docType = detectDocumentType(file.name);

      await supabase.from("company_documents").insert({
        company_id: company.id,
        uploaded_by: user.id,
        document_name: file.name,
        document_type: docType,
        file_url: storagePath,
        file_size: file.size,
        description: "Uploaded via AI Chat",
        tags: [docType, fileExt],
      });

      let extractedText = "";
      if (file.type === "application/pdf" || file.type === "text/csv" || file.type === "text/plain" || file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
        const formData = new FormData();
        formData.append("file", file);
        const extractRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (extractRes.ok) {
          const extractData = await extractRes.json();
          extractedText = extractData.extractedText ?? "";
        }
      }

      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / 1024 / 1024).toFixed(1)}MB`
        : `${(file.size / 1024).toFixed(0)}KB`;

      const isTextReadable = extractedText && extractedText.trim().length > 10 && !extractedText.startsWith("[PDF parsing failed") && !extractedText.startsWith("[Only");

      if (isTextReadable) {
        const analysisPrompt = `I just uploaded a document called "${file.name}" (${docType}, ${sizeStr}). Here is the extracted text:\n\n---\n${extractedText}\n---\n\nPlease analyze this document and provide:\n1. A brief summary of what this document is\n2. Key information found (names, dates, amounts, terms)\n3. Any action items or important deadlines\n4. How this relates to my US business compliance`;

        sendMessage(analysisPrompt);
      } else {
        const scannedNote = file.type === "application/pdf"
          ? "\n\nThis PDF appears to be a scanned image. For full AI analysis, please upload a text-based PDF or copy-paste the text content here."
          : "";

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-upload-${Date.now()}`,
            role: "assistant",
            content: `**Document uploaded!** ✓\n\n- **File:** ${file.name}\n- **Size:** ${sizeStr}\n- **Type:** ${docType}\n- **Stored:** Securely in your company vault${scannedNote}\n\nYou can ask me questions about this document anytime.`,
          },
        ]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: "assistant", content: `Failed to upload "${file.name}": ${msg}` },
      ]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const hasMessages = messages.length > 0;
  const firstName = profile?.full_name?.split(" ")[0] || "";

  const deleteConversation = async (convId: string) => {
    await supabase.rpc("delete_chat_conversation", { p_conversation_id: convId });
    if (conversationId === convId) startNewChat();
    loadConversations();
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] -m-4 md:-m-6 min-h-[calc(100vh-10rem)]">
      <div className="flex flex-col min-h-[calc(100vh-10rem)] max-w-3xl mx-auto px-4 md:px-6">

        {/* Top bar: New Chat + History */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
          <button
            onClick={startNewChat}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            New Chat
          </button>
          <button
            onClick={() => { setShowHistory(!showHistory); loadConversations(); }}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              showHistory
                ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            }`}
          >
            <History className="h-4 w-4" />
            History
            {conversations.length > 0 && (
              <span className="text-xs bg-gray-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded-full">
                {conversations.length}
              </span>
            )}
          </button>
        </div>

        {/* History panel */}
        {showHistory && (
          <div className="border-b border-gray-100 dark:border-zinc-800 max-h-64 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No conversations yet</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors group ${
                    conv.id === conversationId
                      ? "bg-amber-50 dark:bg-amber-900/10"
                      : "hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <button
                    onClick={() => loadConversation(conv.id)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(conv.updated_at).toLocaleDateString()}
                    </p>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Messages area */}
        <div ref={scrollRef} className="flex-1">
        {!hasMessages ? (
          <EmptyState
            firstName={firstName}
            userContext={userContext}
            onSuggestionClick={sendMessage}
          />
        ) : (
          <div className="py-8 space-y-8 max-w-2xl mx-auto w-full">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-gray-100 dark:bg-zinc-800 rounded-3xl px-5 py-3">
                      <p className="text-[15px] text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                        {renderMarkdown(message.content)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center gap-1.5 pt-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area — fixed at bottom */}
      <div className="flex-shrink-0 pb-4 pt-2">
        <form onSubmit={handleSubmit}>
          <div className="relative bg-gray-100 dark:bg-zinc-800 rounded-3xl border border-gray-200 dark:border-zinc-700 focus-within:border-gray-300 dark:focus-within:border-zinc-600 transition-colors">

            {showTools && (
              <div
                ref={toolsRef}
                className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden z-50 max-h-[360px] overflow-y-auto"
              >
                <div className="px-4 py-2.5 border-b border-gray-100 dark:border-zinc-800">
                  <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                    Available Actions
                  </p>
                </div>
                {Object.entries(
                  filteredTools.reduce(
                    (acc, tool) => {
                      if (!acc[tool.category]) acc[tool.category] = [];
                      acc[tool.category].push(tool);
                      return acc;
                    },
                    {} as Record<string, typeof filteredTools>
                  )
                ).map(([category, tools]) => (
                  <div key={category}>
                    <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase">
                      {category}
                    </p>
                    {tools.map((tool) => {
                      const globalIndex = filteredTools.indexOf(tool);
                      const Icon = tool.icon;
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => selectTool(tool)}
                          onMouseEnter={() => setSelectedToolIndex(globalIndex)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            globalIndex === selectedToolIndex
                              ? "bg-amber-50 dark:bg-amber-900/20"
                              : "hover:bg-gray-50 dark:hover:bg-zinc-800"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tool.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {tool.label}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                              {tool.description}
                            </p>
                          </div>
                          {tool.badge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tool.badgeColor}`}>
                              {tool.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
                {filteredTools.length === 0 && (
                  <p className="px-4 py-6 text-sm text-gray-400 text-center">
                    No actions found
                  </p>
                )}
              </div>
            )}

            <textarea
              ref={inputRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything or type @ for actions..."
              rows={1}
              disabled={!contextLoaded || isLoading}
              className="w-full bg-transparent resize-none px-5 pt-4 pb-12 text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none disabled:opacity-50 max-h-[200px]"
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (!showTools) {
                      setInput(input + "@");
                      setShowTools(true);
                      setToolFilter("");
                      setSelectedToolIndex(0);
                      inputRef.current?.focus();
                    } else {
                      setShowTools(false);
                    }
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    showTools
                      ? "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-zinc-700/50"
                  }`}
                  title="Type @ for actions"
                >
                  <AtSign className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className={`p-1.5 rounded-lg transition-colors ${
                    uploading
                      ? "text-amber-500 animate-pulse"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-zinc-700/50"
                  }`}
                  title="Upload a document"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.csv,.xls,.xlsx"
                  onChange={handleFileUpload}
                />
              </div>
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <button
                    type="button"
                    onClick={handleStop}
                    className="p-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
                  >
                    <Square className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim() || !contextLoaded}
                    className="p-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
        <p className="text-center text-xs text-gray-400 dark:text-zinc-500 mt-2">
          Prolify AI can make mistakes. Consult a CPA or attorney for definitive advice.
        </p>
      </div>
      </div>
    </div>
  );
}

function EmptyState({
  firstName,
  userContext,
  onSuggestionClick,
}: {
  firstName: string;
  userContext: UserContext | null;
  onSuggestionClick: (text: string) => void;
}) {
  const insightCards = buildInsightCards(userContext);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mb-6">
        <Sparkles className="h-6 w-6 text-white" />
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {firstName ? `Hi ${firstName}, how can I help?` : "How can I help you today?"}
      </h1>
      <p className="text-gray-500 dark:text-zinc-400 text-sm mb-8">
        Your AI Chief of Staff with 5 specialized copilots
      </p>

      <div className="flex gap-2 flex-wrap justify-center mb-8">
        {[
          { label: "Formation", icon: Building2, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20" },
          { label: "Compliance", icon: Shield, color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20" },
          { label: "Books & Tax", icon: TrendingUp, color: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20" },
          { label: "Knowledge", icon: BookOpen, color: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20" },
        ].map((tag) => {
          const Icon = tag.icon;
          return (
            <span
              key={tag.label}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${tag.color}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tag.label}
            </span>
          );
        })}
      </div>

      {insightCards.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-2xl mb-8">
          {insightCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl px-5 py-3 border border-gray-100 dark:border-zinc-800"
              >
                <Icon className={`h-5 w-5 ${card.color} flex-shrink-0`} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">
                    {card.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            onClick={() => onSuggestionClick(s.text)}
            className="text-left bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-4 hover:bg-gray-100 dark:hover:bg-zinc-750 hover:border-gray-300 dark:hover:border-zinc-600 transition-all group"
          >
            <span className="text-lg mb-1 block">{s.icon}</span>
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              {s.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function renderMarkdown(text: string) {
  if (!text) return null;

  return text.split("\n").map((line, i, arr) => {
    let html = line
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
      );

    if (line.startsWith("### ")) {
      html = `<span class="block text-base font-semibold mt-4 mb-1">${html.slice(4)}</span>`;
    } else if (line.startsWith("## ")) {
      html = `<span class="block text-lg font-semibold mt-4 mb-1">${html.slice(3)}</span>`;
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      html = `<span class="block pl-5 relative before:content-['•'] before:absolute before:left-1 before:text-gray-400">${html.slice(2)}</span>`;
    } else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+\.)\s(.*)/);
      if (match) {
        html = `<span class="block pl-5 relative"><span class="absolute left-0 text-gray-400">${match[1]}</span>${match[2].replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')}</span>`;
      }
    }

    return (
      <span
        key={i}
        dangerouslySetInnerHTML={{
          __html: html + (i < arr.length - 1 ? "<br/>" : ""),
        }}
      />
    );
  });
}

type InsightCard = {
  icon: typeof TrendingUp;
  color: string;
  title: string;
  description: string;
};

function buildInsightCards(ctx: UserContext | null): InsightCard[] {
  if (!ctx) return [];
  const cards: InsightCard[] = [];

  const overdueCount = ctx.complianceDates?.filter((d) => d.status === "overdue").length;
  const upcomingCount = ctx.complianceDates?.filter((d) => d.status === "upcoming").length;

  if (overdueCount && overdueCount > 0) {
    cards.push({
      icon: AlertCircle,
      color: "text-red-500",
      title: `${overdueCount} Overdue`,
      description: "Immediate attention needed",
    });
  } else if (upcomingCount && upcomingCount > 0) {
    cards.push({
      icon: CheckCircle,
      color: "text-green-500",
      title: "On Track",
      description: `${upcomingCount} upcoming deadline${upcomingCount > 1 ? "s" : ""}`,
    });
  }

  if (ctx.invoices) {
    cards.push({
      icon: TrendingUp,
      color: "text-blue-500",
      title: `$${ctx.invoices.total.toLocaleString()}`,
      description: ctx.invoices.outstanding > 0
        ? `$${ctx.invoices.outstanding.toLocaleString()} outstanding`
        : "All paid",
    });
  }

  if (ctx.expenses) {
    cards.push({
      icon: AlertCircle,
      color: "text-purple-500",
      title: `$${ctx.expenses.total.toLocaleString()}`,
      description: `${ctx.expenses.categories.length} expense categories`,
    });
  }

  return cards;
}

function detectDocumentType(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes("tax") || lower.includes("1120") || lower.includes("5472") || lower.includes("w9") || lower.includes("1099"))
    return "tax";
  if (lower.includes("article") || lower.includes("formation") || lower.includes("incorporate") || lower.includes("certificate") || lower.includes("ein"))
    return "formation";
  if (lower.includes("contract") || lower.includes("agreement") || lower.includes("nda") || lower.includes("operating"))
    return "contract";
  if (lower.includes("license") || lower.includes("permit"))
    return "license";
  return "other";
}