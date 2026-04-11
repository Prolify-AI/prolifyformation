"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, Landmark, RefreshCw, Loader as Loader2, ArrowRight, CreditCard, ChartBar as BarChart2, PiggyBank } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from "recharts";
import { format, startOfMonth, subMonths } from "date-fns";

type MonthlyFinancial = {
  name: string;
  revenue: number;
  expenses: number;
  profit: number;
};

type FinancialStats = {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  revenueThisMonth: number;
  expensesThisMonth: number;
};

type BankTx = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  order_date: string;
  type: "income" | "expense";
};

type BankConnection = {
  id: string;
  institution_name: string;
  display_name: string | null;
  last4: string | null;
  balance_current: number | null;
  balance_available: number | null;
  synced_at: string | null;
};

function NoBankConnected() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
      <div className="h-16 w-16 rounded-2xl bg-[#FFC107]/10 flex items-center justify-center mx-auto mb-4">
        <Landmark className="h-8 w-8 text-[#FFC107]" />
      </div>
      <h3 className="text-lg font-bold text-black dark:text-white mb-2">Connect Your Bank to View Financials</h3>
      <p className="text-sm text-black/50 dark:text-white/50 max-w-sm mb-6">
        Link your bank account to automatically track revenue, expenses, and profit margins from your e-commerce activity.
      </p>
      <div className="flex items-center gap-2 text-xs text-black/40 dark:text-white/40">
        <ArrowRight className="h-3.5 w-3.5" />
        Go to Banking section to connect
      </div>
    </div>
  );
}

