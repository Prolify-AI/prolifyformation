import type { SegmentDefinition } from "./types";

export const HUBSPOT_PRIMARY_SEGMENTS: SegmentDefinition[] = [
  {
    name: "Free Users - Profile Incomplete",
    criteria: "account_status = Free AND onboarding_status = Not Started",
    purpose: "Onboarding nudges",
  },
  {
    name: "Free Users - Activated",
    criteria: "account_status = Free AND onboarding_status = Complete",
    purpose: "Conversion campaigns",
  },
  {
    name: "Formation In Progress",
    criteria: "formation_status = Submitted AND formation_approved = false",
    purpose: "Formation status updates",
  },
  {
    name: "EIN Pending",
    criteria: "ein_status = Pending",
    purpose: "EIN journey emails",
  },
  {
    name: "Compliance Active",
    criteria: "registered_agent_status = Active AND payment_status = Active",
    purpose: "Compliance reminders",
  },
  {
    name: "Annual Report Due Soon",
    criteria: "annual_report_due_date within next 60 days AND annual_report_status != Filed",
    purpose: "Compliance countdown",
  },
  {
    name: "Payment Past Due",
    criteria: "payment_status = Past Due",
    purpose: "Dunning sequence",
  },
  {
    name: "At Risk - Dormant",
    criteria: "last_login_date > 60 days ago AND account_status = Active",
    purpose: "Re-engagement",
  },
  {
    name: "Canceled - Win-back Eligible",
    criteria: "account_status = Churned AND cancellation_date > 30 days ago AND cancellation_date < 180 days ago",
    purpose: "Win-back campaigns",
  },
  {
    name: "Bookkeeping Eligible",
    criteria: "compliance_active = true AND days_since_formation > 90 AND bookkeeping_status = null",
    purpose: "Upsell campaigns",
  },
  {
    name: "Non-US Founders",
    criteria: "country_of_residence != US",
    purpose: "Localized content and banking guidance",
  },
  {
    name: "LLC Founders",
    criteria: "entity_type = LLC",
    purpose: "Entity-specific compliance content",
  },
  {
    name: "C-Corp Founders",
    criteria: "entity_type = C-Corp",
    purpose: "Entity-specific compliance content",
  },
];
