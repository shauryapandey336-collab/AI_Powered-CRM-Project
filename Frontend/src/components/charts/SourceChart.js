"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const SOURCE_COLORS = {
  CSV: "#8b5cf6",
  MANUAL: "#06b6d4",
  WEBSITE: "#3b82f6",
  OTHER: "#64748b"
};

export default function SourceChart({ data = {} }) {
  const chartData = Object.keys(data).map((source) => ({
    name: source,
    count: data[source] || 0
  }));

  const hasData = chartData.some((item) => item.count > 0);

  if (!hasData) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No lead source distribution available
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "0.75rem", color: "#fff" }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={`bar-${entry.name}`} fill={SOURCE_COLORS[entry.name] || "#6366f1"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
