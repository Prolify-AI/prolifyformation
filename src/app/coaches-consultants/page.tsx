'use client';

import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, MessageCircle, Target, TrendingUp, DollarSign, Shield } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function CoachesConsultantsPage() {
  const { t } = useI18n();

  const features = [
    { title: t.coachesPage.f1title, desc: t.coachesPage.f1desc },
    { title: t.coachesPage.f2title, desc: t.coachesPage.f2desc },
    { title: t.coachesPage.f3title, desc: t.coachesPage.f3desc },
    { title: t.coachesPage.f4title, desc: t.coachesPage.f4desc },
    { title: t.coachesPage.f5title, desc: t.coachesPage.f5desc },
    { title: t.coachesPage.f6title, desc: t.coachesPage.f6desc },
  ];

  const benefits = [
    { icon: MessageCircle, title: t.coachesPage.b1title, desc: t.coachesPage.b1desc },
    { icon: Target, title: t.coachesPage.b2title, desc: t.coachesPage.b2desc },
    { icon: TrendingUp, title: t.coachesPage.b3title, desc: t.coachesPage.b3desc },
    { icon: DollarSign, title: t.coachesPage.b4title, desc: t.coachesPage.b4desc },
    { icon: Shield, title: t.coachesPage.b5title, desc: t.coachesPage.b5desc },
  ];

  const faqs = [
    { q: t.coachesPage.faq1q, a: t.coachesPage.faq1a },
    { q: t.coachesPage.faq2q, a: t.coachesPage.faq2a },
    { q: t.coachesPage.faq3q, a: t.coachesPage.faq3a },
    { q: t.coachesPage.faq4q, a: t.coachesPage.faq4a },
  ];

  return (
    <main className="min-h-screen bg-white pt-24">

      <section className="relative overflow-hidden bg-[#FFC107]">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '28px 28px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 border border-gray-900/20 mb-10">
            <MessageCircle className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t.coachesPage.badge}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tight">
                {t.coachesPage.heroTitle1}<br />{t.coachesPage.heroTitle2}<br />
                <span className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-xl inline-block mt-2">{t.coachesPage.heroHighlight}</span>
              </h1>
              <p className="text-xl text-gray-900/70 mb-10 leading-relaxed">
                {t.coachesPage.heroPara}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-[#FFC107] font-black rounded-xl hover:bg-gray-800 transition-all shadow-lg">
                  {t.coachesPage.ctaStart}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-900/20 hover:border-gray-900/40 transition-all">
                  {t.coachesPage.ctaPricing}
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">{t.coachesPage.exampleLabel}</p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{t.coachesPage.exIncome}</span>
                  <span className="font-black text-gray-900">$120,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{t.coachesPage.exSalary}</span>
                  <span className="font-black text-gray-900">$65,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-red-500">{t.coachesPage.exSeTaxWithout}</span>
                  <span className="font-black text-red-500">$16,920</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{t.coachesPage.exSeTaxWith}</span>
                  <span className="font-black text-gray-900">$9,945</span>
                </div>
              </div>
              <div className="bg-[#FFC107] rounded-xl p-4 text-center">
                <p className="text-xs font-bold text-gray-900/70 mb-1">{t.coachesPage.exSavingsLabel}</p>
                <p className="text-4xl font-black text-gray-900">$6,975</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">{t.coachesPage.featuresTitle}</h2>
          <p className="text-gray-600 mb-12 text-lg">{t.coachesPage.featuresSubtitle}</p>
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
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">{t.coachesPage.benefitsTitle}</h2>
          <div className="grid md:grid-cols-3 gap-6">
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
          <h2 className="text-3xl font-black text-gray-900 mb-12">{t.coachesPage.faqsTitle}</h2>
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
            {t.coachesPage.ctaTitle}
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            {t.coachesPage.ctaSubtitle}
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-gray-900 font-black text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-xl"
          >
            {t.coachesPage.ctaBtn}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
