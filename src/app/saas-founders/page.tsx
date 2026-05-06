import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, Cloud, TrendingUp, Globe, DollarSign, Shield } from 'lucide-react';

const features = [
  { title: 'Delaware C-Corp Formation', desc: 'The VC-ready structure most SaaS founders need. We handle the Articles, EIN, registered agent, and initial resolutions.' },
  { title: 'Multi-State Compliance', desc: 'As you hire across state lines, we track and file the foreign qualifications and annual reports you need.' },
  { title: 'R&D Tax Credit Support', desc: 'Most SaaS founders leave significant R&D credits on the table. We identify and document qualifying expenses.' },
  { title: 'Cap Table Readiness', desc: 'Proper equity documentation from day one — 83(b) elections, option pool setup, and clean cap table structure.' },
  { title: 'Subscription Revenue Accounting', desc: 'ASC 606 revenue recognition for SaaS — MRR tracking, deferred revenue, and clean financials for fundraising.' },
  { title: 'Payroll & Contractor Setup', desc: 'Global payroll setup for your distributed team. Misclassification risk review included.' },
];

const benefits = [
  { icon: Cloud, title: 'Built for SaaS', desc: 'Recurring revenue businesses have specific accounting and tax needs. Prolify is designed for them.' },
  { icon: TrendingUp, title: 'Fundraising-ready books', desc: 'Clean, GAAP-aligned financials that satisfy investor due diligence at every stage.' },
  { icon: Globe, title: 'Global team support', desc: 'International contractors, US employees, and multi-currency payroll — all managed in one place.' },
  { icon: DollarSign, title: 'R&D credit optimization', desc: 'Identify and claim every R&D credit your product development activities qualify for.' },
  { icon: Shield, title: 'IP protection structure', desc: 'Proper IP assignment agreements and structure to protect your codebase from day one.' },
];

const faqs = [
  { q: 'Should my SaaS company be a C-Corp or LLC?', a: 'Most venture-backed or VC-seeking SaaS founders should use a Delaware C-Corp. If you are bootstrapped and profitable, an LLC with S-Corp election may save you more in taxes. We help you decide.' },
  { q: 'How does Prolify help with fundraising?', a: 'Clean books, proper cap table structure, GAAP-aligned financials, and 83(b) election tracking — all the things VCs look for in due diligence, maintained automatically.' },
  { q: 'Can Prolify handle multi-currency accounting?', a: 'Yes. If you bill customers in multiple currencies, Prolify tracks exchange rates, handles translation adjustments, and keeps your books clean for tax purposes.' },
  { q: 'What about equity and options?', a: 'Prolify tracks your equity structure and helps ensure 83(b) elections are filed on time. We coordinate with your attorneys on option plan setup and vesting schedules.' },
];

export default function SaasFoundersPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="relative overflow-hidden bg-[#FFC107]">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '28px 28px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 border border-gray-900/20 mb-10">
            <Cloud className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">For SaaS Founders</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tight">
                The back office<br />your SaaS<br />
                <span className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-xl inline-block mt-2">deserves.</span>
              </h1>
              <p className="text-xl text-gray-900/70 mb-10 leading-relaxed">
                Formation, bookkeeping, taxes, and compliance — built specifically for recurring revenue businesses. From pre-seed to Series A and beyond.
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
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '$0', label: 'Formation fees to start' },
                { stat: '83(b)', label: 'Election tracking built in' },
                { stat: 'GAAP', label: 'Aligned financials' },
                { stat: 'R&D', label: 'Credit optimization' },
              ].map(({ stat, label }) => (
                <div key={label} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-3xl font-black text-gray-900 mb-1">{stat}</div>
                  <div className="text-xs text-gray-600">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">Everything a SaaS company needs</h2>
          <p className="text-gray-600 mb-12 text-lg">From incorporation to Series A — every financial operation covered.</p>
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
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">Why SaaS founders choose Prolify</h2>
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
            Build your SaaS on a solid foundation.
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            Formation, books, taxes, and compliance — handled from day one.
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
