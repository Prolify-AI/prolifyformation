"use client";

import { useState, useEffect } from "react";
import { Receipt, Plus, Trash2, Filter, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  vendor: string;
  date: string;
  payment_method: string;
  tax_deductible: boolean;
  status: string;
};

const CATEGORIES = [
  "Office Supplies",
  "Travel",
  "Software & Subscriptions",
  "Marketing",
  "Professional Services",
  "Equipment",
  "Utilities",
  "Other",
];

export default function ExpensesSection() {
  const { company, user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [formData, setFormData] = useState({
    amount: "",
    category: "Office Supplies",
    description: "",
    vendor: "",
    date: new Date().toISOString().split("T")[0],
    payment_method: "Credit Card",
    tax_deductible: true,
  });

  useEffect(() => {
    loadExpenses();
  }, [company]);

  const loadExpenses = async () => {
    if (!company) return;

    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("company_id", company.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !user) return;

    try {
      const { error } = await supabase.from("expenses").insert({
        company_id: company.id,
        user_id: user.id,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        vendor: formData.vendor,
        date: formData.date,
        payment_method: formData.payment_method,
        tax_deductible: formData.tax_deductible,
        status: "approved",
      });

      if (error) throw error;

      setFormData({
        amount: "",
        category: "Office Supplies",
        description: "",
        vendor: "",
        date: new Date().toISOString().split("T")[0],
        payment_method: "Credit Card",
        tax_deductible: true,
      });
      setShowAddForm(false);
      loadExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
      loadExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const filteredExpenses =
    filterCategory === "all"
      ? expenses
      : expenses.filter((e) => e.category === filterCategory);

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const deductibleExpenses = filteredExpenses
    .filter((e) => e.tax_deductible)
    .reduce((sum, e) => sum + Number(e.amount), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black dark:text-white">Expenses</h2>
          <p className="text-black/70 dark:text-white/70 mt-1">
            Track and manage your business expenses
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-black hover:from-[#FFB300] hover:to-[#FFA000] font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-black dark:bg-white border-2 border-black dark:border-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/80 dark:text-black/80">Total Expenses</span>
            <DollarSign className="h-5 w-5 text-[#FFC107]" />
          </div>
          <p className="text-3xl font-bold text-white dark:text-black">
            ${totalExpenses.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#FFC107] to-[#FFB300] border-2 border-[#FFB300] rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-black/80">Tax Deductible</span>
            <Receipt className="h-5 w-5 text-black" />
          </div>
          <p className="text-3xl font-bold text-black">
            ${deductibleExpenses.toLocaleString()}
          </p>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl p-6">
          <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FFC107]"></div>
            Add New Expense
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="100.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 rounded-lg text-black dark:text-white focus:border-[#FFC107] transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vendor
                </label>
                <Input
                  required
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  placeholder="Amazon, Office Depot, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <Input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 rounded-lg text-black dark:text-white focus:border-[#FFC107] transition-colors"
                >
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Cash</option>
                  <option>Check</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <Input
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the expense"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tax_deductible}
                    onChange={(e) =>
                      setFormData({ ...formData, tax_deductible: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tax deductible
                  </span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-black hover:from-[#FFB300] hover:to-[#FFA000] font-semibold">
                Add Expense
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="border-2 border-black/20 dark:border-white/20 hover:border-[#FFC107]">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FFC107]"></div>
            Recent Expenses
          </h3>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#FFC107]" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 rounded-lg text-sm text-black dark:text-white focus:border-[#FFC107]"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-[#FFC107]/20 flex items-center justify-center mx-auto mb-4">
              <Receipt className="h-8 w-8 text-[#FFC107]" />
            </div>
            <p className="text-black/70 dark:text-white/70">No expenses found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border-2 border-black/20 dark:border-white/20 rounded-xl hover:border-[#FFC107] hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-black dark:text-white">
                      {expense.vendor}
                    </span>
                    <span className="px-2 py-1 bg-black/10 dark:bg-white/10 text-black dark:text-white rounded-full text-xs font-semibold">
                      {expense.category}
                    </span>
                    {expense.tax_deductible && (
                      <span className="px-2 py-1 bg-[#FFC107] text-black rounded-full text-xs font-semibold">
                        Deductible
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {expense.description} • {format(new Date(expense.date), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-black dark:text-white">
                    ${Number(expense.amount).toLocaleString()}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(expense.id)}
                    className="border-2 border-black/20 dark:border-white/20 hover:border-black hover:bg-black hover:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
