import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createDeal, createOrUpdateContact, isHubSpotConfigured } from "@/lib/hubspot";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null;
  }
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, country, businessType, segment, pageUrl } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    let score = 20;
    if (firstName) score += 5;
    if (country) score += 5;
    if (businessType) score += 10;
    if (segment) score += 10;

    const supabase = getSupabase();
    const hubspotConfigured = isHubSpotConfigured();
    let hubspotSynced = false;
    if (supabase) {
      const { error } = await supabase.from("leads").upsert(
        {
          email,
          first_name: firstName || "",
          country: country || "",
          business_type: businessType || "",
          segment: segment || "",
          source: "chatbot_widget",
          score,
          page_url: pageUrl || "",
        },
        { onConflict: "email" }
      );
      if (error) {
        console.error("[Lead API] Supabase error:", error.message);
      }
    }

    try {
      const nameParts = String(firstName || "").split(" ");
      const hubspotContact = await createOrUpdateContact({
        email,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        country: country || "",
        businessType: businessType || "",
        leadScore: score,
        source: "chatbot_widget",
      });

      if (hubspotContact && score > 60) {
        await createDeal({
          contactId: hubspotContact.id,
          dealName: `${email} - Widget Lead (score: ${score})`,
          stage: "appointmentscheduled",
        });
      }
      hubspotSynced = Boolean(hubspotContact);
    } catch (error) {
      console.error("[Lead API] HubSpot sync error:", error);
    }

    return NextResponse.json({ success: true, score, hubspotConfigured, hubspotSynced });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to capture lead";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
