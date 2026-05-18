"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import SectionLabel from "@/components/ui/SectionLabel";
import { FUNDS } from "@/data/funds";
import type { ComparePeriod } from "./PerformanceChart";

interface CompareGapProps {
  selected: string[];
  period: ComparePeriod;
}

interface GapStats {
  /** Last spread A − B in pp (positive = A leads). */
  lastSpread: number;
  /** Mean of |A − B|. */
  avgGap: number;
  /** Best day for fund A (highest daily delta A − B). */
  bestDayA: number;
  /** Worst day (most negative daily delta A − B). */
  worstGap: number;
  /** Days A out-performed B / total days with both fund returns. */
  daysAWon: number;
  totalDays: number;
}

const PERIOD_LABEL: Record<ComparePeriod, string> = {
  "1Y": "1Y",
  "5Y": "5Y",
  ALL: "ALL",
};

function fmtPct(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  const sign = n >= 0 ? "+" : "−";
  return `${sign}${Math.abs(n).toFixed(digits)}%`;
}

function fmtPp(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return "—";
  const sign = n >= 0 ? "+" : "−";
  return `${sign}${Math.abs(n).toFixed(digits)} pp`;
}

/**
 * "The Gap" card — only renders when exactly two funds are selected. Card
 * has a vermilion left stripe (Card accent). Inside:
 *   - Section label "The Gap · 1Y"
 *   - Italic headline: "XEQT beat VEQT by 0.2 pp." (templated)
 *   - 4-tile grid: avg daily gap, best day for A, A beat B (X of N), worst gap
 */
export default function CompareGap({ selected, period }: CompareGapProps) {
  const [gap, setGap] = useState<GapStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const tickerA = selected[0];
  const tickerB = selected[1];
  const enabled = selected.length === 2 && !!tickerA && !!tickerB;

  useEffect(() => {
    if (!enabled) {
      setGap(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
    Promise.all([
      fetch(`/api/funds/chart/${tickerA}?range=${period}`).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch(`/api/funds/chart/${tickerB}?range=${period}`).then((r) =>
        r.ok ? r.json() : null
      ),
    ])
      .then(([resA, resB]) => {
        if (cancelled) return;
        const a = (resA?.data ?? []) as { date: string; close: number }[];
        const b = (resB?.data ?? []) as { date: string; close: number }[];
        if (a.length < 2 || b.length < 2) {
          setError(true);
          setLoading(false);
          return;
        }
        const aBase = a[0].close;
        const bBase = b[0].close;
        const bByDate = new Map(b.map((p) => [p.date, p.close]));

        const spreads: number[] = [];
        for (const p of a) {
          const bClose = bByDate.get(p.date);
          if (bClose === undefined) continue;
          const aRet = ((p.close - aBase) / aBase) * 100;
          const bRet = ((bClose - bBase) / bBase) * 100;
          spreads.push(aRet - bRet);
        }
        if (spreads.length < 2) {
          setError(true);
          setLoading(false);
          return;
        }

        // Daily deltas — A's daily move minus B's daily move on the same date
        const dailyDeltas: number[] = [];
        let daysAWon = 0;
        let prev: { aClose: number; bClose: number } | null = null;
        for (const p of a) {
          const bClose = bByDate.get(p.date);
          if (bClose === undefined) continue;
          if (prev) {
            const aDay = ((p.close - prev.aClose) / prev.aClose) * 100;
            const bDay = ((bClose - prev.bClose) / prev.bClose) * 100;
            const delta = aDay - bDay;
            dailyDeltas.push(delta);
            if (delta > 0) daysAWon += 1;
          }
          prev = { aClose: p.close, bClose };
        }

        const avgGap =
          dailyDeltas.length > 0
            ? dailyDeltas.reduce((s, x) => s + Math.abs(x), 0) /
              dailyDeltas.length
            : 0;
        const bestDayA =
          dailyDeltas.length > 0 ? Math.max(...dailyDeltas) : 0;
        const worstGap =
          dailyDeltas.length > 0 ? Math.min(...dailyDeltas) : 0;

        setGap({
          lastSpread: spreads[spreads.length - 1],
          avgGap,
          bestDayA,
          worstGap,
          daysAWon,
          totalDays: dailyDeltas.length,
        });
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tickerA, tickerB, period, enabled]);

  if (!enabled) return null;

  const fundA = FUNDS[tickerA];
  const fundB = FUNDS[tickerB];
  if (!fundA || !fundB) return null;

  const shortA = fundA.shortName;
  const shortB = fundB.shortName;
  const periodLabel = PERIOD_LABEL[period];

  let headline: string;
  if (loading) {
    headline = `${shortA} vs ${shortB}…`;
  } else if (error || !gap) {
    headline = `${shortA} × ${shortB}.`;
  } else {
    const aLeads = gap.lastSpread >= 0;
    const winner = aLeads ? shortA : shortB;
    const loser = aLeads ? shortB : shortA;
    headline = `${winner} beat ${loser} by ${Math.abs(gap.lastSpread).toFixed(1)} pp.`;
  }

  const tiles = gap
    ? [
        { l: "Avg daily gap", v: fmtPct(gap.avgGap) },
        { l: `Best day for ${shortA}`, v: fmtPct(gap.bestDayA) },
        {
          l: `${shortA} beat ${shortB}`,
          v: `${gap.daysAWon} / ${gap.totalDays}`,
        },
        { l: "Worst gap", v: fmtPp(gap.worstGap) },
      ]
    : [
        { l: "Avg daily gap", v: "—" },
        { l: `Best day for ${shortA}`, v: "—" },
        { l: `${shortA} beat ${shortB}`, v: "—" },
        { l: "Worst gap", v: "—" },
      ];

  return (
    <Card accent style={{ paddingLeft: 23 }}>
      <SectionLabel>The Gap · {periodLabel}</SectionLabel>
      <div
        className="ed-display-italic"
        style={{
          fontSize: 26,
          lineHeight: 1.1,
          marginTop: 10,
          letterSpacing: "-0.018em",
          color: "var(--ink)",
        }}
      >
        {headline}
      </div>
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--ink-soft)",
          margin: "10px 0 0",
        }}
      >
        Daily moves over the period. The headline is the cumulative spread on
        the last session.
      </p>

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {tiles.map((t) => (
          <div
            key={t.l}
            style={{
              padding: "10px 12px",
              background: "var(--paper-warm)",
              borderRadius: 10,
            }}
          >
            <div className="ed-label" style={{ color: "var(--ink-mute)" }}>
              {t.l}
            </div>
            <div
              className="ed-numerals"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: 18,
                marginTop: 4,
                color: "var(--ink)",
              }}
            >
              {t.v}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
