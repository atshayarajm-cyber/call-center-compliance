# Scoring Alignment Guide

This file maps the project to the judging rubric so you can present it clearly.

## 1. Code Quality & Structure - 25 Points

What helps this project score well:

- backend routes are separated by responsibility
- analytics logic is split into focused services
- schemas, models, routes, and processing tasks are separated cleanly
- frontend-static is organized around a small clear file set
- submission support docs are included

Show reviewers:

- `backend/app/api/routes/`
- `backend/app/services/`
- `backend/app/tasks/pipeline.py`
- `frontend-static/`
- `README_SUBMISSION.md`

Honest note:

- meaningful commit history cannot be fabricated after the fact. If your repository history is currently weak, focus on clean final structure, readable files, and clear documentation.

## 2. Features & Functionality - 30 Points

Features implemented:

- single audio URL analysis
- audio file upload
- batch URL processing
- asynchronous job tracking
- synchronous tester endpoint
- summary generation
- SOP validation
- payment categorisation
- rejection analysis
- keyword extraction
- history
- retry failed jobs
- admin SOP template view

Best way to show this in demo:

1. submit one fresh job
2. show job status progress
3. open completed report
4. show history
5. show batch submission

## 3. Technical Implementation - 25 Points

Strong points:

- FastAPI backend with structured routes and schemas
- background job processing flow
- managed runtime storage for audio and models
- tester-compatible sync endpoint
- faster-whisper transcription pipeline
- analytics services layered on top of transcription output

Explain this simply:

- one endpoint supports async dashboard use
- one endpoint supports final tester use
- the backend stores job state and report data cleanly

## 4. User Experience & Design - 20 Points

Strengths to call out:

- polished dark visual system
- clear navigation between upload, status, report, history, and SOP
- responsive card-based layout
- progress and status cues
- clear report presentation
- batch monitor and clear-history actions

What to show quickly:

- upload screen
- status progress
- report layout
- history controls

## Final Presentation Advice

To maximize scoring:

- use one clean fresh audio example in the live demo
- keep the deployed app online and stable
- use the correct public tester endpoint
- disclose AI tools clearly
- avoid showing old failed jobs from earlier debugging
