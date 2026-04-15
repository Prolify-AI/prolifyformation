import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendLifecycleEmailByEvent } from "@/lib/email/lifecycle/dispatch";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-10-29.clover",
    })
  : null;

function formatUsd(amountCents: number | null | undefined): string {
  if (!amountCents || Number.isNaN(amountCents)) return "$0.00";
  return `$${(amountCents / 100).toFixed(2)}`;
}

async function getCustomerEmail(customerId: string): Promise<string | null> {
  if (!stripe) return null;
  const customer = await stripe.customers.retrieve(customerId);
  if (typeof customer === "string") return null;
  return customer.email ? String(customer.email).toLowerCase() : null;
}

export async function POST(request: NextRequest) {
  try {
    if (!stripe || !stripeWebhookSecret) {
      return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 500 });
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    const rawBody = await request.text();
    const event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret);

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
      const customerEmail = customerId ? await getCustomerEmail(customerId) : null;

      if (customerEmail) {
        const productName =
          invoice.lines?.data?.[0]?.description ||
          invoice.lines?.data?.[0]?.price?.nickname ||
          "your subscription";

        await sendLifecycleEmailByEvent({
          to: customerEmail,
          event: "payment_failed",
          idempotencyKey: `stripe:${event.id}:BIL-02`,
          metadata: {
            source: "api/stripe/webhook",
            stripe_event_id: event.id,
            stripe_invoice_id: invoice.id,
          },
          variables: {
            first_name: customerEmail.split("@")[0] || "Founder",
            payment_amount: formatUsd(invoice.amount_due),
            plan_name: productName,
            billing_url: `${request.nextUrl.origin}/dashboard?section=billing`,
            cta_url: `${request.nextUrl.origin}/dashboard?section=billing`,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to handle Stripe webhook";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
