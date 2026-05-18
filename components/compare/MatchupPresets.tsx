"use client";

import SectionLabel from "@/components/ui/SectionLabel";

interface Preset {
  id: string;
  label: string;
  funds: string[];
  blurb: string;
}

const PRESETS: Preset[] = [
  {
    id: "veqt-xeqt",
    label: "VEQT × XEQT",
    funds: ["VEQT.TO", "XEQT.TO"],
    blurb: "The marquee fight",
  },
  {
    id: "veqt-zeqt",
    label: "VEQT × ZEQT",
    funds: ["VEQT.TO", "ZEQT.TO"],
    blurb: "The challenger",
  },
  {
    id: "veqt-vfv",
    label: "VEQT × VFV",
    funds: ["VEQT.TO", "VFV.TO"],
    blurb: "World vs U.S.",
  },
  {
    id: "veqt-vgro",
    label: "VEQT × VGRO",
    funds: ["VEQT.TO", "VGRO.TO"],
    blurb: "With or without bonds",
  },
  {
    id: "veqt-xgro",
    label: "VEQT × XGRO",
    funds: ["VEQT.TO", "XGRO.TO"],
    blurb: "Equity vs 80/20",
  },
];

interface MatchupPresetsProps {
  selected: string[];
  onSelect: (funds: string[]) => void;
}

/**
 * Refactored for M3: five horizontal bout cards. Active uses dark ink
 * background with paper text; inactive uses paper-light. Mobile scrolls
 * horizontally with snap behaviour (ed-snap-row); desktop is a 5-column
 * grid.
 */
export default function MatchupPresets({
  selected,
  onSelect,
}: MatchupPresetsProps) {
  const sel = [...selected].sort().join("|");

  return (
    <section aria-labelledby="matchups-heading">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 12,
          padding: "0 4px",
        }}
      >
        <SectionLabel>
          <span id="matchups-heading">Preset matchups</span>
        </SectionLabel>
        <span
          className="matchups__hint"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            color: "var(--ink-mute)",
            fontWeight: 600,
          }}
        >
          Swipe →
        </span>
      </header>

      <ul className="matchups__row ed-snap-row" role="list">
        {PRESETS.map((preset, idx) => {
          const presetKey = [...preset.funds].sort().join("|");
          const active = presetKey === sel;
          return (
            <li
              key={preset.id}
              className="matchups__item"
              style={{ listStyle: "none" }}
            >
              <button
                onClick={() => onSelect(preset.funds)}
                aria-pressed={active}
                style={{
                  width: "100%",
                  display: "block",
                  textAlign: "left",
                  appearance: "none",
                  cursor: "pointer",
                  background: active ? "var(--ink)" : "var(--paper-light)",
                  color: active ? "var(--paper)" : "var(--ink)",
                  border: active
                    ? "1px solid var(--ink)"
                    : "1px solid var(--rule-soft)",
                  borderRadius: 14,
                  padding: "16px 16px 14px",
                }}
              >
                <span
                  className="ed-label"
                  style={{
                    color: active
                      ? "rgba(246, 239, 220, 0.55)"
                      : "var(--ink-mute)",
                  }}
                >
                  Bout {String(idx + 1).padStart(2, "0")}
                </span>
                <span
                  className="ed-numerals"
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: 20,
                    letterSpacing: "-0.012em",
                    marginTop: 8,
                  }}
                >
                  {preset.label}
                </span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 13,
                    color: active
                      ? "rgba(246, 239, 220, 0.75)"
                      : "var(--ink-mute)",
                    marginTop: 4,
                  }}
                >
                  {preset.blurb}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        .matchups__row {
          display: flex;
          gap: 10px;
          padding: 0 4px 6px;
        }
        .matchups__item {
          flex: 0 0 170px;
          min-width: 170px;
        }
        @media (min-width: 1024px) {
          .matchups__row {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 14px;
            overflow: visible;
            padding: 0;
          }
          .matchups__item {
            flex: initial;
            min-width: 0;
          }
          .matchups__hint {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
