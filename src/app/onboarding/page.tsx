"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Shield, Watch, CreditCard, Calendar, SmilePlus, Sparkles } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    id: "health",
    title: "Health & Wearables",
    description: "Connect your health data to understand how sleep, exercise, and biometrics affect your life.",
    icon: Watch,
    color: "#10b981",
    sources: [
      { name: "Apple Health", connected: false, data: "Sleep, steps, heart rate, workouts" },
      { name: "Fitbit", connected: false, data: "Sleep, activity, heart rate variability" },
      { name: "Oura Ring", connected: false, data: "Sleep stages, readiness, temperature" },
    ],
    privacy: "Health data is processed on-device. Only aggregated metrics are stored.",
  },
  {
    id: "finance",
    title: "Financial Data",
    description: "See how spending patterns connect to your mood, energy, and habits.",
    icon: CreditCard,
    color: "#ef4444",
    sources: [
      { name: "Plaid (Bank)", connected: false, data: "Transaction categories, spending patterns" },
      { name: "Mint", connected: false, data: "Budget categories, spending trends" },
    ],
    privacy: "We never see your account numbers. Only categorized spending totals are analyzed.",
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "Understand how meetings, events, and schedule patterns impact your productivity and mood.",
    icon: Calendar,
    color: "#3b82f6",
    sources: [
      { name: "Google Calendar", connected: false, data: "Event types, meeting load, free time" },
      { name: "Outlook", connected: false, data: "Meeting patterns, schedule density" },
    ],
    privacy: "We read event metadata only — not attendees, descriptions, or private details.",
  },
  {
    id: "mood",
    title: "Mood Tracking",
    description: "Track your emotional state to close the loop on how everything connects.",
    icon: SmilePlus,
    color: "#f59e0b",
    sources: [
      { name: "CausalMe Tracker", connected: false, data: "Quick daily mood check-ins (30 seconds)" },
      { name: "Daylio", connected: false, data: "Mood entries, activities" },
    ],
    privacy: "Mood data is encrypted and only you can access it.",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const current = STEPS[step];

  const toggleConnect = (source: string) => {
    setConnected(prev => ({ ...prev, [source]: !prev[source] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex-1 flex items-center gap-2">
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-indigo-500" : "bg-gray-200"
                }`}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: current.color + "15" }}
              >
                <current.icon className="w-5 h-5" style={{ color: current.color }} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Step {step + 1} of {STEPS.length}</p>
                <h2 className="text-xl font-bold text-gray-900">{current.title}</h2>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">{current.description}</p>

            <div className="space-y-3 mb-6">
              {current.sources.map((source) => (
                <button
                  key={source.name}
                  onClick={() => toggleConnect(source.name)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    connected[source.name]
                      ? "border-indigo-200 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{source.name}</p>
                    <p className="text-xs text-gray-400">{source.data}</p>
                  </div>
                  {connected[source.name] ? (
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  ) : (
                    <span className="text-xs text-indigo-500 font-medium">Connect</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 mb-6">
              <Shield className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-500">{current.privacy}</p>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                className={`flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 ${step === 0 ? "invisible" : ""}`}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => step < STEPS.length - 1 ? setStep(step + 1) : null}
                  className="text-sm text-gray-400 hover:text-gray-600"
                >
                  Skip
                </button>
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="flex items-center gap-1 px-5 py-2.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1 px-5 py-2.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" /> Launch Dashboard
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
