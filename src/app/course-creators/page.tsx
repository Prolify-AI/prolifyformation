import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, GraduationCap, Video, Users, DollarSign, Globe, Shield } from 'lucide-react';

const features = [
  { title: 'Multi-Platform Revenue Tracking', desc: 'Teachable, Kajabi, Thinkific, Podia, Gumroad — every platform payout reconciled automatically into clean monthly books.' },
  { title: 'Subscription Revenue Accounting', desc: 'Recurring membership revenue treated correctly — deferred revenue, churn tracking, and MRR reporting.' },
  { title: 'Digital Product Sales Tax', desc: 'Digital goods are taxable in 27 states. We track your nexus and file returns so you stay compliant.' },
  { title: 'Creator Tax Deductions', desc: 'Equipment, software, home studio, contractor payments, and course tools — every deduction captured.' },
  { title: 'Affiliate Income Management', desc: 'Affiliate commissions tracked separately from course revenue for accurate P&L and tax reporting.' },
  { title: 'Entity Structure for Creators', desc: 'Whether you need an LLC, S-Corp, or sole proprietor setup — we model the best structure for your creator income level.' },
];

const platforms = [
  { name: 'Teachable', status: 'Synced' },
  { name: 'Kajabi', status: 'Synced' },
  { name: 'Thinkific', status: 'Synced' },
  { name: 'Gumroad', status: 'Synced' },
  { name: 'Podia', status: 'Synced' },
  { name: 'Stripe', status: 'Synced' },
];

const benefits = [
  { icon: Video, title: 'Platform-agnostic', desc: 'Run courses on any platform. Prolify pulls revenue from all of them into one set of books.' },
  { icon: Users, title: 'Affiliate tracking built in', desc: 'Affiliate income reconciled separately — important for accurate P&L and 1099 compliance.' },
  { icon: DollarSign, title: 'Digital tax compliance', desc: 'Sales tax on digital goods handled automatically — registration, collection guidance, and filing.' },
  { icon: Globe, title: 'International sales', desc: 'EU VAT, UK digital tax, and other international obligations for creators with global audiences.' },
  { icon: Shield, title: 'Contractor 1099s', desc: 'Editors, VAs, designers — track contractor payments throughout the year and generate 1099s at tax time.' },
];

const faqs = [
  { q: 'How does Prolify handle Teachable or Kajabi payouts?', a: 'We connect directly to your platform accounts and pull all payout data monthly — including fees, refunds, and net proceeds — into your books automatically.' },
  { q: 'Do I have to collect sales tax on my courses?', a: 'In 27 states, digital products (including online courses) are subject to sales tax. Prolify tracks your sales in each state and handles registration and filing where required.' },
  { q: 'What deductions can a course creator claim?', a: 'Equipment, software subscriptions, home office, video production, course tools, contractor fees, professional development, and marketing costs — we make sure none of these are missed.' },
  { q: 'What entity structure should a course creator use?', a: 'Depends on your revenue. Under $50K, a simple LLC works. Over $80K net, an S-Corp election often saves meaningful money on self-employment tax. We model your specific situation.' },
];

export default function CourseCreatorsPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="relative overflow-hidden bg-[#FFC107]">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '28px 28px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 border border-gray-900/20 mb-10">
            <GraduationCap className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">For Course Creators</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tight">
                All your platforms.<br />One set of<br />
                <span className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-xl inline-block mt-2">clean books.</span>
              </h1>
              <p className="text-xl text-gray-900/70 mb-10 leading-relaxed">
                Course creators run on 3–6 platforms, earn from subscriptions and one-time sales, and owe sales tax in states they have never heard of. Prolify handles all of it.
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
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Platform integrations</p>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map(({ name, status }) => (
                  <div key={name} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <span className="font-bold text-gray-900 text-sm">{name}</span>
                    <span className="text-xs bg-[#FFC107] text-gray-900 font-bold px-2 py-0.5 rounded-full">{status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-[#FFC107]/10 border border-[#FFC107]/30 rounded-lg text-center">
                <span className="text-sm text-gray-700 font-bold">+ more platforms added regularly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">Built for creator businesses</h2>
          <p className="text-gray-600 mb-12 text-lg">Every financial tool a course creator or digital educator needs.</p>
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
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">Why course creators choose Prolify</h2>
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
            Focus on creating. We handle the numbers.
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            Multi-platform bookkeeping, digital sales tax, and creator tax optimization — all in one place.
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
