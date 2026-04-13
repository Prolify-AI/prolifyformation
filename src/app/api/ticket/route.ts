import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createTicketInHubSpot, isHubSpotConfigured } from "@/lib/hubspot";

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
    const { category, summary, priority, email } = await request.json();
    if (!summary) {
      return NextResponse.json({ error: "Summary required" }, { status: 400 });
    }

    const ticketNumber = `TK-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;
    const slaHours = priority === "critical" ? 1 : priority === "high" ? 4 : priority === "normal" ? 8 : 24;
    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString();
    const assignedTeam =
      category === "incorporation"
        ? "incorporation_team"
        : category === "compliance"
          ? "compliance_team"
          : category === "billing"
            ? "billing_team"
            : category === "technical"
              ? "tech_team"
              : "support_team";

    const supabase = getSupabase();
    const hubspotConfigured = isHubSpotConfigured();
    let hubspotSynced = false;
    if (supabase) {
      const { error } = await supabase.from("support_tickets").insert({
        ticket_number: ticketNumber,
        email: email || "",
        category: category || "other",
        priority: priority || "normal",
        summary,
        status: "open",
        assigned_team: assignedTeam,
        sla_deadline: slaDeadline,
      });
      if (error) {
        console.error("[Ticket API] Supabase error:", error.message);
      }
    }

    try {
      const hubspotTicket = await createTicketInHubSpot({
        subject: `[${ticketNumber}] ${category || "general"}: ${summary}`,
        description:
          `Category: ${category || "general"}\n` +
          `Priority: ${priority || "normal"}\n` +
          `Email: ${email || "N/A"}\n` +
          `Summary: ${summary}`,
        priority: priority || "normal",
      });
      hubspotSynced = Boolean(hubspotTicket);
    } catch (error) {
      console.error("[Ticket API] HubSpot sync error:", error);
    }

    return NextResponse.json({
      success: true,
      ticketNumber,
      priority: priority || "normal",
      assignedTeam,
      slaDeadline,
      hubspotConfigured,
      hubspotSynced,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create ticket";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
