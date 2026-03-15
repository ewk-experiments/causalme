"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import { VARIABLES, DayData } from "@/lib/demo-data";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

// Compute correlation matrix
function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx, dy = y[i] - my;
    num += dx * dy; dx2 += dx * dx; dy2 += dy * dy;
  }
  return dx2 && dy2 ? num / Math.sqrt(dx2 * dy2) : 0;
}

function getValues(data: DayData[], key: string): number[] {
  return data.map(d => (d as unknown as Record<string, number>)[key]);
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1c2040] border border-white/10 rounded-lg px-3 py-2 text-xs">
      <p className="text-white/40 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white/70">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</p>
      ))}
    </div>
  );
};

export default function DataDashboard() {
  const { state } = useApp();
  const [selectedVar, setSelectedVar] = useState("sleep");
  const data = state.data;

  // Time series data formatted for Recharts
  const chartData = useMemo(() => 
    data.map(d => ({
      date: d.date.slice(5), // MM-DD
      value: (d as unknown as Record<string, number>)[selectedVar] as number,
    })),
    [data, selectedVar]
  );

  // Correlation matrix
  const varIds = VARIABLES.map(v => v.id);
  const correlationMatrix = useMemo(() => {
    if (data.length < 3) return [];
    return varIds.map(a => ({
      id: a,
      correlations: varIds.map(b => ({
        id: b,
        value: pearsonCorrelation(getValues(data, a), getValues(data, b)),
      })),
    }));
  }, [data, varIds]);

  // Stats
  const varInfo = VARIABLES.find(v => v.id === selectedVar)!;
  const values = getValues(data, selectedVar);
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const max = values.length ? Math.max(...values) : 0;
  const min = values.length ? Math.min(...values) : 0;
  const lastWeek = values.slice(-7);
  const prevWeek = values.slice(-14, -7);
  const lastAvg = lastWeek.length ? lastWeek.reduce((a, b) => a + b, 0) / lastWeek.length : 0;
  const prevAvg = prevWeek.length ? prevWeek.reduce((a, b) => a + b, 0) / prevWeek.length : 0;
  const weekChange = prevAvg ? ((lastAvg - prevAvg) / prevAvg * 100) : 0;

  return (
    <div className="p-4 md:p-6 pt-14 md:pt-6 overflow-y-auto h-screen">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-display text-white">Data Dashboard</h1>
        <p className="text-xs text-white/30 mt-1">{data.length} days of data • {VARIABLES.length} variables tracked</p>
      </div>

      {/* Variable selector */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {VARIABLES.map(v => (
          <button
            key={v.id}
            onClick={() => setSelectedVar(v.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              selectedVar === v.id ? "text-white" : "text-white/30 hover:text-white/50 border-white/[0.06]"
            }`}
            style={selectedVar === v.id ? { background: v.color + "20", borderColor: v.color + "40" } : {}}
          >
            {v.icon} {v.name}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Average", value: avg.toFixed(1), sub: varInfo.unit },
          { label: "Range", value: `${min.toFixed(1)} – ${max.toFixed(1)}`, sub: varInfo.unit },
          { label: "This Week", value: lastAvg.toFixed(1), sub: varInfo.unit },
          { label: "vs Last Week", value: `${weekChange > 0 ? "+" : ""}${weekChange.toFixed(1)}%`, sub: weekChange > 0 ? "↑" : weekChange < 0 ? "↓" : "—" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#161a2e] rounded-xl border border-white/[0.06] p-4"
          >
            <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-lg font-semibold text-white">{stat.value}</p>
            <p className="text-[10px] text-white/20">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Time series chart */}
      <div className="bg-[#161a2e] rounded-xl border border-white/[0.06] p-5 mb-6">
        <h3 className="text-xs font-bold text-white/20 uppercase tracking-widest mb-4">
          {varInfo.icon} {varInfo.name} Over Time
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={varInfo.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: varInfo.color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Correlation matrix */}
      <div className="bg-[#161a2e] rounded-xl border border-white/[0.06] p-5">
        <h3 className="text-xs font-bold text-white/20 uppercase tracking-widest mb-4">Correlation Matrix</h3>
        <div className="overflow-x-auto">
          <div className="inline-grid gap-px" style={{ gridTemplateColumns: `auto repeat(${varIds.length}, 1fr)` }}>
            {/* Header row */}
            <div />
            {VARIABLES.map(v => (
              <div key={v.id} className="text-center text-[9px] text-white/30 px-1 py-1 truncate w-14">
                {v.icon}
              </div>
            ))}
            {/* Data rows */}
            {correlationMatrix.map(row => (
              <>
                <div key={`label-${row.id}`} className="text-[9px] text-white/30 pr-2 flex items-center">
                  {VARIABLES.find(v => v.id === row.id)?.icon}
                </div>
                {row.correlations.map(cell => {
                  const val = cell.value;
                  const absVal = Math.abs(val);
                  const bg = val > 0 
                    ? `rgba(99, 230, 190, ${absVal * 0.5})` 
                    : `rgba(248, 113, 113, ${absVal * 0.5})`;
                  return (
                    <div
                      key={`${row.id}-${cell.id}`}
                      className="w-14 h-8 flex items-center justify-center text-[9px] font-mono text-white/60 rounded-sm"
                      style={{ background: bg }}
                      title={`${row.id} ↔ ${cell.id}: ${val.toFixed(2)}`}
                    >
                      {row.id === cell.id ? "1.0" : val.toFixed(2)}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
