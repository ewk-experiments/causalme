"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CausalGraph from "@/components/CausalGraph";
import { CausalNode, NODES, EDGES } from "@/lib/mock-data";
import { X } from "lucide-react";

export default function DashboardPage() {
  const [selectedNode, setSelectedNode] = useState<CausalNode | null>(null);

  const causes = selectedNode
    ? EDGES.filter(e => e.target === selectedNode.id).map(e => ({
        ...e,
        node: NODES.find(n => n.id === e.source)!,
      }))
    : [];
  const effects = selectedNode
    ? EDGES.filter(e => e.source === selectedNode.id).map(e => ({
        ...e,
        node: NODES.find(n => n.id === e.target)!,
      }))
    : [];

  return (
    <div className="p-6 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Causal Graph</h1>
          <p className="text-sm text-gray-500">Click any node to explore its causes and effects</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-3 h-0.5 bg-indigo-400 rounded" /> positive
            <div className="w-3 h-0.5 bg-red-400 rounded ml-2" /> negative
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Graph */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden relative">
          <CausalGraph
            width={900}
            height={600}
            onNodeClick={setSelectedNode}
            highlightNode={selectedNode?.id || null}
            interactive
          />
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 320 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shrink-0"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedNode.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedNode.label}</h3>
                      <p className="text-xs text-gray-400">Current: {selectedNode.value}{selectedNode.unit}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedNode(null)} className="text-gray-300 hover:text-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div
                  className="w-full h-2 rounded-full mb-6"
                  style={{ backgroundColor: selectedNode.color + "20" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${selectedNode.value}%`, backgroundColor: selectedNode.color }}
                  />
                </div>

                <div className="mb-5">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Causes</h4>
                  {causes.length > 0 ? causes.map(c => (
                    <div key={c.source} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <span>{c.node.icon}</span>
                        <span className="text-sm text-gray-700">{c.node.label}</span>
                      </div>
                      <span className={`text-xs font-mono font-semibold ${c.weight > 0 ? "text-green-500" : "text-red-500"}`}>
                        {c.weight > 0 ? "+" : ""}{Math.round(c.weight * 100)}%
                      </span>
                    </div>
                  )) : <p className="text-xs text-gray-400">No detected causes</p>}
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Effects</h4>
                  {effects.length > 0 ? effects.map(e => (
                    <div key={e.target} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <span>{e.node.icon}</span>
                        <span className="text-sm text-gray-700">{e.node.label}</span>
                      </div>
                      <span className={`text-xs font-mono font-semibold ${e.weight > 0 ? "text-green-500" : "text-red-500"}`}>
                        {e.weight > 0 ? "+" : ""}{Math.round(e.weight * 100)}%
                      </span>
                    </div>
                  )) : <p className="text-xs text-gray-400">No detected effects</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
