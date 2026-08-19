# LeadFlow AI Deployment Guide

## Prerequisites
- Node.js v18+
- Supabase PostgreSQL Database URL
- OpenAI API Key (optional for AI lead scoring)

## Local Development (Without Docker)

### Backend Setup
1. Change directory to `backend`
2. Create `.env` file:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL="YOUR_SUPABASE_POSTGRES_CONNECTION_STRING"
   JWT_SECRET="YOUR_LONG_RANDOM_SECRET_KEY"
   FRONTEND_URL="http://localhost:3000"
   COOKIE_NAME="leadflow_token"
   OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
   ```
3. Sync Prisma schema with database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
4. Start backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Change directory to `frontend`
2. Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```
3. Start frontend dev server:
   ```bash
   npm run dev
   ```

## Production Docker Deployment

Production containers can be launched using Docker Compose:
```bash
docker-compose up -d --build
```
- Frontend container runs Next.js on port 3000.
- Backend container runs Express on port 5000.
