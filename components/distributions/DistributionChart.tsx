"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { VEQT_DISTRIBUTIONS } from "@/data/distributions";
import { ChartTooltipWrapper, GRID_PROPS, AXIS_PROPS } from "@/lib/chart-utils";

const chartData = [...VEQT_DISTRIBUTIONS.distributions]
  .reverse()
  .map((d) => ({
    date: d.exDate,
    amount: d.amount,
    label: new Date(d.exDate).getFullYear().toString(),
    estimated: d.estimated ?? false,
    fill: d.estimated ? "#93c5fd" : "#2563eb",
  }));

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { date: string; estimated: boolean } }[];
}) {
  if (!active || !payload?.length) return null;
  const date = new Date(payload[0].payload.date);
  const estimated = payload[0].payload.estimated;
  return (
    <ChartTooltipWrapper>
      <p className="text-[11px] text-[var(--color-text-muted)]">
        {date.toLocaleDateString("en-CA", { year: "numeric", month: "long" })}
        {estimated && " (estimated)"}
      </p>
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
        ${payload[0].value.toFixed(4)} per unit
      </p>
    </ChartTooltipWrapper>
  );
}

export default function DistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData}>
        <CartesianGrid {...GRID_PROPS} />
        <XAxis dataKey="label" {...AXIS_PROPS} interval={0} />
        <YAxis
          {...AXIS_PROPS}
          tickFormatter={(v: number) => `$${v.toFixed(2)}`}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-base)" }} />
        <Bar dataKey="amount" radius={[3, 3, 0, 0]} maxBarSize={32}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
