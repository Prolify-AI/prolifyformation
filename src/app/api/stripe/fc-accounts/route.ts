import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function GET(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization") || "",
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");

    if (!accountId) {
      return NextResponse.json({ error: "accountId is required" }, { status: 400 });
    }

    const [account, transactions] = await Promise.all([
      stripe.financialConnections.accounts.retrieve(accountId, {
        expand: ["balance"],
      }),
      stripe.financialConnections.transactions
        .list({ account: accountId, limit: 25 })
        .catch(() => null),
    ]);

    return NextResponse.json({
      account,
      balances: (account as any).balance ?? null,
      transactions: transactions?.data ?? [],
    });
  } catch (error: any) {
    console.error("FC accounts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve account data" },
      { status: 500 }
    );
  }
}
