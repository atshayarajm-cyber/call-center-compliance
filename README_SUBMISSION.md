# Submission README

This is the clean submission-facing guide for the **Call Center Compliance** project. If you are a judge or reviewer, start here.

## Project Summary

This system analyzes customer support and sales calls in Hindi / Hinglish and Tamil / Tanglish. It accepts audio input, performs speech-to-text, generates a summary, validates script compliance, classifies payment intent, extracts rejection reasons, and returns a structured JSON report.

## Implemented Features

- Audio URL submission
- Audio file upload
- Batch URL submission
- Async job tracking with progress states
- Retry failed jobs
- Full report view with:
  - raw transcript
  - cleaned transcript
  - summary
  - SOP validation
  - payment categorisation
  - rejection analysis
  - keywords
- History view with clear-history action
- Admin SOP template view
- Synchronous tester endpoint for final evaluation

## Main Stack

- Frontend: HTML, CSS, JavaScript
- Backend: FastAPI, SQLAlchemy, Pydantic
- Speech-to-text: `faster-whisper`
- Local persistence: SQLite
- Optional production path supported in codebase: Celery, Redis, PostgreSQL

## Main Folders

```text
backend/
frontend-static/
frontend/
test-audio/
README.md
README_SUBMISSION.md
ARCHITECTURE.md
AI_TOOLS_USED.md
DEPLOYMENT_REQUIREMENTS.md
SUBMISSION_CHECKLIST.md
SUBMISSION_FORM_TEMPLATE.md
SCORING_ALIGNMENT.md
PRESENTATION_DECK.md
DEMO_SCRIPT.md
```

## Local Run

Backend:

```powershell
cd "D:\call _center\backend"
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Frontend:

```powershell
cd "D:\call _center\frontend-static"
npm install
npm run dev
```

Open:

- Frontend: `http://localhost:5500`
- Backend health: `http://localhost:8000/health`

Frontend settings:

- API Base URL: `http://localhost:8000`
- API Key: `dev-admin-key`

## API Endpoints

- `POST /api/v1/calls/analyze`
- `POST /api/v1/calls/analyze-sync`
- `POST /api/v1/calls/analyze-batch`
- `GET /api/v1/jobs/{job_id}`
- `POST /api/v1/jobs/{job_id}/retry`
- `GET /api/v1/reports/{job_id}`
- `GET /api/v1/history`
- `DELETE /api/v1/history`
- `GET /api/v1/admin/sop-template`
- `GET /health`

## Endpoint Tester Configuration

Use the **public backend** endpoint below for the Call Compliance tester:

```text
https://your-public-backend-domain/api/v1/calls/analyze-sync
```

Accepted auth headers:

- `x-api-key: <API_KEY>`
- `Authorization: Bearer <API_KEY>`

Recommended tester header:

- name: `x-api-key`
- value: your deployed API key

## Example Response Modules

- transcript
- summary
- sop_validation
- payment_analysis
- rejection_analysis
- keywords

## Submission Support Files

- Architecture: [ARCHITECTURE.md](d:\call _center\ARCHITECTURE.md)
- AI tools disclosure: [AI_TOOLS_USED.md](d:\call _center\AI_TOOLS_USED.md)
- Deployment notes: [DEPLOYMENT_REQUIREMENTS.md](d:\call _center\DEPLOYMENT_REQUIREMENTS.md)
- Submission checklist: [SUBMISSION_CHECKLIST.md](d:\call _center\SUBMISSION_CHECKLIST.md)
- Submission form template: [SUBMISSION_FORM_TEMPLATE.md](d:\call _center\SUBMISSION_FORM_TEMPLATE.md)
- Scoring alignment: [SCORING_ALIGNMENT.md](d:\call _center\SCORING_ALIGNMENT.md)
- Presentation outline: [PRESENTATION_DECK.md](d:\call _center\PRESENTATION_DECK.md)
- Demo script: [DEMO_SCRIPT.md](d:\call _center\DEMO_SCRIPT.md)

## Known Limitations

- Local CPU mode is slower than a deployed server or GPU-backed setup
- `tiny` Whisper configuration is optimized for faster demo runs and may reduce accuracy compared with larger models
- Speaker diarization is still a placeholder
- Local in-process background mode is intended for demo use, not horizontal scaling

## Reviewer Notes

- The recommended UI for submission is `frontend-static/`
- The recommended tester endpoint is `/api/v1/calls/analyze-sync`
- The codebase also includes an async dashboard workflow for richer manual demonstration
