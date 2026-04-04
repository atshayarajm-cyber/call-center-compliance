# AI Call Center Analytics

> Submission note: for the clean judge-facing project summary, start with [README_SUBMISSION.md](d:\call _center\README_SUBMISSION.md). This `README.md` still contains older setup notes below, but the submission package files are the authoritative references.

## Submission Ready Summary

This repository is being submitted for the **Call Center Compliance** problem.

Use this repo for:

- audio input processing
- speech-to-text
- summary generation
- SOP validation
- payment categorisation
- rejection analysis
- keyword extraction

### Important Submission Notes

- The current recommended demo and submission frontend is `frontend-static/`
- The current recommended backend is `backend/`
- The **tester-facing endpoint** is:
  - `POST /api/v1/calls/analyze-sync`
- The backend accepts both:
  - `Authorization: Bearer <API_KEY>`
  - `x-api-key: <API_KEY>`
- The default local API key is:
  - `dev-admin-key`

### Correct Tester URL

For the Call Compliance endpoint tester, submit your **public backend** endpoint in this format:

```text
https://your-public-backend-domain/api/v1/calls/analyze-sync
```

Do not submit:

- the frontend URL
- `localhost`
- the async endpoint if the tester expects one final JSON response

### Local Run Commands

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

- `http://localhost:5500`

Frontend settings:

- API Base URL: `http://localhost:8000`
- API Key: `dev-admin-key`

### Main API Endpoints

- `POST /api/v1/calls/analyze`
- `POST /api/v1/calls/analyze-sync`
- `POST /api/v1/calls/analyze-batch`
- `GET /api/v1/jobs/{job_id}`
- `POST /api/v1/jobs/{job_id}/retry`
- `GET /api/v1/reports/{job_id}`
- `GET /api/v1/history`
- `DELETE /api/v1/history`
- `GET /api/v1/admin/sop-template`

### AI Tools Used

This repository was developed with AI assistance.

Documented AI tools used:

- OpenAI Codex / ChatGPT-style coding assistance for implementation, debugging, refactoring, and documentation

Before final submission, add any other AI tools you personally used.

### Known Local Limitations

- Local CPU transcription is slower than a deployed server or GPU machine
- `tiny` Whisper mode is configured for faster local runs, with some accuracy tradeoff
- Explicit `language_hint=hi` or `language_hint=ta` is faster than `auto`
- Speaker diarization is still a placeholder

### Recommended Demo Flow

1. Show the frontend running on `http://localhost:5500`
2. Show the API base and API key fields
3. Submit one sample audio URL
4. Show job status updates
5. Open the report
6. Show transcript, summary, SOP, payment, rejection, and keywords
7. Show history and clear-history
8. Mention the tester endpoint `/api/v1/calls/analyze-sync`

### Submission Checklist

See `SUBMISSION_CHECKLIST.md` for the exact Level 2 submission items.

Production-oriented full stack call center analytics platform with:

- `frontend/`: Next.js App Router, Tailwind CSS, Framer Motion, Recharts, dark/light theme, upload flow, job status, reports, history, admin SOP view, API key management
- `frontend-static/`: Vanilla HTML, CSS, and JavaScript frontend connected directly to the FastAPI backend
- `backend/`: FastAPI, Celery, Redis, PostgreSQL, SQLAlchemy, faster-whisper transcription, transcript cleaning, AI summarization, SOP validation, payment classification, rejection analysis, keyword extraction, sentiment scoring
- `docker/`: container definitions for frontend, backend, worker, Redis, and PostgreSQL

## Project Structure

```text
frontend/
frontend-static/
backend/
docker/
.env.example
README.md
```

## Static HTML/CSS/JavaScript Frontend

If you want the plain frontend version instead of Next.js:

1. Start the backend and worker.
2. Open a new terminal:
   - `cd frontend-static`
   - `npm install`
   - `npm run dev`
3. Open `http://localhost:5500`

This version is built with:

