'use client';

import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, Mail, Users, DollarSign, TrendingUp, Globe, Zap } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function NewsletterCreatorsPage() {
  const { t } = useI18n();

  const features = [
    { title: t.newsletterPage.f1title, desc: t.newsletterPage.f1desc },
    { title: t.newsletterPage.f2title, desc: t.newsletterPage.f2desc },
    { title: t.newsletterPage.f3title, desc: t.newsletterPage.f3desc },
    { title: t.newsletterPage.f4title, desc: t.newsletterPage.f4desc },
    { title: t.newsletterPage.f5title, desc: t.newsletterPage.f5desc },
    { title: t.newsletterPage.f6title, desc: t.newsletterPage.f6desc },
  ];

  const revenueStreams = [
    { stream: t.newsletterPage.stream1, platform: t.newsletterPage.stream1platform },
    { stream: t.newsletterPage.stream2, platform: t.newsletterPage.stream2platform },
    { stream: t.newsletterPage.stream3, platform: t.newsletterPage.stream3platform },
    { stream: t.newsletterPage.stream4, platform: t.newsletterPage.stream4platform },
    { stream: t.newsletterPage.stream5, platform: t.newsletterPage.stream5platform },
    { stream: t.newsletterPage.stream6, platform: t.newsletterPage.stream6platform },
  ];

  const benefits = [
    { icon: Mail, title: t.newsletterPage.b1title, desc: t.newsletterPage.b1desc },
    { icon: Users, title: t.newsletterPage.b2title, desc: t.newsletterPage.b2desc },
    { icon: DollarSign, title: t.newsletterPage.b3title, desc: t.newsletterPage.b3desc },
    { icon: TrendingUp, title: t.newsletterPage.b4title, desc: t.newsletterPage.b4desc },
    { icon: Globe, title: t.newsletterPage.b5title, desc: t.newsletterPage.b5desc },
    { icon: Zap, title: t.newsletterPage.b6title, desc: t.newsletterPage.b6desc },
  ];

  const faqs = [
    { q: t.newsletterPage.faq1q, a: t.newsletterPage.faq1a },
    { q: t.newsletterPage.faq2q, a: t.newsletterPage.faq2a },
    { q: t.newsletterPage.faq3q, a: t.newsletterPage.faq3a },
    { q: t.newsletterPage.faq4q, a: t.newsletterPage.faq4a },
  ];

  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="relative overflow-hidden bg-[#FFC107]">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '28px 28px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 border border-gray-900/20 mb-10">
            <Mail className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t.newsletterPage.badge}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tight">
                {t.newsletterPage.heroTitle1}<br />{t.newsletterPage.heroTitle2}<br />
                <span className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-xl inline-block mt-2">{t.newsletterPage.heroHighlight}</span>
              </h1>
              <p className="text-xl text-gray-900/70 mb-10 leading-relaxed">
                {t.newsletterPage.heroPara}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-[#FFC107] font-black rounded-xl hover:bg-gray-800 transition-all shadow-lg">
                  {t.newsletterPage.ctaStart}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-900/20 hover:border-gray-900/40 transition-all">
                  {t.newsletterPage.ctaPricing}
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">{t.newsletterPage.streamsLabel}</p>
              <div className="space-y-3">
                {revenueStreams.map(({ stream, platform }) => (
                  <div key={stream} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#FFC107] flex-shrink-0" />
                      <span className="text-sm font-bold text-gray-900">{stream}</span>
                    </div>
                    <span className="text-xs text-gray-500">{platform}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">{t.newsletterPage.featuresTitle}</h2>
          <p className="text-gray-600 mb-12 text-lg">{t.newsletterPage.featuresSubtitle}</p>
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
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">{t.newsletterPage.benefitsTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <h2 className="text-3xl font-black text-gray-900 mb-12">{t.newsletterPage.faqsTitle}</h2>
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
            {t.newsletterPage.ctaTitle}
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            {t.newsletterPage.ctaSubtitle}
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-black text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-xl"
          >
            {t.newsletterPage.ctaBtn}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
