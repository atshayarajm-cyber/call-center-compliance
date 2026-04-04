DEFAULT_SOP_TEMPLATE = {
    "greeting": ["hello", "hi", "namaste", "vanakkam"],
    "agent introduction": ["my name is", "this is", "speaking from"],
    "customer verification": ["verify", "confirm your", "date of birth", "registered number"],
    "payment discussion": ["payment", "due amount", "emi", "settlement"],
    "closing statement": ["thank you", "have a nice day", "good day", "bye"],
}


def validate_sop(text: str, template: dict | None = None) -> dict:
    template = template or DEFAULT_SOP_TEMPLATE
    lowered = text.lower()
    checks = []
    passed_count = 0

    for name, phrases in template.items():
        evidence = next((phrase for phrase in phrases if phrase in lowered), "")
        passed = bool(evidence)
        passed_count += int(passed)
        checks.append({"name": name, "passed": passed, "evidence": evidence})

    return {"score": round((passed_count / max(len(template), 1)) * 100), "checks": checks}
