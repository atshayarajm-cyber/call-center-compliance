from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import asc
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.models.call import Call
from app.models.job import Job, JobStatus
from app.models.user import User
from app.schemas.call import JobStatusResponse
from app.tasks.pipeline import enqueue_analysis_job

router = APIRouter(prefix="/jobs", tags=["jobs"])


def _get_jobs_ahead(db: Session, job: Job) -> int | None:
    if settings.task_mode != "background":
        return None

    if job.status not in {JobStatus.queued, JobStatus.processing}:
        return 0

    active_jobs = (
        db.query(Job)
        .filter(Job.status.in_([JobStatus.processing, JobStatus.queued]))
        .order_by(asc(Job.created_at))
        .all()
    )

    for index, active_job in enumerate(active_jobs):
        if active_job.id == job.id:
            return index

    return 0


@router.get("/{job_id}", response_model=JobStatusResponse)
def get_job_status(
    job_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> JobStatusResponse:
    job = db.query(Job).filter(Job.id == job_id, Job.created_by_id == user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return JobStatusResponse(
        job_id=str(job.id),
        status=job.status.value,
        progress=job.progress,
        error_message=job.error_message,
        retry_count=job.retry_count,
        jobs_ahead=_get_jobs_ahead(db, job),
        created_at=job.created_at,
        updated_at=job.updated_at,
    )


@router.post("/{job_id}/retry", response_model=JobStatusResponse, status_code=status.HTTP_202_ACCEPTED)
def retry_job(
    job_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> JobStatusResponse:
    job = db.query(Job).filter(Job.id == job_id, Job.created_by_id == user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    call = db.query(Call).filter(Call.job_id == job.id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call metadata not found")

    payload = {
        "job_id": str(job.id),
        "audio_url": call.audio_url,
        "language_hint": call.language_hint,
        "filename": call.original_filename,
    }

    if call.audio_url:
        payload["file_path"] = None
    elif call.storage_path and Path(call.storage_path).exists():
        payload["file_path"] = call.storage_path
    elif not call.audio_url:
        raise HTTPException(status_code=409, detail="No retryable source available for this job")

    job.status = JobStatus.queued
    job.progress = 2
    job.error_message = None
    db.add(job)
    db.commit()
    db.refresh(job)

    enqueue_analysis_job(**payload)

    return JobStatusResponse(
        job_id=str(job.id),
        status=job.status.value,
        progress=job.progress,
        error_message=job.error_message,
        retry_count=job.retry_count,
        jobs_ahead=_get_jobs_ahead(db, job),
        created_at=job.created_at,
        updated_at=job.updated_at,
    )
