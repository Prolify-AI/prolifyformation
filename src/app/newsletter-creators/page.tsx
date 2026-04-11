import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, Mail, Users, DollarSign, TrendingUp, Globe, Zap } from 'lucide-react';

const features = [
  { title: 'Newsletter Revenue Tracking', desc: 'Beehiiv, Substack, ConvertKit, Ghost — subscription and paid newsletter revenue reconciled automatically every month.' },
  { title: 'Ad & Sponsorship Income', desc: 'Sponsorship revenue tracked separately from subscription revenue for accurate P&L and proper tax treatment.' },
  { title: 'Creator Expense Management', desc: 'Writing tools, email platforms, design software, contractor fees — all categorized and deduction-ready.' },
  { title: 'Paid Subscriber Accounting', desc: 'Monthly recurring revenue, upgrades, downgrades, and churned subscribers tracked accurately.' },
  { title: 'Digital Sales Tax', desc: 'Paid newsletter subscriptions may be taxable as digital goods in certain states. We track and file where required.' },
  { title: 'Affiliate Income Separation', desc: 'Affiliate commissions tracked separately from subscription revenue — important for 1099 compliance and accurate reporting.' },
];

const revenueStreams = [
  { stream: 'Paid subscriptions', platform: 'Beehiiv / Substack' },
  { stream: 'Newsletter sponsorships', platform: 'Direct / Networks' },
  { stream: 'Affiliate commissions', platform: 'Multiple networks' },
  { stream: 'Digital products', platform: 'Gumroad / Stripe' },
  { stream: 'Course & cohort sales', platform: 'Teachable / Kajabi' },
  { stream: 'Consulting & advisory', platform: 'Direct billing' },
];

const benefits = [
  { icon: Mail, title: 'Platform-ready integrations', desc: 'Beehiiv, Substack, ConvertKit, Ghost — connected and reconciled automatically.' },
  { icon: Users, title: 'Subscriber revenue tracked', desc: 'MRR, churn, upgrades, and subscriber-level revenue reporting built for newsletter businesses.' },
  { icon: DollarSign, title: 'Sponsorship accounting', desc: 'Ad deals and sponsorship income tracked with correct timing — when earned, not when paid.' },
  { icon: TrendingUp, title: 'Growth-ready books', desc: 'Clean financials that support sponsorship pitches, acquisition conversations, or investor updates.' },
  { icon: Globe, title: 'International subscriber tax', desc: 'EU VAT, UK digital tax — we flag international obligations for newsletters with global audiences.' },
  { icon: Zap, title: 'Quarterly tax planning', desc: 'Estimated taxes calculated every quarter. No surprises when April comes.' },
];

const faqs = [
  { q: 'How does Prolify handle Beehiiv or Substack payouts?', a: 'We connect directly to your newsletter platform accounts and pull payout data monthly — including fees, refunds, and net proceeds — into your books automatically.' },
  { q: 'Do newsletter subscriptions trigger sales tax?', a: 'In some states, yes. Digital subscription services are taxable as digital goods in about 27 states. Prolify tracks your subscriber revenue by state and handles registration and filing where required.' },
  { q: 'How do I track multiple revenue streams (subs + ads + affiliates)?', a: 'Prolify tags each revenue type separately so you can see P&L by stream. Sponsorship revenue, subscription revenue, and affiliate income are tracked and reported independently.' },
  { q: 'What entity structure makes sense for a newsletter business?', a: 'If your newsletter earns less than $50K net, a simple LLC is usually sufficient. Above $80K, S-Corp election can save meaningful money on self-employment tax. We model the exact break-even for your situation.' },
];

export default function NewsletterCreatorsPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="relative overflow-hidden bg-[#FFC107]">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '28px 28px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 border border-gray-900/20 mb-10">
            <Mail className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">For Newsletter Creators</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tight">
                Every revenue<br />stream. One set<br />
                <span className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-xl inline-block mt-2">of clean books.</span>
              </h1>
              <p className="text-xl text-gray-900/70 mb-10 leading-relaxed">
                Newsletter businesses earn from subscriptions, sponsorships, affiliates, digital products, and consulting. Prolify tracks and reconciles every stream so you always know where you stand.
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
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Revenue streams we track</p>
              <div className="space-y-3">
                {revenueStreams.map(({ stream, platform }) => (
                  <div key={stream} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#FFC107] flex-shrink-0" />
                      <span className="text-sm font-bold text-gray-900">{stream}</span>
                    </div>
                    <span className="text-xs text-gray-500">{platform}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">Built for newsletter businesses</h2>
          <p className="text-gray-600 mb-12 text-lg">Every financial tool a newsletter creator needs.</p>
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
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">Why newsletter creators choose Prolify</h2>
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
            Focus on writing. We handle the numbers.
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            Multi-stream bookkeeping, digital sales tax, and creator tax optimization — all in one place.
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
