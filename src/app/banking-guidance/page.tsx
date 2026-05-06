import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, Building2, CreditCard, Globe, Lock, Users } from 'lucide-react';

const services = [
  { title: 'Mercury (recommended)', desc: 'Best for startups — no fees, clean UI, Stripe-friendly' },
  { title: 'Relay', desc: 'Multiple accounts, team permissions, great for operations' },
  { title: 'Wise Business', desc: 'Multi-currency powerhouse for international founders' },
  { title: 'Brex', desc: 'Corporate cards + banking for funded startups' },
  { title: 'Bluevine', desc: 'High-yield checking — earn while you hold cash' },
  { title: 'Application review', desc: 'We check your docs before you apply — fewer rejections' },
  { title: 'EIN requirement help', desc: 'Most US banks require an EIN — we ensure yours is ready' },
  { title: 'Payment processor setup', desc: 'Stripe, PayPal, Square — connected to your new account' },
  { title: 'International wire guidance', desc: 'Send and receive USD without surprises' },
];

const faqs = [
  {
    q: 'Can I open a US bank account without visiting the US?',
    a: 'Yes. Mercury, Wise, and Relay all offer fully remote account opening. You need your EIN, formation documents, and a valid passport. We help you prepare everything.',
  },
  {
    q: 'How long does it take to open an account?',
    a: 'Mercury and Wise typically approve within 1-5 business days if your documents are in order. We help you submit a clean application the first time.',
  },
  {
    q: 'Do I need a US address to open a bank account?',
    a: 'Most digital banks accept your registered agent address as your business address. We provide this as part of our registered agent service.',
  },
  {
    q: 'What if my application is rejected?',
    a: 'We review your application before submission to reduce rejection risk. If you are rejected, we help diagnose why and guide you to an alternative bank.',
  },
];

export default function BankingGuidancePage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/40 mb-6">
          <Building2 className="w-5 h-5 text-gray-700" />
          <span className="text-sm font-semibold text-gray-700">Banking Guidance</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Your LLC is formed.{' '}
              <span className="bg-[#FFC107] px-2">Now get the bank account right.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-4 leading-relaxed">
              A US LLC without a US bank account cannot collect payments properly, cannot pay vendors cleanly, and creates accounting chaos.
            </p>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              We guide you to the right banking partner for your business type, prepare your application, and get you set up fast — without a single trip to the US.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFC107] text-gray-900 font-bold rounded-xl hover:bg-[#FFB300] transition-all shadow-md hover:shadow-lg"
              >
                Open My Account
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
            <h3 className="font-black text-xl text-gray-900 mb-2">What you need to apply</h3>
            <p className="text-gray-500 text-sm mb-6">We help you prepare all of this.</p>
            <div className="space-y-3">
              {[
                { item: 'EIN (Employer Identification Number)', status: 'We file this for you' },
                { item: 'Articles of Organization / Formation', status: 'In your Prolify dashboard' },
                { item: 'Operating Agreement', status: 'We draft this for you' },
                { item: 'Registered Agent address', status: 'Included in your plan' },
                { item: 'Valid government-issued ID', status: 'Passport works globally' },
                { item: 'Business description + website', status: 'We help you prepare this' },
              ].map(({ item, status }) => (
                <div key={item} className="flex items-start justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900 font-medium text-sm">{item}</span>
                  </div>
                  <span className="text-xs text-gray-500 text-right shrink-0">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Banking partners */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Our banking recommendations</h2>
          <p className="text-gray-500 mb-12 text-lg">We match you to the right bank based on your business type and needs.</p>

          <div className="grid md:grid-cols-3 gap-4">
            {services.map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Building2 className="w-6 h-6 text-[#FFC107] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">{title}</div>
                  <div className="text-sm text-gray-500 mt-1">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Why banking matters for your business</h2>
        <p className="text-gray-500 mb-12 text-lg">This is not optional infrastructure. It is how you get paid.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Globe, title: 'No US visit required', desc: 'Every bank we recommend supports fully remote account opening. You can be anywhere in the world and still get a proper US business bank account.' },
            { icon: CreditCard, title: 'Collect payments anywhere', desc: 'With a US bank account, you can connect Stripe, PayPal, and major payment processors. Customers pay in USD, and it lands in your account cleanly.' },
            { icon: Lock, title: 'Keep business and personal separate', desc: 'A dedicated business account protects your LLC liability shield. Mixing personal and business funds can pierce that shield and expose your personal assets.' },
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
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">Banking questions, answered</h2>
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
            Your business needs a real bank account.
          </h2>
          <p className="text-gray-500 text-xl mb-8">
            We make it simple. No branch visits. No confusion. Just a clean application and a fast approval.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-bold text-lg rounded-xl hover:bg-[#FFB300] transition-all shadow-md hover:shadow-lg"
          >
            Get Banking Guidance
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
