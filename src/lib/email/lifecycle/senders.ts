export const LIFECYCLE_SENDERS = {
  foundersuccess: {
    fromName: "Prolify",
    fromAddress: "foundersuccess@prolify.co",
    useCases: "Welcome, onboarding, educational, check-ins, referrals",
  },
  compliance: {
    fromName: "Prolify Compliance",
    fromAddress: "compliance@tx.prolify.co",
    useCases: "Annual reports, BOI filings, formation status, EIN updates, compliance alerts",
  },
  billing: {
    fromName: "Prolify Billing",
    fromAddress: "billing@tx.prolify.co",
    useCases: "Receipts, invoices, payment failures, renewal notices, cancellation confirmations",
  },
  support: {
    fromName: "Prolify Support",
    fromAddress: "support@prolify.co",
    useCases: "Support ticket updates, EIN delay reassurance, edge case communications",
  },
  hello: {
    fromName: "Prolify",
    fromAddress: "hello@mail.prolify.co",
    useCases: "Newsletters, product updates, cross-sell, promotional",
  },
} as const;
