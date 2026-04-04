"use client";

import { motion } from "framer-motion";

export function SummaryCard({ summary }: { summary: string }) {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
      <div className="mb-3 text-sm uppercase tracking-[0.2em] text-cyan-300">AI Summary</div>
      <p className="leading-7 text-slate-200">{summary}</p>
    </motion.section>
  );
}
