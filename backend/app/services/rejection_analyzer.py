REJECTION_MAP = {
    "cash_flow_issue": ["cash issue", "no money", "funds problem", "cash flow"],
    "call_back_later": ["call later", "baad mein", "later", "callback"],
    "not_interested": ["not interested", "interest nahi", "don't want"],
    "wrong_number": ["wrong number", "galat number"],
    "already_paid": ["already paid", "payment done", "already cleared"],
    "dispute": ["dispute", "issue with bill", "wrong charge"],
    "job_loss": ["lost my job", "job loss", "no job"],
    "medical_reason": ["hospital", "medical", "treatment", "health issue"],
}


def analyze_rejection(text: str) -> dict:
    lowered = text.lower()
    reasons: list[str] = []
    evidence: list[str] = []
    for reason, patterns in REJECTION_MAP.items():
        for pattern in patterns:
            if pattern in lowered:
                reasons.append(reason)
                evidence.append(pattern)
                break
    return {
        "has_rejection": bool(reasons),
        "primary_reason": reasons[0] if reasons else None,
        "all_reasons": reasons,
        "evidence": evidence,
    }
