import base64

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.call import Call
from app.models.job import Job, JobStatus
from app.models.user import User
from app.schemas.call import AnalyzeAcceptedResponse, BatchAnalyzeAcceptedResponse
from app.schemas.report import ReportResponse
from app.tasks.pipeline import enqueue_analysis_job, process_call_analysis

router = APIRouter(prefix="/calls", tags=["calls"])


def _create_job_and_call(
    *,
    db: Session,
    user: User,
    audio_url: str | None,
    audio_file: UploadFile | None,
    language_hint: str | None,
) -> Job:
    job = Job(status=JobStatus.queued, progress=2, created_by_id=user.id)
    db.add(job)
    db.flush()

    call = Call(
        job_id=job.id,
        audio_url=audio_url,
        language_hint=language_hint,
        original_filename=audio_file.filename if audio_file else None,
    )
    db.add(call)
    db.commit()
    db.refresh(job)
    return job


@router.post("/analyze", response_model=AnalyzeAcceptedResponse, status_code=status.HTTP_202_ACCEPTED)
async def analyze_call(
    background_tasks: BackgroundTasks,
    audio_url: str | None = Form(default=None),
    audio_urls: str | None = Form(default=None),
    audio_file: UploadFile | None = File(default=None),
    language_hint: str | None = Form(default=None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> AnalyzeAcceptedResponse:
    if not any([audio_url, audio_urls, audio_file]):
        raise HTTPException(status_code=400, detail="Provide audio_url, audio_urls, or audio_file")

    job = _create_job_and_call(
        db=db,
        user=user,
        audio_url=audio_url,
        audio_file=audio_file,
        language_hint=language_hint,
    )

    content = await audio_file.read() if audio_file else None
    batch_urls = [item.strip() for item in audio_urls.splitlines() if item.strip()] if audio_urls else None
    background_tasks.add_task(
        enqueue_analysis_job,
        job_id=str(job.id),
        audio_url=audio_url,
        audio_urls=batch_urls,
        file_bytes_b64=base64.b64encode(content).decode("utf-8") if content else None,
        filename=audio_file.filename if audio_file else None,
        language_hint=language_hint,
        user_id=str(user.id),
    )

    return AnalyzeAcceptedResponse(
        job_id=str(job.id),
        status=job.status.value,
        queued_items=max(1, len(batch_urls or [])),
        message="Analysis job accepted",
    )


@router.post("/analyze-sync", response_model=ReportResponse)
async def analyze_call_sync(
    audio_url: str | None = Form(default=None),
    audio_file: UploadFile | None = File(default=None),
    language_hint: str | None = Form(default=None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> ReportResponse:
    if not any([audio_url, audio_file]):
        raise HTTPException(status_code=400, detail="Provide audio_url or audio_file")

    job = _create_job_and_call(
        db=db,
        user=user,
        audio_url=audio_url,
        audio_file=audio_file,
        language_hint=language_hint,
    )

    content = await audio_file.read() if audio_file else None
    try:
        report = process_call_analysis(
            {
                "job_id": str(job.id),
                "audio_url": audio_url,
                "audio_urls": None,
                "file_bytes_b64": base64.b64encode(content).decode("utf-8") if content else None,
                "filename": audio_file.filename if audio_file else None,
                "language_hint": language_hint,
                "user_id": str(user.id),
            }
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {exc}") from exc

    return ReportResponse.model_validate(report)


@router.post("/analyze-batch", response_model=BatchAnalyzeAcceptedResponse, status_code=status.HTTP_202_ACCEPTED)
async def analyze_batch_calls(
    background_tasks: BackgroundTasks,
    audio_urls: str = Form(...),
    language_hint: str | None = Form(default=None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> BatchAnalyzeAcceptedResponse:
    urls = [item.strip() for item in audio_urls.splitlines() if item.strip()]
    if not urls:
        raise HTTPException(status_code=400, detail="Provide at least one batch audio URL")

    job_ids: list[str] = []
    for url in urls:
        job = Job(status=JobStatus.queued, progress=2, created_by_id=user.id)
        db.add(job)
        db.flush()

        call = Call(
            job_id=job.id,
            audio_url=url,
            language_hint=language_hint,
            original_filename=None,
        )
        db.add(call)
        job_ids.append(str(job.id))

        background_tasks.add_task(
            enqueue_analysis_job,
            job_id=str(job.id),
            audio_url=url,
            audio_urls=None,
            file_bytes_b64=None,
            filename=None,
            language_hint=language_hint,
            user_id=str(user.id),
        )

    db.commit()

    return BatchAnalyzeAcceptedResponse(
        batch_job_ids=job_ids,
        status=JobStatus.queued.value,
        queued_items=len(job_ids),
        message="Batch analysis jobs accepted",
    )
