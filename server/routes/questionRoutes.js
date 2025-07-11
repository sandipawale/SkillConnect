import express from 'express';
import { addQuestion, updateQuestion, deleteQuestion } from '../controllers/questionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('instructor', 'admin'));

router.route('/').post(addQuestion);
router.route('/:id').put(updateQuestion).delete(deleteQuestion);

export default router;