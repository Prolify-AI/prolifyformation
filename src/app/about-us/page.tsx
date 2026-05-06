'use client';

import Link from 'next/link';
import { ArrowRight, Globe, Target, Users, Shield, Zap, CircleCheck as CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function AboutUsPage() {
  const { t } = useI18n();

  const values = [
    { icon: Globe, title: t.aboutPage.v1title, desc: t.aboutPage.v1desc },
    { icon: Target, title: t.aboutPage.v2title, desc: t.aboutPage.v2desc },
    { icon: Shield, title: t.aboutPage.v3title, desc: t.aboutPage.v3desc },
    { icon: Zap, title: t.aboutPage.v4title, desc: t.aboutPage.v4desc },
  ];

  const stats = [
    { number: t.aboutPage.stat1, label: t.aboutPage.stat1Label },
    { number: t.aboutPage.stat2, label: t.aboutPage.stat2Label },
    { number: t.aboutPage.stat3, label: t.aboutPage.stat3Label },
    { number: t.aboutPage.stat4, label: t.aboutPage.stat4Label },
  ];

  const team = [
    { role: t.aboutPage.team1role, desc: t.aboutPage.team1desc },
    { role: t.aboutPage.team2role, desc: t.aboutPage.team2desc },
    { role: t.aboutPage.team3role, desc: t.aboutPage.team3desc },
    { role: t.aboutPage.team4role, desc: t.aboutPage.team4desc },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-24">

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC107]/10 border-2 border-[#FFC107] mb-6">
          <Users className="w-5 h-5 text-black dark:text-white" />
          <span className="text-sm font-semibold text-black dark:text-white">{t.aboutPage.badge}</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6 leading-tight">
              {t.aboutPage.heroTitle1}{' '}
              <span className="bg-[#FFC107] px-2">{t.aboutPage.heroTitle2}</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              {t.aboutPage.heroPara1}
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {t.aboutPage.heroPara2}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ number, label }) => (
              <div key={label} className="border-2 border-black dark:border-white rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                <div className="text-3xl font-black text-black dark:text-white mb-2">{number}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-black mb-6">{t.aboutPage.missionTitle}</h2>
            <p className="text-2xl font-bold text-[#FFC107] leading-relaxed mb-6">
              {t.aboutPage.missionHighlight}
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-4">
              {t.aboutPage.missionPara1}
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              {t.aboutPage.missionPara2}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white mb-12">{t.aboutPage.valuesTitle}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="border-2 border-black dark:border-white rounded-2xl p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              <div className="w-12 h-12 bg-[#FFC107] border-2 border-black dark:border-white rounded-xl flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-black text-black dark:text-white mb-3">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#FFC107]/10 border-y-2 border-black dark:border-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white mb-4">{t.aboutPage.teamTitle}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12 text-lg">{t.aboutPage.teamSubtitle}</p>
          <div className="grid md:grid-cols-2 gap-6">
            {team.map(({ role, desc }) => (
              <div key={role} className="flex gap-4 p-6 bg-white dark:bg-[#111] border-2 border-black dark:border-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                <CheckCircle2 className="w-6 h-6 text-[#FFC107] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-black text-black dark:text-white mb-2">{role}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            {t.aboutPage.ctaTitle}
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            {t.aboutPage.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-black font-bold text-lg rounded-lg border-2 border-[#FFC107] shadow-[4px_4px_0px_0px_rgba(255,193,7,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(255,193,7,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {t.aboutPage.ctaStart}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-transparent text-white font-bold text-lg rounded-lg border-2 border-white hover:bg-white hover:text-black transition-all"
            >
              {t.aboutPage.ctaPricing}
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
