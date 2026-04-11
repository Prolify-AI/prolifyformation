"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';

const ChooseYourPath = () => {
  return (
    <section className="relative pt-8 pb-2 px-4 bg-gradient-to-b from-white via-[#FFC107]/[0.02] to-white overflow-hidden">
      <div className="relative mx-auto max-w-[1007px]">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-[#FFC107] border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300">
            <Sparkles className="w-5 h-5 text-black animate-pulse" />
            <span className="text-sm font-black text-black uppercase tracking-wider">Choose Your Path</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChooseYourPath;
