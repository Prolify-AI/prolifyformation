"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Zap, Globe, Shield } from "lucide-react";

const HeroSection = () => {

  const scrollToPricing = () => {
    const element = document.getElementById('prolify-pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-40 pb-32 bg-white overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-white"></div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#FFC10708_1px,transparent_1px),linear-gradient(to_bottom,#FFC10708_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="max-w-6xl mx-auto px-4 text-center space-y-8 relative z-10">
        <div className="inline-block p-3 px-6 rounded-xl bg-[#FFC107] text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 animate-[slideDown_0.6s_ease-out]">
          <span className="text-sm tracking-tight font-black uppercase flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-black rounded-full animate-pulse"></span>
            Launch and run your US business, from anywhere.
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black leading-[1.1] animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
          The all-in-one platform
          <span className="block mt-4 relative">
            <span className="bg-gradient-to-r from-black via-black to-black/80 bg-clip-text text-transparent">
              to expand your business to the United States
            </span>
            <svg
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 text-[#FFC107]"
              viewBox="0 0 580 20"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 15 C 90 0, 490 0, 575 15"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                style={{ strokeDasharray: 600, strokeDashoffset: 600 }}
                className="animate-[draw_1.2s_ease-out_0.8s_forwards]" />
            </svg>
            <div className="absolute -right-8 -top-8 w-20 h-20 bg-[#FFC107] rounded-full opacity-20 blur-2xl animate-pulse"></div>
          </span>
        </h1>

        <p className="text-xl tracking-tight text-black/65 max-w-3xl mx-auto leading-relaxed font-medium animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
          Prolify is your <span className="font-bold text-black">single partner</span> for everything: LLC Formation, Bank Account, Taxes, Virtual Office, Bookkeeping, and real-time business analytics. We handle your entire US business setup so you can focus on what matters—your customers.
        </p>

        <div className="flex items-center justify-center gap-6 pt-8 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
          <Link href="/signup" className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-black transition-all duration-300 h-14 px-10 bg-[#FFC107] hover:bg-[#FFB300] text-black tracking-tight group rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
            <span className="relative">Start Your LLC</span>
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2 relative" />
          </Link>
          <button
            onClick={scrollToPricing}
            className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-black transition-all duration-300 h-14 px-10 bg-white hover:bg-black text-black hover:text-white tracking-tight group rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] overflow-hidden">
            <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="relative z-10">See Pricing</span>
          </button>
        </div>

        <div className="pt-12 animate-[fadeInUp_0.8s_ease-out_0.8s_both]">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Zap, text: "Form in 1 Week" },
              { icon: Globe, text: "All 50 States" },
              { icon: Shield, text: "100% Remote Process" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-black rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm font-bold text-black">
                <span className="w-5 h-5 bg-[#FFC107] rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3 h-3 text-black" />
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 animate-[fadeInUp_1s_ease-out_1s_both]">
          <div
            onClick={scrollToNextSection}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <span className="text-sm text-black/50 group-hover:text-black font-bold uppercase tracking-wider transition-colors">
              Scroll to explore
            </span>
            <div className="relative">
              <div className="absolute -inset-4 bg-[#FFC107] rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <div className="w-12 h-12 rounded-full border-4 border-black bg-[#FFC107] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                <ChevronDown className="h-6 w-6 text-black animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;
