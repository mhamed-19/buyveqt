import data from "./data/compare-events-2026.json";

export type FundCode = "VEQT" | "XEQT" | "ZEQT";

export interface PricePoint {
  /** Day index inside the window (0-based). */
  d: number;
  /** Normalized close — day 0 = 1.000. */
  p: number;
}

export interface EventShape {
  /** Days of pre-event flat price before the drop begins. */
  preDays: number;
  /** Day index of the trough. */
  troughDay: number;
  /** Normalized price at day 89 (end of window) for the highlight fund. */
  endRecovery: number;
  /**
   * Per-fund scaling on the drawdown depth relative to the highlight
   * fund. 1.0 = same depth; >1 = deeper; <1 = shallower. The recovery
   * shape is the same — only the trough gets scaled.
   */
  tilts: Record<FundCode, number>;
}

export interface CompareEvent {
  id: string;
  label: string;
  title: string;
  date: string;
  highlightFund: FundCode;
  anecdote: string;
  drawdown: Record<FundCode, number>;
  recoveryDays: Record<FundCode, number>;
  shape: EventShape;
}

interface Data {
  events: CompareEvent[];
}

const TYPED = data as unknown as Data;

const WINDOW_DAYS = 90;

/**
 * Build a 90-day normalized price series for one fund inside one
 * event window. The series is generated deterministically from the
 * sparse `shape` block so the JSON file stays compact:
 *
 *   - days 0..preDays-1: flat at 1.0 (pre-event)
 *   - days preDays..troughDay: linear drop to (1 + drawdown × tilt)
 *   - days troughDay..89: smooth ease toward `endRecovery`
 *
 * The result is a chart-ready array of {d, p} points whose actual
 * trough matches `event.drawdown[fund]` (modulo small interpolation).
 */
export function buildSeries(event: CompareEvent, fund: FundCode): PricePoint[] {
  const tilt = event.shape.tilts[fund] ?? 1;
  const baseTrough = event.drawdown[event.highlightFund];
  const fundTrough = baseTrough * tilt;
  const troughValue = 1 + fundTrough;
  const endValue = event.shape.endRecovery * (fund === event.highlightFund ? 1 : tilt > 1 ? 0.99 : 1.01);

  const out: PricePoint[] = [];
  for (let d = 0; d < WINDOW_DAYS; d++) {
    let p: number;
    if (d <= event.shape.preDays) {
      p = 1;
    } else if (d <= event.shape.troughDay) {
      const t = (d - event.shape.preDays) / Math.max(1, event.shape.troughDay - event.shape.preDays);
      p = 1 + fundTrough * t;
    } else {
      const t = (d - event.shape.troughDay) / Math.max(1, WINDOW_DAYS - 1 - event.shape.troughDay);
      // Smooth ease-out from trough toward endValue
      const eased = 1 - Math.pow(1 - t, 1.6);
      p = troughValue + (endValue - troughValue) * eased;
    }
    out.push({ d, p });
  }
  return out;
}

export function getEvents(): CompareEvent[] {
  return TYPED.events;
}

export const COMPARE_EVENTS = TYPED.events;
export const FUND_CODES: FundCode[] = ["VEQT", "XEQT", "ZEQT"];
export const COMPARE_WINDOW_DAYS = WINDOW_DAYS;

/**
 * Q1 2026 regional weights for the three funds, used by
 * TiltComparison and the home-page TiltBar. Same numbers,
 * normalized to sum to 1 per fund.
 */
export const COMPARE_TILTS: Record<FundCode, { us: number; ca: number; dev: number; em: number }> = {
  VEQT: { us: 0.434, ca: 0.318, dev: 0.180, em: 0.068 },
  XEQT: { us: 0.460, ca: 0.260, dev: 0.220, em: 0.060 },
  ZEQT: { us: 0.430, ca: 0.260, dev: 0.240, em: 0.070 },
};
