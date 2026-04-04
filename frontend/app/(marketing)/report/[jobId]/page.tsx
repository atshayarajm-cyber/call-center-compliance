"use client";

import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { PaymentChart } from "@/components/charts/payment-chart";
import { KeywordTags } from "@/components/report/keyword-tags";
import { RejectionPanel } from "@/components/report/rejection-panel";
import { SopScoreCircle } from "@/components/report/sop-score-circle";
import { SummaryCard } from "@/components/report/summary-card";
import { TranscriptViewer } from "@/components/report/transcript-viewer";
import { PageShell } from "@/components/shared/page-shell";
import { getReport } from "@/lib/api";
import { ReportResponse } from "@/lib/types";

export default function ReportPage() {
  const params = useParams<{ jobId: string }>();
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [jobId, setJobId] = useState("");

  useEffect(() => {
    const id = params.jobId;
    if (!id) return;
    (async () => {
      setJobId(id);
      const data = await getReport(id);
      setReport(data);
    })();
  }, [params.jobId]);

  const exportPdf = () => {
    if (!report) return;
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text(`Call Report ${report.job_id}`, 12, 18);
    pdf.setFontSize(11);
    pdf.text(report.summary, 12, 32, { maxWidth: 180 });
    pdf.save(`call-report-${report.job_id}.pdf`);
  };

  const exportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `call-report-${report.job_id}.json`;
    link.click();
  };

  if (!report) {
    return (
      <PageShell>
        <div className="glass rounded-3xl p-8 text-slate-300">Loading report for {jobId || "job"}...</div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <section className="glass rounded-[32px] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">Report</div>
              <h1 className="mt-3 text-4xl font-semibold text-white">Completed call intelligence report</h1>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={exportPdf} className="rounded-full bg-cyan-400 px-5 py-3 font-medium text-slate-950">
                Export PDF
              </button>
              <button type="button" onClick={exportJson} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-medium text-white">
                Download JSON
              </button>
            </div>
          </div>
        </section>
        <SummaryCard summary={report.summary} />
        <TranscriptViewer raw={report.transcript.raw} cleaned={report.transcript.cleaned} />
        <div className="grid gap-6 xl:grid-cols-2">
          <SopScoreCircle score={report.sop_validation.score} checks={report.sop_validation.checks} />
          <PaymentChart counts={report.payment_analysis.counts} />
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <RejectionPanel
            primaryReason={report.rejection_analysis.primary_reason}
            allReasons={report.rejection_analysis.all_reasons}
            evidence={report.rejection_analysis.evidence}
          />
          <KeywordTags keywords={report.keywords} />
        </div>
      </div>
    </PageShell>
  );
}
