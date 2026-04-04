import tempfile
from shutil import copy2
from pathlib import Path
from urllib.parse import urlparse

import httpx
from tenacity import retry, stop_after_attempt, wait_fixed

from app.core.config import settings


def _get_audio_work_dir() -> Path:
    work_dir = Path(settings.local_storage_dir) / "audio"
    work_dir.mkdir(parents=True, exist_ok=True)
    return work_dir


@retry(stop=stop_after_attempt(3), wait=wait_fixed(1))
def download_audio(audio_url: str) -> str:
    parsed = urlparse(audio_url)
    suffix = Path(parsed.path).suffix or ".mp3"
    with httpx.Client(timeout=60, follow_redirects=True) as client:
        response = client.get(audio_url)
        response.raise_for_status()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix, dir=_get_audio_work_dir()) as output:
            output.write(response.content)
            return output.name


def persist_upload(file_bytes: bytes, filename: str | None) -> str:
    suffix = Path(filename or "upload.wav").suffix or ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix, dir=_get_audio_work_dir()) as output:
        output.write(file_bytes)
        return output.name


def ensure_managed_audio(file_path: str) -> str:
    source = Path(file_path)
    managed_dir = _get_audio_work_dir().resolve()

    try:
        if source.resolve().parent == managed_dir:
            return str(source)
    except FileNotFoundError:
        return file_path

    target = managed_dir / source.name
    copy2(source, target)
    return str(target)
