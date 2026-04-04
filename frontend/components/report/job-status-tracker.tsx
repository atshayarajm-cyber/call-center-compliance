"use client";

import { motion } from "framer-motion";

export function JobStatusTracker({ progress, status }: { progress: number; status: string }) {
  return (
    <section className="glass rounded-3xl p-6">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm uppercase tracking-[0.2em] text-cyan-300">Processing</span>
        <span className="text-sm text-slate-300">{status}</span>
      </div>
      <div className="h-3 rounded-full bg-white/10">
        <motion.div
          className="h-3 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-3 text-sm text-slate-400">Real-time job progress based on backend pipeline checkpoints.</div>
    </section>
  );
}
