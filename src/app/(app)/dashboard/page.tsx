"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CausalGraph from "@/components/CausalGraphNew";
import { useApp } from "@/lib/store";
import { VARIABLES } from "@/lib/demo-data";
import { X, Check, Trash2, RefreshCw } from "lucide-react";
import { discoverCausalEdges } from "@/lib/gemini";

export default function DashboardPage() {
  const { state, dispatch } = useApp();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [discovering, setDiscovering] = useState(false);

  const selectedVar = VARIABLES.find(v => v.id === selectedNode);
  
  const causes = useMemo(() => 
    selectedNode ? state.edges.filter(e => e.effect === selectedNode) : [],
    [selectedNode, state.edges]
  );
  const effects = useMemo(() =>
    selectedNode ? state.edges.filter(e => e.cause === selectedNode) : [],
    [selectedNode, state.edges]
  );

  const handleDiscover = async () => {
    if (!state.apiKey) return;
    setDiscovering(true);
    try {
      const newEdges = await discoverCausalEdges(state.apiKey, state.data);
      dispatch({ type: "SET_EDGES", edges: newEdges });
    } catch (err) {
      console.error("Discovery failed:", err);
    }
    setDiscovering(false);
  };

  return (
    <div className="p-4 md:p-6 h-screen flex flex-col pt-14 md:pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-display text-white">Your Causal Graph</h1>
          <p className="text-xs text-white/30 mt-1">Click nodes to explore • Drag to rearrange • {state.edges.length} connections</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-[11px] text-white/30">
            <span className="flex items-center gap-1.5"><span className="w-6 h-px bg-teal-400/60" /> positive</span>
            <span className="flex items-center gap-1.5"><span className="w-6 h-px bg-red-400/60" /> negative</span>
          </div>
          {state.apiKey && (
            <button
              onClick={handleDiscover}
              disabled={discovering}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-xs text-white/60 hover:text-white/90 hover:bg-white/[0.1] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${discovering ? "animate-spin" : ""}`} />
              {discovering ? "Discovering..." : "Re-analyze"}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        <div className="flex-1 rounded-xl border border-white/[0.06] overflow-hidden relative min-h-[400px] bg-[#0c0f1a]">
          <CausalGraph
            edges={state.edges}
            onNodeClick={setSelectedNode}
            highlightNode={selectedNode}
            interactive
          />
        </div>

        <AnimatePresence>
          {selectedNode && selectedVar && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full md:w-80 bg-[#161a2e] rounded-xl border border-white/[0.06] overflow-hidden shrink-0 max-h-[50vh] md:max-h-none overflow-y-auto"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: selectedVar.color + "20" }}>
                      {selectedVar.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{selectedVar.name}</h3>
                      <p className="text-[11px] text-white/30">{selectedVar.domain} • {selectedVar.unit}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedNode(null)} className="text-white/20 hover:text-white/50">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Causes */}
                <div className="mb-5">
                  <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">What drives it</h4>
                  {causes.length > 0 ? causes.map(e => {
                    const v = VARIABLES.find(vv => vv.id === e.cause);
                    return (
                      <div key={e.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] group">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{v?.icon}</span>
                          <span className="text-xs text-white/60">{v?.name}</span>
                          {e.confirmed && <Check className="w-3 h-3 text-teal-400/60" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-semibold ${e.strength > 0 ? "text-teal-400" : "text-red-400"}`}>
                            {e.strength > 0 ? "+" : ""}{Math.round(e.strength * 100)}%
                          </span>
                          <button
                            onClick={() => dispatch({ type: "TOGGLE_EDGE_CONFIRM", edgeId: e.id })}
                            className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-teal-400 transition-all"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => dispatch({ type: "REMOVE_EDGE", edgeId: e.id })}
                            className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  }) : <p className="text-[11px] text-white/20">No detected causes</p>}
                </div>

                {/* Effects */}
                <div>
                  <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">What it affects</h4>
                  {effects.length > 0 ? effects.map(e => {
                    const v = VARIABLES.find(vv => vv.id === e.effect);
                    return (
                      <div key={e.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] group">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{v?.icon}</span>
                          <span className="text-xs text-white/60">{v?.name}</span>
                          {e.confirmed && <Check className="w-3 h-3 text-teal-400/60" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-semibold ${e.strength > 0 ? "text-teal-400" : "text-red-400"}`}>
                            {e.strength > 0 ? "+" : ""}{Math.round(e.strength * 100)}%
                          </span>
                          <button
                            onClick={() => dispatch({ type: "TOGGLE_EDGE_CONFIRM", edgeId: e.id })}
                            className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-teal-400 transition-all"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => dispatch({ type: "REMOVE_EDGE", edgeId: e.id })}
                            className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  }) : <p className="text-[11px] text-white/20">No detected effects</p>}
                </div>

                {/* Reasoning */}
                {(causes.length > 0 || effects.length > 0) && (
                  <div className="mt-5 pt-4 border-t border-white/[0.04]">
                    <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">AI Reasoning</h4>
                    {[...causes, ...effects].filter(e => e.reasoning).slice(0, 3).map(e => (
                      <p key={e.id} className="text-[11px] text-white/30 mb-2 leading-relaxed">
                        &quot;{e.reasoning}&quot;
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
