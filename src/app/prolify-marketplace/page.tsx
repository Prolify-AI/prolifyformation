import Link from 'next/link';
import { ArrowRight, Store, Star, CircleCheck as CheckCircle2, Users, Shield, Zap } from 'lucide-react';

const categories = [
  {
    title: 'Legal Services',
    services: ['Operating agreement drafting', 'Contract review', 'Trademark registration', 'Terms of service & privacy policy'],
    providers: '12 vetted providers',
  },
  {
    title: 'Financial Services',
    services: ['Tax preparation (1040, 1120)', 'CFO advisory', 'Financial modeling', 'Audit preparation'],
    providers: '8 vetted providers',
  },
  {
    title: 'Banking & Payments',
    services: ['Business account setup assistance', 'Merchant account setup', 'Payment processor comparison', 'Multi-currency optimization'],
    providers: '6 vetted providers',
  },
  {
    title: 'Business Operations',
    services: ['HR and contractor onboarding', 'Benefits administration', 'Insurance brokerage', 'Registered agent services'],
    providers: '10 vetted providers',
  },
  {
    title: 'Growth & Marketing',
    services: ['Fractional CMO', 'Paid media management', 'SEO strategy', 'Brand identity design'],
    providers: '15 vetted providers',
  },
  {
    title: 'Technology',
    services: ['MVP development', 'Automation and integrations', 'Cloud infrastructure', 'Security audit'],
    providers: '20 vetted providers',
  },
];

const howItWorks = [
  { step: '01', title: 'Browse providers', desc: 'Every provider in the Prolify Marketplace has been vetted for quality, pricing transparency, and experience with founder-stage businesses.' },
  { step: '02', title: 'Match to your need', desc: 'Filter by service type, price range, and specialization. See real reviews from other Prolify members before you commit.' },
  { step: '03', title: 'Connect directly', desc: 'No middleman markup. You connect directly with the provider and pay them directly — Prolify just handles the matching.' },
  { step: '04', title: 'Keep everything in sync', desc: 'Service agreements and key documents sync back to your Prolify dashboard automatically.' },
];

export default function ProlifyMarketplacePage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="relative overflow-hidden bg-[#FFC107]">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '28px 28px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 border border-gray-900/20 mb-10">
            <div className="w-2 h-2 rounded-full bg-gray-900 animate-pulse" />
            <Store className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Prolify Marketplace</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tight">
                Every expert<br />your business<br />
                <span className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-2xl inline-block mt-2">Already vetted.</span>
              </h1>
              <p className="text-xl text-gray-900/70 mb-4 leading-relaxed">
                Finding the right attorney, accountant, or consultant is time-consuming and risky. The Prolify Marketplace connects you with specialists who understand founder-stage businesses.
              </p>
              <p className="text-xl text-gray-900/70 mb-10 leading-relaxed">
                Every provider is vetted. Every engagement is transparent. No surprise invoices, no scope creep.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-[#FFC107] font-black rounded-xl hover:bg-gray-800 transition-all shadow-lg">
                  Browse Marketplace
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-900/20 hover:border-gray-900/40 transition-all">
                  View Pricing
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { number: '70+', label: 'Vetted providers' },
                { number: '6', label: 'Service categories' },
                { number: '4.8★', label: 'Avg provider rating' },
                { number: '$0', label: 'Matching fee' },
                { number: '24h', label: 'Avg response time' },
                { number: '100%', label: 'Members exclusive' },
              ].map(({ number, label }) => (
                <div key={label} className="bg-gray-900 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-white">{number}</div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-gray-900">How the Marketplace works</h2>
          <div className="grid md:grid-cols-4 gap-0 border border-gray-200 rounded-2xl overflow-hidden">
            {howItWorks.map(({ step, title, desc }, i) => (
              <div key={step} className={`p-8 ${i < 3 ? 'border-r border-gray-200' : ''}`}>
                <div className="text-5xl font-black text-[#FFC107] mb-4">{step}</div>
                <h3 className="font-black text-lg mb-2 text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFC107] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Browse by category</h2>
          <p className="text-gray-900/70 mb-12 text-lg">Specialists for every stage of your business.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(({ title, services, providers }) => (
              <div key={title} className="border border-gray-900/20 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                <div className="bg-gray-900 px-5 py-3">
                  <h3 className="font-black text-[#FFC107]">{title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{providers}</p>
                </div>
                <div className="p-5 space-y-2">
                  {services.map((service) => (
                    <div key={service} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-12 text-center">Why trust Prolify Marketplace providers?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Vetting process', desc: 'Every provider undergoes background checks, credential verification, and a sample engagement review before joining the marketplace.' },
              { icon: Star, title: 'Verified reviews', desc: 'Reviews come only from verified Prolify members who completed paid engagements. No fake reviews, no pay-to-play rankings.' },
              { icon: Users, title: 'Founder-first pricing', desc: 'All marketplace providers offer transparent, founder-stage pricing. No enterprise contracts, no retainer traps.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border-t-4 border-[#FFC107] pt-6">
                <div className="w-10 h-10 bg-[#FFC107] rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-gray-900" />
                </div>
                <h3 className="font-black text-gray-900 mb-2 text-lg">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            The right expert for every stage.
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            Access the Prolify Marketplace with any plan. Browse for free, pay only when you engage.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-black text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-xl"
          >
            Access Marketplace Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
