import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.1";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  appInfo: { name: "Prolify Preregistration", version: "1.0.0" },
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
      email,
      full_name,
      phone,
      hashed_password,
      newsletter_subscribed,
      terms_accepted,
      plan_id,
      price_id,
      success_url,
      cancel_url,
      formation_state,
      state_code,
      entity_type,
      state_fee,
      prolify_fee,
    } = await req.json();

    if (!email || !hashed_password || !price_id || !plan_id || !success_url || !cancel_url) {
      return json({ error: "Missing required fields" }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ error: "Invalid email address" }, 400);
    }

    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", (await supabase.auth.admin.listUsers()).data.users.find((u) => u.email === email)?.id ?? "")
      .maybeSingle();

    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const existingAuthUser = authUsers.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (existingAuthUser) {
      return json({ error: "An account with this email already exists. Please sign in instead." }, 409 );
    }

    const { data: pending, error: pendingError } = await supabase
      .from("pending_registrations")
      .select("id, status, expires_at")
      .eq("email", email.toLowerCase())
      .in("status", ["pending_payment"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (pending && new Date(pending.expires_at) > new Date()) {
      await supabase
        .from("pending_registrations")
        .update({ status: "expired" })
        .eq("id", pending.id);
    }

    const { data: registration, error: insertError } = await supabase
      .from("pending_registrations")
      .insert({
        email: email.toLowerCase().trim(),
        full_name: full_name?.trim() ?? "",
        phone: phone?.trim() ?? "",
        hashed_password,
        newsletter_subscribed: newsletter_subscribed ?? false,
        terms_accepted: terms_accepted ?? true,
        plan_id,
        price_id,
        status: "pending_payment",
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      })
      .select("id")
      .single();

    if (insertError || !registration) {
      console.error("Failed to create pending registration:", insertError);
      return json({ error: "Failed to save registration data" }, 500);
    }

    const stripePrice = await stripe.prices.retrieve(price_id);
    const checkoutMode = stripePrice.type === "recurring" ? "subscription" : "payment";

    const successWithId = `${success_url}?registration_id=${registration.id}`;
    const cancelWithId = `${cancel_url}?registration_id=${registration.id}&cancelled=true`;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [{ price: price_id, quantity: 1 }],
      mode: checkoutMode,
      success_url: successWithId,
      cancel_url: cancelWithId,
      customer_email: email.toLowerCase().trim(),
      client_reference_id: registration.id,
      metadata: {
        registration_id: registration.id,
        plan_id,
        full_name: full_name?.trim() ?? "",
        formation_state: formation_state ?? "",
        state_code: state_code ?? "",
        entity_type: entity_type ?? "",
        state_fee: state_fee != null ? String(state_fee) : "",
        prolify_fee: prolify_fee != null ? String(prolify_fee) : "",
      },
      allow_promotion_codes: true,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    await supabase
      .from("pending_registrations")
      .update({ checkout_session_id: session.id })
      .eq("id", registration.id);

    return json({ url: session.url, registration_id: registration.id });
  } catch (error: any) {
    console.error("Preregistration checkout error:", error);
    return json({ error: error.message || "Internal server error" }, 500);
  }
});
