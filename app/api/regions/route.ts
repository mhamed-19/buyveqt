import { NextResponse } from "next/server";
import { getQuote } from "@/lib/data";
import { UNDERLYING_ETFS } from "@/lib/constants";

// Mirrors /api/veqt so the regional band refreshes with the same cadence
// as the main chart/summary. Yahoo is free; 5 minutes is comfortable.
export const revalidate = 300;

interface RegionResponse {
  ticker: string;
  region: string;
  label: string;
  weight: number;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  /** Daily contribution to VEQT's move = (changePercent × weight) / 100 */
  contribution: number | null;
  source: "alpha-vantage" | "yahoo-finance" | "cache" | null;
  fetchedAt: string | null;
  error: boolean;
}

const REGION_LABELS: Record<string, string> = {
  US: "United States",
  Canada: "Canada",
  International: "Int'l Developed",
  "Emerging Markets": "Emerging Markets",
};

// Fixed ordering so the grid renders consistently: CA, US, Int'l Dev, EM
const ORDERED = ["Canada", "US", "International", "Emerging Markets"];

export async function GET() {
  const etfs = ORDERED.map(
    (region) => UNDERLYING_ETFS.find((e) => e.region === region)!
  );

  const results = await Promise.allSettled(
    etfs.map((etf) => getQuote(etf.ticker))
  );

  const regions: RegionResponse[] = etfs.map((etf, i) => {
    const result = results[i];
    const base = {
      ticker: etf.ticker,
      region: etf.region,
      label: REGION_LABELS[etf.region] ?? etf.region,
      weight: etf.weight,
    };

    if (result.status !== "fulfilled") {
      return {
        ...base,
        price: null,
        change: null,
        changePercent: null,
        contribution: null,
        source: null,
        fetchedAt: null,
        error: true,
      };
    }

    const q = result.value;
    return {
      ...base,
      price: q.price,
      change: q.change,
      changePercent: q.changePercent,
      contribution: (q.changePercent * etf.weight) / 100,
      source: q.source,
      fetchedAt: q.fetchedAt,
      error: false,
    };
  });

  return NextResponse.json({
    regions,
    fetchedAt: new Date().toISOString(),
  });
}
