"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Shield, Brain, ChevronRight, Check } from "lucide-react";
import CausalGraph from "@/components/CausalGraph";
import { CausalNode, NODES, EDGES } from "@/lib/mock-data";

const WHAT_IF_DEMO = {
  question: "What if I slept 8hrs instead of 6?",
  effects: [
    { label: "Mood", change: "+15%", color: "#f59e0b", icon: "😊" },
    { label: "Productivity", change: "+22%", color: "#3b82f6", icon: "⚡" },
    { label: "Spending", change: "-8%", color: "#ef4444", icon: "💳" },
    { label: "Energy", change: "+31%", color: "#f97316", icon: "🔋" },
  ],
};

const FEATURES = [
  {
    icon: Brain,
    title: "Causal Discovery",
    description: "AI-powered algorithms detect real cause-and-effect relationships — not just correlations — across your life data.",
  },
  {
    icon: Zap,
    title: "What-If Simulations",
    description: "Drag a slider, watch ripple effects cascade through your life graph in real-time. See predicted outcomes with confidence intervals.",
  },
  {
    icon: Shield,
    title: "Privacy-First",
    description: "Your data never leaves your device for analysis. End-to-end encryption. Export or delete everything anytime.",
  },
];

export default function LandingPage() {
  const [selectedNode, setSelectedNode] = useState<CausalNode | null>(null);
  const [showEffects, setShowEffects] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">CausalMe</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
            <a href="#demo" className="text-sm text-gray-600 hover:text-gray-900">Demo</a>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/auth" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link
              href="/auth"
              className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Personal Causal Inference Engine
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
                See the{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  ripple effects
                </span>
                <br />
                of every life choice
              </h1>
              <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8">
                CausalMe builds a living causal graph of your life. Understand how sleep, exercise, mood, and spending really connect — then simulate &quot;what if&quot; scenarios to optimize your days.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white font-medium rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200"
                >
                  Start for Free <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  See Demo <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Interactive Graph Demo */}
          <motion.div
            id="demo"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-2xl border border-gray-200 p-4 shadow-xl shadow-gray-200/50">
              <div className="bg-white rounded-xl overflow-hidden" style={{ height: 500 }}>
                <CausalGraph
                  width={900}
                  height={500}
                  onNodeClick={(node) => setSelectedNode(node)}
                  interactive
                />
              </div>
              <p className="text-center text-sm text-gray-400 mt-3">Click any node to explore its causal connections</p>
            </div>

            {/* What-If Demo Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute -right-4 top-8 bg-white rounded-xl border border-gray-200 shadow-lg p-4 w-64 hidden lg:block"
            >
              <p className="text-xs font-medium text-indigo-500 mb-2">💡 WHAT IF</p>
              <p className="text-sm font-semibold text-gray-900 mb-3">{WHAT_IF_DEMO.question}</p>
              <div className="space-y-2">
                {WHAT_IF_DEMO.effects.map((effect, i) => (
                  <motion.div
                    key={effect.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + i * 0.15 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">{effect.icon} {effect.label}</span>
                    <span
                      className="font-mono font-semibold"
                      style={{ color: effect.change.startsWith("-") ? "#ef4444" : "#10b981" }}
                    >
                      {effect.change}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Beyond correlation. Real causation.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-indigo-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Start understanding your life&apos;s cause and effect
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Free to start. No credit card required. Your data stays yours.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-500 text-white font-medium rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200 text-lg"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>CausalMe</span>
          </div>
          <p>© 2026 CausalMe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
