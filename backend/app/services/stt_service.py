from functools import lru_cache
from pathlib import Path
import re
from shutil import rmtree

from faster_whisper import WhisperModel
from faster_whisper.utils import download_model

from app.core.config import settings

SUPPORTED_LANGUAGES = {"hi", "ta"}
LANGUAGE_LEXICONS = {
    "hi": {"hello", "haan", "hai", "aap", "sir", "madam", "number", "payment", "emi", "paisa", "thank", "okay"},
    "ta": {"hello", "vanakkam", "seri", "unga", "amma", "anna", "sir", "madam", "number", "payment", "emi", "panam"},
}


def _model_candidates() -> list[str]:
    configured = settings.faster_whisper_model
    fallback_order = ["base", "tiny", "small"]
    return [configured, *[name for name in fallback_order if name != configured]]


def _prepare_model_path(model_name: str) -> Path:
    base_dir = Path(settings.local_storage_dir) / "models"
    target_dir = base_dir / model_name
    target_dir.mkdir(parents=True, exist_ok=True)

    model_bin = target_dir / "model.bin"
    if model_bin.exists():
        return target_dir

    # Remove incomplete downloads before asking faster-whisper to fetch the model again.
    if target_dir.exists():
        for child in list(target_dir.iterdir()):
            if child.is_dir():
                rmtree(child, ignore_errors=True)
            else:
                child.unlink(missing_ok=True)

    download_model(model_name, output_dir=str(target_dir), cache_dir=str(base_dir / ".hf-cache"))
    return target_dir


@lru_cache
def get_model() -> WhisperModel:
    last_error: Exception | None = None

    for model_name in _model_candidates():
        try:
            model_path = _prepare_model_path(model_name)
            return WhisperModel(
                str(model_path),
                device=settings.faster_whisper_device,
                compute_type=settings.faster_whisper_compute_type,
                cpu_threads=settings.faster_whisper_cpu_threads,
                num_workers=settings.faster_whisper_num_workers,
                local_files_only=True,
            )
        except Exception as exc:  # pragma: no cover - runtime fallback path
            last_error = exc

    raise RuntimeError(f"Unable to initialize any faster-whisper model: {last_error}") from last_error


def _transcribe_once(model: WhisperModel, file_path: str, language: str | None) -> dict:
    segments, info = model.transcribe(
        file_path,
        language=language,
        vad_filter=True,
        beam_size=1,
        best_of=1,
        word_timestamps=False,
        condition_on_previous_text=False,
    )
    segment_payload = []
    raw_parts = []
    for segment in segments:
        text = segment.text.strip()
        if not text:
            continue
        raw_parts.append(text)
        segment_payload.append(
            {
                "start": round(segment.start, 2),
                "end": round(segment.end, 2),
                "text": text,
            }
        )

    return {
        "language": getattr(info, "language", language or "auto"),
        "language_probability": getattr(info, "language_probability", 0.0),
        "raw_text": " ".join(raw_parts).strip(),
        "segments": segment_payload,
    }


def _score_candidate(text: str, language: str) -> float:
    lowered = text.lower()
    tokens = re.findall(r"[a-zA-Z']+", lowered)
    if not tokens:
        return 0.0

    keyword_hits = sum(1 for token in tokens if token in LANGUAGE_LEXICONS[language])
    ascii_ratio = sum(1 for char in text if char.isascii() and (char.isalpha() or char.isspace())) / max(len(text), 1)
    weird_chars = sum(1 for char in text if not char.isascii())
    return (keyword_hits * 6) + min(len(tokens), 400) * 0.05 + (ascii_ratio * 10) - (weird_chars * 2)


def transcribe_audio(file_path: str, language_hint: str | None = None) -> dict:
    model = get_model()
    normalized_hint = language_hint if language_hint not in {"auto", "", None} else None

    if normalized_hint in SUPPORTED_LANGUAGES:
        return _transcribe_once(model, file_path, normalized_hint)

    # Local CPU mode should avoid multiple full transcription passes whenever possible.
    if settings.task_mode == "background" and settings.faster_whisper_device == "cpu":
        hi_result = _transcribe_once(model, file_path, "hi")
        hi_score = _score_candidate(hi_result["raw_text"], "hi")
        if hi_score >= 18:
            return hi_result

        ta_result = _transcribe_once(model, file_path, "ta")
        scored = sorted(
            [hi_result, ta_result],
            key=lambda item: _score_candidate(item["raw_text"], item["language"]),
            reverse=True,
        )
        return scored[0]

    auto_result = _transcribe_once(model, file_path, None)
    if auto_result["language"] in SUPPORTED_LANGUAGES and auto_result["language_probability"] >= 0.45:
        return auto_result

    candidates = [
        _transcribe_once(model, file_path, "hi"),
        _transcribe_once(model, file_path, "ta"),
    ]
    scored = sorted(
        candidates,
        key=lambda item: _score_candidate(item["raw_text"], item["language"]),
        reverse=True,
    )
    return scored[0]
