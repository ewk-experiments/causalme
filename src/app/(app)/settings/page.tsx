"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Download, Trash2, Plug, Eye, EyeOff, ToggleLeft, ToggleRight } from "lucide-react";

const CONNECTED_APPS = [
  { name: "Apple Health", status: "connected", lastSync: "2 min ago", icon: "⌚" },
  { name: "Google Calendar", status: "connected", lastSync: "15 min ago", icon: "📅" },
  { name: "Plaid (Chase)", status: "connected", lastSync: "1 hr ago", icon: "🏦" },
  { name: "CausalMe Mood", status: "active", lastSync: "Just now", icon: "😊" },
];

export default function SettingsPage() {
  const [privacyToggles, setPrivacyToggles] = useState({
    shareInsights: false,
    anonymousResearch: false,
    publicProfile: false,
  });

  const toggle = (key: keyof typeof privacyToggles) => {
    setPrivacyToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 md:p-6 pt-14 md:pt-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-sm text-gray-500 mb-8">Manage your data, connections, and privacy</p>

      {/* Connected Apps */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plug className="w-5 h-5 text-gray-400" /> Connected Apps
        </h2>
        <div className="space-y-3">
          {CONNECTED_APPS.map(app => (
            <div key={app.name} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{app.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{app.name}</p>
                  <p className="text-xs text-gray-400">Last synced: {app.lastSync}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs text-green-600 font-medium">{app.status}</span>
                <button className="text-xs text-red-400 hover:text-red-600 ml-3">Disconnect</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-gray-400" /> Privacy Controls
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {[
            { key: "shareInsights" as const, label: "Share insights with connected apps", desc: "Allow third-party apps to read your causal insights" },
            { key: "anonymousResearch" as const, label: "Contribute anonymized data", desc: "Help improve causal models with anonymized, aggregated data" },
            { key: "publicProfile" as const, label: "Public profile", desc: "Allow others to see your CausalMe profile" },
          ].map(item => (
            <div key={item.key} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <button onClick={() => toggle(item.key)} className="text-gray-400">
                {privacyToggles[item.key]
                  ? <ToggleRight className="w-8 h-8 text-indigo-500" />
                  : <ToggleLeft className="w-8 h-8" />
                }
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Data Management */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h2>
        <div className="space-y-3">
          <button className="w-full bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
            <Download className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Export all data</p>
              <p className="text-xs text-gray-400">Download a complete copy of your CausalMe data as JSON</p>
            </div>
          </button>
          <button className="w-full bg-white rounded-xl border border-red-100 p-4 flex items-center gap-3 hover:bg-red-50 transition-colors text-left">
            <Trash2 className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-600">Delete account</p>
              <p className="text-xs text-gray-400">Permanently delete your account and all data. This cannot be undone.</p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
