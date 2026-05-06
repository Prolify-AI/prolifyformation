import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, Calculator, FileCheck, Calendar, Shield, CircleAlert as AlertCircle } from 'lucide-react';

const services = [
  { title: 'Federal tax return', desc: 'Forms 1120, 1065, Schedule C — filed accurately, on time' },
  { title: 'State tax returns', desc: 'Multi-state filings handled with full nexus analysis' },
  { title: 'Form 5472', desc: 'Required for all foreign-owned US LLCs — we do this right' },
  { title: 'Sales tax compliance', desc: 'Registration, filing, and remittance in all applicable states' },
  { title: 'Quarterly estimated taxes', desc: 'Calculate and pay on time — no penalties' },
  { title: 'Tax planning strategy', desc: 'Proactive advice, not just year-end scramble' },
  { title: 'Deduction maximization', desc: 'We find what you can write off — legally' },
  { title: 'CPA review + sign-off', desc: 'Licensed CPAs review every return before filing' },
  { title: 'IRS correspondence', desc: 'We handle letters, notices, and audits on your behalf' },
];

const faqs = [
  {
    q: 'Do I need to file taxes if my LLC had no revenue?',
    a: 'Yes. Foreign-owned US LLCs must file Form 5472 even with zero activity. Failure to file carries a $25,000 penalty per year.',
  },
  {
    q: 'What is Form 5472 and do I need it?',
    a: 'Form 5472 is required for any US LLC with a foreign (non-US) owner. It reports transactions between the LLC and its foreign owner. If you formed a US LLC and you are not a US citizen or resident, you almost certainly need this.',
  },
  {
    q: 'When are business taxes due?',
    a: 'S-Corps and partnerships: March 15. C-Corps and sole proprietors: April 15. Extensions are available. We track all deadlines for you.',
  },
  {
    q: 'Can you help with back taxes?',
    a: 'Yes. We can prepare prior-year returns, file late Form 5472s, and help negotiate penalty abatement with the IRS.',
  },
];

export default function TaxesPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/40 mb-6">
          <Calculator className="w-5 h-5 text-gray-700" />
          <span className="text-sm font-semibold text-gray-700">Tax Services</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              US taxes are{' '}
              <span className="bg-[#FFC107] px-2">complicated.</span>{' '}
              We are not.
            </h1>
            <p className="text-xl text-gray-500 mb-4 leading-relaxed">
              CPA-backed tax filing for US businesses owned by founders anywhere in the world. Federal, state, Form 5472, sales tax — handled.
            </p>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              We do not just file your taxes. We make sure you never pay more than you owe and never miss a deadline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFC107] text-gray-900 font-bold rounded-xl hover:bg-[#FFB300] transition-all shadow-md hover:shadow-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/tax-calculator"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              >
                Estimate My Taxes
              </Link>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start gap-3 mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">
                The IRS penalty for missing Form 5472 is $25,000 per year — even if your LLC had zero revenue.
              </p>
            </div>
            <h3 className="font-black text-xl text-gray-900 mb-4">If you are a non-US founder, you likely need:</h3>
            <div className="space-y-3">
              {[
                { label: 'Form 5472', note: 'Foreign-owned LLC disclosure' },
                { label: 'Pro Forma 1120', note: 'Annual return for single-member LLCs' },
                { label: 'FBAR / FinCEN', note: 'Foreign bank account reporting' },
                { label: 'State returns', note: 'Varies by state of formation' },
                { label: 'Estimated taxes', note: 'Quarterly if you expect to owe $1,000+' },
              ].map(({ label, note }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="font-bold text-gray-900">{label}</span>
                  <span className="text-sm text-gray-500">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Everything in our tax service</h2>
          <p className="text-gray-500 mb-12 text-lg">One subscription. Every filing covered.</p>

          <div className="grid md:grid-cols-3 gap-4">
            {services.map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CheckCircle2 className="w-6 h-6 text-[#FFC107] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">{title}</div>
                  <div className="text-sm text-gray-500 mt-1">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Prolify */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Why founders trust Prolify for taxes</h2>
        <p className="text-gray-500 mb-12 text-lg">We specialize in international founders, not just domestic businesses.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: 'CPA-backed every time', desc: 'Every return is reviewed and signed by a licensed CPA. Not a software tool. Not an algorithm. A real professional accountable for your filing.' },
            { icon: FileCheck, title: 'Built for non-US founders', desc: 'We understand the specific requirements for foreign-owned LLCs: Form 5472, ECI rules, treaty considerations. Most accountants do not.' },
            { icon: Calendar, title: 'We own the deadlines', desc: 'We track every due date and file proactively. You will never miss a quarterly payment or receive a late filing penalty because we forgot to remind you.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#FFC107]/15 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-7 h-7 text-[#b08800]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 border-y border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">Tax questions, answered</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">{q}</h3>
                <p className="text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
            File once. File right. Sleep better.
          </h2>
          <p className="text-gray-500 text-xl mb-8">
            Join founders in 50+ countries who trust Prolify with their US tax filings.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-bold text-lg rounded-xl hover:bg-[#FFB300] transition-all shadow-md hover:shadow-lg"
          >
            Start Tax Filing Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
