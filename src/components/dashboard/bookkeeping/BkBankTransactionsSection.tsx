"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface BankTxn {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  status: "categorized" | "uncategorized";
  category: string;
  bank_account_id: string | null;
}

const CATEGORIES = ["Revenue", "G&A", "Software & Tools", "Professional Services", "Payroll", "Marketing", "Other"];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(n));

const PAGE_SIZE = 25;

export default function BkBankTransactionsSection() {
  const { user } = useAuth();
  const [txns, setTxns] = useState<BankTxn[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [categorizing, setCategorizing] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let q = supabase
        .from("bk_bank_transactions")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (search) q = q.ilike("description", `%${search}%`);
      if (filterStatus !== "all") q = q.eq("status", filterStatus);
      if (filterType !== "all") q = q.eq("type", filterType);

      const { data, count } = await q;
      setTxns(data || []);
      setTotal(count || 0);
    } finally {
      setLoading(false);
    }
  }, [user, page, search, filterStatus, filterType]);

  useEffect(() => { load(); }, [load]);

  const handleCategorize = async (id: string, category: string) => {
    if (!user || !category) return;
    setCategorizing((prev) => ({ ...prev, [id]: "saving" }));
    await supabase
      .from("bk_bank_transactions")
      .update({ category, status: "categorized" })
      .eq("id", id)
      .eq("user_id", user.id);
    setCategorizing((prev) => ({ ...prev, [id]: "" }));
    load();
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#111111]">Bank Transactions</h1>
        <Button className="h-9 px-4 bg-[#111111] hover:bg-[#111111]/90 text-[#FACC15] text-sm font-semibold rounded-lg gap-2">
          <Plus className="h-4 w-4" />
          Connect bank
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <Input placeholder="Search transactions..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="pl-9 h-9 border-[#E5E7EB] text-sm" />
        </div>
        <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(0); }}>
          <SelectTrigger className="w-36 h-9 text-sm border-[#E5E7EB]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="credit">Credit</SelectItem>
            <SelectItem value="debit">Debit</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(0); }}>
          <SelectTrigger className="w-40 h-9 text-sm border-[#E5E7EB]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="categorized">Categorized</SelectItem>
            <SelectItem value="uncategorized">Uncategorized</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : txns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#E5E7EB] rounded-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#FEF9C3] flex items-center justify-center mb-4">
            <Plus className="h-7 w-7 text-[#FACC15]" />
          </div>
          <p className="text-[#6B7280] text-sm mb-3">No bank transactions yet.</p>
          <p className="text-xs text-[#9CA3AF]">Connect a bank account to import transactions automatically.</p>
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
                {txns.map((t) => (
                  <tr key={t.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">{format(new Date(t.date), "MMM d, yyyy")}</td>
                    <td className="px-4 py-3 text-[#111111] font-medium max-w-[200px] truncate">{t.description}</td>
                    <td className="px-4 py-3">
                      {t.status === "uncategorized" ? (
                        <div className="flex items-center gap-2">
                          <Select
                            value=""
                            onValueChange={(v) => handleCategorize(t.id, v)}
                            disabled={categorizing[t.id] === "saving"}
                          >
                            <SelectTrigger className="h-7 text-xs border-[#FACC15] text-[#FACC15] font-semibold w-36">
                              <SelectValue placeholder="Categorize →" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <span className="text-[#374151]">{t.category}</span>
                      )}
                    </td>
                    <td className={cn("px-4 py-3 text-right font-semibold", t.type === "credit" ? "text-[#16A34A]" : "text-[#DC2626]")}>
                      {t.type === "credit" ? "+" : "-"}{fmt(t.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", t.status === "categorized" ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#F3F4F6] text-[#374151]")}>
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
  );
}
