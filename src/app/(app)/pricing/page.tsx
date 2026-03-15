"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic causal insights",
    features: [
      "Basic causal graph",
      "3 What-If simulations per month",
      "Weekly insight digest",
      "2 data source connections",
      "30-day data retention",
    ],
    cta: "Get Started",
    popular: false,
    icon: Sparkles,
  },
  {
    name: "Pro",
    price: "$15",
    period: "/month",
    description: "Unlimited access to your complete causal universe",
    features: [
      "Full causal graph with advanced edges",
      "Unlimited What-If simulations",
      "Daily AI insights",
      "Unlimited data sources",
      "Unlimited data retention",
      "Timeline with life events",
      "Data export (JSON, CSV)",
      "Priority support",
      "Advanced causal algorithms",
    ],
    cta: "Start Pro Trial",
    popular: true,
    icon: Zap,
  },
];

export default function PricingPage() {
  return (
    <div className="p-4 md:p-6 pt-14 md:pt-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Simple, transparent pricing</h1>
        <p className="text-gray-500">Start free, upgrade when you want the full picture</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative bg-white rounded-2xl border p-6 ${
              plan.popular
                ? "border-indigo-200 shadow-xl shadow-indigo-100/50"
                : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-xs font-medium rounded-full">
                Most Popular
              </div>
            )}
            <div className="flex items-center gap-2 mb-4">
              <plan.icon className={`w-5 h-5 ${plan.popular ? "text-indigo-500" : "text-gray-400"}`} />
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
            </div>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-sm text-gray-400">{plan.period}</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">{plan.description}</p>
            <Link
              href="/auth"
              className={`block text-center px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-6 ${
                plan.popular
                  ? "bg-indigo-500 text-white hover:bg-indigo-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {plan.cta}
            </Link>
            <ul className="space-y-2.5">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
