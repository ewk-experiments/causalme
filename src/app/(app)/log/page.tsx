"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import { VARIABLES, DayData } from "@/lib/demo-data";
import { Check, Plus } from "lucide-react";

const QUICK_VARS = ["sleep", "mood", "exercise", "caffeine", "productivity", "stress"];

export default function LogPage() {
  const { state, dispatch } = useApp();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  // Custom variable creation
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customUnit, setCustomUnit] = useState("");

  const handleSave = () => {
    const existing = state.data.find(d => d.date === date);
    const newPoint: DayData = {
      date,
      dayOfWeek: new Date(date).getDay(),
      sleep: parseFloat(values.sleep || String(existing?.sleep ?? 7)),
      mood: parseFloat(values.mood || String(existing?.mood ?? 5)),
      exercise: parseFloat(values.exercise || String(existing?.exercise ?? 0)),
      caffeine: parseFloat(values.caffeine || String(existing?.caffeine ?? 100)),
      productivity: parseFloat(values.productivity || String(existing?.productivity ?? 5)),
      screenTime: parseFloat(values.screenTime || String(existing?.screenTime ?? 6)),
      social: parseFloat(values.social || String(existing?.social ?? 1)),
      spending: parseFloat(values.spending || String(existing?.spending ?? 50)),
      stress: parseFloat(values.stress || String(existing?.stress ?? 5)),
    };

    const newData = state.data.filter(d => d.date !== date);
    newData.push(newPoint);
    newData.sort((a, b) => a.date.localeCompare(b.date));
    dispatch({ type: "SET_DATA", data: newData });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const existing = state.data.find(d => d.date === date);

  return (
    <div className="p-4 md:p-6 pt-14 md:pt-6 max-w-2xl overflow-y-auto h-screen">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-display text-white">Log Data</h1>
        <p className="text-xs text-white/30 mt-1">Record your daily metrics to build your causal model</p>
      </div>

      {/* Date picker */}
      <div className="mb-6">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="bg-[#161a2e] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:border-white/20"
        />
        {existing && (
          <span className="ml-3 text-[11px] text-teal-400/60">Existing entry — will update</span>
        )}
      </div>

      {/* Quick entry grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {QUICK_VARS.map(id => {
          const v = VARIABLES.find(vv => vv.id === id)!;
          const existingVal = existing ? String((existing as unknown as Record<string, number>)[id]) : "";
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#161a2e] rounded-xl border border-white/[0.06] p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{v.icon}</span>
                <div>
                  <p className="text-xs font-medium text-white/70">{v.name}</p>
                  <p className="text-[10px] text-white/25">{v.min}–{v.max} {v.unit}</p>
                </div>
              </div>
              <input
                type="number"
                step="0.1"
                min={v.min}
                max={v.max}
                placeholder={existingVal || `${v.min}–${v.max}`}
                value={values[id] || ""}
                onChange={e => setValues(prev => ({ ...prev, [id]: e.target.value }))}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-white/15"
              />
              {/* Quick buttons for mood/stress/productivity */}
              {(id === "mood" || id === "stress" || id === "productivity") && (
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => setValues(prev => ({ ...prev, [id]: String(n) }))}
                      className={`flex-1 h-6 rounded text-[9px] font-mono transition-all ${
                        values[id] === String(n) ? "bg-white/20 text-white" : "bg-white/[0.04] text-white/20 hover:bg-white/[0.08]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Additional variables */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {["screenTime", "social", "spending"].map(id => {
          const v = VARIABLES.find(vv => vv.id === id)!;
          const existingVal = existing ? String((existing as unknown as Record<string, number>)[id]) : "";
          return (
            <div key={id} className="bg-[#161a2e] rounded-xl border border-white/[0.06] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>{v.icon}</span>
                <span className="text-xs text-white/50">{v.name}</span>
              </div>
              <input
                type="number"
                step="0.1"
                placeholder={existingVal || `${v.unit}`}
                value={values[id] || ""}
                onChange={e => setValues(prev => ({ ...prev, [id]: e.target.value }))}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-white/15"
              />
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <div className="bg-[#161a2e] rounded-xl border border-white/[0.06] p-4 mb-6">
        <p className="text-xs text-white/30 mb-2">Notes (optional)</p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="How was your day?"
          rows={3}
          className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-white/15 resize-none"
        />
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
          saved
            ? "bg-teal-500/20 border border-teal-500/30 text-teal-400"
            : "bg-gradient-to-r from-teal-500/20 to-violet-500/20 border border-white/10 text-white hover:border-white/20"
        }`}
      >
        {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Entry"}
      </button>
    </div>
  );
}
