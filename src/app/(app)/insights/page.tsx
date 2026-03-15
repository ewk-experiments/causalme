"use client";

import { motion } from "framer-motion";
import { INSIGHTS } from "@/lib/mock-data";
import { AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";

const TYPE_CONFIG = {
  discovery: { icon: Lightbulb, color: "#6366f1", bg: "#eef2ff", label: "Discovery" },
  warning: { icon: AlertTriangle, color: "#f59e0b", bg: "#fffbeb", label: "Warning" },
  opportunity: { icon: TrendingUp, color: "#10b981", bg: "#ecfdf5", label: "Opportunity" },
};

const IMPACT_BADGE = {
  high: "bg-red-50 text-red-600",
  medium: "bg-amber-50 text-amber-600",
  low: "bg-gray-50 text-gray-500",
};

export default function InsightsPage() {
  return (
    <div className="p-4 md:p-6 pt-14 md:pt-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Insights</h1>
      <p className="text-sm text-gray-500 mb-8">
        AI-generated causal insights from your life data
      </p>

      <div className="space-y-4">
        {INSIGHTS.map((insight, i) => {
          const config = TYPE_CONFIG[insight.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: config.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase ${IMPACT_BADGE[insight.impact]}`}>
                      {insight.impact} impact
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{insight.description}</p>
                  <div className="flex items-center gap-2">
                    {insight.nodes.map(id => {
                      const node = { sleep: "🌙", exercise: "💪", mood: "😊", productivity: "⚡", spending: "💳", social: "👥", energy: "🔋" }[id];
                      return (
                        <span key={id} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          {node} {id}
                        </span>
                      );
                    })}
                    <span className="text-xs text-gray-300 ml-auto">{insight.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
