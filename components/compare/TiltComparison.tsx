import { COMPARE_TILTS, FUND_CODES } from "@/lib/compare-events";

const SEGMENTS: { key: keyof (typeof COMPARE_TILTS)["VEQT"]; label: string; fill: string }[] = [
  { key: "us", label: "US", fill: "var(--stamp)" },
  { key: "ca", label: "Canada", fill: "var(--ink)" },
  { key: "dev", label: "Dev. ex-US", fill: "var(--ink-mute)" },
  { key: "em", label: "Emerging", fill: "var(--rule)" },
];

function fmtPct(v: number): string {
  return `${(v * 100).toFixed(0)}%`;
}

/**
 * Three rows, one per fund. Each row is a stacked 100% bar split
 * into the four regional sleeves. The same color legend as the home
 * `TiltBar` (CL-08); a small inline legend sits below the rows.
 */
export default function TiltComparison() {
  return (
    <section className="bs-enter" aria-labelledby="tilt-heading">
      <p className="bs-stamp mb-2">What's inside each one</p>
      <h2
        id="tilt-heading"
        className="bs-display text-[1.5rem] sm:text-[1.875rem] leading-[1.1] mb-2"
        style={{ color: "var(--ink)" }}
      >
        Same world. Different weights.
      </h2>
      <p
        className="bs-body italic max-w-[60ch] mb-5 text-[0.9375rem]"
        style={{ color: "var(--ink-soft)" }}
      >
        VEQT carries Canada heavier than the others. ZEQT leans more on
        Developed-ex-US. XEQT carries the most US.
      </p>

      <div className="border-t border-b border-[var(--ink)]">
        {FUND_CODES.map((ticker) => {
          const w = COMPARE_TILTS[ticker];
          return (
            <div
              key={ticker}
              className="grid grid-cols-[64px_1fr] items-center gap-4 py-3 border-b border-[color:var(--rule)] last:border-b-0"
            >
              <span
                className="bs-display text-[0.9375rem] sm:text-[1rem]"
                style={{ color: "var(--ink)", fontWeight: 600 }}
              >
                {ticker}
              </span>
              <div
                className="flex h-[14px] w-full overflow-hidden border border-[color:var(--rule)]"
                role="img"
                aria-label={`${ticker} regional tilt: US ${fmtPct(w.us)}, Canada ${fmtPct(w.ca)}, Developed ${fmtPct(w.dev)}, Emerging ${fmtPct(w.em)}`}
              >
                {SEGMENTS.map((seg) => {
                  const pct = w[seg.key];
                  if (pct <= 0) return null;
                  return (
                    <span
                      key={seg.key}
                      className="h-full flex items-center justify-center text-[9px] tabular-nums whitespace-nowrap overflow-hidden"
                      style={{
                        width: `${pct * 100}%`,
                        backgroundColor: seg.fill,
                        color: "var(--paper)",
                        letterSpacing: "0.04em",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {pct >= 0.12 ? fmtPct(pct) : ""}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <p
        className="bs-label mt-3 flex flex-wrap items-center gap-x-4 gap-y-1"
        style={{ color: "var(--ink-mute)" }}
      >
        {SEGMENTS.map((seg) => (
          <span key={seg.key} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="inline-block w-2.5 h-2.5"
              style={{ backgroundColor: seg.fill }}
            />
            {seg.label}
          </span>
        ))}
      </p>
    </section>
  );
}
