export function RejectionPanel({
  primaryReason,
  allReasons,
  evidence
}: {
  primaryReason: string | null;
  allReasons: string[];
  evidence: string[];
}) {
  return (
    <section className="glass rounded-3xl p-6">
      <div className="mb-4 text-sm uppercase tracking-[0.2em] text-cyan-300">Rejection Analysis</div>
      <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-4 text-sm text-slate-200">
        Primary reason: {primaryReason ?? "None detected"}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {allReasons.length ? allReasons.map((item) => <span key={item} className="rounded-full bg-white/5 px-3 py-2 text-xs text-slate-200">{item}</span>) : <span className="text-sm text-slate-400">No rejection reasons identified.</span>}
      </div>
      <div className="mt-4 space-y-2">
        {evidence.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-sm text-slate-300">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
