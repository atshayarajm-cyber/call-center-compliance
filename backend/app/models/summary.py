import uuid

from sqlalchemy import Column, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.db.session import Base


class Summary(Base):
    __tablename__ = "summaries"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, ForeignKey("jobs.id"), unique=True, nullable=False)
    content = Column(Text, nullable=False)

    job = relationship("Job", back_populates="summary")
