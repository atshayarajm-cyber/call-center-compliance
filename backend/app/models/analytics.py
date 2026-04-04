import uuid

from sqlalchemy import JSON, Column, Float, ForeignKey, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, ForeignKey("jobs.id"), unique=True, nullable=False)
    sop_validation = Column(JSON, nullable=False)
    payment_analysis = Column(JSON, nullable=False)
    rejection_analysis = Column(JSON, nullable=False)
    keywords = Column(JSON, nullable=False)
    sentiment = Column(Float, nullable=False, default=0.0)
    speaker_separation = Column(JSON, nullable=False, default={"status": "placeholder"})
    extra = Column(JSON, nullable=False, default={})

    job = relationship("Job", back_populates="analytics")
