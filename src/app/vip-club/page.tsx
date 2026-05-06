'use client';

import Link from 'next/link';
import { ArrowRight, Crown, CircleCheck as CheckCircle2, Users, Zap, Star, Shield, Globe } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function VIPClubPage() {
  const { t } = useI18n();

  const benefits = [
    { icon: Users, title: t.vipClubPage.b1title, desc: t.vipClubPage.b1desc },
    { icon: Zap, title: t.vipClubPage.b2title, desc: t.vipClubPage.b2desc },
    { icon: Star, title: t.vipClubPage.b3title, desc: t.vipClubPage.b3desc },
    { icon: Globe, title: t.vipClubPage.b4title, desc: t.vipClubPage.b4desc },
    { icon: Shield, title: t.vipClubPage.b5title, desc: t.vipClubPage.b5desc },
    { icon: Crown, title: t.vipClubPage.b6title, desc: t.vipClubPage.b6desc },
  ];

  const included = [
    t.vipClubPage.inc1, t.vipClubPage.inc2, t.vipClubPage.inc3,
    t.vipClubPage.inc4, t.vipClubPage.inc5, t.vipClubPage.inc6,
    t.vipClubPage.inc7, t.vipClubPage.inc8, t.vipClubPage.inc9, t.vipClubPage.inc10,
  ];

  const faqs = [
    { q: t.vipClubPage.faq1q, a: t.vipClubPage.faq1a },
    { q: t.vipClubPage.faq2q, a: t.vipClubPage.faq2a },
    { q: t.vipClubPage.faq3q, a: t.vipClubPage.faq3a },
    { q: t.vipClubPage.faq4q, a: t.vipClubPage.faq4a },
  ];

  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="relative overflow-hidden bg-[#FFC107]">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '28px 28px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 border border-gray-900/20 mb-10">
            <Crown className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t.vipClubPage.badge}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tight">
                {t.vipClubPage.heroTitle1}<br />{t.vipClubPage.heroTitle2}<br />
                {t.vipClubPage.heroTitle3}{' '}
                <span className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-xl inline-block mt-2">{t.vipClubPage.heroHighlight}</span>
              </h1>
              <p className="text-xl text-gray-900/70 mb-4 leading-relaxed">
                {t.vipClubPage.heroPara1}
              </p>
              <p className="text-xl text-gray-900/70 mb-10 leading-relaxed">
                {t.vipClubPage.heroPara2}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-[#FFC107] font-black rounded-xl hover:bg-gray-800 transition-all shadow-lg"
                >
                  {t.vipClubPage.ctaApply}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-900/20 hover:border-gray-900/40 transition-all"
                >
                  {t.vipClubPage.ctaPricing}
                </Link>
              </div>
            </div>

            <div className="border border-gray-900/20 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gray-900 px-6 py-4 flex items-center gap-3">
                <Crown className="w-5 h-5 text-[#FFC107]" />
                <span className="font-black text-[#FFC107]">{t.vipClubPage.includedTitle}</span>
              </div>
              <div className="p-6 space-y-3 bg-white">
                {included.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">{t.vipClubPage.benefitsTitle}</h2>
          <p className="text-gray-600 mb-12 text-lg">{t.vipClubPage.benefitsSubtitle}</p>

          <div className="grid md:grid-cols-3 gap-4">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-gray-200 rounded-2xl p-6 hover:border-[#FFC107] hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-[#FFC107] rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-gray-900" />
                </div>
                <h3 className="font-black text-lg mb-2 text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFC107] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-12">{t.vipClubPage.faqsTitle}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-l-4 border-gray-900 pl-6">
                <h3 className="font-black text-gray-900 mb-3">{q}</h3>
                <p className="text-gray-900/70 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="w-12 h-12 text-[#FFC107] mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            {t.vipClubPage.ctaTitle}
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            {t.vipClubPage.ctaSubtitle}
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-black text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-xl"
          >
            {t.vipClubPage.ctaBtn}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
