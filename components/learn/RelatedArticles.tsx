import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import { getAllArticles, type ArticleFrontmatter } from "@/lib/articles";

interface RelatedArticlesProps {
  /** Current article's slug — excluded from the pick list. */
  currentSlug: string;
  /** Optional explicit slugs (from frontmatter.relatedSlugs). */
  relatedSlugs?: string[];
  /** Category fallback when explicit slugs run out. */
  category?: string;
}

/**
 * "Read next" strip at the bottom of the article reader. Two compact
 * cards picked from explicit relatedSlugs first, then same-category,
 * then anything. Pure server component.
 */
export default function RelatedArticles({
  currentSlug,
  relatedSlugs = [],
  category,
}: RelatedArticlesProps) {
  const all = getAllArticles();
  let picks: ArticleFrontmatter[] = [];

  if (relatedSlugs.length > 0) {
    picks = relatedSlugs
      .map((s) => all.find((a) => a.slug === s))
      .filter((a): a is ArticleFrontmatter => !!a && a.slug !== currentSlug)
      .slice(0, 2);
  }

  if (picks.length < 2 && category) {
    const same = all
      .filter((a) => a.slug !== currentSlug && a.category === category)
      .filter((a) => !picks.some((p) => p.slug === a.slug))
      .slice(0, 2 - picks.length);
    picks = [...picks, ...same];
  }

  if (picks.length < 2) {
    const fill = all
      .filter((a) => a.slug !== currentSlug)
      .filter((a) => !picks.some((p) => p.slug === a.slug))
      .slice(0, 2 - picks.length);
    picks = [...picks, ...fill];
  }

  if (picks.length === 0) return null;

  return (
    <section
      style={{
        marginTop: 40,
        paddingTop: 24,
        borderTop: "1px solid var(--rule-soft)",
      }}
    >
      <SectionLabel style={{ marginBottom: 14 }}>Read next</SectionLabel>
      <div className="related-grid">
        {picks.map((a) => (
          <Link
            key={a.slug}
            href={`/learn/${a.slug}`}
            className="related-card"
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--ink-mute)",
                }}
              >
                {a.readingTime}
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: 18,
                lineHeight: 1.2,
                color: "var(--ink)",
                letterSpacing: "-0.012em",
              }}
            >
              {a.title}
            </div>
            {(a.excerpt || a.description) && (
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  color: "var(--ink-soft)",
                  marginTop: 6,
                }}
              >
                {a.excerpt || a.description}
              </div>
            )}
          </Link>
        ))}
      </div>

    </section>
  );
}
