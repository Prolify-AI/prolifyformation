'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, TrendingUp, Globe, DollarSign, FileText, Shield } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function BlogPage() {
  const { t } = useI18n();

  const featuredPosts = [
    { category: t.blogPage.post1category, title: t.blogPage.post1title, excerpt: t.blogPage.post1excerpt, readTime: t.blogPage.post1time },
    { category: t.blogPage.post2category, title: t.blogPage.post2title, excerpt: t.blogPage.post2excerpt, readTime: t.blogPage.post2time },
    { category: t.blogPage.post3category, title: t.blogPage.post3title, excerpt: t.blogPage.post3excerpt, readTime: t.blogPage.post3time },
    { category: t.blogPage.post4category, title: t.blogPage.post4title, excerpt: t.blogPage.post4excerpt, readTime: t.blogPage.post4time },
  ];

  const pillars = [
    { icon: Globe, title: t.blogPage.pillar1, count: t.blogPage.pillar1count },
    { icon: DollarSign, title: t.blogPage.pillar2, count: t.blogPage.pillar2count },
    { icon: FileText, title: t.blogPage.pillar3, count: t.blogPage.pillar3count },
    { icon: Shield, title: t.blogPage.pillar4, count: t.blogPage.pillar4count },
    { icon: TrendingUp, title: t.blogPage.pillar5, count: t.blogPage.pillar5count },
    { icon: BookOpen, title: t.blogPage.pillar6, count: t.blogPage.pillar6count },
  ];

  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="border-b-4 border-gray-900 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-5 h-5 text-gray-900" />
            <span className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">{t.blogPage.badge}</span>
            <span className="flex-1 h-px bg-gray-900" />
          </div>
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end">
            <h1 className="text-7xl md:text-9xl font-black text-gray-900 leading-[0.9] tracking-tight">
              {t.blogPage.heroTitle}<br /><span className="bg-[#FFC107] px-3">{t.blogPage.heroHighlight}</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-sm pb-3">
              {t.blogPage.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-gray-500">{t.blogPage.featuredLabel}</span>
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
            <span className="text-xs font-black uppercase tracking-widest text-gray-900">{t.blogPage.browseLabel}</span>
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
            {t.blogPage.ctaTitle}
          </h2>
          <p className="text-gray-600 text-xl mb-8">
            {t.blogPage.ctaSubtitle}
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-black text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-lg"
          >
            {t.blogPage.ctaBtn}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
