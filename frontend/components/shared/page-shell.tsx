import { ReactNode } from "react";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-hero-radial">
      <div className="grid-overlay absolute inset-0 opacity-20" />
      <Navbar />
      <main className="relative mx-auto flex max-w-7xl gap-6 px-6 py-8">
        <Sidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </main>
    </div>
  );
}
