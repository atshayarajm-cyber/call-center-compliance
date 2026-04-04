# Fastest Publish Guide

This guide gives the shortest route to the links you need for submission.

## Goal

Get these three public links:

- GitHub repository URL
- Live deployed application URL
- Backend tester endpoint URL

## Recommended Path

- GitHub: create a public repository
- Render: deploy the backend and serve the frontend from the same app

With the current codebase, one Render web service can serve:

- the app UI at `/`
- the API at `/api/v1/...`

That means:

- `Live Deployed URL` = same Render URL
- tester endpoint = same Render URL + `/api/v1/calls/analyze-sync`

## Step 1 - Create Local Git Repo

Run from project root:

```powershell
cd "D:\call _center"
git init
git add .
git commit -m "Prepare Call Center Compliance submission"
```

## Step 2 - Create Public GitHub Repo

1. Go to `https://github.com/new`
2. Create a new public repository
3. Copy the repository URL

Then run:

```powershell
cd "D:\call _center"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Your GitHub URL will be:

```text
https://github.com/<your-username>/<repo-name>
```

## Step 3 - Deploy On Render

1. Go to `https://render.com`
2. Sign in with GitHub
3. Click `New +`
4. Choose `Blueprint`
5. Select your GitHub repository
6. Render will detect [render.yaml](d:\call _center\render.yaml)
7. Set these environment values when asked:
   - `API_KEYS=dev-admin-key`
   - `ADMIN_API_KEYS=dev-admin-key`
   - `FRONTEND_URL=https://<your-render-domain>`
8. Deploy

## Step 4 - Final URLs

After deployment:

- Live deployed app URL:
  - `https://<your-render-domain>`
- Tester endpoint:
  - `https://<your-render-domain>/api/v1/calls/analyze-sync`
- GitHub URL:
  - `https://github.com/<your-username>/<repo-name>`

## Step 5 - What To Paste In The Form

- `Live Deployed URL`
  - `https://<your-render-domain>`
- `API Key`
  - `dev-admin-key`
- `GitHub URL`
  - `https://github.com/<your-username>/<repo-name>`
- `Video Demo URL`
  - your public video link

## Step 6 - What To Paste In The Call Compliance Tester

- header name:
  - `x-api-key`
- header value:
  - `dev-admin-key`
- endpoint:
  - `https://<your-render-domain>/api/v1/calls/analyze-sync`
