"use client";

import { useEffect, useState } from "react";
import SectionLabel from "@/components/ui/SectionLabel";

interface MarginalContentsProps {
  /** Optional verdict card rendered above the TOC (or null). */
  verdict?: React.ReactNode;
}

interface Heading {
  id: string;
  text: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Desktop reader sidecar (xl+). Renders the verdict callout (when
 * provided) and a sticky TOC built from in-body h2s. The in-view h2
 * gets a 2px vermilion left-border. Hidden below lg via the parent
 * grid; this component itself just renders.
 */
export default function MarginalContents({ verdict }: MarginalContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Scrape headings from the rendered article body on mount.
  useEffect(() => {
    const article = document.querySelector("[data-article-body]");
    if (!article) return;
    const nodes = Array.from(article.querySelectorAll("h2"));
    const found: Heading[] = nodes.map((node) => {
      let id = node.id;
      if (!id) {
        id = slugify(node.textContent ?? "");
        node.id = id;
      }
      return { id, text: node.textContent ?? "" };
    });
    setHeadings(found);
    if (found.length > 0) setActiveId(found[0].id);

    // Observe each h2 to highlight the in-view one.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target.id);
        if (visible.length > 0) {
          setActiveId(visible[0]);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.5, 1],
      }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  if (!verdict && headings.length === 0) return null;

  return (
    <aside
      style={{
        position: "sticky",
        top: 100,
        alignSelf: "start",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {verdict}
      {headings.length > 0 && (
        <div
          style={{
            padding: "18px",
            border: "1px solid var(--rule-soft)",
            borderRadius: 14,
            background: "var(--paper-warm)",
          }}
        >
          <SectionLabel>Article contents</SectionLabel>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontFamily: "var(--font-serif)",
              fontSize: 13.5,
              color: "var(--ink-soft)",
            }}
          >
            {headings.map((h) => {
              const isActive = h.id === activeId;
              return (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  style={{
                    color: isActive ? "var(--ink)" : "var(--ink-soft)",
                    fontWeight: isActive ? 500 : 400,
                    borderLeft: isActive
                      ? "2px solid var(--stamp)"
                      : "2px solid transparent",
                    paddingLeft: 10,
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                >
                  {h.text}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
