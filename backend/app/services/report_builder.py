from app.models.job import Job
from app.schemas.report import (
    PaymentAnalysisPayload,
    RejectionAnalysisPayload,
    ReportResponse,
    SopCheckPayload,
    SopValidationPayload,
    TranscriptPayload,
)


def build_report_response(job: Job) -> ReportResponse:
    transcript = job.transcript
    summary = job.summary
    analytics = job.analytics

    return ReportResponse(
        job_id=str(job.id),
        status=job.status.value,
        transcript=TranscriptPayload(raw=transcript.raw_text, cleaned=transcript.cleaned_text),
        summary=summary.content,
        sop_validation=SopValidationPayload(
            score=analytics.sop_validation["score"],
            checks=[SopCheckPayload(**item) for item in analytics.sop_validation["checks"]],
        ),
        payment_analysis=PaymentAnalysisPayload(**analytics.payment_analysis),
        rejection_analysis=RejectionAnalysisPayload(**analytics.rejection_analysis),
        keywords=analytics.keywords,
    )
