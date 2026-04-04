from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.job import Job, JobStatus
from app.models.user import User
from app.schemas.report import ReportResponse
from app.services.report_builder import build_report_response

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/{job_id}", response_model=ReportResponse)
def get_report(
    job_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> ReportResponse:
    job = db.query(Job).filter(Job.id == job_id, Job.created_by_id == user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Report not found")
    if job.status != JobStatus.completed:
        raise HTTPException(status_code=409, detail="Report is not ready")
    return build_report_response(job)
