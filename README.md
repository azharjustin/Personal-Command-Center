# ⚡ Personal Command Center

> **Focus Today. A Brighter Tomorrow.**  
> A personal productivity dashboard designed to answer the core daily question: *"What should I focus on today?"*

![Personal Command Center Logo](./client/public/logo.png)

---

## 📖 Overview

**Personal Command Center** is a full-stack personal management and productivity web application. It combines tasks, habits, long-term goals, key milestones, and quick notes into a unified, dynamic dashboard.

---

## ✨ Features

- ⚡ **Daily Overview Dashboard**: Time-based greetings, high-priority focus items, and aggregated progress metrics.
- ✅ **Task Management**: Prioritized task organization with status transitions (Todo, In Progress, Completed), category tags, and due dates.
- 🎯 **Goal Tracking**: Multi-stage goal tracking with percentage progress indicators, target dates, and progress updates.
- 🔄 **Habit Building**: Streak counter, daily habit toggles, completion rate analytics, and weekly activity heatmap.
- 📅 **Important Dates**: Proximity urgency alerts (Today, Tomorrow, Upcoming) and milestone tracking.
- 📝 **Notes & Scratchpad**: Instant note creation, tag-based categorization, and fast text searching.
- 📊 **Productivity Analytics**: Weekly completion charts, daily productivity scores, and habit consistency metrics.
- 🔐 **JWT Authentication**: Secure user registration & login powered by 1-hour auto-expiring JWT tokens.
- 🎨 **Modern Visual Design**: Sleek dark mode aesthetics, glassmorphism cards, interactive micro-animations, and Ctrl+K Command Palette.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript (Vite)
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **Icons & UI**: Lucide React, Framer Motion, React Hot Toast
- **Data Visualization**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js + Express
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing
- **Validation & Security**: `express-validator`, `cors`, `dotenv`

---

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed on your machine:

