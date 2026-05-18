import type { ReactNode } from "react";

interface SidenoteProps {
  children: ReactNode;
}

/**
 * "Sidenote" — paper-warm box with a small vermilion stamp label and
 * Newsreader body. Inline aside used inside MDX. Replaces the generic
 * Callout for purely-informational asides.
 */
export function Sidenote({ children }: SidenoteProps) {
  return (
    <aside
      style={{
        margin: "20px 0",
        padding: "14px 16px",
        background: "var(--paper-warm)",
        borderRadius: 12,
        fontFamily: "var(--font-serif)",
        fontSize: 14,
        lineHeight: 1.55,
        color: "var(--ink-soft)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--stamp)",
          marginBottom: 6,
        }}
      >
        Sidenote
      </div>
      {children}
    </aside>
  );
}
