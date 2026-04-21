import type { Region } from "@/lib/useRegions";

export interface LeadCopy {
  /** Small-caps kicker above the headline. Short, categorical. */
  deck: string;
  /** The main editorial statement. Single line or two — whatever flows. */
  headline: string;
}

/**
 * Compose the Lead deck + headline from live data.
 *
 * The goal: replace the old static template ("Another green/red day for the
 * lazy investor") with a genuinely varying two-part editorial unit that
 * changes meaningfully with the day. The deck categorizes (A RALLY, A SELL-OFF,
 * A QUIET TAPE, etc.); the headline names the driving sleeve or the consensus.
 *
 * Pure function. No news API — the regional attribution IS the driver narrative.
 */
export function computeLeadHeadline(
  veqtChangePercent: number | null | undefined,
  regions: readonly Region[] = []
): LeadCopy {
  // Before live data arrives.
  if (veqtChangePercent === null || veqtChangePercent === undefined) {
    return { deck: "The Lead · Today", headline: "The tape awaits." };
  }

  const mag = Math.abs(veqtChangePercent);
  const up = veqtChangePercent >= 0;

  // Rank regions by absolute contribution — which sleeve drove VEQT's move?
  const ranked = regions
    .filter((r) => !r.error && typeof r.contribution === "number")
    .slice()
    .sort(
      (a, b) =>
        Math.abs((b.contribution ?? 0)) - Math.abs((a.contribution ?? 0))
    );
  const leader = ranked[0];

  // Is the leader moving in the same direction as VEQT, or against?
  const leaderAligned =
    leader !== undefined &&
    typeof leader.contribution === "number" &&
    ((leader.contribution >= 0 && up) || (leader.contribution < 0 && !up));

  // Do all four sleeves agree on direction?
  const consensus =
    regions.length >= 4 &&
    regions.every(
      (r) =>
        r.error ||
        r.changePercent === null ||
        (up ? r.changePercent >= 0 : r.changePercent <= 0)
    );

  const regionPhrase = (r: Region): string => {
    switch (r.region) {
      case "US":
        return "the U.S.";
      case "Canada":
        return "Canada";
      case "International":
        return "developed markets";
      case "Emerging Markets":
        return "emerging markets";
      default:
        return r.label.toLowerCase();
    }
  };
  const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // ── Flat session (<0.2%) ─────────────────────────────────
  if (mag < 0.2) {
    return {
      deck: "A quiet tape",
      headline: "Little movement on the day.",
    };
  }

  // ── Modest (0.2% – 0.7%) ─────────────────────────────────
  if (mag < 0.7) {
    if (!leader) {
      return up
        ? { deck: "Green ink", headline: "A gentle session." }
        : { deck: "Red ink", headline: "A narrow pullback." };
    }
    if (leaderAligned) {
      return up
        ? {
            deck: "Green ink",
            headline: `${capFirst(regionPhrase(leader))} helped the tape.`,
          }
        : {
            deck: "Red ink",
            headline: `${capFirst(regionPhrase(leader))} weighed on the day.`,
          };
    }
    return up
      ? {
          deck: "Green ink",
          headline: `${capFirst(regionPhrase(leader))} held the tape back.`,
        }
      : {
          deck: "Red ink",
          headline: `${capFirst(regionPhrase(leader))} cushioned the fall.`,
        };
  }

  // ── Notable (0.7% – 1.5%) ────────────────────────────────
  if (mag < 1.5) {
    if (consensus && up) {
      return {
        deck: "A broad rally",
        headline: "Every region in the green.",
      };
    }
    if (consensus && !up) {
      return {
        deck: "A broad decline",
        headline: "Every region in the red.",
      };
    }
    if (!leader) {
      return up
        ? { deck: "A strong session", headline: "Green ink across the tape." }
        : { deck: "A rough session", headline: "Red ink across the tape." };
    }
    return up
      ? {
          deck: "A strong session",
          headline: `${capFirst(regionPhrase(leader))} out in front.`,
        }
      : {
          deck: "A rough session",
          headline: `${capFirst(regionPhrase(leader))} drags the tape.`,
        };
  }

  // ── Sharp (1.5% – 2.5%) ──────────────────────────────────
  if (mag < 2.5) {
    if (!leader) {
      return up
        ? { deck: "A rally", headline: "The tape runs hot." }
        : { deck: "A sell-off", headline: "The tape bleeds." };
    }
    return up
      ? {
          deck: "A rally",
          headline: `${capFirst(regionPhrase(leader))} leads.`,
        }
      : {
          deck: "A sell-off",
          headline: `${capFirst(regionPhrase(leader))} leads the slide.`,
        };
  }

  // ── Extreme (>=2.5%) ─────────────────────────────────────
  if (!leader) {
    return up
      ? { deck: "A surge", headline: "The world rips higher." }
      : { deck: "A rout", headline: "The world gives it up." };
  }
  return up
    ? {
        deck: "A surge",
        headline: `${capFirst(regionPhrase(leader))} drives the tape.`,
      }
    : {
        deck: "A rout",
        headline: `${capFirst(regionPhrase(leader))} drives the fall.`,
      };
}
