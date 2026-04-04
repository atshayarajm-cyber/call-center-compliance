import { PageShell } from "@/components/shared/page-shell";
import { getHistory } from "@/lib/api";

export default async function DashboardPage() {
  let history = [];
  try {
    history = await getHistory();
  } catch {
    history = [];
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <section className="glass rounded-[32px] p-8">
          <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">Analytics Dashboard</div>
          <h1 className="mt-3 text-4xl font-semibold text-white">Live operations visibility</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Monitor recent jobs, audit compliance trends, and review language and sentiment signals from your call center pipeline.
          </p>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          <div className="glass rounded-3xl p-6">
            <div className="text-sm text-slate-400">Total Jobs</div>
            <div className="mt-3 text-4xl font-semibold text-white">{history.length}</div>
          </div>
          <div className="glass rounded-3xl p-6">
            <div className="text-sm text-slate-400">Completed</div>
            <div className="mt-3 text-4xl font-semibold text-white">{history.filter((item) => item.status === "completed").length}</div>
          </div>
          <div className="glass rounded-3xl p-6">
            <div className="text-sm text-slate-400">Failed</div>
            <div className="mt-3 text-4xl font-semibold text-white">{history.filter((item) => item.status === "failed").length}</div>
          </div>
        </section>
        <section className="glass rounded-3xl p-6">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-cyan-300">Recent History</div>
          <div className="space-y-3">
            {history.length ? (
              history.map((item) => (
                <div key={item.job_id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-sm text-slate-200">
                  <div>Job: {item.job_id}</div>
                  <div className="mt-1 text-slate-400">
                    {item.status} • {item.language ?? "unknown"} • sentiment {item.sentiment ?? 0}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-6 text-slate-400">
                No history yet. Start a job from the upload page.
              </div>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
