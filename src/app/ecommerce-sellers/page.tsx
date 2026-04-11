import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, ShoppingCart, Package, DollarSign, Globe } from 'lucide-react';

const risks = [
  { label: 'Uncollected sales tax', risk: 90 },
  { label: 'Misclassified inventory', risk: 70 },
  { label: 'Missed COGS deductions', risk: 80 },
  { label: 'No foreign nexus tracking', risk: 65 },
];

const features = [
  { title: 'Multi-Channel Sales Tracking', desc: 'Amazon, Shopify, Etsy, TikTok Shop — all revenue streams reconciled automatically into clean books.' },
  { title: 'Sales Tax Nexus Management', desc: 'We track your nexus in every state, register where required, and file returns so you never get a surprise bill.' },
  { title: 'COGS & Inventory Accounting', desc: 'Proper cost of goods sold tracking — including shipping, fulfillment, and platform fees — for accurate margins.' },
  { title: 'FBA Reconciliation', desc: 'Amazon FBA statements are notoriously messy. We reconcile them to the cent every month.' },
  { title: 'International Seller Support', desc: 'VAT, GST, import duties, and cross-border accounting for sellers expanding beyond the US.' },
  { title: 'Returns & Chargebacks', desc: 'Proper accounting treatment for returns, chargebacks, and refunds across every platform.' },
];

const benefits = [
  { icon: ShoppingCart, title: 'Every channel covered', desc: 'Amazon, eBay, Walmart, Etsy, Shopify, TikTok — however many channels you sell on, we bring them together.' },
  { icon: Package, title: 'Inventory precision', desc: 'Track inventory value, COGS, and margins accurately — essential for profitability and tax filings.' },
  { icon: DollarSign, title: 'Tax compliance on autopilot', desc: 'Sales tax registration, filing, and nexus tracking across all 50 states. Never miss a deadline.' },
  { icon: Globe, title: 'International ready', desc: 'UK VAT, Canadian GST, EU IOSS — we handle the compliance for sellers going global.' },
];

const faqs = [
  { q: 'How does Prolify handle Amazon FBA statements?', a: 'We connect directly to your Amazon Seller Central account and reconcile every line item — fees, reimbursements, and payouts — against your books monthly.' },
  { q: 'Do I need to collect sales tax in every state?', a: 'Only where you have economic nexus (usually $100K in sales or 200 transactions in a 12-month period). We track your nexus and register you in new states automatically when you cross thresholds.' },
  { q: 'Can Prolify handle multi-currency sales?', a: 'Yes. We track sales in every currency, apply correct exchange rates, and handle translation for US tax purposes — important for sellers on international marketplaces.' },
  { q: 'What about COGS for products I buy and resell?', a: 'We set up a proper inventory accounting system — whether you use FIFO, LIFO, or weighted average — and track COGS accurately across all your product lines.' },
];

export default function EcommerceSellerPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="relative overflow-hidden bg-[#FFC107]">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '28px 28px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 border border-gray-900/20 mb-10">
            <ShoppingCart className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">For E-Commerce Sellers</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tight">
                Multi-channel<br />sales deserve<br />
                <span className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-xl inline-block mt-2">clean books.</span>
              </h1>
              <p className="text-xl text-gray-900/70 mb-10 leading-relaxed">
                E-commerce accounting is complicated — multiple channels, inventory, sales tax in 50 states, and platform fees eating your margins. Prolify handles all of it.
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
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Common risks for unmanaged sellers</p>
              <div className="space-y-4">
                {risks.map(({ label, risk }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold text-gray-900">{label}</span>
                      <span className="text-sm font-black text-gray-900">{risk}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FFC107] rounded-full" style={{width: `${risk}%`}} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">Based on Prolify onboarding data</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">Built for e-commerce complexity</h2>
          <p className="text-gray-600 mb-12 text-lg">Every accounting challenge unique to online selling — solved.</p>
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
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">Why sellers choose Prolify</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            Sell more. Stress less about the books.
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            Multi-channel reconciliation, sales tax, and inventory accounting — all done for you.
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
