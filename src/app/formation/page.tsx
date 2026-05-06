import FormationHero from "@/components/sections/formation-hero";
import FormationServices from "@/components/sections/formation-services";
import FormationProcess from "@/components/sections/formation-process";
import ResourcesGuides from "@/components/sections/resources-guides";

export default function FormationPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <FormationHero />
      <FormationServices />
      <FormationProcess />
      <ResourcesGuides />
    </main>
  );
}