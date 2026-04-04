# Presentation Deck Outline

Use this if you want to create optional slides for judges.

## Slide 1 - Title

- Project name: AI Call Center Analytics
- Problem: Call Center Compliance
- Your name
- Submission type: Level 2

## Slide 2 - Problem Statement

- Process customer call recordings
- Convert speech to text
- Validate call compliance
- Classify payment intent
- Detect rejection reasons
- Return structured analytics

## Slide 3 - Solution Overview

- Static frontend dashboard for submission
- FastAPI backend
- Background job processing
- Faster-Whisper transcription
- Analytics pipeline for summary, SOP, payment, rejection, keywords

## Slide 4 - Architecture

- frontend-static -> FastAPI -> job record -> background worker -> transcription -> analytics -> report

Mention:

- sync tester endpoint
- async dashboard flow

## Slide 5 - Key Features

- URL upload
- file upload
- batch processing
- status tracking
- retry failed jobs
- full report view
- history and clear-history

## Slide 6 - Technical Decisions

- FastAPI for API structure
- SQLite local mode for lightweight demo
- managed local runtime storage
- faster-whisper for speech-to-text
- modular service-based analytics pipeline

## Slide 7 - Challenges Solved

- Windows local environment setup
- storage path and disk-space issues
- slow local transcription behavior
- tester compatibility with `x-api-key`
- making batch processing visible and trackable

## Slide 8 - Outcome

- project runs locally end-to-end
- tester endpoint is prepared
- submission docs are included
- demo-ready frontend and backend flow

## Slide 9 - AI Tools Used

- OpenAI Codex / ChatGPT-style coding assistance
- any additional tools you personally used

## Slide 10 - Closing

- live URL
- GitHub URL
- demo video URL
