import type { SenderProfile } from "@/lib/email/lifecycle/types";

export type LifecycleTemplate = {
  id: string;
  subject: string;
  preheader: string;
  body: string;
  ctaLabel?: string;
  ctaUrlVar?: string;
  sender?: SenderProfile;
  textOnly?: boolean;
};

export type TemplateVariables = Record<string, string | number | undefined | null>;
