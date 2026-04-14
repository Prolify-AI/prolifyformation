import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendLifecycleEmailByEvent } from "@/lib/email/lifecycle/dispatch";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const formation_payment_id = searchParams.get("formation_payment_id");

  if (!formation_payment_id) {
    return NextResponse.json({ error: "formation_payment_id is required" }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { data: record, error } = await supabaseAdmin
      .from("pending_formation_payments")
      .select("*")
      .eq("id", formation_payment_id)
      .maybeSingle();

    if (error || !record) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    if (new Date(record.expires_at) < new Date() && record.status === "pending_payment") {
      await supabaseAdmin
        .from("pending_formation_payments")
        .update({ status: "expired" })
        .eq("id", formation_payment_id);
      return NextResponse.json({ error: "Payment session has expired" }, { status: 410 });
    }

    let paymentStatus = record.status;

    if (record.checkout_session_id && record.status === "pending_payment") {
      const session = await stripe.checkout.sessions.retrieve(record.checkout_session_id);
      if (session.payment_status === "paid") {
        paymentStatus = "payment_completed";
        await supabaseAdmin
          .from("pending_formation_payments")
          .update({ status: "payment_completed" })
          .eq("id", formation_payment_id);
      }
    }

    return NextResponse.json({
      id: record.id,
      user_id: record.user_id,
      status: paymentStatus,
      plan_id: record.plan_id,
      formation_state: record.formation_state,
      entity_type: record.entity_type,
      total_amount: record.total_amount,
      onboarding_snapshot: record.onboarding_snapshot,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { formation_payment_id } = await req.json();

    if (!formation_payment_id) {
      return NextResponse.json({ error: "formation_payment_id is required" }, { status: 400 });
    }

    const { data: record, error: fetchError } = await supabaseAdmin
      .from("pending_formation_payments")
      .select("*")
      .eq("id", formation_payment_id)
      .maybeSingle();

    if (fetchError || !record) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    if (record.status === "formation_started") {
      return NextResponse.json({ success: true, message: "Formation already started" });
    }

    let paymentVerified = false;

    if (record.checkout_session_id) {
      const session = await stripe.checkout.sessions.retrieve(record.checkout_session_id);
      paymentVerified = session.payment_status === "paid";
    }

    if (!paymentVerified && record.status !== "payment_completed") {
      return NextResponse.json({ error: "Payment has not been completed" }, { status: 402 });
    }

    const snapshot = record.onboarding_snapshot as Record<string, unknown> | null;

    const dbData = {
      user_id: record.user_id,
      country_of_residence: snapshot?.country ?? "",
      business_goal: snapshot?.businessGoal ?? "form_new",
      entity_type: record.entity_type,
      company_name: record.company_name,
      formation_state: record.formation_state,
      selected_plan: record.plan_id,
      expedited_ein: (record.expedited_ein_fee ?? 0) > 0,
      state_fee: record.state_fee,
      plan_price: record.prolify_fee,
      expedited_ein_fee: record.expedited_ein_fee,
      total_amount: record.total_amount,
      payment_verified: true,
      completed: true,
    };

    const { data: existingOnboarding } = await supabaseAdmin
      .from("onboarding_data")
      .select("id")
      .eq("user_id", record.user_id)
      .maybeSingle();

    if (existingOnboarding) {
      await supabaseAdmin
        .from("onboarding_data")
        .update(dbData)
        .eq("id", existingOnboarding.id);
    } else {
      await supabaseAdmin.from("onboarding_data").insert(dbData);
    }

    await supabaseAdmin
      .from("pending_formation_payments")
      .update({ status: "formation_started" })
      .eq("id", formation_payment_id);

    try {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(record.user_id);
      const userEmail = userData?.user?.email;

      if (userEmail) {
        const origin = new URL(req.url).origin;
        await sendLifecycleEmailByEvent({
          to: userEmail,
          event: "formation_submitted",
          variables: {
            first_name:
              String(userData.user.user_metadata?.full_name || "").split(" ")[0] || "Founder",
            cta_url: `${origin}/dashboard`,
          },
        });
      }
    } catch (emailError) {
      console.error("[formation/finalize] FRM-03 send failed:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Formation finalize error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
