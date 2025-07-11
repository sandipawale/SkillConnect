import mongoose from 'mongoose';

const QuizAttemptSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
        required: true,
      },
      selectedOption: { // The index of the selected option
        type: Number,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      }
    }
  ],
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('QuizAttempt', QuizAttemptSchema);