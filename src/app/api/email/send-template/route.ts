import { NextRequest, NextResponse } from "next/server";
import { sendSmtpMail } from "@/lib/email/smtp";
import { getLifecycleTemplate } from "@/lib/email/templates/lifecycle-catalog";
import { buildRenderedTemplate } from "@/lib/email/templates/render";

function isAuthorized(request: NextRequest): boolean {
  const configuredKey = process.env.INTERNAL_API_KEY;
  if (!configuredKey) {
    return process.env.NODE_ENV !== "production";
  }
  return request.headers.get("x-internal-api-key") === configuredKey;
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { to, templateId, variables } = body ?? {};

    if (!to || !templateId) {
      return NextResponse.json({ error: "Missing required fields: to and templateId" }, { status: 400 });
    }

    const template = getLifecycleTemplate(String(templateId));
    if (!template) {
      return NextResponse.json({ error: `Unknown templateId: ${templateId}` }, { status: 404 });
    }

    const rendered = buildRenderedTemplate(template, variables ?? {});
    const result = await sendSmtpMail({
      to,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
      from: rendered.from,
      replyTo: rendered.replyTo,
    });

    return NextResponse.json({ success: true, templateId, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send templated email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
