"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const STATUS_COLORS = {
  NEW: "#3b82f6",
  CONTACTED: "#f59e0b",
  QUALIFIED: "#a855f7",
  PROPOSAL: "#6366f1",
  WON: "#10b981",
  LOST: "#f43f5e"
};

export default function StatusChart({ data = {} }) {
  const chartData = Object.keys(data).map((status) => ({
    name: status,
    value: data[status] || 0
  })).filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No lead status data available yet
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name] || "#64748b"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "0.75rem", color: "#fff" }}
          />
          <Legend formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
