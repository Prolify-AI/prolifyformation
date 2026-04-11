"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Prolify?",
    answer:
      "Prolify is your single partner for launching and running a US business from anywhere. We handle everything—LLC formation, bank account setup, bookkeeping, tax compliance, and more—so you can focus on building your company, not managing paperwork. International founders choose Prolify because we simplify the entire US business setup and keep you compliant every step of the way.",
  },
  {
    question: "Do I need to be a US citizen to use Prolify?",
    answer:
      "Not at all. Prolify is built specifically for international founders. We work with entrepreneurs from around the world to get their US businesses up and running. You don't need to be a US citizen, have a US address, or even visit the US to launch your company with us.",
  },
  {
    question: "Why should I form an LLC and open a US business bank account?",
    answer:
      "Forming an LLC protects your personal assets from business liabilities—it creates a legal separation between you and your company. A US business bank account keeps your personal and business finances separate, making tax filing cleaner, building business credit easier, and giving your company credibility with US clients and partners.",
  },
  {
    question: "What information do you need from me to get started?",
    answer:
      "We keep it simple. To start, we just need:\n\n• Your company name\n• Your personal address\n• Phone number and email\n\nLater in the process (when setting up your bank account), you'll need a passport. That's it.",
  },
  {
    question: "What is Prolify Bookkeeping?",
    answer:
      "Prolify Bookkeeping keeps your finances organized without the headache. You get:\n\n• Automated transaction tracking – Income and expenses tagged and categorized\n• Multi-account sync – Link all your bank accounts in one dashboard\n• Financial health reports – See your business performance at a glance\n• Tax-ready records – Everything organized when you need it\n• Dedicated bookkeeping (optional) – A real bookkeeper who knows your business and keeps your books current\n\nIt's designed to save you time and keep you audit-ready.",
  },
  {
    question: "Can Prolify help with my business taxes?",
    answer:
      "Yes. We handle your annual business tax filings with our in-house tax team, set up sales tax collection if needed, obtain reseller certificates, and ensure you stay compliant and in good standing. No surprise penalties. No missed deadlines.",
  },
  {
    question: "Who is Prolify Analytics for?",
    answer:
      "Prolify Analytics is built for e-commerce founders who want a simple dashboard to track sales, monitor orders, and understand their financial metrics without jumping between platforms. We currently integrate with Shopify and Amazon, with more integrations coming soon.",
  },
];

const accentColors = [
  "bg-[#FFC107]",
  "bg-white",
  "bg-[#FFF9E0]",
  "bg-white",
  "bg-[#FFC107]",
  "bg-[#FFF9E0]",
  "bg-white",
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-12 md:py-32 px-4 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,193,7,0.08),transparent_50%)]"></div>
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFC107] border-2 border-black mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-sm font-black text-black uppercase tracking-wide">Common Questions</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black">
            FAQs
          </h2>
          <p className="text-lg text-black/65 tracking-tight font-medium">
            Everything you need to know about launching your US business
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border-4 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] ${openIndex === index ? accentColors[index % accentColors.length] : 'bg-white'}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between gap-4 p-6 text-left transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-xs font-black ${openIndex === index ? 'bg-black text-white' : 'bg-[#FFC107] text-black'}`}>
                    {index + 1}
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-black tracking-tight">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-black flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 border-t-2 border-black pt-4 pl-20">
                  <p className="text-sm md:text-base text-black/70 tracking-tight whitespace-pre-line leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
