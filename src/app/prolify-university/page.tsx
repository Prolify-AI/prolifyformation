import Link from 'next/link';
import { ArrowRight, GraduationCap, CirclePlay as PlayCircle, CircleCheck as CheckCircle2, Clock, Award } from 'lucide-react';

const tracks = [
  {
    title: 'US Business Formation',
    level: 'Beginner',
    modules: 6,
    hours: '3 hours',
    desc: 'The complete guide to forming your US entity — from choosing a state to getting your EIN and opening your bank account.',
    topics: ['LLC vs C-Corp decision framework', 'State selection guide', 'Registered agent requirements', 'EIN application walkthrough', 'Operating agreement essentials', 'Bank account setup'],
  },
  {
    title: 'Taxes for Global Founders',
    level: 'Intermediate',
    modules: 8,
    hours: '4.5 hours',
    desc: 'US tax obligations for non-resident founders — Form 5472, FBAR, quarterly estimates, and how to build a tax-efficient structure.',
    topics: ['How US taxation works for non-residents', 'Form 5472 step-by-step', 'FBAR filing requirements', 'Quarterly estimated tax payments', 'S-Corp election mechanics', 'Working with a US CPA'],
  },
  {
    title: 'Bookkeeping Fundamentals',
    level: 'Beginner',
    modules: 5,
    hours: '2.5 hours',
    desc: 'How to set up and maintain clean books for your business — from chart of accounts to monthly close.',
    topics: ['Chart of accounts setup', 'Transaction categorization', 'Bank reconciliation', 'Revenue recognition basics', 'Month-end close process'],
  },
  {
    title: 'Sales Tax Mastery',
    level: 'Intermediate',
    modules: 7,
    hours: '4 hours',
    desc: 'Everything e-commerce and digital product sellers need to know about US sales tax — nexus, registration, filing, and automation.',
    topics: ['Economic nexus explained', 'Physical vs economic nexus', 'State-by-state registration', 'Filing frequency rules', 'Marketplace facilitator laws', 'Automation tools', 'Audit defense basics'],
  },
  {
    title: 'Creator Economy Finance',
    level: 'Beginner',
    modules: 5,
    hours: '2 hours',
    desc: 'Financial management for newsletter creators, course creators, and content businesses — from platform payouts to tax deductions.',
    topics: ['Revenue stream categorization', 'Platform-specific bookkeeping', 'Creator tax deductions', 'Subscription accounting', 'Affiliate income tracking'],
  },
  {
    title: 'Real Estate Investor Fundamentals',
    level: 'Intermediate',
    modules: 6,
    hours: '3.5 hours',
    desc: 'LLC structuring, depreciation, 1031 exchanges, and rental property accounting for real estate investors.',
    topics: ['LLC structure for real estate', 'Depreciation and MACRS', '1031 exchange mechanics', 'Rental income tracking', 'FIRPTA for foreign investors', 'Portfolio P&L management'],
  },
];

export default function ProlifyUniversityPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="relative overflow-hidden bg-[#FFC107]">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '28px 28px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 border border-gray-900/20 mb-10">
            <GraduationCap className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Prolify University</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tight">
                Know your business.<br />
                <span className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-xl inline-block mt-2">Own your decisions.</span>
              </h1>
              <p className="text-xl text-gray-900/70 mb-4 leading-relaxed">
                Most founders outsource their business education along with their back office. That is a mistake. Understanding your entity, taxes, and books makes you a better founder.
              </p>
              <p className="text-xl text-gray-900/70 mb-10 leading-relaxed">
                Prolify University offers structured courses on everything from US LLC formation to multi-state sales tax — taught by practitioners with real client experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-[#FFC107] font-black rounded-xl hover:bg-gray-800 transition-all shadow-lg">
                  Start Learning Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-900/20 hover:border-gray-900/40 transition-all">
                  View Pricing
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: PlayCircle, stat: '6', label: 'Learning tracks' },
                { icon: Clock, stat: '20+', label: 'Hours of content' },
                { icon: Award, stat: 'Free', label: 'For all members' },
              ].map(({ icon: Icon, stat, label }) => (
                <div key={label} className="bg-gray-900 rounded-2xl p-6 text-center">
                  <Icon className="w-6 h-6 text-[#FFC107] mx-auto mb-3" />
                  <div className="text-2xl font-black text-white">{stat}</div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">Learning tracks</h2>
          <p className="text-gray-600 mb-12 text-lg">Structured courses for every part of running a US business.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {tracks.map(({ title, level, modules, hours, desc, topics }) => (
              <div key={title} className="border border-gray-200 border-l-4 border-l-[#FFC107] rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 text-xs font-black bg-[#FFC107] text-gray-900 rounded-full">{level}</span>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{modules} modules</span>
                      <span>·</span>
                      <span>{hours}</span>
                    </div>
                  </div>
                  <h3 className="font-black text-lg text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
                <div className="p-6 bg-[#FFC107]/5">
                  <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-bold">What you will learn</p>
                  <div className="grid grid-cols-2 gap-2">
                    {topics.map((topic) => (
                      <div key={topic} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-600">{topic}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/signup" className="mt-4 inline-flex items-center gap-2 text-gray-900 text-sm font-bold hover:underline decoration-[#FFC107]">
                    <PlayCircle className="w-4 h-4" />
                    Start track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFC107] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-12 text-center">Why founders choose Prolify University</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Practitioner-taught', desc: 'Every course is taught by CPAs, attorneys, or operators with real client experience — not academics or content creators reading from a script.' },
              { title: 'Founder-specific', desc: 'No general business 101. Every course is designed specifically for the challenges facing founder-stage businesses, especially those with international complexity.' },
              { title: 'Always current', desc: 'Tax laws change. State requirements change. Our courses are updated regularly to reflect the rules as they actually apply today — not five years ago.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-1 h-8 bg-gray-900 rounded-full mb-6" />
                <h3 className="font-black text-gray-900 text-xl mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Know your business inside and out.
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            All Prolify University courses are included with every plan — free.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-black text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-xl"
          >
            Enroll Free Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
