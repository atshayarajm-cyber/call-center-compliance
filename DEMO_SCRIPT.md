# Demo Script

Use this as a simple 2-5 minute narration guide for the Level 2 submission video.

## 1. Intro

Say:

`This is my Call Center Compliance submission. The system accepts an audio URL or uploaded audio file, transcribes the call, generates a summary, validates SOP compliance, classifies payment intent, detects rejection reasons, and returns a structured report.`

## 2. Show the App

Open the deployed frontend.

Show:

- API Base URL field
- API key field
- Upload section
- Job Status section
- Report section
- History section

Say:

`The frontend dashboard is connected to the FastAPI backend and lets me submit jobs, track processing, open reports, and review history.`

## 3. Submit a Sample Audio

Use the sample call URL or upload a file.

Say:

`I will submit a sample audio call now.`

Then click:

- `Submit Job`

## 4. Show Status Tracking

Open Job Status.

Show:

- progress bar
- current stage
- retry count
- health indicator

Say:

`The backend processes the call asynchronously and the frontend tracks the live status until the report is ready.`

## 5. Show Completed Report

Open the report.

Show:

- summary
- transcript
- SOP score
- payment analysis
- rejection analysis
- keywords

Say:

`This report includes the raw and cleaned transcript, the AI-generated summary, SOP validation results, payment categorisation, rejection analysis, and extracted keywords.`

## 6. Show History

Open History.

Show:

- completed jobs
- track/open report buttons
- clear history

Say:

`The dashboard also stores recent jobs so I can reopen reports or clear the saved history.`

## 7. Mention Tester Endpoint

Say:

`For the Call Compliance endpoint tester, I expose a synchronous endpoint that accepts the tester request and returns the final compliance JSON response directly.`

Show or mention:

- `POST /api/v1/calls/analyze-sync`
- `x-api-key`

## 8. Close

Say:

`This project is available as a live deployment, with a public GitHub repository and documented setup, architecture, AI tools used, and known limitations in the README.`
