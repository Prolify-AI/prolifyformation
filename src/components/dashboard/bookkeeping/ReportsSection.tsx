"use client";

import { useState, useEffect } from "react";
import { PieChart, Download, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

type ReportData = {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  expensesByCategory: Record<string, number>;
};

export default function ReportsSection() {
  const { company } = useAuth();
  const [reportData, setReportData] = useState<ReportData>({
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0,
    expensesByCategory: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, [company]);

  async function loadReportData() {
    if (!company) return;

    try {
      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount, category")
        .eq("company_id", company.id);

      const { data: invoices } = await supabase
        .from("invoices")
        .select("amount")
        .eq("company_id", company.id)
        .eq("status", "paid");

      const totalRevenue = (invoices || []).reduce((sum, inv) => sum + inv.amount, 0);
      const totalExpenses = (expenses || []).reduce((sum, exp) => sum + exp.amount, 0);

      const expensesByCategory: Record<string, number> = {};
      (expenses || []).forEach((exp) => {
        expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + exp.amount;
      });

      setReportData({
        totalRevenue,
        totalExpenses,
        netIncome: totalRevenue - totalExpenses,
        expensesByCategory,
      });
    } catch (error) {
      console.error("Error loading report data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleExport = () => {
    const csvContent = [
      ["Financial Report", ""],
      ["Total Revenue", reportData.totalRevenue.toFixed(2)],
      ["Total Expenses", reportData.totalExpenses.toFixed(2)],
      ["Net Income", reportData.netIncome.toFixed(2)],
      [""],
      ["Expenses by Category", "Amount"],
      ...Object.entries(reportData.expensesByCategory).map(([category, amount]) => [
        category,
        amount.toFixed(2),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PieChart className="h-8 w-8 text-black dark:text-white" />
          <h2 className="text-2xl font-bold text-black dark:text-white">Financial Reports</h2>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading reports...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 border-2 border-gray-200 dark:border-gray-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </span>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white">
                ${reportData.totalRevenue.toFixed(2)}
              </p>
            </div>

            <div className="p-6 border-2 border-gray-200 dark:border-gray-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Expenses
                </span>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white">
                ${reportData.totalExpenses.toFixed(2)}
              </p>
            </div>

            <div className="p-6 border-2 border-gray-200 dark:border-gray-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Net Income
                </span>
              </div>
              <p
                className={`text-3xl font-bold ${
                  reportData.netIncome >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                ${reportData.netIncome.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">
                Expenses by Category
              </h3>
              {Object.keys(reportData.expensesByCategory).length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No expense data available
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(reportData.expensesByCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, amount]) => {
                      const percentage =
                        reportData.totalExpenses > 0
                          ? (amount / reportData.totalExpenses) * 100
                          : 0;
                      return (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-black dark:text-white">
                              {category}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                            <div
                              className="bg-black dark:bg-white h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="border-2 border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">
                Expense Distribution
              </h3>
              {Object.keys(reportData.expensesByCategory).length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No expense data available
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={Object.entries(reportData.expensesByCategory).map(([name, value]) => ({
                        name,
                        value,
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#000000"
                      dataKey="value"
                      label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                    >
                      {Object.keys(reportData.expensesByCategory).map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#000000",
                              "#4B5563",
                              "#6B7280",
                              "#9CA3AF",
                              "#D1D5DB",
                              "#E5E7EB",
                            ][index % 6]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
