import type { Metadata } from "next";
import InteriorShell from "@/components/broadsheet/InteriorShell";
import EventHero from "@/components/compare/EventHero";
import TiltComparison from "@/components/compare/TiltComparison";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema, canonicalUrl } from "@/lib/seo-config";
import { COMPARISON_DATA } from "@/lib/constants";

export const metadata: Metadata = {
  title: "The Bouts — VEQT vs the field",
  description:
    "Three funds, three moments. The differences between VEQT, XEQT, and ZEQT you can't see in a fact sheet — drawdowns, recoveries, and how the regional tilt actually played out.",
  alternates: { canonical: canonicalUrl("/compare") },
  openGraph: {
    title: "The Bouts — VEQT vs the field",
    description:
      "Three funds, three moments. Drawdowns, recoveries, and the regional tilts behind them.",
    url: canonicalUrl("/compare"),
  },
};

export default function ComparePage() {
  return (
    <InteriorShell>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
        ])}
      />

      {/* ── Lead ─────────────────────────────────────────────────── */}
      <section className="pt-8 sm:pt-10 pb-8 bs-enter">
        <p className="bs-stamp mb-3">The Bouts</p>
        <h1
          className="bs-display text-[2.25rem] sm:text-[3.25rem] lg:text-[4.25rem] leading-[0.98]"
          style={{ color: "var(--ink)" }}
        >
          Three funds.
          <br />
          <em className="bs-display-italic">Three moments.</em>
        </h1>
        <p
          className="bs-body italic mt-5 max-w-[58ch] text-[1.0625rem]"
          style={{ color: "var(--ink-soft)" }}
        >
          The differences you can&apos;t see in a fact sheet. VEQT, XEQT
          and ZEQT track the same world; what separates them is how
          they behaved when something happened.
        </p>
      </section>

      {/* ── EventHero — the bet ─────────────────────────────────── */}
      <section className="pt-6 sm:pt-8 border-t-2 border-[var(--ink)] pb-12 sm:pb-16">
        <EventHero />
      </section>

      {/* ── Tilt comparison ─────────────────────────────────────── */}
      <section className="pt-8 border-t-2 border-[var(--ink)] pb-12">
        <TiltComparison />
      </section>

      {/* ── Closing line ────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 text-center">
        <p
          className="bs-display-italic text-[1.625rem] sm:text-[2.125rem] lg:text-[2.5rem] leading-[1.15] max-w-[28ch] mx-auto"
          style={{ color: "var(--ink)" }}
        >
          They hold the same world, weighted differently.
        </p>
      </section>

      {/* ── Demoted spec table ─────────────────────────────────── */}
      <section
        className="pt-6 sm:pt-8 border-t border-[var(--ink)] pb-10"
        aria-labelledby="spec-eyebrow"
      >
        <p
          id="spec-eyebrow"
          className="bs-stamp mb-2"
          style={{ color: "var(--ink-mute)" }}
        >
          If you came for the spec sheet…
        </p>
        <h2
          className="bs-display text-[1.125rem] sm:text-[1.25rem] mb-5"
          style={{ color: "var(--ink-soft)" }}
        >
          Numbers, side-by-side.
        </h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table
            className="w-full bs-numerals border-t border-b border-[color:var(--rule)] text-[0.875rem] min-w-[560px]"
            style={{ color: "var(--ink-soft)" }}
          >
            <thead>
              <tr>
                <th className="bs-label text-left py-2 px-3 sm:px-0 sm:pr-4">Ticker</th>
                <th className="bs-label text-left py-2 px-3 sm:px-0 sm:pr-4">Name</th>
                <th className="bs-label text-left py-2 px-3 sm:px-0 sm:pr-4">MER</th>
                <th className="bs-label text-left py-2 px-3 sm:px-0 sm:pr-4">AUM</th>
                <th className="bs-label text-left py-2 px-3 sm:px-0 sm:pr-4">Holdings</th>
                <th className="bs-label text-left py-2 px-3 sm:px-0">Inception</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.etfs.map((etf, i) => (
                <tr
                  key={etf.ticker}
                  className={
                    i === 0
                      ? "border-t border-[color:var(--rule)]"
                      : "border-t border-[color:var(--rule)]"
                  }
                >
                  <td className="py-2.5 px-3 sm:px-0 sm:pr-4 font-mono tracking-wider text-[0.8125rem]">
                    {etf.ticker}
                  </td>
                  <td className="py-2.5 px-3 sm:px-0 sm:pr-4 italic">
                    {etf.name}
                  </td>
                  <td className="py-2.5 px-3 sm:px-0 sm:pr-4 tabular-nums">{etf.mer}</td>
                  <td className="py-2.5 px-3 sm:px-0 sm:pr-4 tabular-nums">{etf.aum}</td>
                  <td className="py-2.5 px-3 sm:px-0 sm:pr-4 tabular-nums">{etf.holdings}</td>
                  <td className="py-2.5 px-3 sm:px-0 tabular-nums">{etf.inception}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p
          className="bs-caption italic mt-4 text-[0.75rem]"
          style={{ color: "var(--ink-mute)" }}
        >
          Per-pairing breakdowns — VEQT vs each fund, with live performance
          data — live at <a href="/compare/veqt-vs-xeqt" className="bs-link">/compare/[ticker]</a>.
        </p>
      </section>
    </InteriorShell>
  );
}
