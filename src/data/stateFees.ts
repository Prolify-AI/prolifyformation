export type StateFeeEntry = {
  name: string;
  code: string;
  llcFee: number;
  corpFee: number;
  annualReportFee: number;
  recommended?: boolean;
  description?: string;
};

export type OrderBreakdown = {
  stateName: string;
  stateCode: string;
  stateFee: number;
  prolifyFee: number;
  total: number;
  totalCents: number;
  breakdown: {
    label: string;
    amount: number;
  }[];
};

export const STATE_FEES: Record<string, StateFeeEntry> = {
  WY: { name: "Wyoming",        code: "WY", llcFee: 103.75, corpFee: 100.00, annualReportFee: 62.00,  recommended: true,  description: "Recommended — no corporate income tax, low annual fees and flexible formation." },
  DE: { name: "Delaware",       code: "DE", llcFee: 140.00, corpFee: 150.00, annualReportFee: 300.00, description: "Popular for corporations seeking venture capital funding." },
  NV: { name: "Nevada",         code: "NV", llcFee: 425.00, corpFee: 725.00, annualReportFee: 350.00, description: "No corporate or personal income tax." },
  AL: { name: "Alabama",        code: "AL", llcFee: 236.00, corpFee: 236.00, annualReportFee: 100.00 },
  AK: { name: "Alaska",         code: "AK", llcFee: 250.00, corpFee: 250.00, annualReportFee: 100.00 },
  AZ: { name: "Arizona",        code: "AZ", llcFee: 85.00,  corpFee: 95.00,  annualReportFee: 0.00   },
  AR: { name: "Arkansas",       code: "AR", llcFee: 50.00,  corpFee: 50.00,  annualReportFee: 150.00 },
  CA: { name: "California",     code: "CA", llcFee: 70.00,  corpFee: 100.00, annualReportFee: 800.00 },
  CO: { name: "Colorado",       code: "CO", llcFee: 50.00,  corpFee: 50.00,  annualReportFee: 10.00  },
  CT: { name: "Connecticut",    code: "CT", llcFee: 120.00, corpFee: 250.00, annualReportFee: 80.00  },
  FL: { name: "Florida",        code: "FL", llcFee: 125.00, corpFee: 78.75,  annualReportFee: 138.75 },
  GA: { name: "Georgia",        code: "GA", llcFee: 100.00, corpFee: 100.00, annualReportFee: 50.00  },
  HI: { name: "Hawaii",         code: "HI", llcFee: 50.00,  corpFee: 50.00,  annualReportFee: 15.00  },
  ID: { name: "Idaho",          code: "ID", llcFee: 100.00, corpFee: 100.00, annualReportFee: 0.00   },
  IL: { name: "Illinois",       code: "IL", llcFee: 150.00, corpFee: 175.00, annualReportFee: 75.00  },
  IN: { name: "Indiana",        code: "IN", llcFee: 95.00,  corpFee: 90.00,  annualReportFee: 32.00  },
  IA: { name: "Iowa",           code: "IA", llcFee: 50.00,  corpFee: 50.00,  annualReportFee: 60.00  },
  KS: { name: "Kansas",         code: "KS", llcFee: 165.00, corpFee: 90.00,  annualReportFee: 55.00  },
  KY: { name: "Kentucky",       code: "KY", llcFee: 40.00,  corpFee: 50.00,  annualReportFee: 15.00  },
  LA: { name: "Louisiana",      code: "LA", llcFee: 100.00, corpFee: 75.00,  annualReportFee: 35.00  },
  ME: { name: "Maine",          code: "ME", llcFee: 175.00, corpFee: 145.00, annualReportFee: 85.00  },
  MD: { name: "Maryland",       code: "MD", llcFee: 120.00, corpFee: 120.00, annualReportFee: 300.00 },
  MA: { name: "Massachusetts",  code: "MA", llcFee: 520.00, corpFee: 275.00, annualReportFee: 520.00 },
  MI: { name: "Michigan",       code: "MI", llcFee: 50.00,  corpFee: 60.00,  annualReportFee: 25.00  },
  MN: { name: "Minnesota",      code: "MN", llcFee: 135.00, corpFee: 180.00, annualReportFee: 0.00   },
  MS: { name: "Mississippi",    code: "MS", llcFee: 50.00,  corpFee: 50.00,  annualReportFee: 0.00   },
  MO: { name: "Missouri",       code: "MO", llcFee: 105.00, corpFee: 58.00,  annualReportFee: 45.00  },
  MT: { name: "Montana",        code: "MT", llcFee: 70.00,  corpFee: 70.00,  annualReportFee: 15.00  },
  NE: { name: "Nebraska",       code: "NE", llcFee: 100.00, corpFee: 65.00,  annualReportFee: 26.00  },
  NH: { name: "New Hampshire",  code: "NH", llcFee: 100.00, corpFee: 100.00, annualReportFee: 100.00 },
  NJ: { name: "New Jersey",     code: "NJ", llcFee: 125.00, corpFee: 125.00, annualReportFee: 75.00  },
  NM: { name: "New Mexico",     code: "NM", llcFee: 50.00,  corpFee: 100.00, annualReportFee: 0.00   },
  NY: { name: "New York",       code: "NY", llcFee: 200.00, corpFee: 135.00, annualReportFee: 9.00   },
  NC: { name: "North Carolina", code: "NC", llcFee: 125.00, corpFee: 125.00, annualReportFee: 200.00 },
  ND: { name: "North Dakota",   code: "ND", llcFee: 135.00, corpFee: 100.00, annualReportFee: 50.00  },
  OH: { name: "Ohio",           code: "OH", llcFee: 99.00,  corpFee: 125.00, annualReportFee: 0.00   },
  OK: { name: "Oklahoma",       code: "OK", llcFee: 100.00, corpFee: 50.00,  annualReportFee: 25.00  },
  OR: { name: "Oregon",         code: "OR", llcFee: 100.00, corpFee: 100.00, annualReportFee: 100.00 },
  PA: { name: "Pennsylvania",   code: "PA", llcFee: 125.00, corpFee: 125.00, annualReportFee: 7.00   },
  RI: { name: "Rhode Island",   code: "RI", llcFee: 150.00, corpFee: 230.00, annualReportFee: 50.00  },
  SC: { name: "South Carolina", code: "SC", llcFee: 110.00, corpFee: 135.00, annualReportFee: 0.00   },
  SD: { name: "South Dakota",   code: "SD", llcFee: 165.00, corpFee: 150.00, annualReportFee: 50.00  },
  TN: { name: "Tennessee",      code: "TN", llcFee: 300.00, corpFee: 100.00, annualReportFee: 300.00 },
  TX: { name: "Texas",          code: "TX", llcFee: 300.00, corpFee: 300.00, annualReportFee: 0.00   },
  UT: { name: "Utah",           code: "UT", llcFee: 70.00,  corpFee: 70.00,  annualReportFee: 18.00  },
  VT: { name: "Vermont",        code: "VT", llcFee: 125.00, corpFee: 125.00, annualReportFee: 35.00  },
  VA: { name: "Virginia",       code: "VA", llcFee: 75.00,  corpFee: 75.00,  annualReportFee: 50.00  },
  WA: { name: "Washington",     code: "WA", llcFee: 200.00, corpFee: 200.00, annualReportFee: 71.00  },
  WV: { name: "West Virginia",  code: "WV", llcFee: 100.00, corpFee: 50.00,  annualReportFee: 25.00  },
  WI: { name: "Wisconsin",      code: "WI", llcFee: 130.00, corpFee: 100.00, annualReportFee: 25.00  },
};

