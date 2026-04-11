"use client";

import { useState, useEffect } from "react";
import { List, Plus, Search, ListFilter as Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ConnectBankAccount from "@/components/ConnectBankAccount";

type Transaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
};

export default function TransactionsSection() {
  const { company } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    description: "",
    category: "",
    amount: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [company]);

  async function loadTransactions() {
    if (!company) return;

    try {
      const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .eq("company_id", company.id)
        .order("date", { ascending: false });

      const { data: invoices } = await supabase
        .from("invoices")
        .select("*")
        .eq("company_id", company.id)
        .order("issue_date", { ascending: false });

      const allTransactions: Transaction[] = [
        ...(expenses || []).map((exp) => ({
          id: exp.id,
          date: exp.date,
          description: exp.description,
          category: exp.category,
          amount: exp.amount,
          type: "expense" as const,
        })),
        ...(invoices || []).map((inv) => ({
          id: inv.id,
          date: inv.issue_date,
          description: `Invoice ${inv.invoice_number}`,
          category: "Revenue",
          amount: inv.amount,
          type: "income" as const,
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setTransactions(allTransactions);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("expenses").insert([
        {
          company_id: company.id,
          description: formData.description,
          category: formData.category,
          amount: parseFloat(formData.amount),
          date: formData.date,
        },
      ]);

      if (error) throw error;

      setFormData({
        type: "expense",
        description: "",
        category: "",
        amount: "",
        date: format(new Date(), "yyyy-MM-dd"),
      });
      setShowAddForm(false);
      loadTransactions();
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Failed to create transaction. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const filteredTransactions = transactions.filter((t) =>
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <ConnectBankAccount />

      <div className="border-t-2 border-gray-200 dark:border-gray-800 pt-8" />

      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <List className="h-8 w-8 text-black dark:text-white" />
          <h2 className="text-2xl font-bold text-black dark:text-white">Transactions</h2>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-black dark:bg-white text-white dark:text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Transaction
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-[#171717] border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-black dark:text-white mb-4">Create New Transaction</h3>
          <form onSubmit={handleCreateTransaction} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <Input
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Office supplies"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <Input
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Office Expenses"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount *
                </label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <Input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-black dark:bg-white text-white dark:text-black"
              >
                {saving ? "Creating..." : "Create Transaction"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading transactions...</div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <List className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No transactions yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start by recording your first transaction
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      transaction.type === "income"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {transaction.type}
                  </div>
                  <p className="font-medium text-black dark:text-white">
                    {transaction.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{format(new Date(transaction.date), "MMM d, yyyy")}</span>
                  <span>•</span>
                  <span>{transaction.category}</span>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    transaction.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
