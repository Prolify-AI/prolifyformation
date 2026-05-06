export type LifecycleStage =
  | "visitor_lead"
  | "free_account_user"
  | "activated_user"
  | "paying_user"
  | "formation_customer"
  | "compliance_subscriber"
  | "bookkeeping_tax_customer"
  | "at_risk_customer"
  | "canceled_customer"
  | "reactivated_customer"
  | "advocate";

export type EmailType = "transactional" | "lifecycle" | "promotional";
export type Priority = "MVP" | "Phase 2" | "Phase 3";

export type SenderProfile =
  | "foundersuccess"
  | "compliance"
  | "billing"
  | "support"
  | "hello";

export type LifecycleEmailDefinition = {
  id: string;
  name: string;
  trigger: string;
  audience: string;
  purpose: string;
  timing: string;
  cta: string;
  owner: "Engineering" | "Growth" | "Product" | "Compliance" | "Billing" | "Support" | "Retention" | "Onboarding";
  kpi: string;
  type: EmailType;
  priority: Priority;
  sender: SenderProfile;
};

export type SegmentDefinition = {
  name: string;
  criteria: string;
  purpose: string;
};

export type EventDefinition = {
  name: string;
  category:
    | "account_auth"
    | "onboarding_activation"
    | "checkout_monetization"
    | "formation_service_delivery"
    | "compliance_ongoing"
    | "banking_financial"
    | "bookkeeping_tax"
    | "support_engagement_edge";
  description: string;
};
