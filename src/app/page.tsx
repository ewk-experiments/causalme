"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Brain, Zap, Shield, Sparkles } from "lucide-react";
import CausalGraph from "@/components/CausalGraphNew";
import { DEFAULT_EDGES } from "@/lib/demo-data";

const EFFECTS = [
  { label: "Mood", change: "+18%", icon: "😊", positive: true },
  { label: "Productivity", change: "+24%", icon: "⚡", positive: true },
  { label: "Caffeine", change: "-35%", icon: "☕", positive: false },
  { label: "Stress", change: "-22%", icon: "😰", positive: false },
];

const FEATURES = [
  { icon: Brain, title: "Causal Discovery", description: "AI-powered algorithms detect real cause-and-effect relationships across your life data." },
  { icon: Zap, title: "What-If Simulations", description: "Drag a slider, watch ripple effects cascade through your life graph in real-time." },
  { icon: Shield, title: "Privacy-First", description: "100% client-side. Your data never leaves your browser. No server, no tracking." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0c0f1a]">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-[#0c0f1a]/80 backdrop-blur-xl border-b border-white/[0.04] z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-violet-500 flex items-center justify-center">
              <span className="text-xs">◈</span>
            </div>
            <span className="font-display text-lg text-white">CausalMe</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hidden md:inline text-xs text-white/30 hover:text-white/60">Features</a>
            <Link href="/dashboard" className="px-4 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/[0.1] transition-all">
              Open App →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-6">
              <Sparkles className="w-3 h-3" /> Personal Causal Inference Engine
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-white tracking-tight leading-[1.1] mb-6">
              See the{" "}
              <span className="bg-gradient-to-r from-teal-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                ripple effects
              </span>
              <br />of every life choice
            </h1>
            <p className="text-base md:text-lg text-white/30 max-w-2xl mx-auto mb-8 font-light">
              CausalMe builds a living causal graph of your life. Understand how sleep, exercise, mood, and spending really connect — then simulate what-if scenarios.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500/20 to-violet-500/20 border border-teal-500/30 text-white font-medium rounded-xl hover:border-teal-400/50 transition-all text-sm"
              >
                Try the Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Graph demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative max-w-5xl mx-auto mt-16"
          >
            <div className="rounded-2xl border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/50" style={{ height: 500 }}>
              <CausalGraph edges={DEFAULT_EDGES} interactive />
            </div>
            <p className="text-center text-[11px] text-white/15 mt-3">Interactive — click nodes, drag to rearrange</p>

            {/* What-If card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute -right-2 top-8 bg-[#161a2e]/95 backdrop-blur-sm border border-white/10 rounded-xl p-4 w-56 hidden lg:block"
            >
              <p className="text-[10px] font-semibold text-teal-400/60 mb-2">💡 WHAT IF</p>
              <p className="text-xs font-medium text-white/70 mb-3">What if I slept 8hrs instead of 6?</p>
              <div className="space-y-1.5">
                {EFFECTS.map((e, i) => (
                  <motion.div
                    key={e.label}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + i * 0.1 }}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-white/40">{e.icon} {e.label}</span>
                    <span className={`font-mono font-semibold ${e.positive ? "text-teal-400" : "text-red-400"}`}>
                      {e.change}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-display text-center text-white mb-12">Beyond correlation. Real causation.</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#161a2e] rounded-xl border border-white/[0.06] p-6"
              >
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center mb-4">
                  <f.icon className="w-4 h-4 text-white/40" />
                </div>
                <h3 className="text-sm font-semibold text-white/80 mb-2">{f.title}</h3>
                <p className="text-xs text-white/25 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-display text-white mb-4">Start understanding cause and effect</h2>
          <p className="text-sm text-white/25 mb-8">Free. No account needed. All data stays in your browser.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-500/20 to-violet-500/20 border border-teal-500/30 text-white font-medium rounded-xl hover:border-teal-400/50 transition-all"
          >
            Launch CausalMe <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.04] py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] text-white/15">
          <span>◈ CausalMe</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
