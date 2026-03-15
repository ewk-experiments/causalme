"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import {
  LayoutDashboard,
  SlidersHorizontal,
  Lightbulb,
  BarChart3,
  PlusCircle,
  Settings,
  Menu,
  X,
  LogOut,
  Key,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Graph", icon: LayoutDashboard },
  { href: "/whatif", label: "What If", icon: SlidersHorizontal },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/data", label: "Dashboard", icon: BarChart3 },
  { href: "/log", label: "Log Data", icon: PlusCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state } = useApp();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-[#161a2e] border border-white/10"
      >
        <Menu className="w-5 h-5 text-white/70" />
      </button>

      {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setOpen(false)} />}

      <aside className={`w-60 h-screen bg-[#111528] border-r border-white/[0.06] flex flex-col fixed left-0 top-0 z-50 transition-transform duration-200 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-violet-500 flex items-center justify-center">
              <span className="text-sm">◈</span>
            </div>
            <span className="font-display text-lg text-white">CausalMe</span>
          </Link>
          <button onClick={() => setOpen(false)} className="md:hidden text-white/40">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {!state.apiKey && (
          <div className="mx-3 mb-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-1">
              <Key className="w-3 h-3" /> Demo Mode
            </div>
            <p className="text-[11px] text-white/40">Add Gemini API key in Settings for live AI</p>
          </div>
        )}

        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
              {state.user?.name?.[0] || "D"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/80 truncate">{state.user?.name || "Demo"}</p>
              <p className="text-[10px] text-white/30">{state.apiKey ? "AI Connected" : "Demo Data"}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
