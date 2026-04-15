"use client";

import { useEffect, useState } from "react";
import DataFreshness from "@/components/ui/DataFreshness";

interface Region {
  ticker: string;
  region: string;
  label: string;
  weight: number;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  contribution: number | null;
  source: "alpha-vantage" | "yahoo-finance" | "cache" | null;
  fetchedAt: string | null;
  error: boolean;
}

interface RegionsPayload {
  regions: Region[];
  fetchedAt: string;
}

const REFRESH_MS = 5 * 60 * 1000;

function formatPct(val: number | null): string {
  if (val === null || Number.isNaN(val)) return "\u2014";
  const sign = val >= 0 ? "+" : "\u2212";
  return `${sign}${Math.abs(val).toFixed(2)}%`;
}

function formatBps(val: number | null): string {
  // Contribution in percentage points — e.g. US +0.48% x 43% = +0.21pp
  if (val === null || Number.isNaN(val)) return "\u2014";
  const sign = val >= 0 ? "+" : "\u2212";
  return `${sign}${Math.abs(val).toFixed(2)}pp`;
}

export default function RegionalAttribution() {
  const [payload, setPayload] = useState<RegionsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/regions");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: RegionsPayload = await res.json();
        if (!cancelled) {
          setPayload(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const regions = payload?.regions ?? [];
  // Any successful region quote: show its fetchedAt as representative freshness.
  const firstGood = regions.find((r) => !r.error && r.source && r.fetchedAt);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <p className="section-label">The Regions</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Today's contribution to VEQT by geographic sleeve
          </p>
        </div>
        {firstGood?.source && firstGood?.fetchedAt && (
          <DataFreshness
            source={firstGood.source}
            fetchedAt={firstGood.fetchedAt}
            compact
          />
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading && regions.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="card-editorial p-4 space-y-2"
                aria-busy="true"
              >
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-6 w-20 rounded" />
                <div className="skeleton h-3 w-24 rounded" />
              </div>
            ))
          : regions.map((r) => {
              const pos =
                r.changePercent !== null && r.changePercent >= 0;
              const contribPos =
                r.contribution !== null && r.contribution >= 0;

              return (
                <div key={r.ticker} className="card-editorial p-4 flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      {r.label}
                    </p>
                    <span className="text-[10px] text-[var(--color-text-muted)] tabular-nums">
                      {r.weight}%
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                      {r.ticker}
                    </span>
                    {r.error ? (
                      <span className="text-sm text-[var(--color-text-muted)]">
                        data unavailable
                      </span>
                    ) : (
                      <span
                        className={`text-lg font-bold tabular-nums ${
                          pos
                            ? "text-[var(--color-positive)]"
                            : "text-[var(--color-negative)]"
                        }`}
                      >
                        {formatPct(r.changePercent)}
                      </span>
                    )}
                  </div>

                  {!r.error && (
                    <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-2">
                      <span>contributes</span>
                      <span
                        className={`tabular-nums font-medium ${
                          contribPos
                            ? "text-[var(--color-positive)]"
                            : "text-[var(--color-negative)]"
                        }`}
                      >
                        {formatBps(r.contribution)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
}
