import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, Shield, Bell, FileCheck, TriangleAlert as AlertTriangle } from 'lucide-react';

const services = [
  { title: 'Annual state report filing', desc: 'Automatically filed before due dates in all states' },
  { title: 'Registered agent service', desc: 'Legal address + instant notification of official mail' },
  { title: 'BOI report (FinCEN)', desc: 'Beneficial Ownership Information — now required by law' },
  { title: 'Operating agreement updates', desc: 'Keep your docs current as your business evolves' },
  { title: 'Business license monitoring', desc: 'Track renewals, permits, and local requirements' },
  { title: 'Foreign qualification', desc: 'Expand to new states with proper registration' },
  { title: 'Corporate minutes', desc: 'Maintain proper governance records' },
  { title: 'Good standing certificates', desc: 'Issued on demand for banks, partners, investors' },
  { title: 'Compliance calendar', desc: 'Every deadline tracked and visible in your dashboard' },
];

const faqs = [
  {
    q: 'What is a BOI report and do I need it?',
    a: 'The Beneficial Ownership Information report is required by FinCEN for most US LLCs and corporations. You must report who owns or controls your business. Failure to file can result in $500/day fines and potential criminal penalties.',
  },
  {
    q: 'What is registered agent service?',
    a: 'A registered agent receives official legal and government correspondence on behalf of your business. You are required by law to have one in the state where your LLC is formed.',
  },
  {
    q: 'How often do I need to file annual reports?',
    a: 'It varies by state — some are annual, some are biennial. Due dates and fees also vary. We track all of this for you automatically.',
  },
  {
    q: 'What happens if I miss a compliance deadline?',
    a: 'Late fees, administrative dissolution, and loss of good standing. A dissolved LLC cannot legally operate, sign contracts, or open bank accounts. Prevention is far cheaper than fixing it.',
  },
];

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/40 mb-6">
          <Shield className="w-5 h-5 text-gray-700" />
          <span className="text-sm font-semibold text-gray-700">Compliance</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              One missed deadline{' '}
              <span className="bg-[#FFC107] px-2">can dissolve your LLC.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-4 leading-relaxed">
              Annual reports. BOI filings. Registered agent. State licenses. The list of compliance requirements grows every year — and missing any of them has real consequences.
            </p>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              Prolify&apos;s AI Compliance Copilot monitors every requirement for your business and files automatically — before deadlines, not after.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFC107] text-gray-900 font-bold rounded-xl hover:bg-[#FFB300] transition-all shadow-md hover:shadow-lg"
              >
                Stay Compliant
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              >
                View Pricing
              </Link>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start gap-3 mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">
                Missing a BOI filing can result in $500/day fines and criminal penalties.
              </p>
            </div>
            <h3 className="font-black text-xl text-gray-900 mb-4">Common compliance failures we prevent:</h3>
            <div className="space-y-3">
              {[
                'Annual report not filed → LLC dissolved',
                'BOI not submitted → Federal penalties',
                'Registered agent lapsed → Legal notices missed',
                'Operating in new state without qualification',
                'Business license expired → Operating illegally',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-500 text-xs font-bold">✗</span>
                  </div>
                  <span className="text-gray-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">What we cover</h2>
          <p className="text-gray-500 mb-12 text-lg">Every compliance requirement for your US business, handled automatically.</p>

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

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">AI Compliance Copilot</h2>
        <p className="text-gray-500 mb-12 text-lg">Monitoring your compliance status so you never have to.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Bell, title: 'Continuous monitoring', desc: 'We track your compliance requirements across all states in real time. When something is due, we handle it — not remind you to handle it.' },
            { icon: FileCheck, title: 'Automatic filing', desc: 'Annual reports, BOI updates, registered agent renewal — filed proactively before deadlines, with confirmations in your dashboard.' },
            { icon: Shield, title: 'Always in good standing', desc: 'Your LLC stays active, valid, and legally operational. Banks, investors, and partners can always verify your good standing status.' },
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
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">Compliance questions, answered</h2>
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
            Stay protected. Stay compliant.
          </h2>
          <p className="text-gray-500 text-xl mb-8">
            Let Prolify track every deadline and handle every filing — automatically.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-bold text-lg rounded-xl hover:bg-[#FFB300] transition-all shadow-md hover:shadow-lg"
          >
            Activate Compliance Protection
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
