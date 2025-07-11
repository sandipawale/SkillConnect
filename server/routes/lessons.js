import express from 'express';
import { 
  getLessonsForCourse, 
  addLesson,
  updateLesson,
  deleteLesson
} from '../controllers/lessonController.js';
import { protect, authorize } from '../middleware/auth.js';

const nestedLessonRouter = express.Router({ mergeParams: true });
nestedLessonRouter.use(protect);
nestedLessonRouter
  .route('/')
  .get(getLessonsForCourse)
  .post(authorize('instructor', 'admin'), addLesson);

const singleLessonRouter = express.Router();
singleLessonRouter.use(protect);
singleLessonRouter
  .route('/:id')
  .put(authorize('instructor', 'admin'), updateLesson)
  .delete(authorize('instructor', 'admin'), deleteLesson);

export { nestedLessonRouter, singleLessonRouter };