# Restaurant Management - Server

Basic Express backend scaffold for the Restaurant Management app.

Quick start

1. cd server
2. copy `.env.example` to `.env` and set `MONGO_URI` if you want MongoDB
3. npm install
4. npm run dev

Notes
- If `MONGO_URI` is not set the server will run in in-memory mode (useful for quick testing).
- Endpoints:
  - GET /api/health
  - CRUD /api/orders
