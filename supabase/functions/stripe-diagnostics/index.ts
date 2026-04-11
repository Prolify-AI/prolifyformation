import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecret) {
      return new Response(JSON.stringify({ error: "STRIPE_SECRET_KEY not set" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isLive = stripeSecret.startsWith("sk_live_");
    const isTest = stripeSecret.startsWith("sk_test_");
    const keyPreview = stripeSecret.substring(0, 12) + "...";

    const stripe = new Stripe(stripeSecret);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: priceConfigs } = await supabase
      .from("stripe_price_config")
      .select("plan_key, price_id");

    const priceIds = (priceConfigs || []).map((p: { price_id: string }) => p.price_id);

    const results: Record<string, unknown> = {};
    for (const priceId of priceIds) {
      try {
        const price = await stripe.prices.retrieve(priceId);
        results[priceId] = { found: true, currency: price.currency, type: price.type, amount: price.unit_amount, active: price.active };
      } catch (e: any) {
        results[priceId] = { found: false, error: e.message, code: e.code };
      }
    }

    return new Response(JSON.stringify({
      key_type: isLive ? "live" : isTest ? "test" : "unknown",
      key_preview: keyPreview,
      price_checks: results,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
