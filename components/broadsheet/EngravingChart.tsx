"use client";

import { useMemo } from "react";
import type { HistoricalDataPoint, ChartPeriod } from "@/lib/types";

interface EngravingChartProps {
  data: HistoricalDataPoint[];
  period: ChartPeriod;
  onPeriodChange: (p: ChartPeriod) => void;
  loading: boolean;
}

const PERIODS: ChartPeriod[] = ["1M", "3M", "6M", "YTD", "1Y", "3Y", "5Y", "ALL"];

/**
 * A deliberately un-fancy chart. A single hairline stroke, faint graph paper
 * behind it, no gradient fill, no tooltip overlay. Meant to look like a
 * financial-page engraving from a 1950s broadsheet rather than a SaaS widget.
 */
export default function EngravingChart({
  data,
  period,
  onPeriodChange,
  loading,
}: EngravingChartProps) {
  const { path, min, max, firstLabel, lastLabel } = useMemo(() => {
    if (data.length < 2) {
      return { path: "", min: 0, max: 0, firstLabel: "", lastLabel: "" };
    }
    const closes = data.map((d) => d.close);
    const lo = Math.min(...closes);
    const hi = Math.max(...closes);
    const pad = (hi - lo) * 0.08;
    const y0 = lo - pad;
    const y1 = hi + pad;

    const w = 1000;
    const h = 260;
    const len = data.length;
    const points = data.map((d, i) => {
      const x = (i / (len - 1)) * w;
      const y = h - ((d.close - y0) / (y1 - y0)) * h;
      return [x, y] as const;
    });

    let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i][0].toFixed(2)} ${points[i][1].toFixed(2)}`;
    }

    const fmt = (iso: string) =>
      new Date(iso + "T00:00:00").toLocaleDateString("en-CA", {
        month: "short",
        year: "2-digit",
      });

    return {
      path: d,
      min: lo,
      max: hi,
      firstLabel: fmt(data[0].date),
      lastLabel: fmt(data[data.length - 1].date),
    };
  }, [data]);

  return (
    <div>
      {/* Period selector — small caps, clickable */}
      <div className="flex items-center justify-between mb-3">
        <p className="bs-label">The Price &middot; VEQT.TO</p>
        <div className="flex gap-3 bs-label tabular-nums">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`transition-colors hover:text-[var(--stamp)] ${
                p === period
                  ? "text-[var(--stamp)] underline underline-offset-4"
                  : "text-[var(--ink-soft)]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="bs-chart-frame">
        {loading || data.length < 2 ? (
          <div className="h-[260px] flex items-center justify-center">
            <p className="bs-caption">Awaiting the latest tape…</p>
          </div>
        ) : (
          <svg
            viewBox="0 0 1000 260"
            preserveAspectRatio="none"
            className="w-full h-[240px] sm:h-[260px] block"
            role="img"
            aria-label={`VEQT price chart, ${period}`}
          >
            <defs>
              <pattern id="graph-paper" x="0" y="0" width="50" height="26" patternUnits="userSpaceOnUse">
                <path
                  d="M 50 0 L 0 0 0 26"
                  fill="none"
                  stroke="var(--rule)"
                  strokeWidth="0.35"
                  opacity="0.35"
                />
              </pattern>
            </defs>
            <rect width="1000" height="260" fill="url(#graph-paper)" />
            {/* Baseline */}
            <line
              x1="0"
              y1="259"
              x2="1000"
              y2="259"
              stroke="var(--ink)"
              strokeWidth="0.6"
              opacity="0.6"
            />
            {/* The price line itself — hairline ink */}
            <path
              d={path}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1.3"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Caption strip below the engraving */}
        <div className="flex items-center justify-between mt-2 bs-caption">
          <span>{firstLabel || "—"}</span>
          {min > 0 && max > 0 && (
            <span className="bs-numerals text-[11px] text-[var(--ink-soft)]">
              Low ${min.toFixed(2)} &middot; High ${max.toFixed(2)}
            </span>
          )}
          <span>{lastLabel || "—"}</span>
        </div>
      </div>
    </div>
  );
}
