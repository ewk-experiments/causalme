"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { NODES, EDGES } from "@/lib/mock-data";

function propagate(nodeId: string, delta: number, visited = new Set<string>()): Record<string, number> {
  const result: Record<string, number> = {};
  visited.add(nodeId);
  const outEdges = EDGES.filter(e => e.source === nodeId && !visited.has(e.target));
  for (const edge of outEdges) {
    const effect = delta * edge.weight;
    result[edge.target] = (result[edge.target] || 0) + effect;
    const downstream = propagate(edge.target, effect, new Set(visited));
    for (const [k, v] of Object.entries(downstream)) {
      result[k] = (result[k] || 0) + v;
    }
  }
  return result;
}

export default function WhatIfPage() {
  const [selectedId, setSelectedId] = useState("sleep");
  const [sliderValue, setSliderValue] = useState(50);

  const selected = NODES.find(n => n.id === selectedId)!;
  const delta = (sliderValue - 50) / 50; // -1 to 1
  const effects = useMemo(() => propagate(selectedId, delta), [selectedId, delta]);

  const sortedEffects = Object.entries(effects)
    .map(([id, val]) => ({ node: NODES.find(n => n.id === id)!, value: val }))
    .filter(e => e.node)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  return (
    <div className="p-4 md:p-6 pt-14 md:pt-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">What If Simulator</h1>
      <p className="text-sm text-gray-500 mb-8">
        Change a variable and watch ripple effects cascade through your life graph
      </p>

      {/* Variable selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {NODES.map(n => (
          <button
            key={n.id}
            onClick={() => { setSelectedId(n.id); setSliderValue(50); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedId === n.id
                ? "text-white shadow-lg"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
            style={selectedId === n.id ? { backgroundColor: n.color } : {}}
          >
            <span>{n.icon}</span> {n.label}
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            {selected.icon} {selected.label}
          </h3>
          <span className="text-sm font-mono" style={{ color: selected.color }}>
            {delta > 0 ? "+" : ""}{Math.round(delta * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={sliderValue}
          onChange={e => setSliderValue(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #e2e8f0 50%, #10b981 100%)`,
            accentColor: selected.color,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Much less</span>
          <span>Current</span>
          <span>Much more</span>
        </div>
      </div>

      {/* Ripple effects */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Predicted Ripple Effects</h3>
      <div className="grid gap-3">
        {sortedEffects.map((effect, i) => {
          const pct = Math.round(effect.value * 100);
          const isPositive = pct > 0;
          const confidence = Math.max(60, 95 - Math.abs(pct) * 0.5);

          return (
            <motion.div
              key={effect.node.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
            >
              <span className="text-2xl">{effect.node.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{effect.node.label}</span>
                  <span className={`text-lg font-mono font-bold ${isPositive ? "text-green-500" : "text-red-500"}`}>
                    {isPositive ? "+" : ""}{pct}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(Math.abs(pct) * 2, 100)}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: isPositive ? "#10b981" : "#ef4444" }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{Math.round(confidence)}% confidence</span>
                </div>
              </div>
            </motion.div>
          );
        })}
        {sortedEffects.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">Move the slider to see predicted effects</p>
        )}
      </div>
    </div>
  );
}
