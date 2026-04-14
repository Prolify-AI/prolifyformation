import { NextRequest, NextResponse } from "next/server";
import { getLifecycleTemplate } from "@/lib/email/templates/lifecycle-catalog";
import { buildRenderedTemplate } from "@/lib/email/templates/render";
import { sendSmtpMail } from "@/lib/email/smtp";

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

    const template = getLifecycleTemplate("ONB-01");
    if (!template) {
      return NextResponse.json({ error: "Template ONB-01 not found" }, { status: 500 });
    }

    const baseUrl = request.nextUrl.origin;
    const rendered = buildRenderedTemplate(template, {
      first_name: getFirstName(fullName, requestedEmail),
      profile_url: `${baseUrl}/dashboard`,
      cta_url: `${baseUrl}/dashboard`,
      company_name: "Prolify",
    });

    const result = await sendSmtpMail({
      to: requestedEmail,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
      from: rendered.from,
      replyTo: rendered.replyTo,
    });

    return NextResponse.json({ success: true, templateId: "ONB-01", result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send post-signup welcome email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
