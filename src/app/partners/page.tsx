import PartnersHero from "@/components/sections/partners/PartnersHero";
import PartnerTestimonials from "@/components/sections/partners/PartnerTestimonials";
import EarningsCalculator from "@/components/sections/partners/EarningsCalculator";
import ComparisonTable from "@/components/sections/partners/ComparisonTable";
import PartnerHowItWorks from "@/components/sections/partners/PartnerHowItWorks";
import PartnerApplication from "@/components/sections/partners/PartnerApplication";
import PartnerFAQ from "@/components/sections/partners/PartnerFAQ";
import PartnerCTA from "@/components/sections/partners/PartnerCTA";

export default function PartnersPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <PartnersHero />
      <PartnerTestimonials />
      <EarningsCalculator />
      <ComparisonTable />
      <PartnerHowItWorks />
      <PartnerApplication />
      <PartnerFAQ />
      <PartnerCTA />
    </main>
  );
}
