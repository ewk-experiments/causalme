"use client";

import { useState } from "react";
import { TIMELINE_DATA, LIFE_EVENTS, NODES } from "@/lib/mock-data";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const VARIABLES = NODES.map(n => ({ id: n.id, label: n.label, color: n.color, icon: n.icon }));

export default function TimelinePage() {
  const [activeVars, setActiveVars] = useState<string[]>(["sleep", "mood", "productivity"]);

  const toggle = (id: string) => {
    setActiveVars(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 md:p-6 pt-14 md:pt-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Timeline</h1>
      <p className="text-sm text-gray-500 mb-6">
        Historical view of your life variables with detected causal events
      </p>

      {/* Variable toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {VARIABLES.map(v => (
          <button
            key={v.id}
            onClick={() => toggle(v.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              activeVars.includes(v.id)
                ? "text-white border-transparent shadow-sm"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
            style={activeVars.includes(v.id) ? { backgroundColor: v.color } : {}}
          >
            {v.icon} {v.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={TIMELINE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={d => d.split("-").slice(1).join("/")}
            />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: 12,
              }}
            />
            {LIFE_EVENTS.map(evt => (
              <ReferenceLine
                key={evt.date}
                x={evt.date}
                stroke="#cbd5e1"
                strokeDasharray="4 4"
                label={{
                  value: evt.label,
                  position: "top",
                  fill: "#94a3b8",
                  fontSize: 10,
                }}
              />
            ))}
            {VARIABLES.filter(v => activeVars.includes(v.id)).map(v => (
              <Line
                key={v.id}
                type="monotone"
                dataKey={v.id}
                stroke={v.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Life events list */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Life Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {LIFE_EVENTS.map(evt => (
            <div key={evt.date} className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                evt.type === "work" ? "bg-blue-400" : evt.type === "health" ? "bg-green-400" : "bg-pink-400"
              }`} />
              <div>
                <p className="text-sm font-medium text-gray-900">{evt.label}</p>
                <p className="text-xs text-gray-400">{evt.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
