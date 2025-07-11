import express from 'express';
import { 
  getQuizForLesson, 
  getQuizByIdForInstructor, 
  createQuiz, 
  submitQuiz,
  getQuizAttemptById // Import new function
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, authorize('instructor', 'admin'), createQuiz);
router.route('/submit').post(protect, submitQuiz);
router.route('/lesson/:lessonId').get(protect, getQuizForLesson);
router.route('/attempt/:attemptId').get(protect, getQuizAttemptById); // Add new route
router.route('/:id').get(protect, authorize('instructor', 'admin'), getQuizByIdForInstructor);

export default router;