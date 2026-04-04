POSITIVE = {"thank", "great", "resolved", "good", "done", "happy"}
NEGATIVE = {"issue", "problem", "angry", "delay", "late", "upset", "dispute"}


def analyze_sentiment(text: str) -> float:
    lowered = text.lower()
    pos = sum(1 for word in POSITIVE if word in lowered)
    neg = sum(1 for word in NEGATIVE if word in lowered)
    total = pos + neg
    return 0.0 if total == 0 else round((pos - neg) / total, 2)
