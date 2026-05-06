import Link from 'next/link';
import { ArrowRight, BookOpen, Download, FileText, Globe, DollarSign, Shield, TrendingUp } from 'lucide-react';

const guides = [
  {
    icon: Globe,
    title: 'The Foreign Founder\'s US Business Guide',
    subtitle: 'Everything non-US founders need to launch and run a compliant US entity',
    pages: '42 pages',
    topics: ['LLC vs C-Corp for non-residents', 'State selection (Delaware, Wyoming, Florida)', 'EIN application step-by-step', 'Form 5472 explained', 'US bank account options', 'ITIN and tax ID requirements'],
    featured: true,
  },
  {
    icon: DollarSign,
    title: 'The S-Corp Playbook',
    subtitle: 'How to save $5,000–$20,000+ annually with S-Corp tax treatment',
    pages: '28 pages',
    topics: [],
    featured: false,
  },
  {
    icon: Shield,
    title: 'Form 5472 Complete Guide',
    subtitle: 'Avoid the $25,000 IRS penalty — a plain-English filing guide',
    pages: '18 pages',
    topics: [],
    featured: false,
  },
  {
    icon: TrendingUp,
    title: 'Sales Tax for E-Commerce Sellers',
    subtitle: 'Nexus, registration, filing — the complete 2025 guide',
    pages: '35 pages',
    topics: [],
    featured: false,
  },
  {
    icon: FileText,
    title: 'Bookkeeping for Founders',
    subtitle: 'Clean books from day one — a practical system for busy founders',
    pages: '24 pages',
    topics: [],
    featured: false,
  },
  {
    icon: BookOpen,
    title: 'The Creator Economy Tax Guide',
    subtitle: 'Taxes for newsletter, course, and content creators',
    pages: '30 pages',
    topics: [],
    featured: false,
  },
];

export default function EBooksPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="relative overflow-hidden bg-[#FFC107]">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 border border-gray-900/20 mb-10">
            <BookOpen className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Free Guides & E-books</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tight">
                The knowledge<br />library for<br />
                <span className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-xl inline-block mt-2">serious founders.</span>
              </h1>
              <p className="text-xl text-gray-900/70 mb-10 leading-relaxed">
                Free guides, playbooks, and deep dives on US entity formation, taxes, bookkeeping, and compliance — written by practitioners, not content marketers.
              </p>
              <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-[#FFC107] font-black rounded-xl hover:bg-gray-800 transition-all shadow-lg">
                Access All Guides Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { stat: '6', label: 'Practitioner guides' },
                { stat: '180+', label: 'Pages of content' },
                { stat: 'Free', label: 'With any plan' },
              ].map(({ stat, label }) => (
                <div key={label} className="bg-gray-900 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-black text-white mb-1">{stat}</div>
                  <div className="text-xs text-gray-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {guides.filter(g => g.featured).map(({ icon: Icon, title, subtitle, pages, topics }) => (
        <section key={title} className="py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Featured Guide</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-16 h-16 bg-[#FFC107] rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-gray-900" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-3">{title}</h2>
                <p className="text-gray-600 mb-2 text-lg">{subtitle}</p>
                <p className="text-sm font-bold text-gray-400 mb-8">{pages} · Free download</p>
                <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all">
                  <Download className="w-4 h-4" />
                  Download Free Guide
                </Link>
              </div>
              <div className="bg-[#FFC107]/10 border border-[#FFC107]/30 rounded-2xl p-8">
                <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">What's inside</p>
                <div className="space-y-3">
                  {topics.map((topic) => (
                    <div key={topic} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-gray-900 rounded-full flex-shrink-0" />
                      <span className="text-sm text-gray-800">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-3">All guides</h2>
          <p className="text-gray-600 mb-12 text-lg">Each guide written by CPAs and attorneys with real client experience.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.filter(g => !g.featured).map(({ icon: Icon, title, subtitle, pages }) => (
              <div key={title} className="border border-gray-200 border-t-4 border-t-[#FFC107] rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="p-6 flex-1">
                  <div className="w-10 h-10 bg-[#FFC107] rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-gray-900" />
                  </div>
                  <h3 className="font-black text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{subtitle}</p>
                  <p className="text-xs font-bold text-gray-400">{pages} · Free</p>
                </div>
                <div className="border-t border-gray-100 p-4">
                  <Link href="/signup" className="flex items-center justify-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors">
                    <Download className="w-4 h-4" />
                    Download Free
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Get every guide — free with Prolify.
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            Create a free account and access the full Prolify knowledge library, plus your AI Chief of Staff.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-black text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-xl"
          >
            Access All Guides Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
