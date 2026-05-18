import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema, canonicalUrl, SITE_NAME } from "@/lib/seo-config";
import ArticleHeader from "@/components/learn/ArticleHeader";
import ArticleBody from "@/components/learn/ArticleBody";
import VerdictCallout from "@/components/learn/VerdictCallout";
import MarginalContents from "@/components/learn/MarginalContents";
import RelatedArticles from "@/components/learn/RelatedArticles";
import Lede from "@/components/ui/Lede";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  const url = canonicalUrl(`/learn/${slug}`);
  const description =
    article.frontmatter.excerpt ||
    article.frontmatter.description ||
    `Learn about ${article.frontmatter.title} — a guide for Canadian passive investors.`;

  return {
    title: article.frontmatter.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.frontmatter.title,
      description,
      url,
      publishedTime: article.frontmatter.lastUpdated,
      modifiedTime:
        article.frontmatter.updatedDate || article.frontmatter.lastUpdated,
      authors: ["BuyVEQT"],
      section: "Education",
    },
  };
}

/** Same five-chip mapping as ArticleList — keeps the kicker on the
 *  reader page consistent with how it was labelled in the index list. */
function chipLabel(category?: string): string {
  switch (category) {
    case "comparison":
      return "Compare";
    case "opinion":
      return "Behavior";
    case "veqt-deep-dive":
      return "Mechanics";
    case "tax-strategy":
    case "beginner":
    default:
      return "How-to";
  }
}

export default async function LearnArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { frontmatter, content } = article;
  const categoryLabel = `Learn · ${chipLabel(frontmatter.category)}`;

  // Editorial verdict shown in the sidecar (and inline on mobile). We
  // derive a short italic headline from the article's excerpt — falls
  // back to a tasteful default if unset.
  const verdictHeadline = frontmatter.isEditorial
    ? "Our verdict, in one line."
    : null;

  const verdictBody = frontmatter.isEditorial
    ? frontmatter.excerpt ?? frontmatter.description
    : null;

  const verdict = frontmatter.isEditorial ? (
    <VerdictCallout headline={verdictHeadline}>{verdictBody}</VerdictCallout>
  ) : null;

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
          { name: frontmatter.title, path: `/learn/${slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: frontmatter.title,
          description: frontmatter.excerpt || frontmatter.description,
          datePublished: frontmatter.lastUpdated,
          dateModified:
            frontmatter.updatedDate || frontmatter.lastUpdated,
          author: { "@type": "Organization", name: SITE_NAME },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: canonicalUrl(),
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonicalUrl(`/learn/${slug}`),
          },
        }}
      />

      <div className="article-stack">
        <ArticleHeader
          frontmatter={frontmatter}
          categoryLabel={categoryLabel}
        />

        <div className="article-grid">
          <div>
            <Lede style={{ fontSize: 18, lineHeight: 1.65, marginBottom: 22 }}>
              {frontmatter.excerpt || frontmatter.description}
            </Lede>
            <ArticleBody content={content} />

            {/* Mobile fallback: verdict appears inline below the body,
                since MarginalContents is hidden under lg. */}
            <div className="article-mobile-verdict">
              {verdict}
            </div>

            <RelatedArticles
              currentSlug={slug}
              relatedSlugs={frontmatter.relatedSlugs}
              category={frontmatter.category}
            />
          </div>
          <div className="article-sidecar">
            <MarginalContents verdict={verdict} />
          </div>
        </div>
      </div>

      <style>{`
        .article-stack {
          max-width: 1180px;
          margin: 0 auto;
          padding: 32px 18px 64px;
        }
        @media (min-width: 1024px) {
          .article-stack {
            padding: 56px 40px 80px;
          }
        }
        .article-grid {
          margin-top: 36px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 1024px) {
          .article-grid {
            grid-template-columns: 7fr 5fr;
            gap: 56px;
          }
        }
        .article-sidecar {
          display: none;
        }
        @media (min-width: 1024px) {
          .article-sidecar {
            display: block;
          }
        }
        .article-mobile-verdict {
          margin: 32px 0;
          display: block;
        }
        @media (min-width: 1024px) {
          .article-mobile-verdict {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
