# CourseHive Backend API

A gamified learning platform backend built with Express.js, TypeScript, and Supabase.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase project with database schema (see `see.sql`)
- Gemini API keys

### Installation

```bash
cd backend
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `JWT_SECRET` | Supabase JWT secret (from project settings) |
| `GEMINI_KEYS` | Comma-separated Gemini API keys |
| `STORAGE_BUCKET` | Supabase storage bucket name |
| `FRONTEND_URL` | Frontend URL for CORS |

### Running the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Server runs on `http://localhost:3000`

---

## 📋 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <supabase_access_token>
```

Get the token from Supabase Auth after Google/GitHub login.

---

## 🔐 Auth Module

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "avatar_url": "https://...",
    "field": "engineering",
    "type": "software",
    "xp": 1500,
    "streak": 7
  }
}
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

---

## 👤 Users Module

### Get User Profile

```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "stats": {
      "total_interests": 5,
      "completed_interests": 2,
      "total_courses": 25,
      "completed_courses": 12,
      "total_projects": 3,
      "completed_projects": 1
    }
  }
}
```

### Update Profile

```http
PATCH /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newusername",
  "avatar_url": "https://..."
}
```

### Get Public Profile

```http
GET /api/users/:userId/public
```

---

## 🎯 Onboarding Module

### Get Available Fields

```http
GET /api/onboarding/fields
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "fields": [
      { "id": "engineering", "name": "Engineering", "description": "..." },
      { "id": "business", "name": "Business", "description": "..." },
      { "id": "law", "name": "Law", "description": "..." },
      { "id": "medical", "name": "Medical", "description": "..." }
    ]
  }
}
```

### Get Types for Field

```http
GET /api/onboarding/types?field=engineering
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "types": [
      { "id": "software", "name": "Software Engineering" },
      { "id": "mechanical", "name": "Mechanical Engineering" },
      ...
    ]
  }
}
```

### Complete Onboarding

```http
POST /api/onboarding/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "field": "engineering",
  "type": "software"
}
```

---

## 📜 History Module

### Upload Browsing History

```http
POST /api/history/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <history.csv or history.json>
```

**Supported formats:**

- CSV with columns: `title`, `url`, `visit_time`
- JSON array: `[{ "title": "...", "url": "...", "visit_time": "..." }]`

**Response (202 Accepted - async processing):**

```json
{
  "success": true,
  "data": {
    "history_id": "uuid",
    "status": "processing",
    "message": "History uploaded. Processing interests..."
  }
}
```

### Get Processing Status

```http
GET /api/history/:historyId/status
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "completed",
    "file_name": "history.csv",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

### Get All History

```http
GET /api/history
Authorization: Bearer <token>
```

---

## 💡 Interests Module

### Get All Interests

```http
GET /api/interests
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Machine Learning",
      "description": "...",
      "status": "pending",
      "is_completed": false,
      "progress_pct": 0,
      "rank": 1
    }
  ]
}
```

### Get Single Interest with Courses

```http
GET /api/interests/:id
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "interest": { ... },
    "courses": [
      {
        "id": "uuid",
        "name": "Introduction to ML",
        "description": "...",
        "resource_url": "https://...",
        "node_order": 1,
        "is_completed": false,
        "is_locked": false
      }
    ],
    "project": {
      "id": "uuid",
      "name": "Build a Classifier",
      "difficulty": "medium",
      "is_locked": true
    }
  }
}
```

### Accept Interest (Generates Roadmap)

```http
POST /api/interests/:id/accept
Authorization: Bearer <token>
```

**Response (202 Accepted - async roadmap generation):**

```json
{
  "success": true,
  "data": {
    "interest_id": "uuid",
    "status": "accepted",
    "message": "Generating personalized roadmap..."
  }
}
```

### Reject Interest

```http
POST /api/interests/:id/reject
Authorization: Bearer <token>
```

---

## 📚 Courses Module

### Get All User Courses

```http
GET /api/courses
Authorization: Bearer <token>
```

