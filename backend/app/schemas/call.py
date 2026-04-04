from datetime import datetime

from pydantic import BaseModel


class AnalyzeAcceptedResponse(BaseModel):
    job_id: str
    status: str
    queued_items: int
    message: str


class BatchAnalyzeAcceptedResponse(BaseModel):
    batch_job_ids: list[str]
    status: str
    queued_items: int
    message: str


class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    progress: int
    error_message: str | None
    retry_count: int
    jobs_ahead: int | None = None
    created_at: datetime
    updated_at: datetime


class HistoryItem(BaseModel):
    job_id: str
    status: str
    progress: int
    sentiment: float | None = None
    language: str | None = None
    created_at: datetime
    updated_at: datetime


class ClearHistoryResponse(BaseModel):
    cleared_jobs: int
    message: str
