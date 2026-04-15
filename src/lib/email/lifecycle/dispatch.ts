import { getLifecycleTemplate } from "@/lib/email/templates/lifecycle-catalog";
import { buildRenderedTemplate } from "@/lib/email/templates/render";
import { sendSmtpMail } from "@/lib/email/smtp";
import type { TemplateVariables } from "@/lib/email/templates/types";
import {
  tryBeginLifecycleSend,
  updateLifecycleSendStatus,
} from "@/lib/email/lifecycle/idempotency";

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
  eventKey?: LifecycleEventKey | string;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
  variables?: TemplateVariables;
};

export async function sendLifecycleTemplateEmail(params: SendLifecycleTemplateParams) {
  const template = getLifecycleTemplate(params.templateId);
  if (!template) {
    throw new Error(`Template not found: ${params.templateId}`);
  }

  const normalizedRecipient = String(params.to).toLowerCase().trim();
  const eventKey = params.eventKey ?? params.templateId;
  const idempotencyKey =
    params.idempotencyKey ??
    `lifecycle:${String(eventKey)}:${params.templateId}:${normalizedRecipient}`;

  const lock = await tryBeginLifecycleSend({
    idempotencyKey,
    eventKey: String(eventKey),
    templateId: params.templateId,
    recipient: normalizedRecipient,
    metadata: params.metadata ?? {},
  });

  if (lock.mode === "active" && lock.duplicate) {
    return { skipped: true, reason: "duplicate_idempotency_key", idempotencyKey };
  }

  const rendered = buildRenderedTemplate(template, params.variables ?? {});

  try {
    const result = await sendSmtpMail({
      to: normalizedRecipient,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
      from: rendered.from,
      replyTo: rendered.replyTo,
    });

    if (lock.mode === "active") {
      await updateLifecycleSendStatus({
        idempotencyKey,
        eventKey: String(eventKey),
        templateId: params.templateId,
        recipient: normalizedRecipient,
        status: "sent",
        providerMessageId: result.messageId ?? null,
        metadata: params.metadata ?? {},
      });
    }

    return { ...result, idempotencyKey };
  } catch (error) {
    if (lock.mode === "active") {
      await updateLifecycleSendStatus({
        idempotencyKey,
        eventKey: String(eventKey),
        templateId: params.templateId,
        recipient: normalizedRecipient,
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "SMTP send failed",
        metadata: params.metadata ?? {},
      });
    }
    throw error;
  }
}

type SendLifecycleEventParams = {
  to: string;
  event: LifecycleEventKey;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
  variables?: TemplateVariables;
};

export async function sendLifecycleEmailByEvent(params: SendLifecycleEventParams) {
  const templateId = EVENT_TEMPLATE_MAP[params.event];
  const normalizedRecipient = String(params.to).toLowerCase().trim();
  const idempotencyKey =
    params.idempotencyKey ?? `lifecycle:${params.event}:${templateId}:${normalizedRecipient}`;

  return sendLifecycleTemplateEmail({
    to: normalizedRecipient,
    templateId,
    eventKey: params.event,
    idempotencyKey,
    metadata: params.metadata ?? {},
    variables: params.variables,
  });
}
