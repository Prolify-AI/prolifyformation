import { NextRequest } from "next/server";
import OpenAI from "openai";
import { AI_PRICING_CONTEXT, buildPricingReply } from "@/lib/ai/pricing-context";
import {
  buildMeetingClarificationReply,
  buildMeetingRecommendationReply,
  hasMeetingIntent,
  shouldAskMeetingClarification,
  shouldRecommendMeeting,
} from "@/lib/chat/meeting-routing";

export const runtime = "nodejs";
export const maxDuration = 60;

const PUBLIC_SYSTEM_PROMPT = `You are Prolify's AI assistant - a smart, friendly, conversion-oriented chatbot for international founders looking to form US companies.

Always refer to the platform as Prolify and the website as prolify.co.

Core goals:
- explain LLC vs C-Corp clearly
- recommend a state when appropriate
- explain pricing and formation options
- answer compliance questions at a high level
- route visitors to the correct Prolify meeting link based on their real intent

Rules:
- respond in the same language as the user
- be practical and concise
- do not provide legal or tax advice as final professional advice
- if unsure, say so and suggest human follow-up
- use bullet points when useful

Meeting routing rules:
- Do not send every user to the same booking page.
- Identify whether the user is asking for: general info, formation setup help, SaaS consultation, e-commerce consultation, creator consultation, partner/referral/integration, or existing customer support.
- If intent is ambiguous, ask one short clarification question before sharing a link.
- Prefer the most specific relevant meeting type over the generic intro call.
- Use only one primary booking link unless the user asks to compare options.

Pricing rules:
- Use the canonical pricing data below as the source of truth for plans and services.
- Do not invent prices.
- If the user asks about pricing, answer with the exact amount and mention whether it is one-time, monthly, annual, or yearly when relevant.

Priority order:
1. Existing Customer Support Call
2. Partner / Referral / Integration Call
3. SaaS Founder Consultation
4. E-commerce / Amazon / Shopify Consultation
5. Creator / Course / Newsletter / Coaching Consultation
6. Formation Strategy Call
7. Free Intro Call

Link directory:
- Free Intro Call: https://meetings.hubspot.com/prolify/free-intro-call
- Formation Strategy Call: https://meetings.hubspot.com/prolify/formation-strategy-call
- SaaS Founder Consultation: https://meetings.hubspot.com/prolify/saas-founder-consultation
- E-commerce / Amazon / Shopify Consultation: https://meetings.hubspot.com/prolify/e-commerce-amazon-shopify-consultation
- Creator / Course / Newsletter / Coaching Consultation: https://meetings.hubspot.com/prolify/creator-course-newsletter-coaching-consultation
- Partner / Referral / Integration Call: https://meetings.hubspot.com/prolify/partner-referral-integration-call
- Existing Customer Support Call: https://meetings.hubspot.com/prolify/existing-customer-support-compliance-help

${AI_PRICING_CONTEXT}`;

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

function buildFallbackReply(lastUserMessage: string): string {
  const normalized = lastUserMessage.toLowerCase();
  const pricingReply = buildPricingReply(lastUserMessage);
  if (pricingReply) {
    return pricingReply;
  }

  if (hasMeetingIntent(lastUserMessage)) {
    if (shouldAskMeetingClarification(lastUserMessage)) {
      return buildMeetingClarificationReply(lastUserMessage);
    }
    return buildMeetingRecommendationReply(lastUserMessage);
  }

  if (normalized.includes("llc") || normalized.includes("c-corp") || normalized.includes("corp")) {
    return [
      "For most international founders:",
      "- LLC: usually best for solo founders, e-commerce, consulting, and flexibility",
      "- C-Corp: usually best for venture-backed startups and stock options",
      "",
      "If you want tailored advice, the best next step is a Formation Strategy Call:",
      "https://meetings.hubspot.com/prolify/formation-strategy-call",
    ].join("\n");
  }

  return [
    "I can help with:",
    "- LLC vs C-Corp",
    "- choosing the right state",
    "- pricing and formation plans",
    "- compliance basics",
    "",
    "You can also book a Free Intro Call here:",
    "https://meetings.hubspot.com/prolify/free-intro-call",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, userContext, mode } = body;
    const conversationText = (messages ?? [])
      .filter((m: { role: string }) => m.role === "user")
      .map((m: { content: string }) => m.content)
      .join(" ");
    const lastUserMessage =
      [...(messages ?? [])].reverse().find((m: { role: string }) => m.role === "user")?.content ?? "";

    const apiKey = process.env.OPENAI_API_KEY;
    if (shouldRecommendMeeting(conversationText || lastUserMessage)) {
      const routingText = conversationText || lastUserMessage;
      const bookingReply =
        hasMeetingIntent(routingText) && shouldAskMeetingClarification(routingText)
          ? buildMeetingClarificationReply(routingText)
          : buildMeetingRecommendationReply(routingText);
      return new Response(bookingReply, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    if (!apiKey) {
      return new Response(buildFallbackReply(conversationText || lastUserMessage), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const client = new OpenAI({ apiKey });
    const isPublic = mode === "public";
    const systemMessage = isPublic ? PUBLIC_SYSTEM_PROMPT : buildSystemMessage(userContext);

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
