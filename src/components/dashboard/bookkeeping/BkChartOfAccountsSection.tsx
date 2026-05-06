"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  subtype: string;
  balance: number;
  description: string;
}

const TYPES = ["asset", "liability", "equity", "income", "expense"];
const TYPE_LABELS: Record<string, string> = {
  asset: "Assets", liability: "Liabilities", equity: "Equity", income: "Income", expense: "Expenses",
};
const SUBTYPES: Record<string, string[]> = {
  asset: ["Current Asset", "Fixed Asset", "Other Asset"],
  liability: ["Current Liability", "Long-term Liability"],
  equity: ["Owner's Equity", "Retained Earnings"],
  income: ["Operating Revenue", "Other Income"],
  expense: ["Operating Expense", "Cost of Goods Sold", "Other Expense"],
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function BkChartOfAccountsSection() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", type: "asset", subtype: "", description: "" });

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from("bk_accounts").select("*").eq("user_id", user.id).order("code");
    setAccounts(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!user || !form.code || !form.name) return;
    setSaving(true);
    await supabase.from("bk_accounts").insert({
      user_id: user.id,
      code: form.code,
      name: form.name,
      type: form.type,
      subtype: form.subtype,
      description: form.description,
      balance: 0,
    });
    setSaving(false);
    setShowModal(false);
    setForm({ code: "", name: "", type: "asset", subtype: "", description: "" });
    load();
  };

  const grouped = TYPES.reduce<Record<string, Account[]>>((acc, t) => {
    acc[t] = accounts.filter((a) => a.type === t);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#111111]">Chart of Accounts</h1>
        <Button
          onClick={() => setShowModal(true)}
          className="h-9 px-4 bg-[#111111] hover:bg-[#111111]/90 text-[#FACC15] text-sm font-semibold rounded-lg gap-2"
        >
          <Plus className="h-4 w-4" />
          New account
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FEF9C3] flex items-center justify-center mb-4">
            <Plus className="h-7 w-7 text-[#FACC15]" />
          </div>
          <p className="text-[#6B7280] text-sm mb-3">No accounts yet. Create your chart of accounts to get started.</p>
          <Button onClick={() => setShowModal(true)} className="h-9 px-4 bg-[#111111] text-[#FACC15] text-sm font-semibold rounded-lg">Create first account</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {TYPES.map((type) => {
            const items = grouped[type];
            if (!items || items.length === 0) return null;
            return (
              <div key={type} className="rounded-xl border border-[#E5E7EB] overflow-hidden">
                <div className="bg-[#F9FAFB] px-4 py-2 border-b border-[#E5E7EB]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">{TYPE_LABELS[type]}</span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      {["Code", "Account Name", "Type", "Subtype", "Balance"].map((h) => (
                        <th key={h} className={cn("px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]", h === "Balance" ? "text-right" : "text-left")}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((a) => (
                      <tr key={a.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA]">
                        <td className="px-4 py-2.5 text-[#6B7280] font-mono text-xs">{a.code}</td>
                        <td className="px-4 py-2.5 text-[#111111] font-medium">{a.name}</td>
                        <td className="px-4 py-2.5 text-[#6B7280] capitalize">{a.type}</td>
                        <td className="px-4 py-2.5 text-[#6B7280]">{a.subtype || "—"}</td>
                        <td className={cn("px-4 py-2.5 text-right font-semibold", a.balance >= 0 ? "text-[#16A34A]" : "text-[#DC2626]")}>{fmt(a.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {/* New Account Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#111111] text-lg">New Account</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-[#F3F4F6]"><X className="h-4 w-4 text-[#6B7280]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Code</label>
                <Input value={form.code} onChange={(e) => setForm(f => ({ ...f, code: e.target.value }))} className="h-9 text-sm border-[#E5E7EB] focus:border-[#FACC15]" placeholder="1000" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Type</label>
                <Select value={form.type} onValueChange={(v) => setForm(f => ({ ...f, type: v, subtype: "" }))}>
                  <SelectTrigger className="h-9 text-sm border-[#E5E7EB]"><SelectValue /></SelectTrigger>
                  <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Account Name</label>
              <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="h-9 text-sm border-[#E5E7EB] focus:border-[#FACC15]" placeholder="e.g. Cash & Cash Equivalents" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Subtype</label>
              <Select value={form.subtype} onValueChange={(v) => setForm(f => ({ ...f, subtype: v }))}>
                <SelectTrigger className="h-9 text-sm border-[#E5E7EB]"><SelectValue placeholder="Select subtype" /></SelectTrigger>
                <SelectContent>{(SUBTYPES[form.type] || []).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Description</label>
              <Input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className="h-9 text-sm border-[#E5E7EB] focus:border-[#FACC15]" placeholder="Optional description" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 h-9 border-[#E5E7EB] text-sm" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button disabled={saving || !form.code || !form.name} onClick={handleSave} className="flex-1 h-9 bg-[#111111] text-[#FACC15] font-semibold text-sm rounded-lg">
                {saving ? "Saving..." : "Create Account"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
