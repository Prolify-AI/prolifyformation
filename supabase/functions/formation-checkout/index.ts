import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.1";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  appInfo: { name: "Prolify Formation Checkout", version: "1.0.0" },
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const {
      user_id,
      email,
      formation_state,
      state_code,
      entity_type,
      company_name,
      plan_id,
      plan_name,
      prolify_fee,
      state_fee,
      expedited_ein_fee,
      total_amount,
      success_url,
      cancel_url,
      onboarding_data,
    } = await req.json();

    if (!user_id || !email || !plan_id || !success_url || !cancel_url || !total_amount) {
      return json({ error: "Missing required fields" }, 400);
    }

    const totalCents = Math.round(Number(total_amount) * 100);
    if (totalCents < 50) {
      return json({ error: "Invalid total amount" }, 400);
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: `Prolify ${plan_name ?? plan_id} Formation Package`,
          description: `Business formation service for ${entity_type ?? "LLC"} in ${formation_state ?? "Wyoming"}`,
        },
        unit_amount: Math.round(Number(prolify_fee ?? 0) * 100),
      },
      quantity: 1,
    });

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${formation_state ?? "Wyoming"} State Filing Fee`,
          description: `Official ${entity_type ?? "LLC"} filing fee for the state of ${formation_state ?? "Wyoming"}`,
        },
        unit_amount: Math.round(Number(state_fee ?? 0) * 100),
      },
      quantity: 1,
    });

    if (Number(expedited_ein_fee ?? 0) > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Expedited EIN Processing",
            description: "Priority EIN application processing",
          },
          unit_amount: Math.round(Number(expedited_ein_fee) * 100),
        },
        quantity: 1,
      });
    }

    const existingCustomers = await stripe.customers.list({ email, limit: 1 });
    let customerId = existingCustomers.data[0]?.id;

    if (!customerId) {
      const customer = await stripe.customers.create({ email });
      customerId = customer.id;
    }

    const { data: pendingRecord, error: insertError } = await supabase
      .from("pending_formation_payments")
      .insert({
        user_id,
        email,
        formation_state,
        state_code,
        entity_type,
        company_name,
        plan_id,
        prolify_fee: Number(prolify_fee ?? 0),
        state_fee: Number(state_fee ?? 0),
        expedited_ein_fee: Number(expedited_ein_fee ?? 0),
        total_amount: Number(total_amount),
        onboarding_snapshot: onboarding_data ?? null,
        status: "pending_payment",
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      })
      .select("id")
      .single();

    if (insertError || !pendingRecord) {
      console.error("Failed to create pending formation payment:", insertError);
      return json({ error: "Failed to save payment record" }, 500);
    }

    const successWithId = `${success_url}?formation_payment_id=${pendingRecord.id}`;
    const cancelWithId = `${cancel_url}?formation_payment_id=${pendingRecord.id}&cancelled=true`;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successWithId,
      cancel_url: cancelWithId,
      customer_email: customerId ? undefined : email,
      client_reference_id: pendingRecord.id,
      metadata: {
        formation_payment_id: pendingRecord.id,
        user_id,
        plan_id,
        formation_state: formation_state ?? "",
        state_code: state_code ?? "",
        entity_type: entity_type ?? "",
        prolify_fee: String(prolify_fee ?? 0),
        state_fee: String(state_fee ?? 0),
        expedited_ein_fee: String(expedited_ein_fee ?? 0),
        total_amount: String(total_amount),
      },
      allow_promotion_codes: true,
    });

    await supabase
      .from("pending_formation_payments")
      .update({ checkout_session_id: session.id })
      .eq("id", pendingRecord.id);

    return json({ url: session.url, formation_payment_id: pendingRecord.id });
  } catch (error: any) {
    console.error("Formation checkout error:", error);
    return json({ error: error.message || "Internal server error" }, 500);
  }
});
