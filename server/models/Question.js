import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  text: {
    type: String,
    required: [true, 'Please add question text'],
  },
  options: [
    {
      text: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
  // You could add question types here later (e.g., 'multiple-choice', 'true-false')
}, {
  timestamps: true,
});

export default mongoose.model('Question', QuestionSchema);