import { Router } from 'express';
import { getAnalyticsData } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.get('/', getAnalyticsData);

export default router;
