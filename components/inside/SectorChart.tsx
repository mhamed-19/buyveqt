"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { VEQT_SECTOR_ALLOCATION } from "@/data/holdings";
import { ChartTooltipWrapper, AXIS_PROPS } from "@/lib/chart-utils";

const SECTOR_COLORS = [
  "#2563eb", "#dc2626", "#16a34a", "#f59e0b", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1", "#14b8a6",
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { sector: string } }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <ChartTooltipWrapper>
      <p className="text-sm font-medium text-[var(--color-text-primary)]">
        {payload[0].payload.sector}: {payload[0].value}%
      </p>
    </ChartTooltipWrapper>
  );
}

export default function SectorChart() {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart
        data={VEQT_SECTOR_ALLOCATION}
        layout="vertical"
        margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
      >
        <XAxis
          type="number"
          domain={[0, 30]}
          tickFormatter={(v: number) => `${v}%`}
          {...AXIS_PROPS}
        />
        <YAxis
          type="category"
          dataKey="sector"
          width={140}
          tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-base)" }} />
        <Bar dataKey="weight" radius={[0, 4, 4, 0]} maxBarSize={24}>
          {VEQT_SECTOR_ALLOCATION.map((_, i) => (
            <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