### Get Single Course

```http
GET /api/courses/:id
Authorization: Bearer <token>
```

### Complete Course

```http
POST /api/courses/:id/complete
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "course": { ... },
    "xp_awarded": 50,
    "next_course": { ... },
    "interest_completed": false,
    "bonus_xp": 0
  }
}
```

**XP Rewards:**

- Course completion: **50 XP**
- All courses in interest: **200 XP bonus**

---

## 🛠️ Projects Module

### Get All Projects

```http
GET /api/projects
Authorization: Bearer <token>
```

### Get Single Project

```http
GET /api/projects/:id
Authorization: Bearer <token>
```

### Submit Project

```http
POST /api/projects/:id/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "submission_url": "https://github.com/user/project",
  "submission_data": {
    "notes": "Optional notes about my implementation",
    "technologies_used": ["Python", "TensorFlow"],
    "live_demo_url": "https://demo.example.com"
  }
}
```

**Response (202 Accepted - async validation):**

```json
{
  "success": true,
  "data": {
    "project": { ... },
    "message": "Project submitted. Validation in progress."
  }
}
```

### Get Validation Result

```http
GET /api/projects/:id/validation
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "project_id": "uuid",
    "name": "Build a Classifier",
    "is_validated": true,
    "is_completed": true,
    "feedback": "Great implementation! ...",
    "xp_awarded": 250
  }
}
```

**XP by Difficulty:**
| Difficulty | XP |
|------------|-----|
| Easy | 100 |
| Medium | 250 |
| Hard | 500 |

---

## 🏆 Leaderboard Module

### Get Global Leaderboard

```http
GET /api/leaderboard?page=1&limit=20
```

**Response:**

```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "rank": 1,
        "user_id": "uuid",
        "username": "toplearner",
        "avatar_url": "...",
        "xp": 5000,
        "streak": 30
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### Get Top Users

```http
GET /api/leaderboard/top?limit=10
```

### Get Streak Leaderboard

```http
GET /api/leaderboard/streaks?page=1&limit=20
```

### Get My Rank

```http
GET /api/leaderboard/me
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "rank": 42,
    "xp": 1500,
    "streak": 7
  }
}
```

---

## 📄 Resume Module

### Upload Resume

```http
POST /api/resume/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

resume: <resume.pdf or resume.txt>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "file_name": "resume.pdf",
    "file_url": "https://...",
    "uploaded_at": "2024-01-15T10:00:00Z"
  }
}
```

### Get Resume Info

```http
GET /api/resume
Authorization: Bearer <token>
```

### Analyze Resume (General)

```http
POST /api/resume/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "job_description": "Optional job description to compare against..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "atsScore": 78,
    "keywordMatch": 65,
    "sections": [
      { "name": "Contact Info", "score": 90, "feedback": "..." },
      { "name": "Experience", "score": 85, "feedback": "..." },
      { "name": "Skills", "score": 70, "feedback": "..." }
    ],
    "strengths": ["Strong technical background", "..."],
    "improvements": ["Add more quantifiable achievements", "..."],
    "suggestions": ["Include relevant keywords", "..."],
    "missingKeywords": ["leadership", "agile", "..."]
  }
}
```

### Get ATS Score for Job

```http
POST /api/resume/ats-score
Authorization: Bearer <token>
Content-Type: application/json

{
  "job_description": "We are looking for a software engineer with 3+ years experience in React, Node.js..."
}
```

### Delete Resume

```http
DELETE /api/resume
Authorization: Bearer <token>
```

---

## 🧪 Testing with Postman

### Setup Collection

1. Create a new Postman Collection named "CourseHive API"
2. Set collection variable `baseUrl` = `http://localhost:3000/api`
3. Set collection variable `token` = your Supabase access token

### Get Supabase Token

After logging in via Supabase Auth (Google/GitHub), get the access token:

```javascript
// In your frontend after Supabase auth
const {
  data: { session },
} = await supabase.auth.getSession();
const token = session?.access_token;
```

