"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

const resources = [
  {
    title: "How International Founders Can Open a US Business Bank Account (Without Visiting the US)",
    description: "Opening a US business bank account from abroad seems impossible—but it's not. This complete guide walks you through account options, required documents, and the exact steps to get your business banking set up remotely.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/professional-modern-illustration-of-us-b-02a41a50-20251209050901.jpg",
    cta: "Read the Guide"
  },
  {
    title: "US Tax Filing for Non-Residents: Everything International Founders Need to Know in 2025",
    description: "Navigate US tax requirements with confidence. Learn about filing deadlines, tax treaties, deductions for international founders, and how to stay compliant while minimizing your tax burden—all explained in plain English.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/professional-modern-illustration-of-us-t-7047db80-20251209050901.jpg",
    cta: "Learn More"
  },
  {
    title: "Delaware vs. Wyoming vs. Your Home State: Choosing the Best State for Your LLC",
    description: "Not all states are created equal for LLC formation. Discover the pros and cons of Delaware, Wyoming, and other popular states—including costs, privacy, taxes, and what actually matters for international founders.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/professional-modern-illustration-of-us-s-00173721-20251209050901.jpg",
    cta: "Compare States"
  },
  {
    title: "The Complete Guide to Launching a US E-Commerce Business as an International Founder",
    description: "From Shopify setup to sales tax compliance, discover how to launch and scale your e-commerce business in the US market. Includes platform comparisons, fulfillment options, and real metrics from successful international sellers.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/professional-modern-illustration-of-us-e-575f440b-20251209051105.jpg",
    cta: "Start Selling"
  }
];

export default function ResourcesGuides() {
  return (
    <section className="relative py-20 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,193,7,0.06),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-3 bg-[#FFC107] border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 animate-[slideDown_0.6s_ease-out]">
            <span className="text-sm font-black text-black uppercase tracking-wider">Knowledge Base</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tighter relative inline-block">
            The Complete Playbook for International Founders
            <div className="absolute -inset-6 bg-[#FFC107]/5 blur-3xl rounded-full -z-10 animate-pulse"></div>
          </h2>
          <p className="text-xl text-black/70 font-semibold">
            Essential guides to help you launch and scale your US business with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] flex flex-col"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFC107]/0 via-[#FFC107]/0 to-[#FFC107]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>

              <div className="absolute -top-2 -right-2 w-24 h-24 bg-[#FFC107] rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-white border-b-4 border-black">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,193,7,0.1)_50%,transparent_75%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_2s_infinite]"></div>
                <Image
                  src={resource.image}
                  alt={resource.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute top-4 left-4 bg-[#FFC107] text-black px-3 py-1.5 rounded-lg border-2 border-black font-black text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  GUIDE #{index + 1}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow bg-white relative z-20">
                <h3 className="text-xl font-black text-black mb-3 line-clamp-3 group-hover:text-black transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-black/70 mb-6 flex-grow line-clamp-4 font-semibold">
                  {resource.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-black font-black text-sm hover:gap-4 transition-all duration-300 group/btn bg-[#FFC107] px-5 py-3 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  <span className="relative">
                    {resource.cta}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></span>
                  </span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}