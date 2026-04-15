"use client";

import RegionalAttribution from "./RegionalAttribution";
import HoldLineCard from "./HoldLine";
import AnimateIn from "@/components/ui/AnimateIn";

interface DailyPulseProps {
  /** VEQT's current daily change % — passed to HoldLine to bias mood selection. */
  dailyChangePercent?: number | null;
}

/**
 * The Daily Pulse band — Regional Attribution + Hold Line, stacked.
 * Sits between the hero and the price chart on the home page and gives
 * returning visitors a reason to bookmark: today's contribution by sleeve
 * plus one calm sentence of perspective.
 */
export default function DailyPulse({ dailyChangePercent }: DailyPulseProps) {
  return (
    <AnimateIn as="section" className="py-6 space-y-5">
      <RegionalAttribution />
      <HoldLineCard dailyChangePercent={dailyChangePercent} />
    </AnimateIn>
  );
}
