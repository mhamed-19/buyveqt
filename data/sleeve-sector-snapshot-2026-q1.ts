/**
 * Static sleeve sector / country snapshot used as a fallback when the live
 * /api/sector-returns hook returns nothing. Each entry is one sleeve and a
 * list of representative sector (or country) names + a recent daily return
 * in percent.
 *
 * These come from the round-4 design comp and Vanguard's most recent
 * factsheet for the underlying ETF. Update quarterly when new factsheets
 * arrive — the goal is to give the page something realistic to render
 * during the brief window between deployment and the live feed warming up.
 */
export interface SleeveSectorRow {
  name: string;
  /** Daily percent return for the sector / country. */
  pct: number;
}

export const SLEEVE_SECTOR_SNAPSHOT_2026_Q1: Record<string, SleeveSectorRow[]> = {
  VUN: [
    { name: "Information Tech", pct: 0.82 },
    { name: "Financials", pct: 0.41 },
    { name: "Health Care", pct: -0.22 },
    { name: "Consumer Discr.", pct: 0.18 },
  ],
  VCN: [
    { name: "Financials", pct: 0.12 },
    { name: "Energy", pct: -0.84 },
    { name: "Materials", pct: -0.31 },
    { name: "Industrials", pct: -0.05 },
  ],
  VIU: [
    { name: "Industrials", pct: 0.41 },
    { name: "Health Care", pct: 0.29 },
    { name: "Financials", pct: 0.18 },
    { name: "Consumer Discr.", pct: -0.08 },
  ],
  VEE: [
    { name: "Information Tech", pct: 0.21 },
    { name: "Financials", pct: -0.11 },
    { name: "Consumer Discr.", pct: 0.08 },
    { name: "Materials", pct: -0.04 },
  ],
};

/** ISO date for the snapshot. Bump whenever the values change. */
export const SLEEVE_SECTOR_SNAPSHOT_AS_OF = "2026-Q1";
