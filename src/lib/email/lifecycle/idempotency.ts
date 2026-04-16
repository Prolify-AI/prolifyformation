import { createClient } from "@supabase/supabase-js";

type LifecycleLogStatus = "processing" | "sent" | "failed" | "skipped_duplicate";

type LogPayload = {
  idempotencyKey: string;
  eventKey: string;
  templateId: string;
  recipient: string;
  status: LifecycleLogStatus;
  providerMessageId?: string | null;
  errorMessage?: string | null;
  metadata?: Record<string, unknown> | null;
};

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) return null;
  return createClient(url, serviceRole);
}

function isMissingTableError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    String((error as { message?: string }).message || "").toLowerCase().includes("does not exist")
  );
}

function isInvalidApiKeyError(error: unknown): boolean {
  const message = typeof error === "object" && error !== null && "message" in error ? String((error as { message?: string }).message || "") : "";
  return message.toLowerCase().includes("invalid api key") || message.toLowerCase().includes("unauthorized");
}

export async function tryBeginLifecycleSend(payload: Omit<LogPayload, "status">) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { mode: "disabled" as const };

  try {
    const { error } = await supabase.from("lifecycle_email_events").insert({
      idempotency_key: payload.idempotencyKey,
      event_key: payload.eventKey,
      template_id: payload.templateId,
      recipient: payload.recipient,
      status: "processing",
      metadata: payload.metadata ?? {},
    });

    if (!error) {
      return { mode: "active" as const, duplicate: false };
    }

    if (error.code === "23505") {
      return { mode: "active" as const, duplicate: true };
    }

    if (isMissingTableError(error) || isInvalidApiKeyError(error)) {
      return { mode: "disabled" as const };
    }

    throw new Error(`Idempotency init failed: ${error.message}`);
  } catch (e) {
    // Fail-open: never block email sending for idempotency/logging issues.
    if (isInvalidApiKeyError(e) || isMissingTableError(e)) {
      return { mode: "disabled" as const };
    }
    return { mode: "disabled" as const };
  }
}

export async function updateLifecycleSendStatus(payload: LogPayload) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from("lifecycle_email_events")
      .update({
        status: payload.status,
        provider_message_id: payload.providerMessageId ?? null,
        error_message: payload.errorMessage ?? null,
        metadata: payload.metadata ?? {},
        updated_at: new Date().toISOString(),
      })
      .eq("idempotency_key", payload.idempotencyKey);

    if (error && !isMissingTableError(error) && !isInvalidApiKeyError(error)) {
      // Fail-open as well.
      return;
    }
  } catch {
    // Fail-open: status logging should not block sending.
    return;
  }
}
