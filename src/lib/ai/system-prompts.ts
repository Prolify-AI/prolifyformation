export type UserContext = {
  userName: string;
  companyName: string;
  entityType: string;
  formationState: string;
  currentPlan: string;
  businessType: string;
  complianceDates?: { title: string; due_date: string; status: string; category: string }[];
  expenses?: { total: number; categories: string[] };
  invoices?: { total: number; outstanding: number };
};
