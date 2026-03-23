import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import CompareContent from "@/components/compare/CompareContent";

export const metadata: Metadata = {
  title: "Compare VEQT vs XEQT vs ZEQT — BuyVEQT",
  description:
    "Side-by-side comparison of Canada's top all-in-one ETFs: VEQT, XEQT, ZEQT, VGRO, and VFV. Compare MER, performance, holdings, and geographic allocation.",
  openGraph: {
    title: "Compare VEQT vs XEQT vs ZEQT — BuyVEQT",
    description:
      "Side-by-side comparison of Canada's top all-in-one ETFs.",
  },
};

export default function ComparePage() {
  return (
    <PageShell>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
            Compare VEQT to Other All-in-One ETFs
          </h1>
          <p className="mt-2 text-[var(--color-text-muted)] max-w-prose">
            See how VEQT stacks up against XEQT, ZEQT, VGRO, and VFV — side by
            side. We built this tool because the &ldquo;VEQT vs XEQT&rdquo;
            question comes up more than any other in the Canadian ETF community.
            Our position is clear — we think VEQT is the better choice for most
            investors — but we believe in showing you the data and letting you
            see for yourself.
          </p>
        </div>

        <CompareContent />

        <div className="mt-6">
          <Link
            href="/learn/why-we-choose-veqt-over-xeqt"
            className="block rounded-lg border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/[0.04] p-4 hover:border-[var(--color-brand)]/60 transition-colors"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand)] mb-1">
              Our Take
            </p>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              Read our editorial: Why We Choose VEQT Over XEQT &rarr;
            </p>
          </Link>
        </div>
      </main>
    </PageShell>
  );
}
