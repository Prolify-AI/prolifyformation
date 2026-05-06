import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, Hop as Home, Key, Shield, TrendingUp, DollarSign, Briefcase } from 'lucide-react';

const features = [
  { title: 'LLC Structure for Properties', desc: 'Single-member LLCs per property or series LLCs for portfolio protection — we set up the right structure and maintain it.' },
  { title: 'Depreciation Tracking', desc: 'MACRS depreciation schedules for all your properties, cost segregation opportunities identified, and bonus depreciation maximized.' },
  { title: '1031 Exchange Coordination', desc: 'We track your 45-day and 180-day deadlines, coordinate with your QI, and make sure the exchange is documented correctly for the IRS.' },
  { title: 'Rental Income Accounting', desc: 'Monthly rent rolls, security deposit tracking, owner draws, and property-level P&L — clean books for every property.' },
  { title: 'FIRPTA for Foreign Investors', desc: 'Non-US investors have specific withholding and filing requirements on US real estate. We handle FIRPTA compliance from acquisition to sale.' },
  { title: 'Portfolio P&L Reporting', desc: 'See your entire portfolio — cash flow, appreciation, total return — in one consolidated view updated monthly.' },
];

const benefits = [
  { icon: Home, title: 'Property-level books', desc: 'Each property tracked separately with its own P&L, balance sheet, and depreciation schedule.' },
  { icon: Key, title: '1031 exchange support', desc: 'We manage the paperwork, deadlines, and documentation for tax-deferred exchanges.' },
  { icon: TrendingUp, title: 'Depreciation maximized', desc: 'Cost segregation analysis identifies accelerated depreciation opportunities most investors miss.' },
  { icon: DollarSign, title: 'Passive loss optimization', desc: 'Real estate professional status, passive loss rules, and grouping elections — all applied correctly.' },
  { icon: Shield, title: 'FIRPTA compliance', desc: 'Foreign investor? We handle withholding certificates, filings, and treaty applications.' },
  { icon: Briefcase, title: 'Portfolio reporting', desc: 'Consolidated view of your entire portfolio — cash flow, equity, returns — in one dashboard.' },
];

const faqs = [
  { q: 'Should each property be in its own LLC?', a: 'Generally yes, for liability isolation. But the right structure depends on your state, number of properties, and whether you have lender restrictions. We analyze your situation and recommend the optimal setup.' },
  { q: 'How does depreciation work on rental property?', a: 'Residential real property is depreciated over 27.5 years. With cost segregation, we can accelerate depreciation on components (flooring, appliances, landscaping) to generate larger deductions in earlier years.' },
  { q: 'What is FIRPTA and do I need to worry about it?', a: 'FIRPTA requires buyers to withhold 15% of the sale price when a non-US person sells US real property. As a foreign investor, you need a withholding certificate to reduce or eliminate this withholding. We manage the process.' },
  { q: 'Can Prolify track short-term rental income separately?', a: 'Yes. Airbnb and VRBO income is tracked separately with its own P&L, and the tax treatment (self-rental vs passive income) is applied correctly based on days rented and your participation level.' },
];

export default function RealEstateInvestorsPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="relative overflow-hidden bg-[#FFC107]">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '28px 28px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 border border-gray-900/20 mb-10">
            <Home className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">For Real Estate Investors</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tight">
                Every property.<br />Every deduction.<br />
                <span className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-xl inline-block mt-2">Fully optimized.</span>
              </h1>
              <p className="text-xl text-gray-900/70 mb-10 leading-relaxed">
                Real estate investors have some of the most powerful tax strategies available — depreciation, 1031 exchanges, passive losses — but only if your books support them.
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
                { stat: '27.5yr', label: 'Residential depreciation' },
                { stat: '1031', label: 'Exchange tracking' },
                { stat: 'FIRPTA', label: 'Foreign investor support' },
                { stat: '100%', label: 'Property-level P&L' },
              ].map(({ stat, label }) => (
                <div key={label} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-2xl font-black text-gray-900 mb-1">{stat}</div>
                  <div className="text-xs text-gray-600">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">Built for real estate complexity</h2>
          <p className="text-gray-600 mb-12 text-lg">From single family rentals to multi-property portfolios.</p>
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
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">Why real estate investors choose Prolify</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            Your properties working harder for you.
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            Depreciation, 1031s, passive losses, FIRPTA — all handled correctly, all the time.
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
