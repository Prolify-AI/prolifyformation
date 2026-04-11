import Link from 'next/link';
import { ArrowRight, Globe, Target, Users, Shield, Zap, CircleCheck as CheckCircle2 } from 'lucide-react';

const values = [
  {
    icon: Globe,
    title: 'Built for global founders',
    desc: 'The world\'s best founders do not all live in Silicon Valley. We built Prolify for the founder in Lagos, São Paulo, Dubai, and Singapore who wants to access the US market.',
  },
  {
    icon: Target,
    title: 'Precision over volume',
    desc: 'We would rather be the best at US business formation and compliance for global entrepreneurs than a mediocre generalist. Deep expertise in a narrow domain.',
  },
  {
    icon: Shield,
    title: 'No surprises',
    desc: 'The $25,000 Form 5472 penalty exists because nobody told founders it was required. We believe in radical transparency about what you owe, what you need, and when.',
  },
  {
    icon: Zap,
    title: 'Automation first',
    desc: 'Manual bookkeeping and compliance is how mistakes happen. We automate everything that can be automated, and put humans on the parts that require judgment.',
  },
];

const stats = [
  { number: '10,000+', label: 'Businesses formed and managed' },
  { number: '50+', label: 'Countries our founders come from' },
  { number: '$0', label: 'In Form 5472 penalties for our clients' },
  { number: '24/7', label: 'AI Chief of Staff availability' },
];

const team = [
  {
    role: 'Formation',
    desc: 'Our formation team handles every state filing, registered agent coordination, and EIN application — so nothing slips through.',
  },
  {
    role: 'Tax & Compliance',
    desc: 'Licensed CPAs and enrolled agents who specialize in cross-border tax, Form 5472, and US compliance for foreign-owned entities.',
  },
  {
    role: 'Bookkeeping',
    desc: 'Certified bookkeepers who understand platform payouts, multi-currency transactions, and the specific needs of digital businesses.',
  },
  {
    role: 'Technology',
    desc: 'Engineers building the automation layer that keeps your books clean, your deadlines tracked, and your AI advisor sharp.',
  },
];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-24">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC107]/10 border-2 border-[#FFC107] mb-6">
          <Users className="w-5 h-5 text-black dark:text-white" />
          <span className="text-sm font-semibold text-black dark:text-white">About Prolify</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6 leading-tight">
              We exist because{' '}
              <span className="bg-[#FFC107] px-2">the system is broken.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Starting a US business used to require a US address, a US attorney, a US accountant, and a US bank. For the 95% of the world's founders who live outside the US, that was a wall.
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Prolify tears that wall down. We give every founder — regardless of country — the tools, the infrastructure, and the expertise to run a compliant, well-structured US business.
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

      {/* Mission */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Our mission</h2>
            <p className="text-2xl font-bold text-[#FFC107] leading-relaxed mb-6">
              To make the US business infrastructure accessible to every founder, everywhere.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-4">
              The world's best founders should not be held back by geography. A founder in Nairobi with a breakthrough idea deserves the same quality of business infrastructure as one in New York.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              That means proper entity structure, accurate books, zero missed deadlines, and an AI-powered advisor available at 3am when the question cannot wait until morning.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white mb-12">What we believe</h2>
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

      {/* Team Disciplines */}
      <section className="bg-[#FFC107]/10 border-y-2 border-black dark:border-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white mb-4">The team behind Prolify</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12 text-lg">Formation experts, CPAs, bookkeepers, and engineers — working together so your business runs right.</p>
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

      {/* CTA */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Ready to build your US business the right way?
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            Join thousands of global founders who trust Prolify with their business infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FFC107] text-black font-bold text-lg rounded-lg border-2 border-[#FFC107] shadow-[4px_4px_0px_0px_rgba(255,193,7,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(255,193,7,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-transparent text-white font-bold text-lg rounded-lg border-2 border-white hover:bg-white hover:text-black transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
