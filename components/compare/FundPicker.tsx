"use client";

import SectionLabel from "@/components/ui/SectionLabel";
import { FUNDS } from "@/data/funds";
import { fundColor } from "@/lib/styles";

interface FundPickerProps {
  selected: string[];
  onToggle: (ticker: string) => void;
}

const FUND_OPTIONS = Object.values(FUNDS);

/**
 * Chip row of Pills with a color square + ticker. Active chips invert
 * to ink fill / paper-light text. VEQT is pinned in slot 1 and can't
 * be deselected — it shows as active with a non-interactive cursor.
 */
export default function FundPicker({ selected, onToggle }: FundPickerProps) {
  return (
    <section aria-labelledby="picker-heading">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 12,
          padding: "0 4px",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <SectionLabel>
          <span id="picker-heading">Or roll your own</span>
        </SectionLabel>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 12,
            color: "var(--ink-mute)",
          }}
        >
          VEQT stays pinned in slot 1.
        </span>
      </header>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          padding: "0 4px",
        }}
      >
        {FUND_OPTIONS.map((fund) => {
          const isActive = selected.includes(fund.ticker);
          const isVeqt = fund.ticker === "VEQT.TO";
          const color = fundColor(fund.shortName);
          return (
            <button
              key={fund.ticker}
              type="button"
              onClick={() => !isVeqt && onToggle(fund.ticker)}
              disabled={isVeqt}
              aria-pressed={isActive}
              style={{
                appearance: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 999,
                cursor: isVeqt ? "default" : "pointer",
                background: isActive
                  ? "var(--ink)"
                  : "transparent",
                color: isActive ? "var(--paper-light)" : "var(--ink-soft)",
                border: isActive
                  ? "1px solid var(--ink)"
                  : "1px solid var(--rule-soft)",
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: color,
                  display: "inline-block",
                }}
              />
              {fund.shortName}
            </button>
          );
        })}
      </div>
    </section>
  );
}
