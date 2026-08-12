import { Router } from 'express';
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../controllers/subjectController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.get('/', getSubjects);
router.post('/', createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;
