"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight } from "lucide-react";
import { TermsModal } from "@/components/TermsModal";
import { useI18n } from "@/contexts/I18nContext";

const HIDDEN_PATHS = ["/signup", "/login"];

const Footer = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const { t } = useI18n();

  const footerLinks = [
    {
      title: t.footer.servicesTitle,
      links: [
        { label: t.nav.formation, href: "/formation" },
        { label: t.nav.bookkeeping, href: "/bookkeeping" },
        { label: t.nav.taxes, href: "/taxes" },
        { label: t.nav.compliance, href: "/compliance" },
        { label: t.nav.analytics, href: "/analytics" },
        { label: t.nav.aiChiefOfStaff, href: "/ai-chief-of-staff" },
        { label: t.nav.bankingGuidance, href: "/banking-guidance" },
      ],
    },
    {
      title: t.footer.forFoundersTitle,
      links: [
        { label: t.nav.saasFounders, href: "/saas-founders" },
        { label: t.nav.ecommerceSellers, href: "/ecommerce-sellers" },
        { label: t.nav.courseCreators, href: "/course-creators" },
        { label: t.nav.coachesConsultants, href: "/coaches-consultants" },
        { label: t.nav.newsletterCreators, href: "/newsletter-creators" },
        { label: t.nav.realEstateInvestors, href: "/real-estate-investors" },
      ],
    },
    {
      title: t.footer.resourcesTitle,
      links: [
        { label: t.nav.blog, href: "/blog" },
        { label: t.footer.ebooksGuides, href: "/e-books" },
        { label: t.footer.eventsWebinars, href: "/events" },
        { label: t.nav.prolifyUniversity, href: "/prolify-university" },
        { label: t.footer.marketplace, href: "/prolify-marketplace" },
        { label: t.nav.taxCalculator, href: "/tax-calculator" },
        { label: t.nav.vipClub, href: "/vip-club" },
      ],
    },
    {
      title: t.footer.companyTitle,
      links: [
        { label: t.nav.aboutUs, href: "/about-us" },
        { label: t.nav.partners, href: "/partners" },
        { label: t.nav.pricing, href: "/pricing" },
        { label: t.nav.login, href: "/login" },
        { label: t.footer.getStarted, href: "/signup" },
      ],
    },
  ];

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
                {t.footer.tagline}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[#FFC107] text-black text-sm font-bold rounded-xl hover:bg-[#FFB300] transition-all duration-200 border-2 border-[#FFC107]"
              >
                {t.footer.ctaPrimary}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black/12 text-black/70 text-sm font-bold rounded-xl hover:border-black hover:text-black transition-all duration-200"
              >
                {t.footer.ctaSecondary}
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
            {t.footer.disclaimer}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-black/35 font-medium">
              {t.footer.copyright}
            </p>
            <div className="flex gap-5 text-xs text-black/35">
              <a href="/privacy-policy" className="hover:text-black/60 cursor-pointer transition-colors font-medium">{t.footer.privacyPolicy}</a>
              <TermsModal className="hover:text-black/60 cursor-pointer transition-colors font-medium">{t.footer.termsOfService}</TermsModal>
              <a href="/cookie-policy" className="hover:text-black/60 cursor-pointer transition-colors font-medium">{t.footer.cookiePolicy}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
