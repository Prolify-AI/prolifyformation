"use client";

import { Globe, Mic, BookOpen, Briefcase, GraduationCap, Users } from "lucide-react";

const types = [
  {
    icon: Globe,
    title: "Content Creators",
    description: "YouTube channels, blogs, and newsletters focused on entrepreneurship, startups, or immigration. Share your unique link and earn every time a viewer becomes a Prolify customer.",
    highlight: true,
  },
  {
    icon: Briefcase,
    title: "Business Consultants",
    description: "Lawyers, accountants, and consultants who advise founders on US expansion. Add Prolify to your service stack and earn while your clients get top-tier formation support.",
    highlight: false,
  },
  {
    icon: GraduationCap,
    title: "Startup Educators",
    description: "Accelerators, incubators, bootcamps, and university programs. Help your cohorts launch in the US while earning commissions on every successful formation.",
    highlight: false,
  },
  {
    icon: Mic,
    title: "Influencers & Podcasters",
    description: "Host a podcast or have a strong social media following in the entrepreneur niche? Turn your audience into passive income with Prolify's high-converting partner links.",
    highlight: true,
  },
  {
    icon: BookOpen,
    title: "Course Creators",
    description: "Teaching business, entrepreneurship, or e-commerce? Bundle Prolify as a recommended resource and get paid for every student who signs up.",
    highlight: false,
  },
  {
    icon: Users,
    title: "Community Leaders",
    description: "Running a Facebook group, Discord, or Slack community of founders? Recommend Prolify to your members and earn a commission on each conversion.",
    highlight: false,
  },
];

export default function PartnerTypes() {
  return (
    <section className="py-24 bg-[#FFFDF5] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,193,7,0.08),transparent_50%)]"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFC107] border-2 border-black mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-sm font-black text-black uppercase tracking-wide">Who Can Partner</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-4">
            Built for Every Type of Influencer
          </h2>
          <p className="text-lg text-black/65 font-medium max-w-2xl mx-auto">
            Whether you have 500 followers or 500,000—if your audience includes founders, there's money to be made.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map((type, index) => {
            const Icon = type.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 ${type.highlight ? "bg-[#FFC107]" : "bg-white"}`}
              >
                <div className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${type.highlight ? "bg-black" : "bg-[#FFC107]"}`}>
                  <Icon className={`w-6 h-6 ${type.highlight ? "text-[#FFC107]" : "text-black"}`} />
                </div>
                <h3 className="text-xl font-black text-black mb-3 tracking-tight">{type.title}</h3>
                <p className="text-sm text-black/65 leading-relaxed font-medium">{type.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
