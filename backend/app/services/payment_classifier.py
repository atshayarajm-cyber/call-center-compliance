PAYMENT_PATTERNS = {
    "EMI": ["emi", "installment", "monthly payment"],
    "Full Payment": ["full payment", "complete payment", "entire due"],
    "Partial Payment": ["partial payment", "half payment", "part payment"],
    "Down Payment": ["down payment", "advance payment", "booking amount"],
}


def classify_payment(text: str) -> dict:
    lowered = text.lower()
    counts = {category: 0 for category in PAYMENT_PATTERNS}
    evidence: list[str] = []
    for category, phrases in PAYMENT_PATTERNS.items():
        for phrase in phrases:
            if phrase in lowered:
                counts[category] += lowered.count(phrase)
                evidence.append(phrase)

    primary_category = max(counts, key=counts.get) if any(counts.values()) else "Unknown"
    return {
        "primary_category": primary_category,
        "counts": counts,
        "evidence_phrases": list(dict.fromkeys(evidence)),
    }
