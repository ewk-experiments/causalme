"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CausalGraph from "@/components/CausalGraphNew";
import { useApp } from "@/lib/store";
import { VARIABLES, CausalEdge } from "@/lib/demo-data";
import { runWhatIfSimulation } from "@/lib/gemini";
import { Sparkles, Loader2 } from "lucide-react";

// Local propagation (no API needed)
function propagateLocal(
  nodeId: string,
  deltaPct: number,
  edges: CausalEdge[],
  visited = new Set<string>()
): Record<string, number> {
  const result: Record<string, number> = {};
  visited.add(nodeId);
  const out = edges.filter(e => e.cause === nodeId && !visited.has(e.effect));
  for (const edge of out) {
    const effect = deltaPct * edge.strength;
    result[edge.effect] = (result[edge.effect] || 0) + effect;
    const downstream = propagateLocal(edge.effect, effect, edges, new Set(visited));
    for (const [k, v] of Object.entries(downstream)) {
      result[k] = (result[k] || 0) + v;
    }
  }
  return result;
}

export default function WhatIfPage() {
  const { state } = useApp();
  const [selectedId, setSelectedId] = useState("sleep");
  const [sliderValue, setSliderValue] = useState(50);
  const [aiResults, setAiResults] = useState<Record<string, { change: number; reasoning: string }> | null>(null);
  const [loading, setLoading] = useState(false);
  const [animatedChanges, setAnimatedChanges] = useState<Record<string, number>>({});

  const selected = VARIABLES.find(v => v.id === selectedId)!;
  const deltaPct = (sliderValue - 50) * 2; // -100 to +100

  // Local propagation
  const localEffects = useMemo(
    () => propagateLocal(selectedId, deltaPct / 100, state.edges),
    [selectedId, deltaPct, state.edges]
  );

  const effects = useMemo(() => {
    if (aiResults) {
      return Object.entries(aiResults)
        .map(([id, val]) => ({ node: VARIABLES.find(v => v.id === id)!, value: val.change, reasoning: val.reasoning }))
        .filter(e => e.node && Math.abs(e.value) > 1)
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    }
    return Object.entries(localEffects)
      .map(([id, val]) => ({ node: VARIABLES.find(v => v.id === id)!, value: Math.round(val * 100), reasoning: "" }))
      .filter(e => e.node && Math.abs(e.value) > 1)
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  }, [localEffects, aiResults]);

  // Animate changes propagating through graph
  useEffect(() => {
    const changes: Record<string, number> = {};
    if (deltaPct !== 0) {
      changes[selectedId] = deltaPct;
      effects.forEach(e => { changes[e.node.id] = e.value; });
    }
    setAnimatedChanges(changes);
  }, [effects, deltaPct, selectedId]);

  const handleAISimulate = async () => {
    if (!state.apiKey || deltaPct === 0) return;
    setLoading(true);
    try {
      const results = await runWhatIfSimulation(state.apiKey, selectedId, deltaPct, state.edges, state.data);
      setAiResults(results);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const reset = () => {
    setSliderValue(50);
    setAiResults(null);
  };

  return (
    <div className="p-4 md:p-6 pt-14 md:pt-6 h-screen flex flex-col">
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-display text-white">What-If Simulator</h1>
        <p className="text-xs text-white/30 mt-1">Change a variable and watch ripple effects cascade through your life</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-auto">
        {/* Graph with overlay */}
        <div className="flex-1 rounded-xl border border-white/[0.06] overflow-hidden min-h-[350px] bg-[#0c0f1a] relative">
          <CausalGraph
            edges={state.edges}
            highlightNode={selectedId}
            whatIfChanges={animatedChanges}
            interactive={false}
          />
          {deltaPct !== 0 && (
            <div className="absolute top-4 left-4 bg-[#161a2e]/90 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2">
              <p className="text-[11px] text-white/40">Simulating</p>
              <p className="text-sm font-semibold text-white">
                {selected.icon} {selected.name} {deltaPct > 0 ? "+" : ""}{deltaPct}%
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="w-full lg:w-96 shrink-0 space-y-4 overflow-y-auto">
          {/* Variable selector */}
          <div className="flex flex-wrap gap-1.5">
            {VARIABLES.map(v => (
              <button
                key={v.id}
                onClick={() => { setSelectedId(v.id); reset(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedId === v.id
                    ? "text-white border-white/20"
                    : "text-white/30 hover:text-white/50 border-white/[0.06]"
                } border`}
                style={selectedId === v.id ? { background: v.color + "20", borderColor: v.color + "40" } : {}}
              >
                <span className="text-sm">{v.icon}</span> {v.name}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="bg-[#161a2e] rounded-xl border border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white">{selected.icon} {selected.name}</span>
              <span className="text-sm font-mono font-bold" style={{ color: deltaPct === 0 ? "rgba(255,255,255,0.3)" : deltaPct > 0 ? "#63e6be" : "#f87171" }}>
                {deltaPct > 0 ? "+" : ""}{deltaPct}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={sliderValue}
              onChange={e => { setSliderValue(Number(e.target.value)); setAiResults(null); }}
              className="w-full"
              style={{
                background: `linear-gradient(to right, #f87171 0%, rgba(255,255,255,0.1) 50%, #63e6be 100%)`,
              }}
            />
            <div className="flex justify-between text-[10px] text-white/20 mt-2">
              <span>−100%</span>
              <span>Current</span>
              <span>+100%</span>
            </div>

            {state.apiKey && deltaPct !== 0 && (
              <button
                onClick={handleAISimulate}
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-teal-500/20 to-violet-500/20 border border-teal-500/30 text-xs font-medium text-white/80 hover:text-white transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {loading ? "Simulating with AI..." : "Enhance with Gemini AI"}
              </button>
            )}
          </div>

          {/* Ripple effects */}
          <div>
            <h3 className="text-xs font-bold text-white/20 uppercase tracking-widest mb-3">
              Predicted Effects {aiResults && <span className="text-teal-400/60 ml-1">• AI Enhanced</span>}
            </h3>
            <AnimatePresence mode="popLayout">
              {effects.map((effect, i) => {
                const isPos = effect.value > 0;
                return (
                  <motion.div
                    key={effect.node.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-[#161a2e] rounded-lg border border-white/[0.06] p-3 mb-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{effect.node.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-white/70">{effect.node.name}</span>
                          <span className={`text-sm font-mono font-bold ${isPos ? "text-teal-400" : "text-red-400"}`}>
                            {isPos ? "+" : ""}{Math.round(effect.value)}%
                          </span>
                        </div>
                        <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(Math.abs(effect.value), 100)}%` }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: isPos ? "#63e6be" : "#f87171" }}
                          />
                        </div>
                        {effect.reasoning && (
                          <p className="text-[10px] text-white/25 mt-1.5">{effect.reasoning}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {effects.length === 0 && deltaPct === 0 && (
              <p className="text-xs text-white/20 text-center py-8">Move the slider to simulate changes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
