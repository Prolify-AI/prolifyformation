"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, TrendingDown, Landmark, ArrowRight, RefreshCw, Plus, Building2, Wifi, CircleAlert as AlertCircle, Receipt, ChartBar as BarChart2, CircleCheck as CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";

type BkSection =
  | "bk-financial-statements"
  | "bk-transactions"
  | "bk-cash-accounts"
  | "bk-bank-transactions"
  | "bk-settings";

interface Props {
  onNavigate: (section: BkSection) => void;
}

interface MonthBar { month: string; income: number; expenses: number }
interface RecentTxn { id: string; date: string; description: string; amount: number; type: "credit" | "debit"; category: string }
interface BankConn { id: string; display_name: string | null; institution_name: string; last4: string | null; balance_current: number | null; category: string }

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtFull = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const fmtCents = (n: number | null) =>
  n == null ? "—" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n / 100);

export default function BkDashboardSection({ onNavigate }: Props) {
  const { user, company } = useAuth();

  const [loadingKpi, setLoadingKpi] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [loadingTxns, setLoadingTxns] = useState(true);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [connectingBank, setConnectingBank] = useState(false);
  const [bankError, setBankError] = useState<string | null>(null);

  const [kpi, setKpi] = useState({ revenue: 0, expenses: 0, netIncome: 0, cashBalance: 0 });
  const [prevKpi, setPrevKpi] = useState({ revenue: 0, expenses: 0 });
  const [chartData, setChartData] = useState<MonthBar[]>([]);
  const [recentTxns, setRecentTxns] = useState<RecentTxn[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankConn[]>([]);
  const [uncategorizedCount, setUncategorizedCount] = useState(0);

  const loadData = useCallback(async () => {
    if (!user) return;

    const now = new Date();
    const thisStart = format(startOfMonth(now), "yyyy-MM-dd");
    const thisEnd = format(endOfMonth(now), "yyyy-MM-dd");
    const prevStart = format(startOfMonth(subMonths(now, 1)), "yyyy-MM-dd");
    const prevEnd = format(endOfMonth(subMonths(now, 1)), "yyyy-MM-dd");

    // KPIs — this month
    setLoadingKpi(true);
    const [{ data: thisTxns }, { data: prevTxns }] = await Promise.all([
      supabase.from("bk_transactions").select("amount,type").eq("user_id", user.id).gte("date", thisStart).lte("date", thisEnd),
      supabase.from("bk_transactions").select("amount,type").eq("user_id", user.id).gte("date", prevStart).lte("date", prevEnd),
    ]);
    const revenue = (thisTxns || []).filter(t => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0);
    const expenses = (thisTxns || []).filter(t => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0);
    const prevRevenue = (prevTxns || []).filter(t => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0);
    const prevExpenses = (prevTxns || []).filter(t => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0);
    setKpi({ revenue, expenses, netIncome: revenue - expenses, cashBalance: 0 });
    setPrevKpi({ revenue: prevRevenue, expenses: prevExpenses });
    setLoadingKpi(false);

    // 6-month chart
    setLoadingChart(true);
    const sixStart = format(startOfMonth(subMonths(now, 5)), "yyyy-MM-dd");
    const { data: chartTxns } = await supabase
      .from("bk_transactions").select("date,amount,type").eq("user_id", user.id)
      .gte("date", sixStart).lte("date", thisEnd);
    const bars: MonthBar[] = Array.from({ length: 6 }, (_, i) => {
      const m = subMonths(now, 5 - i);
      const label = format(m, "MMM");
      const ms = format(startOfMonth(m), "yyyy-MM-dd");
      const me = format(endOfMonth(m), "yyyy-MM-dd");
      const mt = (chartTxns || []).filter(t => t.date >= ms && t.date <= me);
      return {
        month: label,
        income: mt.filter(t => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0),
        expenses: mt.filter(t => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0),
      };
    });
    setChartData(bars);
    setLoadingChart(false);

    // Recent transactions
    setLoadingTxns(true);
    const { data: txns } = await supabase
      .from("bk_transactions").select("*").eq("user_id", user.id)
      .order("date", { ascending: false }).limit(5);
    setRecentTxns(txns || []);
    setLoadingTxns(false);

    // Uncategorized bank transactions count
    const { count } = await supabase
      .from("bk_bank_transactions").select("*", { count: "exact", head: true })
      .eq("user_id", user.id).eq("status", "uncategorized");
    setUncategorizedCount(count || 0);

    // Bank accounts
    setLoadingBanks(true);
    const { data: banks } = await supabase
      .from("bank_connections").select("stripe_account_id,display_name,institution_name,last4,balance_current,category")
      .eq("user_id", user.id).eq("status", "active").order("created_at", { ascending: false });
    setBankAccounts((banks || []).map(b => ({ id: b.stripe_account_id, display_name: b.display_name, institution_name: b.institution_name, last4: b.last4, balance_current: b.balance_current, category: b.category })));
    setLoadingBanks(false);
    const totalCash = (banks || []).reduce((s, b) => s + (b.balance_current ?? 0), 0);
    setKpi(prev => ({ ...prev, cashBalance: totalCash / 100 }));
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleConnectBank = async () => {
    setConnectingBank(true);
    setBankError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const res = await fetch("/api/stripe/fc-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create session");
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) throw new Error("Stripe failed to load");
      const result = await stripe.collectFinancialConnectionsAccounts({ clientSecret: data.clientSecret });
      if (result.error) throw new Error(result.error.message);
      for (const acct of result.financialConnectionsSession?.accounts ?? []) {
        await fetch(`/api/stripe/fc-accounts?accountId=${acct.id}`, { headers: { Authorization: `Bearer ${session.access_token}` } });
        await supabase.from("bank_connections").upsert({
          user_id: user!.id,
          company_id: company?.id ?? null,
          stripe_account_id: acct.id,
          institution_name: acct.institution_name,
          display_name: acct.display_name ?? null,
          last4: acct.last4 ?? null,
          category: acct.category,
          status: "active",
          currency: "usd",
          synced_at: new Date().toISOString(),
        }, { onConflict: "user_id,stripe_account_id" });
      }
      loadData();
    } catch (err: unknown) {
      setBankError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setConnectingBank(false);
    }
  };

  const revChange = prevKpi.revenue > 0 ? ((kpi.revenue - prevKpi.revenue) / prevKpi.revenue) * 100 : null;
  const expChange = prevKpi.expenses > 0 ? ((kpi.expenses - prevKpi.expenses) / prevKpi.expenses) * 100 : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111111]">Bookkeeping Overview</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">{format(new Date(), "MMMM yyyy")}</p>
        </div>
        <Button
          onClick={loadData}
          variant="outline"
          className="h-9 px-3 border-[#E5E7EB] text-[#6B7280] hover:text-[#111111] text-sm gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loadingKpi ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <KpiCard
              label="Revenue MTD"
              value={fmt(kpi.revenue)}
              change={revChange}
              positive
              sub="vs last month"
              accent
            />
            <KpiCard
              label="Expenses MTD"
              value={fmt(kpi.expenses)}
              change={expChange != null ? -expChange : null}
              positive={false}
              sub="vs last month"
            />
            <KpiCard
              label="Net Income"
              value={fmt(kpi.netIncome)}
              valueColor={kpi.netIncome >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"}
              sub="this month"
            />
            <KpiCard
              label="Cash Balance"
              value={fmt(kpi.cashBalance)}
              valueColor="text-[#111111]"
              sub={bankAccounts.length > 0 ? `${bankAccounts.length} account${bankAccounts.length !== 1 ? "s" : ""}` : "no accounts"}
            />
          </>
        )}
      </div>

      {/* Chart + Banks side by side */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue vs Expenses Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#111111] text-sm">Revenue vs Expenses — Last 6 Months</h3>
            <button onClick={() => onNavigate("bk-financial-statements")} className="text-xs font-semibold text-[#FACC15] hover:text-[#EAB308] flex items-center gap-1 transition-colors">
              Full report <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {loadingChart ? (
            <Skeleton className="h-48 w-full" />
          ) : chartData.every(d => d.income === 0 && d.expenses === 0) ? (
            <EmptyChart onAdd={() => onNavigate("bk-transactions")} />
          ) : (
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={chartData} barGap={3} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: number, name: string) => [fmtFull(v), name === "income" ? "Revenue" : "Expenses"]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: 12 }}
                />
                <Bar dataKey="income" fill="#FACC15" radius={[3, 3, 0, 0]} name="income" />
                <Bar dataKey="expenses" fill="#111111" radius={[3, 3, 0, 0]} name="expenses" />
              </BarChart>
            </ResponsiveContainer>
          )}
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-[#6B7280]"><span className="w-3 h-3 rounded-sm bg-[#FACC15] inline-block" />Revenue</span>
            <span className="flex items-center gap-1.5 text-xs text-[#6B7280]"><span className="w-3 h-3 rounded-sm bg-[#111111] inline-block" />Expenses</span>
          </div>
        </div>

        {/* Bank Accounts Panel */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#111111] text-sm">Bank Accounts</h3>
            {bankAccounts.length > 0 && (
              <button onClick={() => onNavigate("bk-cash-accounts")} className="text-xs font-semibold text-[#FACC15] hover:text-[#EAB308] flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>

          {bankError && (
            <div className="mb-3 p-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs">{bankError}</div>
          )}

          {loadingBanks ? (
            <div className="space-y-2 flex-1">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
          ) : bankAccounts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF9C3] flex items-center justify-center mb-3">
                <Landmark className="h-6 w-6 text-[#FACC15]" />
              </div>
              <p className="text-sm font-semibold text-[#374151] mb-1">No accounts connected</p>
              <p className="text-xs text-[#9CA3AF] mb-4">Sync live balances via Stripe Financial Connections.</p>
              <Button
                onClick={handleConnectBank}
                disabled={connectingBank}
                className="h-8 px-4 bg-[#111111] text-[#FACC15] font-semibold text-xs rounded-lg gap-1.5"
              >
                {connectingBank ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" />Connecting…</> : <><Plus className="h-3.5 w-3.5" />Connect bank</>}
              </Button>
            </div>
          ) : (
            <div className="space-y-2 flex-1">
              {bankAccounts.slice(0, 3).map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
                      <Building2 className="h-4 w-4 text-[#6B7280]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#111111] truncate flex items-center gap-1">
                        {b.display_name || b.institution_name}
                        <CheckCircle className="h-3 w-3 text-[#16A34A] shrink-0" />
                      </p>
                      <p className="text-[10px] text-[#9CA3AF]">{b.last4 ? `···${b.last4}` : b.category}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#111111] shrink-0">{fmtCents(b.balance_current)}</p>
                </div>
              ))}
              <Button
                onClick={handleConnectBank}
                disabled={connectingBank}
                variant="outline"
                className="w-full h-8 border-dashed border-[#E5E7EB] text-xs text-[#6B7280] hover:text-[#111111] gap-1.5 mt-1"
              >
                {connectingBank ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" />Connecting…</> : <><Plus className="h-3.5 w-3.5" />Add account</>}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB]">
            <h3 className="font-semibold text-[#111111] text-sm">Recent Transactions</h3>
            <button onClick={() => onNavigate("bk-transactions")} className="text-xs font-semibold text-[#FACC15] hover:text-[#EAB308] flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {loadingTxns ? (
            <div className="p-4 space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : recentTxns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-5">
              <Receipt className="h-8 w-8 text-[#E5E7EB] mb-2" />
              <p className="text-sm text-[#6B7280] mb-3">No transactions yet.</p>
              <Button onClick={() => onNavigate("bk-transactions")} className="h-8 px-4 bg-[#111111] text-[#FACC15] text-xs font-semibold rounded-lg gap-1.5">
                <Plus className="h-3.5 w-3.5" />Add transaction
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-[#F3F4F6]">
              {recentTxns.map(t => (
                <div key={t.id} className="flex items-center justify-between px-5 py-3 hover:bg-[#FAFAFA] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", t.type === "credit" ? "bg-[#DCFCE7]" : "bg-red-50")}>
                      {t.type === "credit"
                        ? <TrendingUp className="h-3.5 w-3.5 text-[#16A34A]" />
                        : <TrendingDown className="h-3.5 w-3.5 text-[#DC2626]" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#111111] truncate">{t.description || "Untitled"}</p>
                      <p className="text-xs text-[#9CA3AF]">{format(new Date(t.date), "MMM d, yyyy")} {t.category && <span className="ml-1">· {t.category}</span>}</p>
                    </div>
                  </div>
                  <p className={cn("text-sm font-semibold shrink-0 ml-3", t.type === "credit" ? "text-[#16A34A]" : "text-[#DC2626]")}>
                    {t.type === "credit" ? "+" : "-"}{fmtFull(Math.abs(t.amount))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          {/* Uncategorized alert */}
          {uncategorizedCount > 0 && (
            <button
              onClick={() => onNavigate("bk-bank-transactions")}
              className="w-full bg-[#FEF9C3] border border-[#FACC15] rounded-xl p-4 flex items-start gap-3 text-left hover:bg-[#FEF08A] transition-colors"
            >
              <AlertCircle className="h-5 w-5 text-[#92700A] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#111111]">{uncategorizedCount} uncategorized</p>
                <p className="text-xs text-[#92700A] mt-0.5">Bank transactions need categorization.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#92700A] shrink-0 ml-auto mt-0.5" />
            </button>
          )}

          {/* Quick action cards */}
          {[
            { icon: BarChart2, label: "Financial Statements", desc: "P&L, Balance Sheet, Cash Flow", section: "bk-financial-statements" as BkSection, color: "bg-[#F9FAFB]" },
            { icon: Receipt, label: "Bank Transactions", desc: "Review & categorize imports", section: "bk-bank-transactions" as BkSection, color: "bg-[#F9FAFB]" },
          ].map(item => (
            <button
              key={item.section}
              onClick={() => onNavigate(item.section)}
              className={cn("w-full border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3 text-left hover:border-[#FACC15] hover:bg-[#FEFCE8] transition-all group", item.color)}
            >
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0 group-hover:bg-[#FEF9C3] group-hover:border-[#FACC15] transition-all">
                <item.icon className="h-4 w-4 text-[#6B7280] group-hover:text-[#111111] transition-colors" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#111111]">{item.label}</p>
                <p className="text-xs text-[#9CA3AF] truncate">{item.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#D1D5DB] group-hover:text-[#FACC15] shrink-0 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label, value, change, positive, sub, accent, valueColor,
}: {
  label: string; value: string; change?: number | null; positive?: boolean; sub?: string; accent?: boolean; valueColor?: string;
}) {
  const hasChange = change != null;
  const isUp = (change ?? 0) >= 0;
  const changeCls = isUp === positive ? "text-[#16A34A]" : "text-[#DC2626]";
  return (
    <div className={cn("rounded-xl p-4 border flex flex-col justify-between min-h-[110px]", accent ? "bg-[#FACC15] border-[#EAB308]" : "bg-white border-[#E5E7EB]")}>
      <p className={cn("text-xs font-semibold uppercase tracking-wider mb-2", accent ? "text-black/60" : "text-[#6B7280]")}>{label}</p>
      <div>
        <p className={cn("text-2xl font-bold leading-none mb-1", accent ? "text-black" : (valueColor || (positive ? "text-[#16A34A]" : "text-[#DC2626]")))}>{value}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {hasChange && (
            <span className={cn("text-[10px] font-bold flex items-center gap-0.5", accent ? "text-black/70" : changeCls)}>
              {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(change!).toFixed(1)}%
            </span>
          )}
          {sub && <span className={cn("text-[10px]", accent ? "text-black/50" : "text-[#9CA3AF]")}>{sub}</span>}
        </div>
      </div>
    </div>
  );
}

function EmptyChart({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="h-48 flex flex-col items-center justify-center gap-3 border border-dashed border-[#E5E7EB] rounded-xl">
      <BarChart2 className="h-8 w-8 text-[#E5E7EB]" />
      <p className="text-sm text-[#9CA3AF]">No transaction data yet.</p>
      <Button onClick={onAdd} className="h-8 px-4 bg-[#111111] text-[#FACC15] text-xs font-semibold rounded-lg gap-1.5">
        <Plus className="h-3.5 w-3.5" />Add transactions
      </Button>
    </div>
  );
}
