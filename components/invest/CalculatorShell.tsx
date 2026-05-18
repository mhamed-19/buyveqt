import type { ReactNode } from "react";
import Card from "@/components/ui/Card";

interface CalculatorShellProps {
  /** Pill icon glyph (e.g. ∫, ∥, ↻, ☂, Ω). */
  icon: string;
  /** Small-caps tab label (e.g. "Lookback"). */
  label: string;
  /** Fraunces full name (e.g. "The Lookback"). */
  name: string;
  /** Subhead surfaced under the heading. */
  sub: string;
  children: ReactNode;
}

/**
 * Dark-band shell that wraps the active calculator. Mirrors the
 * InceptionBand convention on / — one dark `<Card>` per page —
 * but tuned to the bigger surface area of the Reckoner.
 */
export default function CalculatorShell({
  icon,
  label,
  name,
  sub,
  children,
}: CalculatorShellProps) {
  return (
    <Card dark padding="28px 24px 28px">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div
          aria-hidden
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "rgba(246,239,220,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: 22,
            color: "var(--paper)",
          }}
        >
          {icon}
        </div>
        <div>
          <div
            className="ed-label"
            style={{ color: "rgba(246,239,220,0.55)" }}
          >
            {label}
          </div>
          <div
            className="ed-display-italic"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              lineHeight: 1.1,
              color: "var(--paper)",
              marginTop: 4,
            }}
          >
            {name}
          </div>
        </div>
      </div>
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: 14,
          lineHeight: 1.5,
          color: "rgba(246,239,220,0.7)",
          margin: "0 0 22px",
          maxWidth: "60ch",
        }}
      >
        {sub}
      </p>
      <div className="reckoner-shell__body">{children}</div>
    </Card>
  );
}
