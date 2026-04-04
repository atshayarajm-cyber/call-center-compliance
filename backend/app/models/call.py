import uuid

from sqlalchemy import Column, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.db.session import Base


class Call(Base):
    __tablename__ = "calls"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, ForeignKey("jobs.id"), unique=True, nullable=False)
    audio_url = Column(Text, nullable=True)
    storage_path = Column(Text, nullable=True)
    original_filename = Column(String, nullable=True)
    language_hint = Column(String, nullable=True)
    language_detected = Column(String, nullable=True)

    job = relationship("Job", back_populates="call")
