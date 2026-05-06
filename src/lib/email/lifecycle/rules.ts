export const GLOBAL_FREQUENCY_RULES = {
  marketingPerDayMax: 1,
  marketingPerWeekMax: 3,
  transactionalExempt: true,
  categoryUnsubscribeRespected: true,
  criticalComplianceBypassMarketingUnsubscribe: true,
};

export const SEQUENCE_SUPPRESSION_RULES = [
  "If user is in Formation Status Journey, suppress all upsell and cross-sell emails.",
  "If user is in Dunning sequence, suppress all marketing and upsell emails.",
  "If user has open support ticket, suppress NPS and referral requests for 7 days after resolution.",
  "If user completed a purchase, suppress abandoned cart emails immediately.",
  "If user enters EIN sequence, suppress banking readiness until EIN received.",
];

export const SUNSET_POLICY = {
  marketingSuppressionAfterDaysNoOpenOrClick: 120,
  exceptions: [
    "Active paying customers continue receiving compliance lifecycle emails",
    "Users with upcoming compliance deadlines continue receiving compliance reminders regardless of engagement",
  ],
  reengagementAttemptBeforeSunset: "Dormancy Day 90 email",
};
