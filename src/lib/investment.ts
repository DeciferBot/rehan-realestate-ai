/**
 * Investment math for property listings — gross/net rental yield, cash-on-cash,
 * and projected ROI over a holding period. Pure module (no server-only / no React)
 * so it can run on the server (card estimates in data.ts) AND in the client
 * (the interactive calculator on the detail page) from the same source of truth.
 *
 * We have no rent figures in the ingested inventory (only price / sqft / beds), so
 * yields are *estimated* from a flat AED/sqft benchmark and shown as a starting
 * point the agent can override in the calculator.
 */

export const DEFAULTS = {
  appreciationPct: 5, // annual capital appreciation, %
  holdingYears: 5, // assumed hold before resale
  downPaymentPct: 20, // cash actually in for cash-on-cash
  serviceChargePerSqft: 18, // AED per sqft per year (maintenance / service charge)
};

// Flat annual-rent benchmark (AED per sqft). Deliberately NOT keyed off the
// cosmetic `image` color placeholder — that would make yields swing arbitrarily
// by card position. This is an honest, consistent starting estimate the agent
// overrides per unit, so yield variation between units reflects only their real
// price/sqft.
export const BASE_RENT_PER_SQFT = 72;

export function estimateAnnualRent(sqft: number): number {
  return Math.round((sqft || 0) * BASE_RENT_PER_SQFT);
}

export function annualServiceCharge(sqft: number, perSqft = DEFAULTS.serviceChargePerSqft): number {
  return Math.round((sqft || 0) * perSqft);
}

export type ReturnInputs = {
  price: number;
  annualRent: number;
  serviceCharge: number;
  appreciationPct: number;
  years: number;
  downPaymentPct: number;
};

export type Returns = {
  grossYieldPct: number;
  netYieldPct: number;
  cashOnCashPct: number; // year-1 net rent / cash invested
  roiTotalPct: number; // total return over `years`, % of price
  roiAnnualizedPct: number;
  capitalGain: number; // AED
  rentalIncome: number; // AED, net, over `years`
  totalProfit: number; // AED
  cashInvested: number; // AED
};

export function computeReturns(i: ReturnInputs): Returns {
  const { price, annualRent, serviceCharge, appreciationPct, years, downPaymentPct } = i;
  const netRent = annualRent - serviceCharge;
  const cashInvested = price * (downPaymentPct / 100);
  const capitalGain = price * (Math.pow(1 + appreciationPct / 100, Math.max(0, years)) - 1);
  const rentalIncome = netRent * Math.max(0, years);
  const totalProfit = capitalGain + rentalIncome;
  const roiTotalPct = price ? (totalProfit / price) * 100 : 0;
  return {
    grossYieldPct: price ? (annualRent / price) * 100 : 0,
    netYieldPct: price ? (netRent / price) * 100 : 0,
    cashOnCashPct: cashInvested ? (netRent / cashInvested) * 100 : 0,
    roiTotalPct,
    roiAnnualizedPct: years ? roiTotalPct / years : 0,
    capitalGain: Math.round(capitalGain),
    rentalIncome: Math.round(rentalIncome),
    totalProfit: Math.round(totalProfit),
    cashInvested: Math.round(cashInvested),
  };
}

/** Starting calculator inputs derived from a listing's price / sqft. */
export function defaultInputs(p: { price: number; sqft: number }): ReturnInputs {
  return {
    price: p.price,
    annualRent: estimateAnnualRent(p.sqft),
    serviceCharge: annualServiceCharge(p.sqft),
    appreciationPct: DEFAULTS.appreciationPct,
    years: DEFAULTS.holdingYears,
    downPaymentPct: DEFAULTS.downPaymentPct,
  };
}

export const round1 = (n: number): number => Math.round(n * 10) / 10;
