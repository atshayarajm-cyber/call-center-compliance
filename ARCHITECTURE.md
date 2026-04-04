# Architecture Overview

## System Goal

The project processes customer call recordings and turns them into structured compliance and payment-intelligence reports.

## High-Level Flow

1. Frontend submits an audio URL, uploaded audio file, or batch of URLs.
2. FastAPI creates a job and stores request metadata in the database.
3. A local background worker picks queued jobs one-by-one.
4. Audio is downloaded or copied into managed runtime storage.
5. Faster-Whisper transcribes the audio.
6. Transcript is cleaned and language is resolved.
7. Analytics modules run:
   - summary generation
   - SOP validation
   - payment classification
   - rejection analysis
   - keyword extraction
   - sentiment scoring
8. Report data is stored and returned through report endpoints.
9. Frontend renders status, report details, history, retry actions, and batch monitoring.

## Main Components

### Frontend

- `frontend-static/index.html`
- `frontend-static/styles.css`
- `frontend-static/app.js`

Responsibilities:

- collect user input
- call backend APIs
- poll job status
- render reports
- manage history and batch tracking

### Backend API

- `backend/app/main.py`
- `backend/app/api/routes/calls.py`
- `backend/app/api/routes/jobs.py`
- `backend/app/api/routes/reports.py`
- `backend/app/api/routes/history.py`
- `backend/app/api/routes/admin.py`

Responsibilities:

- authentication
- request validation
- job creation
- synchronous tester response
- history and report exposure

### Processing Pipeline

- `backend/app/tasks/pipeline.py`

Responsibilities:

- queue jobs in local background mode
- move jobs through queued, processing, completed, failed states
- orchestrate transcription and analytics

### Services

- `backend/app/services/stt_service.py`
- `backend/app/services/audio_downloader.py`
- `backend/app/services/transcript_cleaner.py`
- `backend/app/services/summarizer.py`
- `backend/app/services/sop_validator.py`
- `backend/app/services/payment_classifier.py`
- `backend/app/services/rejection_analyzer.py`
- `backend/app/services/keyword_extractor.py`
- `backend/app/services/sentiment_analyzer.py`

Responsibilities:

- transcription
- transcript cleanup
- analytics extraction
- report content preparation

## Data Model

Primary tables:

- `jobs`
- `calls`
- `transcripts`
- `summaries`
- `analytics`
- `users`

## Runtime Modes

### Local Demo Mode

- SQLite database
- in-process background worker
- managed runtime storage under `backend/runtime_storage`
- no Docker required

### Production-Oriented Path In Repo

The repo still contains a scalable path based on:

- PostgreSQL
- Redis
- Celery

This is useful for deployment beyond the local demo environment.

## API Strategy

### Async Dashboard Endpoint

- `POST /api/v1/calls/analyze`

Used by the frontend dashboard to:

- submit jobs
- poll status
- load final reports separately

### Sync Tester Endpoint

- `POST /api/v1/calls/analyze-sync`

Used for endpoint testing and final evaluation systems that expect one direct JSON response.

## Authentication

Accepted formats:

- `x-api-key`
- `Authorization: Bearer <key>`

## Why This Architecture Fits The Problem

- FastAPI gives clear API structure and strong request validation
- Background jobs avoid blocking the UI during long audio processing
- Managed storage reduces Windows path and disk issues
- Separate analytics services keep the code readable and extensible
- The sync endpoint makes the project compatible with the official tester
