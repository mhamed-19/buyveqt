import type { ArticleFrontmatter } from "@/lib/articles";

interface ArticleHeaderProps {
  frontmatter: ArticleFrontmatter;
  /** Display-friendly category label (e.g. "Compare"). */
  categoryLabel: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Article reader head — kicker row (category · read time · optional
 * Verdict pill), display h1, byline. Fraunces sized 36→64 by viewport.
 */
export default function ArticleHeader({
  frontmatter,
  categoryLabel,
}: ArticleHeaderProps) {
  const updated = formatDate(
    frontmatter.updatedDate ?? frontmatter.lastUpdated
  );
  const hasVerdict = frontmatter.isEditorial === true;

  return (
    <header style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--stamp)",
          }}
        >
          {categoryLabel}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink-mute)",
          }}
        >
          · {frontmatter.readingTime}
        </span>
        {hasVerdict && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--paper)",
              background: "var(--ink)",
              padding: "2px 8px",
              borderRadius: 3,
            }}
          >
            Verdict
          </span>
        )}
      </div>
      <h1
        className="ed-display"
        style={{
          fontSize: "clamp(2.25rem, 5vw, 4rem)",
          lineHeight: 1,
          letterSpacing: "-0.025em",
          margin: "0 0 18px",
          color: "var(--ink)",
          maxWidth: "20ch",
        }}
      >
        {frontmatter.title}
      </h1>
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: 15,
          color: "var(--ink-mute)",
          margin: 0,
        }}
      >
        By the editors · Last updated {updated}
      </p>
    </header>
  );
}
