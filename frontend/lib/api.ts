import { HistoryItem, JobStatusResponse, ReportResponse } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export function getApiKey() {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("call-center-api-key") ?? process.env.NEXT_PUBLIC_DEFAULT_API_KEY ?? "";
  }
  return process.env.NEXT_PUBLIC_DEFAULT_API_KEY ?? "";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || "Request failed");
  }

  return response.json();
}

export async function createAnalysisJob(formData: FormData) {
  return request<{ job_id: string; status: string; queued_items: number; message: string }>("/api/v1/calls/analyze", {
    method: "POST",
    body: formData
  });
}

export async function getJobStatus(jobId: string) {
  return request<JobStatusResponse>(`/api/v1/jobs/${jobId}`);
}

export async function getReport(jobId: string) {
  return request<ReportResponse>(`/api/v1/reports/${jobId}`);
}

export async function getHistory() {
  return request<HistoryItem[]>("/api/v1/history");
}

export async function getSopTemplate() {
  return request<{ template: Record<string, string[]> }>("/api/v1/admin/sop-template");
}
