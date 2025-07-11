import asyncHandler from 'express-async-handler';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';

export const createOrUpdateAssignment = asyncHandler(async (req, res) => {
  const { lessonId, title, instructions, dueDate } = req.body;
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) { res.status(404); throw new Error('Lesson not found'); }
  const course = await Course.findById(lesson.course);
  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401); throw new Error('Not authorized to manage this lesson');
  }
  let assignment = await Assignment.findOne({ lesson: lessonId });
  if (assignment) {
    assignment.title = title || assignment.title;
    assignment.instructions = instructions || assignment.instructions;
    assignment.dueDate = dueDate || assignment.dueDate;
    const updatedAssignment = await assignment.save();
    res.status(200).json({ success: true, data: updatedAssignment });
  } else {
    const newAssignment = await Assignment.create({ lesson: lessonId, title, instructions, dueDate });
    res.status(201).json({ success: true, data: newAssignment });
  }
});

export const getAssignmentForLesson = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findOne({ lesson: req.params.lessonId });
  if (!assignment) {
    return res.status(200).json({ success: true, data: null });
  }
  res.status(200).json({ success: true, data: assignment });
});

export const getSubmissionsForAssignment = asyncHandler(async (req, res) => {
  const submissions = await AssignmentSubmission.find({ assignment: req.params.assignmentId })
    .populate('student', 'name email');
  res.status(200).json({ success: true, data: submissions });
});

export const gradeSubmission = asyncHandler(async (req, res) => {
  const { grade, feedback } = req.body;
  const submission = await AssignmentSubmission.findById(req.params.submissionId);
  if (!submission) { res.status(404); throw new Error('Submission not found'); }
  submission.grade = grade;
  submission.feedback = feedback;
  submission.status = 'Graded';
  const updatedSubmission = await submission.save();
  res.status(200).json({ success: true, data: updatedSubmission });
});

export const getAssignmentById = asyncHandler(async (req, res) => {
    // --- THIS IS THE FIX ---
    // We now populate the 'lesson' field to get access to the course ID.
    const assignment = await Assignment.findById(req.params.id).populate({
      path: 'lesson',
      select: 'course'
    });
    // --- END OF FIX ---
    if (!assignment) { res.status(404); throw new Error('Assignment not found'); }
    res.status(200).json({ success: true, data: assignment });
});

export const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId, submissionContent, submissionFileUrl } = req.body;
  const studentId = req.user.id;
  const existingSubmission = await AssignmentSubmission.findOne({ assignment: assignmentId, student: studentId });
  if (existingSubmission) {
    res.status(400); throw new Error('You have already submitted this assignment');
  }
  const submission = await AssignmentSubmission.create({
    assignment: assignmentId, student: studentId, submissionContent, submissionFileUrl
  });
  res.status(201).json({ success: true, data: submission });
});

export const getMySubmission = asyncHandler(async (req, res) => {
  const submission = await AssignmentSubmission.findOne({
    assignment: req.params.assignmentId,
    student: req.user.id
  });
  if (!submission) {
    return res.status(200).json({ success: true, data: null });
  }
  res.status(200).json({ success: true, data: submission });
});