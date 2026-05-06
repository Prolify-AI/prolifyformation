import { FINAL_MASTER_EMAIL_MATRIX } from "@/lib/email/lifecycle";
import type { LifecycleTemplate } from "./types";

const CUSTOM_COPY: Record<string, Partial<LifecycleTemplate>> = {
  "ACC-01": {
    subject: "Verify your email to get started with Prolify",
    preheader: "Confirm your email address to access your dashboard.",
    body:
      "Hi {{first_name}},\n\nThank you for creating your Prolify account.\n\nTo get started, please verify your email address by clicking the button below. This confirms your identity and activates your dashboard.\n\nThis link will expire in 24 hours. If it expires, you can request a new one from the login page.\n\nIf you did not create this account, you can safely ignore this email.\n\nBest,\nThe Prolify Team",
    ctaLabel: "Verify My Email",
    ctaUrlVar: "verification_url",
    sender: "foundersuccess",
  },
  "ACC-02": {
    subject: "Reset your Prolify password",
    preheader: "Use this link to create a new password for your account.",
    body:
      "Hi {{first_name}},\n\nWe received a request to reset the password for your Prolify account.\n\nClick the button below to create a new password. This link will expire in 1 hour.\n\nIf you did not request this change, no action is needed.\n\nBest,\nThe Prolify Team",
    ctaLabel: "Reset My Password",
    ctaUrlVar: "reset_url",
    sender: "support",
  },
  "ONB-01": {
    subject: "Welcome to Prolify. Here is your next step.",
    preheader: "Everything you need to launch and manage your U.S. company, in one place.",
    body:
      "Hi {{first_name}},\n\nWelcome to Prolify.\n\nStarting a U.S. company as a non-US founder can feel complicated. We built Prolify to make it simple, compliant, and straightforward.\n\nTo get started, we need a few details about your business goals so we can recommend the right entity type and state.\n\nWe are here to help you build with confidence.",
    ctaLabel: "Complete Your Profile",
    ctaUrlVar: "profile_url",
    sender: "foundersuccess",
  },
  "FRM-01": {
    subject: "Your formation order is confirmed — here is what happens next",
    preheader: "Your order has been received. Here is your step-by-step roadmap.",
    body:
      "Hi {{first_name}},\n\nThank you for your order. We are now beginning the process of forming {{company_name}} as a {{entity_type}} in {{formation_state}}.\n\nOrder summary:\n- Plan: {{plan_name}}\n- Amount paid: {{order_amount}}\n- Order number: {{order_id}}\n\nWhat happens next:\n1) Upload your required documents\n2) We prepare and file with the state\n3) We email you at each milestone",
    ctaLabel: "Upload Required Documents",
    ctaUrlVar: "dashboard_url",
    sender: "compliance",
  },
  "EIN-03": {
    subject: "Great news: your EIN is ready",
    preheader: "{{company_name}} now has an EIN. Here is what to do next.",
    body:
      "Hi {{first_name}},\n\nYour Employer Identification Number (EIN) for {{company_name}} has been assigned by the IRS.\n\nYou can now open a U.S. bank account, accept payments, and complete tax setup.\n\nYour next step is banking setup.",
    ctaLabel: "Set Up U.S. Banking",
    ctaUrlVar: "banking_url",
    sender: "compliance",
  },
  "BOI-01": {
    subject: "Important: BOI filing required for {{company_name}}",
    preheader: "Most new U.S. companies are required to file a BOI report.",
    body:
      "Hi {{first_name}},\n\nNow that {{company_name}} has been formed, there is an important compliance step: filing your Beneficial Ownership Information (BOI) report.\n\nPlease complete this through your Prolify dashboard.\n\nIf you believe your company is exempt, reply and our compliance team will help.",
    ctaLabel: "File Your BOI Report",
    ctaUrlVar: "boi_url",
    sender: "compliance",
  },
  "BIL-02": {
    subject: "Action needed: your payment did not go through",
    preheader: "Please update your payment method to keep your services active.",
    body:
      "Hi {{first_name}},\n\nWe attempted to process your payment of {{payment_amount}} for your {{plan_name}} subscription, but the charge was not successful.\n\nPlease update your payment method to avoid service interruption.",
    ctaLabel: "Update Payment Method",
    ctaUrlVar: "billing_url",
    sender: "billing",
  },
  "EDG-01": {
    subject: "Finish setting up your Prolify account",
    preheader: "We noticed you have not verified your email yet.",
    body:
      "Hi {{first_name}},\n\nWe noticed you created a Prolify account but have not verified your email yet.\n\nIf you cannot find the original email, request a new verification link below.\n\nIf you need help, reply to this email and our team will assist.",
    ctaLabel: "Send New Verification Link",
    ctaUrlVar: "reverification_url",
    sender: "support",
    textOnly: true,
  },
};

export const LIFECYCLE_TEMPLATE_CATALOG: Record<string, LifecycleTemplate> = Object.fromEntries(
  FINAL_MASTER_EMAIL_MATRIX.map((row) => {
    const fallback: LifecycleTemplate = {
      id: row.id,
      subject: `${row.name} — Prolify`,
      preheader: row.purpose,
      body:
        `Hi {{first_name}},\n\n` +
        `${row.purpose}.\n\n` +
        `Timing: ${row.timing}\n` +
        `Trigger: ${row.trigger}\n\n` +
        `If you need help, reply to this email.`,
      ctaLabel: row.cta !== "None" ? row.cta : undefined,
      ctaUrlVar: row.cta !== "None" ? "cta_url" : undefined,
      sender: row.sender,
    };

    const merged = { ...fallback, ...(CUSTOM_COPY[row.id] ?? {}) };
    return [row.id, merged];
  })
);

export function getLifecycleTemplate(templateId: string): LifecycleTemplate | null {
  return LIFECYCLE_TEMPLATE_CATALOG[templateId] ?? null;
}
