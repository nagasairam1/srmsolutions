# SRMsolutions – Fullstack (Frontend + Backend + DB)

This repo contains:
- `frontend/` – your static website (uses your uploaded `index.html`), plus a small widget to ping the API.
- `backend/` – Express + MongoDB API with a sample `/api/hello` endpoint that writes a name to MongoDB.
- `render.yaml` – Render blueprint to deploy backend (web service) and frontend (static site).

## Local Dev

### Backend
```bash
cd backend
cp .env.example .env
# edit .env to point to your MongoDB (e.g., local or MongoDB Atlas)
npm install
npm start
```
API: http://localhost:3000

### Frontend (serve static files locally)
You can use any static server. Example (Python):
```bash
cd ../frontend
python3 -m http.server 5500
```
Then open http://localhost:5500 and click "Ping API" to test connectivity.
If your API runs on a different host, edit `frontend/config.js` (BACKEND_URL).

## Deploy to Render

1. Push this folder to a Git repo.
2. In Render, choose **Blueprint** and point to this repo so it picks up `render.yaml`.
   - It will create **srm-backend** (Node web service) and **srm-frontend** (Static Site).
   - Set `MONGO_URI` on the backend service (use MongoDB Atlas connection string).
3. After deploy, update `frontend/config.js` so `BACKEND_URL` is your backend URL, commit & redeploy frontend.
4. Visit your static site and click **Ping API**.

## API
- `GET /api/ping` → `{ message: "Hello from SRMsolutions backend!" }`
- `POST /api/hello` body: `{ "name": "Alice" }` → saves to Mongo and returns id

## Notes
- Tighten CORS in `backend/server.js` for production.
- Replace/expand the frontend as needed; we preserved your original `index.html`.
