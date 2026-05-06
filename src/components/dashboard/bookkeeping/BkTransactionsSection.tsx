"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "credit" | "debit";
  status: "cleared" | "pending";
  notes: string;
}

const CATEGORIES = ["Revenue", "G&A", "Software & Tools", "Professional Services", "Payroll", "Marketing", "Other"];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(n));

const PAGE_SIZE = 25;

export default function BkTransactionsSection() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    category: "",
    amount: "",
    type: "debit" as "credit" | "debit",
    status: "pending" as "cleared" | "pending",
    notes: "",
  });

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let q = supabase
        .from("bk_transactions")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (search) q = q.ilike("description", `%${search}%`);
      if (filterStatus !== "all") q = q.eq("status", filterStatus);
      if (filterCategory !== "all") q = q.eq("category", filterCategory);

      const { data, count } = await q;
      setTransactions(data || []);
      setTotal(count || 0);
    } finally {
      setLoading(false);
    }
  }, [user, page, search, filterStatus, filterCategory]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!user || !form.description || !form.amount) return;
    setSaving(true);
    await supabase.from("bk_transactions").insert({
      user_id: user.id,
      date: form.date,
      description: form.description,
      category: form.category,
      amount: parseFloat(form.amount),
      type: form.type,
      status: form.status,
      notes: form.notes,
    });
    setSaving(false);
    setShowPanel(false);
    setForm({ date: format(new Date(), "yyyy-MM-dd"), description: "", category: "", amount: "", type: "debit", status: "pending", notes: "" });
    load();
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#111111]">Transactions</h1>
          <Button
            onClick={() => setShowPanel(true)}
            className="h-9 px-4 bg-[#111111] hover:bg-[#111111]/90 text-[#FACC15] text-sm font-semibold rounded-lg gap-2"
          >
            <Plus className="h-4 w-4" />
            Add entry
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9 h-9 border-[#E5E7EB] text-sm"
            />
          </div>
          <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setPage(0); }}>
            <SelectTrigger className="w-40 h-9 text-sm border-[#E5E7EB]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(0); }}>
            <SelectTrigger className="w-36 h-9 text-sm border-[#E5E7EB]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="cleared">Cleared</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF9C3] flex items-center justify-center mb-4">
              <Plus className="h-7 w-7 text-[#FACC15]" />
            </div>
            <p className="text-[#6B7280] text-sm mb-3">No transactions yet.</p>
            <Button onClick={() => setShowPanel(true)} className="h-9 px-4 bg-[#111111] text-[#FACC15] text-sm font-semibold rounded-lg">Add your first entry</Button>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    {["Date", "Description", "Category", "Amount", "Status"].map((h) => (
                      <th key={h} className={cn("px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]", h === "Amount" || h === "Status" ? "text-right" : "text-left")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">{format(new Date(t.date), "MMM d, yyyy")}</td>
                      <td className="px-4 py-3 text-[#111111] font-medium max-w-[200px] truncate">{t.description}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{t.category || <span className="text-[#9CA3AF] italic">Uncategorized</span>}</td>
                      <td className={cn("px-4 py-3 text-right font-semibold", t.type === "credit" ? "text-[#16A34A]" : "text-[#DC2626]")}>
                        {t.type === "credit" ? "+" : "-"}{fmt(t.amount)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", t.status === "cleared" ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEF9C3] text-[#92700A]")}>
                          {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm text-[#6B7280]">
                <span>Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}</span>
                <div className="flex gap-2">
                  <Button variant="outline" className="h-8 px-3 text-xs border-[#E5E7EB]" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
                  <Button variant="outline" className="h-8 px-3 text-xs border-[#E5E7EB]" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Entry Panel */}
      {showPanel && (
        <div className="w-80 border-l border-[#E5E7EB] bg-white p-5 flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#111111]">Add Entry</h2>
            <button onClick={() => setShowPanel(false)} className="p-1 rounded hover:bg-[#F3F4F6]"><X className="h-4 w-4 text-[#6B7280]" /></button>
          </div>
          {[
            { label: "Date", type: "date", key: "date" },
            { label: "Description", type: "text", key: "description" },
            { label: "Amount", type: "number", key: "amount" },
          ].map(({ label, type, key }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-[#374151] mb-1">{label}</label>
              <Input type={type} value={(form as Record<string, string>)[key]} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))} className="h-9 text-sm border-[#E5E7EB] focus:border-[#FACC15]" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Category</label>
            <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}>
              <SelectTrigger className="h-9 text-sm border-[#E5E7EB]"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Type</label>
            <Select value={form.type} onValueChange={(v: "credit" | "debit") => setForm(f => ({ ...f, type: v }))}>
              <SelectTrigger className="h-9 text-sm border-[#E5E7EB]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Credit (Income)</SelectItem>
                <SelectItem value="debit">Debit (Expense)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Status</label>
            <Select value={form.status} onValueChange={(v: "cleared" | "pending") => setForm(f => ({ ...f, status: v }))}>
              <SelectTrigger className="h-9 text-sm border-[#E5E7EB]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cleared">Cleared</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full h-20 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#FACC15] resize-none" placeholder="Optional notes..." />
          </div>
          <Button onClick={handleSave} disabled={saving || !form.description || !form.amount} className="bg-[#111111] hover:bg-[#111111]/90 text-[#FACC15] font-semibold h-9 rounded-lg">
            {saving ? "Saving..." : "Save Entry"}
          </Button>
        </div>
      )}
    </div>
  );
}
