import Link from "next/link";
import Card from "@/components/ui/Card";
import SectionLabel from "@/components/ui/SectionLabel";
import type { ArticleFrontmatter } from "@/lib/articles";

interface CourseHeroProps {
  /** Three articles (or as many as resolved) in reading order. */
  steps: ArticleFrontmatter[];
}

/**
 * Course One — dark band with three numbered step cards. Mirrors the
 * InceptionBand convention (one dark card per page) and serves as the
 * "start here" anchor on /learn.
 */
export default function CourseHero({ steps }: CourseHeroProps) {
  if (steps.length === 0) return null;

  return (
    <Card dark padding="22px 22px 18px">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div>
          <SectionLabel dark>Course one · the reading order</SectionLabel>
          <div
            className="ed-display-italic"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.125rem)",
              lineHeight: 1.05,
              marginTop: 6,
              color: "var(--paper)",
            }}
          >
            Three steps to own VEQT well.
          </div>
        </div>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--paper)",
            background: "var(--stamp)",
            padding: "4px 10px",
            borderRadius: 4,
          }}
        >
          Start here
        </span>
      </div>

      <div className="course-grid">
        {steps.map((step, i) => (
          <Link
            key={step.slug}
            href={`/learn/${step.slug}`}
            className="course-step"
          >
            <div className="course-step__num">{i + 1}</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.015em",
                color: "var(--paper)",
              }}
            >
              {step.title}
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 14,
                lineHeight: 1.5,
                color: "rgba(246,239,220,0.75)",
                marginTop: 8,
              }}
            >
              {step.excerpt || step.description}
            </div>
            <div
              style={{
                marginTop: 18,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(246,239,220,0.5)",
                }}
              >
                {step.readingTime}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--paper)",
                  borderBottom: "1px solid var(--stamp)",
                  paddingBottom: 2,
                }}
              >
                Read →
              </span>
            </div>
          </Link>
        ))}
      </div>

    </Card>
  );
}
