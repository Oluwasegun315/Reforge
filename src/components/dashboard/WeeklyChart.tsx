"use client";

import type { DayActivity } from "@/lib/progress";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function WeeklyChart({
  data,
  heightClass = "h-48",
}: {
  data: DayActivity[];
  heightClass?: string;
}) {
  return (
    <div className={heightClass}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="day" stroke="var(--chart-axis)" fontSize={12} />
          <YAxis allowDecimals={false} stroke="var(--chart-axis)" fontSize={12} width={24} />
          <Tooltip
            contentStyle={{
              background: "var(--chart-tooltip-bg)",
              border: "1px solid var(--chart-tooltip-border)",
              borderRadius: 8,
              color: "var(--text)",
            }}
            formatter={(value, name) => [
              value as number,
              name === "minutes" ? "Minutes" : "Sessions",
            ]}
          />
          <Bar dataKey="workouts" fill="var(--chart-bar)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
