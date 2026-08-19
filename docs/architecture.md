# LeadFlow AI Architecture Overview

LeadFlow AI is a production-quality, multi-tenant AI-powered SaaS CRM / Lead Management platform.

## Architecture Layers

```
Frontend (Next.js App Router, React, Tailwind CSS, TanStack React Query, Axios)
  ↓ HTTP-Only Cookie Auth / REST API
Backend (Node.js, Express, Zod, JWT, bcryptjs, Helmet, CORS)
  ↓ Prisma 7.x ORM (@prisma/adapter-pg)
Database (Supabase PostgreSQL Multi-Tenant Schema)
  ↓ AI Service Integration
OpenAI API (GPT-4o-mini lead scoring & executive analysis)
```

## Core Modules

### 1. Multi-Tenant Architecture
- Every data resource (User, Lead) belongs to an `Organization`.
- Multi-tenancy is strictly enforced at the service layer using `organizationId` matching from the authenticated user's session token.
- No organization can access another organization's leads or analytics.

### 2. Authentication & Authorization
- Authentication uses JWTs stored in secure HTTP-only cookies (`leadflow_token`).
- Role-based authorization supports `ADMIN` and `MEMBER` roles.
- Passwords are encrypted using `bcryptjs` with salt rounds = 10.

### 3. AI Lead Intelligence Service
- Located in `backend/src/services/ai.service.js`.
- Evaluates lead attributes (company, job title, source, status, notes) via OpenAI API.
- Generates numeric lead score (0-100), executive summary, priority level (`LOW`, `MEDIUM`, `HIGH`), recommended next steps, and detailed reasoning.
- Controlled fallback handles missing API keys or OpenAI API downtime without crashing the server.

### 4. Bulk CSV Import Processor
- Located in `backend/src/services/csv.service.js`.
- Streams and parses CSV files using `csv-parse`.
- Performs duplicate check per organization and logs import metrics (`totalRows`, `imported`, `duplicates`, `invalid`).

### 5. Server State Management
- TanStack React Query manages client-side caching, loading states, background refetching, and query invalidation across lead CRUD and CSV import workflows.
