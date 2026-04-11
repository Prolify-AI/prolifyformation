import Link from 'next/link';
import { ArrowRight, BookOpen, TrendingUp, Globe, DollarSign, FileText, Shield } from 'lucide-react';

const featuredPosts = [
  {
    category: 'Formation',
    title: 'LLC vs C-Corp: The Definitive Guide for 2025',
    excerpt: 'The structure you choose on day one will shape your taxes, fundraising options, and liability exposure for years. Here is how to get it right.',
    readTime: '12 min read',
  },
  {
    category: 'Taxes',
    title: 'S-Corp Election: How to Save $8,400 Per Year',
    excerpt: 'The S-Corp election is the most underused tax strategy for profitable small businesses. We break down the math and the mechanics.',
    readTime: '8 min read',
  },
  {
    category: 'Compliance',
    title: 'Form 5472: The $25,000 Penalty Every Foreign Founder Must Know',
    excerpt: 'If you are a non-US founder with a US entity, this filing is not optional. A complete walkthrough of who files, what to report, and how to avoid the penalty.',
    readTime: '10 min read',
  },
  {
    category: 'Banking',
    title: 'The Best US Business Bank Accounts for Non-Residents in 2025',
    excerpt: 'Mercury, Relay, Wise, and Brex — compared on fees, features, and how easy they are to open without a US SSN.',
    readTime: '7 min read',
  },
];

const pillars = [
  { icon: Globe, title: 'US Entity Formation', count: '24 articles' },
  { icon: DollarSign, title: 'Taxes & S-Corps', count: '31 articles' },
  { icon: FileText, title: 'Bookkeeping', count: '18 articles' },
  { icon: Shield, title: 'Compliance', count: '22 articles' },
  { icon: TrendingUp, title: 'Growth & Finance', count: '15 articles' },
  { icon: BookOpen, title: 'Guides & Playbooks', count: '12 articles' },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="border-b-4 border-gray-900 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-5 h-5 text-gray-900" />
            <span className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Prolify Blog</span>
            <span className="flex-1 h-px bg-gray-900" />
          </div>
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end">
            <h1 className="text-7xl md:text-9xl font-black text-gray-900 leading-[0.9] tracking-tight">
              The<br /><span className="bg-[#FFC107] px-3">playbook.</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-sm pb-3">
              Practical guides on US business formation, taxes, bookkeeping, and compliance — written for founders, not accountants.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-gray-500">Featured Articles</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-gray-200">
            {featuredPosts.map(({ category, title, excerpt, readTime }) => (
              <Link key={title} href="/signup" className="bg-white p-8 hover:bg-[#FFC107]/10 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-900 bg-[#FFC107] px-3 py-1 rounded-full">{category}</span>
                  <span className="text-xs text-gray-400">{readTime}</span>
                </div>
                <h3 className="font-black text-xl text-gray-900 mb-3 group-hover:underline decoration-[#FFC107] decoration-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFC107] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-gray-900">Browse by Topic</span>
            <div className="flex-1 h-px bg-gray-900/20" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillars.map(({ icon: Icon, title, count }) => (
              <Link key={title} href="/signup" className="group bg-white rounded-xl p-6 hover:bg-gray-900 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-[#FFC107] rounded-lg flex items-center justify-center group-hover:bg-[#FFC107]/20 transition-colors">
                    <Icon className="w-5 h-5 text-gray-900" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#FFC107] transition-colors" />
                </div>
                <h3 className="font-black text-gray-900 mb-1 group-hover:text-white transition-colors">{title}</h3>
                <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 border-t-4 border-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Get the full playbook — free.
          </h2>
          <p className="text-gray-600 text-xl mb-8">
            Create a free Prolify account to access the full article library and your AI Chief of Staff.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-black text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-lg"
          >
            Join for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
