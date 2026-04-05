import Link from "next/link";
import { LEARN_ARTICLES } from "@/lib/constants";

export default function LearnPreview() {
  return (
    <section className="py-12">
      <p className="section-label mb-2">Research</p>
      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[var(--color-text-primary)] mb-1.5">
        Learn
      </h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        Guides and explainers for VEQT investors.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LEARN_ARTICLES.map((article) => {
          const isEditorial = "editorial" in article && article.editorial;
          return (
            <Link
              key={article.slug}
              href={`/learn/${article.slug}`}
              className={`group card-editorial p-5 transition-all ${
                isEditorial
                  ? "border-[var(--color-brand)]/30 hover:border-[var(--color-brand)]/60"
                  : ""
              }`}
            >
              {isEditorial && (
                <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-brand)] mb-2">
                  Our Take
                </span>
              )}
              <h3 className="font-serif text-base font-normal text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors leading-snug">
                {article.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] mt-2.5 leading-relaxed">
                {article.teaser}
              </p>
              <span className="inline-block mt-4 text-sm font-medium text-[var(--color-brand)]">
                Read more &rarr;
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
