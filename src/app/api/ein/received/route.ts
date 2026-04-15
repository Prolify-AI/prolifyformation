import { NextRequest, NextResponse } from "next/server";
import { sendLifecycleEmailByEvent } from "@/lib/email/lifecycle/dispatch";

function isAuthorized(request: NextRequest): boolean {
  const configuredKey = process.env.INTERNAL_API_KEY;
  if (!configuredKey) {
    return process.env.NODE_ENV !== "production";
  }
  return request.headers.get("x-internal-api-key") === configuredKey;
}

function getFirstName(fullName: string | undefined, fallbackEmail: string): string {
  const trimmed = String(fullName || "").trim();
  if (trimmed) return trimmed.split(" ")[0] || "Founder";
  return fallbackEmail.split("@")[0] || "Founder";
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, fullName, companyName, bankingUrl, eventId } = body ?? {};

    if (!email) {
      return NextResponse.json({ error: "Missing required field: email" }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const idempotencyKey = String(
      eventId || `ein-received:${normalizedEmail}:${String(companyName || "company").toLowerCase()}`
    );

    const result = await sendLifecycleEmailByEvent({
      to: normalizedEmail,
      event: "ein_received",
      idempotencyKey,
      metadata: {
        source: "api/ein/received",
      },
      variables: {
        first_name: getFirstName(fullName, normalizedEmail),
        company_name: companyName || "your company",
        banking_url: bankingUrl || `${request.nextUrl.origin}/dashboard`,
        cta_url: bankingUrl || `${request.nextUrl.origin}/dashboard`,
      },
    });

    return NextResponse.json({ success: true, event: "ein_received", result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send EIN received email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
