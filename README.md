# DevPath

An interactive programming roadmap platform that helps developers track their learning journey across multiple domains.

## Features

- **Curated Roadmaps** — 10 domains (Web Dev, Python, DSA, Mobile, DevOps, Game Dev, Blockchain, UI/UX, and more), each with 6 structured stages
- **Progress Tracking** — Mark stages complete/incomplete; progress persists per user
- **Stage Notes** — Write and auto-save notes for each stage via a debounced textarea
- **Activity Heatmap** — GitHub-style 52-week contribution grid on the dashboard
- **Estimated Time Remaining** — Parsed from roadmap duration fields, shown on cards and badges
- **JWT Authentication** — Register/login with bcrypt-hashed passwords, 7-day token expiry

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7, Axios |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas |
| Auth | JSON Web Tokens (localStorage) |

## Project Structure

```
new1/
├── backend/
│   ├── data/          # Roadmap seed data
│   ├── middleware/    # Auth middleware
│   ├── models/        # Mongoose models (Progress, StageNote)
│   ├── routes/        # API route handlers
│   ├── seed.js        # DB seeder
│   └── server.js
└── frontend/
    └── src/
        ├── api/       # Axios API calls
        ├── components/
        ├── context/   # Auth context
        ├── lib/
        └── pages/     # Home, Dashboard, Roadmaps, RoadmapDetail, Login, Register
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/sxivansx/mini_proj.git
   cd new1
   ```

2. **Backend**

   ```bash
   cd backend
   npm install
   ```

   Create `backend/.env`:

   ```env
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```

   Seed the database:

   ```bash
   npm run seed
   ```

   Start the server:

   ```bash
   npm run dev   # http://localhost:3001
   ```

3. **Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev   # http://localhost:5173
   ```

> **Note:** Port 5000 is reserved by macOS AirPlay — the backend runs on **3001**.

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Roadmaps
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/roadmaps` | List all roadmaps |
| GET | `/api/roadmaps/:id` | Get a single roadmap |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress` | All user progress (includes duration) |
| GET | `/api/progress/:roadmapId` | Progress for a roadmap |
| GET | `/api/progress/activity` | Activity by date (last 365 days) |
| POST | `/api/progress/:roadmapId/:stageId` | Mark stage complete |
| DELETE | `/api/progress/:roadmapId/:stageId` | Mark stage incomplete |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes/:roadmapId` | Get all notes for a roadmap |
| PUT | `/api/notes/:roadmapId/:stageId` | Upsert a note for a stage |
