"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight } from "lucide-react";

const HIDDEN_PATHS = ["/signup", "/login"];

const footerLinks = [
  {
    title: "Services",
    links: [
      { label: "Formation", href: "/formation" },
      { label: "Bookkeeping", href: "/bookkeeping" },
      { label: "Taxes", href: "/taxes" },
      { label: "Compliance", href: "/compliance" },
      { label: "Analytics", href: "/analytics" },
      { label: "AI Chief of Staff", href: "/ai-chief-of-staff" },
      { label: "Banking Guidance", href: "/banking-guidance" },
    ],
  },
  {
    title: "For Founders",
    links: [
      { label: "SaaS Founders", href: "/saas-founders" },
      { label: "E-commerce Sellers", href: "/ecommerce-sellers" },
      { label: "Course Creators", href: "/course-creators" },
      { label: "Coaches & Consultants", href: "/coaches-consultants" },
      { label: "Newsletter Creators", href: "/newsletter-creators" },
      { label: "Real Estate Investors", href: "/real-estate-investors" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "E-books & Guides", href: "/e-books" },
      { label: "Events & Webinars", href: "/events" },
      { label: "Prolify University", href: "/prolify-university" },
      { label: "Marketplace", href: "/prolify-marketplace" },
      { label: "Tax Calculator", href: "/tax-calculator" },
      { label: "VIP Club", href: "/vip-club" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Partners", href: "/partners" },
      { label: "Pricing", href: "/pricing" },
      { label: "Login", href: "/login" },
      { label: "Get Started", href: "/signup" },
    ],
  },
];

const Footer = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  if (user || HIDDEN_PATHS.includes(pathname)) {
    return null;
  }

  return (
    <footer className="bg-white border-t-4 border-[#FFC107]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="py-14 border-b border-black/8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-md">
              <Link href="/" className="text-2xl font-black text-black tracking-tight">
                Prolify
              </Link>
              <p className="text-sm text-black/50 leading-relaxed mt-3 font-medium">
                Launch and run your US business from anywhere in the world. One platform, every service, zero confusion.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[#FFC107] text-black text-sm font-bold rounded-xl hover:bg-[#FFB300] transition-all duration-200 border-2 border-[#FFC107]"
              >
                Start Your LLC
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black/12 text-black/70 text-sm font-bold rounded-xl hover:border-black hover:text-black transition-all duration-200"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>

        <div className="py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 border-b border-black/8">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-black text-black mb-5 text-xs uppercase tracking-widest">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-black/45 hover:text-black transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-8">
          <p className="text-xs text-black/35 leading-relaxed mb-6 max-w-4xl">
            Prolify provides business formation, bookkeeping, and administrative services. We are not a law firm and do not provide legal advice. We are not a licensed accounting or CPA firm and do not provide tax, audit, or accounting advice. Information provided through our platform is for informational purposes only and does not constitute legal, tax, or financial advice. Consult a licensed attorney, CPA, or financial advisor for your specific situation.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-black/35 font-medium">
              &copy; 2025 Prolify. All rights reserved.
            </p>
            <div className="flex gap-5 text-xs text-black/35">
              <a href="/privacy-policy" className="hover:text-black/60 cursor-pointer transition-colors font-medium">Privacy Policy</a>
              <span className="hover:text-black/60 cursor-pointer transition-colors font-medium">Terms of Service</span>
              <a href="/cookie-policy" className="hover:text-black/60 cursor-pointer transition-colors font-medium">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
