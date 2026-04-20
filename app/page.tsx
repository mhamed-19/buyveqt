"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useVeqtData } from "@/lib/useVeqtData";
import {
  UNDERLYING_ETFS,
  COMPARISON_DATA,
  LEARN_ARTICLES,
  STATIC_DATA,
} from "@/lib/constants";
import {
  VEQT_DISTRIBUTIONS,
  getTrailing12MonthDistributions,
} from "@/data/distributions";
import Masthead from "@/components/broadsheet/Masthead";
import OrnateRule from "@/components/broadsheet/OrnateRule";
import EngravingChart from "@/components/broadsheet/EngravingChart";

function formatCAD(n: number, digits = 0): string {
  return n.toLocaleString("en-CA", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export default function Home() {
  const { data, loading, period, setPeriod } = useVeqtData();
  const quote = data?.quote ?? null;
  const isPositive = (quote?.changePercent ?? 0) >= 0;

  const [investment, setInvestment] = useState(10_000);
  const historical = data?.historical ?? [];
  const inceptionPrice = historical[0]?.close ?? 0;
  const currentPrice = quote?.price ?? 0;
  const calcResult =
    inceptionPrice > 0 && currentPrice > 0
      ? (investment / inceptionPrice) * currentPrice
      : null;
  const calcReturn =
    calcResult !== null && investment > 0
      ? ((calcResult - investment) / investment) * 100
      : null;

  const trailingYield = useMemo(() => {
    if (!quote || quote.price <= 0) return null;
    const ttm = getTrailing12MonthDistributions();
    return (ttm / quote.price) * 100;
  }, [quote]);

  const latestDist = VEQT_DISTRIBUTIONS.distributions.find((d) => !d.estimated);
  const veqtComparisonRow = COMPARISON_DATA.etfs.find(
    (e) => e.ticker === "VEQT"
  );

  return (
    <div
      data-broadsheet
      className="min-h-screen relative overflow-x-hidden"
      style={{ backgroundColor: "var(--paper)" }}
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 relative">
        <Masthead quote={quote} loading={loading} />

        {/* ─────────────────────── THE LEAD ─────────────────────── */}
        <section className="py-10 sm:py-14 lg:py-20 bs-enter">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Column A — giant headline */}
            <div className="lg:col-span-8">
              <p className="bs-stamp mb-4">The Lead &middot; Today</p>
              <h2 className="bs-display-italic text-[3.25rem] sm:text-[5rem] lg:text-[7.5rem] text-[var(--ink)]">
                {isPositive ? "Another green day" : "Another red day"}
                <br />
                <span className="not-italic bs-display font-normal">
                  for the lazy
                </span>
                <br />
                <em className="text-[var(--stamp)]">investor.</em>
              </h2>

              <p className="bs-caption mt-6 max-w-lg">
                &mdash; VEQT closed at {loading || !quote ? "—" : `$${quote.price.toFixed(2)}`},{" "}
                {!loading && quote && (
                  <>
                    {isPositive ? "up" : "down"}{" "}
                    <span className="bs-numerals">
                      {Math.abs(quote.changePercent).toFixed(2)}%
                    </span>{" "}
                    on the day. One fund, ~13,700 companies, 50+ countries.
                  </>
                )}
              </p>
            </div>

            {/* Column B — dense stats block */}
            <aside className="lg:col-span-4 border-t border-[var(--ink)] pt-4">
              <dl className="grid grid-cols-2 gap-y-4 gap-x-6 bs-numerals">
                <div>
                  <dt className="bs-label mb-1">Last</dt>
                  <dd className="text-2xl">
                    {loading || !quote ? "—" : `$${quote.price.toFixed(2)}`}
                  </dd>
                </div>
                <div>
                  <dt className="bs-label mb-1">Change</dt>
                  <dd
                    className="text-2xl"
                    style={{
                      color: isPositive
                        ? "var(--print-green)"
                        : "var(--print-red)",
                    }}
                  >
                    {loading || !quote
                      ? "—"
                      : `${isPositive ? "+" : ""}${quote.changePercent.toFixed(2)}%`}
                  </dd>
                </div>
                <div>
                  <dt className="bs-label mb-1">52-wk Low</dt>
                  <dd className="text-lg">
                    {loading || !quote
                      ? "—"
                      : `$${quote.fiftyTwoWeekLow.toFixed(2)}`}
                  </dd>
                </div>
                <div>
                  <dt className="bs-label mb-1">52-wk High</dt>
                  <dd className="text-lg">
                    {loading || !quote
                      ? "—"
                      : `$${quote.fiftyTwoWeekHigh.toFixed(2)}`}
                  </dd>
                </div>
                <div>
                  <dt className="bs-label mb-1">MER</dt>
                  <dd className="text-lg">~{STATIC_DATA.mer.toFixed(2)}%</dd>
                </div>
                <div>
                  <dt className="bs-label mb-1">AUM</dt>
                  <dd className="text-lg">{STATIC_DATA.aum}</dd>
                </div>
                <div>
                  <dt className="bs-label mb-1">TTM Yield</dt>
                  <dd className="text-lg">
                    {trailingYield !== null
                      ? `${trailingYield.toFixed(2)}%`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="bs-label mb-1">Last Distribution</dt>
                  <dd className="text-lg">
                    {latestDist ? `$${latestDist.amount.toFixed(4)}` : "—"}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        {/* ─────────────────────── THE CHART ─────────────────────── */}
        <section className="pb-10 sm:pb-14 lg:pb-16 bs-enter">
          <EngravingChart
            data={historical}
            period={period}
            onPeriodChange={setPeriod}
            loading={loading}
          />
        </section>

        <OrnateRule label="The Portfolio" />

        {/* ─────────────────────── THE PORTFOLIO ─────────────────────── */}
        <section className="py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 bs-enter">
          <div className="lg:col-span-5">
            <h3 className="bs-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
              Four sleeves.
              <br />
              <em className="bs-display-italic text-[var(--stamp)]">
                One fund.
              </em>
            </h3>
            <p className="bs-body bs-lede mt-6">
              VEQT is not a stock. It is a single ticker that holds four
              Vanguard index ETFs covering every major equity market in the
              world. Rebalancing happens automatically inside the fund. Your
              only job, according to the people who coined the term, is not
              to sell.
            </p>
          </div>

          <div className="lg:col-span-7">
            <table className="w-full bs-numerals">
              <thead>
                <tr className="border-t border-b border-[var(--ink)]">
                  <th className="bs-label text-left py-2 w-1/2">Sleeve</th>
                  <th className="bs-label text-left py-2">Ticker</th>
                  <th className="bs-label text-right py-2">Weight</th>
                </tr>
              </thead>
              <tbody>
                {UNDERLYING_ETFS.map((etf) => (
                  <tr
                    key={etf.ticker}
                    className="border-b border-[var(--color-border)]"
                  >
                    <td className="py-3">
                      <span className="font-serif text-[1rem]">{etf.name}</span>
                      <span className="block bs-caption text-[12px]">
                        {etf.region}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-sm tracking-wider">
                      {etf.ticker}
                    </td>
                    <td className="py-3 text-right text-lg tabular-nums">
                      {etf.weight.toString().padStart(2, "0")}%
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 bs-label">Total</td>
                  <td />
                  <td className="py-3 text-right text-lg tabular-nums border-t-2 border-double border-[var(--ink)]">
                    100%
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="bs-caption mt-4 text-right">
              Source: Vanguard Canada, as published. Weights drift slightly
              between quarterly rebalances.
            </p>
          </div>
        </section>

        <OrnateRule label="If You Invested" />

        {/* ─────────────────── INCEPTION CALCULATOR ─────────────────── */}
        <section className="py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 bs-enter">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <table className="w-full bs-numerals">
              <tbody>
                <tr className="border-t border-[var(--ink)]">
                  <td className="py-3 bs-label">At inception</td>
                  <td className="py-3 text-right text-lg">
                    ${formatCAD(investment)}
                  </td>
                </tr>
                <tr className="border-t border-[var(--color-border)]">
                  <td className="py-3 bs-label">Today</td>
                  <td className="py-3 text-right text-2xl font-semibold">
                    {calcResult !== null
                      ? `$${formatCAD(calcResult, 0)}`
                      : "—"}
                  </td>
                </tr>
                <tr className="border-t border-[var(--color-border)]">
                  <td className="py-3 bs-label">Return</td>
                  <td
                    className="py-3 text-right text-lg"
                    style={{
                      color:
                        calcReturn !== null && calcReturn >= 0
                          ? "var(--print-green)"
                          : "var(--print-red)",
                    }}
                  >
                    {calcReturn !== null
                      ? `${calcReturn >= 0 ? "+" : ""}${calcReturn.toFixed(1)}%`
                      : "—"}
                  </td>
                </tr>
                <tr className="border-t border-b border-[var(--ink)]">
                  <td className="py-3 bs-label">Since</td>
                  <td className="py-3 text-right text-lg">Jan 2019</td>
                </tr>
              </tbody>
            </table>
            <p className="bs-caption mt-4">
              Price return only. Excludes reinvested distributions (which
              would add several percentage points). Past performance is a
              terrible predictor of future performance.
            </p>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <h3 className="bs-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
              <em className="bs-display-italic">Dear reader,</em>
              <br />
              imagine you bought{" "}
              <span className="inline-flex items-baseline gap-1 text-[var(--stamp)]">
                <span className="text-2xl">$</span>
                <input
                  type="number"
                  min={100}
                  step={100}
                  value={investment}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v > 0) setInvestment(v);
                  }}
                  className="bg-transparent border-b-2 border-[var(--stamp)] outline-none w-[5.5ch] text-center tabular-nums focus:border-[var(--ink)] transition-colors"
                  aria-label="Investment amount"
                />
              </span>{" "}
              the day VEQT launched.
            </h3>
            <p className="bs-body mt-6 max-w-lg">
              Change the number &mdash; the arithmetic updates at the same
              speed as your editing. The sidebar keeps score.
            </p>
            <Link
              href="/invest"
              className="bs-label mt-4 inline-block hover:text-[var(--stamp)] transition-colors"
            >
              More calculators, drawdowns, reinvested-dividend math &rarr;
            </Link>
          </div>
        </section>

        <OrnateRule label="The Hold Line" />

        {/* ─────────────────────── PULL QUOTE ─────────────────────── */}
        <section className="py-12 sm:py-20 bs-enter">
          <blockquote className="bs-display-italic text-[2.25rem] sm:text-[3.25rem] lg:text-[4.5rem] leading-[1.02] max-w-4xl text-[var(--ink)]">
            &ldquo;Time in the market beats timing the market. A globally
            diversified portfolio is, according to the Nobel committee, the
            closest thing to a free lunch in investing. Stay in the
            building.&rdquo;
          </blockquote>
          <p className="bs-label mt-8">
            &mdash; The Hold Line, repeated as often as needed
          </p>
        </section>

        <OrnateRule label="The Comparison" />

        {/* ─────────────────────── COMPARISON TABLE ─────────────────────── */}
        <section className="py-8 sm:py-12 bs-enter">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
            <div className="lg:col-span-5">
              <h3 className="bs-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
                VEQT <em className="bs-display-italic">vs.</em>
                <br />
                the field.
              </h3>
            </div>
            <p className="lg:col-span-7 bs-body">
              Three ETFs, one job: own the world in equity weight. The
              differences are smaller than the internet would have you
              believe, but they are not zero. Vanguard leans a little more
              Canadian; iShares leans a little more American; BMO is the
              youngest of the three.
            </p>
          </div>

          <table className="w-full bs-numerals border-t border-b border-[var(--ink)]">
            <thead>
              <tr>
                <th className="bs-label text-left py-3"></th>
                <th className="bs-label text-left py-3">Ticker</th>
                <th className="bs-label text-left py-3">MER</th>
                <th className="bs-label text-left py-3">AUM</th>
                <th className="bs-label text-left py-3">Holdings</th>
                <th className="bs-label text-left py-3">Inception</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.etfs.map((etf, idx) => (
                <tr
                  key={etf.ticker}
                  className={
                    idx === 0
                      ? "border-t-2 border-[var(--ink)]"
                      : "border-t border-[var(--color-border)]"
                  }
                >
                  <td className="py-4 font-serif italic">{etf.name}</td>
                  <td className="py-4 font-mono text-sm tracking-wider">
                    {etf.ticker}
                    {etf.ticker === "VEQT" && (
                      <span
                        className="ml-2 bs-stamp"
                        style={{
                          background: "var(--stamp)",
                          color: "var(--paper)",
                          padding: "2px 6px",
                          fontSize: "9px",
                        }}
                      >
                        The Paper
                      </span>
                    )}
                  </td>
                  <td className="py-4 tabular-nums">{etf.mer}</td>
                  <td className="py-4 tabular-nums">{etf.aum}</td>
                  <td className="py-4 tabular-nums">{etf.holdings}</td>
                  <td className="py-4 tabular-nums">{etf.inception}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="bs-caption mt-4 text-right">
            <Link href="/compare" className="bs-link">
              Full head-to-head &rarr;
            </Link>
          </p>
          {/* Veqt is always first in comparison data */}
          {veqtComparisonRow && null}
        </section>

        <OrnateRule label="Dispatches from the Archive" />

        {/* ─────────────────── LEARN DISPATCHES ─────────────────── */}
        <section className="py-8 sm:py-12 bs-enter">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {LEARN_ARTICLES.map((article, i) => (
              <article key={article.slug} className="flex flex-col">
                <p className="bs-stamp mb-2">
                  Dispatch No. {String(i + 1).padStart(2, "0")}
                </p>
                <Link href={`/learn/${article.slug}`} className="group block">
                  <h4 className="bs-display-italic text-[1.75rem] sm:text-[2rem] leading-[1.02] group-hover:text-[var(--stamp)] transition-colors">
                    {article.title}
                  </h4>
                </Link>
                <p className="bs-body mt-3 flex-1">{article.teaser}</p>
                <Link
                  href={`/learn/${article.slug}`}
                  className="bs-label mt-4 inline-flex items-center hover:text-[var(--stamp)] transition-colors"
                >
                  Read the dispatch &rarr;
                </Link>
              </article>
            ))}
          </div>
          <p className="bs-caption mt-8 text-center">
            <Link href="/learn" className="bs-link">
              Twenty more from the archive
            </Link>
          </p>
        </section>

        <OrnateRule label="Letters" />

        {/* ─────────────────────── LETTERS / COMMUNITY ─────────────────────── */}
        <section className="py-8 sm:py-12 bs-enter">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
            <div className="lg:col-span-5">
              <h3 className="bs-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
                Letters
                <br />
                <em className="bs-display-italic">to the Editor</em>
              </h3>
            </div>
            <p className="lg:col-span-7 bs-body">
              Two thousand Canadians argue, encourage, and talk themselves
              out of market-timing at{" "}
              <a
                href="https://reddit.com/r/JustBuyVEQT"
                target="_blank"
                rel="noopener noreferrer"
                className="bs-link"
              >
                r/JustBuyVEQT
              </a>
              . Not a newsletter. Not a Discord. A small, patient subreddit
              for the one-fund portfolio.
            </p>
          </div>

          <div className="bs-column-columns bs-body">
            <p>
              <em>&mdash; From a new subscriber, Ontario.</em> &ldquo;I spent
              three weeks trying to pick between VEQT and XEQT. Then I read
              the wiki and realised the differences compound to less than the
              cost of a coffee per year on a $50,000 portfolio. I bought VEQT
              on a Tuesday and got on with my life.&rdquo;
            </p>
            <p className="mt-6">
              <em>&mdash; A lurker of eighteen months, Calgary.</em>{" "}
              &ldquo;The best part of the subreddit is how aggressively
              unexciting it is. Every &lsquo;what do I do during this
              drawdown&rsquo; thread is answered the same way. Do nothing.
              Buy more if you can. That&rsquo;s the whole product.&rdquo;
            </p>
            <p className="mt-6">
              <em>&mdash; From the editors.</em> We keep no comment section,
              no email list, no sponsor, and no premium tier. The community
              lives on Reddit, where people have always argued about money.
            </p>
          </div>
        </section>

        <OrnateRule ornament="asterism" />

        {/* ─────────────────────── COLOPHON ─────────────────────── */}
        <footer className="py-12 sm:py-16 bs-enter">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-6 border-b border-[var(--ink)]">
            <div>
              <p className="bs-stamp mb-3">The Broadsheet</p>
              <p className="bs-caption">
                An unaffiliated, unpaid, single-subject broadsheet for holders
                of the Vanguard All-Equity ETF Portfolio. Typeset in Fraunces
                and Newsreader.
              </p>
            </div>
            <div>
              <p className="bs-stamp mb-3">The Navigation</p>
              <ul className="space-y-1.5 bs-body text-[0.95rem]">
                <li>
                  <Link href="/compare" className="bs-link">
                    The Comparison
                  </Link>
                </li>
                <li>
                  <Link href="/invest" className="bs-link">
                    The Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/inside-veqt" className="bs-link">
                    The Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="bs-link">
                    The Archive
                  </Link>
                </li>
                <li>
                  <Link href="/methodology" className="bs-link">
                    Methodology
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="bs-stamp mb-3">The Disclaimer</p>
              <p className="bs-caption">
                Not affiliated with, endorsed by, or sponsored by Vanguard.
                Nothing here is financial advice. All prices informational
                only and may be delayed. Consult a qualified advisor before
                investing.
              </p>
            </div>
          </div>

          <p className="bs-label text-center mt-6">
            &copy; {new Date().getFullYear()} BuyVEQT.ca &middot; Printed on
            the Internet &middot; Every Sunday, and whenever the market
            requires it
          </p>
        </footer>
      </div>
    </div>
  );
}