export default function FinancialsSection() {
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();
  const [stats, setStats] = useState<FinancialStats>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    revenueThisMonth: 0,
    expensesThisMonth: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyFinancial[]>([]);
  const [recentTx, setRecentTx] = useState<BankTx[]>([]);
  const [bankConnections, setBankConnections] = useState<BankConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<"bar" | "line">("bar");

  useEffect(() => {
    trackEvent("analytics_financials_viewed");
    loadData();
  }, [user]);

  async function loadData() {
    if (!user) return;
    setLoading(true);
    try {
      const [ordersRes, connectionsRes] = await Promise.all([
        supabase
          .from("ecommerce_orders")
          .select("id, total_amount, tax_amount, shipping_amount, discount_amount, order_date, status, platform")
          .eq("user_id", user.id)
          .in("status", ["completed", "paid"])
          .order("order_date", { ascending: false }),
        supabase
          .from("bank_connections")
          .select("id, institution_name, display_name, last4, balance_current, balance_available, synced_at")
          .eq("user_id", user.id)
          .eq("status", "active"),
      ]);

      setBankConnections(connectionsRes.data || []);

      const orders = ordersRes.data || [];

      const now = new Date();
      const thisMonthStart = startOfMonth(now);

      const buildMonthBuckets = (): MonthlyFinancial[] => {
        const buckets: MonthlyFinancial[] = [];
        for (let i = 5; i >= 0; i--) {
          const monthStart = startOfMonth(subMonths(now, i));
          buckets.push({ name: format(monthStart, "MMM yy"), revenue: 0, expenses: 0, profit: 0 });
        }
        return buckets;
      };

      const buckets = buildMonthBuckets();

      let totalRevenue = 0;
      let revenueThisMonth = 0;

      const txRows: BankTx[] = [];

      orders.forEach((o) => {
        const amount = o.total_amount / 100;
        const date = new Date(o.order_date);
        const monthLabel = format(startOfMonth(date), "MMM yy");

        totalRevenue += amount;
        if (date >= thisMonthStart) revenueThisMonth += amount;

        const bucket = buckets.find((b) => b.name === monthLabel);
        if (bucket) {
          bucket.revenue += amount;
          bucket.profit += amount;
        }

        txRows.push({
          id: o.id,
          description: `${o.platform.charAt(0).toUpperCase() + o.platform.slice(1)} order`,
          amount: o.total_amount,
          currency: "usd",
          order_date: o.order_date,
          type: "income",
        });
      });

      buckets.forEach((b) => {
        b.revenue = Math.round(b.revenue * 100) / 100;
        b.profit = Math.round(b.profit * 100) / 100;
      });

      const profitMargin = totalRevenue > 0 ? (totalRevenue / totalRevenue) * 100 : 0;

      setStats({
        totalRevenue,
        totalExpenses: 0,
        netProfit: totalRevenue,
        profitMargin,
        revenueThisMonth,
        expensesThisMonth: 0,
      });
      setMonthlyData(buckets);
      setRecentTx(txRows.slice(0, 15));
    } catch (err) {
      console.error("Error loading financials:", err);
    } finally {
      setLoading(false);
    }
  }

  const hasBankConnected = bankConnections.length > 0;
  const totalBankBalance = bankConnections.reduce((sum, c) => sum + (c.balance_current ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FFC107] to-[#FFB300] flex items-center justify-center shadow-lg">
            <DollarSign className="h-7 w-7 text-black" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-black dark:text-white">Financials</h2>
            <p className="text-sm text-black/60 dark:text-white/60">
              {hasBankConnected ? "Revenue & cash flow from connected accounts" : "Connect your bank to view financials"}
            </p>
          </div>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border-2 border-black/10 dark:border-white/10 rounded-xl text-sm font-semibold text-black/60 dark:text-white/60 hover:border-[#FFC107] hover:text-black dark:hover:text-white transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#FFC107]" />
        </div>
      ) : !hasBankConnected ? (
        <NoBankConnected />
      ) : (
        <>
          {bankConnections.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bankConnections.map((conn) => (
                <div
                  key={conn.id}
                  className="p-5 bg-white dark:bg-black border-2 border-black/10 dark:border-white/10 rounded-xl hover:border-[#FFC107] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-[#FFC107]/10 flex items-center justify-center">
                      <Landmark className="h-4 w-4 text-[#FFC107]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-black dark:text-white truncate">
                        {conn.display_name || conn.institution_name}
                        {conn.last4 && <span className="ml-1 text-black/40 dark:text-white/40 font-normal text-xs">••{conn.last4}</span>}
                      </p>
                      {conn.synced_at && (
                        <p className="text-xs text-black/40 dark:text-white/40">
                          Synced {format(new Date(conn.synced_at), "MMM d, h:mm a")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs text-black/40 dark:text-white/40">Current</p>
                      <p className="text-lg font-bold text-black dark:text-white">
                        {conn.balance_current != null
                          ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(conn.balance_current / 100)
                          : "—"}
                      </p>
                    </div>
                    {conn.balance_available != null && (
                      <div>
                        <p className="text-xs text-black/40 dark:text-white/40">Available</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(conn.balance_available / 100)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-black dark:bg-white border-2 border-black dark:border-white rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-[#FFC107]" />
                <span className="text-sm font-medium text-white/80 dark:text-black/80">Total Revenue</span>
              </div>
              <p className="text-3xl font-bold text-white dark:text-black">
                ${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-white/40 dark:text-black/40 mt-1">all time</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-[#FFC107] to-[#FFB300] border-2 border-[#FFB300] rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="h-5 w-5 text-black" />
                <span className="text-sm font-medium text-black/80">Revenue This Month</span>
              </div>
              <p className="text-3xl font-bold text-black">
                ${stats.revenueThisMonth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 rounded-xl hover:border-[#FFC107] transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-black/70 dark:text-white/70">Total Expenses</span>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white">
                ${stats.totalExpenses.toFixed(2)}
              </p>
              <p className="text-xs text-black/40 dark:text-white/40 mt-1">tracked expenses</p>
            </div>

            <div className="p-6 bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 rounded-xl hover:border-[#FFC107] transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <PiggyBank className="h-5 w-5 text-[#FFC107]" />
                <span className="text-sm font-medium text-black/70 dark:text-white/70">Total Bank Balance</span>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalBankBalance / 100)}
              </p>
              <p className="text-xs text-black/40 dark:text-white/40 mt-1">across all accounts</p>
            </div>
          </div>

          {monthlyData.some((m) => m.revenue > 0) && (
            <div className="border-2 border-black dark:border-white rounded-xl p-6 bg-white dark:bg-black">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#FFC107]" />
                  Revenue Over Time
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveChart("bar")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeChart === "bar" ? "bg-[#FFC107] text-black" : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60"}`}
                  >
                    Bar
                  </button>
                  <button
                    onClick={() => setActiveChart("line")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeChart === "line" ? "bg-[#FFC107] text-black" : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60"}`}
                  >
                    Line
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                {activeChart === "bar" ? (
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      formatter={(v: unknown) => [`$${(v as number).toFixed(2)}`, "Revenue"]}
                      contentStyle={{ backgroundColor: "#FFC107", border: "2px solid #000", borderRadius: "8px", color: "#000" }}
                    />
                    <Bar dataKey="revenue" fill="#FFC107" radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      formatter={(v: unknown) => [`$${(v as number).toFixed(2)}`, "Revenue"]}
                      contentStyle={{ backgroundColor: "#FFC107", border: "2px solid #000", borderRadius: "8px", color: "#000" }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#FFC107" strokeWidth={3} dot={{ fill: "#FFC107", strokeWidth: 2, r: 4 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          )}

          <div className="border-2 border-black dark:border-white rounded-xl overflow-hidden bg-white dark:bg-black">
            <div className="px-6 py-4 border-b-2 border-black/10 dark:border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-black dark:text-white">Recent Transactions</h3>
              <span className="text-sm text-black/50 dark:text-white/50">{recentTx.length} transactions</span>
            </div>

            {recentTx.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-base font-semibold text-black dark:text-white mb-1">No transactions yet</p>
                <p className="text-sm text-black/50 dark:text-white/50 max-w-xs mx-auto">
                  Your e-commerce revenue and transactions will appear here once synced
                </p>
              </div>
            ) : (
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {recentTx.map((tx) => (
                  <div
                    key={tx.id}
                    className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        tx.type === "income" ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                      }`}>
                        {tx.type === "income"
                          ? <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                          : <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-black dark:text-white text-sm truncate">{tx.description}</p>
                        <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">
                          {format(new Date(tx.order_date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm tabular-nums ${
                      tx.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {tx.type === "income" ? "+" : "-"}${(tx.amount / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
