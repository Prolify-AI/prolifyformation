import { NextRequest, NextResponse } from "next/server";
import { sendSmtpMail } from "@/lib/email/smtp";

function isAuthorized(request: NextRequest): boolean {
  const configuredKey = process.env.INTERNAL_API_KEY;
  if (!configuredKey) {
    // In local development only, allow sending without API key.
    return process.env.NODE_ENV !== "production";
  }

  const requestKey = request.headers.get("x-internal-api-key");
  return requestKey === configuredKey;
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { to, subject, text, html, from, replyTo } = body ?? {};

    if (!to || !subject || (!text && !html)) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, and text or html" },
        { status: 400 }
      );
    }

    const result = await sendSmtpMail({
      to,
      subject,
      text,
      html,
      from,
      replyTo,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
