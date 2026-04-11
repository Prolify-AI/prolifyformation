export type PlanCategory = "formation" | "management";

export type FormationPlan = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  billing: "one-time";
  icon: string;
  coreFeatures: string[];
  notIncluded?: string[];
  additionalFeatures?: string;
  popular?: boolean;
  processingSpeed: string;
  support: string;
};

export type ManagementPlan = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  billing: "monthly";
  icon: string;
  coreFeatures: string[];
  notIncluded?: string[];
  additionalFeatures?: string;
  popular?: boolean;
  support: string;
};

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  billing: "annual" | "monthly" | "one-time";
  icon: string;
  coreFeatures: string[];
  additionalFeatures?: string;
  popular?: boolean;
};

export const formationPlans: FormationPlan[] = [
  {
    id: "formation-starter",
    name: "Starter",
    tagline: "US founders wanting the essentials done right",
    description: "Full service filing with essential formation services",
    price: 149,
    billing: "one-time",
    icon: "rocket",
    coreFeatures: [
      "Full Service LLC/Corp Filing",
      "Standard processing speed",
      "Email support",
    ],
    notIncluded: [
      "Registered Agent (add-on: $129/yr)",
      "EIN filing (add-on: $79)",
      "BOI / CTA filing (add-on: $99)",
      "Business Address",
      "Operating Agreement",
    ],
    processingSpeed: "Standard",
    support: "Email Support",
  },
  {
    id: "formation-growth",
    name: "Growth",
    tagline: "Serious founders wanting a complete launch",
    description: "Complete formation package with registered agent and compliance",
    price: 299,
    billing: "one-time",
    icon: "zap",
    coreFeatures: [
      "Full Service LLC/Corp Filing",
      "Registered Agent included (1 year)",
      "EIN included (with SSN)",
      "BOI / CTA Filing included",
      "Operating Agreement template",
      "Standard processing (5-7 days)",
      "Priority Email + Chat support",
    ],
    additionalFeatures: "Everything in Starter +",
    popular: true,
    processingSpeed: "Standard (5-7 days)",
    support: "Priority Email + Chat",
  },
  {
    id: "formation-elite",
    name: "Elite",
    tagline: "International founders & premium needs",
    description: "Rush processing with business address and premium support",
    price: 499,
    billing: "one-time",
    icon: "crown",
    coreFeatures: [
      "Full Service LLC/Corp Filing (Rush)",
      "Registered Agent included (1 year)",
      "EIN included (with or without SSN)",
      "BOI / CTA Filing included",
      "Business Address + Mail Scanning",
      "Operating Agreement template",
      "Rush processing (1-2 days)",
      "Dedicated Onboarding Call",
    ],
    additionalFeatures: "Everything in Growth +",
    processingSpeed: "Rush (1-2 days)",
    support: "Dedicated Onboarding Call",
  },
];

export const managementPlans: ManagementPlan[] = [
  {
    id: "management-starter",
    name: "Starter",
    tagline: "Solo founders with early revenue",
    description: "Self-serve bookkeeping with bank connection and basic AI tools",
    priceMonthly: 49,
    priceAnnual: 39,
    billing: "monthly",
    icon: "rocket",
    coreFeatures: [
      "Self-serve bookkeeping (bank connection)",
      "2 AI Copilots (50 queries/mo)",
      "Tax calendar & checklists",
      "Document vault (25 docs)",
      "Basic bank integration",
      "Email support (48hr)",
      "Browse Marketplace",
    ],
    notIncluded: [
      "Mentorship (pay-per-session)",
    ],
    support: "Email (48hr)",
  },
  {
    id: "management-growth",
    name: "Growth",
    tagline: "Growing businesses ($10k+ rev/mo)",
    description: "Full software suite with AI-guided taxes and compliance workflows",
    priceMonthly: 149,
    priceAnnual: 119,
    billing: "monthly",
    icon: "zap",
    coreFeatures: [
      "Full bookkeeping software suite",
      "4 AI Copilots (300 queries/mo)",
      "AI-guided quarterly taxes",
      "Compliance filing workflows",
      "Group Office Hours mentorship",
      "Stripe, Shopify, PayPal integrations",
      "Email + Chat support (24hr)",
    ],
    additionalFeatures: "Everything in Starter +",
    popular: true,
    support: "Email + Chat (24hr)",
  },
  {
    id: "management-elite",
    name: "Elite",
    tagline: "Established companies needing full service",
    description: "Dedicated bookkeeper, managed compliance, and 1:1 mentorship",
    priceMonthly: 399,
    priceAnnual: 319,
    billing: "monthly",
    icon: "crown",
    coreFeatures: [
      "Dedicated Bookkeeper (done-for-you)",
      "All 6 AI Copilots (unlimited queries)",
      "Managed filing & annual taxes",
      "Managed compliance + alerts",
      "1:1 Mentorship (2x/mo)",
      "All integrations + custom",
      "Priority Phone & Chat support",
    ],
    additionalFeatures: "Everything in Growth +",
    support: "Priority Phone & Chat",
  },
];

export const plans: Plan[] = formationPlans.map((p) => ({
  id: p.id,
  name: p.name,
  tagline: p.tagline,
  description: p.description,
  price: p.price,
  billing: p.billing,
  icon: p.icon,
  coreFeatures: p.coreFeatures,
  additionalFeatures: p.additionalFeatures,
  popular: p.popular,
}));

export const getPlanById = (id: string): Plan | undefined => {
  return plans.find((plan) => plan.id === id);
};

export const getFormationPlanById = (id: string): FormationPlan | undefined => {
  return formationPlans.find((plan) => plan.id === id);
};

export const getManagementPlanById = (id: string): ManagementPlan | undefined => {
  return managementPlans.find((plan) => plan.id === id);
};
