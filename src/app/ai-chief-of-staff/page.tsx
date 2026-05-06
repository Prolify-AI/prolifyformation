import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, Bot, Sparkles, Zap, MessageSquare, Bell, Brain } from 'lucide-react';

const capabilities = [
  { title: 'Tax & compliance Q&A', desc: 'Ask anything about your business obligations' },
  { title: 'Deadline alerts', desc: 'Proactive reminders before things are due' },
  { title: 'Document analysis', desc: 'Upload contracts or notices — AI reviews them' },
  { title: 'Financial health checks', desc: 'Regular summaries of your business metrics' },
  { title: 'Expense flagging', desc: 'Unusual spend patterns flagged automatically' },
  { title: 'Business recommendations', desc: 'Personalized advice based on your activity' },
  { title: 'Formation guidance', desc: 'Which entity, which state — AI walks you through it' },
  { title: 'Natural language search', desc: 'Find any document or transaction by describing it' },
  { title: 'Growth opportunities', desc: 'Identifies tax credits and deductions you may be missing' },
];

export default function AIChiefOfStaffPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/40 mb-6">
          <Bot className="w-5 h-5 text-gray-700" />
          <span className="text-sm font-semibold text-gray-700">AI Chief of Staff</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Your{' '}
              <span className="bg-[#FFC107] px-2">24/7 business advisor</span>{' '}
              — powered by AI.
            </h1>
            <p className="text-xl text-gray-500 mb-4 leading-relaxed">
              Founders should not have to google &quot;do I need to file Form 5472&quot; at 11pm. Or wonder if that expense is deductible. Or guess when their annual report is due.
            </p>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              The Prolify AI Chief of Staff knows your business — your entity type, your state, your revenue — and gives you real answers instantly.
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

          {/* Chat preview */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-[#FFC107] border-b border-gray-200 p-4 flex items-center gap-3">
              <Bot className="w-6 h-6 text-black" />
              <span className="font-bold text-black">Prolify AI Chief of Staff</span>
              <span className="ml-auto flex items-center gap-1 text-xs font-bold text-black">
                <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />
                Online
              </span>
            </div>
            <div className="p-6 space-y-4 bg-gray-50">
              {[
                { role: 'user', msg: 'Do I need to file Form 5472?' },
                { role: 'ai', msg: 'Yes. As a non-US owner of a single-member LLC, you are required to file Form 5472 along with a pro forma 1120 by April 15 each year. The penalty for missing it is $25,000. I have already added this to your compliance calendar.' },
                { role: 'user', msg: 'Can I deduct my home office?' },
                { role: 'ai', msg: 'Yes, if you use it exclusively and regularly for business. Based on your entity type (LLC), you can deduct a portion of rent, utilities, and internet. Want me to estimate the deduction based on your current expenses?' },
              ].map(({ role, msg }, i) => (
                <div key={i} className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-xl text-sm ${role === 'user' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
                    {msg}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">What your AI Chief of Staff can do</h2>
          <p className="text-gray-500 mb-12 text-lg">Context-aware answers. Proactive alerts. Business intelligence — on demand.</p>

          <div className="grid md:grid-cols-3 gap-4">
            {capabilities.map(({ title, desc }) => (
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

      {/* How it differs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Not a generic chatbot</h2>
        <p className="text-gray-500 mb-12 text-lg">Built specifically for your business — not the internet.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Brain, title: 'Context-aware', desc: 'It knows your entity type, your state, your revenue model, and your compliance history. Answers are specific to your situation, not generic advice.' },
            { icon: Bell, title: 'Proactively alerts you', desc: 'Does not wait for you to ask. Monitors your data and flags issues — a missed deadline, an unusual expense, a tax saving you might qualify for.' },
            { icon: MessageSquare, title: 'Plain English answers', desc: 'No legal jargon. No hedging. Straight answers about your specific business — like a knowledgeable advisor who actually knows you.' },
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

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
            Every founder deserves a Chief of Staff.
          </h2>
          <p className="text-gray-500 text-xl mb-8">
            Now you can have one — without the $200K salary.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-bold text-lg rounded-xl hover:bg-[#FFB300] transition-all shadow-md hover:shadow-lg"
          >
            Meet My AI Chief of Staff
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
