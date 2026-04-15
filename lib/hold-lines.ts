/**
 * "The Hold Line" — rotating one-liners surfaced in the Daily Pulse band.
 *
 * Goal: give a long-term investor a calm, true-sounding sentence regardless
 * of what the market did today. No happy-talk, no doomerism — just the
 * perspective you wish someone had handed you on your first red day.
 *
 * Categorised so we can bias the pick later (e.g. lean "red" on down days).
 */

export type HoldLineMood = "normal" | "red" | "milestone";

export interface HoldLine {
  text: string;
  mood: HoldLineMood;
}

export const HOLD_LINES: readonly HoldLine[] = [
  // Normal — the evergreen line on any green or flat day
  { text: "Time in the market beats timing the market.", mood: "normal" },
  {
    text: "You own 13,700+ companies in 50+ countries. One headline doesn't change that.",
    mood: "normal",
  },
  {
    text: "Rebalancing happens automatically inside the fund. Your only job is not to sell.",
    mood: "normal",
  },
  {
    text: "The boring strategy is the one that works. VEQT is the boring strategy.",
    mood: "normal",
  },

  // Red — pulled out on down days
  {
    text: "Red days are the price of admission. Stay in the building.",
    mood: "red",
  },
  {
    text: "VEQT has survived every drawdown since inception, and will survive the next one.",
    mood: "red",
  },
  {
    text: "The headline is noise. Your 20-year return is the signal.",
    mood: "red",
  },
  {
    text: "Volatility is the toll. Compounding is the destination.",
    mood: "red",
  },

  // Milestone — lean philosophical, good for any day
  {
    text: "The best investment is the one you'll hold through the bad years.",
    mood: "milestone",
  },
  {
    text: "Buying more during drawdowns is how passive investors quietly get rich.",
    mood: "milestone",
  },
  {
    text: "A globally diversified portfolio is the closest thing to a free lunch in investing.",
    mood: "milestone",
  },
  {
    text: "If you have to ask whether to sell, the answer is no.",
    mood: "milestone",
  },
];

/**
 * Pick a hold line. When `dailyChangePercent` is known, bias toward the
 * appropriate mood; otherwise return any line uniformly. The caller supplies
 * a random seed (typically Math.random()) so this remains pure/testable.
 */
export function pickHoldLine(
  random: number,
  dailyChangePercent?: number | null
): HoldLine {
  let pool: readonly HoldLine[] = HOLD_LINES;

  // On visible down days (> 0.5% decline), lean into "red" and "milestone" lines.
  if (typeof dailyChangePercent === "number" && dailyChangePercent <= -0.5) {
    const preferred = HOLD_LINES.filter(
      (l) => l.mood === "red" || l.mood === "milestone"
    );
    if (preferred.length > 0) pool = preferred;
  }

  const idx = Math.floor(random * pool.length) % pool.length;
  return pool[idx];
}
