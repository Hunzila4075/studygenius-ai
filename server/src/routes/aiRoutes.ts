import { Router } from 'express';
import { getAIStatus } from '../services/aiService.js';

const router = Router();

router.get('/status', (req, res) => {
  res.json({ success: true, ...getAIStatus() });
});

export default router;

