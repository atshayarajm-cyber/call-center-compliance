from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "call_center_analytics",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
)

celery_app.conf.update(
    task_track_started=True,
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    worker_prefetch_multiplier=1,
    timezone="Asia/Calcutta",
)
