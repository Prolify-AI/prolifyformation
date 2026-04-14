import { NextRequest, NextResponse } from "next/server";
import { sendLifecycleEmailByEvent } from "@/lib/email/lifecycle/dispatch";

function getFirstName(fullName: string | undefined, fallbackEmail: string): string {
  const trimmed = String(fullName || "").trim();
  if (trimmed) return trimmed.split(" ")[0] || "Founder";
  return fallbackEmail.split("@")[0] || "Founder";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, fullName } = body ?? {};

    if (!email) {
      return NextResponse.json({ error: "Missing required field: email" }, { status: 400 });
    }

    const requestedEmail = String(email).toLowerCase();
    if (!isValidEmail(requestedEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const baseUrl = request.nextUrl.origin;
    const result = await sendLifecycleEmailByEvent({
      to: requestedEmail,
      event: "signup_welcome",
      variables: {
      first_name: getFirstName(fullName, requestedEmail),
      profile_url: `${baseUrl}/dashboard`,
      cta_url: `${baseUrl}/dashboard`,
      company_name: "Prolify",
      },
    });

    return NextResponse.json({ success: true, templateId: "ONB-01", result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send post-signup welcome email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
