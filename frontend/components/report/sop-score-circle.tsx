"use client";

import { motion } from "framer-motion";

export function SopScoreCircle({
  score,
  checks
}: {
  score: number;
  checks: { name: string; passed: boolean; evidence: string }[];
}) {
  const circumference = 2 * Math.PI * 56;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <section className="glass rounded-3xl p-6">
      <div className="mb-5 text-sm uppercase tracking-[0.2em] text-cyan-300">SOP Validation</div>
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="relative h-36 w-36">
          <svg className="h-36 w-36 -rotate-90">
            <circle cx="72" cy="72" r="56" stroke="rgba(148,163,184,0.2)" strokeWidth="12" fill="none" />
            <motion.circle
              cx="72"
              cy="72"
              r="56"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
            />
            <defs>
              <linearGradient id="gradient">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-white">{score}</div>
        </div>
        <div className="flex-1 space-y-3">
          {checks.map((check) => (
            <div key={check.name} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">{check.name}</span>
                <span className={check.passed ? "text-emerald-300" : "text-rose-300"}>
                  {check.passed ? "Passed" : "Missing"}
                </span>
              </div>
              <div className="mt-2 text-sm text-slate-400">{check.evidence || "No evidence found in transcript."}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
