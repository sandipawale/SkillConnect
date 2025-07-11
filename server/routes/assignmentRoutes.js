import express from 'express';
import {
  createOrUpdateAssignment,
  getAssignmentForLesson,
  getSubmissionsForAssignment,
  gradeSubmission,
  submitAssignment,
  getMySubmission,
  getAssignmentById // Import the new function
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// --- Instructor & Admin Routes ---
router.route('/').post(protect, authorize('instructor', 'admin'), createOrUpdateAssignment);
router.route('/lesson/:lessonId').get(protect, getAssignmentForLesson);
router.route('/:assignmentId/submissions').get(protect, authorize('instructor', 'admin'), getSubmissionsForAssignment);
router.route('/submissions/:submissionId/grade').put(protect, authorize('instructor', 'admin'), gradeSubmission);

// --- Student Routes ---
router.route('/submit').post(protect, submitAssignment);
router.route('/:assignmentId/mysubmission').get(protect, getMySubmission);

// --- New Route for getting assignment by its own ID ---
router.route('/:id').get(protect, getAssignmentById);

export default router;