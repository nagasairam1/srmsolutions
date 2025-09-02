# SRMsolutions Backend (Node.js + Express + MongoDB)

Production-ready backend for SRMsolutions with authentication, contact form, and newsletter.

## Quick Start

```bash
git clone <your-repo> srmsolutions-backend
cd srmsolutions-backend
cp .env.example .env
npm install
npm run dev
```

- Health Check: `GET http://localhost:5000/api/health`
- Auth:
  - `POST /api/auth/login`
  - `POST /api/auth/register` (requires admin/management token)
  - `GET /api/auth/profile` (auth)
  - `PUT /api/auth/profile` (auth)
- Contact:
  - `POST /api/contact`
  - `GET /api/contact` (auth)
  - `PUT /api/contact/:id` (auth)
- Newsletter:
  - `POST /api/newsletter/subscribe`
  - `POST /api/newsletter/unsubscribe`
  - `GET /api/newsletter/subscribers` (auth)
  - `POST /api/newsletter/send` (auth)

## Notes
- Use Gmail App Password or SMTP credentials.
- Never commit the real `.env`.
- Ensure `FRONTEND_URL` matches your site for CORS.
