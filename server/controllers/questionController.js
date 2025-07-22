import asyncHandler from 'express-async-handler';
import Question from '../models/Question.js';
import Quiz from '../models/Quiz.js';

// @desc    Add a question to a quiz
// @route   POST /api/questions
export const addQuestion = asyncHandler(async (req, res) => {
  const { quizId, text, options } = req.body;
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  const question = await Question.create({ quiz: quizId, text, options });
  res.status(201).json({ success: true, data: question });
});

// @desc    Update a questio
// @route   PUT /api/questions/:id
export const updateQuestion = asyncHandler(async (req, res) => {
  let question = await Question.findById(req.params.id);
  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }
  question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: question });
});

// @desc   Delete a question
// @route   DELETE /api/questions/:id
export const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }
  await question.deleteOne();
  res.status(200).json({ success: true, data: {} });
});