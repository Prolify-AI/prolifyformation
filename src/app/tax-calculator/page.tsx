'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, Info } from 'lucide-react';

const entityTypes = ['Single-Member LLC', 'S-Corp', 'C-Corp'];
const filingStatuses = ['Single', 'Married Filing Jointly', 'Head of Household'];

function calculateTax(grossRevenue: number, expenses: number, entityType: string, filingStatus: string) {
  const netProfit = Math.max(0, grossRevenue - expenses);

  let seTax = 0;
  let incomeTax = 0;
  let totalTax = 0;
  let effectiveRate = 0;
  let savings = 0;

  if (entityType === 'Single-Member LLC') {
    seTax = netProfit * 0.9235 * 0.153;
    if (seTax > netProfit * 0.9235 * 0.029) {
      seTax = netProfit * 0.9235 * 0.029 + Math.min(netProfit * 0.9235, 160200) * 0.124;
    }
    const adjustedIncome = netProfit - seTax / 2;
    incomeTax = estimateIncomeTax(adjustedIncome, filingStatus);
    totalTax = seTax + incomeTax;
  } else if (entityType === 'S-Corp') {
    const reasonableSalary = Math.min(netProfit * 0.5, 80000);
    const distribution = netProfit - reasonableSalary;
    seTax = reasonableSalary * 0.153;
    incomeTax = estimateIncomeTax(netProfit, filingStatus);
    totalTax = seTax + incomeTax;
    const llcSeTax = netProfit * 0.9235 * 0.153;
    savings = Math.max(0, llcSeTax - seTax);
  } else {
    const corpTax = netProfit * 0.21;
    incomeTax = estimateIncomeTax(0, filingStatus);
    totalTax = corpTax;
    seTax = 0;
  }

  effectiveRate = netProfit > 0 ? (totalTax / netProfit) * 100 : 0;

  return { netProfit, seTax, incomeTax, totalTax, effectiveRate, savings };
}

