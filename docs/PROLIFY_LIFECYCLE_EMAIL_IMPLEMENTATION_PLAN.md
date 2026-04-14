# Prolify Lifecycle Email Operating System - Implementation Plan

This document turns the lifecycle specification into an execution plan the team can implement and operate.

## 1) Goal and Scope

- Build a production lifecycle email system across the full customer journey:
  - lead -> free -> activated -> paying -> formation -> compliance -> bookkeeping/tax -> risk/churn -> reactivation -> advocate.
- Run both:
  - transactional emails (security, billing, compliance, service milestones),
  - lifecycle/marketing emails (onboarding, recovery, win-back, upsell, referrals).
- Enforce suppression, frequency caps, and legal/compliance routing rules.

## 2) Phase Plan (recommended rollout)

- Phase 0 - Foundations (1-2 weeks)
  - Event taxonomy implemented and validated.
  - Contact identity model and properties in HubSpot.
  - Sender domains and inbox routing configured.
  - Global suppression and frequency governance.
- Phase 1 - MVP Critical Flows (2-3 weeks)
  - ACC, ONB core, ACT-01, FRM core, EIN core, BOI core, compliance reminders, billing dunning basics.
  - KPI dashboard v1.
- Phase 2 - Expansion (2-4 weeks)
  - Re-engagement, NPS/referral, advanced segmentation, reminders loops, support-aware suppression.
- Phase 3 - Optimization (ongoing)
  - A/B testing, deliverability tuning, predictive churn/upsell scoring, localization refinement.

## 3) Event and Data Contract

## 3.1 Canonical event source of truth

- Use the provided event map as canonical names (do not rename without migration plan).
- Required event fields (all events):
  - `event_name`, `occurred_at`, `user_id`, `account_id`, `email`, `source_system`, `idempotency_key`.
- Optional contextual fields:
  - `plan_tier`, `amount`, `entity_type`, `formation_state`, `country`, `reason_code`, etc.

## 3.2 Identity and profile model

- Single customer profile in HubSpot + app DB with:
  - account status, onboarding status, payment status,
  - formation/ein/boi/compliance status,
  - engagement state (dormancy, risk, churn),
  - consent and preferences by email category.

## 3.3 Event quality guardrails

- Idempotency: no duplicate sends from duplicate events.
- Ordering tolerance: delayed events handled with state checks.
- SLA:
  - critical transactional events processed near-real-time (< 5 min),
  - lifecycle batch checks hourly/daily as needed.

## 4) HubSpot Setup Blueprint

- Active Lists (primary segments) exactly as defined in your spec.
- Custom properties required for segmentation:
  - `account_status`, `onboarding_status`, `formation_status`, `ein_status`,
  - `registered_agent_status`, `payment_status`, `last_login_date`,
  - `entity_type`, `country_of_residence`, `days_since_formation`, etc.
- Workflow ownership model:
  - Growth (lifecycle + upsell),
  - Product/Onboarding (formation milestones),
  - Compliance (annual report, BOI),
  - Billing (dunning/renewal),
  - Support (edge and escalations).

## 5) Automation Rules to Enforce

- Global frequency:
  - max 1 lifecycle/marketing email per day,
  - max 3 lifecycle/marketing emails per week,
  - transactional exempt.
- Sequence suppression:
  - Formation journey suppresses upsell/cross-sell.
  - Dunning suppresses all non-critical marketing.
  - Open support ticket suppresses NPS/referral for 7 days post-resolution.
  - EIN pending suppresses banking readiness.
- Sunset:
  - no opens/clicks 120 days -> suppress marketing,
  - exceptions for active paying compliance customers and compliance deadlines.

## 6) Sender and Deliverability Plan

- Sender addresses (from spec):
  - `foundersuccess@prolify.co`
  - `compliance@tx.prolify.co`
  - `billing@tx.prolify.co`
  - `support@prolify.co`
  - `hello@mail.prolify.co`
- Requirements:
  - SPF/DKIM/DMARC alignment for all sender domains.
  - Reply-to monitored inboxes (no no-reply).
  - Transactional and marketing streams separated.

## 7) Priority Build Order (Email Matrix Execution)

- MVP first:
  - ACC-01, ACC-02
  - ONB-01, ONB-02, ONB-03
  - ACT-01
  - FRM-01, FRM-02, FRM-03, FRM-04
  - EIN-01, EIN-03
  - BOI-01, BOI-02
  - CMP-01..CMP-04
  - BIL-01, BIL-02, BIL-03, BIL-04, BIL-06
  - CHN-01, CHN-03
  - EDG-01, EDG-02
- Phase 2+:
  - ONB-04, ACT-02..04, CMP-05/06, BIL-05, RET-01/02, UPS-01/02, CHN-02, EDG-04, BKG-01/02.

## 8) Workflow Implementation Checklist

- Sequence A (Welcome)
  - state checks at D1, D3, D7, D14; exit on `checkout_started` or `plan_purchased`.
- Sequence B (Abandoned cart)
  - +1h and +24h checks with purchase guard.
- Sequence C (Formation)
  - docs loop + escalation at 7 days.
- Sequence D (EIN)
  - 30-day delay reassurance and EIN complete handoff.
- Sequence E (Annual report countdown)
  - 60/30/14/3 day schedule.
- Sequence F (Dunning)
  - immediate, D3, D7, D14 involuntary churn.
- Sequence G (BOI)
  - trigger after formation, reminder loop, legal review flag.
- Sequence H/I
  - banking readiness and dormancy re-engagement.

## 9) Legal and Compliance Review Gates

- Must be reviewed before launch:
  - BOI language and timing (regulatory volatility),
  - Registered Agent obligations in pause/cancel emails,
  - EIN sensitive data handling (masking policy),
  - tax/legal disclaimer consistency.

## 10) Analytics and Reporting

- Core dashboards by stage:
  - lead->account conversion,
  - activation (profile complete, checkout started),
  - purchase conversion and recovery,
  - formation cycle time and bottlenecks,
  - compliance on-time filing rates,
  - dunning recovery/churn,
  - win-back and referral conversion.
- Per-email metrics:
  - delivered, open, click, CTA conversion, unsubscribe, spam complaint.
- Per-sequence metrics:
  - entry, completion, drop-off reason, average time to exit.

## 11) Technical Architecture (suggested)

- App emits canonical events to:
  - event bus (or queue) -> workflow processor -> HubSpot sync + email trigger service.
- Decision layer:
  - checks current user state and suppression before send.
- Audit layer:
  - immutable log: event received, evaluated, sent/suppressed, reason.

## 12) QA and Launch Criteria

- Pre-launch QA:
  - sandbox users for each stage and edge case,
  - trigger simulation for all MVP emails,
  - suppression and cap tests,
  - timezone checks for deadline flows,
  - broken-link and personalization fallback validation.
- Launch gate:
  - 100% pass on critical transactional flows,
  - no duplicate sends in stress test,
  - legal sign-off completed for flagged templates.

## 13) Immediate Next Actions (team-ready)

- Engineering
  - implement event emitters for missing triggers,
  - finalize properties mapping to HubSpot.
- Growth/Marketing
  - load templates in ESP/HubSpot with dynamic tokens,
  - configure frequency and category preferences.
- Compliance/Billing/Support
  - validate legal copy and escalation ownership.
- Data/Analytics
  - publish KPI dashboard v1.

---

Status: Planning baseline ready.  
Owner: Lifecycle Working Group (Growth + Engineering + Compliance + Billing + Support).
