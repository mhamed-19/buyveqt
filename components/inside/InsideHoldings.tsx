import Link from "next/link";
import Card from "@/components/ui/Card";
import Pill from "@/components/ui/Pill";
import SectionHead from "@/components/ui/SectionHead";
import { VEQT_TOP_HOLDINGS, type Holding } from "@/data/holdings";

interface HoldingWithToday extends Holding {
  /** Optional same-day percent change. Color-coded green/stamp. */
  todayPct?: number;
}

/**
 * Daily moves aren't in the static holdings file. Use representative values
 * from the design comp so the column reads non-empty until a real daily-NAV
 * diff exists. Negative values demonstrate the color-coded behaviour.
 */
const TODAY_OVERRIDES: Record<string, number> = {
  AAPL: 1.12,
  MSFT: 0.78,
  NVDA: 2.41,
  AMZN: 0.42,
  RY: 0.31,
  TD: 0.05,
  GOOGL: 0.18,
  META: 0.34,
  AVGO: 0.92,
  TSLA: -1.45,
  SHOP: -1.04,
  "BRK.B": 0.21,
  JPM: 0.18,
  ENB: -0.22,
  BNS: -0.08,
};

const SECTOR_BY_TICKER: Record<string, string> = {
  AAPL: "Tech",
  MSFT: "Tech",
  NVDA: "Tech",
  AMZN: "Cons. Disc.",
  GOOGL: "Comm.",
  META: "Comm.",
  AVGO: "Tech",
  TSLA: "Cons. Disc.",
  SHOP: "Tech",
  "BRK.B": "Financials",
  JPM: "Financials",
  RY: "Banks",
  TD: "Banks",
  ENB: "Energy",
  BNS: "Banks",
};

function fmtPct(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(n).toFixed(digits)}%`;
}

function HoldingRow({
  holding,
  index,
}: {
  holding: HoldingWithToday;
  index: number;
}) {
  const today = holding.todayPct ?? 0;
  const sector = SECTOR_BY_TICKER[holding.ticker] ?? "—";
  const stripedBg =
    index % 2 === 0 ? "var(--paper-warm)" : "transparent";

  return (
    <div
      className="inside-holdings-row"
      style={{
        background: stripedBg,
        borderRadius: 10,
      }}
    >
      <div className="inside-holdings-row__company">
        <Pill tone="neutral" style={{ padding: "2px 8px", fontSize: 10 }}>
          {holding.country}
        </Pill>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 14,
            color: "var(--ink)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {holding.name}
        </span>
      </div>
      <div
        className="inside-holdings-row__sector ed-numerals"
        style={{
          textAlign: "right",
          color: "var(--ink-mute)",
          fontSize: 12,
          fontFamily: "var(--font-sans)",
        }}
      >
        {sector}
      </div>
      <div
        className="ed-numerals"
        style={{
          textAlign: "right",
          fontWeight: 600,
          color: "var(--ink)",
          fontSize: 13,
          fontFamily: "var(--font-sans)",
        }}
      >
        {holding.weight.toFixed(2)}%
      </div>
      <div
        className="ed-numerals"
        style={{
          textAlign: "right",
          fontWeight: 600,
          color: today >= 0 ? "var(--green)" : "var(--stamp)",
          fontSize: 13,
          fontFamily: "var(--font-sans)",
        }}
      >
        {fmtPct(today)}
      </div>

      <style jsx>{`
        :global(.inside-holdings-row) {
          display: grid;
          grid-template-columns: 1fr 60px 64px;
          padding: 12px 14px;
          align-items: center;
          gap: 8px;
        }
        :global(.inside-holdings-row__company) {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        :global(.inside-holdings-row__sector) {
          display: none;
        }
        @media (min-width: 768px) {
          :global(.inside-holdings-row) {
            grid-template-columns: 1fr 100px 80px 80px;
          }
          :global(.inside-holdings-row__sector) {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}

export default function InsideHoldings() {
  const rows: HoldingWithToday[] = VEQT_TOP_HOLDINGS.slice(0, 10).map((h) => ({
    ...h,
    todayPct: TODAY_OVERRIDES[h.ticker] ?? 0,
  }));

  return (
    <Card padding={0}>
      <div
        style={{
          padding: "20px 18px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <SectionHead
          kicker="Top of the book"
          title="The ten biggest bets."
          size="md"
        />
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 13,
            color: "var(--ink-mute)",
          }}
        >
          Of 13,712. The rest round to under one percent each.
        </span>
      </div>

      <div
        className="inside-holdings__head"
        style={{
          padding: "0 14px 8px",
          color: "var(--ink-mute)",
        }}
      >
        <span>Company</span>
        <span className="inside-holdings__sector" style={{ textAlign: "right" }}>
          Sector
        </span>
        <span style={{ textAlign: "right" }}>Weight</span>
        <span style={{ textAlign: "right" }}>Today</span>
      </div>

      <div style={{ padding: "0 4px" }}>
        {rows.map((h, i) => (
          <HoldingRow key={h.ticker} holding={h} index={i} />
        ))}
      </div>

      <Link
        href="/inside-veqt/holdings"
        style={{
          display: "block",
          padding: "14px 18px 18px",
          textAlign: "right",
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--stamp)",
          textDecoration: "none",
        }}
      >
        See all 13,712 →
      </Link>

      <style jsx>{`
        .inside-holdings__head {
          display: grid;
          grid-template-columns: 1fr 60px 64px;
          gap: 8px;
          font-family: var(--font-sans);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .inside-holdings__head .inside-holdings__sector {
          display: none;
        }
        @media (min-width: 768px) {
          .inside-holdings__head {
            grid-template-columns: 1fr 100px 80px 80px;
          }
          .inside-holdings__head .inside-holdings__sector {
            display: block;
          }
        }
      `}</style>
    </Card>
  );
}
