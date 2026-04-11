'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { CircleCheck as CheckCircle2, Clock, User, Building, Percent, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const steps = [
  {
    number: '01',
    headline: 'Submit Your Information',
    description: 'Answer a few basic questions about your business through our guided setup. No legal jargon—just straightforward questions we need to file your paperwork correctly.',
    items: [
      'Company name (we\'ll check availability)',
      'Entity type (LLC or C-Corp)',
      'State where you want to form',
      'Member/owner information',
    ],
    timeline: '15 minutes',
  },
  {
    number: '02',
    headline: 'We File in Any of the 50 States',
    description: 'We handle all the paperwork—state filings, operating agreement, articles of organization, and registered agent setup. You get confirmation when your business is officially formed.',
    items: [
      'LLC or C-Corp formation in your chosen state',
      'Operating agreement customized for your business',
      'Articles of organization filed with the state',
      'Registered agent service (first year included)',
    ],
    timeline: '1 week average (varies by state)',
  },
  {
    number: '03',
    headline: 'Secure Your Business Documents',
    description: 'We obtain your federal EIN (tax ID) from the IRS and prepare all documents banks and payment processors require. Everything is organized in your Prolify dashboard.',
    items: [
      'Federal EIN (Employer Identification Number)',
      'EIN confirmation letter',
      'Certificate of formation',
      'Operating agreement (signed)',
    ],
    timeline: '1-2 days (US) / 4-6 weeks (international)',
  },
  {
    number: '04',
    headline: 'Apply for Your US Bank Account',
    description: 'With your business documents ready, you can apply for a US business bank account through our partner network—all remotely, without visiting the US.',
    items: [
      'Your business documents (we provide these)',
      'Valid passport (for international founders)',
      'Basic business information',
    ],
    timeline: '3-5 business days for account approval',
  },
  {
    number: '05',
    headline: 'You\'re Ready to Do Business',
    description: 'Your LLC is formed, your EIN is secured, your bank account is open. Now focus on building your business while we handle ongoing compliance, bookkeeping, and tax filings.',
    items: [
      'Bookkeeping: Automated transaction tracking',
      'Tax filing: Annual business tax preparation',
      'Compliance monitoring: Deadline reminders',
      'Registered agent: Continued legal document handling',
    ],
    cta: true,
  },
];

const entityInfo = {
  llc: {
    title: 'Limited Liability Company (LLC)',
    description: 'A flexible business structure that offers personal liability protection and can have one or multiple owners (members). Popular among small business owners and entrepreneurs for its simplicity and tax flexibility.',
    pros: [
      'Limited liability protection for owners',
      'Simple management structure and easy to operate',
      'Unlimited owners (US and international)',
    ],
    cons: [
      'Cannot issue stock to investors',
      'Ownership represented by members, not shares',
    ],
  },
  ccorp: {
    title: 'C Corporation',
    description: 'A legal entity separate from its owners. Can have unlimited shareholders and is ideal for businesses planning to raise venture capital or go public.',
    pros: [
      'Unlimited shareholders',
      'Can issue multiple classes of stock',
      'Easier to raise venture capital',
    ],
    cons: [
      'Double taxation (corporate and dividend)',
      'More complex management requirements',
    ],
  },
  scorp: {
    title: 'S Corporation',
    description: 'A tax designation that allows business income to pass through to owners\' personal tax returns, avoiding double taxation while still providing liability protection.',
    pros: [
      'Pass-through taxation avoids double tax',
      'Limited liability protection',
      'Can have up to 100 shareholders',
    ],
    cons: [
      'Strict ownership restrictions',
      'Only one class of stock allowed',
    ],
  },
};

type EntityTab = 'llc' | 'ccorp' | 'scorp';

