import Link from "next/link";

export type RecommendsZone = "typical" | "notable" | "unusual" | "rare";

interface EditionRecommendsProps {
  zone: RecommendsZone;
}

interface ZoneCopy {
  zoneLabel: string;
  verdict: string;
  href: string;
  linkLabel: string;
}

// Strings are LOCKED per Round 2 TASKS.md and the rec-board mockup.
const COPY: Record<RecommendsZone, ZoneCopy> = {
  typical: {
    zoneLabel: "Typical",
    verdict: "Hold. Contribute on schedule. Today is noise.",
    href: "/learn/why-timing-the-market-fails",
    linkLabel: "Why timing the market fails",
  },
  notable: {
    zoneLabel: "Notable",
    verdict:
      "Hold. If you’re contributing this month, today is a slightly better entry than yesterday.",
    href: "/learn/lump-sum-vs-dca",
    linkLabel: "Lump sum vs. DCA",
  },
  unusual: {
    zoneLabel: "Unusual",
    verdict: "Hold. Resist the urge to check again before tomorrow.",
    href: "/learn/veqt-is-down",
    linkLabel: "VEQT is down — what now?",
  },
  rare: {
    zoneLabel: "Rare",
    verdict:
      "Hold. Days like this are exactly what your time horizon is for.",
    href: "/learn/why-stocks-go-up",
    linkLabel: "Why stocks go up (over decades)",
  },
};

export default function EditionRecommends({ zone }: EditionRecommendsProps) {
  const copy = COPY[zone];
  return (
    <aside className="bs-rec-board">
      <span className="bs-stamp bs-rec-board__head">
        Today&rsquo;s edition recommends
        <span className="bs-rec-board__zone">{copy.zoneLabel}</span>
      </span>
      <h3 className="bs-rec-board__verdict">{copy.verdict}</h3>
      <Link href={copy.href} className="bs-rec-board__read">
        Read &rarr; {copy.linkLabel}
      </Link>
    </aside>
  );
}
