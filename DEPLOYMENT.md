# StudyGenius AI — Production Deployment Guide

## Overview
**StudyGenius AI** is a production-ready, full-stack educational SaaS platform built with React, Vite, TypeScript, Express, Node.js, and MongoDB.

---

## 1. Prerequisites & Environment Setup

### Required Services
1. **Node.js**: v18.x or v20.x LTS
2. **MongoDB**: MongoDB Atlas cluster or self-hosted MongoDB (v6.0+)
3. **AI API Key**: Google Gemini API key (`AI_API_KEY`)
4. **Payment Gateway (Optional)**: Stripe secret key & webhook secret (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`)

---

## 2. Environment Variables (.env)

Create a `.env` file in `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/studygenius?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_studygenius_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=https://yourdomain.com
AI_API_KEY=AIzaSy...

# Stripe Subscription Setup
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_1P...
STRIPE_PREMIUM_PRICE_ID=price_1P...
```

---

## 3. Production Build Commands

### Frontend Client
```bash
cd client
npm install
npm run build
```
*Output: Production static bundle generated in `client/dist`.*

### Backend Server
```bash
cd server
npm install
npm run build
```
*Output: Compiled JavaScript generated in `server/dist`.*

---

## 4. Production Hosting Options

### Option A: Unified Single-Server Deployment (Render / Railway / VPS)
The Express backend automatically serves the compiled Vite static assets from `client/dist`:

```bash
cd server
npm start
```
- Access at `http://localhost:5000` or your custom domain.

### Option B: Decoupled Deployment (Vercel / Netlify + Render / Railway)
- **Frontend (Vercel/Netlify)**: Set root directory to `client`, build command `npm run build`, output dir `dist`. Set `VITE_API_URL=https://api.yourdomain.com`.
- **Backend (Render/Railway/Fly.io)**: Set root directory to `server`, build command `npm run build`, start command `node dist/server.js`. Set `CLIENT_URL=https://yourdomain.com`.

---

## 5. Security Checklist
- ✅ CORS origin restricted to `CLIENT_URL`
- ✅ Express Rate Limiting enabled (300 requests / 15 min)
- ✅ Helmet HTTP security headers enabled
- ✅ Passwords hashed with bcrypt (salt rounds = 10)
- ✅ Sensitive tokens & keys stored strictly in `.env`