function estimateIncomeTax(income: number, filingStatus: string): number {
  const brackets = filingStatus === 'Married Filing Jointly'
    ? [
        { limit: 23200, rate: 0.10 },
        { limit: 94300, rate: 0.12 },
        { limit: 201050, rate: 0.22 },
        { limit: 383900, rate: 0.24 },
        { limit: 487450, rate: 0.32 },
        { limit: 731200, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ]
    : [
        { limit: 11600, rate: 0.10 },
        { limit: 47150, rate: 0.12 },
        { limit: 100525, rate: 0.22 },
        { limit: 191950, rate: 0.24 },
        { limit: 243725, rate: 0.32 },
        { limit: 609350, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ];

  let tax = 0;
  let prev = 0;
  for (const bracket of brackets) {
    if (income <= prev) break;
    const taxable = Math.min(income, bracket.limit) - prev;
    tax += taxable * bracket.rate;
    prev = bracket.limit;
  }
  return tax;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function TaxCalculatorPage() {
  const [grossRevenue, setGrossRevenue] = useState(150000);
  const [expenses, setExpenses] = useState(30000);
  const [entityType, setEntityType] = useState('Single-Member LLC');
  const [filingStatus, setFilingStatus] = useState('Single');

  const result = calculateTax(grossRevenue, expenses, entityType, filingStatus);
  const scorp = calculateTax(grossRevenue, expenses, 'S-Corp', filingStatus);

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-24">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC107]/10 border-2 border-[#FFC107] mb-6">
          <Calculator className="w-5 h-5 text-black dark:text-white" />
          <span className="text-sm font-semibold text-black dark:text-white">Tax Estimator</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 leading-tight">
          How much are you actually{' '}
          <span className="bg-[#FFC107] px-2">paying in taxes?</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Estimate your US federal tax burden based on your entity type, revenue, and filing status. See how S-Corp election could reduce your self-employment tax.
        </p>
      </section>

      {/* Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Inputs */}
          <div className="border-2 border-black dark:border-white rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]">
            <div className="bg-black px-6 py-4 border-b-2 border-black">
              <h2 className="font-black text-white">Your business details</h2>
            </div>
            <div className="p-6 space-y-6 bg-white dark:bg-[#111]">

              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  Gross annual revenue
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-black dark:text-white">$</span>
                  <input
                    type="number"
                    value={grossRevenue}
                    onChange={(e) => setGrossRevenue(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border-2 border-black dark:border-white rounded-xl bg-white dark:bg-[#0a0a0a] text-black dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  Business expenses
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-black dark:text-white">$</span>
                  <input
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border-2 border-black dark:border-white rounded-xl bg-white dark:bg-[#0a0a0a] text-black dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">Entity type</label>
                <div className="grid grid-cols-3 gap-2">
                  {entityTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setEntityType(type)}
                      className={`py-3 px-2 text-xs font-bold rounded-xl border-2 transition-all ${
                        entityType === type
                          ? 'bg-[#FFC107] border-black text-black'
                          : 'border-black dark:border-white bg-white dark:bg-[#0a0a0a] text-black dark:text-white hover:bg-[#FFC107]/10'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">Filing status</label>
                <div className="space-y-2">
                  {filingStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilingStatus(status)}
                      className={`w-full py-3 px-4 text-sm font-bold rounded-xl border-2 text-left transition-all ${
                        filingStatus === status
                          ? 'bg-[#FFC107] border-black text-black'
                          : 'border-black dark:border-white bg-white dark:bg-[#0a0a0a] text-black dark:text-white hover:bg-[#FFC107]/10'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#FFC107]/10 border-2 border-[#FFC107] rounded-xl flex gap-3">
                <Info className="w-5 h-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  This is an estimate for federal taxes only. State taxes, deductions, and credits vary. Consult a CPA for your actual tax planning.
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="border-2 border-black dark:border-white rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]">
              <div className="bg-black px-6 py-4 border-b-2 border-black">
                <h2 className="font-black text-white">Your estimated tax burden</h2>
              </div>
              <div className="p-6 bg-white dark:bg-[#111] space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Net profit</span>
                  <span className="font-black text-black dark:text-white">{fmt(result.netProfit)}</span>
                </div>
                {entityType !== 'C-Corp' && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Self-employment tax</span>
                    <span className="font-bold text-red-600">{fmt(result.seTax)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {entityType === 'C-Corp' ? 'Corporate income tax' : 'Federal income tax (est.)'}
                  </span>
                  <span className="font-bold text-red-600">{fmt(result.incomeTax)}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-red-50 dark:bg-red-950 rounded-xl px-4">
                  <span className="font-black text-black dark:text-white">Total estimated tax</span>
                  <span className="font-black text-2xl text-red-600">{fmt(result.totalTax)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500">Effective rate</span>
                  <span className="font-bold text-black dark:text-white">{result.effectiveRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {entityType === 'Single-Member LLC' && scorp.savings > 2000 && (
              <div className="border-2 border-[#4CAF50] rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(76,175,80,0.5)]">
                <div className="bg-[#4CAF50] px-6 py-4 border-b-2 border-[#4CAF50]">
                  <h3 className="font-black text-white">S-Corp opportunity detected</h3>
                </div>
                <div className="p-6 bg-green-50 dark:bg-green-950">
                  <p className="text-sm text-green-800 dark:text-green-300 mb-4">
                    Based on your net profit, an S-Corp election could reduce your annual tax bill by approximately:
                  </p>
                  <div className="text-4xl font-black text-green-700 dark:text-green-400 mb-4">{fmt(scorp.savings)}/yr</div>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 text-sm font-bold text-green-700 dark:text-green-400 hover:underline"
                  >
                    Talk to a CPA about S-Corp election <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            <div className="border-2 border-black dark:border-white rounded-2xl p-6 bg-white dark:bg-[#111]">
              <h3 className="font-black text-black dark:text-white mb-3">Want a real tax strategy?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This calculator gives you a starting point. A Prolify CPA can build your full tax plan — entity structure, quarterly estimates, deductions, and S-Corp analysis.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFC107] text-black font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Get Your Tax Strategy
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
