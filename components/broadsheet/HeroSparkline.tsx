"use client";

interface Point {
  date: string;
  close: number;
}

interface Props {
  /** Full since-inception history, oldest first. */
  points: readonly Point[];
  width?: number;
  height?: number;
}

/**
 * "The Arc" — a since-inception sparkline that sits beside the hero price.
 *
 * Bigger and more ornate than the regional sparkline: dashed baseline at
 * the inception close, faint vertical ticks at each calendar year boundary
 * (giving the line visual rhythm instead of floating in a blank box),
 * a soft area fill under the curve, and a vermilion dot + halo on the
 * most recent close. A caption strip underneath reports the full return.
 */
export default function HeroSparkline({
  points,
  width = 220,
  height = 68,
}: Props) {
  if (!points || points.length < 2) return null;

  const closes = points.map((p) => p.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;

  const PAD_Y = 5;
  const drawableHeight = height - PAD_Y * 2;

  const stepX = points.length > 1 ? width / (points.length - 1) : width;

  const coords = points.map((p, i) => {
    const x = i * stepX;
    const normalized = (p.close - min) / range;
    const y = PAD_Y + (1 - normalized) * drawableHeight;
    return { x, y };
  });

  const pathD = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");

  // Closed area under the curve, running back along the bottom.
  const areaD = `${pathD} L${width.toFixed(1)} ${(height - PAD_Y).toFixed(
    1
  )} L0 ${(height - PAD_Y).toFixed(1)} Z`;

  const firstClose = closes[0];
  const lastClose = closes[closes.length - 1];
  const up = lastClose >= firstClose;
  const returnPct = ((lastClose - firstClose) / firstClose) * 100;

  // Year boundaries — x-coord of the first point in each new calendar year
  // (excluding the very first point). Used for the faint tick rhythm.
  const yearTicks: number[] = [];
  let lastYear: string | null = null;
  points.forEach((p, i) => {
    const y = p.date.slice(0, 4);
    if (y !== lastYear) {
      if (lastYear !== null) yearTicks.push(coords[i].x);
      lastYear = y;
    }
  });

  const firstY = coords[0].y;
  const lastCoord = coords[coords.length - 1];

  return (
    <figure className="flex flex-col shrink-0" style={{ width }}>
      <figcaption
        className="bs-label text-[10px] mb-1.5"
        style={{ color: "var(--ink-soft)", letterSpacing: "0.14em" }}
      >
        Since inception
      </figcaption>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`VEQT since inception — ${up ? "up" : "down"} ${returnPct.toFixed(
          1
        )}%`}
        style={{ display: "block" }}
      >
        {/* Year tick rhythm — faint vertical lines, one per new calendar year */}
        {yearTicks.map((x, i) => (
          <line
            key={i}
            x1={x}
            x2={x}
            y1={PAD_Y}
            y2={height - PAD_Y}
            stroke="var(--ink)"
            strokeWidth={0.4}
            opacity={0.12}
          />
        ))}

        {/* Inception baseline — dashed at the first close so the reader can
            see at a glance how much of the curve sits above it. */}
        <line
          x1={0}
          x2={width}
          y1={firstY}
          y2={firstY}
          stroke="var(--ink)"
          strokeWidth={0.5}
          strokeDasharray="2 3"
          opacity={0.35}
        />

        {/* Soft area fill under the curve */}
        <path d={areaD} fill="var(--ink)" opacity={0.07} />

        {/* Main line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--ink)"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.92}
        />

        {/* Vermilion halo + dot on the most recent close */}
        <circle
          cx={lastCoord.x}
          cy={lastCoord.y}
          r={5.5}
          fill="var(--stamp)"
          opacity={0.16}
        />
        <circle
          cx={lastCoord.x}
          cy={lastCoord.y}
          r={2.75}
          fill="var(--stamp)"
        />
      </svg>

      {/* Caption strip — Jan '19 · +X% · Now */}
      <div
        className="flex items-center justify-between w-full mt-1.5 bs-label text-[10px]"
        style={{ color: "var(--ink-soft)", letterSpacing: "0.12em" }}
      >
        <span>Jan &apos;19</span>
        <span
          className="bs-numerals not-italic"
          style={{
            color: up ? "var(--print-green)" : "var(--print-red)",
            letterSpacing: "0.02em",
          }}
        >
          {up ? "+" : ""}
          {returnPct.toFixed(1)}%
        </span>
        <span>Now</span>
      </div>
    </figure>
  );
}
