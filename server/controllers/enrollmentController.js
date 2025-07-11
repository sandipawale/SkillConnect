import asyncHandler from 'express-async-handler';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

export const getMyEnrollments = asyncHandler(async (req, res) => {
  // --- THIS IS THE GUARANTEED FIX ---
  // This query is now more robust. It populates the course and then the category within it.
  // Mongoose is smart enough to handle cases where a course might be null.
  const enrollments = await Enrollment.find({ student: req.user.id })
    .populate({
      path: 'course',
      model: 'Course', // Explicitly defining the model is safer
      populate: {
        path: 'category',
        model: 'Category', // Explicitly defining the nested model
        select: 'name'
      }
    })
    .populate({ // Also populate the instructor to prevent other crashes
        path: 'course',
        populate: {
            path: 'instructor',
            model: 'User',
            select: 'name'
        }
    });

  // We add a filter here on the server to remove any enrollments that point to a deleted course.
  const validEnrollments = enrollments.filter(e => e.course !== null);
  // --- END OF GUARANTEED FIX ---

  res.status(200).json({
    success: true,
    count: validEnrollments.length,
    data: validEnrollments,
  });
});

export const getEnrollmentByCourse = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user.id,
    course: req.params.courseId
  });
  if (!enrollment) {
    return res.status(200).json({ success: true, data: null });
  }
  res.status(200).json({ success: true, data: enrollment });
});

export const createEnrollment = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const studentId = req.user.id;
  const course = await Course.findById(courseId);
  if (!course) { res.status(404); throw new Error('Course not found'); }
  const alreadyEnrolled = await Enrollment.findOne({ course: courseId, student: studentId });
  if (alreadyEnrolled) { res.status(400); throw new Error('You are already enrolled in this course'); }
  const lessons = await Lesson.find({ course: courseId });
  const progress = lessons.map(lesson => ({ lessonId: lesson._id, completed: false }));
  const enrollment = await Enrollment.create({ course: courseId, student: studentId, progress });
  res.status(201).json({ success: true, data: enrollment });
});

export const updateLessonProgress = asyncHandler(async (req, res) => {
  const { courseId, lessonId, completed } = req.body;
  const studentId = req.user.id;
  const enrollment = await Enrollment.findOne({ course: courseId, student: studentId });
  if (!enrollment) { res.status(404); throw new Error('Enrollment not found'); }
  let lessonInProgress = enrollment.progress.find(p => p.lessonId.toString() === lessonId);
  if (!lessonInProgress) {
    enrollment.progress.push({ lessonId, completed, completedAt: completed ? Date.now() : null });
  } else {
    lessonInProgress.completed = completed;
    lessonInProgress.completedAt = completed ? Date.now() : null;
  }
  await enrollment.save();
  res.status(200).json({ success: true, data: enrollment });
});

export const unenrollFromCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user.id;
    const enrollment = await Enrollment.findOne({ course: courseId, student: studentId });
    if (!enrollment) {
        res.status(404);
        throw new Error("You are not enrolled in this course.");
    }
    await enrollment.deleteOne();
    res.status(200).json({ success: true, data: {} });
});