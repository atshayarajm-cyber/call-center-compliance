"use client";

import { motion } from "framer-motion";

export function TranscriptViewer({ raw, cleaned }: { raw: string; cleaned: string }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {[
        { label: "Raw Transcript", value: raw },
        { label: "Cleaned Transcript", value: cleaned }
      ].map((panel) => (
        <motion.section key={panel.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-6">
          <div className="mb-3 text-sm uppercase tracking-[0.2em] text-cyan-300">{panel.label}</div>
          <p className="text-sm leading-7 text-slate-200">{panel.value}</p>
        </motion.section>
      ))}
    </div>
  );
}
