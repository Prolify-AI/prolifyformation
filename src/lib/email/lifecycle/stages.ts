import type { LifecycleStage } from "./types";

export const FINAL_LIFECYCLE_STAGES: Array<{
  key: LifecycleStage;
  definition: string;
  entryTrigger: string;
  keyMetrics: string[];
}> = [
  {
    key: "visitor_lead",
    definition: "Known email, no account.",
    entryTrigger: "newsletter signup or lead magnet download",
    keyMetrics: ["lead volume", "conversion to account"],
  },
  {
    key: "free_account_user",
    definition: "Account created, no payment.",
    entryTrigger: "account_created",
    keyMetrics: ["activation rate", "time to first payment"],
  },
  {
    key: "activated_user",
    definition: "Profile complete, email verified, exploring.",
    entryTrigger: "profile_completed + email_verified",
    keyMetrics: ["checkout start rate"],
  },
  {
    key: "paying_user",
    definition: "Payment made for any service.",
    entryTrigger: "plan_purchased",
    keyMetrics: ["revenue", "service completion rate"],
  },
  {
    key: "formation_customer",
    definition: "In active formation process.",
    entryTrigger: "formation_order_placed",
    keyMetrics: ["formation completion rate", "time to approval"],
  },
  {
    key: "compliance_subscriber",
    definition: "Paying for registered agent and/or compliance.",
    entryTrigger: "registered_agent_activated",
    keyMetrics: ["retention rate", "compliance filing rate"],
  },
  {
    key: "bookkeeping_tax_customer",
    definition: "Using financial services.",
    entryTrigger: "bookkeeping_onboarding_started",
    keyMetrics: ["MRR", "service utilization"],
  },
  {
    key: "at_risk_customer",
    definition: "Churn signals detected.",
    entryTrigger: "missed payments, ignored deadlines, 60+ days dormant",
    keyMetrics: ["churn prevention rate"],
  },
  {
    key: "canceled_customer",
    definition: "Voluntary or involuntary churn.",
    entryTrigger: "subscription_canceled",
    keyMetrics: ["win-back rate"],
  },
  {
    key: "reactivated_customer",
    definition: "Returned from canceled state.",
    entryTrigger: "subscription_reactivated",
    keyMetrics: ["second-term retention"],
  },
  {
    key: "advocate",
    definition: "Highly engaged, refers others.",
    entryTrigger: "referral submitted, review posted, NPS 9-10",
    keyMetrics: ["referral conversion rate", "NPS"],
  },
];