1. **Node.js** (v18.0.0 or higher) — [Download Node.js](https://nodejs.org/)
2. **npm** (v9.0.0 or higher, comes bundled with Node.js)
3. **MongoDB**:
   - **Local MongoDB**: Running on `mongodb://localhost:27017` ([Install MongoDB Community Edition](https://www.mongodb.com/try/download/community)), **OR**
   - **MongoDB Atlas**: A cloud MongoDB connection string ([Create Free Cluster](https://www.mongodb.com/cloud/atlas))

---

## 🚀 Complete Setup Guide

Follow these steps to set up and run Personal Command Center locally.

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/personal-command-center.git
cd "Personal Command Center"
```

### Step 2: Install All Dependencies
Install dependencies for the root, server, and client packages using the built-in helper command:
```bash
npm run install:all
```

*(Alternatively, install them individually)*:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Return to project root
cd ..
```

---

### Step 3: Configure Environment Variables

Create a `.env` configuration file in the `server` directory:

```bash
# Windows PowerShell
Copy-Item .env.example server\.env

# Linux / macOS
cp .env.example server/.env
```

Open `server/.env` and configure your settings:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/personal-command-center
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=1h
```

> 💡 **Note on MongoDB URI**:
> - For local MongoDB, use `mongodb://localhost:27017/personal-command-center`.
> - For MongoDB Atlas, use your cloud connection string: `mongodb+server://<user>:<password>@cluster.mongodb.net/personal-command-center`.

---

### Step 4: Start the Development Server

You can launch both the **Backend API** and **Frontend Vite App** simultaneously from the project root with a single command:

```bash
npm run dev
```

This will run:
- 🟢 **Backend API**: `http://localhost:5001`
- 🔵 **Frontend App**: `http://localhost:5173`

*(To run server or client independently)*:
```bash
# Run backend only
npm run dev:server

# Run frontend only
npm run dev:client
```

---

### Step 5: Access the Application

1. Open your browser and navigate to **`http://localhost:5173`**
2. Click **Register** to create your initial user account.
3. Once logged in, your session token is saved in `localStorage` and will automatically expire in **1 hour (`1h`)** per security requirements.

---

## ⚙️ Environment Variables Reference

| Variable | Location | Default Value | Description |
|---|---|---|---|
| `PORT` | `server/.env` | `5001` | Express server running port |
| `MONGODB_URI` | `server/.env` | `mongodb://localhost:27017/personal-command-center` | MongoDB database connection URI |
| `JWT_SECRET` | `server/.env` | `pcc_dev_secret_key...` | Secret key used to sign JWT authentication tokens |
| `JWT_EXPIRE` | `server/.env` | `1h` | Token expiration duration (1 hour) |
| `VITE_API_URL` | Client proxy / env | `/api` | Base URL path for REST API calls |

---

## 📂 Project Structure

```
Personal Command Center/
├── client/                     # React Frontend (Vite)
│   ├── public/                 # Static assets (logo.png, icons)
│   ├── src/
│   │   ├── components/         # UI Primitives & Layout components
│   │   │   ├── layout/         # AppLayout, Sidebar, TopBar, MobileNav
│   │   │   ├── ui/             # Logo, Button, Input, Modal, Toast
│   │   │   └── command/        # CommandPalette (Ctrl+K)
│   │   ├── pages/              # Dashboard, Tasks, Goals, Habits, Notes, Dates, Analytics, Settings, Login, Register
│   │   ├── services/           # Axios API services (auth, task, goal, habit, etc.)
│   │   ├── stores/             # Zustand state stores (authStore, taskStore, etc.)
│   │   ├── types/              # TypeScript interface definitions
│   │   ├── App.tsx             # Route definitions & checkAuth initialization
│   │   └── main.tsx            # React root entry point
│   ├── package.json
│   └── vite.config.ts          # Vite configuration with API proxy to port 5001
│
├── server/                     # Node.js / Express Backend
│   ├── src/
│   │   ├── config/             # DB connection (db.js)
│   │   ├── controllers/        # Request handlers (auth, tasks, goals, habits, notes, dates)
│   │   ├── middleware/         # JWT auth middleware & errorHandler
│   │   ├── models/             # Mongoose schemas (User, Task, Goal, Habit, Note, ImportantDate)
│   │   ├── routes/             # REST route definitions
│   │   ├── app.js              # Express app setup
│   │   └── index.js            # Node server listener
│   ├── .env                    # Server environment variables
│   └── package.json
│
├── .env.example                # Template for environment variables
├── package.json                # Root package with monorepo concurrency scripts
└── README.md                   # Complete project documentation & setup guide
```

---

## 🌐 API Endpoints Summary

| Module | Method | Endpoint | Description | Auth Required |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Register new user | ❌ |
| **Auth** | `POST` | `/api/auth/login` | Log in user & receive JWT token | ❌ |
| **Auth** | `GET` | `/api/auth/me` | Get current user details | ✅ |
| **Tasks** | `GET`, `POST` | `/api/tasks` | Fetch all tasks / Create task | ✅ |
| **Tasks** | `PUT`, `DELETE` | `/api/tasks/:id` | Update task / Delete task | ✅ |
| **Goals** | `GET`, `POST` | `/api/goals` | Fetch all goals / Create goal | ✅ |
| **Goals** | `PUT`, `DELETE` | `/api/goals/:id` | Update goal / Delete goal | ✅ |
| **Habits**| `GET`, `POST` | `/api/habits` | Fetch all habits / Create habit | ✅ |
| **Habits**| `POST` | `/api/habits/:id/toggle` | Toggle habit completion status | ✅ |
| **Dates** | `GET`, `POST` | `/api/dates` | Fetch / Create important dates | ✅ |
| **Notes** | `GET`, `POST` | `/api/notes` | Fetch / Create quick notes | ✅ |
| **Dashboard** | `GET` | `/api/dashboard` | Fetch aggregated dashboard summary | ✅ |

---

## 🧪 Building for Production

To create an optimized production build of the frontend application:

```bash
npm run build
```

The compiled production assets will be placed in `client/dist`.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
