def detect_language(text: str, hint: str | None = None) -> str:
    lowered = text.lower()
    if hint and hint not in {"auto", ""}:
        return hint
    if any(token in lowered for token in ["vanakkam", "unga", "saptingla", "panam", "seri"]):
        return "ta"
    if any(token in lowered for token in ["namaste", "aap", "paisa", "kal", "namaskar"]):
        return "hi"
    return "auto"
