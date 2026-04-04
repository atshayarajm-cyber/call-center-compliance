from app.services.payment_classifier import classify_payment
from app.services.rejection_analyzer import analyze_rejection
from app.services.sop_validator import validate_sop


def test_payment_classifier_detects_emi() -> None:
    result = classify_payment("Customer agreed to EMI and monthly payment plan.")
    assert result["primary_category"] == "EMI"


def test_rejection_analyzer_detects_reason() -> None:
    result = analyze_rejection("Please call later, I have a cash flow issue.")
    assert result["has_rejection"] is True
    assert "cash_flow_issue" in result["all_reasons"]


def test_sop_validator_scores_present_checks() -> None:
    result = validate_sop("Hello, my name is Raj. Please verify your registered number. Payment is pending. Thank you.")
    assert result["score"] >= 80
