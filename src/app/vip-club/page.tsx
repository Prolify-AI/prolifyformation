import Link from 'next/link';
import { ArrowRight, Crown, CircleCheck as CheckCircle2, Users, Zap, Star, Shield, Globe } from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: 'Founder peer network',
    desc: 'Access to a curated community of vetted founders. Not a Discord with 50,000 strangers — a tight network of real operators who share what works.',
  },
  {
    icon: Zap,
    title: 'Priority support',
    desc: 'VIP members skip the queue. Tax questions, compliance issues, formation problems — you get a same-day response from a senior team member.',
  },
  {
    icon: Star,
    title: 'Early access to features',
    desc: 'New Prolify features go to VIP members first. You shape the product and get the advantage before anyone else.',
  },
  {
    icon: Globe,
    title: 'Monthly hot seat sessions',
    desc: 'Monthly small-group sessions where our CPAs and attorneys review your specific business situation — not a generic webinar.',
  },
  {
    icon: Shield,
    title: 'Annual compliance review',
    desc: 'A full review of your entity structure, compliance calendar, and tax strategy — once per year, included in your membership.',
  },
  {
    icon: Crown,
    title: 'Exclusive marketplace rates',
    desc: 'VIP members get preferred pricing with Marketplace providers — attorneys, accountants, and consultants who reserve capacity for VIP referrals.',
  },
];

const included = [
  'All Prolify platform features (formation, bookkeeping, taxes, analytics)',
  'Unlimited AI Chief of Staff access',
  'Full Prolify University course library',
  'All Prolify Marketplace access',
  'Priority support queue',
  'Monthly hot seat sessions with CPAs',
  'Annual compliance review',
  'VIP peer network access',
  'Early feature access',
  'Exclusive Marketplace provider rates',
];

const faqs = [
  {
    q: 'Who is VIP Club for?',
    a: 'Founders who are past the "getting started" phase and want white-glove support, a peer network of real operators, and priority access to Prolify\'s senior team. Typically founders with $100K+ in annual revenue who treat their business seriously.',
  },
  {
    q: 'What is the peer network like?',
    a: 'Applications are reviewed. Not everyone is accepted. The network includes e-commerce sellers, SaaS founders, consultants, and content creators — all running real businesses. No beginners asking basic questions.',
  },
  {
    q: 'What happens in the monthly hot seat sessions?',
    a: 'Small groups of 5-10 VIP members meet with a Prolify CPA or attorney. You can bring your specific question — your entity structure, a tricky deduction, a compliance concern — and get a live answer. Recordings are available.',
  },
  {
    q: 'Can I upgrade to VIP from another plan?',
    a: 'Yes. You can upgrade at any time and your VIP access activates immediately. Your existing data, books, and history transfer seamlessly.',
  },
];

export default function VIPClubPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="relative overflow-hidden bg-[#FFC107]">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '28px 28px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 border border-gray-900/20 mb-10">
            <Crown className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Prolify VIP Club</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tight">
                White-glove<br />support for<br />founders who{' '}
                <span className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-xl inline-block mt-2">play to win.</span>
              </h1>
              <p className="text-xl text-gray-900/70 mb-4 leading-relaxed">
                The Prolify VIP Club is for founders who have moved past the basics and want the full Prolify experience — priority support, peer network, monthly expert sessions, and annual compliance reviews.
              </p>
              <p className="text-xl text-gray-900/70 mb-10 leading-relaxed">
                Not a community of beginners. A network of operators who share what works, get answers fast, and hold each other accountable.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-[#FFC107] font-black rounded-xl hover:bg-gray-800 transition-all shadow-lg"
                >
                  Apply to VIP Club
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-900/20 hover:border-gray-900/40 transition-all"
                >
                  See Pricing
                </Link>
              </div>
            </div>

            <div className="border border-gray-900/20 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gray-900 px-6 py-4 flex items-center gap-3">
                <Crown className="w-5 h-5 text-[#FFC107]" />
                <span className="font-black text-[#FFC107]">Everything included in VIP</span>
              </div>
              <div className="p-6 space-y-3 bg-white">
                {included.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">What VIP members get</h2>
          <p className="text-gray-600 mb-12 text-lg">Everything in Prolify, plus the benefits that actually move the needle.</p>

          <div className="grid md:grid-cols-3 gap-4">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-gray-200 rounded-2xl p-6 hover:border-[#FFC107] hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-[#FFC107] rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-gray-900" />
                </div>
                <h3 className="font-black text-lg mb-2 text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFC107] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-12">VIP Club questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-l-4 border-gray-900 pl-6">
                <h3 className="font-black text-gray-900 mb-3">{q}</h3>
                <p className="text-gray-900/70 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="w-12 h-12 text-[#FFC107] mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Run your business at the highest level.
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            VIP Club memberships are reviewed. Apply today.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-black text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-xl"
          >
            Apply for VIP Access
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
