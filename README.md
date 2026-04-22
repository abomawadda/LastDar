# Dar Alquran System

Monorepo for managing Quran school operations (students, guardians, attendance, memorization, and finance).

## Tech Stack
- Frontend: React + Vite + Tailwind
- Backend: Express (Node.js)
- Data/Auth: Firebase

## Project Structure
- `apps/web`: web dashboard application
- `apps/server`: backend API service
- `packages/shared`: shared package placeholder
- `firebase`: Firebase rules and config

## Quick Start
1. Install dependencies:
   - `npm install`
2. Create `.env` from `.env.example` and fill Firebase values.
3. Run backend:
   - `npm run dev:server`
4. Run frontend:
   - `npm run dev:web`

## Local URLs
- Frontend: `http://localhost:5173`
- API health: `http://localhost:4000/api/health`

## Quality Commands
- Lint: `npm run lint`
- Tests: `npm run test`
- Build web: `npm run build:web`

## Current Notes
- Several feature modules are still scaffolds and need implementation.
- Firebase config must be supplied via environment variables.

