import asyncHandler from 'express-async-handler';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import Lesson from '../models/Lesson.js';
import QuizAttempt from '../models/QuizAttempt.js';

// --- THIS IS THE FIX ---
// This function will now return a success response even if no quiz is found.
export const getQuizForLesson = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ lesson: req.params.lessonId })
    .populate({ path: 'questions', select: '-options.isCorrect' })
    .populate({ path: 'lesson', select: 'course' });
  
  if (quiz) {
    res.status(200).json({ success: true, data: quiz });
  } else {
    // Instead of a 404 error, send a 200 with null data.
    res.status(200).json({ success: true, data: null });
  }
});
// --- END OF FIX ---

export const getQuizByIdForInstructor = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('questions');
  if (!quiz) { res.status(404); throw new Error('Quiz not found'); }
  res.status(200).json({ success: true, data: quiz });
});

export const createQuiz = asyncHandler(async (req, res) => {
  const { lessonId, title, description } = req.body;
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) { res.status(404); throw new Error('Lesson not found'); }
  const quiz = await Quiz.create({ lesson: lessonId, title, description });
  res.status(201).json({ success: true, data: quiz });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const { quizId, answers } = req.body;
  const studentId = req.user.id;
  
  const quiz = await Quiz.findById(quizId).populate('questions');
  if (!quiz) { res.status(404); throw new Error('Quiz not found'); }

  let score = 0;
  const detailedAnswers = [];
  for (const question of quiz.questions) {
    const studentAnswer = answers.find(a => a.questionId === question._id.toString());
    if (studentAnswer) {
      const selectedOption = question.options[studentAnswer.selectedOption];
      const isCorrect = selectedOption ? selectedOption.isCorrect : false;
      if (isCorrect) score++;
      detailedAnswers.push({ questionId: question._id, selectedOption: studentAnswer.selectedOption, isCorrect });
    }
  }
  const attempt = await QuizAttempt.create({
    quiz: quizId,
    student: studentId,
    answers: detailedAnswers,
    score,
    totalQuestions: quiz.questions.length
  });
  res.status(201).json({ success: true, data: attempt });
});

export const getQuizAttemptById = asyncHandler(async (req, res) => {
  const attempt = await QuizAttempt.findById(req.params.attemptId)
    .populate({ 
      path: 'quiz', 
      select: 'title lesson',
      populate: {
        path: 'lesson',
        select: 'course'
      }
    });
  
  if (!attempt) { res.status(404); throw new Error('Quiz attempt not found'); }
  if (attempt.student.toString() !== req.user.id) {
    res.status(401); throw new Error('Not authorized to view this attempt');
  }
  res.status(200).json({ success: true, data: attempt });
});