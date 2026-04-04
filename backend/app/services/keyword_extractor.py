import re
from collections import Counter

STOPWORDS = {
    "the",
    "is",
    "and",
    "a",
    "to",
    "for",
    "of",
    "hai",
    "sir",
    "madam",
    "okay",
    "haan",
    "please",
    "payment",
}


def extract_keywords(text: str, top_k: int = 12) -> list[str]:
    tokens = re.findall(r"[a-zA-Z][a-zA-Z0-9_-]{2,}", text.lower())
    filtered = [token for token in tokens if token not in STOPWORDS]
    return [token for token, _ in Counter(filtered).most_common(top_k)]
