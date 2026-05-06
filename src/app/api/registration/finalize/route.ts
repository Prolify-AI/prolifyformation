import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
  });

  try {
    const { registration_id } = await req.json();

    if (!registration_id) {
      return NextResponse.json({ error: "registration_id is required" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: registration, error: fetchError } = await supabaseAdmin
      .from("pending_registrations")
      .select("*")
      .eq("id", registration_id)
      .maybeSingle();

    if (fetchError || !registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (registration.status === "account_created") {
      return NextResponse.json({ success: true, message: "Account already created" });
    }

    if (new Date(registration.expires_at) < new Date()) {
      return NextResponse.json({ error: "Registration session has expired. Please register again." }, { status: 410 });
    }

    let paymentVerified = false;

    if (registration.checkout_session_id) {
      const session = await stripe.checkout.sessions.retrieve(registration.checkout_session_id);
      paymentVerified = session.payment_status === "paid";
    }

    if (!paymentVerified && registration.status !== "payment_completed") {
      return NextResponse.json({ error: "Payment has not been completed yet" }, { status: 402 });
    }

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers.users.find(
      (u) => u.email?.toLowerCase() === registration.email.toLowerCase()
    );

    if (existingUser) {
      await supabaseAdmin
        .from("pending_registrations")
        .update({ status: "account_created" })
        .eq("id", registration_id);

      return NextResponse.json({ success: true, message: "Account already exists, please sign in." });
    }

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: registration.email,
      password: `prolify_temp_${registration_id}`,
      email_confirm: true,
      user_metadata: {
        full_name: registration.full_name,
        phone: registration.phone,
      },
    });

    if (createError || !newUser.user) {
      console.error("Failed to create user:", createError);
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }

    await new Promise((r) => setTimeout(r, 1500));

    if (registration.newsletter_subscribed) {
      await supabaseAdmin
        .from("profiles")
        .update({ newsletter_subscribed: true })
        .eq("id", newUser.user.id);
    }

    if (registration.plan_id) {
      const companyIdResult = await supabaseAdmin
        .from("profiles")
        .select("company_id")
        .eq("id", newUser.user.id)
        .maybeSingle();

      if (companyIdResult.data?.company_id) {
        const planName = registration.plan_id
          .replace("formation-", "")
          .replace("management-", "");
        await supabaseAdmin
          .from("companies")
          .update({ current_plan: registration.plan_id, plan_name: planName })
          .eq("id", companyIdResult.data.company_id);
      }
    }

    const { error: sessionError } = await supabaseAdmin.auth.admin.updateUserById(
      newUser.user.id,
      { password: registration.hashed_password }
    );

    if (sessionError) {
      console.error("Password update error:", sessionError);
    }

    await supabaseAdmin
      .from("pending_registrations")
      .update({ status: "account_created" })
      .eq("id", registration_id);

    const { data: signInData } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: registration.email,
    });

    return NextResponse.json({
      success: true,
      email: registration.email,
      magic_link: signInData?.properties?.action_link ?? null,
    });
  } catch (error: any) {
    console.error("Finalize registration error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
  });

  try {
    const { searchParams } = new URL(req.url);
    const registration_id = searchParams.get("registration_id");

    if (!registration_id) {
      return NextResponse.json({ error: "registration_id is required" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: registration, error } = await supabaseAdmin
      .from("pending_registrations")
      .select("id, email, full_name, plan_id, status, expires_at, checkout_session_id")
      .eq("id", registration_id)
      .maybeSingle();

    if (error || !registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    let paymentStatus = registration.status;

    if (registration.checkout_session_id && registration.status === "pending_payment") {
      const session = await stripe.checkout.sessions.retrieve(registration.checkout_session_id);
      if (session.payment_status === "paid") {
        paymentStatus = "payment_completed";
        await supabaseAdmin
          .from("pending_registrations")
          .update({ status: "payment_completed" })
          .eq("id", registration_id);
      }
    }

    return NextResponse.json({
      id: registration.id,
      email: registration.email,
      full_name: registration.full_name,
      plan_id: registration.plan_id,
      status: paymentStatus,
      expires_at: registration.expires_at,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}