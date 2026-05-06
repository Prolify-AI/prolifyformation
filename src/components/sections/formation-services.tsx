'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Building2, FileText, Shield, Receipt, BookOpen, FileCheck, ArrowRight } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

const FormationServices = () => {
  const prefersReducedMotion = useReducedMotion();
  const { t } = useI18n();

  const services = [
    {
      icon: Building2,
      title: t.formation.svc1title,
      description: t.formation.svc1desc,
      cta: t.formation.svc1cta,
      href: '/signup',
    },
    {
      icon: FileText,
      title: t.formation.svc2title,
      description: t.formation.svc2desc,
      cta: t.formation.svc2cta,
      href: '/signup',
    },
    {
      icon: Shield,
      title: t.formation.svc3title,
      description: t.formation.svc3desc,
      cta: t.formation.svc3cta,
      href: '/signup',
    },
    {
      icon: Receipt,
      title: t.formation.svc4title,
      description: t.formation.svc4desc,
      cta: t.formation.svc4cta,
      href: '/signup',
    },
    {
      icon: BookOpen,
      title: t.formation.svc5title,
      description: t.formation.svc5desc,
      cta: t.formation.svc5cta,
      href: '/signup',
    },
    {
      icon: FileCheck,
      title: t.formation.svc6title,
      description: t.formation.svc6desc,
      cta: t.formation.svc6cta,
      href: '/signup',
    },
  ];

  return (
    <section className="relative w-full py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 px-4 py-2 bg-[#FFC107] text-black font-black text-xs uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            {t.formation.servicesBadge}
          </motion.div>
          <motion.h2
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-black mb-6 leading-[1.1]"
          >
            {t.formation.servicesTitle1}
            <span className="block text-[#FFC107] [text-shadow:2px_2px_0px_rgba(0,0,0,0.15)]">{t.formation.servicesTitle2}</span>
          </motion.h2>
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-black/60 leading-relaxed"
          >
            {t.formation.servicesSubtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-4 border-black">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isLastInRow3 = (index + 1) % 3 === 0;
            const isLastInRow2 = (index + 1) % 2 === 0;
            const isLastRow3 = index >= services.length - 3;
            const isLastRow2 = index >= services.length - 2;
            const isLast = index === services.length - 1;
            const isHighlighted = index % 3 === 1;

            return (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                className={[
                  'group relative p-8 lg:p-10 transition-all duration-300 cursor-pointer hover:bg-[#FFC107]',
                  isHighlighted ? 'bg-[#FFF9E0]' : 'bg-white',
                  'border-b-4 border-black',
                  isLast ? 'border-b-0' : '',
                  isLastRow2 ? 'md:border-b-0' : '',
                  isLastRow3 ? 'lg:border-b-0' : '',
                  'border-r-4 border-black',
                  isLastInRow2 ? 'md:border-r-0' : '',
                  isLastInRow3 ? 'lg:border-r-0' : '',
                ].join(' ')}
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FFC107] group-hover:bg-black border-4 border-black transition-all duration-300">
                    <Icon className="w-7 h-7 text-black group-hover:text-[#FFC107] transition-colors duration-300" strokeWidth={2.5} />
                  </div>
                </div>

                <h3 className="text-xl lg:text-2xl font-black text-black tracking-tight mb-4 leading-tight transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-base text-black/60 group-hover:text-black/80 leading-relaxed mb-6 transition-colors duration-300">
                  {service.description}
                </p>

                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 text-black font-black text-sm uppercase tracking-wide transition-colors duration-300 group-hover:underline"
                >
                  {service.cta}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-3 px-8 py-4 text-base font-black uppercase tracking-tight text-black bg-[#FFC107] border-4 border-[#FFC107] shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300"
          >
            {t.formation.getStartedToday}
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FormationServices;
