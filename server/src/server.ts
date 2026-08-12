import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import summarizerRoutes from './routes/summarizerRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// __dirname is not available directly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security & Middleware
app.use(helmet());

const allowedOrigin = process.env.CLIENT_URL || 'http://aistudent.kesug.com';
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const origins = [allowedOrigin, 'http://aistudent.kesug.com', 'http://localhost:3000', 'http://localhost:5173'];
      if (origins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint (Independent of Auth and DB)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'StudyGenius AI server is healthy',
  });
});

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});

app.use('/api', limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/summarizer', summarizerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Serve frontend client in production / unified hosting
const clientBuildPath = path.resolve(__dirname, '../../client/dist');

app.use(express.static(clientBuildPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }

  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Connect DB and launch server
connectDB()
  .then(() => {
    
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'StudyGenius API is running successfully!' });
});

app.listen(PORT, '0.0.0.0', () => {
      console.log(`ðŸš€ StudyGenius AI Backend Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('âŒ Failed to start server:', error);
    process.exit(1);
  });


