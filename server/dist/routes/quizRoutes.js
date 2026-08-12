import { Router } from 'express';
import { generateQuiz, submitQuizResults, getQuizHistory } from '../controllers/quizController.js';
import { authenticate } from '../middleware/authMiddleware.js';
const router = Router();
router.use(authenticate);
router.post('/generate', generateQuiz);
router.post('/:id/results', submitQuizResults);
router.get('/history', getQuizHistory);
export default router;
