import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, BookOpen, RefreshCw, FileText, ChartBar as BarChart3, Clock, CircleAlert as AlertCircle } from 'lucide-react';

const features = [
  { title: 'Automated transaction import', desc: 'Bank feeds sync daily — no manual data entry' },
  { title: 'Expense categorization', desc: 'AI-powered, reviewed by a human bookkeeper' },
  { title: 'Monthly reconciliation', desc: 'Clean, reconciled books every single month' },
  { title: 'Financial statements', desc: 'P&L, Balance Sheet, Cash Flow — always ready' },
  { title: 'Receipt management', desc: 'Snap, upload, done — paperless recordkeeping' },
  { title: 'Tax-ready reports', desc: 'Hand off to your CPA without the scramble' },
  { title: 'Multi-currency support', desc: 'International revenue tracked properly' },
  { title: 'Dedicated bookkeeper', desc: 'A real human who knows your business' },
  { title: 'Dashboard access', desc: 'Live view of your numbers, anytime' },
];

const faqs = [
  {
    q: 'What accounting method do you use?',
    a: 'We use cash-basis accounting by default, which is ideal for most small businesses. We can switch to accrual-basis if your business requires it.',
  },
  {
    q: 'What software do you use?',
    a: 'We work inside QuickBooks Online or a similar platform. You get full access to your own account — no vendor lock-in.',
  },
  {
    q: 'How do I get my documents to you?',
    a: 'Upload directly to your Prolify dashboard. Bank feeds connect automatically. No emailing spreadsheets.',
  },
  {
    q: 'When do I get my monthly reports?',
    a: 'By the 15th of the following month. If anything looks off, your bookkeeper will flag it before sending.',
  },
];

export default function BookkeepingPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/40 mb-6">
          <BookOpen className="w-5 h-5 text-gray-700" />
          <span className="text-sm font-semibold text-gray-700">Bookkeeping</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Messy books are a{' '}
              <span className="bg-[#FFC107] px-2">ticking clock.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-4 leading-relaxed">
              Late filings. Missed deductions. A tax bill that blindsided you. It all starts with books no one is actually keeping.
            </p>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              Prolify gives you a real bookkeeper — backed by automation — so your financials are clean, current, and ready when you need them.
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
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              >
                View Pricing
              </Link>
            </div>
          </div>

          <div className="bg-[#FFC107]/10 border border-gray-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start gap-3 mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">
                The IRS can audit up to 6 years back. Disorganized books = maximum exposure.
              </p>
            </div>
            <div className="space-y-3">
              {[
                'Your books are 3 months behind',
                'You have no idea what your profit margin is',
                'Tax time means a panic scramble',
                'You\'re making decisions on gut feel, not data',
                'Your accountant charges you extra to clean your books',
              ].map((pain, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-500 text-xs font-bold">✗</span>
                  </div>
                  <span className="text-gray-600">{pain}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">How Prolify Bookkeeping Works</h2>
          <p className="text-gray-500 mb-12 text-lg">Four steps. Zero spreadsheets. Books that are actually done.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', icon: RefreshCw, title: 'Connect your accounts', desc: 'Bank, credit cards, Stripe, PayPal — we pull it all in automatically.' },
              { step: '02', icon: CheckCircle2, title: 'We categorize everything', desc: 'AI flags, your bookkeeper reviews and approves. Clean every time.' },
              { step: '03', icon: FileText, title: 'Monthly close + reports', desc: 'By the 15th, you get your P&L, Balance Sheet, and Cash Flow ready to use.' },
              { step: '04', icon: BarChart3, title: 'You make better decisions', desc: 'Dashboard access means you always know your numbers — no surprises.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-[#FFC107] text-4xl font-black mb-4">{step}</div>
                <Icon className="w-8 h-8 text-[#FFC107] mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Everything included</h2>
        <p className="text-gray-500 mb-12 text-lg">No surprises. No add-ons. One flat monthly fee.</p>

        <div className="grid md:grid-cols-3 gap-4">
          {features.map(({ title, desc }) => (
            <div key={title} className="flex items-start gap-4 p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-[#4CAF50] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">{title}</div>
                <div className="text-sm text-gray-500 mt-1">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Prolify */}
      <section className="bg-gray-50 border-y border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Why founders choose Prolify</h2>
          <p className="text-gray-500 mb-12 text-lg">Not a faceless firm. Not a DIY software. A team that knows your business.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'Built for founders', desc: 'We work with startups, solopreneurs, and growing SMBs — not enterprises. Our process is designed for speed and simplicity.' },
              { icon: CheckCircle2, title: 'Human + AI accuracy', desc: 'Automation handles the data. A real bookkeeper verifies every entry. You get both speed and accuracy.' },
              { icon: FileText, title: 'Always tax-ready', desc: 'Come April, your CPA gets clean books — not a disaster recovery project. We prep everything so hand-off is seamless.' },
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
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">Common questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map(({ q, a }) => (
            <div key={q} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">{q}</h3>
              <p className="text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
            Your books shouldn&apos;t be this stressful.
          </h2>
          <p className="text-gray-500 text-xl mb-8">
            Let Prolify handle them. You focus on the business.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-bold text-lg rounded-xl hover:bg-[#FFB300] transition-all shadow-md hover:shadow-lg"
          >
            Start Clean Books Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
