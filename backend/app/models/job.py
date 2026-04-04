import enum
import uuid

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from app.db.session import Base


class JobStatus(str, enum.Enum):
    queued = "queued"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_by_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(JobStatus), default=JobStatus.queued, nullable=False)
    progress = Column(Integer, default=0, nullable=False)
    retry_count = Column(Integer, default=0, nullable=False)
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    creator = relationship("User", back_populates="jobs")
    call = relationship("Call", back_populates="job", uselist=False)
    transcript = relationship("Transcript", back_populates="job", uselist=False)
    summary = relationship("Summary", back_populates="job", uselist=False)
    analytics = relationship("Analytics", back_populates="job", uselist=False)
