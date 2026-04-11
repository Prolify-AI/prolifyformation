import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, TrendingUp, ChartPie as PieChart, ChartLine as LineChart, ChartBar as BarChart3, Target, Zap } from 'lucide-react';

const metrics = [
  { label: 'Revenue', desc: 'Total, by source, by month, by customer' },
  { label: 'Profit & Loss', desc: 'Real-time P&L with drill-down by category' },
  { label: 'Cash Flow', desc: 'Forward-looking cash position and burn rate' },
  { label: 'Expenses', desc: 'Breakdown by vendor, category, and project' },
  { label: 'Tax liability', desc: 'Estimated quarterly and annual tax exposure' },
  { label: 'Growth trends', desc: 'MoM and YoY comparisons at a glance' },
  { label: 'Runway', desc: 'How long your cash lasts at current burn' },
  { label: 'Customer LTV', desc: 'Revenue per customer over time (SaaS)' },
  { label: 'Export & share', desc: 'PDF, CSV, or live link for investors' },
];

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-24">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC107]/10 border-2 border-[#FFC107] mb-6">
          <TrendingUp className="w-5 h-5 text-black dark:text-white" />
          <span className="text-sm font-semibold text-black dark:text-white">Analytics</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6 leading-tight">
              Stop guessing.{' '}
              <span className="bg-[#FFC107] px-2">Start knowing.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Most founders make major decisions based on a gut feeling and a bank balance. That&apos;s how you run out of money without seeing it coming.
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Prolify Analytics turns your bookkeeping data into a live financial dashboard — revenue trends, cash flow, profit margins, and tax exposure, all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFC107] text-black font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-[#0a0a0a] text-black dark:text-white font-bold rounded-lg border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                View Pricing
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BarChart3, label: 'Revenue Dashboard', color: 'bg-[#FFC107]' },
              { icon: PieChart, label: 'Expense Breakdown', color: 'bg-black dark:bg-white' },
              { icon: LineChart, label: 'Cash Flow Forecast', color: 'bg-[#4CAF50]' },
              { icon: Target, label: 'Tax Estimator', color: 'bg-gray-800 dark:bg-gray-200' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="border-2 border-black dark:border-white rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] flex flex-col items-center text-center gap-3">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-black dark:text-white text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black mb-4">What you can track</h2>
          <p className="text-gray-400 mb-12 text-lg">Every metric that matters for a growing business.</p>

          <div className="grid md:grid-cols-3 gap-4">
            {metrics.map(({ label, desc }) => (
              <div key={label} className="flex items-start gap-4 p-6 border-2 border-white/20 rounded-xl hover:border-[#FFC107] transition-colors">
                <CheckCircle2 className="w-6 h-6 text-[#FFC107] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">{label}</div>
                  <div className="text-sm text-gray-400 mt-1">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white mb-4">Built for decision-makers</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-12 text-lg">Not for accountants. For founders who need to move fast.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: 'Real-time data', desc: 'Your dashboard updates automatically as transactions are categorized. No waiting for month-end reports to know where you stand.' },
            { icon: TrendingUp, title: 'Investor-ready', desc: 'One-click export to PDF or shareable link. Give investors or board members live access to your financial performance.' },
            { icon: Target, title: 'Forecast-aware', desc: 'See projected cash position, estimated taxes, and runway — not just where you have been but where you are headed.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white dark:bg-[#111] border-2 border-black dark:border-white rounded-2xl p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              <div className="w-14 h-14 bg-[#FFC107] border-2 border-black dark:border-white rounded-xl flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Icon className="w-7 h-7 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Your numbers should work for you.
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            Get a live financial dashboard — included with every Prolify plan.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-black font-bold text-lg rounded-lg border-2 border-[#FFC107] shadow-[4px_4px_0px_0px_rgba(255,193,7,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(255,193,7,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Unlock My Analytics
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
