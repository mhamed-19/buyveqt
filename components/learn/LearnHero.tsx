import SectionLabel from "@/components/ui/SectionLabel";
import Lede from "@/components/ui/Lede";

interface LearnHeroProps {
  /** Number of articles in the library, surfaced in the lede. */
  articleCount: number;
}

/**
 * Index hero: kicker, big italic title, lede paragraph. Matches the home
 * page rhythm — display-italic h1 + drop-cap lede.
 */
export default function LearnHero({ articleCount }: LearnHeroProps) {
  return (
    <header className="learn-hero">
      <div className="learn-hero__title">
        <SectionLabel>Independent reading on one ETF</SectionLabel>
        <h1
          className="ed-display-italic"
          style={{
            fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
            lineHeight: 1,
            margin: "12px 0 0",
            color: "var(--ink)",
          }}
        >
          The library.
        </h1>
      </div>
      <Lede style={{ fontSize: "1.125rem", maxWidth: "46ch" }}>
        {articleCount} articles on owning VEQT well. A few of them, in
        order, will get you most of the way there. The rest are for
        curious days.
      </Lede>
    </header>
  );
}
