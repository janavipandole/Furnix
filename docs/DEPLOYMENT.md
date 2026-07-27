# Furnix Deployment & Operations Guide

## Deployment Targets

### 1. Vercel Serverless Deployment
Furnix is configured for Vercel edge deployment using `vercel.json`.

#### Configuration:
- Build command: `npm run build` (if configured) or static file serve.
- Output directory: `./`
- Environment Variables:
  - `PORT`: Server port override (default `5000`).

### 2. Docker & Container Deployment
Run Furnix in isolated containers using Docker:

#### Build Container Image:
```bash
docker build -t furnix-storefront:latest .
```

#### Run Container:
```bash
docker run -d -p 5000:5000 --name furnix-app furnix-storefront:latest
```

#### Docker Compose:
```bash
docker-compose up -d
```

---

## Health Verification
Verify deployment status by running:
```bash
curl -I http://localhost:5000/api/contact
```
Expected response: HTTP 405 (Method Not Allowed) or HTTP 400 for empty POST body, confirming endpoint reactivity.
