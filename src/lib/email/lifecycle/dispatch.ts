import { getLifecycleTemplate } from "@/lib/email/templates/lifecycle-catalog";
import { buildRenderedTemplate } from "@/lib/email/templates/render";
import { sendSmtpMail } from "@/lib/email/smtp";
import type { TemplateVariables } from "@/lib/email/templates/types";

export type LifecycleEventKey =
  | "signup_welcome"
  | "formation_order_confirmed"
  | "formation_submitted"
  | "ein_received"
  | "payment_failed";

const EVENT_TEMPLATE_MAP: Record<LifecycleEventKey, string> = {
  signup_welcome: "ONB-01",
  formation_order_confirmed: "FRM-01",
  formation_submitted: "FRM-03",
  ein_received: "EIN-03",
  payment_failed: "BIL-02",
};

type SendLifecycleTemplateParams = {
  to: string;
  templateId: string;
  variables?: TemplateVariables;
};

export async function sendLifecycleTemplateEmail(params: SendLifecycleTemplateParams) {
  const template = getLifecycleTemplate(params.templateId);
  if (!template) {
    throw new Error(`Template not found: ${params.templateId}`);
  }

  const rendered = buildRenderedTemplate(template, params.variables ?? {});
  return sendSmtpMail({
    to: params.to,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
    from: rendered.from,
    replyTo: rendered.replyTo,
  });
}

type SendLifecycleEventParams = {
  to: string;
  event: LifecycleEventKey;
  variables?: TemplateVariables;
};

export async function sendLifecycleEmailByEvent(params: SendLifecycleEventParams) {
  const templateId = EVENT_TEMPLATE_MAP[params.event];
  return sendLifecycleTemplateEmail({
    to: params.to,
    templateId,
    variables: params.variables,
  });
}
