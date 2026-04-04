import Link from "next/link";

import { PageShell } from "@/components/shared/page-shell";
import { getHistory } from "@/lib/api";

export default async function HistoryPage() {
  let items = [];
  try {
    items = await getHistory();
  } catch {
    items = [];
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <section className="glass rounded-[32px] p-8">
          <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">History</div>
          <h1 className="mt-3 text-4xl font-semibold text-white">Recent jobs and outcomes</h1>
        </section>
        <div className="space-y-4">
          {items.length ? (
            items.map((item) => (
              <Link key={item.job_id} href={`/report/${item.job_id}`} className="glass block rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-medium text-white">{item.job_id}</div>
                    <div className="mt-1 text-sm text-slate-400">
                      {item.status} • {item.language ?? "auto"} • sentiment {item.sentiment ?? 0}
                    </div>
                  </div>
                  <div className="text-sm text-cyan-200">{item.progress}%</div>
                </div>
              </Link>
            ))
          ) : (
            <div className="glass rounded-3xl p-8 text-slate-400">No jobs yet.</div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
