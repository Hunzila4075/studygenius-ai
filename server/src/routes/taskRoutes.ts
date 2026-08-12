import { Router } from 'express';
import { getTasks, createTask, updateTask, toggleTaskComplete, deleteTask } from '../controllers/taskController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/complete', toggleTaskComplete);
router.delete('/:id', deleteTask);

export default router;
