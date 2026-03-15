"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useApp, Insight } from "@/lib/store";
import { VARIABLES } from "@/lib/demo-data";
import { generateInsights } from "@/lib/gemini";
import { AlertTriangle, Lightbulb, TrendingUp, RefreshCw, Sparkles, Loader2 } from "lucide-react";

const TYPE_CONFIG: Record<string, { icon: typeof Lightbulb; color: string; label: string }> = {
  pattern: { icon: Lightbulb, color: "#a78bfa", label: "Pattern" },
  warning: { icon: AlertTriangle, color: "#fbbf24", label: "Warning" },
  opportunity: { icon: TrendingUp, color: "#63e6be", label: "Opportunity" },
};

const IMPACT_COLORS: Record<string, string> = {
  high: "border-red-500/30 text-red-400",
  medium: "border-amber-500/30 text-amber-400",
  low: "border-white/10 text-white/40",
};

export default function InsightsPage() {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!state.apiKey) return;
    setLoading(true);
    try {
      const raw = await generateInsights(state.apiKey, state.data, state.edges);
      const insights: Insight[] = raw.map((r, i) => ({
        id: `ai_insight_${Date.now()}_${i}`,
        content: r.content,
        type: r.type,
        impact: r.impact,
        nodes: r.nodes,
        createdAt: new Date().toISOString(),
      }));
      dispatch({ type: "SET_INSIGHTS", insights });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-6 pt-14 md:pt-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-display text-white">AI Insights</h1>
          <p className="text-xs text-white/30 mt-1">Causal patterns discovered in your data</p>
        </div>
        {state.apiKey && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500/20 to-violet-500/20 border border-teal-500/30 text-xs font-medium text-white/70 hover:text-white transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {loading ? "Generating..." : "Generate New Insights"}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {state.insights.map((insight, i) => {
          const config = TYPE_CONFIG[insight.type] || TYPE_CONFIG.pattern;
          const Icon = config.icon;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-[#161a2e] rounded-xl border border-white/[0.06] p-5 hover:border-white/10 transition-all"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: config.color + "15" }}
                >
                  <Icon className="w-4 h-4" style={{ color: config.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: config.color }}>
                      {config.label}
                    </span>
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${IMPACT_COLORS[insight.impact]}`}>
                      {insight.impact}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed mb-3">{insight.content}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {insight.nodes.map(id => {
                      const v = VARIABLES.find(vv => vv.id === id);
                      return v ? (
                        <span key={id} className="text-[10px] bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full text-white/40">
                          {v.icon} {v.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        {state.insights.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">No insights yet</p>
            <p className="text-xs text-white/15 mt-1">Add a Gemini API key in Settings to generate AI insights</p>
          </div>
        )}
      </div>
    </div>
  );
}
