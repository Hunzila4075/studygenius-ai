# StudyGenius AI — AI-Powered Student Study Assistant

**StudyGenius AI** is a production-quality, modern, full-stack web application designed for university and college students to study smarter, learn faster, and achieve higher grades using artificial intelligence.

---

## 🚀 Key Features

* **🤖 AI Tutor**: Interactive ChatGPT-style AI study companion with subject domain selection, conversation history, typing animations, response regeneration, and copy functionality.
* **📄 PDF Summarizer**: Drag-and-drop PDF study material analysis producing concise summaries, key terms, review questions, and quick notes.
* **📝 Smart Notes Manager**: Full CRUD notes manager with tags, favorites, search filtering, and subject categorization.
* **❓ AI Quiz Generator**: Generate customized MCQs by subject, topic, and difficulty (Easy, Medium, Hard) with immediate scoring, detailed explanations, and performance tracking.
* **🎴 AI Flashcards**: Interactive 3D flip card system with status tracking (New, Learning, Mastered) and automated AI generation from topics.
* **📅 Study Planner**: Task manager for organizing study sessions, setting priorities, dates, and durations.
* **📊 Performance Analytics**: Comprehensive analytics dashboard using Chart.js to visualize weekly study hours, quiz scores, and subject progress.
* **🌙 Dark / Light Mode**: Seamless dark and light theme switching with preference persistence.
* **🛡️ Secure Auth & RBAC**: JWT authentication, bcrypt password hashing, input validation, and ownership verification.
* **⚡ Demo Mode Fallback**: Full standalone demo functionality when no AI API key is configured.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React + Vite + TypeScript
- **Styling**: TailwindCSS + Glassmorphism Aesthetics
- **Icons & Charts**: Lucide React + Chart.js
- **Routing & HTTP**: React Router DOM + Axios

### Backend
- **Runtime**: Node.js + Express.js + TypeScript
- **Database**: MongoDB + Mongoose ODM
- **Security**: Helmet, CORS, Express Rate Limit, BcryptJS, JSONWebToken

---

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studygenius
JWT_SECRET=super_secret_jwt_key_studygenius_2026
CLIENT_URL=http://localhost:3000
AI_API_KEY=your_gemini_or_openai_key_here
```

---

## 💻 Installation & Local Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
Backend runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`.

---

## 🌐 Production Build & Deployment

### Build Client
```bash
cd client
npm run build
```

### Build Server
```bash
cd server
npm run build
```

---

## 🔒 Security Best Practices
- Passwords hashed using `bcryptjs` with salt factor 10.
- All MongoDB resource routes enforce strict user ownership checks (`userId` verification).
- Express rate limiting active on `/api` routes (300 req / 15 mins).
- Input sanitization and parameterized Mongoose queries prevent SQL/NoSQL injection.
