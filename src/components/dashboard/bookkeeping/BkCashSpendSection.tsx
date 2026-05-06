"use client";

import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

interface MonthSpend {
  month: string;
  total: number;
}

interface VendorRow {
  vendor: string;
  category: string;
  months: number[];
  total: number;
}

export default function BkCashSpendSection() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [periodMonths, setPeriodMonths] = useState("6");
  const [chartData, setChartData] = useState<MonthSpend[]>([]);
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [monthLabels, setMonthLabels] = useState<string[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const now = new Date();
      const n = parseInt(periodMonths);
      const labels: string[] = [];
      const chart: MonthSpend[] = [];

      const monthRanges = Array.from({ length: n }, (_, i) => {
        const m = subMonths(now, n - 1 - i);
        return {
          label: format(m, "MMM yyyy"),
          start: format(startOfMonth(m), "yyyy-MM-dd"),
          end: format(endOfMonth(m), "yyyy-MM-dd"),
        };
      });

      monthRanges.forEach((r) => labels.push(r.label));

      const { data: txns } = await supabase
        .from("bk_transactions")
        .select("date, amount, type, category, description")
        .eq("user_id", user.id)
        .eq("type", "debit")
        .gte("date", monthRanges[0].start)
        .lte("date", monthRanges[n - 1].end);

      const all = txns || [];

      monthRanges.forEach((r) => {
        const total = all.filter((t) => t.date >= r.start && t.date <= r.end).reduce((s, t) => s + Number(t.amount), 0);
        chart.push({ month: r.label, total });
      });

      // Build vendor breakdown from categories
      const categoryMap: Record<string, number[]> = {};
      all.forEach((t) => {
        const cat = t.category || "Uncategorized";
        if (!categoryMap[cat]) categoryMap[cat] = Array(n).fill(0);
        const mIdx = monthRanges.findIndex((r) => t.date >= r.start && t.date <= r.end);
        if (mIdx >= 0) categoryMap[cat][mIdx] += Number(t.amount);
      });

      const rows: VendorRow[] = Object.entries(categoryMap).map(([vendor, monthAmts]) => ({
        vendor,
        category: vendor,
        months: monthAmts,
        total: monthAmts.reduce((s, v) => s + v, 0),
      })).sort((a, b) => b.total - a.total);

      setMonthLabels(labels);
      setChartData(chart);
      setVendors(rows);
    } finally {
      setLoading(false);
    }
  }, [user, periodMonths]);

  useEffect(() => { load(); }, [load]);

  const hasData = chartData.some((c) => c.total > 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-[#111111]">Cash Spend</h1>
        <Select value={periodMonths} onValueChange={setPeriodMonths}>
          <SelectTrigger className="w-40 h-9 text-sm border-[#E5E7EB]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 months</SelectItem>
            <SelectItem value="6">Last 6 months</SelectItem>
            <SelectItem value="12">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm text-[#6B7280] mb-6">Monthly cash spend from bank accounts and credit cards.</p>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : (
        <>
          {/* Bar Chart */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-[#374151] mb-4">Cash Spend Over Time</h3>
            {!hasData ? (
              <div className="flex items-center justify-center h-48 text-[#9CA3AF] text-sm">No spend data yet — add debit transactions to see your cash spend.</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [fmt(v), "Cash Spend"]} contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: 12 }} />
                  <Bar dataKey="total" fill="#111111" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Vendor Table */}
          {vendors.length > 0 && (
            <div className="rounded-xl border border-[#E5E7EB] overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Vendor / Category</th>
                    {monthLabels.map((l) => (
                      <th key={l} className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] whitespace-nowrap">{l}</th>
                    ))}
                    <th className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v) => (
                    <tr key={v.vendor} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA]">
                      <td className="px-4 py-2.5">
                        <span className="font-medium text-[#111111]">{v.vendor}</span>
                        <span className="block text-xs text-[#9CA3AF]">{v.category}</span>
                      </td>
                      {v.months.map((amt, i) => (
                        <td key={i} className="px-4 py-2.5 text-right text-[#DC2626]">{amt > 0 ? fmt(-amt) : "—"}</td>
                      ))}
                      <td className="px-4 py-2.5 text-right font-semibold text-[#DC2626]">{fmt(-v.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {vendors.length === 0 && hasData === false && (
            <div className="flex flex-col items-center justify-center py-12 border border-dashed border-[#E5E7EB] rounded-xl text-center">
              <p className="text-[#6B7280] text-sm">No spend breakdown available yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
