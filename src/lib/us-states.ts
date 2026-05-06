import { STATE_FEES } from "@/data/stateFees";

export type USState = {
  name: string;
  code: string;
  fee: number;
  llcFee: number;
  corpFee: number;
  annualReportFee: number;
  recommended?: boolean;
  description?: string;
};

export const usStates: USState[] = Object.values(STATE_FEES).map((s) => ({
  name: s.name,
  code: s.code,
  fee: s.llcFee,
  llcFee: s.llcFee,
  corpFee: s.corpFee,
  annualReportFee: s.annualReportFee,
  recommended: s.recommended,
  description: s.description,
}));

export const getRecommendedState = (): USState => {
  return usStates.find((state) => state.recommended) || usStates[0];
};

export const getStateByName = (name: string): USState | undefined => {
  return usStates.find((state) => state.name === name);
};

export const getStateByCode = (code: string): USState | undefined => {
  return usStates.find((state) => state.code === code.toUpperCase());
};
