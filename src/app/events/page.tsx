import Link from 'next/link';
import { ArrowRight, Calendar, Video, Clock, Mic, Users } from 'lucide-react';

const upcomingEvents = [
  {
    type: 'Webinar',
    title: 'Form 5472 Deep Dive: What Every Foreign Founder Must File',
    date: 'Monthly — First Tuesday',
    time: '11:00 AM EST',
    format: 'Online',
    desc: 'A complete walkthrough of Form 5472 — who files, what to report, how to avoid the $25,000 penalty. Live Q&A included.',
  },
  {
    type: 'Workshop',
    title: 'LLC vs C-Corp: Choosing the Right Structure for Your Business',
    date: 'Monthly — Second Wednesday',
    time: '12:00 PM EST',
    format: 'Online',
    desc: 'Interactive workshop covering entity selection for different business types — SaaS, e-commerce, consulting, real estate. Bring your specific situation.',
  },
  {
    type: 'Webinar',
    title: 'S-Corp Election: How to Save $5,000–$20,000 in SE Tax',
    date: 'Monthly — Third Thursday',
    time: '2:00 PM EST',
    format: 'Online',
    desc: 'Step-by-step on the S-Corp election — reasonable salary, payroll setup, quarterly taxes, and exactly when it makes financial sense.',
  },
  {
    type: 'AMA',
    title: 'Open Q&A with Prolify CPAs',
    date: 'Monthly — Last Friday',
    time: '1:00 PM EST',
    format: 'Online',
    desc: 'Bring your toughest tax and compliance questions. Our CPAs answer live. No topic off limits — formation, bookkeeping, deductions, international tax.',
  },
];

const pastTopics = [
  'Banking for Non-Residents: Mercury, Wise, and Relay Compared',
  'Sales Tax Nexus: What Amazon FBA Sellers Need to Know',
  'Bookkeeping for Course Creators: Platform Payouts Done Right',
  '1031 Exchanges: Real Estate Investor Tax Strategy',
  'Quarterly Estimated Taxes: How to Never Be Surprised',
  'Operating Agreements: What Actually Matters',
  'ITIN vs EIN: International Founder Tax IDs Explained',
  'Multi-Currency Bookkeeping for Global Businesses',
];

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="relative overflow-hidden bg-[#FFC107]">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'repeating-linear-gradient(0deg, black 0, black 1px, transparent 0, transparent 40px), repeating-linear-gradient(90deg, black 0, black 1px, transparent 0, transparent 40px)', backgroundSize: '40px 40px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 border border-gray-900/20 mb-10">
            <Calendar className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Events & Webinars</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-6xl md:text-8xl font-black leading-[0.95] mb-8 text-gray-900 tracking-tight">
                Learn from<br />people who<br />
                <span className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-2xl inline-block mt-2">actually do this.</span>
              </h1>
              <p className="text-xl text-gray-900/70 mb-10 leading-relaxed">
                Monthly webinars, workshops, and live Q&As with Prolify CPAs and business formation experts. Free for all Prolify members.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-[#FFC107] font-black rounded-xl hover:bg-gray-800 transition-all shadow-xl">
                  Register for Events
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-900/20 hover:border-gray-900/40 transition-all">
                  View Pricing
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Calendar, stat: '4x', label: 'Per month' },
                { icon: Clock, stat: '60 min', label: 'With live Q&A' },
                { icon: Users, stat: 'Free', label: 'All members' },
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
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Upcoming events</h2>
            <span className="px-3 py-1 bg-[#FFC107] text-gray-900 text-xs font-black rounded-full">Open registration</span>
          </div>
          <p className="text-gray-600 mb-12 text-lg">All events are free for Prolify members. New sessions added monthly.</p>

          <div className="space-y-4">
            {upcomingEvents.map(({ type, title, date, time, format, desc }) => (
              <div key={title} className="bg-white border border-gray-200 border-l-4 border-l-[#FFC107] rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 text-xs font-black bg-[#FFC107] text-gray-900 rounded-full">{type}</span>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Video className="w-4 h-4" />
                      <span>{format}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{time}</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-black text-lg text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-4">{desc}</p>
                <div className="flex justify-end">
                  <Link href="/signup" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-bold text-sm rounded-lg hover:bg-gray-800 transition-all">
                    Register Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFC107] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Video className="w-5 h-5 text-gray-900" />
            <h2 className="text-3xl font-black text-gray-900">Past session topics</h2>
          </div>
          <p className="text-gray-900/70 mb-10">Recordings available to all Prolify members.</p>
          <div className="grid md:grid-cols-2 gap-3">
            {pastTopics.map((topic) => (
              <div key={topic} className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-sm transition-shadow">
                <Mic className="w-4 h-4 text-gray-900 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Get access to every event — free.
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            All webinars, workshops, and recordings included with every Prolify plan.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-black text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-xl"
          >
            Join Prolify Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
