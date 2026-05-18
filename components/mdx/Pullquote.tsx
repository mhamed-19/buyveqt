import type { ReactNode } from "react";

interface PullquoteProps {
  children: ReactNode;
  attribution?: string;
  /** Legacy prop (Round 3 broadsheet). Ignored by the Round 4 layout —
   *  the new pull-quote is always left-borderened full-width. Kept so
   *  existing MDX <Pullquote align="…"> calls don't error. */
  align?: "center" | "left" | "right";
}

/**
 * Round 4 pull-quote: paper-light card with a 3px vermilion left rule,
 * Fraunces italic body, oversized vermilion opening quotation mark.
 * Replaces the broadsheet-era variant — name kept (lowercase `q`) so
 * existing MDX content keeps rendering without edits.
 */
export function Pullquote({ children, attribution }: PullquoteProps) {
  return (
    <figure
      style={{
        margin: "32px 0",
        padding: "24px 22px",
        background: "var(--paper-light)",
        borderLeft: "3px solid var(--stamp)",
      }}
    >
      <blockquote
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontStyle: "italic",
          fontSize: "clamp(1.25rem, 2.2vw, 1.5rem)",
          lineHeight: 1.25,
          letterSpacing: "-0.01em",
          color: "var(--ink)",
          margin: 0,
        }}
      >
        <span
          aria-hidden
          style={{
            color: "var(--stamp)",
            fontWeight: 700,
            fontSize: "1.6em",
            lineHeight: 0,
            marginRight: 6,
            verticalAlign: "-0.18em",
          }}
        >
          “
        </span>
        {children}
      </blockquote>
      {attribution && (
        <figcaption
          className="ed-label"
          style={{ marginTop: 12 }}
        >
          {attribution}
        </figcaption>
      )}
    </figure>
  );
}

/** PascalCase alias, in case MDX authors use <PullQuote>. */
export const PullQuote = Pullquote;
