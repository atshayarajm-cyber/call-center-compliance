from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from app.api.routes import admin, calls, history, jobs, reports
from app.core.config import settings
from app.core.logging import configure_logging
from app.db import base  # noqa: F401
from app.db.session import Base, SessionLocal, engine
from app.models.job import Job, JobStatus

configure_logging()
Base.metadata.create_all(bind=engine)


def recover_stale_local_jobs() -> None:
    if settings.task_mode != "background":
        return

    db = SessionLocal()
    try:
        stale_jobs = db.query(Job).filter(Job.status.in_([JobStatus.queued, JobStatus.processing])).all()
        for job in stale_jobs:
            job.status = JobStatus.failed
            job.error_message = "Local processing was interrupted. Please retry this job."
            db.add(job)
        db.commit()
    finally:
        db.close()


recover_stale_local_jobs()

app = FastAPI(title=settings.app_name, version="1.0.0")
PROJECT_ROOT = Path(__file__).resolve().parents[2]
FRONTEND_STATIC_DIR = PROJECT_ROOT / "frontend-static"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calls.router, prefix="/api/v1")
app.include_router(jobs.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
app.include_router(history.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def _serve_frontend_asset(filename: str) -> FileResponse:
    asset_path = FRONTEND_STATIC_DIR / filename
    if not asset_path.exists():
        raise HTTPException(status_code=404, detail="Frontend asset not found")
    return FileResponse(asset_path)


@app.get("/", include_in_schema=False)
def frontend_index() -> FileResponse:
    return _serve_frontend_asset("index.html")


@app.get("/styles.css", include_in_schema=False)
def frontend_styles() -> FileResponse:
    return _serve_frontend_asset("styles.css")


@app.get("/app.js", include_in_schema=False)
def frontend_script() -> FileResponse:
    return _serve_frontend_asset("app.js")
