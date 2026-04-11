"use client";

import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Users, FileText, TrendingDown } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function RevenueAnalyticsSection() {
  const { company } = useAuth();
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    profit: 0,
    clientCount: 0,
    invoiceCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, [company]);

  const loadMetrics = async () => {
    if (!company) return;

    try {
      const [invoicesRes, expensesRes, clientsRes] = await Promise.all([
        supabase.from("invoices").select("amount, status").eq("company_id", company.id),
        supabase.from("expenses").select("amount").eq("company_id", company.id),
        supabase.from("clients").select("id").eq("company_id", company.id),
      ]);

      const totalRevenue = (invoicesRes.data || [])
        .filter((inv: any) => inv.status === "paid")
        .reduce((sum: number, inv: any) => sum + Number(inv.amount), 0);

      const totalExpenses = (expensesRes.data || []).reduce(
        (sum: number, exp: any) => sum + Number(exp.amount),
        0
      );

      setMetrics({
        totalRevenue,
        totalExpenses,
        profit: totalRevenue - totalExpenses,
        clientCount: clientsRes.data?.length || 0,
        invoiceCount: invoicesRes.data?.length || 0,
      });
    } catch (error) {
      console.error("Error loading metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-black dark:text-white">Revenue Analytics</h2>
        <p className="text-black/70 dark:text-white/70 mt-1">
          Track your business performance and growth
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-black dark:bg-white rounded-2xl p-6 text-white dark:text-black border-2 border-black dark:border-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Total Revenue</span>
            <DollarSign className="h-6 w-6" />
          </div>
          <p className="text-4xl font-bold">${metrics.totalRevenue.toLocaleString()}</p>
          <div className="mt-3 pt-3 border-t border-white/20 dark:border-black/20">
            <p className="text-sm opacity-80">From paid invoices</p>
          </div>
        </div>

        <div className="bg-white dark:bg-black rounded-2xl p-6 border-2 border-black dark:border-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-black/70 dark:text-white/70">Total Expenses</span>
            <TrendingDown className="h-6 w-6 text-black dark:text-white" />
          </div>
          <p className="text-4xl font-bold text-black dark:text-white">${metrics.totalExpenses.toLocaleString()}</p>
          <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10">
            <p className="text-sm text-black/70 dark:text-white/70">Business costs</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#FFC107] to-[#FFB300] rounded-2xl p-6 text-black border-2 border-[#FFB300] shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Net Profit</span>
            <TrendingUp className="h-6 w-6" />
          </div>
          <p className="text-4xl font-bold">${metrics.profit.toLocaleString()}</p>
          <div className="mt-3 pt-3 border-t border-black/20">
            <p className="text-sm opacity-80">Revenue - Expenses</p>
          </div>
        </div>

        <div className="bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 rounded-2xl p-6 hover:border-[#FFC107] transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-black/70 dark:text-white/70">Active Clients</span>
            <Users className="h-6 w-6 text-[#FFC107]" />
          </div>
          <p className="text-4xl font-bold text-black dark:text-white">{metrics.clientCount}</p>
        </div>

        <div className="bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 rounded-2xl p-6 hover:border-[#FFC107] transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-black/70 dark:text-white/70">Total Invoices</span>
            <FileText className="h-6 w-6 text-[#FFC107]" />
          </div>
          <p className="text-4xl font-bold text-black dark:text-white">{metrics.invoiceCount}</p>
        </div>

        <div className="bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 rounded-2xl p-6 hover:border-[#FFC107] transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-black/70 dark:text-white/70">Profit Margin</span>
            <TrendingUp className="h-6 w-6 text-[#FFC107]" />
          </div>
          <p className="text-4xl font-bold text-black dark:text-white">
            {metrics.totalRevenue > 0
              ? ((metrics.profit / metrics.totalRevenue) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#FFC107]/10 to-[#FFB300]/10 dark:from-[#FFD54F]/10 dark:to-[#FFC107]/10 border-2 border-[#FFC107] dark:border-[#FFD54F] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-[#FFC107] dark:bg-[#FFD54F] flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-lg font-bold text-black dark:text-white">
            Business Health Score
          </h3>
        </div>
        <p className="text-black/80 dark:text-white/80">
          Your business is {metrics.profit > 0 ? "profitable" : "operating at a loss"}. Keep
          tracking your metrics to maintain financial health.
        </p>
      </div>
    </div>
  );
}
