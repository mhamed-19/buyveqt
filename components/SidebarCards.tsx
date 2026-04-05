import Link from "next/link";
import { LATEST_DISTRIBUTION } from "@/lib/constants";

export default function SidebarCards() {
  return (
    <div className="flex flex-col gap-4">
      {/* Latest Distribution */}
      <div className="card-editorial p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Latest Distribution
        </h3>
        <p className="font-serif text-xl font-normal tabular-nums text-[var(--color-text-primary)]">
          {LATEST_DISTRIBUTION.amount}
          <span className="text-xs font-sans font-normal text-[var(--color-text-muted)] ml-1.5">
            per unit
          </span>
        </p>
        <div className="mt-3 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--color-text-muted)]">Ex-dividend</span>
            <span className="font-medium">{LATEST_DISTRIBUTION.exDivDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-muted)]">Payable</span>
            <span className="font-medium">{LATEST_DISTRIBUTION.payableDate}</span>
          </div>
        </div>
        <Link
          href="/distributions"
          className="inline-block mt-3 text-sm font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors"
        >
          Full history &rarr;
        </Link>
      </div>

      {/* Quick Compare */}
      <div className="card-editorial p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
          Quick Compare
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-3 leading-relaxed">
          How does VEQT compare to XEQT and ZEQT?
        </p>
        <Link
          href="/compare"
          className="inline-flex items-center text-sm font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors"
        >
          See comparison &rarr;
        </Link>
      </div>

      {/* Why VEQT */}
      <div className="card-editorial p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Why investors choose VEQT
        </h3>
        <ul className="space-y-2.5 text-sm text-[var(--color-text-secondary)]">
          <li className="flex items-start gap-2.5">
            <span className="text-[var(--color-accent)] mt-0.5 text-xs">&#x25C6;</span>
            One-ticket global diversification
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[var(--color-accent)] mt-0.5 text-xs">&#x25C6;</span>
            ~0.20% MER — low cost
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[var(--color-accent)] mt-0.5 text-xs">&#x25C6;</span>
            Automatic rebalancing
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[var(--color-accent)] mt-0.5 text-xs">&#x25C6;</span>
            100% equity for long-term growth
          </li>
        </ul>
      </div>
    </div>
  );
}
