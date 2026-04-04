export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface ReportResponse {
  job_id: string;
  status: JobStatus;
  transcript: {
    raw: string;
    cleaned: string;
  };
  summary: string;
  sop_validation: {
    score: number;
    checks: { name: string; passed: boolean; evidence: string }[];
  };
  payment_analysis: {
    primary_category: string;
    counts: Record<string, number>;
    evidence_phrases: string[];
  };
  rejection_analysis: {
    has_rejection: boolean;
    primary_reason: string | null;
    all_reasons: string[];
    evidence: string[];
  };
  keywords: string[];
}

export interface JobStatusResponse {
  job_id: string;
  status: JobStatus;
  progress: number;
  error_message: string | null;
  retry_count: number;
  created_at: string;
  updated_at: string;
}

export interface HistoryItem {
  job_id: string;
  status: JobStatus;
  progress: number;
  sentiment: number | null;
  language: string | null;
  created_at: string;
  updated_at: string;
}
