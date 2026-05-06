import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSmtpMail } from "@/lib/email/smtp";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const diditRes = await fetch(`${supabaseUrl}/functions/v1/didit-create-session`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const diditData = await diditRes.json();

    if (diditData.status === "approved") {
      return NextResponse.json({ skipped: true, reason: "already_approved" });
    }

    const sessionUrl = diditData.session?.session_url;
    if (!sessionUrl) {
      return NextResponse.json({ error: "No session URL returned" }, { status: 502 });
    }

    const userEmail = user.email;
    if (!userEmail) {
      return NextResponse.json({ error: "User has no email" }, { status: 400 });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Identity</title>
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#111111;border-radius:16px;overflow:hidden;border:1px solid #222222;">
          <tr>
            <td style="background-color:#FFC107;padding:28px 40px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:800;color:#000000;letter-spacing:-0.5px;">Prolify</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 12px 0;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Action required: Verify your identity</h1>
              <p style="margin:0 0 24px 0;font-size:15px;color:#999999;line-height:1.6;">
                Thank you for your purchase! To activate your service, we need to verify your identity. This is a one-time process that takes less than 2 minutes.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 32px 0;width:100%;">
                <tr>
                  <td style="background-color:#1a1a1a;border-radius:12px;padding:24px;border:1px solid #222222;">
                    <p style="margin:0 0 16px 0;font-size:13px;font-weight:700;color:#FFC107;text-transform:uppercase;letter-spacing:0.5px;">What to expect</p>
                    ${[
                      ["📄", "Photo of your ID", "Government-issued ID or passport"],
                      ["🤳", "Quick selfie", "A photo of yourself for face matching"],
                      ["✅", "Instant confirmation", "Results in under 60 seconds"],
                    ].map(([emoji, title, desc]) => `
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:14px;width:100%;">
                      <tr>
                        <td style="width:36px;vertical-align:top;font-size:20px;">${emoji}</td>
                        <td style="vertical-align:top;">
                          <p style="margin:0 0 2px 0;font-size:14px;font-weight:700;color:#ffffff;">${title}</p>
                          <p style="margin:0;font-size:13px;color:#666666;">${desc}</p>
                        </td>
                      </tr>
                    </table>`).join("")}
                  </td>
                </tr>
              </table>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px auto;">
                <tr>
                  <td align="center" style="background-color:#FFC107;border-radius:10px;">
                    <a href="${sessionUrl}" target="_blank" style="display:inline-block;padding:16px 36px;font-size:16px;font-weight:800;color:#000000;text-decoration:none;letter-spacing:-0.3px;">
                      Verify My Identity &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:12px;color:#444444;text-align:center;line-height:1.6;">
                This link is unique to your account and expires in 24 hours.<br/>
                If you did not purchase a service, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #222222;text-align:center;">
              <p style="margin:0;font-size:12px;color:#444444;">
                &copy; 2026 Prolify &mdash; Business Formation & Compliance
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text = `Action required: Verify your identity to activate your service

Thank you for your purchase! To activate your service, please verify your identity by visiting the link below.

What to expect:
- Photo of your ID (government-issued ID or passport)
- Quick selfie for face matching
- Instant confirmation in under 60 seconds

Verify your identity here:
${sessionUrl}

This link is unique to your account and expires in 24 hours.
If you did not purchase a service, you can safely ignore this email.

— The Prolify Team`;

    await sendSmtpMail({
      to: userEmail,
      subject: "Action required: Verify your identity to activate your service",
      html,
      text,
    });

    return NextResponse.json({ success: true, sessionUrl });
  } catch (err) {
    console.error("[kyc/trigger-verification]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
