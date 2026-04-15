"use client";

import { useEffect, useState } from "react";
import { pickHoldLine, type HoldLine } from "@/lib/hold-lines";

interface HoldLineProps {
  /** Today's VEQT daily change in % — biases the pick toward 'red' lines on down days. */
  dailyChangePercent?: number | null;
}

export default function HoldLineCard({ dailyChangePercent }: HoldLineProps) {
  const [line, setLine] = useState<HoldLine | null>(null);

  // Pick once per mount on the client — avoids SSR/CSR mismatch from Math.random().
  useEffect(() => {
    setLine(pickHoldLine(Math.random(), dailyChangePercent ?? null));
  }, [dailyChangePercent]);

  return (
    <div className="card-editorial p-5 flex flex-col gap-2">
      <p className="section-label">The Hold Line</p>
      <blockquote
        className={`font-serif italic text-lg sm:text-xl text-[var(--color-text-primary)] leading-snug transition-opacity duration-300 ${
          line ? "opacity-100" : "opacity-0"
        }`}
      >
        {line ? `“${line.text}”` : "\u00A0"}
      </blockquote>
    </div>
  );
}
