"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { generateDemoData } from "@/lib/demo-data";
import { DEFAULT_EDGES, DEFAULT_INSIGHTS } from "@/lib/demo-data";
import { Key, Database, Trash2, RefreshCw, Check } from "lucide-react";

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const [apiKey, setApiKey] = useState(state.apiKey);
  const [saved, setSaved] = useState(false);

  const handleSaveKey = () => {
    dispatch({ type: "SET_API_KEY", key: apiKey });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetDemo = () => {
    const demoData = generateDemoData(30);
    dispatch({ type: "SET_DATA", data: demoData });
    dispatch({ type: "SET_EDGES", edges: DEFAULT_EDGES });
    dispatch({ type: "SET_INSIGHTS", insights: DEFAULT_INSIGHTS });
  };

  const handleClearAll = () => {
    if (confirm("This will delete all your data. Are you sure?")) {
      localStorage.removeItem("causalme_state");
      window.location.reload();
    }
  };

  return (
    <div className="p-4 md:p-6 pt-14 md:pt-6 max-w-2xl overflow-y-auto h-screen">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-display text-white">Settings</h1>
        <p className="text-xs text-white/30 mt-1">Configure your CausalMe instance</p>
      </div>

      {/* API Key */}
      <div className="bg-[#161a2e] rounded-xl border border-white/[0.06] p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Key className="w-4 h-4 text-teal-400/60" />
          <h3 className="text-sm font-semibold text-white/80">Gemini API Key</h3>
        </div>
        <p className="text-[11px] text-white/25 mb-4">
          Required for AI-powered causal discovery, what-if simulations, and insights. 
          Get a free key at <a href="https://aistudio.google.com/apikey" target="_blank" className="text-teal-400/60 hover:text-teal-400 underline">aistudio.google.com</a>
        </p>
        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-white/15 font-mono"
          />
          <button
            onClick={handleSaveKey}
            className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
              saved
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "bg-white/[0.06] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.1]"
            }`}
          >
            {saved ? <Check className="w-4 h-4" /> : "Save"}
          </button>
        </div>
        {state.apiKey && (
          <p className="text-[10px] text-teal-400/50 mt-2">✓ API key configured — AI features enabled</p>
        )}
      </div>

      {/* Data Management */}
      <div className="bg-[#161a2e] rounded-xl border border-white/[0.06] p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-blue-400/60" />
          <h3 className="text-sm font-semibold text-white/80">Data Management</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs text-white/60">Data points</p>
              <p className="text-[10px] text-white/25">{state.data.length} days recorded</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs text-white/60">Causal edges</p>
              <p className="text-[10px] text-white/25">{state.edges.length} connections ({state.edges.filter(e => e.confirmed).length} confirmed)</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs text-white/60">Insights</p>
              <p className="text-[10px] text-white/25">{state.insights.length} generated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={handleResetDemo}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#161a2e] border border-white/[0.06] text-sm text-white/50 hover:text-white/70 hover:border-white/10 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Reset to Demo Data
        </button>
        <button
          onClick={handleClearAll}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#161a2e] border border-red-500/10 text-sm text-red-400/50 hover:text-red-400/80 hover:border-red-500/20 transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Data
        </button>
      </div>

      {/* About */}
      <div className="mt-8 pt-6 border-t border-white/[0.04]">
        <p className="text-[10px] text-white/15">
          CausalMe v0.1 • All data stored locally in your browser • No server, no tracking
        </p>
      </div>
    </div>
  );
}
