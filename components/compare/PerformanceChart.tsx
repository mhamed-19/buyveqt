"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Card from "@/components/ui/Card";
import SectionHead from "@/components/ui/SectionHead";
import FundLegend from "./FundLegend";
import { FUNDS } from "@/data/funds";
import type { ChartPeriod, DataSourceType } from "@/lib/types";
import { fundColor } from "@/lib/styles";
import { getCached, setCache } from "@/lib/cache";

export type ComparePeriod = "1Y" | "5Y" | "ALL";
const PERIOD_KEYS: ComparePeriod[] = ["1Y", "5Y", "ALL"];

const PERIOD_SUBTITLE: Record<ComparePeriod, string> = {
  "1Y": "Past 12 months, total return",
  "5Y": "Past 5 years, total return",
  ALL: "Since the youngest fund’s inception, total return",
};

interface PerformanceChartProps {
  selected: string[];
  period: ComparePeriod;
  onPeriodChange: (p: ComparePeriod) => void;
}

interface ChartDataPoint {
  date: string;
  [ticker: string]: number | string;
}

interface ChartResponse {
  ticker: string;
  data: { date: string; close: number }[];
  source?: DataSourceType;
}

interface TooltipPayloadItem {
  dataKey: string;
  value: number;
  color: string;
}
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length || !label) return null;
  const date = new Date(label + "T00:00:00");
  return (
    <div
      style={{
        background: "var(--paper-light)",
        border: "1px solid var(--rule-soft)",
        borderRadius: 8,
        padding: "8px 12px",
        boxShadow: "2px 2px 0 var(--ink)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: 11,
          color: "var(--ink-mute)",
          margin: "0 0 6px",
        }}
      >
        {date.toLocaleDateString("en-CA", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
      {payload.map((p) => (
        <p
          key={p.dataKey}
          className="ed-numerals"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            margin: "2px 0",
            fontSize: 13,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 12,
              height: 3,
              background: p.color,
              display: "inline-block",
            }}
          />
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>
            {p.dataKey.replace(".TO", "")}
          </span>
          <span style={{ marginLeft: "auto", color: "var(--ink)" }}>
            {p.value >= 0 ? "+" : ""}
            {p.value.toFixed(2)}%
          </span>
        </p>
      ))}
    </div>
  );
}

/**
 * Multi-line normalized-return chart for the /compare page. Period toggle
 * (1Y / 5Y / ALL) lives in the top-right of the card. Below the chart: a
 * FundLegend + an italic period subtitle. Lines colored by fund via the
 * FUND_COLOR map. Powered by Recharts.
 */
export default function PerformanceChart({
  selected,
  period,
  onPeriodChange,
}: PerformanceChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      const responses: ChartResponse[] = await Promise.all(
        selected.map(async (ticker) => {
          const cacheKey = `chart:${ticker}:${period}`;
          try {
            const res = await fetch(
              `/api/funds/chart/${ticker}?range=${period}`
            );
            if (!res.ok) throw new Error("API error");
            const json = await res.json();
            const arr = json.data as { date: string; close: number }[];
            setCache(cacheKey, arr);
            return {
              ticker,
              data: arr,
              source: json.source as DataSourceType | undefined,
            };
          } catch {
            const cached = getCached<{ date: string; close: number }[]>(
              cacheKey
            );
            return {
              ticker,
              data: cached || [],
              source: "cache" as DataSourceType,
            };
          }
        })
      );

      const normalized: Record<string, Record<string, number>> = {};
      const allDates = new Set<string>();

      for (const { ticker, data } of responses) {
        if (!data.length) continue;
        const startPrice = data[0].close;
        for (const point of data) {
          allDates.add(point.date);
          if (!normalized[point.date]) normalized[point.date] = {};
          normalized[point.date][ticker] =
            ((point.close - startPrice) / startPrice) * 100;
        }
      }

      const sortedDates = Array.from(allDates).sort();
      const merged: ChartDataPoint[] = sortedDates.map((date) => ({
        date,
        ...normalized[date],
      }));
      setChartData(merged);
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
    } finally {
      setLoading(false);
    }
  }, [selected, period]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <SectionHead
          kicker="Performance"
          title="The chart."
          size="md"
          italic={false}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {PERIOD_KEYS.map((p) => {
            const active = p === period;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPeriodChange(p)}
                aria-pressed={active}
                style={{
                  appearance: "none",
                  padding: "6px 14px",
                  borderRadius: 9,
                  cursor: "pointer",
                  background: active ? "var(--ink)" : "transparent",
                  color: active ? "var(--paper-light)" : "var(--ink-soft)",
                  border: active
                    ? "1px solid var(--ink)"
                    : "1px solid var(--rule-soft)",
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 16, marginLeft: -4 }}>
        {loading ? (
          <div className="skeleton" style={{ height: 240, width: "100%" }} />
        ) : chartData.length === 0 ? (
          <div
            style={{
              height: 240,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              color: "var(--ink-mute)",
            }}
          >
            Chart data unavailable for the selected funds.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 6, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="2 4"
                stroke="var(--ink)"
                opacity={0.12}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => {
                  const date = new Date(d + "T00:00:00");
                  return date.toLocaleDateString("en-CA", {
                    month: "short",
                    year: "2-digit",
                  });
                }}
                tick={{ fontSize: 10.5, fill: "var(--ink-mute)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--ink)", strokeOpacity: 0.4 }}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis
                tickFormatter={(v: number) =>
                  `${v >= 0 ? "+" : ""}${v.toFixed(0)}%`
                }
                tick={{ fontSize: 10.5, fill: "var(--ink-mute)" }}
                tickLine={false}
                axisLine={false}
                width={44}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "var(--ink)",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                  opacity: 0.4,
                }}
              />
              {selected.map((ticker) => {
                const short = FUNDS[ticker]?.shortName ?? ticker.replace(".TO", "");
                return (
                  <Line
                    key={ticker}
                    type="monotone"
                    dataKey={ticker}
                    stroke={fundColor(short)}
                    strokeWidth={ticker === "VEQT.TO" ? 2.4 : 1.8}
                    dot={false}
                    connectNulls
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div
        style={{
          marginTop: 14,
          paddingTop: 14,
          borderTop: "1px solid var(--rule-soft)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <FundLegend tickers={selected} />
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 13,
            color: "var(--ink-mute)",
          }}
        >
          {PERIOD_SUBTITLE[period]}
        </span>
      </div>
    </Card>
  );
}
