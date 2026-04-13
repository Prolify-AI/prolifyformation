import { formationPlans, managementPlans } from "@/lib/plans";
import { SERVICES, SERVICE_CATEGORIES, type Service } from "@/lib/services-catalog";
import { usStates } from "@/lib/us-states";

function formatUsd(value: number): string {
  return `$${value}`;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isFrenchQuery(query: string): boolean {
  return /\b(prix|tarif|tarifs|combien|co[uû]t|service|services|plan|plans|entreprise|soci[eé]t[eé])\b/i.test(
    query
  );
}

function getServicePriceLabel(service: Service): string {
  return `${formatUsd(service.price)}${service.recurringLabel ?? ""}`;
}

const FEATURED_SERVICE_IDS = [
  "business-formation",
  "registered-agent-service",
  "ein",
  "ein-non-us",
  "beneficial-ownership",
  "good-standing",
  "virtual-office-mail-scanning",
  "virtual-office-unlimited",
  "apostille",
];

const minStateFee = Math.min(...usStates.map((state) => state.fee));
const maxStateFee = Math.max(...usStates.map((state) => state.fee));
const wyomingFee = usStates.find((state) => state.code === "WY")?.fee ?? 103.75;
const delawareFee = usStates.find((state) => state.code === "DE")?.fee ?? 140;
const nevadaFee = usStates.find((state) => state.code === "NV")?.fee ?? 425;
const floridaFee = usStates.find((state) => state.code === "FL")?.fee ?? 125;
const californiaFee = usStates.find((state) => state.code === "CA")?.fee ?? 70;

export const AI_PLAN_PRICING_CONTEXT = `### Canonical Plan Pricing (source of truth from code)
Formation plans for new businesses (one-time, plus state fees):
${formationPlans
  .map(
    (plan) =>
      `- ${plan.name}: ${formatUsd(plan.price)} one-time + state fees - ${plan.description}`
  )
  .join("\n")}

Management plans for existing businesses:
${managementPlans
  .map(
    (plan) =>
      `- ${plan.name}: ${formatUsd(plan.priceMonthly)}/mo or ${formatUsd(plan.priceAnnual)}/mo billed annually - ${plan.description}`
  )
  .join("\n")}

Formation Starter add-ons:
- Registered Agent: $129/yr
- EIN filing: $79
- BOI / CTA filing: $99

State fee examples:
- Wyoming: ${formatUsd(wyomingFee)}
- Delaware: ${formatUsd(delawareFee)}
- Nevada: ${formatUsd(nevadaFee)}
- Florida: ${formatUsd(floridaFee)}
- California: ${formatUsd(californiaFee)}
- Supported state fee range: ${formatUsd(minStateFee)} to ${formatUsd(maxStateFee)}`;

export const AI_SERVICE_PRICING_CONTEXT = `### Canonical Service Pricing (source of truth from code)
${SERVICE_CATEGORIES.map((category) => {
  const services = SERVICES.filter((service) => service.category === category.id);
  if (services.length === 0) {
    return "";
  }

  return `${category.label}:\n${services
    .map((service) => `- ${service.name}: ${getServicePriceLabel(service)}`)
    .join("\n")}`;
})
  .filter(Boolean)
  .join("\n\n")}`;

export const AI_PRICING_CONTEXT = `${AI_PLAN_PRICING_CONTEXT}\n\n${AI_SERVICE_PRICING_CONTEXT}`;

function findMatchingServices(query: string, limit: number = 5): Service[] {
  const normalizedQuery = normalize(query);
  const queryTokens = new Set(normalizedQuery.split(" ").filter(Boolean));

  return SERVICES.map((service) => {
    const haystack = normalize(
      `${service.name} ${service.categoryLabel} ${service.description} ${service.raincServiceType}`
    );
    let score = 0;

    if (normalizedQuery.includes(normalize(service.name))) {
      score += 10;
    }
    if (normalizedQuery.includes(normalize(service.categoryLabel))) {
      score += 5;
    }

    for (const token of queryTokens) {
      if (token.length > 2 && haystack.includes(token)) {
        score += 1;
      }
    }

    return { service, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((entry) => entry.service);
}

function getFeaturedServices(): Service[] {
  return FEATURED_SERVICE_IDS.map((id) => SERVICES.find((service) => service.id === id)).filter(
    (service): service is Service => Boolean(service)
  );
}

function buildPlanPricingReply(query: string, french: boolean): string | null {
  const lower = query.toLowerCase();
  const talksAboutPlans =
    /\b(price|pricing|cost|costs|fee|fees|how much|prix|tarif|tarifs|combien)\b/i.test(query) &&
    /\b(plan|plans|starter|growth|elite|formation|management|new business|existing business|monthly|annual)\b/i.test(
      query
    );

  if (!talksAboutPlans) {
    return null;
  }

  const wantsFormation =
    /\b(formation|new business|llc|corp|c-corp|start a company|create a company)\b/i.test(lower);
  const wantsManagement =
    /\b(management|existing business|bookkeeping|monthly|annual|subscription)\b/i.test(lower);

  if (french) {
    if (wantsFormation && !wantsManagement) {
      return [
        "Voici les prix actuels des plans de formation Prolify :",
        ...formationPlans.map(
          (plan) =>
            `- ${plan.name}: ${formatUsd(plan.price)} en one-time + frais d'Etat`
        ),
      ].join("\n");
    }

    if (wantsManagement && !wantsFormation) {
      return [
        "Voici les prix actuels des plans de management Prolify :",
        ...managementPlans.map(
          (plan) =>
            `- ${plan.name}: ${formatUsd(plan.priceMonthly)}/mois ou ${formatUsd(plan.priceAnnual)}/mois en facturation annuelle`
        ),
      ].join("\n");
    }

    return [
      "Voici les prix actuels des plans Prolify :",
      "Plans de formation :",
      ...formationPlans.map(
        (plan) => `- ${plan.name}: ${formatUsd(plan.price)} en one-time + frais d'Etat`
      ),
      "",
      "Plans de management :",
      ...managementPlans.map(
        (plan) =>
          `- ${plan.name}: ${formatUsd(plan.priceMonthly)}/mois ou ${formatUsd(plan.priceAnnual)}/mois en annuel`
      ),
    ].join("\n");
  }

  if (wantsFormation && !wantsManagement) {
    return [
      "Here are Prolify's current formation plan prices:",
      ...formationPlans.map(
        (plan) => `- ${plan.name}: ${formatUsd(plan.price)} one-time + state fees`
      ),
    ].join("\n");
  }

  if (wantsManagement && !wantsFormation) {
    return [
      "Here are Prolify's current management plan prices:",
      ...managementPlans.map(
        (plan) =>
          `- ${plan.name}: ${formatUsd(plan.priceMonthly)}/mo or ${formatUsd(plan.priceAnnual)}/mo billed annually`
      ),
    ].join("\n");
  }

  return [
    "Here are Prolify's current plan prices:",
    "Formation plans:",
    ...formationPlans.map(
      (plan) => `- ${plan.name}: ${formatUsd(plan.price)} one-time + state fees`
    ),
    "",
    "Management plans:",
    ...managementPlans.map(
      (plan) =>
        `- ${plan.name}: ${formatUsd(plan.priceMonthly)}/mo or ${formatUsd(plan.priceAnnual)}/mo billed annually`
    ),
  ].join("\n");
}

function buildServicePricingReply(query: string, french: boolean): string | null {
  const asksAboutServicePricing =
    /\b(price|pricing|cost|costs|fee|fees|how much|service|services|prix|tarif|tarifs|combien)\b/i.test(
      query
    ) || findMatchingServices(query, 1).length > 0;

  if (!asksAboutServicePricing) {
    return null;
  }

  const matches = findMatchingServices(query, 5);
  const servicesToShow = matches.length > 0 ? matches : getFeaturedServices();

  if (french) {
    return [
      "Voici les prix trouves dans le catalogue de services Prolify :",
      ...servicesToShow.map(
        (service) => `- ${service.name}: ${getServicePriceLabel(service)}`
      ),
    ].join("\n");
  }

  return [
    "Here are the service prices I found in Prolify's service catalog:",
    ...servicesToShow.map(
      (service) => `- ${service.name}: ${getServicePriceLabel(service)}`
    ),
  ].join("\n");
}

export function buildPricingReply(query: string): string | null {
  const french = isFrenchQuery(query);
  const asksAboutPlanPricing =
    /\b(price|pricing|cost|costs|fee|fees|how much|prix|tarif|tarifs|combien)\b/i.test(query) &&
    /\b(plan|plans|starter|growth|elite|formation|management|monthly|annual|existing business|new business)\b/i.test(
      query
    );
  const asksAboutServicePricing =
    /\b(price|pricing|cost|costs|fee|fees|how much|service|services|prix|tarif|tarifs|combien)\b/i.test(
      query
    );

  if (asksAboutPlanPricing && asksAboutServicePricing) {
    const planReply = buildPlanPricingReply(query, french);
    const serviceReply = buildServicePricingReply(query, french);
    return [planReply, "", serviceReply].filter(Boolean).join("\n");
  }

  return buildPlanPricingReply(query, french) ?? buildServicePricingReply(query, french);
}
