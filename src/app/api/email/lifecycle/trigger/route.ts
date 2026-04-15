import { NextRequest, NextResponse } from "next/server";
import {
  sendLifecycleEmailByEvent,
  type LifecycleEventKey,
} from "@/lib/email/lifecycle/dispatch";

function isAuthorized(request: NextRequest): boolean {
  const configuredKey = process.env.INTERNAL_API_KEY;
  if (!configuredKey) {
    return process.env.NODE_ENV !== "production";
  }
  return request.headers.get("x-internal-api-key") === configuredKey;
}

function isLifecycleEventKey(value: string): value is LifecycleEventKey {
  return (
    value === "signup_welcome" ||
    value === "formation_order_confirmed" ||
    value === "formation_submitted" ||
    value === "ein_received" ||
    value === "payment_failed"
  );
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { to, event, variables, idempotencyKey, metadata } = body ?? {};

    if (!to || !event) {
      return NextResponse.json({ error: "Missing required fields: to and event" }, { status: 400 });
    }

    if (!isLifecycleEventKey(String(event))) {
      return NextResponse.json(
        {
          error:
            "Unknown event. Allowed: signup_welcome, formation_order_confirmed, formation_submitted, ein_received, payment_failed",
        },
        { status: 400 }
      );
    }

    const result = await sendLifecycleEmailByEvent({
      to: String(to),
      event: event as LifecycleEventKey,
      idempotencyKey: idempotencyKey ? String(idempotencyKey) : undefined,
      metadata: metadata ?? {},
      variables: variables ?? {},
    });

    return NextResponse.json({ success: true, event, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to trigger lifecycle email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
