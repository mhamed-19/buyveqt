import data from "./data/holdings-2026-q1.json";

export interface RegionWeight {
  name: string;
  code: "US" | "CA" | "DEV" | "EM";
  weight: number;
  count: number;
}

export interface TopName {
  ticker: string;
  name: string;
  weight: number;
  region: RegionWeight["code"];
}

export interface HoldingsData {
  asOf: string;
  totalNames: number;
  regions: RegionWeight[];
  topNames: TopName[];
}

export interface LongTail {
  /** Number of explicitly-listed top names (= cut-off rank). */
  cutoffRank: number;
  /** Combined weight of the explicitly-listed top names. */
  cutoffWeight: number;
  /** Count of holdings *not* in the listed top — the long tail. */
  tailNames: number;
  /** Combined weight of those tail holdings (≈ 1 − cutoffWeight). */
  tailWeight: number;
  /**
   * The handful of headline names whose combined weight beats the tail.
   * Defaults to whatever leading slice of `topNames` first sums to ≥
   * `tailWeight`, capped at 5. Powers the closing sentence.
   */
  headlineCount: number;
  headlineNames: string[];
  headlineWeight: number;
}

/**
 * Compute the "long tail" rollup that powers the panel's closing
 * sentence. The headline slice is whatever prefix of the top names is
 * needed to outweigh the entire tail — usually two or three names. If
 * even five names don't beat the tail, falls back to the top three so
 * the sentence still has a stable subject.
 */
export function computeLongTail(d: HoldingsData): LongTail {
  const cutoffRank = d.topNames.length;
  const cutoffWeight = d.topNames.reduce((s, n) => s + n.weight, 0);
  const tailWeight = Math.max(0, 1 - cutoffWeight);
  const tailNames = Math.max(0, d.totalNames - cutoffRank);

  let headlineCount = 3;
  let headlineWeight = 0;
  for (let i = 1; i <= Math.min(5, d.topNames.length); i++) {
    const slice = d.topNames.slice(0, i);
    const w = slice.reduce((s, n) => s + n.weight, 0);
    if (w >= tailWeight) {
      headlineCount = i;
      headlineWeight = w;
      break;
    }
    headlineWeight = w;
    headlineCount = i;
  }

  return {
    cutoffRank,
    cutoffWeight,
    tailNames,
    tailWeight,
    headlineCount,
    headlineWeight,
    headlineNames: d.topNames.slice(0, headlineCount).map((n) => n.name),
  };
}

/**
 * Format a list of names as English: ["Apple"] → "Apple", ["Apple",
 * "Microsoft"] → "Apple and Microsoft", three or more → Oxford comma
 * with "and" before the last.
 */
export function joinNames(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export const HOLDINGS: HoldingsData = data as HoldingsData;
