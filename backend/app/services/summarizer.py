from openai import OpenAI

from app.core.config import settings


def summarize_text(text: str) -> str:
    if settings.summary_provider == "openai" and settings.openai_api_key:
        client = OpenAI(api_key=settings.openai_api_key)
        response = client.responses.create(
            model=settings.openai_model,
            input=(
                "Summarize this call center conversation in 5-7 concise sentences. "
                "Mention the customer's intent, commitments, objections, payment context, and outcome.\n\n"
                f"{text}"
            ),
        )
        return response.output_text.strip()

    sentences = [chunk.strip() for chunk in text.replace("?", ".").replace("!", ".").split(".") if chunk.strip()]
    if not sentences:
        return "No meaningful conversation detected."
    important = sentences[:3]
    if len(sentences) > 3:
        important.append(sentences[-1])
    return ". ".join(important)[:900].strip() + "."
