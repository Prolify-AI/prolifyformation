import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, MessageCircle, Target, TrendingUp, DollarSign, Shield } from 'lucide-react';

const features = [
  { title: 'S-Corp Election & Payroll', desc: 'For consultants earning $80K+, the S-Corp structure can eliminate $6,000–$20,000 in self-employment tax annually. We handle the election and ongoing payroll.' },
  { title: 'Invoice & Contract Tracking', desc: 'Track outstanding invoices, recurring retainers, and project-based revenue in one clean dashboard.' },
  { title: 'Business Expense Management', desc: 'Home office, travel, professional development, software — every deduction captured and documented properly.' },
  { title: 'Multi-Client Bookkeeping', desc: 'Revenue by client, project profitability, and receivables aging — the reports consulting businesses actually need.' },
  { title: 'Quarterly Tax Planning', desc: 'Estimated tax calculations every quarter so you never face a surprise bill at year end.' },
  { title: 'Entity Structure Optimization', desc: 'LLC, S-Corp, or sole proprietor — we model the structure that minimizes your effective tax rate given your revenue and business type.' },
];

const benefits = [
  { icon: MessageCircle, title: 'Consulting-specific tools', desc: 'Retainer tracking, project profitability, and client revenue breakdowns — built for service businesses.' },
  { icon: Target, title: 'S-Corp savings realized', desc: 'We identify when S-Corp election makes sense, file the election, and set up payroll so you capture the full benefit.' },
  { icon: TrendingUp, title: 'Quarterly planning included', desc: 'No end-of-year surprises. We plan your estimated taxes quarterly and adjust as your income changes.' },
  { icon: DollarSign, title: 'Maximum deductions', desc: 'Home office, vehicle, professional development, client entertainment — every deduction documented and defended.' },
  { icon: Shield, title: 'Audit-ready documentation', desc: 'Every expense categorized and documented properly, so an audit is never a crisis.' },
];

const faqs = [
  { q: 'When does S-Corp election make sense for a consultant?', a: 'Generally when your net consulting income exceeds $80,000 per year. Below that, the payroll costs outweigh the tax savings. We model the exact break-even point for your situation.' },
  { q: 'How do I track deductible business expenses?', a: 'Prolify automatically categorizes your transactions and flags potential deductions. You review and approve — no manual spreadsheets required.' },
  { q: 'Can I track revenue by client or project?', a: 'Yes. You can tag transactions by client or project and run P&L reports at that level. Useful for understanding your most profitable engagements.' },
  { q: 'What if I have both W-2 income and consulting income?', a: 'Common situation. We account for both income streams in your tax planning, making sure your estimated payments are accurate and your business entity structure is optimized for the mix.' },
];

export default function CoachesConsultantsPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="relative overflow-hidden bg-[#FFC107]">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '28px 28px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 border border-gray-900/20 mb-10">
            <MessageCircle className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">For Coaches & Consultants</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tight">
                Stop overpaying<br />SE tax. Start<br />
                <span className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-xl inline-block mt-2">keeping more.</span>
              </h1>
              <p className="text-xl text-gray-900/70 mb-10 leading-relaxed">
                Coaches and consultants pay more in self-employment tax than almost any other business type. Prolify fixes that — while handling your books, expenses, and compliance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-[#FFC107] font-black rounded-xl hover:bg-gray-800 transition-all shadow-lg">
                  Start Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-900/20 hover:border-gray-900/40 transition-all">
                  View Pricing
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">S-Corp savings example</p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Net consulting income</span>
                  <span className="font-black text-gray-900">$120,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Reasonable salary (S-Corp)</span>
                  <span className="font-black text-gray-900">$65,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-red-500">SE tax without S-Corp</span>
                  <span className="font-black text-red-500">$16,920</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">SE tax with S-Corp</span>
                  <span className="font-black text-gray-900">$9,945</span>
                </div>
              </div>
              <div className="bg-[#FFC107] rounded-xl p-4 text-center">
                <p className="text-xs font-bold text-gray-900/70 mb-1">Annual savings</p>
                <p className="text-4xl font-black text-gray-900">$6,975</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">Built for service businesses</h2>
          <p className="text-gray-600 mb-12 text-lg">Every financial tool a coaching or consulting business needs.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ title, desc }) => (
              <div key={title} className="border border-gray-200 rounded-xl p-6 hover:border-[#FFC107] hover:shadow-md transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFC107] flex-shrink-0 mt-0.5" />
                  <h3 className="font-black text-gray-900">{title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pl-8">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFC107] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">Why coaches and consultants choose Prolify</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-[#FFC107] rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-gray-900" />
                </div>
                <h3 className="font-black text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Common questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-l-4 border-[#FFC107] pl-6">
                <h3 className="font-black text-gray-900 mb-3">{q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Keep more of what you earn.
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            S-Corp optimization, clean books, and quarterly tax planning — built for service businesses.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-black text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-xl"
          >
            Start Free Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