Or use the Supabase Dashboard:

1. Go to Authentication > Users
2. Find your user and get their token

### Test Flow

1. **Onboarding:**
   - GET `/onboarding/fields`
   - GET `/onboarding/types?field=engineering`
   - POST `/onboarding/complete` with `{ "field": "engineering", "type": "software" }`

2. **Upload History:**
   - POST `/history/upload` with CSV file
   - GET `/history/:id/status` (poll until `completed`)

3. **Accept Interests:**
   - GET `/interests` (see generated interests)
   - POST `/interests/:id/accept` (starts roadmap generation)
   - GET `/interests/:id` (poll until courses appear)

4. **Complete Courses:**
   - GET `/courses` (see all courses)
   - POST `/courses/:id/complete` (one by one in order)

5. **Submit Project:**
   - POST `/projects/:id/submit` with repo URL
   - GET `/projects/:id/validation` (poll until validated)

6. **Check Progress:**
   - GET `/users/profile` (see stats)
   - GET `/leaderboard/me` (see rank)

---

## 📊 Response Format

All responses follow this format:

### Success

```json
{
  "success": true,
  "data": { ... }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": 400
  }
}
```

### Common HTTP Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | Success                              |
| 201  | Created                              |
| 202  | Accepted (async processing started)  |
| 400  | Bad Request                          |
| 401  | Unauthorized (missing/invalid token) |
| 403  | Forbidden                            |
| 404  | Not Found                            |
| 429  | Rate Limited                         |
| 500  | Server Error                         |

---

## 🔧 Supabase Setup

### Required RPC Functions

Add these functions in Supabase SQL Editor:

```sql
-- Increment user XP
CREATE OR REPLACE FUNCTION increment_xp(user_id UUID, xp_amount INT)
RETURNS void AS $$
BEGIN
  UPDATE users SET xp = xp + xp_amount, updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Update user streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  last_activity DATE;
BEGIN
  SELECT activity_date INTO last_activity
  FROM user_activity_log
  WHERE user_id = p_user_id
  ORDER BY activity_date DESC
  LIMIT 1 OFFSET 1;

  IF last_activity = CURRENT_DATE - 1 THEN
    UPDATE users SET streak = streak + 1, updated_at = NOW()
    WHERE id = p_user_id;
  ELSIF last_activity < CURRENT_DATE - 1 THEN
    UPDATE users SET streak = 1, updated_at = NOW()
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Refresh leaderboard
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW leaderboard;
END;
$$ LANGUAGE plpgsql;
```

### Storage Bucket

1. Go to Supabase Dashboard > Storage
2. Create bucket named `coursehive`
3. Set appropriate policies for authenticated users

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # Supabase client
│   │   ├── env.ts           # Environment validation
│   │   ├── gemini.ts        # Gemini key pool
│   │   └── storage.ts       # Supabase Storage helpers
│   │
│   ├── modules/
│   │   ├── auth/            # Authentication
│   │   ├── users/           # User profiles
│   │   ├── onboarding/      # Field/type selection
│   │   ├── history/         # Browsing history upload
│   │   ├── interests/       # Interest recommendations
│   │   ├── courses/         # Course roadmaps
│   │   ├── projects/        # Project validation
│   │   ├── leaderboard/     # Rankings
│   │   └── resume/          # ATS analysis
│   │
│   ├── middleware/
│   │   ├── auth.guard.ts    # JWT verification
│   │   ├── error-handler.ts # Global error handler
│   │   ├── rate-limiter.ts  # Rate limiting
│   │   ├── file-upload.ts   # Multer config
│   │   └── logger.ts        # Request logging
│   │
│   ├── utils/
│   │   ├── api-response.ts  # Response formatting
│   │   ├── errors.ts        # Custom errors
│   │   ├── xp-calculator.ts # XP logic
│   │   └── streak-tracker.ts
│   │
│   ├── app.ts               # Express setup
│   └── server.ts            # Entry point
│
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - see LICENSE file for details.
