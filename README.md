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
2. **npm** (v9.0.0 or higher)
3. **MongoDB**:
   - **Local MongoDB**: Running on `mongodb://localhost:27017` ([Download Community Edition](https://www.mongodb.com/try/download/community)), **OR**
   - **MongoDB Atlas**: Free cloud MongoDB database cluster ([Create Atlas Cluster](https://www.mongodb.com/cloud/atlas))

---

## 🚀 Complete Setup Guide (Local Development)

Follow these steps to set up and run Personal Command Center locally.

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/personal-command-center.git
cd "Personal Command Center"
```

### Step 2: Install All Dependencies
Install dependencies for the root, server, and client packages:
```bash
npm run install:all
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

---

### Step 4: Start the Development Server

Launch both the **Backend API** and **Frontend Vite App** simultaneously from the project root:

for client:
   ```bash
    cd client 
    npm run dev
   ```
for server:
   ```bash
    cd server 
    npm run dev
   ```

```bash
npm run dev
```

- 🟢 **Backend API**: `http://localhost:5001`
- 🔵 **Frontend App**: `http://localhost:5173`

---

## 🌐 Deployment Guide

You can deploy Personal Command Center using either of the following strategies:

### Option 1: Render Static Site (Client) + Render Web Service (Server) ⚡ *Fastest & Global CDN Accelerated*

Deploy the React frontend on Render's **Static Site** (served via global CDN, 100% free, never sleeps) and the Express backend on Render's **Web Service**.

#### Step 1: Database Setup (MongoDB Atlas)
1. Sign up on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Cluster** (select region e.g. `us-east-1` or `eu-central-1`).
3. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
4. Create a Database User and copy your connection string (`mongodb+srv://user:pass@cluster0.mongodb.net/personal-command-center`).

#### Step 2: Deploy Backend API (Render Web Service)
1. Sign in to [Render](https://render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
4. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
   - `JWT_SECRET`: *Your secure random 32+ character key*
   - `JWT_EXPIRE`: `1h`
5. Click **Create Web Service** and copy your backend URL (e.g. `https://pcc-api.onrender.com`).

#### Step 3: Deploy Frontend (Render Static Site)
1. On Render, click **New +** -> **Static Site**.
2. Connect the same GitHub repository.
3. Settings:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: `https://pcc-api.onrender.com/api` *(Your backend URL + /api)*
5. Click **Create Static Site**. Copy your live frontend URL (e.g. `https://personal-command-center.onrender.com`).

#### Step 4: Configure CORS on Backend
1. Return to your Render **Web Service** (`pcc-api`) -> **Environment**.
2. Add/update variable:
   - `CLIENT_URL`: `https://personal-command-center.onrender.com` *(Your live frontend URL)*

---

### Option 2: Monorepo Single Web Service Deployment (Render)

Deploy both client and server together in 1 Web Service:

- **Root Directory**: *(Leave empty)*
- **Build Command**: `npm run build:all`
- **Start Command**: `npm start`
- **Environment Variables**: `NODE_ENV=production`, `MONGODB_URI=...`, `JWT_SECRET=...`, `JWT_EXPIRE=1h`

---

## ⚙️ Environment Variables Reference

| Variable | Location | Default Value | Description |
|---|---|---|---|
| `PORT` | `server/.env` | `5001` | Express server running port |
| `NODE_ENV` | Environment | `development` / `production` | Environment mode |
| `MONGODB_URI` | `server/.env` | `mongodb://localhost:27017/...` | MongoDB connection URI |
| `JWT_SECRET` | `server/.env` | `pcc_dev_secret_key...` | Secret key used to sign JWT tokens |
| `JWT_EXPIRE` | `server/.env` | `1h` | Token expiration duration (1 hour) |
| `CLIENT_URL` | `server/.env` | `http://localhost:5173` | Allowed CORS origin for production |

---

## 📂 Project Structure

```
Personal Command Center/
├── client/                     # React Frontend (Vite)
│   ├── public/                 # Static assets (logo.png)
│   ├── src/
│   │   ├── components/         # Layout & UI components
│   │   ├── pages/              # App pages (Dashboard, Tasks, Goals, Habits, Notes, Dates, Analytics)
│   │   ├── services/           # Axios API services
│   │   ├── stores/             # Zustand state stores
│   │   └── App.tsx             # Main App entry with route definitions
│   └── vite.config.ts
│
├── server/                     # Express Backend
│   ├── src/
│   │   ├── controllers/        # Request controllers
│   │   ├── middleware/         # Auth & error handling
│   │   ├── models/             # Mongoose schemas
│   │   └── app.js              # Express app & static production serving
│   └── .env
│
├── package.json                # Monorepo scripts (dev, build:all, start)
└── README.md                   # Full documentation & deployment guide
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
