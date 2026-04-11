import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BASE_URL = "https://api.corporatetools.com";
const ACCESS_KEY = Deno.env.get("RAINC_ACCESS_KEY") ?? "";
const SECRET_KEY = Deno.env.get("RAINC_SECRET_KEY") ?? "";

function base64url(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function generateJwt(path: string, queryString: string, body: string): Promise<string> {
  const contentToHash = queryString + body;
  const msgBuffer = new TextEncoder().encode(contentToHash);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const contentHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const header = { alg: "HS256", typ: "JWT", access_key: ACCESS_KEY };
  const payload = { path, content: contentHash };

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;

  const keyData = new TextEncoder().encode(SECRET_KEY);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(signingInput));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${signingInput}.${sigB64}`;
}

async function raincPost(path: string, body: unknown) {
  const bodyString = JSON.stringify(body);
  const token = await generateJwt(path, "", bodyString);

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: bodyString,
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }
  return data;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { services, raincCompanyId } = await req.json();

    if (!services || services.length === 0) {
      return new Response(JSON.stringify({ error: "No services provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!raincCompanyId) {
      return new Response(JSON.stringify({ error: "raincCompanyId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let jurisdiction: string | null = null;

    const { data: ucRow } = await supabase
      .from("user_companies")
      .select("formation_state")
      .eq("rainc_company_id", raincCompanyId)
      .maybeSingle();

    if (ucRow?.formation_state) {
      jurisdiction = ucRow.formation_state;
    } else {
      const { data: onboardingRow } = await supabase
        .from("onboarding_data")
        .select("formation_state")
        .eq("user_id", user.id)
        .not("rainc_company_id", "is", null)
        .maybeSingle();
      if (onboardingRow?.formation_state) {
        jurisdiction = onboardingRow.formation_state;
      }
    }

    if (!jurisdiction) {
      return new Response(JSON.stringify({ error: "Could not determine company jurisdiction (formation state)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalAmount = services.reduce((sum: number, s: { price: number }) => sum + s.price, 0);

    const { data: order, error: insertError } = await supabase
      .from("service_orders")
      .insert({
        user_id: user.id,
        rainc_company_id: raincCompanyId,
        services,
        status: "pending",
        total_amount: totalAmount,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create order: ${insertError.message}`);
    }

    const raincServices = services.map((s: { raincServiceType: string }) => ({
      company_id: raincCompanyId,
      jurisdiction,
      service_type: s.raincServiceType,
    }));

    let raincResponse: unknown = null;
    let status = "submitted";
    let errorMessage: string | null = null;

    try {
      raincResponse = await raincPost("/services", { services: raincServices });
    } catch (e) {
      status = "failed";
      errorMessage = String(e);
    }

    await supabase
      .from("service_orders")
      .update({
        status,
        rainc_response: raincResponse,
        error_message: errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({
        success: status === "submitted",
        orderId: order.id,
        status,
        raincResponse,
        error: errorMessage,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
