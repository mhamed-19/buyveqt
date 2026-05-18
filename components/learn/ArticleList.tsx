"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ArticleFrontmatter } from "@/lib/articles";

interface ArticleListProps {
  /** All non-course articles. */
  articles: ArticleFrontmatter[];
}

/** Round 4 simplified taxonomy. Maps internal `category` to a top-level
 *  reading bucket. Keeps the chip filter to five entries (per spec). */
type ChipKey = "All" | "How-to" | "Behavior" | "Mechanics" | "Compare";

const CHIPS: readonly ChipKey[] = ["All", "How-to", "Behavior", "Mechanics", "Compare"];

function chipForArticle(a: ArticleFrontmatter): Exclude<ChipKey, "All"> {
  // `comparison` ⇒ Compare (head-to-head matchups).
  // `opinion`    ⇒ Behavior (long-form takes on what to do / not do).
  // `veqt-deep-dive` ⇒ Mechanics (inside-the-fund explainers).
  // `tax-strategy` + `beginner` ⇒ How-to (practical guides).
  switch (a.category) {
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

export default function ArticleList({ articles }: ArticleListProps) {
  const router = useRouter();
  const params = useSearchParams();
  const cat = (params.get("cat") as ChipKey | null) ?? "All";

  const filtered = useMemo(() => {
    if (cat === "All") return articles;
    return articles.filter((a) => chipForArticle(a) === cat);
  }, [articles, cat]);

  function setCat(next: ChipKey) {
    const sp = new URLSearchParams(params.toString());
    if (next === "All") sp.delete("cat");
    else sp.set("cat", next);
    const qs = sp.toString();
    router.replace(qs ? `/learn?${qs}` : "/learn", { scroll: false });
  }

  return (
    <section className="article-list">
      {/* Chip row */}
      <div
        className="article-list__chips"
        role="tablist"
        aria-label="Filter articles by category"
      >
        {CHIPS.map((c) => {
          const active = c === cat;
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCat(c)}
              className="article-list__chip"
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                whiteSpace: "nowrap",
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: 600,
                background: active ? "var(--ink)" : "transparent",
                color: active ? "var(--paper-light)" : "var(--ink-soft)",
                border: active ? "none" : "1px solid var(--rule-soft)",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Article grid — 1col mobile, 2col desktop */}
      <div className="article-list__grid">
        {filtered.length === 0 ? (
          <p
            className="ed-body italic"
            style={{
              padding: "32px 0",
              textAlign: "center",
              color: "var(--ink-mute)",
            }}
          >
            No articles in this bucket yet.
          </p>
        ) : (
          filtered.map((a, i) => {
            const chip = chipForArticle(a);
            return (
              <Link
                key={a.slug}
                href={`/learn/${a.slug}`}
                className="article-list__card"
                data-position={i % 2}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 8,
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
                    {chip}
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
                    · {a.readingTime}
                  </span>
                  {a.isEditorial && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--paper)",
                        background: "var(--ink)",
                        padding: "2px 7px",
                        borderRadius: 3,
                      }}
                    >
                      Verdict
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "clamp(1.1875rem, 2vw, 1.375rem)",
                    lineHeight: 1.15,
                    letterSpacing: "-0.012em",
                    color: "var(--ink)",
                  }}
                >
                  {a.title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 14.5,
                    lineHeight: 1.5,
                    color: "var(--ink-soft)",
                    marginTop: 8,
                    maxWidth: "44ch",
                  }}
                >
                  {a.excerpt || a.description}
                </div>
              </Link>
            );
          })
        )}
      </div>

      <style jsx>{`
        .article-list {
          margin-top: 8px;
        }
        .article-list__chips {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 4px 0 12px;
        }
        .article-list__chips::-webkit-scrollbar {
          display: none;
        }
        .article-list__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          margin-top: 8px;
        }
        :global(.article-list__card) {
          display: block;
          padding: 22px 0;
          border-top: 1px solid var(--rule-soft);
          color: inherit;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        :global(.article-list__card:hover) {
          opacity: 0.75;
        }
        :global(.article-list__card:last-child) {
          border-bottom: 1px solid var(--rule-soft);
        }
        @media (min-width: 1024px) {
          .article-list__grid {
            grid-template-columns: 1fr 1fr;
            column-gap: 32px;
          }
          :global(.article-list__card[data-position="0"]) {
            padding-right: 24px;
          }
          :global(.article-list__card[data-position="1"]) {
            padding-left: 24px;
            border-left: 1px solid var(--rule-soft);
          }
        }
      `}</style>
    </section>
  );
}
