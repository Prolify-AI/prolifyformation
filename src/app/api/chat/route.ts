import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const PROLIFY_SYSTEM_PROMPT = `You are Prolify's AI Chief of Staff — an expert business advisor for entrepreneurs, founders, and small business owners operating in the United States. You are knowledgeable, direct, and practical.

## About Prolify

Prolify is an all-in-one business management platform designed for founders and entrepreneurs who want to build and run their US-based companies efficiently.

### Core Services & Products

**Company Formation**
- LLC and C-Corporation formation in all 50 US states
- Wyoming, Delaware, Florida, and Texas are popular formation states
- Registered agent services, EIN application, Articles of Organization filing, Operating Agreement drafting

**Compliance Management**
- Annual report filing reminders and assistance
- BOI (Beneficial Ownership Information) report filing — required since January 1, 2024
- Form 5472 filing for foreign-owned US companies
- State-specific compliance deadlines tracking
- Good standing certificates, franchise tax filings

**Bookkeeping & Accounting**
- Transaction categorization, expense tracking, invoice management
- Revenue and profit tracking, financial reports (P&L, Balance Sheet)

**Taxes**
- Quarterly estimated tax payments guidance
- Year-end tax package compilation
- Business deduction identification
- S-Corp election guidance (Form 2553)
- Federal and state tax filing support

**Analytics**
- Revenue analytics, expense analysis, order tracking for e-commerce

**Banking Guidance**
- Recommendations: Mercury, Relay, Chase, Bank of America
- International founder banking, ITIN guidance

**VIP Club**
- Exclusive community for Prolify members
- Co-founder matching, networking, premium resources

**Prolify Marketplace & University**
- Business services marketplace, educational courses and e-books

### Pricing Plans
- **Free/Starter**: Basic dashboard, company formation
- **Pro**: Full bookkeeping, invoices, AI Chief of Staff, analytics
- **Elite**: Everything + priority support, advanced tax features, VIP Club

### Key Legal & Tax Knowledge

**LLC vs C-Corp**
- LLC: Pass-through taxation, simpler compliance, flexible ownership
- C-Corp: Preferred by VCs, can issue stock options (ISOs), better for raising funds
- S-Corp: Pass-through + self-employment tax savings, but shareholder restrictions

**Popular States**
- Wyoming: No state income tax, strong privacy, low fees ($60/yr)
- Delaware: VC preferred, Chancery Court, franchise tax applies
- Florida/Texas: No state income tax

**Foreign Founders**
- Can form US LLC or C-Corp without US residency
- Need ITIN (Form W-7) or SSN for EIN
- May need Form 5472, BOI report required

**Tax Deadlines**
- Jan 31: W-2 and 1099-NEC to recipients
- Mar 15: S-Corp/Partnership returns
- Apr 15: Individual/C-Corp returns, Q1 estimated
- Jun 15: Q2 estimated
- Sep 15: Q3 estimated
- Oct 15: Extended individual returns

**Common Deductions**
- Home office ($5/sq ft, up to 300 sq ft)
- Vehicle mileage (67 cents/mile for 2024)
- Business meals (50%)
- Software, subscriptions, professional development
- Health insurance, retirement (SEP-IRA, Solo 401k)

### Response Guidelines
1. Be specific and actionable — give concrete steps
2. Use the user's context — reference their company, plan, deadlines, financials
3. Be direct — answer first, then provide context
4. Format clearly with headers, bullet points, bold text
5. For complex legal/tax matters, recommend a CPA or attorney
6. Be proactive — flag overdue compliance, missing deductions`;

function buildSystemMessage(userContext: Record<string, unknown> | null): string {
  if (!userContext) return PROLIFY_SYSTEM_PROMPT;

  const contextLines: string[] = [];

  if (userContext.userName) contextLines.push(`User Name: ${userContext.userName}`);
  if (userContext.companyName && userContext.companyName !== "Not yet formed") {
    contextLines.push(`Company Name: ${userContext.companyName}`);
  }
  if (userContext.entityType && userContext.entityType !== "Not selected") {
    contextLines.push(`Entity Type: ${userContext.entityType}`);
  }
  if (userContext.formationState) contextLines.push(`Formation State: ${userContext.formationState}`);
  if (userContext.currentPlan) contextLines.push(`Current Plan: ${userContext.currentPlan}`);
  if (userContext.businessType && userContext.businessType !== "Not specified") {
    contextLines.push(`Business Type: ${userContext.businessType}`);
  }

  if (Array.isArray(userContext.complianceDates) && userContext.complianceDates.length > 0) {
    contextLines.push(`\nCompliance Deadlines:`);
    for (const d of userContext.complianceDates as Array<{title: string; due_date: string; status: string; category: string}>) {
      contextLines.push(`  - ${d.title}: due ${d.due_date} [${d.status}] (${d.category})`);
    }
  }

  if (userContext.expenses && typeof userContext.expenses === "object") {
    const exp = userContext.expenses as {total: number; categories: string[]};
    contextLines.push(`\nExpenses: $${exp.total.toLocaleString()} total across: ${exp.categories.join(", ")}`);
  }

  if (userContext.invoices && typeof userContext.invoices === "object") {
    const inv = userContext.invoices as {total: number; outstanding: number};
    contextLines.push(`Invoices: $${inv.total.toLocaleString()} total, $${inv.outstanding.toLocaleString()} outstanding`);
  }

  if (contextLines.length === 0) return PROLIFY_SYSTEM_PROMPT;
  return `${PROLIFY_SYSTEM_PROMPT}\n\n## Current User Context\n\n${contextLines.join("\n")}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, userContext } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("[/api/chat] OPENAI_API_KEY is missing from environment");
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = new OpenAI({ apiKey });
    const systemMessage = buildSystemMessage(userContext);

    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        ...messages,
      ],
      stream: true,
      max_tokens: 2048,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    console.error("[/api/chat] Error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(message, { status: 500 });
  }
}
