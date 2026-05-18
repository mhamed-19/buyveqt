import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CompareContent from "@/components/compare/CompareContent";
import { COMPARISON_PAGES, getComparison } from "@/data/comparisons";
import BottomLine from "@/components/compare/BottomLine";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema, canonicalUrl } from "@/lib/seo-config";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(COMPARISON_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparison(slug);
  if (!page) return { title: "Comparison" };

  const url = canonicalUrl(`/compare/${slug}`);
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url,
    },
  };
}

export default async function CompareSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getComparison(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: page.title, path: `/compare/${page.slug}` },
        ])}
      />
      <CompareContent initialFunds={[...page.funds]} />
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 14px 48px",
        }}
      >
        <BottomLine
          slug={slug}
          fundA={page.funds[0]}
          fundB={page.funds[1]}
          className="mt-2"
        />
        <div
          style={{
            marginTop: 32,
            paddingTop: 18,
            borderTop: "1px solid var(--rule-soft)",
          }}
        >
          <Link
            href="/compare"
            className="ed-label"
            style={{
              color: "var(--ink-soft)",
              textDecoration: "none",
              letterSpacing: "0.14em",
            }}
          >
            &larr; Back to all bouts
          </Link>
        </div>
      </div>
    </>
  );
}
