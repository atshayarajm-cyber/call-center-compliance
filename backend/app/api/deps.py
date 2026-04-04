from collections.abc import Generator

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.user import User, UserRole


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    authorization: str = Header(default=""),
    x_api_key: str | None = Header(default=None, alias="x-api-key"),
    db: Session = Depends(get_db),
) -> User:
    token = (x_api_key or "").strip()
    if not token:
        scheme, _, bearer_token = authorization.partition(" ")
        if scheme.lower() == "bearer" and bearer_token:
            token = bearer_token.strip()

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API key",
        )

    if token not in settings.api_keys:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
        )

    user = db.query(User).filter(User.api_key == token).first()
    if user:
        return user

    role = UserRole.admin if token in settings.admin_api_keys else UserRole.user
    user = User(email=f"{role.value}-{token[:8]}@local.dev", api_key=token, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user
