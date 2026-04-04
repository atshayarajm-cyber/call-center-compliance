# Deployment Requirements

This file explains what must be true for submission, without locking you to one hosting platform.

## Required Public URLs

You need:

- a public frontend URL
- a public backend URL
- a public endpoint tester URL

## Required Backend Endpoint

Your public backend must expose:

```text
POST /api/v1/calls/analyze-sync
```

Example:

```text
https://your-public-backend-domain/api/v1/calls/analyze-sync
```

## Required Auth

Your deployment should accept:

- `x-api-key: <API_KEY>`

The backend also supports:

- `Authorization: Bearer <API_KEY>`

## Minimum Deployment Checks

Before submitting, verify:

- `GET /health` returns success
- `POST /api/v1/calls/analyze-sync` works
- `POST /api/v1/calls/analyze` works
- `GET /api/v1/jobs/{job_id}` works
- `GET /api/v1/reports/{job_id}` works
- frontend can talk to the deployed backend

## Environment Variables To Carry Over

At minimum, review these values:

- `API_KEYS`
- `ADMIN_API_KEYS`
- `BACKEND_TASK_MODE`
- `LOCAL_STORAGE_DIR`
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `SUMMARY_PROVIDER`
- `FASTER_WHISPER_MODEL`
- `FASTER_WHISPER_DEVICE`
- `FASTER_WHISPER_COMPUTE_TYPE`
- `FRONTEND_URL`

## Recommended Deployment Behavior

- keep the backend online for at least 48 hours after deadline
- keep the submission API key unchanged during judging
- test with a real public URL before final submission
- avoid changing the endpoint path after submission

## Submission Warning

Do not submit:

- localhost URLs
- the frontend URL in the endpoint tester
- a backend route other than `/api/v1/calls/analyze-sync`
