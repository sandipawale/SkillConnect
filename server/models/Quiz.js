import mongoose from 'mongoose';

const QuizSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lesson',
    required: true,
    unique: true, // A lesson can only have one quiz
  },
  title: {
    type: String,
    required: [true, 'Please add a quiz title'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  // We will populate this field virtually from the Question model
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create a virtual property 'questions' that populates from the Question model
QuizSchema.virtual('questions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'quiz',
  justOne: false
});

export default mongoose.model('Quiz', QuizSchema);