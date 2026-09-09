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

### Option 1: Monorepo Single-Service Deployment (Render / Railway) ⭐ *Recommended*

Deploy the entire app (Frontend + Backend) as a single service on **Render** or **Railway**. Express will serve the production-built React application.

1. **Database Setup**: Create a free database on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and copy your connection string (`mongodb+srv://...`).
2. **Push Code**: Push your repository to GitHub / GitLab.
3. **Create Web Service on Render**:
   - Connect your GitHub repo to [Render](https://render.com/).
   - **Environment**: `Node`
   - **Build Command**: `npm run build:all`
   - **Start Command**: `npm start`
4. **Configure Environment Variables in Render Dashboard**:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/personal-command-center`
   - `JWT_SECRET`: `your_secure_32_character_secret_key`
   - `JWT_EXPIRE`: `1h`
5. Click **Deploy**. Render will build the React app, start the Express server, and serve the application live!

---

### Option 2: Decoupled Deployment (Vercel / Netlify + Render)

Deploy the React frontend on **Vercel** or **Netlify**, and the Express API on **Render**.

#### 1. Deploy Backend (Render Web Service)
- Connect repository.
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node src/index.js`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `MONGODB_URI`: `mongodb+srv://...`
  - `JWT_SECRET`: `your_secure_secret_key`
  - `JWT_EXPIRE`: `1h`
  - `CLIENT_URL`: `https://your-frontend-domain.vercel.app`

#### 2. Deploy Frontend (Vercel)
- Import repo on [Vercel](https://vercel.com).
- **Framework Preset**: `Vite`
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://your-backend-api.onrender.com/api`

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
