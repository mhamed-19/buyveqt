import { FUNDS } from "@/data/funds";
import { fundColor } from "@/lib/styles";

interface FundLegendProps {
  tickers: string[];
  dark?: boolean;
}

/**
 * Color legend strip shared by PerformanceChart and Geography. Each entry
 * is a short bar in the fund's accent color + the short ticker.
 */
export default function FundLegend({ tickers, dark = false }: FundLegendProps) {
  return (
    <div
      className="ed-numerals"
      style={{
        display: "flex",
        gap: 14,
        flexWrap: "wrap",
        fontFamily: "var(--font-sans)",
        fontSize: 11.5,
        fontWeight: 700,
        letterSpacing: "0.06em",
        color: dark ? "var(--paper)" : "var(--ink)",
      }}
    >
      {tickers.map((t) => {
        const f = FUNDS[t];
        const short = f?.shortName ?? t.replace(".TO", "");
        return (
          <span
            key={t}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <span
              aria-hidden
              style={{
                width: 14,
                height: 2.5,
                background: fundColor(short),
                borderRadius: 1,
                display: "inline-block",
              }}
            />
            {short}
          </span>
        );
      })}
    </div>
  );
}
