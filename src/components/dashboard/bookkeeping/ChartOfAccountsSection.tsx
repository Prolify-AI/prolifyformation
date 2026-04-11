"use client";

import { useState } from "react";
import { Layers, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Account = {
  id: string;
  code: string;
  name: string;
  type: string;
  balance: number;
};

const defaultAccounts: Account[] = [
  { id: "1", code: "1000", name: "Cash", type: "Asset", balance: 0 },
  { id: "2", code: "1200", name: "Accounts Receivable", type: "Asset", balance: 0 },
  { id: "3", code: "1500", name: "Inventory", type: "Asset", balance: 0 },
  { id: "4", code: "2000", name: "Accounts Payable", type: "Liability", balance: 0 },
  { id: "5", code: "3000", name: "Owner's Equity", type: "Equity", balance: 0 },
  { id: "6", code: "4000", name: "Sales Revenue", type: "Revenue", balance: 0 },
  { id: "7", code: "5000", name: "Cost of Goods Sold", type: "Expense", balance: 0 },
  { id: "8", code: "6000", name: "Operating Expenses", type: "Expense", balance: 0 },
];

export default function ChartOfAccountsSection() {
  const [accounts, setAccounts] = useState<Account[]>(defaultAccounts);
  const [filter, setFilter] = useState<string>("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "Asset",
    balance: "0",
  });

  const accountTypes = ["All", "Asset", "Liability", "Equity", "Revenue", "Expense"];

  const filteredAccounts =
    filter === "All" ? accounts : accounts.filter((acc) => acc.type === filter);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccount: Account = {
      id: Date.now().toString(),
      code: formData.code,
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance),
    };
    setAccounts([...accounts, newAccount]);
    setFormData({
      code: "",
      name: "",
      type: "Asset",
      balance: "0",
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="h-8 w-8 text-black dark:text-white" />
          <h2 className="text-2xl font-bold text-black dark:text-white">Chart of Accounts</h2>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-black dark:bg-white text-white dark:text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Account
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-[#171717] border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-black dark:text-white mb-4">Create New Account</h3>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Code *
                </label>
                <Input
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Name *
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Cash Account"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Type *
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asset">Asset</SelectItem>
                    <SelectItem value="Liability">Liability</SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Revenue">Revenue</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Initial Balance
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-black dark:bg-white text-white dark:text-black">
                Create Account
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2">
        {accountTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === type
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Account Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredAccounts.map((account) => (
              <tr
                key={account.id}
                className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {account.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {account.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      account.type === "Asset"
                        ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"
                        : account.type === "Liability"
                        ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                        : account.type === "Equity"
                        ? "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200"
                        : account.type === "Revenue"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                        : "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200"
                    }`}
                  >
                    {account.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                  ${account.balance.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
