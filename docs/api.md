# LeadFlow AI REST API Documentation

Base URL: `http://localhost:5000/api/v1`
Interactive Swagger Docs: `http://localhost:5000/api-docs`

## Authentication Endpoints

### 1. Register Organization & Admin
`POST /auth/register`
- **Request Body**:
  ```json
  {
    "organizationName": "Acme Corp",
    "name": "John Doe",
    "email": "john@acme.com",
    "password": "securepassword123"
  }
  ```
- **Response**: Sets `leadflow_token` HTTP-only cookie & returns user profile.

### 2. Login
`POST /auth/login`
- **Request Body**:
  ```json
  {
    "email": "john@acme.com",
    "password": "securepassword123"
  }
  ```

### 3. Logout
`POST /auth/logout`
- Clears HTTP-only cookie.

### 4. Current User Profile
`GET /auth/me`

---

## Lead Endpoints

### 1. List Leads (Paginated & Scoped)
`GET /leads?page=1&limit=20&search=rahul&status=QUALIFIED&source=CSV`

### 2. Create Lead
`POST /leads`
- **Request Body**:
  ```json
  {
    "firstName": "Rahul",
    "lastName": "Sharma",
    "email": "rahul@tech.com",
    "company": "Tech Corp",
    "jobTitle": "CTO",
    "source": "MANUAL",
    "status": "NEW"
  }
  ```

### 3. Get Lead Details
`GET /leads/:id`

### 4. Update Lead
`PATCH /leads/:id`

### 5. Delete Lead
`DELETE /leads/:id`

---

## AI Analysis & Activities

### 1. Analyze Lead with AI
`POST /leads/:id/analyze`
- Returns AI score (0-100), summary, priority, recommended action, reasoning.

### 2. Log Activity
`POST /leads/:id/activities`
- **Request Body**:
  ```json
  {
    "type": "NOTE",
    "description": "Followed up over phone."
  }
  ```

---

## CSV Import & Dashboard

### 1. Bulk CSV Import
`POST /leads/import`
- Multipart form-data with `file` field.

### 2. Dashboard Analytical Summary
`GET /dashboard/summary`
