from pydantic import BaseModel


class TranscriptPayload(BaseModel):
    raw: str
    cleaned: str


class SopCheckPayload(BaseModel):
    name: str
    passed: bool
    evidence: str


class SopValidationPayload(BaseModel):
    score: int
    checks: list[SopCheckPayload]


class PaymentAnalysisPayload(BaseModel):
    primary_category: str
    counts: dict[str, int]
    evidence_phrases: list[str]


class RejectionAnalysisPayload(BaseModel):
    has_rejection: bool
    primary_reason: str | None
    all_reasons: list[str]
    evidence: list[str]


class ReportResponse(BaseModel):
    job_id: str
    status: str
    transcript: TranscriptPayload
    summary: str
    sop_validation: SopValidationPayload
    payment_analysis: PaymentAnalysisPayload
    rejection_analysis: RejectionAnalysisPayload
    keywords: list[str]
