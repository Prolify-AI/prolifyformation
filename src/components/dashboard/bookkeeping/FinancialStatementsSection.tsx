"use client";

import { useState, useEffect, useCallback } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

type Tab = "pl" | "balance" | "cashflow";

interface MonthlyTotal {
  month: string; // "Jan 2025"
  income: number;
  expenses: number;
  netIncome: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const amtCls = (n: number) => (n >= 0 ? "text-[#16A34A]" : "text-[#DC2626]");

function EmptyState({ message, cta }: { message: string; cta?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#FEF9C3] flex items-center justify-center mb-4">
        <Download className="h-7 w-7 text-[#FACC15]" />
      </div>
      <p className="text-[#6B7280] text-sm mb-2">{message}</p>
      {cta && <p className="text-xs text-[#9CA3AF]">{cta}</p>}
    </div>
  );
}

function PLTab() {
  const { user } = useAuth();
  const [period, setPeriod] = useState("12");
  const [thruDate, setThruDate] = useState(format(new Date(), "yyyy-MM"));
  const [appliedPeriod, setAppliedPeriod] = useState("12");
  const [appliedThru, setAppliedThru] = useState(format(new Date(), "yyyy-MM"));
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MonthlyTotal[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const endDate = endOfMonth(parseISO(appliedThru + "-01"));
      const startDate = startOfMonth(subMonths(endDate, parseInt(appliedPeriod) - 1));

      const { data: txns } = await supabase
        .from("bk_transactions")
        .select("date, amount, type, category")
        .eq("user_id", user.id)
        .gte("date", format(startDate, "yyyy-MM-dd"))
        .lte("date", format(endDate, "yyyy-MM-dd"))
        .order("date");

      const months: MonthlyTotal[] = [];
      for (let i = 0; i < parseInt(appliedPeriod); i++) {
        const m = subMonths(endDate, parseInt(appliedPeriod) - 1 - i);
        const label = format(m, "MMM yyyy");
        const monthStr = format(m, "yyyy-MM");
        const monthTxns = (txns || []).filter((t) => t.date.startsWith(monthStr));
        const income = monthTxns.filter((t) => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0);
        const expenses = monthTxns.filter((t) => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0);
        months.push({ month: label, income, expenses, netIncome: income - expenses });
      }
      setData(months);
    } finally {
      setLoading(false);
    }
  }, [user, appliedPeriod, appliedThru]);

  useEffect(() => { load(); }, [load]);

  const totalIncome = data.reduce((s, m) => s + m.income, 0);
  const totalExpenses = data.reduce((s, m) => s + m.expenses, 0);
  const totalNet = totalIncome - totalExpenses;
  const hasData = data.some((m) => m.income > 0 || m.expenses > 0);

  const visibleMonths = data.slice(-6);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36 h-9 text-sm border-[#E5E7EB]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["3","6","12","24"].map((v) => (
              <SelectItem key={v} value={v}>{v} months</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-[#6B7280]">thru</span>
        <input
          type="month"
          value={thruDate}
          onChange={(e) => setThruDate(e.target.value)}
          className="h-9 px-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#FACC15]"
        />
        <Button
          onClick={() => { setAppliedPeriod(period); setAppliedThru(thruDate); }}
          className="h-9 px-4 bg-[#111111] hover:bg-[#111111]/90 text-[#FACC15] text-sm font-semibold rounded-lg"
        >
          Apply
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      ) : !hasData ? (
        <EmptyState message="No transactions found for this period." cta="Add transactions or connect a bank account to see your P&L." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] w-48">Account</th>
                {visibleMonths.map((m) => (
                  <th key={m.month} className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">{m.month}</th>
                ))}
                <th className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Total</th>
              </tr>
            </thead>
            <tbody>
              {/* Income */}
              <tr className="bg-[#F9FAFB]">
                <td className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]" colSpan={visibleMonths.length + 2}>Income</td>
              </tr>
              <tr className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA]">
                <td className="px-4 py-2.5 text-[#374151]">Revenue</td>
                {visibleMonths.map((m) => (
                  <td key={m.month} className={cn("px-4 py-2.5 text-right", amtCls(m.income))}>{fmt(m.income)}</td>
                ))}
                <td className={cn("px-4 py-2.5 text-right font-semibold", amtCls(totalIncome))}>{fmt(totalIncome)}</td>
              </tr>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <td className="px-4 py-2.5 font-semibold text-[#111111]">Total Income</td>
                {visibleMonths.map((m) => (
                  <td key={m.month} className={cn("px-4 py-2.5 text-right font-semibold", amtCls(m.income))}>{fmt(m.income)}</td>
                ))}
                <td className={cn("px-4 py-2.5 text-right font-semibold", amtCls(totalIncome))}>{fmt(totalIncome)}</td>
              </tr>
              <tr className="border-b border-[#E5E7EB]">
                <td className="px-4 py-2.5 font-semibold text-[#111111]">Gross Profit</td>
                {visibleMonths.map((m) => (
                  <td key={m.month} className={cn("px-4 py-2.5 text-right font-semibold", amtCls(m.income))}>{fmt(m.income)}</td>
                ))}
                <td className={cn("px-4 py-2.5 text-right font-semibold", amtCls(totalIncome))}>{fmt(totalIncome)}</td>
              </tr>

              {/* Expenses */}
              <tr className="bg-[#F9FAFB]">
                <td className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]" colSpan={visibleMonths.length + 2}>Expenses</td>
              </tr>
              {["G&A", "Software & Tools", "Professional Services"].map((cat) => (
                <tr key={cat} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA]">
                  <td className="px-4 py-2.5 text-[#374151] pl-8">{cat}</td>
                  {visibleMonths.map((m) => {
                    const v = m.expenses / 3;
                    return <td key={m.month} className={cn("px-4 py-2.5 text-right", v > 0 ? "text-[#DC2626]" : "text-[#6B7280]")}>{fmt(-v)}</td>;
                  })}
                  <td className={cn("px-4 py-2.5 text-right", totalExpenses > 0 ? "text-[#DC2626]" : "text-[#6B7280]")}>{fmt(-totalExpenses / 3)}</td>
                </tr>
              ))}
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <td className="px-4 py-2.5 font-semibold text-[#111111]">Total Expenses</td>
                {visibleMonths.map((m) => (
                  <td key={m.month} className={cn("px-4 py-2.5 text-right font-semibold", m.expenses > 0 ? "text-[#DC2626]" : "text-[#6B7280]")}>{fmt(-m.expenses)}</td>
                ))}
                <td className={cn("px-4 py-2.5 text-right font-semibold", totalExpenses > 0 ? "text-[#DC2626]" : "text-[#6B7280]")}>{fmt(-totalExpenses)}</td>
              </tr>

              {/* Net Income */}
              <tr className="bg-[#FEF9C3]">
                <td className="px-4 py-3 font-bold text-[#111111] text-sm">Net Income</td>
                {visibleMonths.map((m) => (
                  <td key={m.month} className={cn("px-4 py-3 text-right font-bold text-sm", amtCls(m.netIncome))}>{fmt(m.netIncome)}</td>
                ))}
                <td className={cn("px-4 py-3 text-right font-bold text-sm", amtCls(totalNet))}>{fmt(totalNet)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BalanceSheetTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<{ type: string; name: string; balance: number }[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("bk_accounts")
        .select("type, name, balance")
        .eq("user_id", user.id)
        .order("type");
      setAccounts(data || []);
      setLoading(false);
    })();
  }, [user]);

  const groups = [
    { label: "Assets", types: ["asset"] },
    { label: "Liabilities", types: ["liability"] },
    { label: "Equity", types: ["equity"] },
  ];

  const hasData = accounts.length > 0;

  return loading ? (
    <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
  ) : !hasData ? (
    <EmptyState message="No accounts found." cta="Add accounts in Chart of Accounts to see your Balance Sheet." />
  ) : (
    <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Account</th>
            <th className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Current</th>
            <th className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Previous</th>
            <th className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Change</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => {
            const items = accounts.filter((a) => g.types.includes(a.type));
            const total = items.reduce((s, a) => s + a.balance, 0);
            if (items.length === 0) return null;
            return (
              <>
                <tr key={g.label + "-header"} className="bg-[#F9FAFB]">
                  <td className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]" colSpan={4}>{g.label}</td>
                </tr>
                {items.map((a) => (
                  <tr key={a.name} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA]">
                    <td className="px-4 py-2.5 pl-8 text-[#374151]">{a.name}</td>
                    <td className={cn("px-4 py-2.5 text-right", amtCls(a.balance))}>{fmt(a.balance)}</td>
                    <td className="px-4 py-2.5 text-right text-[#6B7280]">{fmt(0)}</td>
                    <td className={cn("px-4 py-2.5 text-right", amtCls(a.balance))}>{fmt(a.balance)}</td>
                  </tr>
                ))}
                <tr key={g.label + "-total"} className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <td className="px-4 py-2.5 font-semibold text-[#111111]">Total {g.label}</td>
                  <td className={cn("px-4 py-2.5 text-right font-semibold", amtCls(total))}>{fmt(total)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-[#6B7280]">{fmt(0)}</td>
                  <td className={cn("px-4 py-2.5 text-right font-semibold", amtCls(total))}>{fmt(total)}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CashFlowTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [inflows, setInflows] = useState(0);
  const [outflows, setOutflows] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("bk_transactions")
        .select("amount, type")
        .eq("user_id", user.id);
      const credits = (data || []).filter((t) => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0);
      const debits = (data || []).filter((t) => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0);
      setInflows(credits);
      setOutflows(debits);
      setLoading(false);
    })();
  }, [user]);

  const net = inflows - outflows;

  const sections = [
    { label: "Operating Activities", inflows, outflows },
    { label: "Investing Activities", inflows: 0, outflows: 0 },
    { label: "Financing Activities", inflows: 0, outflows: 0 },
  ];

  return loading ? (
    <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
  ) : inflows === 0 && outflows === 0 ? (
    <EmptyState message="No cash flow data found." cta="Add transactions to generate a Cash Flow Statement." />
  ) : (
    <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Category</th>
            <th className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Inflows</th>
            <th className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Outflows</th>
            <th className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Net</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((s) => (
            <>
              <tr key={s.label + "-header"} className="bg-[#F9FAFB]">
                <td className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]" colSpan={4}>{s.label}</td>
              </tr>
              <tr key={s.label} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA]">
                <td className="px-4 py-2.5 pl-8 text-[#374151]">Net {s.label}</td>
                <td className="px-4 py-2.5 text-right text-[#16A34A]">{fmt(s.inflows)}</td>
                <td className="px-4 py-2.5 text-right text-[#DC2626]">{fmt(-s.outflows)}</td>
                <td className={cn("px-4 py-2.5 text-right", amtCls(s.inflows - s.outflows))}>{fmt(s.inflows - s.outflows)}</td>
              </tr>
            </>
          ))}
          <tr className="bg-[#FEF9C3]">
            <td className="px-4 py-3 font-bold text-[#111111]">Net Change in Cash</td>
            <td className="px-4 py-3 text-right font-bold text-[#16A34A]">{fmt(inflows)}</td>
            <td className="px-4 py-3 text-right font-bold text-[#DC2626]">{fmt(-outflows)}</td>
            <td className={cn("px-4 py-3 text-right font-bold", amtCls(net))}>{fmt(net)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function FinancialStatementsSection() {
  const [tab, setTab] = useState<Tab>("pl");

  const tabs: { id: Tab; label: string }[] = [
    { id: "pl", label: "Profit & Loss" },
    { id: "balance", label: "Balance Sheet" },
    { id: "cashflow", label: "Cash Flow Statement" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#111111]">Financial Statements</h1>
        <Button className="h-9 px-4 bg-[#111111] hover:bg-[#111111]/90 text-[#FACC15] text-sm font-semibold rounded-lg gap-2">
          <Download className="h-4 w-4" />
          Download xlsx
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#E5E7EB] mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-all duration-150 -mb-px",
              tab === t.id
                ? "border-b-2 border-[#FACC15] text-[#111111] font-bold"
                : "text-[#6B7280] hover:text-[#111111]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pl" && <PLTab />}
      {tab === "balance" && <BalanceSheetTab />}
      {tab === "cashflow" && <CashFlowTab />}
    </div>
  );
}
