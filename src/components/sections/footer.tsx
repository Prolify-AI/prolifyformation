"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
    <footer className="bg-black border-t-4 border-[#FFC107]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="text-2xl font-black text-white">
              Prolify
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Launch and run your US business, from anywhere in the world.
            </p>
            <div className="flex gap-3 pt-2">
              <Link
                href="/signup"
                className="px-4 py-2 bg-[#FFC107] text-black text-sm font-bold rounded-lg border-2 border-[#FFC107] hover:bg-[#FFC107]/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-black text-[#FFC107] mb-4 text-sm uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-12 pt-8">

          {/* Disclaimer */}
          <p className="text-xs text-white/40 leading-relaxed mb-6 max-w-4xl">
            Prolify provides business formation, bookkeeping, and administrative services. We are not a law firm and do not provide legal advice. We are not a licensed accounting or CPA firm and do not provide tax, audit, or accounting advice. Information provided through our platform, AI Chief of Staff, and any educational content is for informational purposes only and does not constitute legal, tax, or financial advice. Tax estimates provided by our calculator are approximations only and should not be relied upon for filing purposes. Consult a licensed attorney, CPA, or financial advisor for your specific situation.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              &copy; 2025 Prolify. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-white/40">
              <span className="hover:text-white/60 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white/60 cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-white/60 cursor-pointer transition-colors">Cookie Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