const FormationProcess = () => {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<EntityTab>('llc');
  const currentEntity = entityInfo[activeTab];

  return (
    <section id="how-it-works" className="relative w-full py-24 lg:py-32 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 px-4 py-2 bg-[#FFC107] text-black font-black text-xs uppercase tracking-widest border-2 border-black dark:border-black"
          >
            The Process
          </motion.div>
          <motion.h2
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-black dark:text-white mb-6 leading-[1.1]"
          >
            Launch Your US Business
            <span className="block">in 5 Simple Steps</span>
          </motion.h2>
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-black/60 dark:text-white/60 max-w-2xl mx-auto"
          >
            From company name to bank account—here&apos;s exactly how we get your business set up and legally compliant.
          </motion.p>
        </div>

        <div className="space-y-0 border-4 border-black dark:border-white">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : index * 0.08 }}
              className={`grid lg:grid-cols-[200px_1fr] gap-0 ${index < steps.length - 1 ? 'border-b-4 border-black dark:border-white' : ''}`}
            >
              <div className="flex items-center justify-center p-8 bg-[#FFC107] border-r-0 lg:border-r-4 border-b-4 lg:border-b-0 border-black dark:border-white">
                <span className="text-6xl lg:text-7xl font-black text-black leading-none">{step.number}</span>
              </div>

              <div className="p-8 lg:p-10 bg-white dark:bg-[#111]">
                <h3 className="text-2xl lg:text-3xl font-black text-black dark:text-white tracking-tight mb-3">
                  {step.headline}
                </h3>
                <p className="text-base text-black/60 dark:text-white/60 mb-6 leading-relaxed max-w-2xl">
                  {step.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-2 mb-6">
                  {step.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#FFC107] flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold text-black dark:text-white leading-snug">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {step.timeline && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-bold">
                      <Clock className="w-4 h-4" />
                      {step.timeline}
                    </div>
                  )}
                  {step.cta && (
                    <Link
                      href="/signup"
                      className="group inline-flex items-center gap-2 px-6 py-2 text-sm font-black uppercase tracking-tight text-black bg-[#FFC107] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300"
                    >
                      Start Your Business
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 lg:mt-28"
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl lg:text-4xl font-black text-black dark:text-white tracking-tight mb-3">
              LLC or C-Corp?
              <span className="block text-[#FFC107]">We&apos;ll Help You Decide.</span>
            </h3>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 text-base font-black uppercase tracking-wide text-black dark:text-white hover:text-[#FFC107] dark:hover:text-[#FFC107] transition-colors duration-300"
            >
              Take Our Quiz <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex justify-center gap-0 mb-0 border-4 border-black dark:border-white w-fit mx-auto">
            {([
              { key: 'llc' as EntityTab, label: 'LLC', icon: User },
              { key: 'ccorp' as EntityTab, label: 'C-Corp', icon: Building },
              { key: 'scorp' as EntityTab, label: 'S-Corp', icon: Percent },
            ]).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-6 py-3 font-black text-sm uppercase tracking-wide transition-all duration-200 border-r-4 last:border-r-0 border-black dark:border-white ${
                  activeTab === key
                    ? 'bg-[#FFC107] text-black'
                    : 'bg-white dark:bg-[#111] text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#222]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="border-4 border-t-0 border-black dark:border-white p-8 lg:p-10 bg-white dark:bg-[#111]">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <h4 className="text-2xl lg:text-3xl font-black text-black dark:text-white tracking-tight mb-4">
                  {currentEntity.title}
                </h4>
                <p className="text-base text-black/60 dark:text-white/60 leading-relaxed mb-6">
                  {currentEntity.description}
                </p>

                <div className="space-y-3 mb-6">
                  <p className="text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/40">Advantages</p>
                  {currentEntity.pros.map((pro, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#FFC107] flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold text-black dark:text-white leading-snug">{pro}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/40">Limitations</p>
                  {currentEntity.cons.map((con, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-black/30 dark:text-white/30 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-black/50 dark:text-white/50 leading-snug">{con}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="bg-black dark:bg-[#FFC107] p-8 border-4 border-black dark:border-[#FFC107] mb-6">
                  <p className="text-white dark:text-black font-black text-lg mb-2">Not sure which is right for you?</p>
                  <p className="text-white/70 dark:text-black/70 text-sm mb-6 leading-relaxed">Our team of experts will help you choose the best structure for your goals, location, and business model.</p>
                  <Link
                    href="/quiz"
                    className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-tight text-black bg-[#FFC107] dark:bg-black dark:text-white border-4 border-[#FFC107] dark:border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] dark:shadow-[4px_4px_0px_0px_rgba(255,193,7,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300"
                  >
                    Take the Quiz
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>

                <Link
                  href="/signup"
                  className="group w-full flex items-center justify-between px-8 py-5 text-base font-black uppercase tracking-tight text-black bg-[#FFC107] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300"
                >
                  Start Your Business Now
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FormationProcess;
