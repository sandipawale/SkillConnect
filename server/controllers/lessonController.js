import asyncHandler from 'express-async-handler';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';

export const getLessonsForCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) { res.status(404); throw new Error('Course not found'); }
  const lessons = await Lesson.find({ course: req.params.courseId });
  res.status(200).json({ success: true, count: lessons.length, data: lessons });
});

export const addLesson = asyncHandler(async (req, res) => {
  req.body.course = req.params.courseId;
  const course = await Course.findById(req.params.courseId);
  if (!course) { res.status(404); throw new Error('Course not found'); }
  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401); throw new Error('Not authorized to add a lesson to this course');
  }
  // The 'slides' array will be accepted from req.body if it exists
  const lesson = await Lesson.create(req.body);
  res.status(201).json({ success: true, data: lesson });
});

export const updateLesson = asyncHandler(async (req, res) => {
  let lesson = await Lesson.findById(req.params.id);
  if (!lesson) { res.status(404); throw new Error('Lesson not found'); }
  const course = await Course.findById(lesson.course);
  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401); throw new Error('User not authorized to update this lesson');
  }
  // The 'slides' array will be updated from req.body if it exists
  lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: lesson });
});

export const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) { res.status(404); throw new Error('Lesson not found'); }
  const course = await Course.findById(lesson.course);
  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401); throw new Error('User not authorized to delete this lesson');
  }
  await lesson.deleteOne();
  res.status(200).json({ success: true, data: {} });
});