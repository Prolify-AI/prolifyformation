export type MeetingRouteId =
  | "support"
  | "partner"
  | "saas"
  | "ecommerce"
  | "creator"
  | "formation"
  | "intro";

type MeetingRouteConfig = {
  id: MeetingRouteId;
  name: string;
  url: string;
  shortReason: string;
  topics: string[];
  tag: string;
};

export const MEETING_ROUTES: Record<MeetingRouteId, MeetingRouteConfig> = {
  support: {
    id: "support",
    name: "Existing Customer Support Call",
    url: "https://meetings.hubspot.com/prolify/existing-customer-support-compliance-help",
    shortReason: "existing Prolify customers who need help with their current service, filings, compliance, or account",
    topics: ["account help", "filings", "compliance", "existing service issues"],
    tag: "meeting_customer_support",
  },
  partner: {
    id: "partner",
    name: "Partner / Referral / Integration Call",
    url: "https://meetings.hubspot.com/prolify/partner-referral-integration-call",
    shortReason: "partnerships, referrals, integrations, and strategic collaboration",
    topics: ["referrals", "integrations", "agency partnerships", "collaboration"],
    tag: "meeting_partner_call",
  },
  saas: {
    id: "saas",
    name: "SaaS Founder Consultation",
    url: "https://meetings.hubspot.com/prolify/saas-founder-consultation",
    shortReason: "software founders who need the right U.S. setup for fundraising, payments, and growth",
    topics: ["Delaware C-Corp", "investor readiness", "Stripe", "startup structure"],
    tag: "meeting_saas_consultation",
  },
  ecommerce: {
    id: "ecommerce",
    name: "E-commerce / Amazon / Shopify Consultation",
    url: "https://meetings.hubspot.com/prolify/e-commerce-amazon-shopify-consultation",
    shortReason: "online sellers who need the right U.S. setup for e-commerce, payments, and operations",
    topics: ["Amazon FBA", "Shopify", "payments", "store setup"],
    tag: "meeting_ecommerce_consultation",
  },
  creator: {
    id: "creator",
    name: "Creator / Course / Newsletter / Coaching Consultation",
    url: "https://meetings.hubspot.com/prolify/creator-course-newsletter-coaching-consultation",
    shortReason: "creator-led businesses selling courses, coaching, consulting, newsletters, or digital products",
    topics: ["courses", "coaching", "digital products", "creator business setup"],
    tag: "meeting_creator_consultation",
  },
  formation: {
    id: "formation",
    name: "Formation Strategy Call",
    url: "https://meetings.hubspot.com/prolify/formation-strategy-call",
    shortReason: "founders who need clarity on structure, state selection, compliance, EIN, and setup planning",
    topics: ["LLC vs C-Corp", "Delaware vs Wyoming", "compliance", "banking readiness"],
    tag: "meeting_formation_strategy",
  },
  intro: {
    id: "intro",
    name: "Free Intro Call",
    url: "https://meetings.hubspot.com/prolify/free-intro-call",
    shortReason: "general questions, first-time visitors, and early-stage interest",
    topics: ["how Prolify works", "services overview", "next steps", "general questions"],
    tag: "meeting_intro_call",
  },
};

const PRIORITY_ORDER: MeetingRouteId[] = [
  "support",
  "partner",
  "saas",
  "ecommerce",
  "creator",
  "formation",
  "intro",
];

