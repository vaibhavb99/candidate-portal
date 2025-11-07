# Candidate Information & Video Submission Portal

A full-stack web application built using **Vite + React (frontend)** and **Node.js + Express + MongoDB (backend)**.  
Candidates can fill a form, upload a resume (PDF ≤5MB), record a short video (≤90s), review, and submit — all data stored securely in MongoDB GridFS.

---

# Tech Stack

- **Frontend:** React 18 + Vite + Bootstrap 5
- **Backend:** Node.js 22 + Express 4 + Multer + Mongoose 8.6.2
- **Database:** MongoDB 6.7.0

---

# Setup & Installation

# Clone repo

```bash
git clone https://github.com/vaibhavb99/candidate-portal.git
cd candidate-portal
```

# Backend setup

cd backend
npm install

Create a .env file in /backend:put following 2 lines in it

PORT=5000
MONGO_URI=mongodb://localhost:27017/canddb

Start backend:
npm run dev

# Frontend Setup

cd ../frontend
npm install
npm install bootstrap

Create .env file in /frontend:
VITE_API_URL=http://localhost:5000/api

Start frontend:
npm run dev

# How It Works

Candidate fills form and uploads PDF resume.

Records a video (via MediaRecorder API).

Reviews info and uploads to server.

Backend validates, stores files in MongoDB GridFS, and saves details in canddb.cands.

# Commands Summary

Start backend cd backend && npm run dev
Start frontend cd frontend && npm run dev
Install deps npm install
Check MongoDB mongodb://localhost:27017/canddb

# Versions

Tool Version
Node.js 22.x
MongoDB 6.7.0
Mongoose 8.6.2
Multer 1.4.5-lts.1
Vite 5.x
React 18.x
