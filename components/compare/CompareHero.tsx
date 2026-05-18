import SectionLabel from "@/components/ui/SectionLabel";
import Lede from "@/components/ui/Lede";

/**
 * Top of /compare. Two-column on desktop, stacked on mobile.
 *
 *   ┌──────────────────────────┐  ┌────────────────────────────┐
 *   │ THE FIGHT CARD           │  │ Lede with drop cap         │
 *   │ Pick a matchup.          │  │ explaining slot-1 = VEQT   │
 *   └──────────────────────────┘  └────────────────────────────┘
 */
export default function CompareHero() {
  return (
    <section className="compare-hero">
      <div>
        <SectionLabel>The fight card</SectionLabel>
        <h1 className="ed-display-italic compare-hero__h1">
          Pick a matchup.
        </h1>
      </div>
      <Lede>
        Five preset bouts, or roll your own from the picker below. We pin VEQT
        in slot one so the deltas read as &ldquo;VEQT minus other&rdquo; — useful
        if you, like us, already own it.
      </Lede>

      <style jsx>{`
        .compare-hero {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          align-items: end;
        }
        .compare-hero__h1 {
          font-size: 34px;
          line-height: 1;
          letter-spacing: -0.022em;
          margin: 8px 0 0;
          color: var(--ink);
        }
        @media (min-width: 1024px) {
          .compare-hero {
            grid-template-columns: 6fr 6fr;
            gap: 56px;
          }
          .compare-hero__h1 {
            font-size: 60px;
            letter-spacing: -0.025em;
            margin: 12px 0 0;
            max-width: 12ch;
          }
        }
      `}</style>
    </section>
  );
}
