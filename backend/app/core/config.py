from functools import lru_cache
from typing import Annotated

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "AI Call Center Analytics"
    environment: str = Field(default="development", alias="BACKEND_ENV")
    debug: bool = Field(default=True, alias="BACKEND_DEBUG")
    host: str = Field(default="0.0.0.0", alias="BACKEND_HOST")
    port: int = Field(default=8000, alias="BACKEND_PORT")
    task_mode: str = Field(default="background", alias="BACKEND_TASK_MODE")
    local_storage_dir: str = Field(
        default="./runtime_storage",
        alias="LOCAL_STORAGE_DIR",
    )
    database_url: str = Field(default="sqlite:///./runtime_storage/call_center.db", alias="DATABASE_URL")
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    celery_broker_url: str = Field(default="memory://", alias="CELERY_BROKER_URL")
    celery_result_backend: str = Field(default="cache+memory://", alias="CELERY_RESULT_BACKEND")
    api_keys: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: ["dev-admin-key"],
        alias="API_KEYS",
    )
    admin_api_keys: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: ["dev-admin-key"],
        alias="ADMIN_API_KEYS",
    )
    faster_whisper_model: str = Field(default="small", alias="FASTER_WHISPER_MODEL")
    faster_whisper_device: str = Field(default="cpu", alias="FASTER_WHISPER_DEVICE")
    faster_whisper_compute_type: str = Field(default="int8", alias="FASTER_WHISPER_COMPUTE_TYPE")
    faster_whisper_cpu_threads: int = Field(default=4, alias="FASTER_WHISPER_CPU_THREADS")
    faster_whisper_num_workers: int = Field(default=1, alias="FASTER_WHISPER_NUM_WORKERS")
    openai_api_key: str | None = Field(default=None, alias="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4.1-mini", alias="OPENAI_MODEL")
    summary_provider: str = Field(default="local", alias="SUMMARY_PROVIDER")
    frontend_url: str = Field(default="http://localhost:3000", alias="FRONTEND_URL")

    @field_validator("api_keys", "admin_api_keys", mode="before")
    @classmethod
    def split_csv(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, list):
            return value
        return [item.strip() for item in str(value).split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
