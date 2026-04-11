"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Eye, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

type Invoice = {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  amount: number;
  status: string;
  issue_date: string;
  due_date: string;
  paid_date: string | null;
};

export default function InvoicesSection() {
  const { company } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    amount: "",
    issue_date: format(new Date(), "yyyy-MM-dd"),
    due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, [company]);

  const loadInvoices = async () => {
    if (!company) return;

    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("company_id", company.id)
        .order("issue_date", { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setSaving(true);
    try {
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

      const { error } = await supabase.from("invoices").insert([
        {
          company_id: company.id,
          invoice_number: invoiceNumber,
          client_name: formData.client_name,
          client_email: formData.client_email,
          amount: parseFloat(formData.amount),
          status: "draft",
          issue_date: formData.issue_date,
          due_date: formData.due_date,
          paid_date: null,
        },
      ]);

      if (error) throw error;

      setFormData({
        client_name: "",
        client_email: "",
        amount: "",
        issue_date: format(new Date(), "yyyy-MM-dd"),
        due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      });
      setShowAddForm(false);
      loadInvoices();
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: "bg-[#FFC107] text-black font-semibold",
      sent: "bg-black/10 dark:bg-white/10 text-black dark:text-white",
      draft: "bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70",
      overdue: "bg-black dark:bg-white text-white dark:text-black",
    };
    return colors[status] || colors.draft;
  };

  const handleMailInvoice = (invoice: Invoice) => {
    const subject = encodeURIComponent(`Invoice ${invoice.invoice_number}`);
    const body = encodeURIComponent(
      `Dear ${invoice.client_name},\n\nPlease find attached invoice ${invoice.invoice_number} for $${Number(invoice.amount).toLocaleString()}.\n\nIssue Date: ${format(new Date(invoice.issue_date), "MMM d, yyyy")}\nDue Date: ${format(new Date(invoice.due_date), "MMM d, yyyy")}\n\nThank you for your business.`
    );
    window.open(`mailto:${invoice.client_email}?subject=${subject}&body=${body}`);
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

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
          <h2 className="text-3xl font-bold text-black dark:text-white">Invoices</h2>
          <p className="text-black/70 dark:text-white/70 mt-1">
            Create and manage customer invoices
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-black hover:from-[#FFB300] hover:to-[#FFA000] font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl p-6">
          <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FFC107]"></div>
            Create New Invoice
          </h3>
          <form onSubmit={handleCreateInvoice} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Name *
                </label>
                <Input
                  required
                  value={formData.client_name}
                  onChange={(e) =>
                    setFormData({ ...formData, client_name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Email *
                </label>
                <Input
                  required
                  type="email"
                  value={formData.client_email}
                  onChange={(e) =>
                    setFormData({ ...formData, client_email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
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
                  Issue Date *
                </label>
                <Input
                  required
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) =>
                    setFormData({ ...formData, issue_date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date *
                </label>
                <Input
                  required
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-black hover:from-[#FFB300] hover:to-[#FFA000] font-semibold disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Invoice"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-2 border-black/20 dark:border-white/20 hover:border-[#FFC107]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 rounded-2xl p-6 hover:border-[#FFC107] transition-all hover:shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-black/70 dark:text-white/70">Total Invoiced</span>
            <FileText className="h-5 w-5 text-[#FFC107]" />
          </div>
          <p className="text-3xl font-bold text-black dark:text-white">
            ${totalAmount.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#FFC107] to-[#FFB300] border-2 border-[#FFB300] rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-black/80">Paid</span>
            <FileText className="h-5 w-5 text-black" />
          </div>
          <p className="text-3xl font-bold text-black">
            ${paidAmount.toLocaleString()}
          </p>
        </div>

        <div className="bg-black dark:bg-white border-2 border-black dark:border-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/80 dark:text-black/80">Outstanding</span>
            <FileText className="h-5 w-5 text-[#FFC107]" />
          </div>
          <p className="text-3xl font-bold text-white dark:text-black">
            ${(totalAmount - paidAmount).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl p-6">
        <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#FFC107]"></div>
          Recent Invoices
        </h3>

        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-[#FFC107]/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-[#FFC107]" />
            </div>
            <p className="text-black/70 dark:text-white/70">No invoices yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border-2 border-black/20 dark:border-white/20 rounded-xl hover:border-[#FFC107] hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-black dark:text-white">
                      #{invoice.invoice_number}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {invoice.client_name} • Due {format(new Date(invoice.due_date), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-black dark:text-white">
                    ${Number(invoice.amount).toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setViewInvoice(invoice)} className="border-2 border-black/20 dark:border-white/20 hover:border-[#FFC107] hover:bg-[#FFC107] hover:text-black transition-all">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleMailInvoice(invoice)} className="border-2 border-black/20 dark:border-white/20 hover:border-[#FFC107] hover:bg-[#FFC107] hover:text-black transition-all">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewInvoice(null)}>
          <div className="bg-white dark:bg-[#111] border-2 border-black dark:border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#FFC107]" />
                <h3 className="text-lg font-bold text-black dark:text-white">Invoice Details</h3>
              </div>
              <button onClick={() => setViewInvoice(null)} className="p-1.5 rounded-lg hover:bg-black/8 dark:hover:bg-white/8 transition-colors">
                <X className="h-4 w-4 text-black/50 dark:text-white/50" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-black/8 dark:border-white/8">
                <span className="text-sm text-black/50 dark:text-white/50">Invoice #</span>
                <span className="font-semibold text-black dark:text-white">{viewInvoice.invoice_number}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-black/8 dark:border-white/8">
                <span className="text-sm text-black/50 dark:text-white/50">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(viewInvoice.status)}`}>{viewInvoice.status}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-black/8 dark:border-white/8">
                <span className="text-sm text-black/50 dark:text-white/50">Client</span>
                <span className="font-semibold text-black dark:text-white">{viewInvoice.client_name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-black/8 dark:border-white/8">
                <span className="text-sm text-black/50 dark:text-white/50">Email</span>
                <span className="text-sm text-black dark:text-white">{viewInvoice.client_email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-black/8 dark:border-white/8">
                <span className="text-sm text-black/50 dark:text-white/50">Amount</span>
                <span className="text-xl font-bold text-black dark:text-white">${Number(viewInvoice.amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-black/8 dark:border-white/8">
                <span className="text-sm text-black/50 dark:text-white/50">Issue Date</span>
                <span className="text-sm text-black dark:text-white">{format(new Date(viewInvoice.issue_date), "MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-black/50 dark:text-white/50">Due Date</span>
                <span className="text-sm text-black dark:text-white">{format(new Date(viewInvoice.due_date), "MMM d, yyyy")}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <Button onClick={() => handleMailInvoice(viewInvoice)} className="flex-1 bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold">
                <Mail className="h-4 w-4 mr-2" />
                Send to Client
              </Button>
              <Button onClick={() => setViewInvoice(null)} variant="outline" className="border-2 border-black/20 dark:border-white/20">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
