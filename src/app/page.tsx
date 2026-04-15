"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import dynamicImport from "next/dynamic";

export const dynamic = 'force-dynamic';

const Hero = dynamicImport(() => import("@/components/sections/hero"));
const ChooseYourPath = dynamicImport(() => import("@/components/sections/choose-your-path"));
const WhyProlify = dynamicImport(() => import("@/components/sections/why-prolify"));
const ProlifyPricing = dynamicImport(() => import("@/components/sections/prolify-pricing"));
const Features = dynamicImport(() => import("@/components/sections/features"));
const Integrations = dynamicImport(() => import("@/components/sections/integrations"));
const BusinessTools = dynamicImport(() => import("@/components/sections/business-tools"));
const FAQ = dynamicImport(() => import("@/components/sections/faq"));

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFC107]/30 via-white to-white dark:from-[#FFD54F]/20 dark:via-[#0a0a0a] dark:to-[#0a0a0a] pointer-events-none"></div>
      <div className="relative z-10">
        <main className="flex-grow">
          <Hero />
          <Integrations />
          <ChooseYourPath />
          <WhyProlify />
          <ProlifyPricing />
          <Features />
          <BusinessTools />
          <FAQ />
        </main>
      </div>
    </div>
  );
}