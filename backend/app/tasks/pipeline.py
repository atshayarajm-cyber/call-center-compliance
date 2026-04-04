import base64
import queue
import threading

from app.core.config import settings
from sqlalchemy.orm import Session

from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from app.models.analytics import Analytics
from app.models.call import Call
from app.models.job import Job, JobStatus
from app.models.summary import Summary
from app.models.transcript import Transcript
from app.services.audio_downloader import download_audio, ensure_managed_audio, persist_upload
from app.services.keyword_extractor import extract_keywords
from app.services.language_detector import detect_language
from app.services.payment_classifier import classify_payment
from app.services.rejection_analyzer import analyze_rejection
from app.services.report_builder import build_report_response
from app.services.sentiment_analyzer import analyze_sentiment
from app.services.sop_validator import validate_sop
from app.services.stt_service import transcribe_audio
from app.services.summarizer import summarize_text
from app.services.transcript_cleaner import clean_transcript

_LOCAL_JOB_QUEUE: "queue.Queue[dict]" = queue.Queue()
_LOCAL_WORKER: threading.Thread | None = None
_LOCAL_WORKER_LOCK = threading.Lock()


def enqueue_analysis_job(**payload: object) -> None:
    if settings.task_mode == "celery":
        process_call_analysis.delay(payload)
        return
    _ensure_local_worker()
    _LOCAL_JOB_QUEUE.put(dict(payload))


def _ensure_local_worker() -> None:
    global _LOCAL_WORKER

    with _LOCAL_WORKER_LOCK:
        if _LOCAL_WORKER and _LOCAL_WORKER.is_alive():
            return

        _LOCAL_WORKER = threading.Thread(
            target=_local_worker_loop,
            name="calliq-local-worker",
            daemon=True,
        )
        _LOCAL_WORKER.start()


def _local_worker_loop() -> None:
    while True:
        payload = _LOCAL_JOB_QUEUE.get()
        try:
            process_call_analysis(payload)
        except Exception:
            # The task already persists failure state on the job record.
            pass
        finally:
            _LOCAL_JOB_QUEUE.task_done()


def _update_job(
    db: Session,
    job: Job,
    *,
    status: JobStatus | None = None,
    progress: int | None = None,
    error: str | None = None,
) -> None:
    if status is not None:
        job.status = status
    if progress is not None:
        job.progress = progress
    if error is not None:
        job.error_message = error
    db.add(job)
    db.commit()
    db.refresh(job)


@celery_app.task(name="process_call_analysis")
def process_call_analysis(payload: dict) -> dict:
    db = SessionLocal()
    job_id = payload["job_id"]

    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        call = db.query(Call).filter(Call.job_id == job_id).first()
        _update_job(db, job, status=JobStatus.processing, progress=10)

        file_bytes_b64 = payload.get("file_bytes_b64")
        if payload.get("file_path"):
            file_path = ensure_managed_audio(payload["file_path"])
        elif file_bytes_b64:
            file_path = persist_upload(base64.b64decode(file_bytes_b64), payload.get("filename"))
        elif payload.get("audio_url"):
            file_path = download_audio(payload["audio_url"])
        else:
            batch_urls = payload.get("audio_urls") or []
            file_path = download_audio(batch_urls[0])
            call.audio_url = batch_urls[0]
            db.add(call)
            db.commit()

        call.storage_path = file_path
        db.add(call)
        db.commit()
        _update_job(db, job, progress=35)

        stt_result = transcribe_audio(file_path, payload.get("language_hint"))
        raw_text = stt_result["raw_text"]
        cleaned = clean_transcript(raw_text)
        detected_language = detect_language(cleaned, stt_result["language"])

        transcript = Transcript(
            job_id=job_id,
            raw_text=raw_text,
            cleaned_text=cleaned,
            segments=stt_result["segments"],
        )
        call.language_detected = detected_language
        db.add_all([transcript, call])
        db.commit()
        _update_job(db, job, progress=65)

        summary = Summary(job_id=job_id, content=summarize_text(cleaned))
        db.add(summary)
        db.commit()
        _update_job(db, job, progress=82)

        analytics = Analytics(
            job_id=job_id,
            sop_validation=validate_sop(cleaned),
            payment_analysis=classify_payment(cleaned),
            rejection_analysis=analyze_rejection(cleaned),
            keywords=extract_keywords(cleaned),
            sentiment=analyze_sentiment(cleaned),
            speaker_separation={"status": "placeholder", "message": "Speaker diarization can be added later."},
            extra={
                "language": detected_language,
                "waveform": [0.2, 0.42, 0.3, 0.7, 0.45, 0.35, 0.62, 0.28],
            },
        )
        db.add(analytics)
        db.commit()
        _update_job(db, job, status=JobStatus.completed, progress=100)
        return build_report_response(job).model_dump()
    except Exception as exc:
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.retry_count += 1
            _update_job(db, job, status=JobStatus.failed, progress=100, error=str(exc))
        raise
    finally:
        db.close()
