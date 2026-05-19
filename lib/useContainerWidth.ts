"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Watch the rendered width of a wrapper element. Editorial widgets need
 * container-relative responsiveness — viewport queries lie when the prose
 * column is capped at 32rem inside a wider grid.
 */
export function useContainerWidth<T extends HTMLElement>(): {
  ref: React.RefObject<T | null>;
  width: number;
} {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, width };
}