export function getStateFeeByName(stateName: string): StateFeeEntry | undefined {
  return Object.values(STATE_FEES).find((s) => s.name === stateName);
}

export function getStateFeeByCode(code: string): StateFeeEntry | undefined {
  return STATE_FEES[code.toUpperCase()];
}

export function calculateOrderTotal(
  selectedState: string,
  entityType: "LLC" | "C-Corp" | string,
  prolifyPlanPrice: number,
  expeditedEinFee: number = 0
): OrderBreakdown {
  const stateEntry =
    getStateFeeByName(selectedState) ??
    getStateFeeByCode(selectedState) ??
    STATE_FEES["WY"];

  const isCorp = entityType === "C-Corp" || entityType === "Corp" || entityType === "Corporation";
  const stateFee = isCorp ? stateEntry.corpFee : stateEntry.llcFee;

  const breakdown: { label: string; amount: number }[] = [
    { label: `${stateEntry.name} State Filing Fee`, amount: stateFee },
    { label: "Prolify Formation Package", amount: prolifyPlanPrice },
  ];

  if (expeditedEinFee > 0) {
    breakdown.push({ label: "Expedited EIN Processing", amount: expeditedEinFee });
  }

  const total = stateFee + prolifyPlanPrice + expeditedEinFee;

  return {
    stateName: stateEntry.name,
    stateCode: stateEntry.code,
    stateFee,
    prolifyFee: prolifyPlanPrice,
    total,
    totalCents: Math.round(total * 100),
    breakdown,
  };
}
