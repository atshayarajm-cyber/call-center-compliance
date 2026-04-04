import Link from "next/link";

import { Navbar } from "@/components/layout/navbar";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-radial">
      <div className="grid-overlay absolute inset-0 opacity-20" />
      <Navbar />
      <section className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200">
            Production AI Analytics Suite
          </div>
          <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-tight text-white md:text-7xl">
            Turn every collection call into a searchable, scored, and explainable intelligence report.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Upload recordings or pass audio URLs, transcribe with faster-whisper, validate SOP compliance, classify payment intent,
            detect rejection reasons, and deliver premium reports in a single async workflow.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/upload" className="rounded-full bg-cyan-400 px-6 py-3 font-medium text-slate-950">
              Start Analysis
            </Link>
            <Link href="/dashboard" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white">
              View Dashboard
            </Link>
          </div>
        </div>
        <div className="glass glow-border rounded-[32px] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["99+", "Scored SOP checkpoints"],
              ["4x", "Faster async ops pipeline"],
              ["Hindi/Tamil", "Multilingual hybrid support"],
              ["PDF + JSON", "Export-ready reporting"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-slate-900/40 p-5">
                <div className="text-3xl font-semibold text-white">{value}</div>
                <div className="mt-2 text-sm text-slate-400">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-3xl border border-indigo-400/20 bg-indigo-400/5 p-5">
            <div className="text-sm uppercase tracking-[0.2em] text-indigo-200">Pipeline</div>
            <div className="mt-3 text-sm leading-7 text-slate-300">
              Audio ingest -> faster-whisper STT -> transcript cleaning -> summary -> SOP scoring -> payment categorization ->
              rejection analysis -> keywords -> dashboard and exports.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
