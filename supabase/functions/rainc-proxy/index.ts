import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
  const contentHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  const header = { alg: "HS256", typ: "JWT", access_key: ACCESS_KEY };
  const payload = { path: path, content: contentHash };

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;

  const keyData = new TextEncoder().encode(SECRET_KEY);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${signingInput}.${sigB64}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { method, path, body } = await req.json();

    if (path === "/test") {
      return new Response(JSON.stringify({
        access_key_length: ACCESS_KEY.length,
        secret_key_length: SECRET_KEY.length,
        access_key_exists: ACCESS_KEY.length > 0,
        secret_key_exists: SECRET_KEY.length > 0,
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (path === "/constants") {
      const token = await generateJwt("/constants", "", "");
      const res = await fetch(`${BASE_URL}/constants`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      const text = await res.text();
      let parsed: unknown;
      try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
      console.log("CONSTANTS RESPONSE:", JSON.stringify(parsed));
      return new Response(JSON.stringify(parsed), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (path === "/test-create-company") {
      const testBody = {
        companies: [
          {
            name: "Prolify Test Company 2026",
            entity_type: "Limited Liability Company",
            state: "Wyoming",
            duplicate_name_allowed: true,
          },
        ],
      };
      const bodyString = JSON.stringify(testBody);
      const token = await generateJwt("/companies", "", bodyString);
      const upstream = await fetch(`${BASE_URL}/companies`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: bodyString,
      });
      const responseText = await upstream.text();
      let responseData: unknown;
      try { responseData = JSON.parse(responseText); } catch { responseData = { raw: responseText }; }
      console.log("TEST-CREATE-COMPANY RESPONSE:", JSON.stringify(responseData));
      return new Response(JSON.stringify({ requestBody: testBody, status: upstream.status, response: responseData }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (path === "/companies" && body?.companies && !Array.isArray(body.companies)) {
      body.companies = [body.companies];
    }

    let fullPath = path;
    let queryString = "";

    if (method === "GET") {
      if (body && Object.keys(body).length > 0) {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(body)) {
          if (Array.isArray(v)) {
            v.forEach((item) => params.append(k, String(item)));
          } else if (v !== null && v !== undefined) {
            params.append(k, String(v));
          }
        }
        const separator = path.includes("?") ? "&" : "?";
        queryString = params.toString();
        fullPath = `${path}${separator}${queryString}`;
      } else if (path.includes("?")) {
        queryString = path.split("?")[1] || "";
      }
    }

    const basePath = method === "GET" ? path.split("?")[0] : path;
    const bodyString = method !== "GET" && body ? JSON.stringify(body) : "";
    const token = await generateJwt(basePath, queryString, bodyString);

    const fullUrl = `${BASE_URL}${fullPath}`;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    };

    if (body && method !== "GET") {
      fetchOptions.body = JSON.stringify(body);
    }

    console.log("BODY BEING SENT:", fetchOptions.body);
    try {
      const parsed = JSON.parse((fetchOptions.body as string) || "{}");
      console.log("IS ARRAY:", Array.isArray(parsed?.companies));
      if (parsed?.companies?.[0]) {
        console.log("duplicate_name_allowed value:", parsed.companies[0].duplicate_name_allowed, "type:", typeof parsed.companies[0].duplicate_name_allowed);
      }
    } catch { /* ignore */ }

    const upstream = await fetch(fullUrl, fetchOptions);
    const responseText = await upstream.text();

    let responseData: unknown;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (!upstream.ok) {
      return new Response(
        JSON.stringify({ error: responseData, status: upstream.status }),
        { status: upstream.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
