"use client";

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const WhyProlify = () => {
  return (
    <section className="relative pt-4 pb-20 md:pb-[100px] px-4 bg-gradient-to-b from-white via-[#FFC107]/[0.02] to-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,193,7,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      <div className="relative mx-auto !w-[1007px] !h-full !max-w-[1007px]">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-[42px] md:text-[64px] font-black tracking-tighter mb-6 text-black relative inline-block">
            Why Prolify?
            <div className="absolute -inset-4 bg-[#FFC107]/10 blur-2xl rounded-full -z-10 animate-pulse"></div>
          </h2>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#FFC107] to-[#FFC107] rounded-full" />
            <div className="relative">
              <div className="w-4 h-4 rounded-full bg-black border-4 border-[#FFC107] shadow-[0_0_20px_rgba(255,193,7,0.5)]" />
              <div className="absolute inset-0 w-4 h-4 rounded-full bg-[#FFC107] animate-ping opacity-20" />
            </div>
            <div className="h-1 w-20 bg-gradient-to-l from-transparent via-[#FFC107] to-[#FFC107] rounded-full" />
          </div>

          <div className="max-w-[850px] mx-auto space-y-3">
            <p className="text-xl md:text-[21px] text-black/80 leading-[1.6] font-semibold">
              We don't just form your business, we become your <span className="text-black bg-[#FFC107] px-2 py-1 rounded">US operations partner</span>.
            </p>
            <p className="text-lg md:text-[19px] text-black/70 leading-[1.6] font-medium">
              See how Prolify compares to doing it yourself or juggling multiple vendors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          <div className="group relative bg-white rounded-2xl overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] flex flex-col">
            <div className="absolute top-4 right-4 z-20 bg-[#FFC107] text-black px-3 py-1.5 rounded-lg border-2 border-black font-black text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
              RECOMMENDED
            </div>

            <div className="relative w-full h-[300px] overflow-hidden bg-gradient-to-br from-[#FFC107] to-[#FFB300]">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]"></div>
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/professional-photograph-of-a-confident-i-75da22a5-20251205235023.jpg"
                alt="Do It With Prolify"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/60 transition-all duration-500"></div>
            </div>

            <div className="p-8 flex flex-col flex-grow bg-white relative">
              <div className="absolute -top-6 left-6 w-12 h-12 bg-[#FFC107] border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-[26px] md:text-[28px] font-black text-black mb-4 leading-tight mt-4">
                Do It With Prolify
              </h3>
              <p className="text-[16px] md:text-[17px] text-black/70 mb-6 leading-relaxed flex-grow font-semibold">
                Your all-in-one US operations partner. Formation, compliance, banking, taxes, and ongoing support—all seamlessly integrated in one platform.
              </p>
              <button className="inline-flex items-center gap-2 text-black font-black text-[15px] transition-all duration-300 hover:gap-4 group/btn mt-auto bg-[#FFC107] px-6 py-3 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                Learn More
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] flex flex-col">
            <div className="relative w-full h-[300px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/professional-photograph-of-a-stressed-en-86cfd9b1-20251205235023.jpg"
                alt="Do It Yourself"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>

            <div className="p-8 flex flex-col flex-grow bg-white relative">
              <h3 className="text-[26px] md:text-[28px] font-black text-black mb-4 leading-tight">
                Do It Yourself
              </h3>
              <p className="text-[16px] md:text-[17px] text-black/70 mb-6 leading-relaxed flex-grow font-semibold">
                Navigate US business formation alone—spend months researching legal requirements, filing paperwork, finding banks, and staying compliant. One mistake can cost thousands.
              </p>
              <button className="inline-flex items-center gap-2 text-black font-black text-[15px] transition-all duration-300 hover:gap-4 group/btn mt-auto border-2 border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white">
                Learn More
                <ArrowRight className="h-5 w-5 transition-transform duration-300" />
              </button>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] flex flex-col md:col-span-2 lg:col-span-1">
            <div className="relative w-full h-[300px] overflow-hidden bg-gradient-to-br from-red-50 to-orange-50">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/professional-photograph-of-overwhelmed-b-8f4401e9-20251205235023.jpg"
                alt="Juggle Multiple Vendors"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-[-1deg]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>

            <div className="p-8 flex flex-col flex-grow bg-white relative">
              <h3 className="text-[26px] md:text-[28px] font-black text-black mb-4 leading-tight">
                Juggle Multiple Vendors
              </h3>
              <p className="text-[16px] md:text-[17px] text-black/70 mb-6 leading-relaxed flex-grow font-semibold">
                Hire separate providers for formation, accounting, legal, banking, and mail. Pay 2-3x more while coordinating between disconnected services with zero integration.
              </p>
              <button className="inline-flex items-center gap-2 text-black font-black text-[15px] transition-all duration-300 hover:gap-4 group/btn mt-auto border-2 border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white">
                Learn More
                <ArrowRight className="h-5 w-5 transition-transform duration-300" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyProlify;