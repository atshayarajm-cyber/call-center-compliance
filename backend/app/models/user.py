import enum
import uuid

from sqlalchemy import Column, DateTime, Enum, String, func
from sqlalchemy.orm import relationship

from app.db.session import Base


class UserRole(str, enum.Enum):
    admin = "admin"
    user = "user"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    api_key = Column(String, unique=True, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.user, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    jobs = relationship("Job", back_populates="creator")
