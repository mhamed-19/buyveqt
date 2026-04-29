export interface PricePoint {
  date: string;
  /** Adjusted close, or close — caller decides which series to pass. */
  adjustedClose: number;
}

export interface CohortPathPoint {
  /** Months from this cohort's start (0 = start). */
  m: number;
  /** Portfolio value in CAD at this point. */
  v: number;
}

export interface Cohort {
  /** ISO yyyy-mm of the cohort's start month. */
  startMonth: string;
  /** End month — for lumpsum this is the latest available; for DCA it's start + durationMonths. */
  endMonth: string;
  /** Final portfolio value, in CAD. */
  finalValue: number;
  /** Total invested, in CAD. */
  totalInvested: number;
  /**
   * Sampled monthly path of portfolio value. For lumpsum it's
   * `amount * priceAt[m] / priceAt[0]` per month. For DCA it's the
   * cumulative-shares × price-now math.
   */
  path: CohortPathPoint[];
}

export type CalcMode = "lumpsum" | "dca";

/**
 * Index a price series by yyyy-mm (using the first trading day of
 * each month). Returns a Map keyed by month, value = first day's
 * close.
 */
function monthlyIndex(series: PricePoint[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const pt of series) {
    const ym = pt.date.slice(0, 7);
    if (!out.has(ym)) out.set(ym, pt.adjustedClose);
  }
  return out;
}

/**
 * Add `n` months to a `yyyy-mm` string and return the result.
 */
function addMonths(ym: string, n: number): string {
  const [y, m] = ym.split("-").map(Number);
  const total = (y * 12 + (m - 1)) + n;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny.toString().padStart(4, "0")}-${nm.toString().padStart(2, "0")}`;
}

/**
 * Generate every monthly cohort in `series`. For lumpsum, every
 * starting month is a cohort that runs to the latest available
 * month. For DCA, every starting month with `durationMonths` of
 * trailing data is a cohort; incomplete cohorts (started too
 * recently to have completed `durationMonths`) are excluded.
 */
export function computeCohorts(
  mode: CalcMode,
  amount: number,
  durationMonths: number,
  series: PricePoint[]
): Cohort[] {
  const monthly = monthlyIndex(series);
  const months = Array.from(monthly.keys()).sort();
  if (months.length === 0) return [];

  const lastMonth = months[months.length - 1];
  const lastPrice = monthly.get(lastMonth)!;

  const cohorts: Cohort[] = [];

  if (mode === "lumpsum") {
    for (const startMonth of months) {
      const startPrice = monthly.get(startMonth);
      if (!startPrice || startPrice <= 0) continue;
      const shares = amount / startPrice;
      const path: CohortPathPoint[] = [];
      let m = 0;
      let cur = startMonth;
      while (cur <= lastMonth) {
        const price = monthly.get(cur);
        if (price !== undefined) {
          path.push({ m, v: shares * price });
        }
        m += 1;
        cur = addMonths(startMonth, m);
      }
      const finalValue = shares * lastPrice;
      cohorts.push({
        startMonth,
        endMonth: lastMonth,
        finalValue,
        totalInvested: amount,
        path,
      });
    }
  } else {
    // DCA: contribute `amount` per month for `durationMonths` months.
    // Final value = sum_{k=0..D-1} amount * priceAtEnd / priceAt(start+k).
    if (durationMonths <= 0) return [];
    for (const startMonth of months) {
      const endMonth = addMonths(startMonth, durationMonths - 1);
      if (endMonth > lastMonth) break; // Cohort hasn't completed.
      let shares = 0;
      const path: CohortPathPoint[] = [];
      for (let k = 0; k < durationMonths; k++) {
        const cur = addMonths(startMonth, k);
        const price = monthly.get(cur);
        if (price === undefined || price <= 0) break;
        shares += amount / price;
        path.push({ m: k, v: shares * price });
      }
      const endPrice = monthly.get(endMonth);
      if (endPrice === undefined) continue;
      const finalValue = shares * endPrice;
      cohorts.push({
        startMonth,
        endMonth,
        finalValue,
        totalInvested: amount * durationMonths,
        path,
      });
    }
  }

  return cohorts;
}

/**
 * Pick the cohort whose start month best matches a target ISO date.
 * If none match, returns null.
 */
export function findUserCohort(
  cohorts: Cohort[],
  startDate: string
): Cohort | null {
  const ym = startDate.slice(0, 7);
  return cohorts.find((c) => c.startMonth === ym) ?? null;
}

/**
 * Summary stats for the fan-chart UI.
 */
export interface CohortStats {
  median: number;
  worstCase: Cohort | null;
  bestCase: Cohort | null;
  /** How many cohorts had a `finalValue` lower than `userValue`. */
  countBelow: number;
  /** How many cohorts had a `finalValue` higher than `userValue`. */
  countAbove: number;
  /** Total cohorts, excluding the user's. */
  totalOthers: number;
}

export function computeStats(
  cohorts: Cohort[],
  userValue: number | null
): CohortStats {
  if (cohorts.length === 0) {
    return {
      median: 0,
      worstCase: null,
      bestCase: null,
      countBelow: 0,
      countAbove: 0,
      totalOthers: 0,
    };
  }
  const sorted = [...cohorts].sort((a, b) => a.finalValue - b.finalValue);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0
      ? (sorted[mid - 1].finalValue + sorted[mid].finalValue) / 2
      : sorted[mid].finalValue;

  let countBelow = 0;
  let countAbove = 0;
  let totalOthers = 0;
  if (userValue !== null) {
    for (const c of cohorts) {
      if (c.finalValue === userValue) continue;
      totalOthers += 1;
      if (c.finalValue < userValue) countBelow += 1;
      else countAbove += 1;
    }
  }

  return {
    median,
    worstCase: sorted[0],
    bestCase: sorted[sorted.length - 1],
    countBelow,
    countAbove,
    totalOthers,
  };
}
