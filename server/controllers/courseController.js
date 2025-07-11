import asyncHandler from 'express-async-handler';
import Course from '../models/Course.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({}).populate('category').populate({
    path: 'instructor',
    select: 'name email'
  });
  
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('category').populate({
    path: 'instructor',
    select: 'name'
  });

  if (!course) {
    res.status(404);
    throw new Error(`Course not found with id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor or Admin
export const createCourse = asyncHandler(async (req, res) => {
  req.body.instructor = req.user.id;
  const course = await Course.create(req.body);
  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor or Admin
export const updateCourse = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error(`Course not found with id of ${req.params.id}`);
  }

  // Make sure user is the course owner or an admin
  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this course');
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor or Admin
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error(`Course not found with id of ${req.params.id}`);
  }

  // Make sure user is the course owner or an admin
  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this course');
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});