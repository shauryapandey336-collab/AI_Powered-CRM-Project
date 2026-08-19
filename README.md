# LeadFlow AI - Production AI-Powered SaaS CRM / Lead Management Platform

LeadFlow AI is a modern, enterprise-grade AI-powered Lead Management and SaaS CRM platform built with JavaScript (Node.js, Express, Next.js, Prisma, PostgreSQL on Supabase, OpenAI, TanStack React Query, and Tailwind CSS).

---

## 🌟 Key Features

- **Multi-Tenant SaaS Architecture**: Strict organization-level data isolation.
- **Authentication & Security**: JWT stored in HTTP-only cookies, bcrypt password hashing, CORS, Helmet, rate limiting.
- **AI-Powered Lead Scoring & Analysis**: OpenAI (GPT-4o-mini) evaluates lead metadata to generate 0-100 quality scores, priority rankings, executive summaries, and recommended next steps.
- **Bulk CSV Import Processor**: Validates, parses, and imports batch leads while automatically deduplicating existing emails per organization.
- **Interactive Analytics Dashboard**: Conversion funnel tracking, status breakdown charts, lead source distribution, and recent lead feeds using Recharts.
- **Comprehensive Lead CRM CRUD**: Search, filter by status & source, pagination, activity timeline logging (NOTE, CALL, EMAIL, STATUS_CHANGE, AI_ANALYSIS).
- **OpenAPI / Swagger Documentation**: Interactive API testing available at `/api-docs`.

---

## 🏗 Project Architecture

```text
Lead-Ai/
├── backend/
│   ├── src/
│   │   ├── config/ (env.js, database.js, swagger.js)
│   │   ├── controllers/ (auth, lead, dashboard, ai)
│   │   ├── middleware/ (auth, error, validation)
│   │   ├── routes/ (auth, lead, dashboard, ai)
│   │   ├── services/ (auth, lead, csv, ai)
│   │   ├── validators/ (auth, lead)
│   │   ├── utils/ (apiResponse, asyncHandler, pagination)
│   │   ├── app.js
│   │   └── server.js
│   ├── generated/prisma/ (Prisma 7.9.1 Client)
│   ├── prisma/schema.prisma
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma.config.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/ (login, register)
│   │   │   ├── (dashboard)/ (dashboard, leads, leads/[id], leads/import)
│   │   │   ├── layout.js
│   │   │   └── page.js
│   │   ├── components/ (layout, ui, forms, tables, charts, leads, common)
│   │   ├── hooks/ (useAuth)
│   │   ├── lib/ (utils)
│   │   └── services/ (api, auth, lead, dashboard, ai)
│   ├── Dockerfile
│   ├── package.json
│   └── jsconfig.json
│
├── docs/ (architecture.md, api.md, deployment.md)
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Local Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Ensure `backend/.env` contains your Supabase PostgreSQL connection string:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://postgres.xxx:xxx@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="your_secure_jwt_secret_key"
FRONTEND_URL="http://localhost:3000"
COOKIE_NAME="leadflow_token"
OPENAI_API_KEY="sk-proj-..."
```

Sync database schema & generate Prisma client:
```bash
npx prisma db push
npx prisma generate
```

Start backend development server:
```bash
npm run dev
```
- API Base URL: `http://localhost:5000/api/v1`
- Swagger Docs: `http://localhost:5000/api-docs`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Ensure `frontend/.env.local` contains:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Start Next.js development server:
```bash
npm run dev
```
- Frontend UI: `http://localhost:3000`

---

## 🔒 Security Highlights

- **Multi-Tenancy**: All backend database queries filter on `req.organizationId` derived directly from the authenticated JWT token.
- **HTTP-Only Cookies**: JWT tokens are stored safely in HTTP-Only cookies to protect against XSS attacks.
- **Validation**: Every incoming request payload is validated using Zod schemas.
- **Secrets Protection**: Credentials and API keys are strictly kept server-side in `.env` files.
