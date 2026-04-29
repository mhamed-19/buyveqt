import {
  buildSeries,
  type CompareEvent,
  type FundCode,
} from "@/lib/compare-events";

interface EventColumnProps {
  event: CompareEvent;
}

const VIEW_W = 140;
const VIEW_H = 90;
const PAD_X = 4;
const PAD_TOP = 4;
const PAD_BOTTOM = 4;

interface FundStyle {
  stroke: string;
  width: number;
  dash?: string;
}

const STYLES: Record<FundCode, FundStyle> = {
  VEQT: { stroke: "var(--stamp)", width: 2 },
  XEQT: { stroke: "var(--ink-soft)", width: 1, dash: "3 2" },
  ZEQT: { stroke: "var(--ink-mute)", width: 1, dash: "2 1" },
};

const FUND_ORDER: FundCode[] = ["VEQT", "XEQT", "ZEQT"];

/**
 * Map a normalized price (0.6–1.05ish) onto the chart's y range.
 * The y-axis is anchored: top = 1.05, bottom = the deepest trough
 * across all three funds (clamped a hair below 0.6 if a deeper
 * drawdown ever ships).
 */
function makeYScale(minP: number, maxP: number) {
  const usableH = VIEW_H - PAD_TOP - PAD_BOTTOM;
  return (p: number) => {
    const t = (p - minP) / Math.max(0.001, maxP - minP);
    return PAD_TOP + (1 - t) * usableH;
  };
}

function makeXScale(days: number) {
  const usableW = VIEW_W - PAD_X * 2;
  return (d: number) => PAD_X + (d / Math.max(1, days - 1)) * usableW;
}

function pathFor(
  series: { d: number; p: number }[],
  xs: (d: number) => number,
  ys: (p: number) => number
): string {
  return series
    .map((pt, i) => `${i === 0 ? "M" : "L"}${xs(pt.d).toFixed(2)},${ys(pt.p).toFixed(2)}`)
    .join(" ");
}

function fmtPct(v: number, digits = 1): string {
  const abs = Math.abs(v) * 100;
  return `${v < 0 ? "−" : ""}${abs.toFixed(digits)}%`;
}

/**
 * One event column inside the EventHero strip. Renders the date
 * eyebrow, the title, a hand-built three-line SVG with a trough
 * reference, and the anecdote underneath. The highlight fund's
 * ticker is rendered in vermilion inside the anecdote prose so the
 * reader can map line color to fund without a separate legend.
 */
export default function EventColumn({ event }: EventColumnProps) {
  const seriesByFund = FUND_ORDER.map((f) => ({ fund: f, series: buildSeries(event, f) }));
  const allP = seriesByFund.flatMap((s) => s.series.map((pt) => pt.p));
  const minP = Math.min(...allP, 0.6);
  const maxP = Math.max(...allP, 1.05);

  const xs = makeXScale(seriesByFund[0].series.length);
  const ys = makeYScale(minP, maxP);

  const troughY = ys(1 + event.drawdown[event.highlightFund]);
  const baselineY = ys(1);

  const highlightStyle = STYLES[event.highlightFund];

  // Render the highlight fund's path last so it sits on top.
  const ordered = [
    ...seriesByFund.filter((s) => s.fund !== event.highlightFund),
    seriesByFund.find((s) => s.fund === event.highlightFund)!,
  ];

  return (
    <article className="flex flex-col">
      <p
        className="bs-stamp mb-2"
        style={{ color: "var(--stamp)" }}
      >
        {event.label}
      </p>
      <h3
        className="bs-display text-[1.125rem] sm:text-[1.25rem] leading-[1.1] mb-3"
        style={{ color: "var(--ink)", letterSpacing: "-0.01em" }}
      >
        {event.title}
      </h3>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="block w-full h-[140px] sm:h-[160px] mb-3"
        role="img"
        aria-label={`${event.title}: drawdown chart for VEQT, XEQT, and ZEQT`}
      >
        <title>
          {event.title} — VEQT drawdown {fmtPct(event.drawdown.VEQT)},
          recovery {event.recoveryDays.VEQT} days.
        </title>

        {/* 0% baseline */}
        <line
          x1={PAD_X}
          y1={baselineY}
          x2={VIEW_W - PAD_X}
          y2={baselineY}
          stroke="var(--rule)"
          strokeWidth={0.5}
        />

        {/* Trough reference, dashed */}
        <line
          x1={PAD_X}
          y1={troughY}
          x2={VIEW_W - PAD_X}
          y2={troughY}
          stroke="var(--rule)"
          strokeWidth={0.5}
          strokeDasharray="2 2"
        />
        <text
          x={PAD_X + 2}
          y={troughY - 2}
          fill="var(--ink-mute)"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 7,
            letterSpacing: "0.04em",
          }}
        >
          {fmtPct(event.drawdown[event.highlightFund], 0)}
        </text>

        {/* Three lines */}
        {ordered.map(({ fund, series }) => {
          const style = STYLES[fund];
          return (
            <path
              key={fund}
              d={pathFor(series, xs, ys)}
              stroke={style.stroke}
              strokeWidth={style.width}
              strokeDasharray={style.dash}
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      <hr className="border-t border-[color:var(--rule)] mb-3" />

      <p
        className="bs-body text-[0.8125rem] sm:text-[0.875rem] leading-[1.45]"
        style={{ color: "var(--ink-soft)" }}
      >
        <span
          className="font-semibold not-italic"
          style={{ color: highlightStyle.stroke }}
        >
          {event.highlightFund}
        </span>{" "}
        — {event.anecdote}
      </p>
    </article>
  );
}
