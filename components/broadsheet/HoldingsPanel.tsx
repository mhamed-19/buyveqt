import {
  HOLDINGS,
  computeLongTail,
  joinNames,
  type RegionWeight,
} from "@/lib/holdings";

const VIEW_W = 480;
const VIEW_H = 200;

interface TreemapCell {
  code: RegionWeight["code"];
  name: string;
  weight: number;
  count: number;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
}

/**
 * Lay out the four regional cells inside a fixed rectangle. The
 * algorithm is hand-rolled for exactly four leaves (US / CA / DEV /
 * EM): EM gets a thin bottom strip; US sits left of the remainder;
 * Canada stacks above Developed-ex-US on the right. With the Q1 2026
 * weights this produces a layout where the Canadian sleeve and the
 * developed-international sleeve sit beside the US block and the
 * emerging-markets weight gets its own ledger line — so the picture
 * reads as "mostly North American, with a strip of the rest of the
 * world."
 */
function layoutTreemap(regions: RegionWeight[]): TreemapCell[] {
  const byCode = new Map(regions.map((r) => [r.code, r]));
  const us = byCode.get("US");
  const ca = byCode.get("CA");
  const dev = byCode.get("DEV");
  const em = byCode.get("EM");
  if (!us || !ca || !dev || !em) return [];

  const fills: Record<RegionWeight["code"], string> = {
    US: "var(--stamp)",
    CA: "color-mix(in oklab, var(--stamp) 70%, var(--ink) 30%)",
    DEV: "var(--ink-soft)",
    EM: "var(--ink-mute)",
  };

  // EM as the bottom strip — its weight times total height.
  const emH = Math.max(8, Math.round(VIEW_H * em.weight));
  const upperH = VIEW_H - emH;
  const upperWeight = us.weight + ca.weight + dev.weight;

  // US fills the left of the upper rectangle.
  const usW = Math.round(VIEW_W * (us.weight / upperWeight));
  const rightW = VIEW_W - usW;

  // Canada sits on top of Developed-ex-US in the right column.
  const rightWeight = ca.weight + dev.weight;
  const caH = Math.round(upperH * (ca.weight / rightWeight));
  const devH = upperH - caH;

  return [
    { ...us, x: 0, y: 0, w: usW, h: upperH, fill: fills.US },
    { ...ca, x: usW, y: 0, w: rightW, h: caH, fill: fills.CA },
    { ...dev, x: usW, y: caH, w: rightW, h: devH, fill: fills.DEV },
    { ...em, x: 0, y: upperH, w: VIEW_W, h: emH, fill: fills.EM },
  ];
}

function fmtPct(w: number, digits = 1): string {
  return `${(w * 100).toFixed(digits)}%`;
}

function fmtCount(n: number): string {
  return n.toLocaleString("en-CA");
}

/**
 * "What you actually own" — the home-page panel that opens up VEQT's
 * insides. A four-leaf regional treemap on the left, the published top
 * names on the right, and a single closing sentence underneath that
 * quantifies the long tail. All numbers come from
 * lib/data/holdings-2026-q1.json; the long-tail headline is computed,
 * not hardcoded, so swapping the data file updates the prose.
 */
