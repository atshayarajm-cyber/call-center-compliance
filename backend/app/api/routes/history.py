from pathlib import Path

from fastapi import APIRouter, Depends
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.models.analytics import Analytics
from app.models.call import Call
from app.models.job import Job
from app.models.summary import Summary
from app.models.transcript import Transcript
from app.models.user import User
from app.schemas.call import ClearHistoryResponse, HistoryItem

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=list[HistoryItem])
def get_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[HistoryItem]:
    jobs = (
        db.query(Job)
        .filter(Job.created_by_id == user.id)
        .order_by(desc(Job.created_at))
        .limit(50)
        .all()
    )
    return [
        HistoryItem(
            job_id=str(job.id),
            status=job.status.value,
            progress=job.progress,
            sentiment=job.analytics.sentiment if job.analytics else None,
            language=job.call.language_detected if job.call else None,
            created_at=job.created_at,
            updated_at=job.updated_at,
        )
        for job in jobs
    ]


@router.delete("", response_model=ClearHistoryResponse)
def clear_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> ClearHistoryResponse:
    jobs = db.query(Job).filter(Job.created_by_id == user.id).all()
    if not jobs:
        return ClearHistoryResponse(cleared_jobs=0, message="History already empty")

    job_ids = [job.id for job in jobs]
    calls = db.query(Call).filter(Call.job_id.in_(job_ids)).all()
    managed_audio_dir = (Path(settings.local_storage_dir) / "audio").resolve()
    storage_paths = {
        str(Path(call.storage_path).resolve())
        for call in calls
        if call.storage_path
        and Path(call.storage_path).exists()
        and managed_audio_dir in Path(call.storage_path).resolve().parents
    }

    db.query(Analytics).filter(Analytics.job_id.in_(job_ids)).delete(synchronize_session=False)
    db.query(Summary).filter(Summary.job_id.in_(job_ids)).delete(synchronize_session=False)
    db.query(Transcript).filter(Transcript.job_id.in_(job_ids)).delete(synchronize_session=False)
    db.query(Call).filter(Call.job_id.in_(job_ids)).delete(synchronize_session=False)
    db.query(Job).filter(Job.id.in_(job_ids)).delete(synchronize_session=False)
    db.commit()

    for file_path in storage_paths:
        try:
            Path(file_path).unlink(missing_ok=True)
        except OSError:
            continue

    return ClearHistoryResponse(
        cleared_jobs=len(job_ids),
        message="History cleared successfully",
    )
