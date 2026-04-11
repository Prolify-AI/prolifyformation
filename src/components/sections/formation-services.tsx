'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Building2, FileText, Shield, Receipt, BookOpen, FileCheck, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Building2,
    title: 'Complete LLC Formation',
    description: 'State filing. Federal EIN. Operating agreement. Registered agent. Everything you need to launch legally. Done in ~4 weeks.',
    cta: 'Start Now',
    href: '/signup',
  },
  {
    icon: FileText,
    title: 'All the Documents You\'ll Actually Need',
    description: 'Banks want specific paperwork. We prepare it all—formatted correctly, ready to submit. No rejections. No confusion.',
    cta: 'See Documents',
    href: '/signup',
  },
  {
    icon: Shield,
    title: 'Registered Agent Service',
    description: 'We\'re your official US address for legal notices. When something arrives, you get it in your dashboard immediately.',
    cta: 'Learn More',
    href: '/signup',
  },
  {
    icon: Receipt,
    title: 'Sales Tax & Reseller Certificates',
    description: 'We register you for sales tax and get your reseller certificates. Stay compliant and buy inventory tax-free.',
    cta: 'Get Registered',
    href: '/signup',
  },
  {
    icon: BookOpen,
    title: 'Automated Bookkeeping',
    description: 'Syncs with your bank and payment processors. Categorizes transactions automatically. Add a dedicated bookkeeper for hands-off books.',
    cta: 'Connect Accounts',
    href: '/signup',
  },
  {
    icon: FileCheck,
    title: 'Annual Tax Filing',
    description: 'Our CPA team files your business taxes on time, every time. Federal, state, and local—all handled.',
    cta: 'File Taxes',
    href: '/signup',
  },
];

const FormationServices = () => {
  const prefersReducedMotion = useReducedMotion();

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
            Everything Included
          </motion.div>
          <motion.h2
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-black mb-6 leading-[1.1]"
          >
            Start Smart.
            <span className="block text-[#FFC107] [text-shadow:2px_2px_0px_rgba(0,0,0,0.15)]">Stay Compliant.</span>
          </motion.h2>
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-black/60 leading-relaxed"
          >
            Everything you need to launch and operate your US business legally—from formation to ongoing compliance.
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
            Get Started Today
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FormationServices;
