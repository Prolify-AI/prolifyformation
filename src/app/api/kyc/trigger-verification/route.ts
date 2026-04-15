import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSmtpMail } from "@/lib/email/smtp";

/**
 * POST /api/kyc/trigger-verification
 *
 * Called after a successful service purchase.
 * Creates a Didit identity verification session and sends
 * an email to the user with the verification link.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Authenticate user via Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { serviceName } = await request.json().catch(() => ({}));

    // Create Didit session via Supabase Edge Function
    const diditRes = await fetch(
      `${supabaseUrl}/functions/v1/didit-create-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
          apikey: supabaseAnonKey,
        },
      }
    );

    const diditData = await diditRes.json();

    // If user is already approved, no need to send the email again
    if (diditData.status === "approved") {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    const verificationUrl =
      diditData.session?.session_url ?? diditData.session?.url;

    if (!verificationUrl) {
      console.error("[kyc/trigger-verification] No session URL from Didit:", diditData);
      return NextResponse.json(
        { error: "Could not create identity verification session" },
        { status: 502 }
      );
    }

    const userEmail = user.email!;
    const userName = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "there";
    const purchasedService = serviceName ?? "your service";

    // Send the KYC email
    await sendSmtpMail({
      to: userEmail,
      subject: "Action required: Verify your identity to activate your service",
      html: buildKycEmailHtml({ userName, verificationUrl, purchasedService }),
      text: buildKycEmailText({ userName, verificationUrl, purchasedService }),
    });

    return NextResponse.json({ success: true, emailSent: true });
  } catch (error) {
    console.error("[kyc/trigger-verification] Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── Email templates ──────────────────────────────────────────────────────────

function buildKycEmailHtml({
  userName,
  verificationUrl,
  purchasedService,
}: {
  userName: string;
  verificationUrl: string;
  purchasedService: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Identity – Prolify</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#000000;padding:32px 40px;text-align:center;">
              <span style="font-size:28px;font-weight:800;color:#FFC107;letter-spacing:-0.5px;">Prolify</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111;">
                Verify your identity, ${userName} 🔐
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">
                Thank you for purchasing <strong>${purchasedService}</strong>. To activate your service and protect your account,
                we need to verify your identity. This takes less than <strong>2 minutes</strong>.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td style="background:#FFC107;border-radius:10px;">
                    <a href="${verificationUrl}"
                       style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#000;text-decoration:none;letter-spacing:0.2px;">
                      Verify My Identity →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Steps -->
              <table cellpadding="0" cellspacing="0" width="100%" style="background:#f9f9f9;border-radius:12px;padding:20px;margin:0 0 24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:0.5px;">What to expect</p>
                    <p style="margin:0 0 8px;font-size:14px;color:#444;">📄 &nbsp;Take a photo of your government-issued ID</p>
                    <p style="margin:0 0 8px;font-size:14px;color:#444;">🤳 &nbsp;Take a quick selfie for face matching</p>
                    <p style="margin:0;font-size:14px;color:#444;">✅ &nbsp;Receive instant confirmation</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#888;line-height:1.5;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0;font-size:12px;color:#aaa;word-break:break-all;">${verificationUrl}</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
              <p style="margin:0;font-size:12px;color:#aaa;">
                © ${new Date().getFullYear()} Prolify · Questions? <a href="mailto:support@prolify.co" style="color:#FFC107;text-decoration:none;">support@prolify.co</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function buildKycEmailText({
  userName,
  verificationUrl,
  purchasedService,
}: {
  userName: string;
  verificationUrl: string;
  purchasedService: string;
}) {
  return `
Hi ${userName},

Thank you for purchasing ${purchasedService}!

To activate your service, please verify your identity. It takes less than 2 minutes.

Verify now: ${verificationUrl}

What you'll need:
- A government-issued ID (passport, driver's license, etc.)
- A quick selfie for face matching

Questions? Contact us at support@prolify.co

— The Prolify Team
  `.trim();
}
