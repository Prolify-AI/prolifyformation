"use client";

import { useState, useEffect } from "react";
import {
  Calculator, DollarSign, FileText, Receipt, Wallet,
  Check, ChevronDown, Building2, CircleAlert as AlertCircle,
  TrendingDown, TrendingUp, ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type TaxRecord = {
  id: string;
  tax_year: number;
  tax_quarter: number | null;
  tax_type: string;
  amount_owed: number;
  amount_paid: number;
  status: string;
  filing_date: string | null;
  payment_date: string | null;
};

type CompanyOption = {
  id: string;
  name: string;
  source: "main" | "user_companies";
};

const TAX_TYPE_LABELS: Record<string, string> = {
  federal: "Federal",
  state: "State",
  sales: "Sales",
  payroll: "Payroll",
};

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  paid: { label: "Paid", cls: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" },
  filed: { label: "Filed", cls: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" },
  pending: { label: "Pending", cls: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" },
};

export default function TaxesSection() {
  const { company, user } = useAuth();
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [income, setIncome] = useState("");
  const [deductions, setDeductions] = useState("");
  const [estimatedTax, setEstimatedTax] = useState(0);

  useEffect(() => {
    if (!user || !company) return;
    buildCompanyList();
  }, [user, company]);

  async function buildCompanyList() {
    if (!user || !company) return;
    const list: CompanyOption[] = [{ id: company.id, name: company.name, source: "main" }];
    const { data: ucRows } = await supabase
      .from("user_companies")
      .select("id, name")
      .eq("user_id", user.id);
    for (const r of (ucRows || []) as { id: string; name: string }[]) {
      if (r.id !== company.id) {
        list.push({ id: r.id, name: r.name, source: "user_companies" });
      }
    }
    setCompanies(list);
    setSelectedCompanyId(list[0]?.id || "");
  }

  useEffect(() => {
    if (!selectedCompanyId) return;
    loadTaxRecords(selectedCompanyId);
  }, [selectedCompanyId]);

  const loadTaxRecords = async (companyId: string) => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("tax_records")
        .select("*")
        .eq("company_id", companyId)
        .order("tax_year", { ascending: false });
      setTaxRecords(data || []);
    } catch (error) {
      console.error("Error loading tax records:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTax = () => {
    const incomeNum = parseFloat(income) || 0;
    const deductionsNum = parseFloat(deductions) || 0;
    const taxableIncome = Math.max(0, incomeNum - deductionsNum);
    let tax = 0;
    if (taxableIncome <= 50000) {
      tax = taxableIncome * 0.15;
    } else if (taxableIncome <= 100000) {
      tax = 7500 + (taxableIncome - 50000) * 0.21;
    } else {
      tax = 18000 + (taxableIncome - 100000) * 0.25;
    }
    setEstimatedTax(tax);
  };

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
  const totalOwed = taxRecords.reduce((sum, r) => sum + Number(r.amount_owed), 0);
  const totalPaid = taxRecords.reduce((sum, r) => sum + Number(r.amount_paid), 0);
  const balance = totalOwed - totalPaid;

  if (loading && companies.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 rounded-full border-[3px] border-[#FFC107]/30 border-t-[#FFC107] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black dark:text-white">Tax Management</h1>
          <p className="text-sm text-black/50 dark:text-white/50 mt-0.5">
            Track obligations and estimate your tax liability
          </p>
        </div>

        {companies.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setShowCompanyDropdown((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#0f0f0f] border border-black/10 dark:border-white/10 text-sm font-semibold text-black dark:text-white hover:border-[#FFC107]/50 transition-colors"
            >
              <Building2 className="h-3.5 w-3.5 text-[#FFC107]" />
              <span className="max-w-[140px] truncate">{selectedCompany?.name || "Select"}</span>
              <ChevronDown className="h-3.5 w-3.5 text-black/40 dark:text-white/40" />
            </button>
            {showCompanyDropdown && (
              <div className="absolute right-0 top-full mt-1 z-30 w-56 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl shadow-xl overflow-hidden">
                {companies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCompanyId(c.id); setShowCompanyDropdown(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-[#FFC107]/8 ${selectedCompanyId === c.id ? "bg-[#FFC107]/8" : ""}`}
                  >
                    <Building2 className="h-3.5 w-3.5 text-[#FFC107] flex-shrink-0" />
                    <span className="truncate text-black dark:text-white font-medium">{c.name}</span>
                    {selectedCompanyId === c.id && <Check className="h-3.5 w-3.5 text-[#FFC107] ml-auto flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#0f0f0f] border border-black/8 dark:border-white/8 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">Total Owed</p>
            <div className="w-7 h-7 rounded-lg bg-[#FFC107]/15 flex items-center justify-center">
              <DollarSign className="h-3.5 w-3.5 text-[#FFC107]" />
            </div>
          </div>
          <p className="text-2xl font-black text-black dark:text-white">${totalOwed.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-[#0f0f0f] border border-black/8 dark:border-white/8 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">Total Paid</p>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-black dark:text-white">${totalPaid.toLocaleString()}</p>
        </div>

        <div className={`rounded-2xl p-4 border ${balance > 0 ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50" : "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50"}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">Balance Due</p>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${balance > 0 ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"}`}>
              <Wallet className={`h-3.5 w-3.5 ${balance > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`} />
            </div>
          </div>
          <p className={`text-2xl font-black ${balance > 0 ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"}`}>
            ${balance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f0f0f] border border-black/8 dark:border-white/8 rounded-2xl overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-black/1.5 dark:hover:bg-white/1.5 transition-colors"
          onClick={() => setShowCalculator((v) => !v)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFC107]/15 flex items-center justify-center">
              <Calculator className="h-4 w-4 text-[#FFC107]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-black dark:text-white">Tax Calculator</p>
              <p className="text-xs text-black/40 dark:text-white/40">Estimate your corporate tax liability</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${showCalculator ? "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60" : "bg-[#FFC107] text-black"}`}>
            {showCalculator ? "Hide" : "Calculate"}
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showCalculator ? "rotate-90" : ""}`} />
          </div>
        </button>

        {showCalculator && (
          <div className="border-t border-black/5 dark:border-white/5 p-5 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">Annual Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 font-bold text-sm">$</span>
                  <Input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="100,000"
                    className="pl-7 border border-black/10 dark:border-white/10 focus:border-[#FFC107] h-10 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">Total Deductions</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 font-bold text-sm">$</span>
                  <Input
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    placeholder="20,000"
                    className="pl-7 border border-black/10 dark:border-white/10 focus:border-[#FFC107] h-10 text-sm"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={calculateTax}
              className="w-full h-10 bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              Calculate Estimated Tax
            </button>

            {estimatedTax > 0 && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-black dark:bg-white border border-black dark:border-white">
                <div className="w-12 h-12 rounded-xl bg-[#FFC107] flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="h-6 w-6 text-black" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/40 dark:text-black/40 uppercase tracking-wider mb-0.5">Estimated Annual Tax</p>
                  <p className="text-2xl font-black text-white dark:text-black">
                    ${estimatedTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-[10px] text-white/35 dark:text-black/35 mt-0.5">
                    Simplified estimate — consult a tax professional
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#0f0f0f] border border-black/8 dark:border-white/8 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5 dark:border-white/5">
          <div className="w-9 h-9 rounded-xl bg-black/4 dark:bg-white/4 flex items-center justify-center">
            <FileText className="h-4 w-4 text-black/50 dark:text-white/50" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-black dark:text-white">Tax Records</h3>
            <p className="text-xs text-black/40 dark:text-white/40">{taxRecords.length} record{taxRecords.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-7 h-7 rounded-full border-[3px] border-[#FFC107]/30 border-t-[#FFC107] animate-spin" />
          </div>
        ) : taxRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center px-8">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC107]/10 flex items-center justify-center mb-3">
              <Receipt className="h-6 w-6 text-[#FFC107]" />
            </div>
            <p className="text-sm font-bold text-black dark:text-white mb-1">No tax records yet</p>
            <p className="text-xs text-black/40 dark:text-white/40 max-w-xs">
              Tax records will appear here once they are created for this company.
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {taxRecords.map((record) => {
              const statusCfg = STATUS_CONFIG[record.status] || STATUS_CONFIG.pending;
              const due = Number(record.amount_owed) - Number(record.amount_paid);
              const isCleared = due <= 0;

              return (
                <div
                  key={record.id}
                  className={`flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border transition-all ${
                    isCleared
                      ? "bg-emerald-50/50 dark:bg-emerald-900/5 border-emerald-200/50 dark:border-emerald-800/30"
                      : "bg-black/1.5 dark:bg-white/1.5 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isCleared ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-black/5 dark:bg-white/5"}`}>
                      <Receipt className={`h-4 w-4 ${isCleared ? "text-emerald-600 dark:text-emerald-400" : "text-black/40 dark:text-white/40"}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-black dark:text-white">
                          {record.tax_year}{record.tax_quarter ? ` Q${record.tax_quarter}` : ""}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusCfg.cls}`}>
                          {statusCfg.label}
                        </span>
                        {record.tax_type && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 uppercase tracking-wider">
                            {TAX_TYPE_LABELS[record.tax_type] || record.tax_type}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-black/40 dark:text-white/40">
                        <span>Owed: <span className="font-semibold text-black dark:text-white">${Number(record.amount_owed).toLocaleString()}</span></span>
                        <span className="text-black/15 dark:text-white/15">|</span>
                        <span>Paid: <span className="font-semibold text-black dark:text-white">${Number(record.amount_paid).toLocaleString()}</span></span>
                        {record.filing_date && (
                          <>
                            <span className="text-black/15 dark:text-white/15">|</span>
                            <span>Filed {new Date(record.filing_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    {isCleared ? (
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                        Cleared
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-3.5 w-3.5" />
                        ${due.toLocaleString()} due
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
