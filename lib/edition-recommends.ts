/**
 * Picks the day's "further reading" article — surfaced as a small tail on
 * the SeverityMeter's editorial sentence. The pool is keyed to the day's
 * character (zone × direction) so the link fits the kind of session the
 * reader is having; the pick rotates deterministically on `dateKey` so
 * it's stable for a session but varies day-to-day, broadening which
 * archive pieces appear on the home page over time.
 */
import type { SeverityReading, SeverityZone } from "@/lib/severity";

export type Direction = "up" | "down" | "flat";

export interface FurtherReading {
  href: string;
  label: string;
}

interface ArticleRef {
  slug: string;
  label: string;
}

const ARTICLE_LIBRARY: Record<string, ArticleRef> = {
  "why-timing-the-market-fails": {
    slug: "why-timing-the-market-fails",
    label: "Why timing the market fails",
  },
  "passive-investing-behavioral-edge": {
    slug: "passive-investing-behavioral-edge",
    label: "The behavioural edge of passive investing",
  },
  "automate-veqt-purchases": {
    slug: "automate-veqt-purchases",
    label: "Put your VEQT buys on autopilot",
  },
  "veqt-mer-true-cost": {
    slug: "veqt-mer-true-cost",
    label: "What VEQT's MER actually costs you",
  },
  "veqt-distributions-explained": {
    slug: "veqt-distributions-explained",
    label: "VEQT distributions, explained",
  },
  "veqt-decision-flowchart": {
    slug: "veqt-decision-flowchart",
    label: "I have money to invest — what now?",
  },
  "why-stocks-go-up": {
    slug: "why-stocks-go-up",
    label: "Why stocks go up over decades",
  },
  "veqt-vs-vfv": {
    slug: "veqt-vs-vfv",
    label: "VEQT vs VFV: don't just chase the S&P 500",
  },
  "veqt-vs-vgro": {
    slug: "veqt-vs-vgro",
    label: "VEQT vs VGRO: do you want bonds in the mix?",
  },
  "veqt-is-down": {
    slug: "veqt-is-down",
    label: "VEQT is down — what now?",
  },
  "veqt-currency-risk": {
    slug: "veqt-currency-risk",
    label: "How the loonie moves your VEQT",
  },
  "lump-sum-vs-dca": {
    slug: "lump-sum-vs-dca",
    label: "Lump sum vs. DCA on a drawdown",
  },
};

const POOLS: Record<SeverityZone, Record<Direction, readonly string[]>> = {
  Typical: {
    up: [
      "why-timing-the-market-fails",
      "automate-veqt-purchases",
      "veqt-mer-true-cost",
      "passive-investing-behavioral-edge",
    ],
    down: [
      "why-timing-the-market-fails",
      "passive-investing-behavioral-edge",
      "automate-veqt-purchases",
      "veqt-mer-true-cost",
    ],
    flat: [
      "why-timing-the-market-fails",
      "passive-investing-behavioral-edge",
      "veqt-distributions-explained",
      "automate-veqt-purchases",
    ],
  },
  Notable: {
    up: [
      "why-timing-the-market-fails",
      "passive-investing-behavioral-edge",
      "veqt-vs-vfv",
      "automate-veqt-purchases",
    ],
    down: [
      "veqt-is-down",
      "passive-investing-behavioral-edge",
      "why-timing-the-market-fails",
      "veqt-decision-flowchart",
    ],
    flat: [
      "passive-investing-behavioral-edge",
      "why-timing-the-market-fails",
      "veqt-currency-risk",
      "automate-veqt-purchases",
    ],
  },
  Unusual: {
    up: [
      "why-stocks-go-up",
      "why-timing-the-market-fails",
      "passive-investing-behavioral-edge",
      "veqt-vs-vfv",
    ],
    down: [
      "veqt-is-down",
      "why-stocks-go-up",
      "passive-investing-behavioral-edge",
      "lump-sum-vs-dca",
    ],
    flat: [
      "passive-investing-behavioral-edge",
      "veqt-currency-risk",
      "why-stocks-go-up",
      "why-timing-the-market-fails",
    ],
  },
  Rare: {
    up: [
      "why-stocks-go-up",
      "passive-investing-behavioral-edge",
      "why-timing-the-market-fails",
      "veqt-vs-vfv",
    ],
    down: [
      "veqt-is-down",
      "why-stocks-go-up",
      "passive-investing-behavioral-edge",
      "lump-sum-vs-dca",
    ],
    flat: [
      "passive-investing-behavioral-edge",
      "veqt-currency-risk",
      "why-stocks-go-up",
      "why-timing-the-market-fails",
    ],
  },
};

function direction(changePercent: number): Direction {
  if (changePercent > 0.1) return "up";
  if (changePercent < -0.1) return "down";
  return "flat";
}

// FNV-1a — small, fast, no deps. We only need a stable index from a string.
function fnv1aHash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export interface FurtherReadingInputs {
  reading: SeverityReading;
  /** YYYY-MM-DD seed for deterministic article rotation. */
  dateKey: string;
}

export function pickFurtherReading({
  reading,
  dateKey,
}: FurtherReadingInputs): FurtherReading {
  const dir = direction(reading.todayChangePercent);
  const pool = POOLS[reading.zone][dir];
  const idx = fnv1aHash(`${dateKey}|article`) % pool.length;
  const article = ARTICLE_LIBRARY[pool[idx]];
  return {
    href: `/learn/${article.slug}`,
    label: article.label,
  };
}