export default function HoldingsPanel() {
  const cells = layoutTreemap(HOLDINGS.regions);
  const tail = computeLongTail(HOLDINGS);
  const topWeight = Math.max(...HOLDINGS.topNames.map((n) => n.weight));

  return (
    <section
      className="py-8 sm:py-12 bs-enter"
      aria-labelledby="holdings-heading"
    >
      <div className="mb-6 sm:mb-8">
        <p className="bs-stamp mb-2">The Holdings</p>
        <h3
          id="holdings-heading"
          className="bs-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1]"
        >
          Inside the ticker.{" "}
          <span className="tabular-nums">
            {fmtCount(HOLDINGS.totalNames)}
          </span>{" "}
          names.
        </h3>
        <p
          className="bs-body italic mt-3 max-w-[60ch]"
          style={{ color: "var(--ink-soft)" }}
        >
          One ETF; thousands of companies, in proportion to the world's
          public market. As of {HOLDINGS.asOf}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* ── Treemap ────────────────────────────────────────────── */}
        <figure className="lg:col-span-7" aria-label="Regional weights">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
            className="block w-full h-[200px] sm:h-[240px]"
            role="img"
            aria-labelledby="treemap-title"
          >
            <title id="treemap-title">
              VEQT regional weights:{" "}
              {cells
                .map((c) => `${c.name} ${fmtPct(c.weight, 0)}`)
                .join(", ")}
              .
            </title>
            {cells.map((c) => {
              const labelTop = c.y + 18;
              const numberTop = c.y + 44;
              const noteTop = c.y + c.h - 10;
              const labelX = c.x + 10;
              const showNumber = c.h >= 36;
              const showNote = c.h >= 56 && c.w >= 90;
              return (
                <g key={c.code}>
                  <rect
                    x={c.x}
                    y={c.y}
                    width={c.w}
                    height={c.h}
                    fill={c.fill}
                  >
                    <title>
                      {c.name}: {fmtPct(c.weight)} of the fund,{" "}
                      {fmtCount(c.count)} holdings
                    </title>
                  </rect>
                  <text
                    x={labelX}
                    y={labelTop}
                    fill="var(--paper)"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                    }}
                  >
                    {c.name}
                  </text>
                  {showNumber && (
                    <text
                      x={labelX}
                      y={numberTop}
                      fill="var(--paper)"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 22,
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {fmtPct(c.weight, 1)}
                    </text>
                  )}
                  {showNote && (
                    <text
                      x={labelX}
                      y={noteTop}
                      fill="var(--paper-deep)"
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontSize: 11,
                      }}
                    >
                      ≈ {fmtCount(c.count)} names
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </figure>

        {/* ── Top names ──────────────────────────────────────────── */}
        <div className="lg:col-span-5">
          <p
            className="bs-label mb-3 flex items-baseline justify-between"
            style={{ color: "var(--ink-soft)" }}
          >
            <span>Top names</span>
            <span className="tabular-nums">Weight</span>
          </p>
          <ol className="border-t border-[var(--ink)]">
            {HOLDINGS.topNames.map((n) => {
              const barPct = Math.min(100, (n.weight / topWeight) * 100);
              return (
                <li
                  key={n.ticker}
                  className="grid grid-cols-[minmax(0,1fr)_1fr_auto] gap-3 items-center py-2.5 border-b border-[color:var(--rule)]"
                >
                  <span
                    className="bs-body text-[0.9375rem] truncate"
                    style={{ color: "var(--ink)" }}
                  >
                    {n.name}
                  </span>
                  <span
                    aria-hidden
                    className="h-[8px] block"
                    style={{ backgroundColor: "var(--paper-deep)" }}
                  >
                    <span
                      className="h-full block"
                      style={{
                        backgroundColor: "var(--stamp)",
                        width: `${barPct}%`,
                      }}
                    />
                  </span>
                  <span
                    className="bs-numerals tabular-nums text-[0.9375rem]"
                    style={{ color: "var(--ink)" }}
                  >
                    {fmtPct(n.weight, 2)}
                  </span>
                </li>
              );
            })}
            {/* Long-tail summary row — italic, ink-mute, bar clamped to
                100% so it doesn't overshoot the gauge. */}
            <li
              className="grid grid-cols-[minmax(0,1fr)_1fr_auto] gap-3 items-center py-2.5 border-b border-[color:var(--rule)]"
              style={{ color: "var(--ink-mute)" }}
            >
              <span
                className="bs-body italic text-[0.9375rem] truncate"
                style={{ fontStyle: "italic" }}
              >
                …{fmtCount(tail.tailNames)} more
              </span>
              <span
                aria-hidden
                className="h-[8px] block"
                style={{ backgroundColor: "var(--paper-deep)" }}
              >
                <span
                  className="h-full block"
                  style={{
                    backgroundColor: "var(--ink-mute)",
                    width: "100%",
                  }}
                />
              </span>
              <span className="bs-numerals tabular-nums text-[0.9375rem]">
                {fmtPct(tail.tailWeight, 1)}
              </span>
            </li>
          </ol>
        </div>
      </div>

      {/* ── Long-tail sentence ──────────────────────────────────── */}
      <p
        className="mt-6 sm:mt-7 pt-4 border-t border-[var(--ink)] bs-body italic text-[0.9375rem] sm:text-[1rem]"
        style={{ color: "var(--ink-soft)" }}
      >
        <span className="bs-stamp not-italic mr-3" style={{ color: "var(--stamp)" }}>
          The long tail
        </span>
        The bottom {fmtCount(tail.tailNames)} holdings together weigh
        less than {joinNames(tail.headlineNames)} combined.
      </p>
    </section>
  );
}