const ROUTE_PATTERNS: Record<MeetingRouteId, RegExp[]> = {
  support: [
    /\b(already a customer|existing customer|i'm a customer|i am a customer)\b/i,
    /\b(help with my account|help with my filing|help with my compliance)\b/i,
    /\b(current service|existing order|already handling|my case)\b/i,
    /\b(support|account issue|filing issue|compliance help)\b/i,
    /\b(client actuel|déjà client|je suis client|support client)\b/i,
  ],
  partner: [
    /\b(partner|partnership|collaborat|integration|integrate)\b/i,
    /\b(referral|affiliate|reseller|co-marketing)\b/i,
    /\b(accelerator|community|agency|law firm|accounting firm|incubator|platform)\b/i,
    /\b(partenariat|partenaire|affiliation|intégration)\b/i,
  ],
  saas: [
    /\b(saas|software company|software startup|tech startup|startup)\b/i,
    /\b(ai app|app builder|mobile app|web app)\b/i,
    /\b(venture|vc|investor|fundraising|raise funding|yc|y combinator|cap table)\b/i,
    /\b(stripe|delaware c-?corp|startup incorporation)\b/i,
  ],
  ecommerce: [
    /\b(e-?commerce|online store|shopify|amazon|amazon fba|fba|walmart marketplace)\b/i,
    /\b(tiktok shop|etsy|dropshipping|product-based)\b/i,
    /\b(sell products online|selling online)\b/i,
  ],
  creator: [
    /\b(creator|course|coaching|consulting|consultant|newsletter|digital products?)\b/i,
    /\b(kajabi|teachable|gumroad|beehiiv|substack|convertkit)\b/i,
    /\b(content business|knowledge business|membership)\b/i,
    /\b(coach|consultant|newsletter business)\b/i,
  ],
  formation: [
    /\b(llc|c-?corp|s-?corp|entity|business structure)\b/i,
    /\b(which state|delaware|wyoming|nevada|best state)\b/i,
    /\b(formation|form a company|register a company|incorporate)\b/i,
    /\b(ein|banking readiness|setup strategy|compliance direction)\b/i,
    /\b(non-us founder|u\.?s\.? setup)\b/i,
  ],
  intro: [
    /\b(what is prolify|how does prolify work|tell me more|learn more)\b/i,
    /\b(general questions|quick call|free intro|not sure what i need yet)\b/i,
    /\b(just exploring|first time|some questions before i decide)\b/i,
  ],
};

const MEETING_INTENT_PATTERNS = [
  /\b(talk to someone|talk to an advisor|speak to someone|speak with someone)\b/i,
  /\b(book|booking|book a call|book a meeting|schedule|consultation|consult)\b/i,
  /\b(call|demo|meeting|appointment|discovery call|intro call)\b/i,
  /\b(rd[vz]|rendez-vous|parler à quelqu'un|parler a quelqu'un|appel)\b/i,
];

const FRENCH_PATTERNS = [
  /\b(bonjour|merci|rendez-vous|appel|client|partenaire|créateur|formation|société|entreprise)\b/i,
  /\b(parler à quelqu'un|parler a quelqu'un|je suis|j'ai besoin)\b/i,
];

export function hasMeetingIntent(text: string): boolean {
  return MEETING_INTENT_PATTERNS.some((pattern) => pattern.test(text));
}

export function detectMeetingRoute(text: string): MeetingRouteId {
  const scores = new Map<MeetingRouteId, number>();

  for (const routeId of PRIORITY_ORDER) {
    const patterns = ROUTE_PATTERNS[routeId];
    let score = 0;

    for (const pattern of patterns) {
      if (pattern.test(text)) {
        score += 1;
      }
    }

    scores.set(routeId, score);
  }

  for (const routeId of PRIORITY_ORDER) {
    if ((scores.get(routeId) ?? 0) > 0) {
      return routeId;
    }
  }

  return "intro";
}

export function getMeetingRoute(routeId: MeetingRouteId): MeetingRouteConfig {
  return MEETING_ROUTES[routeId];
}

const SUPPORT_ESCALATION_PATTERNS = [
  /\b(already a customer|existing customer|i'm a customer|i am a customer)\b/i,
  /\b(help with my account|help with my filing|help with my compliance)\b/i,
  /\b(current service|existing order|already handling|my case)\b/i,
  /\b(support|account issue|filing issue|compliance help|not working|problem)\b/i,
  /\b(client actuel|déjà client|je suis client|support client)\b/i,
];

const PARTNER_INTENT_PATTERNS = [
  /\b(partner|partnership|collaborat|integration|integrate)\b/i,
  /\b(referral|affiliate|reseller|co-marketing)\b/i,
  /\b(partenariat|partenaire|affiliation|intégration)\b/i,
];

const CONSULT_SIGNAL_PATTERNS = [
  /\b(need help|need clarity|what is best|what's best|which one should i choose)\b/i,
  /\b(should i|can you help me choose|help me understand the setup)\b/i,
  /\b(i need help|i need guidance|i need advice|best setup)\b/i,
  /\b(j'ai besoin d'aide|aide-moi|quelle est la meilleure option)\b/i,
];

const CLEAR_SEGMENT_PATTERNS: Record<"saas" | "ecommerce" | "creator", RegExp[]> = {
  saas: [
    /\b(i am building|we are building|launching|starting)\b.*\b(saas|software company|software startup|tech startup|startup)\b/i,
    /\b(saas|software startup|tech startup)\b.*\b(fundraising|investor|venture|vc|delaware c-?corp|stripe)\b/i,
  ],
  ecommerce: [
    /\b(i sell|we sell|starting|launching|running)\b.*\b(amazon|amazon fba|shopify|e-?commerce|online store)\b/i,
    /\b(amazon|amazon fba|shopify|tiktok shop|etsy)\b.*\b(u\.?s\.? company|payments|store|selling)\b/i,
  ],
  creator: [
    /\b(i sell|i run|i have|we sell|we run)\b.*\b(courses?|coaching|newsletter|digital products?|consulting)\b/i,
    /\b(kajabi|teachable|gumroad|beehiiv|substack)\b.*\b(course|coaching|newsletter|creator|business)\b/i,
  ],
};

export function shouldAskMeetingClarification(text: string): boolean {
  if (!hasMeetingIntent(text)) {
    return false;
  }

  const route = detectMeetingRoute(text);
  return route === "intro" && !ROUTE_PATTERNS.intro.some((pattern) => pattern.test(text));
}

export function shouldRecommendMeeting(text: string): boolean {
  if (hasMeetingIntent(text)) {
    return true;
  }

  const route = detectMeetingRoute(text);
  if (route === "support" && SUPPORT_ESCALATION_PATTERNS.some((pattern) => pattern.test(text))) {
    return true;
  }

  if (route === "partner" && PARTNER_INTENT_PATTERNS.some((pattern) => pattern.test(text))) {
    return true;
  }

  if (
    (route === "saas" || route === "ecommerce" || route === "creator" || route === "formation") &&
    CONSULT_SIGNAL_PATTERNS.some((pattern) => pattern.test(text))
  ) {
    return true;
  }

  if (
    (route === "saas" || route === "ecommerce" || route === "creator") &&
    CLEAR_SEGMENT_PATTERNS[route].some((pattern) => pattern.test(text))
  ) {
    return true;
  }

  return false;
}

function detectLanguage(text: string): "en" | "fr" {
  return FRENCH_PATTERNS.some((pattern) => pattern.test(text)) ? "fr" : "en";
}

export function buildMeetingClarificationReply(text: string): string {
  const language = detectLanguage(text);

  if (language === "fr") {
    return [
      "Je peux te diriger vers le bon rendez-vous.",
      "Pour être sûr de t'envoyer vers la bonne page, tu cherches plutôt :",
      "1. des informations générales sur Prolify",
      "2. de l'aide pour choisir la bonne structure U.S.",
      "3. une consultation SaaS, e-commerce ou creator business",
      "4. un échange partenariat / referral / intégration",
      "5. de l'aide pour un service Prolify existant",
    ].join("\n");
  }

  return [
    "I can point you to the best call.",
    "To make sure I send you to the right booking page, are you looking for:",
    "1. general information about Prolify",
    "2. help choosing the right U.S. company setup",
    "3. a consultation for SaaS, e-commerce, or creator business",
    "4. a partnership conversation",
    "5. support for an existing Prolify service",
  ].join("\n");
}

export function buildMeetingRecommendationReply(text: string): string {
  const language = detectLanguage(text);
  const route = getMeetingRoute(detectMeetingRoute(text));

  if (language === "fr") {
    return [
      `D'apres ce que tu as partage, le meilleur prochain pas est de reserver un **${route.name}**.`,
      `Cette reunion est la plus adaptee pour ${route.shortReason}.`,
      "",
      `Tu peux reserver ici : ${route.url}`,
      "",
      `Sur cet appel, l'equipe peut t'aider avec : ${route.topics.join(", ")}.`,
    ].join("\n");
  }

  return [
    `Based on what you shared, the best next step is to book a **${route.name}**.`,
    `That meeting is the best fit for ${route.shortReason}.`,
    "",
    `You can book it here: ${route.url}`,
    "",
    `On that call, the team can help you with ${route.topics.join(", ")}.`,
  ].join("\n");
}

type MeetingAnalyticsAction = "recommended" | "cta_shown" | "link_clicked";

export function emitMeetingRouteAnalytics(
  routeId: MeetingRouteId,
  action: MeetingAnalyticsAction,
  source: string
): void {
  if (typeof window === "undefined") {
    return;
  }

  const route = getMeetingRoute(routeId);
  const payload = {
    event: "prolify_meeting_route",
    meeting_route_id: route.id,
    meeting_route_tag: route.tag,
    meeting_route_name: route.name,
    meeting_route_url: route.url,
    meeting_route_action: action,
    meeting_route_source: source,
  };

  const win = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  if (Array.isArray(win.dataLayer)) {
    win.dataLayer.push(payload);
  }

  window.dispatchEvent(
    new CustomEvent("prolify:meeting-route", {
      detail: payload,
    })
  );
}
