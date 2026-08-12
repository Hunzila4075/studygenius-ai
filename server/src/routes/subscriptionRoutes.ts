import { Router } from 'express';
import {
  getSubscriptionStatus,
  createCheckoutSession,
  cancelSubscription,
  handleStripeWebhook,
} from '../controllers/subscriptionController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/status', authenticate, getSubscriptionStatus);
router.post('/checkout', authenticate, createCheckoutSession);
router.post('/cancel', authenticate, cancelSubscription);
router.post('/webhook', handleStripeWebhook);

export default router;
