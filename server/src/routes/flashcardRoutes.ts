import { Router } from 'express';
import {
  getFlashcards,
  createFlashcard,
  generateAIFlashcards,
  toggleLearned,
  toggleReview,
  deleteFlashcard,
  updateFlashcardStatus,
} from '../controllers/flashcardController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.get('/', getFlashcards);
router.post('/', createFlashcard);
router.post('/generate', generateAIFlashcards);
router.patch('/:id/status', updateFlashcardStatus);
router.patch('/:id/learned', toggleLearned);
router.patch('/:id/review', toggleReview);
router.delete('/:id', deleteFlashcard);

export default router;
