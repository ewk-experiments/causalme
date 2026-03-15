"use client";

import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0c0f1a]">
      <Sidebar />
      <main className="flex-1 md:ml-60 ml-0">
        {children}
      </main>
    </div>
  );
}
