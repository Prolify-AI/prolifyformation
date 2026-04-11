"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const tabs = [
{ id: "all-in-one", label: "All-in-One" },
{ id: "formation", label: "Formation" },
{ id: "bookkeeping", label: "Bookkeeping" },
{ id: "taxes", label: "Taxes" },
{ id: "analytics", label: "Analytics" }];


const IntegrationsSection = () => {
  const [activeTab, setActiveTab] = useState("all-in-one");

  return (
    <section id="integrations" className="py-12 md:py-32 px-4 bg-gradient-to-b from-white to-emerald-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black">
            Launch and run your US business, from anywhere.
          </h2>
          <div className="max-w-3xl mx-auto space-y-5">
            {/* Main value proposition with emphasis */}
            <p className="text-lg md:text-xl text-black/70 tracking-tight leading-relaxed">
              Prolify gives you <span className="relative inline-block text-black font-semibold">
                everything
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-400 to-blue-400"></span>
              </span> to launch and operate legally in the US.
            </p>
            
            {/* Feature badges with icons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 font-medium text-sm shadow-sm hover:shadow-md transition-shadow duration-300 border border-emerald-200/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                One unified platform
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium text-sm shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-200/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                One partner
              </span>
            </div>
            
            {/* Closing statement with decorative elements */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-black/20"></div>
              <p className="text-sm md:text-base text-black/50 tracking-tight italic font-light">
                Built for international founders like you
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-black/20"></div>
            </div>
          </div>
        </div>

        {/* Service Showcase - Tab Navigation */}
        <div className="border-b border-[#E5E5E5]">
          <nav className="flex gap-10 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
            {tabs.map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap text-base font-medium transition-colors duration-200 hover:text-black ${
              activeTab === tab.id ?
              "text-black border-b-[3px] border-[#FFD700] pb-4 -mb-4" :
              "text-[#666666]"}`
              }>

                {tab.label}
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-12">
          {activeTab === "all-in-one" && <AllInOneTab />}
          {activeTab === "formation" && <FormationTab />}
          {activeTab === "bookkeeping" && <BookkeepingTab />}
          {activeTab === "taxes" && <TaxesTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
        </div>
      </div>
    </section>);

};

// All-in-One Tab
function AllInOneTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Formation Card */}
      <ServiceCard
        icon="🏢"
        category="Formation"
        bgColor="#FFF9E6"
        headline="Form Your US Business From Anywhere."
        description="Launch your LLC in any US state—complete with EIN, Operating Agreement, and registered agent service."
        cta="Start Your Business"
        visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/modern-minimalist-dashboard-interface-mo-b466c2d4-20251205215249.jpg" />


      {/* Banking Card */}
      <ServiceCard
        icon="🏦"
        category="Banking"
        bgColor="#F0F4FF"
        headline="Open Your US Business Bank Account Remotely."
        description="Get a US business bank account without stepping foot in the US. We handle the entire process."
        cta="Set Up Banking" />


      {/* Bookkeeping Card */}
      <ServiceCard
        icon="📊"
        category="Bookkeeping"
        bgColor="#F3F0FF"
        headline="Automated Bookkeeping That Keeps You Tax-Ready."
        description="Track expenses, categorize transactions, and stay organized—all in one dashboard."
        cta="Track Your Finances"
        visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/modern-financial-transaction-dashboard-m-1fdf93cf-20251205215249.jpg" />


      {/* Taxes Card */}
      <ServiceCard
        icon="✅"
        category="Taxes"
        bgColor="#E8F5E9"
        headline="Stress-Free Tax Filing With Expert Support."
        description="Our in-house tax team handles your annual filings, keeps you compliant, and maximizes deductions."
        cta="File Your Taxes"
        visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/playful-modern-vector-illustration-of-ta-28a36ac4-20251205215249.jpg" />


      {/* Analytics Card */}
      <ServiceCard
        icon="📈"
        category="Analytics"
        bgColor="#FFF0F5"
        headline="Real-Time Business Insights for E-Commerce Founders."
        description="Track sales, monitor orders, and understand your metrics—integrated with Shopify and Amazon."
        cta="Analyze Your Sales"
        visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/modern-e-commerce-analytics-dashboard-mo-3fa38e7c-20251205215249.jpg" />

    </div>);

}

// Formation Tab
function FormationTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Formation Filings */}
      <FormationCard
        categoryLabel="Formation Filings"
        categoryColor="#D4A574"
        bgColor="#FFF9E6"
        headline="Stay Legally Compliant With Expert Formation Services."
        description="We handle all the paperwork, filings, and state compliance so you can focus on building your business."
        visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/modern-minimalist-dashboard-interface-mo-b466c2d4-20251205215249.jpg" />


      {/* EIN */}
      <FormationCard
        categoryLabel="EIN"
        categoryColor="#D4A574"
        bgColor="#FFF9E6"
        headline="Get Your Employer Identification Number in Days, Not Weeks."
        description="We obtain your EIN from the IRS so you can open bank accounts and hire team members."
        visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/minimalist-vector-illustration-of-a-prof-5229100a-20251205215249.jpg" />


      {/* Registered Agent */}
      <FormationCard
        categoryLabel="Registered Agent Services"
        categoryColor="#D4A574"
        bgColor="#FFF9E6"
        headline="Trusted Registered Agent Service for Your Business."
        description="We receive your important government documents and legal notices so you never miss a deadline."
        visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/modern-vector-illustration-of-two-busine-ee991761-20251205215249.jpg" />


      {/* Operating Agreement */}
      <div className="md:col-span-2 lg:col-span-1">
        <FormationCard
          categoryLabel="Operating Agreement"
          categoryColor="#D4A574"
          bgColor="#FFFFFF"
          border="2px solid #FFE69C"
          headline="Protect Your LLC With an Operating Agreement."
          description="We draft a professional operating agreement tailored to your business structure and ownership."
          visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/simple-minimalist-icon-illustration-of-a-4f94828a-20251205215248.jpg" />

      </div>
    </div>);

}

// Bookkeeping Tab
function BookkeepingTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {/* Track Transactions */}
      <BookkeepingCard
        categoryLabel="Track Your Transactions"
        categoryColor="#5B8DEE"
        bgColor="#F0F4FF"
        headline="Track, Categorize, and Monitor All Your Financial Transactions in One Place."
        description="Stay up to date with real-time insights and keep your records clean. Never miss a transaction."
        visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/modern-financial-transaction-dashboard-m-1fdf93cf-20251205215249.jpg" />


      {/* Send Invoices */}
      <BookkeepingCard
        categoryLabel="Send Invoices"
        categoryColor="#5B8DEE"
        bgColor="#FFFFFF"
        border="2px solid #5B8DEE"
        headline="Create and Send Professional Invoices in Seconds."
        description="Impress clients and get paid faster with branded invoices that look professional and are easy to send."
        visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/simple-minimalist-invoice-document-icon--7acf3a4b-20251205215248.jpg" />


      {/* Dedicated Bookkeeper */}
      <div className="md:col-span-2">
        <BookkeepingCard
          categoryLabel="Dedicated Bookkeeper"
          categoryColor="#5B8DEE"
          bgColor="#F0F4FF"
          headline="A Dedicated Bookkeeper Who Knows Your Business."
          description="Say goodbye to late nights with spreadsheets. With expert bookkeeping support, you'll always know where your money stands."
          visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/modern-vector-illustration-of-a-dedicate-37768e05-20251205215249.jpg" />

      </div>
    </div>);

}

// Taxes Tab
function TaxesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {/* Annual State Tax Filings */}
      <TaxCard
        categoryLabel="Annual State Tax Filings"
        categoryColor="#4CAF50"
        bgColor="#E8F5E9"
        headline="Stay Compliant With Hassle-Free Annual State Tax Filings."
        description="We handle your yearly state tax filings on time and with accuracy, so you can avoid penalties and focus on running your business."
        visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/clean-tax-filing-dashboard-interface-moc-1a95b7cb-20251205215249.jpg" />


      {/* Business IRS Tax Filings */}
      <TaxCard
        categoryLabel="Business IRS Tax Filings"
        categoryColor="#4CAF50"
        bgColor="#E8F5E9"
        headline="Accurate & On-Time Business IRS Tax Filings."
        description="Never worry about penalties or missed deadlines—Prolify manages your filings end-to-end with accuracy and ease."
        visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/playful-modern-vector-illustration-of-ta-28a36ac4-20251205215249.jpg" />


      {/* CPA Consultation */}
      <div className="md:col-span-2 lg:col-span-1">
        <TaxCard
          categoryLabel="Licensed Tax Professional Consultation"
          categoryColor="#4CAF50"
          bgColor="#FFFFFF"
          border="2px solid #81C784"
          headline="Personalized CPA Experts to Navigate Your Taxes."
          description="Get answers to your tax questions, review your financial strategies, and plan ahead with licensed professionals."
          visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/simple-minimalist-icon-of-a-professional-8e0fe864-20251205215249.jpg" />

      </div>
    </div>);

}

// Analytics Tab
function AnalyticsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {/* E-Commerce Dashboard */}
      <AnalyticsCard
        categoryLabel="E-Commerce Analytics"
        categoryColor="#E91E63"
        bgColor="#FFF0F5"
        headline="Powerful Business Insights Made Simple."
        description="Track sales, monitor orders, and understand your financial metrics in one unified dashboard."
        visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/modern-e-commerce-analytics-dashboard-mo-3fa38e7c-20251205215249.jpg" />


      {/* Platform Integrations */}
      <AnalyticsCard
        categoryLabel="Platform Integrations"
        categoryColor="#E91E63"
        bgColor="#FFF0F5"
        headline="Connect Shopify, Amazon, and More—All in One Place."
        description="Sync your sales channels automatically and see your complete business performance without switching platforms."
        visual="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/71eed71d-1e0c-4248-b7b3-cafb65a01c60/generated_images/modern-vector-illustration-showing-platf-2ee9a37c-20251205215249.jpg" />

    </div>);

}

// Generic Service Card Component
interface ServiceCardProps {
  icon: string;
  category: string;
  bgColor: string;
  headline: string;
  description: string;
  cta: string;
  visual?: string;
}

function ServiceCard({ icon, category, bgColor, headline, description, cta, visual }: ServiceCardProps) {
  return (
    <div
      className="rounded-[20px] p-10 min-h-[400px] flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: bgColor }}>

      <div className="text-2xl mb-3">{icon}</div>
      <p className="text-xs uppercase font-semibold mb-4" style={{ color: bgColor === "#FFF9E6" ? "#D4A574" : "#666666" }}>
        {category}
      </p>
      <h3 className="text-[28px] lg:text-[32px] font-bold leading-[1.2] text-black mb-4">{headline}</h3>
      <p className="text-base leading-[1.6] text-[#333333] mb-6">{description}</p>
      {visual &&
      <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden">
          <Image src={visual} alt={category} fill className="object-cover" />
        </div>
      }
      <button className="inline-flex items-center gap-2 text-base font-medium text-black group mt-auto">
        {cta}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>);

}

// Formation Card Component
interface FormationCardProps {
  categoryLabel: string;
  categoryColor: string;
  bgColor: string;
  headline: string;
  description: string;
  visual?: string;
  border?: string;
}

function FormationCard({ categoryLabel, categoryColor, bgColor, headline, description, visual, border }: FormationCardProps) {
  return (
    <div
      className="rounded-[20px] p-10 min-h-[400px] flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: bgColor, border: border || "none" }}>

      <p className="text-xs uppercase font-semibold mb-4" style={{ color: categoryColor }}>
        {categoryLabel}
      </p>
      <h3 className="text-[28px] lg:text-[32px] font-bold leading-[1.2] text-black mb-4">{headline}</h3>
      <p className="text-base leading-[1.6] text-[#333333] mb-6">{description}</p>
      {visual &&
      <div className="relative w-full h-48 mt-auto rounded-xl overflow-hidden">
          <Image src={visual} alt={categoryLabel} fill className="object-cover" />
        </div>
      }
    </div>);

}

// Bookkeeping Card Component
function BookkeepingCard({ categoryLabel, categoryColor, bgColor, headline, description, visual, border }: FormationCardProps) {
  return (
    <div
      className="rounded-[20px] p-10 min-h-[400px] flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: bgColor, border: border || "none" }}>

      <p className="text-xs uppercase font-semibold mb-4" style={{ color: categoryColor }}>
        {categoryLabel}
      </p>
      <h3 className="text-[28px] lg:text-[32px] font-bold leading-[1.2] text-black mb-4">{headline}</h3>
      <p className="text-base leading-[1.6] text-[#333333] mb-6">{description}</p>
      {visual &&
      <div className="relative w-full h-48 mt-auto rounded-xl overflow-hidden">
          <Image src={visual} alt={categoryLabel} fill className="object-cover" />
        </div>
      }
    </div>);

}

// Tax Card Component
function TaxCard({ categoryLabel, categoryColor, bgColor, headline, description, visual, border }: FormationCardProps) {
  return (
    <div
      className="rounded-[20px] p-10 min-h-[400px] flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: bgColor, border: border || "none" }}>

      <p className="text-xs uppercase font-semibold mb-4" style={{ color: categoryColor }}>
        {categoryLabel}
      </p>
      <h3 className="text-[28px] lg:text-[32px] font-bold leading-[1.2] text-black mb-4">{headline}</h3>
      <p className="text-base leading-[1.6] text-[#333333] mb-6">{description}</p>
      {visual &&
      <div className="relative w-full h-48 mt-auto rounded-xl overflow-hidden">
          <Image src={visual} alt={categoryLabel} fill className="object-cover" />
        </div>
      }
    </div>);

}

// Analytics Card Component
function AnalyticsCard({ categoryLabel, categoryColor, bgColor, headline, description, visual }: FormationCardProps) {
  return (
    <div
      className="rounded-[20px] p-10 min-h-[400px] flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: bgColor }}>

      <p className="text-xs uppercase font-semibold mb-4" style={{ color: categoryColor }}>
        {categoryLabel}
      </p>
      <h3 className="text-[28px] lg:text-[32px] font-bold leading-[1.2] text-black mb-4">{headline}</h3>
      <p className="text-base leading-[1.6] text-[#333333] mb-6">{description}</p>
      {visual &&
      <div className="relative w-full h-48 mt-auto rounded-xl overflow-hidden">
          <Image src={visual} alt={categoryLabel} fill className="object-cover" />
        </div>
      }
    </div>);

}

export default IntegrationsSection;