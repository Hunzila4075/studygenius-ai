import { Router } from 'express';
import { updateProfile, updateSettings, deleteAccount } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.put('/profile', authenticate, updateProfile);
router.put('/settings', authenticate, updateSettings);
router.delete('/account', authenticate, deleteAccount);

export default router;
