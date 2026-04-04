"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { JobStatusTracker } from "@/components/report/job-status-tracker";
import { PageShell } from "@/components/shared/page-shell";
import { getJobStatus } from "@/lib/api";
import { JobStatusResponse } from "@/lib/types";

export default function StatusPage() {
  const router = useRouter();
  const params = useParams<{ jobId: string }>();
  const [jobId, setJobId] = useState("");
  const [job, setJob] = useState<JobStatusResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setJobId(params.jobId);
  }, [params.jobId]);

  useEffect(() => {
    if (!jobId) return;
    const tick = async () => {
      try {
        const status = await getJobStatus(jobId);
        setJob(status);
        if (status.status === "completed") router.push(`/report/${jobId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to fetch status");
      }
    };

    tick();
    const timer = window.setInterval(tick, 3000);
    return () => window.clearInterval(timer);
  }, [jobId, router]);

  return (
    <PageShell>
      <div className="space-y-6">
        <section className="glass rounded-[32px] p-8">
          <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">Job Status</div>
          <h1 className="mt-3 text-4xl font-semibold text-white">Processing your analytics pipeline</h1>
        </section>
        <JobStatusTracker progress={job?.progress ?? 0} status={job?.status ?? "queued"} />
        {error ? <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-5 text-rose-200">{error}</div> : null}
      </div>
    </PageShell>
  );
}