- `index.html`
- `styles.css`
- `app.js`

and connects directly to the backend REST API.

## Backend API

- `POST /api/v1/calls/analyze`
- `POST /api/v1/calls/analyze-sync`
- `GET /api/v1/jobs/{job_id}`
- `GET /api/v1/reports/{job_id}`
- `GET /api/v1/history`
- `GET /api/v1/admin/sop-template`

Authentication uses `Authorization: Bearer <API_KEY>`.

The final report payload is:

```json
{
  "job_id": "...",
  "status": "completed",
  "transcript": {
    "raw": "...",
    "cleaned": "..."
  },
  "summary": "...",
  "sop_validation": {
    "score": 0,
    "checks": [
      {
        "name": "greeting",
        "passed": true,
        "evidence": "hello"
      }
    ]
  },
  "payment_analysis": {
    "primary_category": "EMI",
    "counts": {
      "EMI": 1,
      "Full Payment": 0,
      "Partial Payment": 0,
      "Down Payment": 0
    },
    "evidence_phrases": ["emi"]
  },
  "rejection_analysis": {
    "has_rejection": false,
    "primary_reason": null,
    "all_reasons": [],
    "evidence": []
  },
  "keywords": ["keyword"]
}
```

## Call Compliance Endpoint Tester

For the **Call Compliance – API Endpoint Tester**, use this deployed endpoint:

- `POST /api/v1/calls/analyze-sync`

Authentication header:

- `Authorization: Bearer <API_KEY>`
- or `x-api-key: <API_KEY>`

Supported input:

- `audio_url` as `multipart/form-data`
- `audio_file` as `multipart/form-data`
- optional `language_hint` with `hi`, `ta`, or `auto`

Recommended local/test value:

- `language_hint=hi` for the provided sample call, because it is faster than `auto` on CPU.

Use `POST /api/v1/calls/analyze` only when you want the async dashboard flow with separate status/report polling.

## VS Code Run Setup

This repo now includes ready-to-run VS Code workspace files in [tasks.json](d:\call _center\.vscode\tasks.json) and [launch.json](d:\call _center\.vscode\launch.json).

### One-click run in VS Code

1. Open the folder `d:\call _center` in VS Code.
2. Install the recommended extensions when prompted.
3. Run `Terminal -> Run Task -> Run: Full App (VS Code)`.
4. Or open `Run and Debug` and launch `Full Stack: VS Code`.

This starts:

- Docker `postgres` and `redis`
- FastAPI backend on `http://localhost:8000`
- Celery worker
- Next.js frontend on `http://localhost:3000`

### Individual VS Code tasks

- `Setup: Copy .env`
- `Infra: Docker Postgres + Redis`
- `Backend: Create venv`
- `Backend: Install deps`
- `Frontend: Install deps`
- `Run: Backend API`
- `Run: Celery Worker`
- `Run: Frontend`

## Manual Local Development

1. Copy `.env.example` to `.env` and adjust values if needed.
2. Backend:
   - `cd backend`
   - `py -m venv .venv`
   - `.venv\\Scripts\\activate`
   - `pip install -r requirements.txt`
   - `uvicorn app.main:app --reload`
3. Static frontend:
   - `cd frontend-static`
   - `npm install`
   - `npm run dev`

Local demo mode uses:

- SQLite instead of PostgreSQL
- in-process background execution instead of Redis/Celery
- local runtime storage under `backend/runtime_storage`

## Docker

Run from `docker/`:

```bash
docker compose --env-file ../.env.example up --build
```

## Notes

- `faster-whisper` handles long audio and timestamped segment output.
- `SUMMARY_PROVIDER=openai` can be enabled when an OpenAI API key is available; otherwise the app uses a local summarization fallback.
- Speaker separation is represented as a placeholder in analytics data so diarization can be added cleanly later.
- Batch URL input is supported at the upload surface; queued items are reported by the submission endpoint.
- On Windows in VS Code, the Celery task uses `--pool=solo` for compatibility.
