import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllArticles, type ArticleFrontmatter } from "@/lib/articles";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema, canonicalUrl } from "@/lib/seo-config";
import LearnHero from "@/components/learn/LearnHero";
import CourseHero from "@/components/learn/CourseHero";
import ArticleList from "@/components/learn/ArticleList";

export function generateMetadata(): Metadata {
  const count = getAllArticles().length;
  const description = `${count} articles on VEQT, Canadian ETFs, tax-advantaged accounts, and building a passive portfolio. Written in plain English for real investors.`;
  return {
    title: "Learn — VEQT & Canadian Passive Investing",
    description,
    alternates: { canonical: canonicalUrl("/learn") },
    openGraph: {
      title: "Learn — VEQT & Canadian Passive Investing",
      description:
        "Plain-English guides on VEQT, all-in-one ETFs, tax-advantaged accounts, and passive investing in Canada.",
      url: canonicalUrl("/learn"),
    },
  };
}

/** Course One reading order — three foundational articles. The article
 *  cards in the dark hero link out to these slugs (validated below by
 *  filtering against the real article list). */
const COURSE_ONE_SLUGS = [
  "what-is-veqt",
  "veqt-vs-diy-portfolio",
  "veqt-is-down",
];

export default function LearnPage() {
  const all = getAllArticles();

  // Resolve the course-one slugs to real articles (skip silently if any
  // ever goes missing — the hero just shrinks).
  const courseSteps: ArticleFrontmatter[] = COURSE_ONE_SLUGS
    .map((slug) => all.find((a) => a.slug === slug))
    .filter((a): a is ArticleFrontmatter => !!a);

  // Everything not in course one becomes the archive list.
  const courseSet = new Set(courseSteps.map((a) => a.slug));
  const archive = all.filter((a) => !courseSet.has(a.slug));

  return (
    <main
      style={{
        background: "var(--paper)",
        color: "var(--ink)",
        minHeight: "100dvh",
      }}
    >
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Learn", path: "/learn" },
        ])}
      />

      <div className="learn-stack">
        <LearnHero articleCount={all.length} />
        <CourseHero steps={courseSteps} />

        <section>
          <Suspense fallback={null}>
            <ArticleList articles={archive} />
          </Suspense>
        </section>
      </div>

      <style>{`
        .learn-stack {
          display: flex;
          flex-direction: column;
          gap: 26px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 20px 16px 56px;
        }
        @media (min-width: 1024px) {
          .learn-stack {
            gap: 36px;
            padding: 40px 40px 72px;
          }
        }
      `}</style>
    </main>
  );
}
