import type { ReactNode } from "react";
import Card from "@/components/ui/Card";
import SectionLabel from "@/components/ui/SectionLabel";

interface VerdictCalloutProps {
  /** Italic short headline — "We lean VEQT, narrowly." */
  headline: ReactNode;
  /** Supporting body — 1–2 sentences. */
  children?: ReactNode;
}

/**
 * Inline dark "Our verdict" card. Used in the article reader's marginal
 * sidecar AND optionally inline within MDX bodies. The headline is
 * Fraunces italic; the body is Newsreader italic-light over a muted
 * paper tone.
 */
export default function VerdictCallout({
  headline,
  children,
}: VerdictCalloutProps) {
  return (
    <Card dark>
      <SectionLabel dark>Our verdict</SectionLabel>
      <div
        className="ed-display-italic"
        style={{
          fontSize: "clamp(1.5rem, 2.2vw, 1.75rem)",
          lineHeight: 1.15,
          marginTop: 12,
          color: "var(--paper)",
        }}
      >
        {headline}
      </div>
      {children && (
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 14.5,
            lineHeight: 1.55,
            color: "rgba(246, 239, 220, 0.78)",
            marginTop: 14,
            marginBottom: 0,
          }}
        >
          {children}
        </p>
      )}
    </Card>
  );
}
