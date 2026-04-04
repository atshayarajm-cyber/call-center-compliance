import re


def clean_transcript(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"\b(uh+|um+|hmm+)\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s+", " ", text).strip()
    return text
