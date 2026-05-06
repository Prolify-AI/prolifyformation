import { LIFECYCLE_SENDERS } from "@/lib/email/lifecycle/senders";
import type { LifecycleTemplate, TemplateVariables } from "./types";

const TOKEN_REGEX = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

function interpolate(input: string, vars: TemplateVariables): string {
  return input.replace(TOKEN_REGEX, (_, key: string) => {
    const value = vars[key];
    return value === undefined || value === null ? "" : String(value);
  });
}

function toHtmlParagraphs(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .split("\n\n")
    .map((block) => `<p style="margin:0 0 14px 0;line-height:1.6;color:#111827;font-size:15px;">${block.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

export function buildRenderedTemplate(template: LifecycleTemplate, vars: TemplateVariables) {
  const subject = interpolate(template.subject, vars);
  const preheader = interpolate(template.preheader, vars);
  const body = interpolate(template.body, vars);
  const ctaUrl = template.ctaUrlVar ? interpolate(`{{${template.ctaUrlVar}}}`, vars) : "";

  const senderKey = template.sender ?? "foundersuccess";
  const sender = LIFECYCLE_SENDERS[senderKey];
  const smtpFrom = process.env.SMTP_FROM ?? "Prolify <support@prolify.co>";
  const replyTo = `${sender.fromName} <${sender.fromAddress}>`;

  const text = [preheader, "", body, ctaUrl ? `${template.ctaLabel ?? "Open"}: ${ctaUrl}` : "", "", "—", "Prolify"].filter(Boolean).join("\n");

  if (template.textOnly) {
    return { subject, text, from: smtpFrom, replyTo };
  }

  const html = `
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f4f6;padding:24px 0;font-family:Inter,Segoe UI,Arial,sans-serif;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="620" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="background:linear-gradient(90deg,#f59e0b,#fbbf24);padding:20px 24px;">
              <div style="font-weight:800;color:#111827;font-size:20px;">Prolify</div>
              <div style="color:#1f2937;font-size:13px;margin-top:4px;">Lifecycle Update</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              ${toHtmlParagraphs(body)}
              ${
                ctaUrl
                  ? `<div style="margin-top:20px;"><a href="${ctaUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;font-size:14px;">${template.ctaLabel ?? "Open"}</a></div>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
              Sent by ${sender.fromName} · Replies are monitored.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;

  return { subject, text, html, from: smtpFrom, replyTo };
}
