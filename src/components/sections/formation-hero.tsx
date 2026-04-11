'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CircleCheck as CheckCircle2 } from 'lucide-react';

const badges = [
  'LLC & C-Corp Formation',
  'EIN Included',
  'Registered Agent',
  'All 50 States',
];

const FormationHero = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative pt-40 pb-32 bg-white dark:bg-[#0a0a0a] overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFC107] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFC107] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block p-3 px-6 rounded-xl bg-[#FFC107] dark:bg-[#FFD54F] text-black border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transform hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300"
          >
            <span className="text-sm tracking-tight font-black uppercase flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-black rounded-full animate-pulse" />
              US Business Formation
            </span>
          </motion.div>

          <motion.h1
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-black dark:text-white leading-[1.1]"
          >
            Form Your US LLC
            <span className="block mt-3 relative">
              Without the Stress
              <svg
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-5 text-[#FFC107]"
                viewBox="0 0 580 20"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 15 C 90 0, 490 0, 575 15" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-black/70 dark:text-white/70 leading-relaxed max-w-2xl mx-auto font-medium"
          >
            We handle everything—state filings, EIN, operating agreement, registered agent, compliance. You get a fully formed US business delivered to your dashboard.
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
          >
            <Link
              href="/signup"
              className="group inline-flex items-center gap-3 px-8 py-4 text-base font-black uppercase tracking-tight text-black bg-[#FFC107] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300"
            >
              Start Your Business
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="#how-it-works"
              className="group inline-flex items-center gap-3 px-8 py-4 text-base font-black uppercase tracking-tight text-black dark:text-white bg-transparent border-4 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
            >
              See How It Works
            </Link>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 pt-4"
          >
            {badges.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm border-2 border-black dark:border-white"
              >
                <CheckCircle2 className="w-4 h-4 text-[#FFC107] dark:text-black flex-shrink-0" />
                {badge}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 border-4 border-black dark:border-white"
        >
          {[
            { value: '4 Weeks', label: 'Average Formation Time' },
            { value: '50 States', label: 'Complete Coverage' },
            { value: '100%', label: 'Remote Process' },
            { value: '5 Steps', label: 'Simple Process' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-8 text-center bg-white dark:bg-[#0a0a0a] ${i % 2 === 0 ? 'border-r-4 border-black dark:border-white' : ''} ${i < 2 ? 'border-b-4 border-black dark:border-white md:border-b-0' : ''} ${i === 1 ? 'md:border-r-4 border-black dark:border-white' : ''} ${i === 2 ? 'md:border-r-4 border-black dark:border-white' : ''}`}
            >
              <div className="text-3xl md:text-4xl font-black text-black dark:text-white mb-2">{stat.value}</div>
              <div className="text-sm font-semibold text-black/60 dark:text-white/60 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FormationHero;
