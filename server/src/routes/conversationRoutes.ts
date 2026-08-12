import { Router } from 'express';
import {
  getConversations,
  createConversation,
  sendMessage,
  saveResponseToNotes,
  clearConversation,
  deleteConversation,
} from '../controllers/conversationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.get('/', getConversations);
router.post('/', createConversation);
router.post('/message', sendMessage);
router.post('/save-note', saveResponseToNotes);
router.delete('/:id/clear', clearConversation);
router.delete('/:id', deleteConversation);

export default router;
