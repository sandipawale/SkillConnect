import express from 'express';
import { createEnrollment, getMyEnrollments, getEnrollmentByCourse, updateLessonProgress, unenrollFromCourse } from '../controllers/enrollmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.route('/').post(createEnrollment);
router.route('/my').get(getMyEnrollments);
router.route('/course/:courseId').get(getEnrollmentByCourse).delete(unenrollFromCourse); // ADD DELETE ROUTE
router.route('/progress').put(updateLessonProgress);

export default router;