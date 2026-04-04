"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-300 shadow-glow">
            CallIQ
          </span>
          <span className="text-sm text-slate-300">AI Call Center Analytics</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/upload">Upload</Link>
          <Link href="/history">History</Link>
          <Link href="/api-keys">API Keys</Link>
          <Link href="/admin/sop">Admin SOP</Link>
        </nav>

        <button
          className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          type="button"
        >
          {resolvedTheme === "dark" ? <SunMedium size={18} /> : <MoonStar size={18} />}
        </button>
      </div>
    </motion.header>
  );
}
